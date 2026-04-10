package com.snakegame.model;

import java.util.List;

public class GameState {

    public enum Direction { UP, DOWN, LEFT, RIGHT }
    public enum Status { RUNNING, GAME_OVER, LEVEL_UP }

    private List<int[]> snake;
    private int[] apple;
    private Direction direction;
    private Status status;
    private int score;
    private int level;
    private int speed;
    private String skin;

    public GameState() {}

    public GameState(List<int[]> snake, int[] apple, Direction direction,
                     Status status, int score, int level, int speed, String skin) {
        this.snake = snake;
        this.apple = apple;
        this.direction = direction;
        this.status = status;
        this.score = score;
        this.level = level;
        this.speed = speed;
        this.skin = skin;
    }

    public List<int[]> getSnake() { return snake; }
    public void setSnake(List<int[]> snake) { this.snake = snake; }

    public int[] getApple() { return apple; }
    public void setApple(int[] apple) { this.apple = apple; }

    public Direction getDirection() { return direction; }
    public void setDirection(Direction direction) { this.direction = direction; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }

    public int getSpeed() { return speed; }
    public void setSpeed(int speed) { this.speed = speed; }

    public String getSkin() { return skin; }
    public void setSkin(String skin) { this.skin = skin; }
}