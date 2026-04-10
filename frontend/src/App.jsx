import { useEffect, useRef, useState, useCallback } from "react";
import "./App.css";

const API = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/$/, "");
const CELL = 24;

const SKINS = {
  classic: { head: "#22c55e", body: "#16a34a", apple: "#ef4444", bg: "#0a0a0a", grid: "#111" },
  neon: { head: "#00fff0", body: "#0891b2", apple: "#f0abfc", bg: "#0d0d1a", grid: "#111827" },
  fire: { head: "#fbbf24", body: "#f97316", apple: "#a855f7", bg: "#1c0a00", grid: "#1f1005" },
};

const DIR_MAP = {
  ArrowUp: "UP",
  ArrowDown: "DOWN",
  ArrowLeft: "LEFT",
  ArrowRight: "RIGHT",
  w: "UP",
  s: "DOWN",
  a: "LEFT",
  d: "RIGHT",
};

export default function App() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState(null);
  const [skin, setSkin] = useState("classic");
  const [highScore, setHighScore] = useState(0);
  const [screen, setScreen] = useState("menu");
  const [levelFlash, setLevelFlash] = useState(false);
  const [error, setError] = useState("");

  const pendingDirRef = useRef(null);
  const gameStateRef = useRef(null);
  const tickRef = useRef(null);
  const skinRef = useRef(skin);

  useEffect(() => {
    skinRef.current = skin;
  }, [skin]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const apiNewGame = async (selectedSkin) => {
    const url = `${API}/api/game/new?skin=${selectedSkin}`;
    console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);
    console.log("API =", API);
    console.log("Requesting:", url);

    const res = await fetch(url, {
      method: "POST",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to start game: ${res.status} ${text}`);
    }

    return res.json();
  };

  const apiTick = async (state, direction) => {
    const url = `${API}/api/game/tick`;
    console.log("Requesting:", url);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state, direction }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to update game: ${res.status} ${text}`);
    }

    return res.json();
  };

  const runTick = useCallback(async () => {
    const current = gameStateRef.current;
    if (!current || current.status === "GAME_OVER") return;

    const dir = pendingDirRef.current || current.direction;
    pendingDirRef.current = null;

    try {
      const next = await apiTick(current, dir);
      setGameState(next);

      if (next.status === "GAME_OVER") {
        setHighScore((h) => Math.max(h, next.score));
        setScreen("gameover");
        clearInterval(tickRef.current);
        return;
      }

      if (next.status === "LEVEL_UP") {
        setLevelFlash(true);
        setTimeout(() => setLevelFlash(false), 800);
      }

      clearInterval(tickRef.current);
      tickRef.current = setInterval(runTick, next.speed);
    } catch (err) {
      console.error("Tick error:", err);
      setError(`Backend connection failed: ${err.message}`);
      clearInterval(tickRef.current);
      setScreen("menu");
    }
  }, []);

  const startGame = useCallback(
    async (selectedSkin) => {
      clearInterval(tickRef.current);
      setError("");

      try {
        const state = await apiNewGame(selectedSkin || skin);
        setGameState(state);
        setScreen("playing");
        pendingDirRef.current = null;
        tickRef.current = setInterval(runTick, state.speed);
      } catch (err) {
        console.error("Start game error:", err);
        setError(`Could not connect to backend: ${err.message}`);
      }
    },
    [skin, runTick]
  );

  useEffect(() => {
    return () => clearInterval(tickRef.current);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (DIR_MAP[e.key]) {
        e.preventDefault();
        pendingDirRef.current = DIR_MAP[e.key];
      }

      if ((e.key === "r" || e.key === "R") && screen === "gameover") {
        startGame();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [screen, startGame]);

  useEffect(() => {
    if (!gameState || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    const colors = SKINS[skinRef.current];
    const { snake, apple } = gameState;
    const COLS = 24;
    const ROWS = 24;
    const W = COLS * CELL;
    const H = ROWS * CELL;

    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 0.5;

    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * CELL, 0);
      ctx.lineTo(c * CELL, H);
      ctx.stroke();
    }

    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * CELL);
      ctx.lineTo(W, r * CELL);
      ctx.stroke();
    }

    ctx.fillStyle = colors.apple;
    ctx.shadowColor = colors.apple;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(apple[0] * CELL + CELL / 2, apple[1] * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    snake.forEach((seg, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? colors.head : colors.body;

      if (isHead) {
        ctx.shadowColor = colors.head;
        ctx.shadowBlur = 18;
      }

      const pad = isHead ? 1 : 2;
      ctx.beginPath();
      ctx.roundRect(
        seg[0] * CELL + pad,
        seg[1] * CELL + pad,
        CELL - pad * 2,
        CELL - pad * 2,
        isHead ? 5 : 3
      );
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }, [gameState]);

  const touchStart = useRef(null);

  const onTouchStart = (e) => {
    touchStart.current = e.touches[0];
  };

  const onTouchEnd = (e) => {
    if (!touchStart.current) return;

    const dx = e.changedTouches[0].clientX - touchStart.current.clientX;
    const dy = e.changedTouches[0].clientY - touchStart.current.clientY;

    pendingDirRef.current =
      Math.abs(dx) > Math.abs(dy)
        ? dx > 0
          ? "RIGHT"
          : "LEFT"
        : dy > 0
          ? "DOWN"
          : "UP";
  };

  const colors = SKINS[skin];
  const CANVAS_SIZE = 24 * CELL;

  return (
    <div className="app" style={{ "--head": colors.head, "--apple": colors.apple }}>
      <div className="glow-bg" />

      <header>
        <h1 className="logo">🐍 SNAKE</h1>
        {gameState && screen === "playing" && (
          <div className="hud">
            <span className="hud-item">
              SCORE <strong>{gameState.score}</strong>
            </span>
            <span className="hud-item">
              BEST <strong>{highScore}</strong>
            </span>
            <span className={`hud-item level-badge ${levelFlash ? "flash" : ""}`}>
              LVL <strong>{gameState.level}</strong>
            </span>
            <span className="hud-item speed-badge">⚡{gameState.speed}ms</span>
          </div>
        )}
      </header>

      <main>
        {error && <p className="hint" style={{ color: "red" }}>{error}</p>}

        {screen === "menu" && (
          <div className="overlay">
            <p className="tagline">Classic game. Legendary hunger.</p>

            <div className="skin-picker">
              <p>Choose your skin</p>
              <div className="skins">
                {Object.entries(SKINS).map(([key, s]) => (
                  <button
                    key={key}
                    className={`skin-btn ${skin === key ? "active" : ""}`}
                    style={{ "--c": s.head }}
                    onClick={() => setSkin(key)}
                  >
                    <span className="skin-dot" style={{ background: s.head }} />
                    {key}
                  </button>
                ))}
              </div>
            </div>

            <button className="play-btn" onClick={() => startGame(skin)}>
              PLAY
            </button>

            <p className="hint">Arrow keys or WASD · Swipe on mobile</p>
          </div>
        )}

        {(screen === "playing" || screen === "gameover") && (
          <div className="canvas-wrap" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              className={`game-canvas ${screen === "gameover" ? "dimmed" : ""}`}
            />

            {levelFlash && <div className="level-flash">LEVEL {gameState?.level}!</div>}

            {screen === "gameover" && (
              <div className="gameover-overlay">
                <h2>GAME OVER</h2>
                <p className="final-score">{gameState?.score} pts</p>

                {gameState?.score >= highScore && gameState?.score > 0 && (
                  <p className="new-record">🏆 New Record!</p>
                )}

                <div className="go-buttons">
                  <button className="play-btn small" onClick={() => startGame()}>
                    PLAY AGAIN
                  </button>
                  <button className="play-btn small outline" onClick={() => setScreen("menu")}>
                    MENU
                  </button>
                </div>

                <p className="hint">or press R</p>
              </div>
            )}
          </div>
        )}

        {screen === "playing" && (
          <div className="dpad">
            <button className="dpad-btn" onClick={() => (pendingDirRef.current = "UP")}>
              ▲
            </button>
            <div className="dpad-row">
              <button className="dpad-btn" onClick={() => (pendingDirRef.current = "LEFT")}>
                ◀
              </button>
              <span />
              <button className="dpad-btn" onClick={() => (pendingDirRef.current = "RIGHT")}>
                ▶
              </button>
            </div>
            <button className="dpad-btn" onClick={() => (pendingDirRef.current = "DOWN")}>
              ▼
            </button>
          </div>
        )}
      </main>
    </div>
  );
}