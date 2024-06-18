import { GridEngine } from "grid-engine";
import { Humanoid } from "../characters/Humanoid";
import { TaskStatus } from "./types";

export abstract class BaseTask {
    protected gridEngine: GridEngine;
    protected character: Humanoid;
    protected status: TaskStatus;
    protected pointer: number = 0;

    constructor(
        gridEngine: GridEngine,
        character: Humanoid,
    ) {
        this.character = character;
        this.gridEngine = gridEngine;
        this.status = TaskStatus.Initialized;
    }

    public getStatus() {
        return this.status;
    }

    public setStatus(status: TaskStatus) {
        this.status = status;
    }

    public getTile() {
        return this.tile;
    }

    protected moveCharacter(x: number, y: number) {
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
