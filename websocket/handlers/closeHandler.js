module.exports = function closeHandler(ws, code, reason) {
  console.log(`Connection closed. Code: ${code}, Reason: ${reason}`);
};
