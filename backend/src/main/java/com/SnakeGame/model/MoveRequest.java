package com.snakegame.model;

public class MoveRequest {
    private GameState state;
    private GameState.Direction direction;

    public GameState getState() { return state; }
    public void setState(GameState state) { this.state = state; }

    public GameState.Direction getDirection() { return direction; }
    public void setDirection(GameState.Direction direction) { this.direction = direction; }
}