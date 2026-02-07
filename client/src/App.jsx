import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, loading]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    // add user message
    const userMessage = { role: "user", text: message };
    setChat((prev) => [...prev, userMessage]);

    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message,
      });

      const botMessage = {
        role: "bot",
        text: res.data.reply,
      };

      setChat((prev) => [...prev, botMessage]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        { role: "bot", text: "Error connecting to AI 😢" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chat-container">
      <div className="chat-header">AI Chatbot 🤖</div>

      <div className="chat-messages">
        {chat.map((c, i) => (
          <div
            key={i}
            className={`message ${c.role === "user" ? "user" : "bot"}`}
          >
            <div className="text">{c.text}</div>
          </div>
        ))}

        {loading && (
          <div className="message bot">
            <div className="text">Typing...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask something..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
