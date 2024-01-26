import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TrackerBrandSchema = new Schema({
    insertDate: {
        type: Date,
        default: Date.now
    },
    modifyDate: {
        type: Date,
        default: Date.now
    },
    brandId: {
        type: String,
        required: true,
        index: true
    },
    caption: {
        type: String
    },
    name: {
        type: String
    }
});


TrackerBrandSchema.index({ brandId: 1});

const TrackerBrandModel = mongoose.model('TrackerBrand', TrackerBrandSchema, 'TrackerBrand');

const createIndexes = async () => {
    try {
        await TrackerBrandModel.createIndexes();
        console.log('Indexes TrackerBrandModel created successfully');
    } catch (err) {
        console.error('Error TrackerBrandModel creating indexes:', err);
    }
};

createIndexes();

export default TrackerBrandModel;