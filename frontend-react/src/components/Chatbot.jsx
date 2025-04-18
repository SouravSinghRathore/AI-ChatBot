import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { Robot } from "react-bootstrap-icons";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDateLabel = (isoDate) => {
    const date = parseISO(isoDate);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM dd, yyyy");
  };

  useEffect(() => {
    axios.get("http://localhost:8080/api/chat")
      .then((response) => {
        const history = [];
        response.data.forEach(chat => {
          history.push({ text: chat.prompt, sender: "prompt", timestamp: chat.timestamp });
          history.push({ text: chat.response, sender: "response", timestamp: chat.timestamp });
        });
        setMessages(history);
      })
      .catch((error) => {
        console.error("Failed to fetch chat history:", error);
      });
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const now = new Date().toISOString();
    const userMessage = {
      text: input,
      sender: "prompt",
      timestamp: now
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsWaiting(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/chat",
        { prompt: input },
        { headers: { "Content-Type": "application/json" } }
      );

      const fullText = res.data;
      const timestamp = new Date().toISOString();
      let currentText = "";

      setIsWaiting(false);
      setIsTyping(true);

      for (let i = 0; i < fullText.length; i++) {
        currentText += fullText[i];
        await new Promise(resolve => setTimeout(resolve, 20));
        setMessages((prevMessages) => {
          const lastMsg = prevMessages[prevMessages.length - 1];
          if (lastMsg?.sender === "response") {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1].text = currentText;
            return updatedMessages;
          } else {
            return [...prevMessages, { text: currentText, sender: "response", timestamp }];
          }
        });
      }

      setIsTyping(false);
    } catch (error) {
      console.error("Error fetching response", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Error retrieving response", sender: "response", timestamp: new Date().toISOString() }
      ]);
      setIsWaiting(false);
      setIsTyping(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isWaiting]);

  return (
    <div className="container mt-5">
      <div className="card shadow-lg" style={{ width: "600px", margin: "0 auto" }}>
        <div className="card-header bg-black text-white text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="d-flex align-items-center justify-content-center gap-2"
          >
            <motion.div
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Robot size={28} className="text-warning" />
            </motion.div>
            <h4 className="mb-0">AI ChatBot</h4>
          </motion.div>
        </div>

        <div className="card-body chat-box" style={{ height: "400px", overflowY: "auto" }}>
          {messages.map((msg, index) => {
            const currentDate = formatDateLabel(msg.timestamp);
            const showDate =
              index === 0 || formatDateLabel(messages[index - 1]?.timestamp) !== currentDate;

            return (
              <motion.div
                key={index}
                className={`d-flex flex-column mb-3 ${msg.sender === "prompt" ? "align-items-end" : "align-items-start"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {showDate && (
                  <div className="text-center text-muted small my-2 w-100">
                    — {currentDate} —
                  </div>
                )}

                <div
                  className={`p-3 rounded shadow ${msg.sender === "prompt" ? "bg-black text-white" : "bg-light text-dark"}`}
                  style={{ maxWidth: "70%", wordWrap: "break-word" }}
                >
                  {msg.text}
                </div>
                <div className="text-muted small mt-1" style={{ fontSize: "0.75rem" }}>
                  {formatTime(msg.timestamp)}
                </div>
              </motion.div>
            );
          })}

          {isWaiting && !isTyping && (
            <motion.div
              className="d-flex flex-column align-items-start mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="p-3 rounded shadow bg-light text-dark"
                style={{ maxWidth: "70%", wordWrap: "break-word" }}
              >
                <motion.div
                  className="dot-animation"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <span className="fs-4">.</span>
                  <span className="fs-4">.</span>
                  <span className="fs-4">.</span>
                </motion.div>
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div className="card-footer">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-white px-4 py-2 rounded"
              onClick={sendMessage}
              style={{ border: "none" }}
            >
              Send
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
