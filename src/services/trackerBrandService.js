const TrackerBrand = require('../models/TrackerBrand');
const createError = require('http-errors')



async function Upsert(object) {

    var filter = { BrandId: object.BrandId };

    var objectInDb = await TrackerBrand.findOne(filter).exec();


    if (objectInDb == null) {

        var newObject = new TrackerBrand({
            BrandId: object.BrandId,
            Caption: object.Caption,
            Name: object.Name,
        });


        newObject.save()
            .then(() => {
                console.log(`store new trackerBrand in mongoDb: ${object.BrandId}`)
            })
            .catch(err => {
                throw createError.BadRequest(`خطا در ثبت برند ردیاب`)

            });
    }
    else {

        TrackerBrand.updateOne(filter,
            {
                $set: {
                    ModifyDate: Date.now(),
                    Caption: object.Caption,
                    Name: object.Name,
                }
            }).exec().then(() => {
                console.log(`trackerBrand ${object.BrandId} updated successfully`);
            }).catch((err) => {
                if (err) {
                    throw createError.BadRequest(`خطا در بروزرسانی برند ردیاب`)
                }
            });

    }

}

module.exports = { Upsert };