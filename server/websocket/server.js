const WebSocket = require('ws');
const { connectionHandler } = require('./handlers/connectionHandler');
const messageHandler = require('./handlers/messageHandler');
const closeHandler = require('./handlers/closeHandler');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    ws.on('error', error => {
        console.error('WebSocket error:', error);
    });

    connectionHandler(ws);

    ws.on('message', (message) => {
        messageHandler(ws, message);
    });

    ws.on('close', (reason) => {
        closeHandler(ws, reason);
    });
});

console.log('WebSocket server running on port 8080');
