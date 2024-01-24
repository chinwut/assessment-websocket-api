const closeHandler = require('../../handlers/closeHandler');
const logger = require('../../../logger');

jest.mock('../../../logger', () => ({
  info: jest.fn(),
}));

describe('closeHandler', () => {
  it('should log the correct message when a connection is closed', () => {
    const mockWs = {};
    const reason = 'Test reason';

    closeHandler(mockWs, reason);

    expect(logger.info).toHaveBeenCalledWith(`Connection closed. Reason: ${reason}`);
  });

});
