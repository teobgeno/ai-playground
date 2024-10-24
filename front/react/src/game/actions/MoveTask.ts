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

    constructor(
        gridEngine: GridEngine,
        character: Character,
        posX: number,
        posY: number
    ) {
        super(gridEngine, character);
        this.posX = posX;
        this.posY = posY;
        
        this.status = TaskStatus.Initialized;
    }

    public start() {

        if (this.status === TaskStatus.Initialized) {
            this.setStatus(TaskStatus.Running);
        }

        this.pointer = 1;
        this.next();
    }

    public cancel = () => {

        this.setStatus(TaskStatus.Rollback);
        this.gridEngine.stopMovement(this.character.getIdTag());
        this.setStatus(TaskStatus.Completed);
    };

    public next() {

        if (this.status === TaskStatus.Running) {
            switch (this.pointer) {
                case 1:
                    if(this.canMoveCharacter()) {
                        this.pointer = 2;
                        this.next();
                    } else {
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
        this.character.setCharState(CharacterState.IDLE);
        if (this.status === TaskStatus.Running) {
            this.setStatus(TaskStatus.Completed);
            this.notifyOrder({characterIdTag: this.character.getIdTag()});
        }
    };

    public getMoveDestinationPoint() {
        return { x: this.posX, y: this.posY };
    }

    private canMoveCharacter() {
        const characterPos = this.gridEngine.getPosition(
            this.character.getIdTag()
        );

        if (characterPos.x === this.posX && characterPos.y === this.posY) {
            return true;
        }

        if(this.gridEngine.isBlocked({ x: this.posX, y: this.posY },"CharLayer")) {
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

        if(this.character.getLevelOfDetail() === 1 && this.character.isNpc) {
            this.tickMove();
        } 

        if(this.character.getLevelOfDetail() === 0 && this.character.isNpc) {
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
            this.pointer = 3;
            clearInterval(this.IntervalProcess);
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
