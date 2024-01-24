const { connectionHandler } = require('../../handlers/connectionHandler');
const { addClient, removeClient } = require('../../functions/clientsManager');
const { broadcastUserStatus } = require('../../functions/broadcaster');

jest.mock('../../functions/clientsManager', () => ({
  addClient: jest.fn(),
  removeClient: jest.fn()
}));

jest.mock('../../functions/broadcaster', () => ({
  broadcastUserStatus: jest.fn()
}));

describe('connectionHandler', () => {
  let mockWs;

  beforeEach(() => {
    mockWs = {
      on: jest.fn((event, callback) => {
        if (event === 'close') {
          callback(); // Simulates the 'close' event
        }
      })
    };
  });

  it('should add a client on connection', () => {
    connectionHandler(mockWs);

    expect(addClient).toHaveBeenCalledWith(mockWs, { userName: null, isAdmin: false });
  });

  it('should remove a client and broadcast user status on connection close', () => {
    connectionHandler(mockWs);

    // Simulate the 'close' event
    mockWs.on.mock.calls[0][1]();

    expect(removeClient).toHaveBeenCalledWith(mockWs);
    expect(broadcastUserStatus).toHaveBeenCalled();
  });

  // Add more test cases here if you have other specific scenarios to test
});
