const Tracking = require('../models/Tracking');
const { Tracker } = require('../models/Tracker');
const createError = require('http-errors')
var redisClient = require('../helpers/init_redis')
var moment = require('moment');
const axios = require('axios');
var _generator = require('../common/utils/generator')
const publishers = require('../rabbit/Publishers')



async function TransportTrackingDataToRabbitMQ(locations) {
  var acceptList = [];
  var rejectList = [];

  var customerTerminalNo = '';

  var trackingRequestData = [];

  locations.forEach((element) => {
    customerTerminalNo = element.CustomerTerminalNo;

    trackingRequestData.push({
      Id: _generator.generateObjectId(),
      IMEI: element.IMEI,
      TerminalNo: element.DeviceTerminalNo,
      IdentifyNo: element.DeviceIdentity,
      TrakingData: [
        {
          IMEI: element.IMEI,
          Time: element.TrafficDate,
          Milliseconds: null,
          Latitude: element.Latitude,
          Longitude: element.Longitude,
          Altitude: element.Altitude,
          Speed: element.Speed,
          Angle: element.Angle,
          SatelliteCount: element.SatelliteCount,
          Priority: 0,
          TerminalNo: element.DeviceTerminalNo,
          IdentifyNo: element.DeviceIdentity,
          Metadata: element.MetaData
        }

      ]
    });


    acceptList.push(element.Code);
  });

  var webAPI_Tracking_Request = {
    TerminalNo: customerTerminalNo,
    Data: trackingRequestData
  }

  await publishers.SendTrackingData(webAPI_Tracking_Request);

  return { acceptList, rejectList };

}


async function GetAllTracking(page, itemsPerPage) {

  page = page == '' || page == null || page == undefined ? 1 : page;
  itemsPerPage = itemsPerPage == '' || itemsPerPage == null || itemsPerPage == undefined ? 10 : itemsPerPage;

  var result = [];

  await axios.get(`${process.env.TrackingHandlerAddress}/api/tracking/get-all/${process.env.CustomerId}?page=${page}&itemsPerPage=${itemsPerPage}`)
    .then(response => {
      result.push(response.data.data)
    })
    .catch(error => {
    });

  return result;
}

async function HandleMobileReceiveData(data) {

  const { imei, Data } = data;

  //Check Is Not Null Locations
  if (Data == null || Data.length < 1) return;


  //CheckIMEI
  var trackerInfoRedis = await ExistIMEI(imei);
  if (trackerInfoRedis == null) {
    throw createError.Unauthorized(`داده های ارسالی معتبر نمی باشد`)
  }

  var locations = GenerateLocationsByMobileData(Data, imei);

  //Check Repeat Locations
  var validLocations = await GetValidLocationsByTrafficDate(locations);

  //Check OnlyTransporter

  if (process.env.ONLY_TRANSPORTER_APP == 'true') {
    await TransportTrackingDataToRabbitMQ(validLocations);
  }
  else {

    //SaveLocation
    await SaveAllLocations(validLocations);

    //Sort
    validLocations.sort((a, b) => new Date(b.TrafficDate) - new Date(a.TrafficDate));

    await UpdateTrackerLocation(validLocations[0]);

    //Move To RabbitMQ
    await TransportTrackingDataToRabbitMQ(validLocations);

  }

}

function GenerateLocationsByMobileData(data, imei) {

  var locations = [];

  data.forEach((element) => {

    var location = {
      TrafficDate: new Date(1000 * element.timeStamp),
      IMEI: imei,
      Latitude: element.lat,
      Longitude: element.long,
      Speed: element.speed,
      Altitude: element.altitude,
      SatelliteCount: element.sateliteCount,
      Angle: element.angle,
    };

    locations.push(location);
  })

  return locations;

}

async function GetTrackingByTrafficDate(trafficDate) {
  var trackingInDb = await Tracking.findOne({ TrafficDate: trafficDate }).exec();

  return trackingInDb;
}

async function GetValidLocationsByTrafficDate(locations) {
  let uniqueTrafficDate = [];
  let uniqueLocations = [];


  //Check In Memory
  locations.forEach(item => {
    if (!uniqueTrafficDate.includes(item.TrafficDate)) {
      uniqueTrafficDate.push(item.TrafficDate);
      uniqueLocations.push(item);
    }
  });

  if (uniqueLocations.length < 1) return uniqueLocations;

  //Check In MongoDb
  uniqueLocations.forEach(async item => {
    var trackingInDb = await GetTrackingByTrafficDate(item.TrafficDate);
    if (trackingInDb != null || trackingInDb != undefined) {
      uniqueLocations = uniqueLocations.filter(c => c !== item);
    }
  });
  return uniqueLocations;

}

