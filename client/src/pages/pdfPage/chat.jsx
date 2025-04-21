import React, { useState, useRef, useEffect } from "react";
import "./chat.css";

export default function Chat() {
  const chatBodyRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "User", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botMessage = { sender: "Tutor", text: data.response };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-card">
        {/* Chat body - Scrollable section */}
        <div className="chat-body" ref={chatBodyRef}>
          <ul className="chat-messages">
            {messages.map((msg, index) => (
              <li
                key={index}
                className={`d-flex ${
                  msg.sender === "User" ? "justify-content-end" : "justify-content-start"
                } mb-3`}
              >
                <div className={`chat-bubble ${msg.sender === "User" ? "right" : "left"}`}>
                  <div className="p-2">
                    <strong>{msg.sender}</strong>
                    <p
                      className="mb-0"
                      dangerouslySetInnerHTML={{
                        __html: msg.text.replace(/\n/g, "<br />"),
                      }}
                    ></p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Input - Stays Fixed at Bottom */}
        <div className="chat-input">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={2}
            className="bg-dark text-light chat-textarea"
          />
          <button className="send-button" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
