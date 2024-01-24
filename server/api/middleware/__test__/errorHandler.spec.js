const errorHandler = require('../errorHandler');
const logger = require('../../../logger');

jest.mock('../../../logger');

describe('Error Handler Middleware', () => {
    const mockRequest = () => {};
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };
    const nextFunction = jest.fn();

    it('should log the error and send a 500 response', () => {
        const req = mockRequest();
        const res = mockResponse();
        const error = new Error('Test error');

        errorHandler(error, req, res, nextFunction);

        expect(logger.error).toHaveBeenCalledWith(error.message);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                message: error.message,
                status: 500,
                timestamp: expect.any(String)
            }
        });
    });

});
