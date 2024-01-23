const { getClients } = require('./clientsManager');

function broadcastMessage(message, senderWs) {
    const clients = getClients();

    console.log(`Broadcasting message: ${message}`);
    clients.forEach((data, clientWs) => {
        if (clientWs !== senderWs && clientWs.readyState === clientWs.OPEN) {
            clientWs.send(JSON.stringify({ type: 'broadcast', message }));
        }
    });
}

function sendDirectMessage(targetUserName, message, fromUserName) {
    const clients = getClients();
    console.log(`Sending direct message to ${targetUserName}: ${message}`);
    for (let [ws, data] of clients) {
        if (data.userName === targetUserName && ws.readyState === ws.OPEN) {
            console.log(`Direct message sent to ${targetUserName}`);
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
