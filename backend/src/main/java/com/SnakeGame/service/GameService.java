package com.snakegame.service;

import com.snakegame.model.GameState;
import com.snakegame.model.GameState.Direction;
import com.snakegame.model.GameState.Status;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import org.springframework.stereotype.Service;

@Service
public class GameService {

    public static final int COLS = 24;
    public static final int ROWS = 24;
    private static final int POINTS_PER_LEVEL = 5;
    private static final int BASE_SPEED = 150;
    private static final int SPEED_REDUCTION = 10;
    private static final int MIN_SPEED = 60;

    private final Random random = new Random();

    public GameState newGame(String skin) {
        List<int[]> snake = new ArrayList<>();
        int startX = COLS / 2;
        int startY = ROWS / 2;
        for (int i = 0; i < 4; i++) {
            snake.add(new int[]{startX - i, startY});
        }
        int[] apple = spawnApple(snake);
        return new GameState(snake, apple, Direction.RIGHT, Status.RUNNING,
                0, 1, BASE_SPEED, skin == null ? "classic" : skin);
    }

    public GameState tick(GameState state, Direction requestedDir) {
        if (state.getStatus() != Status.RUNNING) return state;

        Direction dir = resolveDirection(state.getDirection(), requestedDir);
        state.setDirection(dir);

        List<int[]> snake = state.getSnake();
        int[] head = snake.get(0);
        int[] newHead = computeNewHead(head, dir);

        // Wall collision
        if (newHead[0] < 0 || newHead[0] >= COLS || newHead[1] < 0 || newHead[1] >= ROWS) {
            state.setStatus(Status.GAME_OVER);
            return state;
        }

        // Self collision
        for (int i = 0; i < snake.size() - 1; i++) {
            if (snake.get(i)[0] == newHead[0] && snake.get(i)[1] == newHead[1]) {
                state.setStatus(Status.GAME_OVER);
                return state;
            }
        }

        snake.add(0, newHead);

        int[] apple = state.getApple();
        boolean ateApple = newHead[0] == apple[0] && newHead[1] == apple[1];

        if (ateApple) {
            int newScore = state.getScore() + 1;
            state.setScore(newScore);

            int newLevel = (newScore / POINTS_PER_LEVEL) + 1;
            if (newLevel != state.getLevel()) {
                state.setLevel(newLevel);
                int newSpeed = Math.max(MIN_SPEED, BASE_SPEED - (newLevel - 1) * SPEED_REDUCTION);
                state.setSpeed(newSpeed);
                state.setStatus(Status.LEVEL_UP);
            }
            state.setApple(spawnApple(snake));
        } else {
            snake.remove(snake.size() - 1);
            if (state.getStatus() == Status.LEVEL_UP) {
                state.setStatus(Status.RUNNING);
            }
        }

        state.setSnake(snake);
        return state;
    }

    private Direction resolveDirection(Direction current, Direction requested) {
        if (requested == null) return current;
        if (current == Direction.UP    && requested == Direction.DOWN)  return current;
        if (current == Direction.DOWN  && requested == Direction.UP)    return current;
        if (current == Direction.LEFT  && requested == Direction.RIGHT) return current;
        if (current == Direction.RIGHT && requested == Direction.LEFT)  return current;
        return requested;
    }

    private int[] computeNewHead(int[] head, Direction dir) {
        return switch (dir) {
            case UP    -> new int[]{head[0], head[1] - 1};
            case DOWN  -> new int[]{head[0], head[1] + 1};
            case LEFT  -> new int[]{head[0] - 1, head[1]};
            case RIGHT -> new int[]{head[0] + 1, head[1]};
        };
    }

    private int[] spawnApple(List<int[]> snake) {
        int[] pos;
        do {
            pos = new int[]{random.nextInt(COLS), random.nextInt(ROWS)};
        } while (isOnSnake(snake, pos));
        return pos;
    }

    private boolean isOnSnake(List<int[]> snake, int[] pos) {
        for (int[] seg : snake) {
            if (seg[0] == pos[0] && seg[1] == pos[1]) return true;
        }
        return false;
    }
}