const mongoose = require('mongoose');

const trackerModelsSchema = new mongoose.Schema({
  InsertDate: { type: Date, default: Date.now() },
  ModifyDate: { type: Date, default: Date.now() },
  ModelId: String,
  Caption: String,
  BrandId: String,

});

trackerModelsSchema.index({ BrandId: 1 }, { unique: true });

module.exports = mongoose.model('TrackerModels', trackerModelsSchema, 'TrackerModels');