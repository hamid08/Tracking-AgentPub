import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TrackerModelSchema = new Schema({
    insertDate: {
        type: Date,
        default: Date.now
    },
    modifyDate: {
        type: Date,
        default: Date.now
    },
    modelId: {
        type: String,
        required: true,
        index: true
    },
    brandId: {
        type: String,
        required: true,
        index: true
    },
    caption: {
        type: String
    }
});


TrackerModelSchema.index({ modelId: 1});
TrackerModelSchema.index({ brandId: 1});

const TrackerModelModel = mongoose.model('TrackerModel', TrackerModelSchema, 'TrackerModel');

const createIndexes = async () => {
    try {
        await TrackerModelModel.createIndexes();
        console.log('Indexes TrackerModelModel created successfully');
    } catch (err) {
        console.error('Error TrackerModelModel creating indexes:', err);
    }
};

createIndexes();

export default TrackerModelModel;