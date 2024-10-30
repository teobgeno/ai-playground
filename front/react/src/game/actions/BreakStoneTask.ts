import { BaseInteractWithItemTask } from "./BaseInteractWithItemTask";
import { MapManager } from "../MapManager";
import { ServiceLocator } from "../core/serviceLocator";
import { GridEngine } from "grid-engine";

import { FarmLand } from "../farm/FarmLand";

import { TaskStatus, Task } from "./types";
import { Character } from "../characters/types";
import { PickAxe } from "../items/PickAxe";

export class BreakStoneTask extends BaseInteractWithItemTask{

    constructor(
        gridEngine: GridEngine,
        character: Character,
        item: PickAxe,
        posX: number,
        posY: number
    ) {
        super(gridEngine, character,item, posX, posY);
        super.setIntervalStep(1000);
    }

    public start() {
        super.start();
    }

    public cancel = () => {
        super.cancel();
    };

    public next = () => {
        if (this.status === TaskStatus.Running) {
            switch (this.pointer) {
                case 1:
                    this.breakStone();
                    break;
                case 2:
                    super.complete();
                    break;

            }
        }
    };

    private breakStone() {
        this.IntervalProcess = setInterval(() => {
                this.breakStonedProc();
            }, super.getIntervalStep())
    }

    private breakStonedProc = () => {
        super.setIntervalTick(super.getIntervalTick() + 1);
        if(super.getIntervalTick() * 1000 === (super.getItem() as PickAxe).getBreakSpeed()) {
            const mapItem = super.getMapItem();
            if(mapItem.getInteractive) {
                mapItem.getInteractive().setIntercativeObject(super.getItem());
                if(mapItem.getInteractive().canInteractWithItem()) {
                    mapItem.getInteractive().interactWithItem();
                }
            }
        }
    }


    public complete() {
        super.complete();
        //this.notifyOrder({characterIdTag: this.character.getIdTag()});
    }

}