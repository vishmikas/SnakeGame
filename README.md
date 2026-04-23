# 🐍 Snake Game — Full Stack (React + Spring Boot)

A modern **full-stack Snake Game** built with a **React (Vite) frontend** and a **Spring Boot backend**, where the game logic is handled on the server and the UI is rendered on the client.

🔗 **Live Demo (Vercel):**  
👉 https://snake-game-eight-kohl.vercel.app/

---

# 🚀 Features

- Classic Snake gameplay with smooth controls  
- Backend-driven game logic  
- Server-side validation for movement and collisions  
- Score tracking and level progression  
- Dynamic speed increase based on level  
- Multiple skins (Classic / Neon / Fire)  
- Keyboard + touch/mobile support  
- Full client-server architecture

---

# 🏗️ Architecture

```
Browser (React + HTML Canvas)
        │
        │  POST /api/game/new    → start a game, receive initial state
        │  POST /api/game/tick   → send state + direction, receive new state
        │
Spring Boot REST API (Railway)
        │
        └── GameService          → movement, collision, apple spawning, levelling
```

Every tick, the frontend sends the current game state and the player's direction to the backend. The backend processes the move and returns the updated state. **No WebSockets. No sessions. Pure REST.**

### Key Idea
- **Frontend** → handles UI, rendering, and user input  
- **Backend** → handles game rules, movement, collisions, scoring, and progression  

---

# 🧩 Tech Stack

## Frontend
- **React 19** + **Vite 8** — fast dev server and bundler
- **HTML Canvas** — game rendering at 24 × 24 grid cells
- **Fetch API** — polling `/api/game/tick` on a per-level interval timer
- **Pure CSS** — no UI framework, hand-crafted dark theme

## Backend
- **Java 17** + **Spring Boot 3.2**
- **REST API** — `POST /api/game/new`, `POST /api/game/tick`, `GET /api/game/config`
- **Maven** — build and dependency management

## Deployment
- Vercel → Frontend
- Railway → Backend

---

# 📂 Project Structure

```
snake-game/
├── frontend/                   # React + Vite application
│   ├── src/
│   │   ├── App.jsx             # Game loop, canvas rendering, skin logic
│   │   ├── App.css             # Dark-theme styles
│   │   └── main.jsx            # Entry point
│   ├── public/
│   │   └── favicon.svg
│   ├── .env.example            # Required environment variables
│   ├── vite.config.js
│   └── package.json
│
├── backend/                    # Spring Boot application
│   └── src/main/java/com/SnakeGame/
│       ├── SnakeGameApplication.java   # App entry point
│       ├── controller/
│       │   └── GameController.java     # REST endpoints
│       ├── service/
│       │   └── GameService.java        # Game logic (movement, collisions, levels)
│       └── model/
│           ├── GameState.java          # Serialisable game state
│           └── MoveRequest.java        # Tick request payload
│
└── README.md
```

## 🎮 How to Play

| Action | Keys |
|---|---|
| Move | Arrow keys or `W A S D` |
| Restart | `R` after game over |
| Change skin | Select before starting a game |

- Eat apples to grow and score points.
- Every **5 points** = new level + increased speed.
- Avoid hitting the walls or your own tail.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---