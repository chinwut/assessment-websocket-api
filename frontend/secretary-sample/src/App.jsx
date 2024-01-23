import { useState, useEffect, useRef } from "react";
import "./App.css";
import {
  fetchTodos,
  addTodo,
  toggleComplete,
  deleteTodo,
} from "./services/todoService";
import { initializeChat } from "./services/chatService";

function App() {
  const [conversations, setConversations] = useState({});
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [todos, setTodos] = useState([]);
  const [isNameEntered, setIsNameEntered] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");

  const ws = useRef(null);

  useEffect(() => {
    if (isNameEntered) {
      ws.current = initializeChat(
        userName,
        handleWebSocketMessage,
        handleWebSocketClose
      );
      fetchTodos().then(setTodos).catch(console.error);
    }
  }, [isNameEntered, userName]);

  const handleWebSocketMessage = (event) => {
    const receivedMessage = JSON.parse(event.data);

    if (receivedMessage.type === "direct") {
      const chatUser =
        receivedMessage.from === userName
          ? receivedMessage.to
          : receivedMessage.from;
      setConversations((prevConversations) => ({
        ...prevConversations,
        [chatUser]: [...(prevConversations[chatUser] || []), receivedMessage],
      }));
    } else if (receivedMessage.type === "status") {
      setOnlineUsers(
        receivedMessage.onlineUsers.filter((user) => user !== userName)
      );
    }
  };

  const handleWebSocketClose = () => {
    if (ws.current) {
      ws.current.close();
    }
  };

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

  const handleAddTodo = async () => {
    if (newTodoTitle) {
      await addTodo({
        title: newTodoTitle,
        owner: userName, // Assuming userName is the owner of the todo
      });
      setNewTodoTitle("");
      fetchTodos().then(setTodos).catch(console.error);
    }
  };

  const handleToggleComplete = async (id, isCompleted) => {
    await toggleComplete(id, isCompleted);
    await fetchTodos().then(setTodos).catch(console.error);
  };

  const handleDeleteTodo = async (id) => {
    await deleteTodo(id);
    await fetchTodos().then(setTodos).catch(console.error);
  };

  return (
    <div className="container">
      {!isNameEntered ? (
        <div className="user-name-entry">
          <input
            type="text"
            className="user-name-input"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button
            className="enter-chat-button"
            onClick={() => setIsNameEntered(true)}
          >
            Enter Chat
          </button>
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
            <div className="todolist-topic">Todo List</div>
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="Add new todo"
            />
            <button onClick={handleAddTodo}>Add</button>
            <ul>
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className={todo.isCompleted ? "completed" : ""}
                >
                  {todo.title} (Owner: {todo.owner})
                  <input
                    type="checkbox"
                    checked={todo.isCompleted}
                    onChange={() =>
                      handleToggleComplete(todo.id, todo.isCompleted)
                    }
                  />
                  <button onClick={() => handleDeleteTodo(todo.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
