import { BaseTask } from "./BaseTask";
import { MapManager } from "../MapManager";
import { GridEngine } from "grid-engine";

import { FarmLand } from "../farm/FarmLand";

import {TaskStatus, Task} from "./types";
import { CharacterState, Character } from "../characters/types";
import { GenericItem } from "../items/GenericItem";

export class HarvestTask extends BaseTask implements Task{

    private mapManager: MapManager;
    private landEntity:FarmLand;

    constructor(
        mapManager: MapManager,
        gridEngine: GridEngine,
        character: Character,
        landEntity: FarmLand,
    ) {
        super(gridEngine, character);

        this.mapManager = mapManager;
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
        this.character.setCharState(CharacterState.IDLE);
        
        this.status = TaskStatus.Completed;
    };

    public next = () => {
        if (this.status === TaskStatus.Running) {
            switch (this.pointer) {
                case 1:
                    this.shouldMoveCharacter(this.landEntity.getSprite().getX(), this.landEntity.getSprite().getY()) ? this.moveCharacter(this.landEntity.getSprite().getX(), this.landEntity.getSprite().getY()): this.next();
                    break;
                case 2:
                    this.harvestCrop();
                    break;
            }
        }
    };


    private harvestCrop() {
        console.log("seed");
        this.character.anims.play("attack_right", true);
        //this.character.setCharState('seed')
        setTimeout(() => {
            this.character.anims.restart();
            this.character.anims.stop();
            this.character.setCharState(CharacterState.IDLE);
            if (this.status === TaskStatus.Running) {
                const crop = this.landEntity.executeHarvestCrop()
                if(crop) {
                    this.character.getInventory().addItem(GenericItem.clone(crop));
                    this.landEntity.endCrop();
                }
                this.status = TaskStatus.Completed;
            }
        }, 1000);
    }
}
