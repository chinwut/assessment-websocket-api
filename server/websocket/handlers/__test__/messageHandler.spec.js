const messageHandler = require("../../handlers/messageHandler");
const { getClients } = require("../../functions/clientsManager");
const {
  broadcastMessage,
  sendDirectMessage,
  broadcastUserStatus,
} = require("../../functions/broadcaster");
const logger = require('../../../logger');
jest.mock('../../../logger');
jest.mock("../../functions/clientsManager", () => ({
  getClients: jest.fn(),
}));

jest.mock("../../functions/broadcaster", () => ({
  broadcastMessage: jest.fn(),
  sendDirectMessage: jest.fn(),
  broadcastUserStatus: jest.fn(),
}));

describe("messageHandler", () => {
  let mockWs, fakeClients;

  beforeEach(() => {
    mockWs = {};
    fakeClients = new Map();
    getClients.mockReturnValue(fakeClients);
  });

  it("should handle join message type and update client data", () => {
    const message = JSON.stringify({ type: "join", userName: "user1" });
    fakeClients.set(mockWs, {});

    messageHandler(mockWs, message);

    const updatedClientData = fakeClients.get(mockWs);
    expect(updatedClientData.userName).toBe("user1");
    expect(updatedClientData.isAdmin).toBeFalsy();
    expect(broadcastUserStatus).toHaveBeenCalled();
  });

  it("should handle broadcast message type from admin user", () => {
    const message = JSON.stringify({
      type: "broadcast",
      message: "Hello everyone",
    });
    fakeClients.set(mockWs, { isAdmin: true });

    messageHandler(mockWs, message);

    expect(broadcastMessage).toHaveBeenCalledWith("Hello everyone", mockWs);
  });

  it("should handle direct message type", () => {
    const message = JSON.stringify({
      type: "direct",
      to: "user2",
      from: "user1",
      message: "Hello user2",
    });
    fakeClients.set(mockWs, { isAdmin: false });

    messageHandler(mockWs, message);

    expect(sendDirectMessage).toHaveBeenCalledWith(
      "user2",
      "Hello user2",
      "user1"
    );
  });
  it("should log an error when message handling fails due to invalid JSON", () => {
    const invalidMessage = "{ this is not valid JSON }";
    jest.spyOn(logger, "error"); 

    messageHandler(mockWs, invalidMessage);

    expect(logger.error).toHaveBeenCalledWith(
      "Error handling message:",
      expect.any(Error)
    );
  });
});
