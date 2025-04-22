import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "./chat.css";

export default function Chat() {
  const chatBodyRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [fileList, setFileList] = useState([]);
  const [showFileList, setShowFileList] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchFileList = async () => {
      try {
        const response = await fetch("http://localhost:5000/list-files");
        const data = await response.json();
        setFileList(data.files || []);
      } catch (error) {
        console.error("Error fetching file list:", error);
      }
    };

    fetchFileList();
  }, []);

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
      let response;

      if (input.toLowerCase().startsWith("select ")) {
        const fileName = input.substring(7).trim();
        response = await fetch("http://localhost:5000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: `select ${fileName}` }),
        });
      } else {
        response = await fetch("http://localhost:5000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        });
      }

      const data = await response.json();

      if (data.response) {
        const botMessage = { sender: "Tutor", text: data.response };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage = { sender: "Tutor", text: "Sorry, I couldn't process your request." };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = { sender: "Tutor", text: "Something went wrong. Please try again." };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleFileSelect = (fileName) => {
    setSelectedFile(fileName);
    setInput(`select ${fileName}`);
    sendMessage();
    setShowFileList(false);
  };

  return (
    <div className="chat-box">
      <div className="chat-card">
        <div className="file-list-button">
          <button className="file-list-toggle" onClick={() => setShowFileList(!showFileList)}>
            {showFileList ? "Close File List" : "Open File List"}
          </button>
        </div>

        {showFileList && (
          <div className="file-list">
            <h5>Available Files</h5>
            <ul>
              {fileList.length > 0 ? (
                fileList.map((file, index) => (
                  <li key={index} className="file-item">
                    <button className="file-select-button" onClick={() => handleFileSelect(file)}>
                      {file}
                    </button>
                  </li>
                ))
              ) : (
                <li>No files available.</li>
              )}
            </ul>
          </div>
        )}

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
                    <div className="mb-0">
                      {msg.sender === "Tutor" ? (
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

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
