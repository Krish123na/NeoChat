import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuid } from "uuid";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readDb, writeDb } from "./store.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ---------- FOLDER ROUTES ----------

app.get("/api/folders", (req, res) => {
  const db = readDb();
  const folders = db.folders.map((f) => ({
    id: f.id,
    name: f.name,
    chats: f.chats.map((c) => ({ id: c.id, title: c.title })),
  }));
  res.json(folders);
});

// Create a new folder
app.post("/api/folders", (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Folder name is required" });
  }
  const db = readDb();
  const newFolder = { id: uuid(), name: name.trim(), chats: [] };
  db.folders.push(newFolder);
  writeDb(db);
  res.json(newFolder);
});

// Delete a folder (and all chats inside it)
app.delete("/api/folders/:folderId", (req, res) => {
  const db = readDb();
  db.folders = db.folders.filter((f) => f.id !== req.params.folderId);
  writeDb(db);
  res.json({ success: true });
});

// ---------- CHAT ROUTES ----------

// Create a new chat inside a folder
app.post("/api/folders/:folderId/chats", (req, res) => {
  const db = readDb();
  const folder = db.folders.find((f) => f.id === req.params.folderId);
  if (!folder) return res.status(404).json({ error: "Folder not found" });

  const newChat = {
    id: uuid(),
    title: req.body.title || "New Chat",
    messages: [],
  };
  folder.chats.push(newChat);
  writeDb(db);
  res.json(newChat);
});

// Get one chat's full messages
app.get("/api/folders/:folderId/chats/:chatId", (req, res) => {
  const db = readDb();
  const folder = db.folders.find((f) => f.id === req.params.folderId);
  if (!folder) return res.status(404).json({ error: "Folder not found" });

  const chat = folder.chats.find((c) => c.id === req.params.chatId);
  if (!chat) return res.status(404).json({ error: "Chat not found" });

  res.json(chat);
});

// Save messages for a chat
app.put("/api/folders/:folderId/chats/:chatId", (req, res) => {
  const db = readDb();
  const folder = db.folders.find((f) => f.id === req.params.folderId);
  if (!folder) return res.status(404).json({ error: "Folder not found" });

  const chat = folder.chats.find((c) => c.id === req.params.chatId);
  if (!chat) return res.status(404).json({ error: "Chat not found" });

  chat.messages = req.body.messages || chat.messages;
  if (req.body.title) chat.title = req.body.title;

  writeDb(db);
  res.json(chat);
});

// Delete a chat
app.delete("/api/folders/:folderId/chats/:chatId", (req, res) => {
  const db = readDb();
  const folder = db.folders.find((f) => f.id === req.params.folderId);
  if (!folder) return res.status(404).json({ error: "Folder not found" });

  folder.chats = folder.chats.filter((c) => c.id !== req.params.chatId);
  writeDb(db);
  res.json({ success: true });
});


app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is missing. Add it to backend/.env",
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text }],
    }));

    const lastMessage = messages[messages.length - 1].text;

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage);
    const reply = result.response.text();

    res.json({ reply });
  } catch (err) {
    console.error("Gemini error:", err.message);
    res.status(500).json({ error: "Something went wrong talking to Gemini." });
  }
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "NeoChat API is running 🚀",
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
