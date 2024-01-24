export const initializeChat = (userName, handleMessage, handleClose) => {
    const ws = new WebSocket(`ws://${import.meta.env.VITE_WEBSOCKET_URL}`);

    ws.onopen = () => {
        ws.send(JSON.stringify({ type: "join", userName }));
    };

    ws.onmessage = (event) => {
        handleMessage(event);
    };

    ws.onclose = () => {
        handleClose();
    };

    return ws;
};
