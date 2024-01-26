import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MetaDataSchema = new Schema({
    key: String,
    value: String
}, { _id: false });

const TrackingDataSchema = new Schema({
    insertDate: {
        type: Date,
        default: Date.now
    },
    trafficDate: {
        type: Date,
        required: true,
        index: true
    },
    imei: {
        type: String,
        required: true,
        index: true
    },
    positionStatus: {
        type: Boolean,
        default: false
    },
    altitude: Number,
    angle: Number,
    latitude: Number,
    longitude: Number,
    satelliteCount: Number,
    speed: Number,
    hdop: {
        type: Number,
        required: false
    },
    gsmSignal: {
        type: Number,
        required: false
    },
    odometer: {
        type: Number,
        required: false
    },
    metaData: [MetaDataSchema],
});


TrackingDataSchema.index({ trafficDate: 1, imei: 1 });

const TrackingDataModel = mongoose.model('TrackingData', TrackingDataSchema, 'TrackingData');

const createIndexes = async () => {
    try {
        await TrackingDataModel.createIndexes();
        console.log('Indexes TrackingDataModel created successfully');
    } catch (err) {
        console.error('Error TrackingDataModel creating indexes:', err);
    }
};

createIndexes();

export default TrackingDataModel;