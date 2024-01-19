const trackingService = require('../services/trackingService');
const io = require('socket.io-client');


var token = process.env.Token;

//#region Config Socket Client And Authentication

const socket = io(process.env.TrackingHandlerAddress, {
    auth: { token },
    query: { 'customerId': process.env.CustomerId },
    serveClient: true,
    pingInterval: 60000,
    pingTimeout: 60000000,
    reconnection: true,
    reconnectionDelay: 100,
    reconnectionAttempts: 1000,
    cors: {
        origin: "http://12.0.0.3:8485",
        methods: ["GET", "POST"],
        credentials: true,
    },
    transports: [
        "websocket",
        "polling"
    ]
});


socket.on('connect', () => {
    console.log('Socket Connected!');
});

socket.on('reconnect_attempt', () => {
    console.log('Socket Reconnecting...');
});

socket.on('connect_error', (error) => {
    console.log('Socket Error connecting...');
});

socket.on('disconnect', (reason) => {
    console.log('Socket Disconnected!');
});


socket.on('authenticated', () => {
    console.log('Socket Authenticated!');
});


socket.on('unauthorized', (error) => {
    console.log('Socket Unauthorized!');
});

//#endregion


//#region Events

socket.on('receiveTrackingData', async (data) => {
    var response = await trackingService.HandleDeviceReceiveData(data);
    socket.emit('trackingResponse', response)
});



//#endregion
