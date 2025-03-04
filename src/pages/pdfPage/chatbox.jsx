import React, { useState, useRef, useEffect } from "react";

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [size, setSize] = useState({ width: 400, height: 300 });
  const draggingRef = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const startDrag = (e) => {
    draggingRef.current = true;
    offset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  useEffect(() => {
    const onMouseMove = (e) => {
      if (draggingRef.current) {
        setPosition({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
      }
    };

    const stopActions = () => {
      draggingRef.current = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopActions);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopActions);
    };
  }, []);

  const adjustSize = (change) => {
    setSize((prev) => ({
      width: Math.max(300, prev.width + change),
      height: Math.max(200, prev.height + change),
    }));
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "User", text: input }]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "AI Tutor", text: formatMessage(data.response) }]);
    } catch (error) {
      console.error("Error communicating with AI:", error);
      setMessages((prev) => [...prev, { sender: "AI Tutor", text: "❌ Failed to get a response!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatMessage = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        border: "1px solid #b350b0",
        borderRadius: "8px",
        backgroundColor: "#1b1b26",
        color: "#d4d4d4",
        boxShadow: "0px 0px 10px rgba(179, 80, 176, 0.3)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: "#2b2b39",
          padding: "10px",
          textAlign: "center",
          fontWeight: "bold",
          cursor: "move",
          color: "#b350b0",
          display: "flex",
          justifyContent: "space-between",
        }}
        onMouseDown={startDrag}
      >
        <span>AI Tutor Chatbox</span>
        <div>
          <button style={buttonStyle} onClick={() => adjustSize(20)}>➕</button>
          <button style={buttonStyle} onClick={() => adjustSize(-20)}>➖</button>
        </div>
      </div>
      <div
        style={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "10px",
          backgroundColor: "#21212e",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              background: msg.sender === "User" ? "#5b3a99" : "#343449",
              padding: "8px",
              borderRadius: "5px",
              marginBottom: "5px",
              color: "#d4d4d4",
              maxWidth: "80%",
              alignSelf: msg.sender === "User" ? "flex-end" : "flex-start",
              whiteSpace: "pre-line",
            }}
            dangerouslySetInnerHTML={{ __html: msg.text }}
          ></div>
        ))}
        {isTyping && <div style={{ fontStyle: "italic", color: "#b350b0" }}>AI is typing...</div>}
      </div>
      <div style={{ display: "flex", padding: "5px", backgroundColor: "#1b1b26" }}>
        <input
          style={inputStyle}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask AI Tutor..."
        />
        <button style={sendButtonStyle} onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

const buttonStyle = {
  background: "#b350b0",
  color: "#d4d4d4",
  border: "none",
  padding: "5px 10px",
  margin: "0 3px",
  borderRadius: "5px",
  cursor: "pointer",
};

const inputStyle = {
  flex: 1,
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #b350b0",
  backgroundColor: "#2b2b39",
  color: "#d4d4d4",
};

const sendButtonStyle = {
  marginLeft: "5px",
  padding: "8px",
  background: "#b350b0",
  color: "#d4d4d4",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default Chatbox;
