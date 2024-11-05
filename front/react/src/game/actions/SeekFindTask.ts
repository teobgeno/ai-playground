import { BaseTask } from "./BaseTask.ts";
import { GridEngine } from "grid-engine";
import { ServiceLocator } from "../core/serviceLocator.ts";
import { MapManager } from "../MapManager.ts";

import { MapObject, ObjectId } from "../core/types.ts";
import { TaskStatus, Task } from "./types.ts";
import { Storable } from "../items/types.ts";
import { CharacterState, Character } from "../characters/types.ts";

export class SeekFindTask extends BaseTask implements Task {
    private itemToFind: ObjectId;
    private viewDirections: Array<Array<number>>;
    private areaToScan: Array<Array<number>>;
    private processQueue: Array<Array<number | Array<number>>>;

    private areaSet: Set<string> = new Set();
    private seen: Set<string> = new Set();
    private visited: Set<string> = new Set();

    private itemsFoundCoords: Array<Array<number>> = [];
    private optimalPath: Array<Array<number>>;

    private coordsVisited = new Set();
   
    private posX: number;
    private posY: number;
    private intervalStep: number = 0;
    private intervalTick: number = 0;
    private mapItem: MapObject;
    

    constructor(
        gridEngine: GridEngine,
        character: Character,
        itemToFind: ObjectId,
        posX: number,
        posY: number
    ) {
        super(gridEngine, character);
        this.itemToFind = itemToFind;
        this.posX = posX;
        this.posY = posY;
        
        this.status = TaskStatus.Initialized;
        this.areaToScan = [
            [10, 15], [11, 15], [12, 15], [13, 15], [14, 15],
            [10, 16], [11, 16], [12, 16], [13, 16], [14, 16],
            [10, 17], [11, 17], [12, 17], [13, 17], [14, 17]
        ]
        this.viewDirections = [
            [0, 1], [1, 0], [0, -1], [-1, 0],  // right, down, left, up
            [1, 1], [1, -1], [-1, 1], [-1, -1] // diagonals
        ];
        
        this.processQueue = [[this.areaToScan[0][0], this.areaToScan[0][1], []]];
    }

    private scanArea(curPosX: number, curPosY: number) {
        const mapManager = ServiceLocator.getInstance<MapManager>('mapManager')!;
       
        if(this.processQueue.length > 0 && this.seen.size < this.areaSet.size) {

            const [x, y] = this.processQueue.shift();
            const key = `${x},${y}`;

            if (!this.visited.has(key)) {
                this.visited.add(key);
                //path.push([x, y]);
                this.markSeen(x, y);  // Mark all cells within vision radius as seen
            }

            this.viewDirections.forEach(([dx, dy]) => {
                const nx = x + dx;
                const ny = y + dy;
                const nkey = `${nx},${ny}`;
                if (this.areaSet.has(nkey) && !this.visited.has(nkey)) {
                    this.processQueue.push([nx, ny]);
                }
            });
        }
    }

    private isInBoundsAndUnvisited (x: number, y: number) {
        return this.areaToScan.some(coord => coord[0] === x && coord[1] === y) && !this.coordsVisited.has(`${x},${y}`);
    }

    private markSeen(x: number, y: number) {
        this.viewDirections.forEach(([dx, dy]) => {
            for (let r = 0; r <= this.character.getVisionRange(); r++) {
                const nx = x + dx * r;
                const ny = y + dy * r;
                const key = `${nx},${ny}`;
                if (this.areaSet.has(key) && !this.seen.has(key)) {
                    this.seen.add(key);
                }
            }
        });
    }

    
    public setCoord (coord, value) {
        //obj["c" + coord[0] + coord[1]] = { coord: coord, value: value};
    }
    
    public getCoord (coord) {
        //return obj["c" + coord[0] + coord[1]];
    }

    public start() {

        if (this.status === TaskStatus.Initialized) {
            this.setStatus(TaskStatus.Running);
        }

        this.pointer = 1;
        this.next();
    }

    public cancel () {

        // this.setStatus(TaskStatus.Rollback);
        // this.gridEngine.stopMovement(this.character.getIdTag());
        // this.setStatus(TaskStatus.Completed);
    }

    public next() {
        this.updateSharedDataPool({
            positionData: {
                targetMove:  { x: this.posX, y: this.posY },
                targetMoveDistance: [1, 1]
            },
        });
        if (this.status === TaskStatus.Running) {
            switch (this.pointer) {
                case 1:
                    this.scanArea(1, 1);
                    this.pointer = 2;
                    this.next();
                    break;
                case 2:
                    this.complete();
                    break;
                case 3:

                    break;
            }
        }
    }

    public complete () {
        this.processQueue.length > 0 ? this.setStatus(TaskStatus.WaitingNextIteration) :  this.setStatus(TaskStatus.Completed);
        this.notifyOrder({characterIdTag: this.character.getIdTag()});
    }
}
