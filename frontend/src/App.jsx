import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import ChatWindow from "./components/ChatWindow.jsx";

const API = "http://localhost:5000/api";

export default function App() {
  const [folders, setFolders] = useState([]);
  const [activeFolderId, setActiveFolderId] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load folders once when the app starts
  useEffect(() => {
    loadFolders();
  }, []);

  async function loadFolders() {
    const res = await fetch(`${API}/folders`);
    const data = await res.json();
    setFolders(data);
  }

  async function handleCreateFolder(name) {
    await fetch(`${API}/folders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    loadFolders();
  }

  async function handleDeleteFolder(folderId) {
    await fetch(`${API}/folders/${folderId}`, { method: "DELETE" });
    if (folderId === activeFolderId) {
      setActiveFolderId(null);
      setActiveChatId(null);
      setMessages([]);
    }
    loadFolders();
  }

  async function handleCreateChat(folderId) {
    const res = await fetch(`${API}/folders/${folderId}/chats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New Chat" }),
    });
    const chat = await res.json();
    await loadFolders();
    setActiveFolderId(folderId);
    setActiveChatId(chat.id);
    setMessages([]);
  }

  async function handleSelectChat(folderId, chatId) {
    const res = await fetch(`${API}/folders/${folderId}/chats/${chatId}`);
    const chat = await res.json();
    setActiveFolderId(folderId);
    setActiveChatId(chatId);
    setMessages(chat.messages || []);
  }

  async function handleDeleteChat(folderId, chatId) {
    await fetch(`${API}/folders/${folderId}/chats/${chatId}`, {
      method: "DELETE",
    });
    if (chatId === activeChatId) {
      setActiveChatId(null);
      setMessages([]);
    }
    loadFolders();
  }

  async function handleSend(text) {
    if (!activeFolderId || !activeChatId) {
      alert("Please create or select a chat first (use + Folder, then + inside it).");
      return;
    }

    const newMessages = [...messages, { role: "user", text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();

      const reply = data.reply || data.error || "Something went wrong.";
      const finalMessages = [...newMessages, { role: "assistant", text: reply }];
      setMessages(finalMessages);

      const title =
        finalMessages.length === 2 ? text.slice(0, 30) : undefined;
      await fetch(`${API}/folders/${activeFolderId}/chats/${activeChatId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: finalMessages, title }),
      });
      if (title) loadFolders();
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", text: "Error: could not reach the server." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const activeFolder = folders.find((f) => f.id === activeFolderId);
  const activeChat = activeFolder?.chats.find((c) => c.id === activeChatId);

  return (
    <div className="app">
      <Sidebar
        folders={folders}
        activeFolderId={activeFolderId}
        activeChatId={activeChatId}
        onCreateFolder={handleCreateFolder}
        onDeleteFolder={handleDeleteFolder}
        onCreateChat={handleCreateChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
      />
      <ChatWindow
        messages={messages}
        onSend={handleSend}
        loading={loading}
        chatTitle={activeChat?.title}
      />
    </div>
  );
}
