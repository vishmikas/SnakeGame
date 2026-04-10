package com.snakegame.controller;

import com.snakegame.model.GameState;
import com.snakegame.model.MoveRequest;
import com.snakegame.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
@CrossOrigin(origins = "*")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/new")
    public ResponseEntity<GameState> newGame(@RequestParam(defaultValue = "classic") String skin) {
        return ResponseEntity.ok(gameService.newGame(skin));
    }

    @PostMapping("/tick")
    public ResponseEntity<GameState> tick(@RequestBody MoveRequest request) {
        GameState updated = gameService.tick(request.getState(), request.getDirection());
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/config")
    public ResponseEntity<?> config() {
        return ResponseEntity.ok(new java.util.HashMap<>() {{
            put("cols", GameService.COLS);
            put("rows", GameService.ROWS);
        }});
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }
}