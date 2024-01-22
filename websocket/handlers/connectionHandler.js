module.exports = function connectionHandler(ws) {
  console.log("connected");
  
  ws.on("message", (message) => {
    console.log("Received message:", message);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
};
