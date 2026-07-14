export default function Message({ role, text }) {
  const isUser = role === "user";
  return (
    <div className={`message-row ${isUser ? "user" : "assistant"}`}>
      <div className="avatar">{isUser ? "🧑" : "✨"}</div>
      <div className="bubble">{text}</div>
    </div>
  );
}
