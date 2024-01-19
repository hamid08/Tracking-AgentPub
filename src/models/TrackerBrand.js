const mongoose = require('mongoose');

const trackerBrandsSchema = new mongoose.Schema({
  InsertDate: { type: Date, default: Date.now() },
  ModifyDate: { type: Date, default: Date.now() },
  BrandId: String,
  Caption: String,
  Name: String,
});

trackerBrandsSchema.index({ BrandId: 1 }, { unique: true });

module.exports = mongoose.model('TrackerBrands', trackerBrandsSchema, 'TrackerBrands');