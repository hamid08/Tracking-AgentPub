const rabbit = require('./RabbitMQ')
const moment = require('moment');


function PublishLog(logName) {
    var dateFormat = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log(`[x] Publish To %s ${logName} ${dateFormat}`);
}

async function SendTrackingData(message) {
    const broker = await rabbit.getInstance()
    await broker.send(process.env.TRACKINGAGENT_TRACKINGDATA_QUEUE, Buffer.from(JSON.stringify(message)))
    PublishLog(process.env.TRACKINGAGENT_TRACKINGDATA_QUEUE);
}

async function SendDevices(message) {
    const broker = await rabbit.getInstance()
    await broker.send(process.env.TRACKINGAGENT_DEVICES_QUEUE, Buffer.from(JSON.stringify(message)))
    PublishLog(process.env.TRACKINGAGENT_DEVICES_QUEUE);

}

async function SendManagementData(message) {
    const broker = await rabbit.getInstance()
    await broker.send(process.env.TRACKINGAGENT_MANAGEMENTDATA_QUEUE, Buffer.from(JSON.stringify(message)))
    PublishLog(process.env.TRACKINGAGENT_MANAGEMENTDATA_QUEUE);

}


module.exports = { SendTrackingData, SendDevices, SendManagementData };