import mongoose from 'mongoose';

interface IIoParameterValues extends mongoose.Document{
    name: string,
    caption: string,
    value: string
}


const ioParameterValuesSchema = new mongoose.Schema<IIoParameterValues>({
    name: String,
    caption: String,
    value: String
}, { _id: false });


interface IIoParameter extends mongoose.Document{
    insertDate: {type: Date, required: true},
    modifyDate: {type: Date, required: true},
    ioParameterId: { type: string,required: true},
    caption: {type: string,required: true},
    key: {type: string,required: true},
    unit: {type: string,required: false},
    icon: {type: string,required: false},
    valueTypes: IIoParameterValues[],
}

const ioParameterSchema = new mongoose.Schema<IIoParameter>({
    insertDate: { type: Date,default: Date.now},
    modifyDate: {type: Date,default: Date.now},
    ioParameterId: {type: String, required: true, index: true},
    caption: { type: String},
    key: String,
    unit: String,
    icon: String,
    valueTypes: [ioParameterValuesSchema],
});


ioParameterSchema.index({ ioParameterId: 1 });
ioParameterSchema.index({ key: 1 });

const IoParameterModel = mongoose.model('IoParameter', ioParameterSchema, 'IoParameter');

const createIndexes = async () => {
    try {
        await IoParameterModel.createIndexes();
        console.log('Indexes IoParameterModel created successfully');
    } catch (err) {
        console.error('Error IoParameterModel creating indexes:', err);
    }
};

createIndexes();

export default IoParameterModel;