import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import https from 'https';
import http from 'http';

import fs from 'fs';


import config from './config/config';
import expressConfig from './frameworks/webserver/express';
import routes from './frameworks/webserver/routes/index';
import serverConfig from './frameworks/webserver/server';
import mongoDbConnection from './frameworks/database/mongoDB/connection';
import redisConnection from './frameworks/database/redis/connection';
import mqConnection from './frameworks/services/rabbitMQ/connection';
import socketConnection from './frameworks/services/socket/connection';
 

// middlewares
import errorHandlingMiddleware from './frameworks/webserver/middlewares/errorHandlingMiddleware';

const privateKey = fs.readFileSync('./src/config/ssl/key.pem', 'utf8');
const certificate = fs.readFileSync('./src/config/ssl/cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});
const httpsServer = https.createServer(credentials, app);


// express.js configuration (middlewares etc.)
expressConfig(app);

// server configuration and start
serverConfig(app, mongoose, httpsServer, config).startServer();


// DB configuration and connection create
mongoDbConnection(mongoose, config, {
  autoIndex: false,
  maxPoolSize: 50,
  wtimeoutMS: 2500,
  connectTimeoutMS: 360000,
  socketTimeoutMS: 360000,
}).connectToMongo();

app.use('/', (req,res)=>{
  res.send("hi")
})

const runApplication = async () => {
  await mqConnection.connect();
  await redisConnection;
  await socketConnection();

}

runApplication();


// error handling middleware
app.use(errorHandlingMiddleware);

// Expose app
export default app;