const { addClient, removeClient, getClients } = require('../../../../server/websocket/functions/clientsManager');

describe('ClientsManager', () => {
    let mockWs;

    beforeEach(() => {
        mockWs = { id: '1234' };
    });

    afterEach(() => {
        const clients = getClients();
        clients.clear();
    });

    describe('addClient', () => {
        it('should add a client to the clients map', () => {
            const data = { userName: 'user1' };
            addClient(mockWs, data);

            const clients = getClients();
            expect(clients.has(mockWs)).toBeTruthy();
            expect(clients.get(mockWs)).toEqual(data);
        });
    });

    describe('removeClient', () => {
        it('should remove a client from the clients map', () => {
            const data = { userName: 'user1' };
            addClient(mockWs, data);

            removeClient(mockWs);

            const clients = getClients();
            expect(clients.has(mockWs)).toBeFalsy();
        });
    });

    describe('getClients', () => {
        it('should return the clients map', () => {
            const data = { userName: 'user1' };
            addClient(mockWs, data);

            const clients = getClients();
            expect(clients).toBeInstanceOf(Map);
            expect(clients.size).toBe(1);
            expect(clients.get(mockWs)).toEqual(data);
        });
    });
});
