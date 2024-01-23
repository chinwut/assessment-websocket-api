import { useState, useEffect, useRef } from "react";
import "./App.css"; // Ensure you have the corresponding CSS file

function App() {
  const [conversations, setConversations] = useState({});
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isNameEntered, setIsNameEntered] = useState(false);
  
  const ws = useRef(null);

  useEffect(() => {
    if (isNameEntered) {
      ws.current = new WebSocket("ws://localhost:8080");
      ws.current.onopen = () => {
        ws.current.send(JSON.stringify({ type: "join", userName }));
      };
      ws.current.onmessage = (event) => {
        const receivedMessage = JSON.parse(event.data);

        if (receivedMessage.type === "direct") {
          const chatUser =
            receivedMessage.from === userName
              ? receivedMessage.to
              : receivedMessage.from;
          setConversations((prevConversations) => ({
            ...prevConversations,
            [chatUser]: [
              ...(prevConversations[chatUser] || []),
              receivedMessage,
            ],
          }));
        } else if (receivedMessage.type === "status") {
          setOnlineUsers(
            receivedMessage.onlineUsers.filter((user) => user !== userName)
          );
        }
      };

      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    }
  }, [isNameEntered, userName]);

  const sendMessage = () => {
    if (inputMessage !== "" && currentChatUser) {
      const message = {
        from: userName,
        to: currentChatUser,
        message: inputMessage,
        type: "direct",
      };
      ws.current.send(JSON.stringify(message));
      setConversations((prevConversations) => ({
        ...prevConversations,
        [currentChatUser]: [
          ...(prevConversations[currentChatUser] || []),
          message,
        ],
      }));
      setInputMessage("");
    }
  };

  const selectUserToChat = (user) => {
    setCurrentChatUser(user);
  };

  return (
    <div className="container">
      {!isNameEntered ? (
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button onClick={() => setIsNameEntered(true)}>Enter Chat</button>
        </div>
      ) : (
        <div>
          <div className="online-users-section">
            <div className="messages"></div>
            <div className="profile">
              <div className="avatar">
                <p>{userName.charAt(0)}</p>
              </div>
              <div className="name2">{userName}</div>
            </div>
            <ul className="people">
              {onlineUsers.map((user) => (
                <li
                  key={user}
                  className={
                    user === currentChatUser ? "person focus" : "person"
                  }
                  onClick={() => selectUserToChat(user)}
                >
                  <span className="title">{user}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="chatbox">
            <div className="top-bar">
              <div className="name">{currentChatUser}</div>
            </div>
            <div className="middle">
              {currentChatUser &&
                conversations[currentChatUser]?.map((msg, index) => (
                  <div
                    key={index}
                    className={msg.from === userName ? "outgoing" : "incoming"}
                  >
                    <div className="bubble">{msg.message}</div>
                  </div>
                ))}
            </div>
            <div className="bottom-bar">
              <input
                type="text"
                placeholder="Type a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
          <div className="todolist">
            <div className="todolist-topic">Todo list</div>
            
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
