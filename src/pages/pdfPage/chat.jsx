import React, { useState, useRef, useEffect } from "react";
import "./chat.css";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBTypography,
  MDBTextArea,
} from "mdb-react-ui-kit";

export default function Chat() {
  const chatRef = useRef(null);
  const chatBodyRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [size, setSize] = useState({ width: 400, height: 500 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition((prev) => ({
          x: prev.x + e.movementX,
          y: prev.y + e.movementY,
        }));
      }
      if (isResizing) {
        setSize((prev) => ({
          width: Math.max(300, prev.width + e.movementX),
          height: Math.max(400, prev.height + e.movementY),
        }));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, size]);

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
    <MDBContainer
      fluid
      className="chat-container"
      ref={chatRef}
      style={{
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
        position: "fixed",
      }}
    >
      <MDBRow className="w-100 justify-content-center">
        <MDBCol>
          <MDBCard className="chat-box">
            <div
              className="chat-header"
              onMouseDown={() => setIsDragging(true)}
            >
              <span>AI Tutor Chatbox</span>
              <span
                className="resize-handle"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setIsResizing(true);
                }}
              ></span>
            </div>

            <MDBCardBody
              className="chat-body"
              ref={chatBodyRef}
              style={{ maxHeight: `calc(${size.height}px - 110px)` }}
            >
              <MDBTypography listUnStyled className="chat-messages">
                {messages.map((msg, index) => (
                  <li
                    key={index}
                    className={`d-flex ${
                      msg.sender === "User"
                        ? "justify-content-end"
                        : "justify-content-start"
                    } mb-3`}
                  >
                    <MDBCard
                      className={`chat-bubble ${
                        msg.sender === "User" ? "right" : "left"
                      }`}
                    >
                      <MDBCardBody className="p-2">
                        <strong>{msg.sender}</strong>
                        <p
                          className="mb-0"
                          dangerouslySetInnerHTML={{
                            __html: msg.text.replace(/\n/g, "<br />"),
                          }}
                        ></p>
                      </MDBCardBody>
                    </MDBCard>
                  </li>
                ))}
              </MDBTypography>
            </MDBCardBody>

            <div className="chat-input">
              <MDBTextArea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={2}
                className="bg-dark text-light"
              />
              <MDBBtn
                color="warning"
                rounded
                className="mt-2"
                onClick={sendMessage}
              >
                Send
              </MDBBtn>
            </div>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
