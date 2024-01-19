const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ioParameterValues = new Schema({
  Name: String,
  Caption: String,
  Value: String
}, { _id : false });

const ioParametersSchema = new mongoose.Schema({
  InsertDate: { type: Date, default: Date.now() },
  ModifyDate: { type: Date, default: Date.now() },
  IoParameterId: String,
  Caption: String,
  Key: String,
  Unit: String,
  Icon: String,
  ValueTypes: [ioParameterValues],

});


ioParametersSchema.index({ IoParameterId: 1 }, { unique: true });

module.exports = mongoose.model('IoParameters', ioParametersSchema, 'IoParameters');