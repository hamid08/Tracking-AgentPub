import client, { Connection, Channel, ConsumeMessage } from "amqplib";
import config from "../../../config/config";
import rabbitService from "../../../application/services/rabbitService";
import moment from 'moment';

class RabbitMQConnection {
  connection!: Connection;
  channel!: Channel;
  private connected: boolean = false;
  private reconnectInterval: number = 5000;

  async connect(): Promise<void> {
    if (this.connected && this.channel) return;
    else this.connected = true;

    while (true) {
      try {
        this.reconnectInterval = 5000;

        console.log(`⌛️ Connecting to Rabbit-MQ Server`);
        this.connection = await client.connect(config.rabbit.uri);

        console.log(`✅ Rabbit MQ Connection is ready`);
        this.channel = await this.connection.createChannel();

        console.log(`✅ Created RabbitMQ Channel successfully`);
        await this.startListeningToRequestSyncManagementDataMessages();
        await this.startListeningToSendDevicesMessages();

        this.connection.on('connect', () => {
          console.log(`✅ Rabbit MQ Connection is ready`);
        });

        this.connection.on('disconnect', () => {
          console.error(`Not connected to MQ Server, retrying in ${this.reconnectInterval}ms`);
          setTimeout(this.connect.bind(this), this.reconnectInterval);
        });

        this.connection.on('error', (err: any) => {
          console.error(`Rabbit MQ Connection error: ${err}`);
        });

        this.connection.on('close', () => {
          console.error(`Rabbit MQ Connection closed`);
        });

        this.channel.on('close', () => {
          console.error(`Rabbit MQ Channel closed`);
          // Handle channel closure here
          // You can reconnect or perform other recovery actions
          this.connect();
        });


        this.channel.on('error', (err: any) => {
          console.error(`Rabbit MQ Channel error: ${err}`);
        });

        break;

      } catch (error) {
        console.error(`Failed to connect to Rabbit MQ: ${error}`);
        await new Promise((resolve) => setTimeout(resolve, this.reconnectInterval));
      }
    }
  }


  async startListeningToRequestSyncManagementDataMessages(): Promise<void> {
    try {
      await this.channel.assertQueue(config.rabbit.tracking_service_syncManagementRequest, {
        durable: true,
        arguments: {
          'x-queue-type': 'quorum'
        }
      });

      this.channel.consume(
        config.rabbit.tracking_service_syncManagementRequest,
        async (msg: ConsumeMessage | null) => {
          if (!msg) {
            return console.error(`Invalid incoming sync_management_request message`);
          }

          try {
            const result: any = await rabbitService().getManagementData();

            if (result != null || result != undefined)
              await this.sendToQueue(config.rabbit.tracking_agent_mangementData, result)
            this.channel.ack(msg);

          } catch (error) {
            console.error(`Error while processing sync_management_request message: ${error}`);
            this.channel.ack(msg);
          }
        },
        {
          noAck: false,
        }
      );
    } catch (error) {
      console.error(`Failed to start listening to sync_management_request messages: ${error}`);
    }
  }

  async startListeningToSendDevicesMessages(): Promise<void> {
    try {
      await this.channel.assertQueue(config.rabbit.trackng_service_sendDevices, {
        durable: true,
        arguments: {
          'x-queue-type': 'quorum'
        }
      });

      this.channel.consume(
        config.rabbit.trackng_service_sendDevices,
        async (msg: ConsumeMessage | null) => {
          if (!msg) {
            return console.error(`Invalid incoming trackng_service_sendDevices message`);
          }

          try {
            const parsedMessage = JSON.parse(msg?.content?.toString());
            const result: any = await rabbitService().getModifierDevices(parsedMessage);

            if (result != null || result != undefined)
              await this.sendToQueue(config.rabbit.tracking_agent_devices, result)
            this.channel.ack(msg);

          } catch (error) {
            console.error(`Error while processing trackng_service_sendDevices message: ${error}`);
            this.channel.ack(msg);
          }
        },
        {
          noAck: false,
        }
      );
    } catch (error) {
      console.error(`Failed to start listening to sync_management_request messages: ${error}`);
    }
  }



  async sendToQueue(queue: string, message: any): Promise<void> {
    try {
      if (!this.channel) {
        await this.connect();
      }

      await this.channel.assertQueue(queue, {
        durable: true,
        arguments: {
          'x-queue-type': 'quorum'
        }
      });

      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
      const dateFormat = moment().format('YYYY-MM-DD HH:mm:ss');
      console.log(`[x] Publish To %s ${queue} ${dateFormat}`);
    } catch (error) {
      console.error(`Failed to send message to queue: ${error}`);
      throw error;
    }
  }

}

const mqConnection = new RabbitMQConnection();

export default mqConnection;