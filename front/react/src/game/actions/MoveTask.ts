import { GridEngine, LayerPosition  } from "grid-engine";
import { BaseTask } from "./BaseTask";

import { ServiceLocator } from "../core/serviceLocator";
import { TimeManager } from "../TimeManager";

import { TaskStatus, Task } from "./types";
import { CharacterState, Character } from "../characters/types";


export class MoveTask extends BaseTask implements Task{
    private posX: number;
    private posY: number;
    private pathTickCount: number = 0;
    private distanceFromTarget: Array<number> = [0, 0]; // min, max

    constructor(
        gridEngine: GridEngine,
        character: Character,
        posX: number,
        posY: number,
        distanceFromTarget: Array<number>
    ) {
        super(gridEngine, character);
        this.posX = posX;
        this.posY = posY;
        this.distanceFromTarget = distanceFromTarget;
        this.status = TaskStatus.Initialized;
    }

    public setPosX(posX: number) {
        this.posX = posX;
    }

    public getPosX() {
        return this.posX;
    }

    public setPosY(posY: number) {
        this.posY = posY;
    }

    public getPosY() {
        return this.posY;
    }

    public setDistanceFromTarget(distanceFromTarget: Array<number>) {
        this.distanceFromTarget = distanceFromTarget;
    }

    public getDistanceFromTarget() {
        return this.distanceFromTarget;
    }


    public start() {

        if (this.status === TaskStatus.Initialized) {
            this.setStatus(TaskStatus.Running);
        }

        super.start(this);
        this.modifyPropertiesFromShared();
        this.pointer = 1;
        this.next();
    }

    public cancel = () => {
        this.clearForExit();
        this.setStatus(TaskStatus.Rollback);
        this.gridEngine.stopMovement(this.character.getIdTag());
        this.setStatus(TaskStatus.Completed);
    };

    public next() {

        if (this.status === TaskStatus.Running) {
            switch (this.pointer) {
                case 1:
                    [this.posX, this.posY] = this.calculateTargetPosition();
                    if(this.posX && this.posY) {
                        this.pointer = 2;
                        this.next();
                    } else {
                        this.clearForExit();
                        this.setStatus(TaskStatus.Error);
                        this.notifyOrder({characterIdTag: this.character.getIdTag()});
                        console.warn('error cannot move');
                    }
                    break;
                case 2:
                    if(this.shouldMoveCharacter()) {
                        this.moveCharacter()
                    } else {
                        this.pointer = 3;
                        this.next();
                    }
                    break;
                case 3:
                    this.complete();
                    break;
            }
        }
    }

    public complete = () => {
        this.clearForExit();
        this.character.setCharState(CharacterState.IDLE);
        if (this.status === TaskStatus.Running) {
            this.setStatus(TaskStatus.Completed);
            this.notifyOrder({characterIdTag: this.character.getIdTag()});
        }
    };

    public getMoveDestinationPoint() {
        return { x: this.posX, y: this.posY };
    }

    private calculateTargetPosition() {

        const directions = [
            [0, 1], [1, 0], [0, -1], [-1, 0],  // right, down, left, up
            [1, 1], [1, -1], [-1, 1], [-1, -1] // diagonals
        ];

        let tileToMove: Array<number> = [];

         //check movement to min = 0 distance. On tile
        if(this.distanceFromTarget[0] === 0 && this.distanceFromTarget[1] === 0) {
            if(this.canMoveCharacter(this.posX, this.posY)) {
                tileToMove = [this.posX, this.posY];
            }
        }

        //check movement to min, max distance. Around tile
        if(tileToMove.length === 0) {
            for (let r = this.distanceFromTarget[0]; r <= this.distanceFromTarget[1]; r++) {

                if(tileToMove.length > 0) break;

                for (let i = 0; i < directions.length; i++) {
                    const nx = this.posX + directions[i][0] * r;
                    const ny = this.posY + directions[i][1] * r;
        
                    if(this.canMoveCharacter(nx, ny)) {
                        tileToMove = [nx, ny];
                        break;
                    }
                }
            }
        }
        
        return tileToMove;
    }

    private canMoveCharacter(targX: number, targY: number) {
        const characterPos = this.gridEngine.getPosition(
            this.character.getIdTag()
        );

        if (characterPos.x === targX && characterPos.y === targY) {
            return true;
        }

        if(this.gridEngine.isBlocked({ x: targX, y: targY },"CharLayer")) {
            return false;
        }

        return true;
    }

    private shouldMoveCharacter() {
        const characterPos = this.gridEngine.getPosition(
            this.character.getIdTag()
        );
        if (characterPos.x === this.posX && characterPos.y === this.posY) {
            return false;
        }
      
        return true;
    }

    private moveCharacter() {

        if(this.character.getLevelOfDetail() === 0 && this.character.isNpc) {
            this.tickMove();
        } 

        if(this.character.getLevelOfDetail() === 1 && this.character.isNpc) {
            this.animateMove();
        }

        if(!this.character.isNpc) {
            this.animateMove();
        }
    }

    private tickMove() {
      const tickPath = this.getTickPath();
      if(tickPath.realSecs > 0) {
        this.pathTickCount = 0;
        const stepTime = ( 1 / this.gridEngine.getSpeed( this.character.getIdTag() ) ) * 1000;
        this.IntervalProcess = setInterval(() =>{this.tickProgressMove(tickPath.realSecs, tickPath.path)}, stepTime)
      } else {
        this.pointer = 3;
        this.gridEngine.setPosition(
            this.character.getIdTag(),
            {
                x :  tickPath.path[tickPath.path.length - 1].position.x,
                y:  tickPath.path[tickPath.path.length - 1].position.y
            },
            'CharLayer'
        )
      }
    }

    private tickProgressMove(secs: number, path: Array<LayerPosition>) {
        this.pathTickCount ++;
        if( this.pathTickCount < path.length) {

            this.gridEngine.setPosition(
                this.character.getIdTag(),
                {
                    x : path[this.pathTickCount].position.x,
                    y: path[this.pathTickCount].position.y
                },
                'CharLayer'
            )
            
        } else{
            clearInterval(this.IntervalProcess);
            this.pointer = 3;
            this.next();
        }
    }

    private getTickPath() {
        const timeManager = ServiceLocator.getInstance<TimeManager>('timeManager')!;
        
        const characterPos = this.gridEngine.getPosition(
            this.character.getIdTag()
        );

        const shortestPath = this.gridEngine.findShortestPath(
            {
                charLayer: 'CharLayer',
                position: {
                    x : characterPos.x,
                    y: characterPos.y
                }
            },
            {
                charLayer: 'CharLayer',
                position: {
                    x : this.posX,
                    y: this.posY
                }
            }
        );
         
        const cost = Math.ceil( ( shortestPath.path.length - 2 ) / this.gridEngine.getSpeed( this.character.getIdTag() ) );
        /*
        //TODO:: fast forward action if from pause
        Check pause game time. timeToSimulate = currentGameTime - pauseGameTime
        Simulate all order-tasks till timeToSimulate = 0
        For the following  timeToSimulate = timeToSimulate - gameSecs
        Modify cost to 0 to return 0 durations
        */

        const ret = {
            gameSecs : cost * timeManager.scaleFactor,
            realSecs : cost,
            path: shortestPath.path
        }

        return ret;
    }

    private animateMove() {
        this.character.setCharState(CharacterState.AUTOWALK);
        this.pointer = 3;
        this.gridEngine.moveTo(this.character.getIdTag(), {
            x: this.posX,
            y: this.posY,
        });
    }

}
