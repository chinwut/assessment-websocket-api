const clients = new Map();

function addClient(ws, data) {
    clients.set(ws, data);
}

function removeClient(ws) {
    clients.delete(ws);
}

function getClients() {
    return clients;
}

module.exports = { addClient, removeClient, getClients };