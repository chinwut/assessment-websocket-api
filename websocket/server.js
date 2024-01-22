const WebSocket = require('ws');

const connectionHandler = require('./handlers/connectionHandler');
const messageHandler = require('./handlers/messageHandler');
const closeHandler = require('./handlers/closeHandler');

const broadcaster = require('./functions/broadcaster');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    connectionHandler(ws);

    ws.on('message', (message) => {
        messageHandler(ws, message);
        broadcaster(wss, `Broadcast: ${message}`);
    });

    ws.on('close', (code, reason) => {
        closeHandler(ws, code, reason);
    });
});

console.log('WebSocket server running on port 8080');