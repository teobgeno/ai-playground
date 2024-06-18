import { GridEngine } from "grid-engine";
import { Humanoid } from "../characters/Humanoid";
import { Tilemaps } from "phaser";
import { Task, TaskStatus } from "./types";

abstract class BaseTask {
    protected gridEngine: GridEngine;
    protected character: Humanoid;
    public tile: Tilemaps.Tile;
    protected status: TaskStatus;
    protected pointer: number = 0;

    public getStatus() {
        return this.status;
    }

    public setStatus(status: TaskStatus) {
        this.status = status;
    }

    protected moveCharacter() {
        this.pointer = 2;
        this.character.setCharState("walk");
        this.gridEngine.moveTo(this.character.getId(), {
            x: this.tile.x,
            y: this.tile.y,
        });
        // const m = new MoveCharAction(
        //     this.character,
        //     this.gridEngine,
        //     this.tile.x,
        //     this.tile.y
        // );
        // m.execute();
    }
}
