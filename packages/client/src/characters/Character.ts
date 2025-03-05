import { IGameObject } from "@natewilcox/zelda-battle-shared";
import { StateMachine } from "@natewilcox/zelda-battle-shared";
import GameScene from "../scenes/GameScene";
import ServerService from "../services/ServerService";

/**
 * Base class for all characters
 */
export default class Character extends Phaser.GameObjects.Container implements IGameObject {

    scene!: GameScene;
    stateMachine: StateMachine = new StateMachine(this, 'character_fsm');
    serverService!: ServerService;

    clientId!: string;
    id!: number;
    _health!: number;
    magic!: number;
    maxMagic!: number;
    rupees!: number;
    bombs!: number;
    arrows!: number;
    keys!: number;
    
    //character speed and direction settings
    speed: number = 100;
    dir: Phaser.Math.Vector2 = new Phaser.Math.Vector2();

    get health() {
        return this._health;
    }

    set health(health: number) {

        const oldValue = this._health;
        this._health = health;

        this.emit('onhealthchanged', this._health, oldValue);
    }

    
    /**
     * Creats a new character container
     * 
     * @param scene 
     * @param x 
     * @param y 
     */
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
    }
}