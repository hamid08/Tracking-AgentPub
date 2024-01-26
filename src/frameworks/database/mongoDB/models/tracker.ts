import mongoose from 'mongoose';


enum ActiveStatus {
    Active = 1,
    Deactive = 2
}

enum PlaqueStatus {
    HasPlaque = 0,
    NoPlaque = 1
};

enum PlaqueType {
    //شخصی
    Personal = 0,

    //قدیم
    Old = 1,

    //تاکسی
    Taxi = 2,

    //کشاورزی
    Agriculture = 3,

    //دولتی
    Governmental = 4,

    //پلیس
    Police = 5,

    //حمل و نقل عمومی
    Transportation = 6,

    //گذر موقت
    Temporary = 7,

    //موتور
    Motor = 8,

    //تاریخی
    Historical = 9,

    //تشریفات
    Formality = 10,

    //سیاسی
    Political = 11,

    //معلولین
    DisabledPeople = 12,

    //منطقه آزاد"
    FreeZone = 13,

    //تاکسی برون شهری
    SuburbanTaxi = 14,
};

enum WorkType {
    //کیلومتری
    TravelledDistance = 1,

    //ساعتی
    WorkingHours = 2
};

enum TrackerType {
    Vehicle = 1,
    Human = 2
};



interface ILocationMetaData extends mongoose.Document {
    key: string,
    value: string
}

const locationMetaDataSchema = new mongoose.Schema<ILocationMetaData>({
    key: { type: String, required: false },
    value: { type: String, required: false },
}, { _id: false });


interface ITrackerMetaData extends mongoose.Document {
    vehicleId: { type: string, required: false },

    //نام ماشین آلات
    name: { type: string, required: false },

    //شناسه ماشین آلات
    identity: { type: string, required: false },

    //کسب وکار
    businessId: { type: string, required: false },

    //چارت بکارگیری
    orgChartId: { type: string, required: false },

    //نوع مالکیت ماشین آلات
    ownershipTypeId: { type: string, required: false },

    //وضعیت پلاک
    plaqueStatus: { type: Number, enum: PlaqueStatus, required: false },

    //نوع پلاک
    plaqueType: { type: Number, enum: PlaqueType, required: false },


    //شماره پلاک
    plaqueNo: { type: string, required: false },

    //دسته بندی ماشین آلات
    vehicleCategoryId: { type: string, required: false },

    //کارخانه سازنده
    manufacturingFactoryId: { type: string, required: false },

    //مدل ماشین آلات
    vehicleModelId: { type: string, required: false },


    //نوع کارکرد
    workType: { type: Number, enum: WorkType, required: false },
}


const trackerMetaDataSchema = new mongoose.Schema<ITrackerMetaData>({
    vehicleId: { type: String, required: false },

    //نام ماشین آلات
    name: { type: String, required: false },

    //شناسه ماشین آلات
    identity: { type: String, required: false },

    //کسب وکار
    businessId: { type: String, required: false },

    //چارت بکارگیری
    orgChartId: { type: String, required: false },

    //نوع مالکیت ماشین آلات
    ownershipTypeId: { type: String, required: false },

    //وضعیت پلاک
    plaqueStatus: { type: Number, enum: PlaqueStatus, required: false },

    //نوع پلاک
    plaqueType: { type: Number, enum: PlaqueType, required: false },


    //شماره پلاک
    plaqueNo: { type: String, required: false },

    //دسته بندی ماشین آلات
    vehicleCategoryId: { type: String, required: false },

    //کارخانه سازنده
    manufacturingFactoryId: { type: String, required: false },

    //مدل ماشین آلات
    vehicleModelId: { type: String, required: false },


    //نوع کارکرد
    workType: { type: Number, enum: WorkType, required: false },

}, { _id: false });

interface ITracker extends mongoose.Document {

    insertDate: { type: Date, required: false },
    modifyDate: { type: Date, required: false },
    trackerType: { type: Number, enum: TrackerType, required: true },
    locationModifyDate: { type: Date, required: false },
    altitude: { type: Number, required: false },
    angle: { type: Number, required: false },
    gsmSignal: { type: Number, required: false },
    hdop: { type: Number, required: false },
    imei: { type: String, required: false },
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
    odometer: { type: Number, required: false },
    positionStatus: { type: Boolean, default: false, required: false },
    satelliteCount: { type: Number, required: false },
    speed: { type: Number, required: false },
    lastTrackingTime: { type: Date, required: false },
    trackerLastConnectionTime: { type: Date, required: false },
    locationMetaData: {type:ILocationMetaData[],required: false },
    trackerMetaData: {type:ITrackerMetaData[],required: false},
    activeStatus: { type: Number, enum: ActiveStatus, required: true },
}


const trackerSchema =  new mongoose.Schema<ITracker>({
    insertDate: { type: Date, required: false },
    modifyDate: { type: Date, required: false },
    trackerType: { type: Number, enum: TrackerType, required: true },
    locationModifyDate: { type: Date, required: false },
    altitude: { type: Number, required: false },
    angle: { type: Number, required: false },
    gsmSignal: { type: Number, required: false },
    hdop: { type: Number, required: false },
    imei: { type: String, required: false },
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
    odometer: { type: Number, required: false },
    positionStatus: { type: Boolean, default: false, required: false },
    satelliteCount: { type: Number, required: false },
    speed: { type: Number, required: false },
    lastTrackingTime: { type: Date, required: false },
    trackerLastConnectionTime: { type: Date, required: false },
    locationMetaData: {type:[locationMetaDataSchema],required: false },
    trackerMetaData: {type:[trackerMetaDataSchema],required: false},
    activeStatus: { type: Number, enum: ActiveStatus, required: true },
});


trackerSchema.index({ imei: 1 });

const TrackerModel = mongoose.model('Tracker', trackerSchema, 'Tracker');

const createIndexes = async () => {
    try {
        await TrackerModel.createIndexes();
        console.log('Indexes TrackerModel created successfully');
    } catch (err) {
        console.error('Error TrackerModel creating indexes:', err);
    }
};

createIndexes();

export default TrackerModel;