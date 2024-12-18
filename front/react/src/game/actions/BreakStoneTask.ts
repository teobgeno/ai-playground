import { BaseInteractWithItemTask } from "./BaseInteractWithItemTask";

import { GridEngine } from "grid-engine";

import { MapObject } from "../core/types.ts";
import { TaskStatus } from "./types";
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
        const mapItem = super.getAvailableMapItem()!;
        //TODO:: chcek if character is near the item
        if(mapItem) {
            this.IntervalProcess = setInterval(() => {
                this.breakStonedProc(mapItem);
            }, super.getIntervalStep())
        } else {
            this.setStatus(TaskStatus.Error);
            this.notifyOrder({characterIdTag: this.character.getIdTag()});
            console.warn('cannot find mapitem');
        }
    }

    private breakStonedProc = (mapItem: MapObject) => {
        super.setIntervalTick(super.getIntervalTick() + 1);
        if(super.getIntervalTick() * 1000 === (super.getItem() as PickAxe).getBreakSpeed()) {
            if(mapItem.getInteractive) {
                mapItem.getInteractive().interactWithItem();
                clearInterval(this.IntervalProcess);
                this.pointer = 2;
                this.next();
            }
        }
    }


    public complete() {
        super.complete();
        //this.notifyOrder({characterIdTag: this.character.getIdTag()});
    }

}