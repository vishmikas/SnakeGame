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

Frontend (React + Vite)  
↓  
REST API Calls  
↓  
Backend (Spring Boot on Railway)  
↓  
Game Logic Processing

### Key Idea
- **Frontend** → handles UI, rendering, and user input  
- **Backend** → handles game rules, movement, collisions, scoring, and progression  

---

# 🧩 Tech Stack

## Frontend
- React (Vite)
- HTML Canvas
- Axios / Fetch API
- CSS

## Backend
- Java
- Spring Boot
- REST APIs

## Deployment
- Vercel → Frontend
- Railway → Backend

---

# 📂 Project Structure

```text
snake-game/
│
├── frontend/          # React + Vite app
│   ├── src/
│   └── package.json
│
├── backend/           # Spring Boot app
│   ├── src/main/java/
│   └── pom.xml
│
└── README.md