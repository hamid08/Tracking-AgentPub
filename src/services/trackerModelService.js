const TrackerModel = require('../models/TrackerModel');
const createError = require('http-errors')



async function Upsert(trackerModel) {

    var filter = { ModelId: trackerModel.ModelId };

    var objectInDb = await TrackerModel.findOne(filter).exec();


    if (objectInDb == null) {

        var newObject = new TrackerModel({
            ModelId: trackerModel.ModelId,
            Caption: trackerModel.Caption,
            BrandId: trackerModel.BrandId,
        });


        newObject.save()
            .then(() => {
                console.log(`store new trackerModel in mongoDb: ${trackerModel.ModelId}`)
            })
            .catch(err => {
                throw createError.BadRequest(`خطا در ثبت مدل ردیاب`)

            });
    }
    else {

        TrackerModel.updateOne(filter,
            {
                $set: {
                    ModifyDate: Date.now(),
                    Caption: trackerModel.Caption,
                    BrandId: trackerModel.BrandId,
                }
            }).exec().then(() => {
                console.log(`trackerModel ${trackerModel.ModelId} updated successfully`);
            }).catch((err) => {
                if (err) {
                    throw createError.BadRequest(`خطا در بروزرسانی مدل ردیاب`)
                }
            });

    }

}

module.exports = { Upsert };