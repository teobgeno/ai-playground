import { BaseTask } from "./BaseTask";
import { MapManager } from "../MapManager";
import { GridEngine } from "grid-engine";

import { FarmLand } from "../farm/FarmLand";
import { Seed } from "../farm/Seed";

import { TaskStatus, Task } from "./types";
import { CharacterState, Character } from "../characters/types";

export class SeedTask extends BaseTask implements Task {
    private mapManager: MapManager;
    private landEntity: FarmLand;
    private seed: Seed;

    constructor(
        mapManager: MapManager,
        gridEngine: GridEngine,
        character: Character,
        landEntity: FarmLand,
        seed: Seed
    ) {
        super(gridEngine, character);

        this.mapManager = mapManager;
        this.seed = seed;
        this.landEntity = landEntity;

        this.status = TaskStatus.Initialized;
    }

    public start() {
        this.status =
            this.status === TaskStatus.Initialized
                ? TaskStatus.Running
                : this.status;
        this.pointer = 1;
        this.next();
    }

    public cancel = () => {
        console.log("cancel task");
        this.status = TaskStatus.Rollback;

        this.gridEngine.stopMovement(this.character.getIdTag());
        this.landEntity.rollbackCrop();
        this.character.getInventory().addItem(this.seed);
        this.character.setCharState(CharacterState.IDLE);

        this.status = TaskStatus.Completed;
    };

    public next = () => {
        if (this.status === TaskStatus.Running) {
            switch (this.pointer) {
                case 1:
                    this.shouldMoveCharacter(
                        this.landEntity.getSprite().getX(),
                        this.landEntity.getSprite().getY()
                    )
                        ? this.moveCharacter(
                              this.landEntity.getSprite().getX(),
                              this.landEntity.getSprite().getY()
                          )
                        : this.next();
                    break;
                case 2:
                    this.plantSeed();
                    break;
            }
        }
    };

    private plantSeed() {
        console.log("seed");
        this.character.anims.play("attack_right", true);
        //this.character.setCharState('seed')
        setTimeout(() => {
            this.character.anims.restart();
            this.character.anims.stop();
            if (this.status === TaskStatus.Running) {
                this.landEntity.plantCrop();
                this.status = TaskStatus.Completed;
            }
        }, 1000);
    }
}
