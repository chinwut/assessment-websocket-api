const { getClients } = require('../functions/clientsManager');
const { broadcastMessage, sendDirectMessage, broadcastUserStatus } = require('../functions/broadcaster');

function messageHandler(ws, message) {
    const data = JSON.parse(message);
    const clients = getClients();
    const clientData = clients.get(ws);

    if (data.type === 'join') {
        clientData.userName = data.userName;
        clientData.isAdmin = data.userName.toLowerCase() === 'admin';
        clients.set(ws, clientData);
        broadcastUserStatus();
    } else if (clientData.isAdmin && data.type === 'broadcast') {
        broadcastMessage(data.message, ws);
    } else if (data.type === 'direct') {
        sendDirectMessage(data.to, data.message, data.from);
    }
}

module.exports = messageHandler;