async function HandleDeviceReceiveData(data) {

  //Check Is Not Null Locations
  if (data == null || data.locations.length < 1) return;

  //CheckIMEI
  var trackerInfoRedis = await ExistIMEI(data.latestLocation.imei);
  if (trackerInfoRedis == null) return;

  //Check Repeat Locations
  var validLocations = await GetValidLocationsByTrafficDate(data.locations);


  if (process.env.ONLY_TRANSPORTER_APP == 'true') {
    var savedResponse = await TransportTrackingDataToRabbitMQ(validLocations);
    return savedResponse;

  }
  else {
    var savedResponse = await SaveAllLocations(validLocations);

    await UpdateTrackerLocation(data.latestLocation);

    //Move To RabbitMQ
    await TransportTrackingDataToRabbitMQ(validLocations);
    return savedResponse;

  }

}

async function ExistIMEI(imei) {
  try {
    var objInRedis = await redisClient.hGetAll(`Tracker_${imei}`);
    var objParse = JSON.parse(objInRedis.data);
    return objParse
  } catch (err) {
    return null;
  }

}


async function SaveAllLocations(locations) {

  var acceptList = [];
  var rejectList = [];

  var imei = '';

  var listTrackingModel = [];
  locations.forEach((element) => {

    imei = element.IMEI;

    var model = new Tracking({
      InsertDate: Date.now(),
      TrafficDate: element.TrafficDate,
      IMEI: element.IMEI,
      Latitude: element.Latitude,
      Longitude: element.Longitude,
      Speed: element.Speed,
      Altitude: element.Altitude,
      PositionStatus: element.PositionStatus,
      Heading: element.Heading,
      SatelliteCount: element.Satellites,
      Angle: element.Angle,
      HDOP: element.HDOP,
      GsmSignal: element.GsmSignal,
      Odometer: element.Odometer,
      MetaData: element.MetaData
    });

    listTrackingModel.push(model);

    acceptList.push(element.Code);

  });


  var dateFormat = moment().format('YYYY-MM-DD HH:mm:ss');

  try {
    await Tracking.insertMany(listTrackingModel)
      .then(result => {
        console.log('Locations inserted:', result.length, ` IMEI: ${imei}`, ` Date: ${dateFormat}`);
      })
      .catch(err => {
        console.error('Error inserting locations:', err);
      })
      .finally(() => {
        console.error(`------------------------------------------------------------------------------`);
      });

  }
  catch (err) {
    rejectList = acceptList;
    acceptList = [];
  }
  return { acceptList, rejectList };
}

async function UpdateTrackerLocation(latestLocation) {

  var trackerFilter = await Tracker.aggregate([
    {
      $match: {
        "TrackingDevices": {
          $exists: true,
          $ne: []
        }
      }
    },
    {
      $match: {
        "TrackingDevices.IsDefault": true,
        "TrackingDevices.IMEI": `${latestLocation.imei}`
      }

    },
    {
      $project: {
        "_id": "$_id"
      }
    },
    {
      $limit: 1
    }
  ]).exec();

  if (!(trackerFilter.length > 0)) return;

  var filterByIMEI = { _id: trackerFilter[0]._id };

  var trackerInDb = await Tracker.findOne(filterByIMEI).exec();

  if (trackerInDb == null) return;

  var trafficDate = new Date(latestLocation.trafficDate);
  var locationModifyDate = new Date(trackerInDb.LocationModifyDate);

  if (trafficDate <= locationModifyDate) return;

  //Update Tracker
  Tracker.updateOne(filterByIMEI,
    {
      $set: {
        LocationModifyDate: trafficDate,
        Latitude: latestLocation.latitude,
        Longitude: latestLocation.longitude,
        Speed: latestLocation.speed,
        Altitude: latestLocation.altitude,
        PositionStatus: latestLocation.positionStatus,
        Heading: latestLocation.heading,
        SatelliteCount: latestLocation.satelliteCount,
        Angle: latestLocation.angle,
        HDOP: latestLocation.hdop,
        GsmSignal: latestLocation.gsmSignal,
        Odometer: latestLocation.odometer,
        LocationMetaData: latestLocation.metaData
      }
    }
  ).exec().then(() => {
    console.log(`Tracker ${trackerInDb._id} Location Updated Successfully`);
  }).catch((err) => {
    if (err) {
      console.log(`Tracker ${trackerInDb._id} Location Updated Failed`);
    }
  });
}


module.exports = { HandleDeviceReceiveData, HandleMobileReceiveData, GetAllTracking };
