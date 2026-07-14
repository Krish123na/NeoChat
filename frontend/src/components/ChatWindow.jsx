import { useEffect, useRef, useState } from "react";
import Message from "./Message.jsx";

export default function ChatWindow({ messages, onSend, loading, chatTitle }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  // Auto scroll to the newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    onSend(text);
    setInput("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <main className="chat-window">
      <div className="chat-title-bar">
        <h3>{chatTitle || "Select or create a chat"}</h3>
      </div>

      <div className="messages">
        {messages.length === 0 && (
          <div className="welcome">
            <h1>NeoChat</h1>
            <p>Ask me anything. Your chats are saved in folders on the left.</p>
          </div>
        )}

        {messages.map((m, i) => (
          <Message key={i} role={m.role} text={m.text} />
        ))}

        {loading && (
          <div className="message-row assistant">
            <div className="avatar">✨</div>
            <div className="bubble typing">Thinking...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="input-bar">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Enter to send)"
          rows={1}
        />
        <button onClick={handleSend} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>
    </main>
  );
}
