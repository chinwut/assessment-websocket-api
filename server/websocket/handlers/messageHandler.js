const { getClients } = require('../functions/clientsManager');
const { broadcastMessage, sendDirectMessage, broadcastUserStatus } = require('../functions/broadcaster');
const logger = require('../../logger');
function messageHandler(ws, message) {
    try {
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
    } catch (error) {
        logger.error('Error handling message:', error);
    }
}


module.exports = messageHandler;
