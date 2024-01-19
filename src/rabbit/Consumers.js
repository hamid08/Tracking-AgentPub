const rabbit = require('./RabbitMQ')
const trackerService = require('../services/trackerService');




console.log('Ready for Consume messages in the %s queue...', process.env.TRACKINGSERVICE_DEVICES_QUEUE);
rabbit.getInstance()
    .then(broker => {
        broker.subscribe(process.env.TRACKINGSERVICE_DEVICES_QUEUE, async (msg, ack) => {
            await trackerService.SendDevicesToManagement(JSON.parse(msg.content.toString()));
            ack()
        })
    })



console.log('Ready for Consume messages in the %s queue...', process.env.TRACKINGSERVICE_MANAGEMENTDATAREQUEST_QUEUE);
rabbit.getInstance()
    .then(broker => {
        broker.subscribe(process.env.TRACKINGSERVICE_MANAGEMENTDATAREQUEST_QUEUE, async (msg, ack) => {
            await trackerService.SendSyncManagementDataRequest();
            ack()
        })
    })



