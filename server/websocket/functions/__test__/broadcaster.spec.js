const { broadcastMessage, sendDirectMessage, broadcastUserStatus } = require('../../../../server/websocket/functions/broadcaster');
const { getClients } = require('../../../../server/websocket/functions/clientsManager');

jest.mock('../../../../server/websocket/functions/clientsManager', () => ({
  getClients: jest.fn()
}));

describe('Broadcaster', () => {
    let fakeClients;
    let mockWs;

    beforeEach(() => {
        fakeClients = new Map();
        getClients.mockReturnValue(fakeClients);
        mockWs = { readyState: 1, OPEN: 1, send: jest.fn() };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('broadcastMessage', () => {
        it('should broadcast a message to all connected clients', () => {
            const client1Ws = { ...mockWs, send: jest.fn() };
            const client2Ws = { ...mockWs, send: jest.fn() };
            fakeClients.set(client1Ws, { userName: 'client1' });
            fakeClients.set(client2Ws, { userName: 'client2' });

            broadcastMessage('test message');

            const expectedMessage = JSON.stringify({ type: 'broadcast', message: 'test message' });
            expect(client1Ws.send).toHaveBeenCalledWith(expectedMessage);
            expect(client2Ws.send).toHaveBeenCalledWith(expectedMessage);
        });
    });

    describe('sendDirectMessage', () => {
        it('should send a direct message to a specific user', () => {
            const targetUserName = 'receiver';
            const fromUserName = 'sender';
            const receiverWs = { ...mockWs, send: jest.fn() };
            fakeClients.set(receiverWs, { userName: targetUserName });

            sendDirectMessage(targetUserName, 'hello', fromUserName);

            expect(receiverWs.send).toHaveBeenCalledTimes(1);
            expect(receiverWs.send).toHaveBeenCalledWith(JSON.stringify({ type: 'direct', from: fromUserName, message: 'hello' }));
        });
    });

    describe('broadcastUserStatus', () => {
        it('should broadcast user status to all clients', () => {
            const user1Ws = { ...mockWs, send: jest.fn() };
            const user2Ws = { ...mockWs, send: jest.fn() };
            fakeClients.set(user1Ws, { userName: 'user1' });
            fakeClients.set(user2Ws, { userName: 'user2' });

            broadcastUserStatus();

            expect(user1Ws.send).toHaveBeenCalledTimes(1);
            expect(user2Ws.send).toHaveBeenCalledTimes(1);
            const expectedMessage = JSON.stringify({ type: 'status', onlineUsers: ['user1', 'user2'] });
            expect(user1Ws.send).toHaveBeenCalledWith(expectedMessage);
            expect(user2Ws.send).toHaveBeenCalledWith(expectedMessage);
        });
    });
});
