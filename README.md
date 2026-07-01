# Checkboxes

A real-time checkbox grid app built with React, Vite, Express, Socket.IO, and Redis.

## ✨ What it does

- Displays a responsive grid of **1000 checkboxes**
- Syncs checkbox state in real time across connected clients
- Uses **Socket.IO** for live updates
- Stores state in **Redis** for persistence
- Prevents rapid repeated updates with a **2-second rate limit**

## 📁 Project structure

- `Backend/` - Express server, WebSocket logic, Redis state management
- `Frontend/` - React app with Vite, Tailwind-style UI, socket client
- `Backend/docker-compose.yml` - starts Redis locally

## 🚀 Getting started

### 1. Start Redis

From the `Backend/` folder:

```bash
cd Backend
docker compose up -d
```

### 2. Install dependencies

```bash
cd Backend
pnpm install

cd ../Frontend
pnpm install
```

### 3. Configure environment

Create `.env` in `Backend/` and `.env` in `Frontend/` if needed.

Example values:

`Backend/.env`
```env
PORT=
CLIENT_URL=
```

`Frontend/.env`
```env
VITE_API_URL=
```

### 4. Run the app

In one terminal:

```bash
cd Backend
pnpm start
```

In another terminal:

```bash
cd Frontend
pnpm dev
```

Then open the Vite frontend URL shown in the terminal.

## 🧠 Notes

- Backend loads checkbox state from Redis and initializes 1000 items if none exist.
- Changes are published through Redis pub/sub so all clients stay synchronized.
- The frontend blocks quick repeated clicks and shows a rate-limit alert.

## 🛠️ Tech stack

- Frontend: `React`, `Vite`, `Tailwind CSS`, `socket.io-client`
- Backend: `Express`, `Socket.IO`, `Redis`

## ✅ Quick commands

```bash
cd Backend && pnpm install
cd Frontend && pnpm install
cd Backend && docker compose up -d
cd Backend && pnpm start
cd Frontend && pnpm dev
```

Enjoy playing with the live checkbox grid! 🎯
