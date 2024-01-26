import io from "socket.io-client";
import config from '../../../config/config';
import socketServcie from '../../../application/services/socketService';

export default function connection() {

    const socket = io(config.socket.uri, {
        auth: { token: config.socket.auth_token },
        query: { 'customerId': config.common.customerId },
        reconnection: true,
        reconnectionDelay: 500,
        reconnectionAttempts: 10,
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


    // Receive Tracking Data
    socket.on('receiveTrackingData', async (data) => {
        var response = await socketServcie().handelTrackingData(data);
        socket.emit('trackingResponse', response)
    }); 
}

