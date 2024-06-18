import { BaseTask } from "./BaseTask";
import { MapManager } from "../MapManager";
import { GridEngine } from "grid-engine";

import {Land} from "../farm/Land";
import { Hoe } from "../items/Hoe";
//import MoveCharAction from "./MoveCharAction";
import { Tilemaps } from "phaser";
import {Task, TaskStatus} from "./types";
import {Humanoid} from "../characters/Humanoid";
import {LandEntity} from "../farm/types";

export class TillageTask  extends BaseTask{

    private mapManager: MapManager;
    private gridEngine: GridEngine;
    private character: Humanoid;
    private landEntity:Land;
    private hoe:Hoe;

    constructor(
        mapManager: MapManager,
        gridEngine: GridEngine,
        character: Humanoid,
        landEntity: Land,
        hoe: Hoe
    ) {
        super(gridEngine, character);
        this.mapManager = mapManager;
        this.hoe = hoe;
        this.landEntity = landEntity;
        this.mapManager.setPlotLandEntities(this.landEntity);
        console.log('task weed')
    }

    public start() {
        this.status = this.status === TaskStatus.Initialized ? TaskStatus.Running : this.status;
        this.pointer = 1;
        this.next();
    }

    public cancel = () => {
        console.log('cancel task');
        this.status = TaskStatus.Rollback;

        this.gridEngine.stopMovement(this.character.getId());
        this.landEntity.rollbackLand();

        this.mapManager.setPlotLandCoords(this.landEntity.getX() + "-" + this.landEntity.getY(), { isWeeded: false, hasCrop: false });
        const landIndex = this.mapManager.getPlotLandEntities().findIndex(x=> x.getPixelX() === this.tile.pixelX && x.getPixelY() === this.tile.pixelY);
        this.landsMap.splice(landIndex, 1);
        this.status = TaskStatus.Completed;
    }

    public next = () => {
        if(this.status === TaskStatus.Running) {
            switch (this.pointer) {
                case 1:
                    this.moveCharacter();
                    break;
                case 2:
                   this.weedGround();
                    break;
            }
        }
    };

    private moveCharacter() {
        this.pointer = 2;
        this.character.setCharState('walk')
        this.gridEngine.moveTo(this.character.getId(), {
            x: this.landEntity.getX(),
            y: this.landEntity.getY(),
        });
    }

    private weedGround() {
        console.log('weeding');
        this.character.anims.play('attack_right', true);
        //this.character.setCharState('weed')
        setTimeout(() => {
            this.character.anims.restart();
            this.character.anims.stop();
            if(this.status === TaskStatus.Running) {
                this.farmLandMap.set(this.tile.x + "-" + this.tile.y, { isWeeded: true, hasCrop: false });
                this.status = TaskStatus.Completed;
                this.landTile.init();
            }
          }, this.hoe.weedSpeed);
    }
}
