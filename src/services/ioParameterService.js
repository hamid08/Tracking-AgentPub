const IoParameter = require('../models/IoParameter');
const createError = require('http-errors')



async function Upsert(object) {

    var filter = { IoParameterId: object.IoParameterId };

    var objectInDb = await IoParameter.findOne(filter).exec();


    if (objectInDb == null) {

        var newObject = new IoParameter({
            IoParameterId: object.IoParameterId,
            Caption: object.Caption,
            Key: object.Key,
            Unit: object.Unit,
            Icon: object.Icon,
            ValueTypes:object.ValueTypes
        });


        newObject.save()
            .then(() => {
                console.log(`store new ioParameter in mongoDb: ${object.IoParameterId}`)
            })
            .catch(err => {
                throw createError.BadRequest(`خطا در ثبت IoParameter `)

            });
    }
    else {

        IoParameter.updateOne(filter,
            {
                $set: {
                    ModifyDate: Date.now(),
                    Caption: object.Caption,
                    Key: object.Key,
                    Unit: object.Unit,
                    Icon: object.Icon,
                    ValueTypes:object.ValueTypes
                }
            }).exec().then(() => {
                console.log(`ioParameter ${object.IoParameterId} updated successfully`);
            }).catch((err) => {
                if (err) {
                    throw createError.BadRequest(`خطا در بروزرسانی IoParameter`)
                }
            });

    }

}

module.exports = { Upsert };