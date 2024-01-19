var Enum = require('enum');


var ActiveStatus = new Enum({
    Active: 1,
    Deactive: 2
});

var TrackerType = new Enum({
    Vehicle: 1,
    User: 2
});

var PlaqueStatus = new Enum({
    'HasPlaque': 0,
    'NoPlaque': 1
});

var PlaqueType = new Enum({
    //شخصی
    Personal: 0,

    //قدیم
    Old: 1,

    //تاکسی
    Taxi: 2,

    //کشاورزی
    Agriculture: 3,

    //دولتی
    Governmental: 4,

    //پلیس
    Police: 5,

    //حمل و نقل عمومی
    Transportation: 6,

    //گذر موقت
    Temporary: 7,

    //موتور
    Motor: 8,

    //تاریخی
    Historical: 9,

    //تشریفات
    Formality: 10,

    //سیاسی
    Political: 11,

    //معلولین
    DisabledPeople: 12,

    //منطقه آزاد"
    FreeZone: 13,

    //تاکسی برون شهری
    SuburbanTaxi: 14,
});

var WorkType = new Enum({

    //کیلومتری
    TravelledDistance: 1,

    //ساعتی
    WorkingHours: 2
});

module.exports = { TrackerType, PlaqueStatus, PlaqueType, WorkType,ActiveStatus }