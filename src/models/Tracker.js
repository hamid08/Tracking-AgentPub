const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var _enum = require('../models/enums/enum');



const LocationMetaData = new Schema({
  Key: String,
  Value: String
}, { _id: false });


const TrackerMetaData = new Schema({
  VehicleId: { type: String, required: false },

  //نام ماشین آلات
  Name: { type: String, required: false },

  //شناسه ماشین آلات
  Identity: { type: String, required: false },

  //کسب وکار
  BusinessId: { type: String, required: false },

  //چارت بکارگیری
  OrgChartId: { type: String, required: false },

  //نوع مالکیت ماشین آلات
  OwnershipTypeId: { type: String, required: false },

  //وضعیت پلاک
  PlaqueStatus: {
    type: Number,
    required: false
  },

  //نوع پلاک
  PlaqueType: {
    type: Number,
    required: false
  },

  //شماره پلاک
  PlaqueNo: { type: String, required: false },

  //دسته بندی ماشین آلات
  VehicleCategoryId: { type: String, required: false },

  //کارخانه سازنده
  ManufacturingFactoryId: { type: String, required: false },

  //مدل ماشین آلات
  VehicleModelId: { type: String, required: false },


  //نوع کارکرد
  WorkType: {
    type: Number,
    required: false
  },


}, { _id: false });

const trackerDataSchema = new mongoose.Schema({
  InsertDate: { type: Date, default: Date.now() },
  ModifyDate: { type: Date, default: Date.now() },
  TrackerType: {
    type: Number,
    required: true,
    default: _enum.TrackerType.Vehicle
  },
  LocationModifyDate: { type: Date, required: false },
  Altitude: { type: Number, required: false },
  Angle: { type: Number, required: false },
  GsmSignal: { type: Number, required: false },
  HDOP: { type: Number, required: false },
  IMEI: { type: String, required: false },
  Latitude: { type: Number, required: false },
  Longitude: { type: Number, required: false },
  Odometer: { type: Number, required: false },
  PositionStatus: { type: Boolean, default: false, required: false },
  SatelliteCount: { type: Number, required: false },
  Speed: { type: Number, required: false },
  LastTrackingTime: { type: Date, required: false },
  TrackerLastConnectionTime: { type: Date, required: false },
  LocationMetaData: [LocationMetaData],
  TrackerMetaData: TrackerMetaData,
  ActiveStatus: {
    type: Number,
    required: false,
    default: _enum.ActiveStatus.Deactive
  },
});



trackerDataSchema.index({ IMEI: 1 }, { unique: true });

module.exports = { Tracker: mongoose.model('Trackers', trackerDataSchema, 'Trackers'), TrackerMetaData };