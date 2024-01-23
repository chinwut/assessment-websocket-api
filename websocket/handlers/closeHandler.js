function closeHandler(ws, reason) {
  console.log(`Connection closed. Reason: ${reason}`);
}

module.exports = closeHandler;
