
const { addClient, removeClient } = require('../functions/clientsManager');
const { broadcastUserStatus } = require('../functions/broadcaster');

function connectionHandler(ws) {
    addClient(ws, { userName: null, isAdmin: false });

    ws.on('close', () => {
        removeClient(ws);
        broadcastUserStatus();
    });
}

module.exports = { connectionHandler };