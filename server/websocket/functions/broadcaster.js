const { getClients } = require('./clientsManager');
const logger = require('../../logger');

function broadcastMessage(message, senderWs) {
    const clients = getClients();

    logger.info(`Broadcasting message: ${message}`);
    clients.forEach((data, clientWs) => {
        if (clientWs !== senderWs && clientWs.readyState === clientWs.OPEN) {
            clientWs.send(JSON.stringify({ type: 'broadcast', message }));
        }
    });
}

function sendDirectMessage(targetUserName, message, fromUserName) {
    const clients = getClients();
    logger.info(`Sending direct message to ${targetUserName}: ${message}`);
    for (let [ws, data] of clients) {
        if (data.userName === targetUserName && ws.readyState === ws.OPEN) {
            logger.info(`Direct message sent to ${targetUserName}`);
            ws.send(JSON.stringify({ type: 'direct', from: fromUserName, message }));
            break;
        }
    }
}

function broadcastUserStatus() {
    const clients = getClients();
    const onlineUsers = Array.from(clients.values()).map(data => data.userName).filter(name => name);
    clients.forEach((data, clientWs) => {
        if (clientWs.readyState === clientWs.OPEN) {
            clientWs.send(JSON.stringify({ type: 'status', onlineUsers }));
        }
    });
}

module.exports = { broadcastMessage, sendDirectMessage, broadcastUserStatus };
