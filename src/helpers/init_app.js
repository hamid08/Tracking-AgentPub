const {Tracker} = require('../models/Tracker');
var redisClient = require('./init_redis')


function InitAllAction() {

  setVehiclesInRedis()
}


async function setVehiclesInRedis() {
  // var trackers = await Tracker.find({ "TrackingDevices": { "$exists": true, "$ne": [] } }).exec();

  var trackers = await Tracker.aggregate(
    [
      {
          $match: { "TrackingDevices": { "$exists": true, "$ne": [] } }
      },
      {
          $unwind: "$TrackingDevices"
      },
      {
          $project: { "IMEI": "$TrackingDevices.IMEI" }
      }
  ]

  ).exec();

  console.log(`found trackers hasDevice from mongodb: ${trackers.length}`);

  for await (element of trackers) {
    await redisClient.hSet(`Tracker_${element.IMEI}`, "data", element.IMEI);
  }
  console.log(`store trackers in redis: ${trackers.length}`);
}

module.exports = {
  InitAllAction: InitAllAction
};
