const trackingRoutes = require('./controllers/trackingController');
const trackerRoutes = require('./controllers/trackerController');



function RegisterAllRoutes(app) {

    app.use(trackingRoutes)
    app.use(trackerRoutes)

}

module.exports = {
    RegisterAllRoutes: RegisterAllRoutes
};






