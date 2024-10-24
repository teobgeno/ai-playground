import { GridEngine } from "grid-engine";
import { ServiceLocator } from "../core/serviceLocator";
import { GameMediator } from "../GameMediator";
import { CharacterController } from "./CharacterController";
import { OrderStatus, TaskStatus } from "../actions/types";
import { Character } from "./types";
import { Humanoid } from "./Humanoid";

export class Hero extends Humanoid implements Character{
    private gridEngine: GridEngine;
    private characterController: CharacterController;
    
    constructor(
        scene: Phaser.Scene,
        texture: string,
        gridEngine: GridEngine,
        id: number,
        idTag: string,
        charName: string
    ) {
        super(scene, texture, id, idTag, charName);
        this.gridEngine = gridEngine;
        this.characterController = new CharacterController(
            this.scene,
            this.gridEngine,
            this.stateMachine,
            this.idTag
        );
    }

    public init() {
        this.createMovementAnimations();
        this.createHumanoidAnimations(this.getIdTag());
        this.getBody().setSize(32, 64);
    }

    update(dt: number): void {
        this.characterController.update(dt);
        //this.updateOrdersQueue();
        //https://www.html5gamedevs.com/topic/40592-how-do-i-call-a-callback-function-when-two-objects-stop-overlapping/
        //console.log(this.getBody().embedded)
    }

    public increaseStamina(staminaAmount: number) {
        const gameMediator = ServiceLocator.getInstance<GameMediator>('gameMediator')!;
        super.increaseStamina(staminaAmount);
        gameMediator.emitEvent('on-player-stamina-change', this.stamina);  
    }

    public decreaseStamina(staminaAmount: number) {
        const gameMediator = ServiceLocator.getInstance<GameMediator>('gameMediator')!;
        super.decreaseStamina(staminaAmount);
        //this.gridEngine.setSpeed(this.getIdTag(), 1);
        gameMediator.emitEvent('on-player-stamina-change', this.stamina);
    }

    private createMovementAnimations() {
        this.createAnimation("right", this.getIdTag(), 143, 147, 15, true, true);
        this.createAnimation("down-right", this.getIdTag(), 143, 147, 15, true, true);
        this.createAnimation("up-right", this.getIdTag(), 143, 147, 15, true, true);
        this.createAnimation("up", this.getIdTag(), 104, 112, 15, true, true);
        this.createAnimation("down", this.getIdTag(), 130, 138, 15, true, true);
        this.createAnimation("left", this.getIdTag(), 117, 121, 15, true, true);
        this.createAnimation("down-left", this.getIdTag(), 117, 121, 15, true, true);
        this.createAnimation("up-left", this.getIdTag(), 117, 121, 15, true, true);
    }

    private createHumanoidAnimations(key: string) {
        const texture = key;
        this.createAnimation("attack_right", texture, 195, 200, 15, true, true);
        this.createAnimation(
            key + "_attack_down",
            texture,
            182,
            187,
            15,
            false,
            true
        );
        this.createAnimation(
            key + "_attack_left",
            texture,
            169,
            174,
            15,
            false,
            true
        );
        this.createAnimation(
            key + "_attack_up",
            texture,
            156,
            161,
            15,
            false,
            true
        );

        this.createAnimation(
            key + "_bow_right",
            texture,
            247,
            259,
            15,
            false,
            true
        );
        this.createAnimation(
            key + "_bow_down",
            texture,
            234,
            246,
            15,
            false,
            true
        );
        this.createAnimation(
            key + "_bow_left",
            texture,
            221,
            233,
            15,
            false,
            true
        );
        this.createAnimation(
            key + "_bow_up",
            texture,
            208,
            220,
            15,
            false,
            true
        );

        this.createAnimation(
            key + "_rest_down",
            texture,
            130,
            130,
            null,
            null,
            null
        );
        this.createAnimation(
            key + "_rest_left",
            texture,
            117,
            117,
            null,
            null,
            null
        );
        this.createAnimation(
            key + "_rest_right",
            texture,
            143,
            143,
            null,
            null,
            null
        );
        this.createAnimation(
            key + "_rest_up",
            texture,
            104,
            104,
            null,
            null,
            null
        );
    }

    public getStopFrame(direction: string) {
        switch (direction) {
            case "up":
                return 104;
            case "up-right":
            case "down-right":
            case "right":
                return 143;
            case "down":
                return 130;
            case "up-left":
            case "down-left":
            case "left":
                return 117;
        }
        return -1;
    }
}
