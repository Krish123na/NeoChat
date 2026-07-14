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
- All your folders and chats are saved in one file: `backend/data/db.json`. No database setup needed.

## Step 1: Get a free Gemini API key

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with Google, click "Create API Key"
3. Copy the key

## Step 2: Set up the backend

```bash
cd backend
npm install
cp .env.example .env
```

Now open `.env` and paste your key:

```
GEMINI_API_KEY=paste_your_key_here
```

Start the backend:

```bash
npm start
```

You should see: `Backend server running on http://localhost:5000`

## Step 3: Set up the frontend

Open a **new terminal window** (keep the backend running):

```bash
cd frontend
npm install
npm run dev
```

It will show a link like `http://localhost:5173`. Open that in your browser.

## Step 4: Use the app

1. Click **"+ Folder"** to create a folder (e.g. "College", "Fun").
2. Click the **+** button next to the folder to create a new chat inside it.
3. Type a message and press Enter (or click Send).

## Ideas to extend this project later

- Add user login (so different people have different folders)
- Add markdown/code formatting in messages
- Add voice input
- Let users rename folders/chats
- Add dark/light theme toggle

## Tech used

- Frontend: React 18, Vite
- Backend: Node.js, Express
- AI: Google Gemini API (`gemini-2.5-flash` model)
- Storage: a simple JSON file (no database needed)
