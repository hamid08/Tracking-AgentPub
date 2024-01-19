const { Tracker } = require('../models/Tracker');
const createError = require('http-errors')
const redisClient = require('../helpers/init_redis')
const _generator = require('../common/utils/generator')
var _enum = require('../models/enums/enum');
const axios = require('axios');
const publishers = require('../rabbit/Publishers')


async function HandleReceiveData(data) {
    //Check Is Not Null Data
    if (data == null) return;
    if (!data.Imei) {
        console.log(`request from ${data.Imei} was fail: no imei`);
        throw createError.BadRequest(`شماره Imei معتبر نمی باشد`)
    }

    await UpsertTracker(data);
    await ResetTrackerOnRedis(data);
}


async function ResetTrackerOnRedis(tracker) {
    await redisClient.hSet(`Tracker_${tracker.Imei}`, "data", tracker.Imei);
    console.log(`store tracker in redis: ${tracker.Imei}`);
}

async function CheckExistIMEI(imei) {
    return await Tracker.findOne({ IMEI: imei });
}


async function GenerateIMEI() {

    var newIMEI = _generator.generateIMEI();
    while (await CheckExistIMEI(newIMEI) != null && await CheckExistIMEI(newIMEI) != undefined) {
        newIMEI = _generator.generateIMEI();
        console.log(`IMEI2 :  ${newIMEI}`);

    }
    return newIMEI;

}

async function UpsertTracker(tracker) {


    var filterByIMEI = {};
    if (tracker.TrackerType == _enum.TrackerType.Vehicle) {
        filterByIMEI = { 'TrackerMetaData.VehicleId': tracker.Vehicle.VehicleId };
    }
    else {
        filterByIMEI = { 'TrackerMetaData.UserId': tracker.User.UserId };
    }

    var trackerKey = tracker.TrackerType == _enum.TrackerType.Vehicle ? `Vehicle_${tracker.Vehicle.VehicleId}`
        : `User_${tracker.User.UserId}`;

    var trackerInDb = await Tracker.findOne(filterByIMEI).exec();

    var trackerMetaData = tracker.TrackerType == _enum.TrackerType.Vehicle ?
        {
            VehicleId: tracker.Vehicle.VehicleId,
            Identity: tracker.Vehicle.Identity,
            VehicleCategoryId: tracker.Vehicle.VehicleCategoryId,
            ManufacturingFactoryId: tracker.Vehicle.ManufacturingFactoryId,
            Name: tracker.Vehicle.Name,
            PlaqueNo: tracker.Vehicle.PlaqueNo,
            VehicleModelId: tracker.Vehicle.VehicleModelId,
            BusinessId: tracker.Vehicle.BusinessId,
            WorkType: tracker.Vehicle.WorkType,
            PlaqueStatus: tracker.Vehicle.PlaqueStatus,
            PlaqueType: tracker.Vehicle.PlaqueType
        }
        :
        {
            UserId: tracker.User.UserId,
            FullName: tracker.User.FullName
        };


    if (trackerInDb == null) {


        var newTracker = new Tracker({
            TrackerType: tracker.TrackerType,
            ActiveStatus: _enum.ActiveStatus.Deactive,
            TrackerMetaData: trackerMetaData

        });


        newTracker.save()
            .then(() => {
                console.log(`store new tracker in mongoDb: ${trackerKey}`)
            })
            .catch(err => {
                throw createError.BadRequest(`خطا در ثبت ردیاب`, err)

            });
    }
    else {


        Tracker.updateOne(filterByIMEI,
            {
                $set: {
                    ModifyDate: Date.now(),
                    TrackerMetaData: trackerMetaData,
                }
            }).exec().then(() => {
                console.log(`Tracker ${trackerKey} updated successfully`);
            }).catch((err) => {
                if (err) {
                    throw createError.BadRequest(`خطا در بروزرسانی دستگاه ردیاب`)
                }
            });

    }


}

async function SendDevicesToManagement(data) {

    await axios.post(`${process.env.TrackingManagementAddress}/ReceiveDevices`, data)
        .then(async response => {
            try {
                if (response.data.imeiList != null || response.data.imeiList != undefined || response.data.imeiList.length > 0)
                    await publishers.SendDevices(response.data);
            }
            catch (err) {

            }
        })
        .catch(error => {
            console.log(`error into Send Devices To Management`);
        });
}

async function SendSyncManagementDataRequest() {
    var data = { CustomerId: process.env.CustomerId };

    await axios.post(`${process.env.TrackingManagementAddress}/SyncManagementData`, data)
        .then(async response => {
            await publishers.SendManagementData(response.data);
        })
        .catch(error => {
            console.log(`error into Send SyncManagementDataRequest To Management`);
        });
}


module.exports = { HandleReceiveData, UpsertTracker, SendDevicesToManagement, SendSyncManagementDataRequest };