# NeoChat — AI Chatbot with Folders (React + Node + Gemini)

A ChatGPT/Gemini-style chatbot, but with one extra feature: you can
organize your chats into **folders**, so old conversations don't get lost.

## What's inside

```
chatbot-project/
  backend/     -> Node.js + Express server, talks to Gemini API, saves data to a JSON file
  frontend/    -> React app (built with Vite), the chat UI
```

## How it works (simple explanation)

- The **frontend** is what you see in the browser: sidebar with folders/chats, and the chat window.
- The **backend** is a small server. When you send a message, the frontend calls the backend,
  the backend calls Google Gemini, and sends the reply back.
- All our folders and chats are saved in one file: `backend/data/db.json`. No database setup needed.


## Use the app

1. Click **"+ Folder"** to create a folder (e.g. "College", "Fun").
2. Click the **+** button next to the folder to create a new chat inside it.
3. Type a message and press Enter (or click Send).

## Tech used

- Frontend: React 18, Vite
- Backend: Node.js, Express
- AI: Google Gemini API (`gemini-2.5-flash` model)
- Storage: a simple JSON file (no database needed)
