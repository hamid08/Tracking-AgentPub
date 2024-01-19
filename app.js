const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const createError = require('http-errors')
require('dotenv').config()
require('./src/helpers/init_mongodb')
const initApp = require('./src/helpers/init_app')
const routeManagement = require('./src/routeManagement');
const errorHandler = require("./src/middleware/errorHandler");
const app = express();
const server = require('http').createServer(app);
require("./src/helpers/socket-client");
require("./src/rabbit/Consumers");


//Init Required
initApp.InitAllAction();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
  extended: true
})); // for parsing application/x-www-form-urlencoded



// Routes
app.get("/", (req, res) => {
  res.send("Hello World! ");
});

routeManagement.RegisterAllRoutes(app);

app.use(async (req, res, next) => {
  next(createError.NotFound('صفحه مورد نظر یافت نشد!'))
})

//Erro Handler
app.use(errorHandler);



console.log(`------------------------> ** ONLY_TRANSPORTER_APP Is ${process.env.ONLY_TRANSPORTER_APP} **`)



// Start Server
const port = process.env.PORT || 3000;
server.listen(port, (err) => {

  if (err) throw new Error(err);

  console.log(`Server is running on port ${port}`);

});
