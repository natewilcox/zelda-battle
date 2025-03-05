import { GameTextures, WeaponType } from "@natewilcox/zelda-battle-shared";
import { Link } from "../characters/Link";
import { SceneEvents } from "../events/SceneEvents";
import GameScene from "../scenes/GameScene";
import { IComponent } from "../services/ComponentService";


/**
 * Componet for accepting keyboard and mouse input
 */
export default class KeyboardInputComponent implements IComponent {

    //slot assignments
    private slot1Key!: Phaser.Input.Keyboard.Key;
    private slot2Key!: Phaser.Input.Keyboard.Key;
    private storeKey!: Phaser.Input.Keyboard.Key;

    //references to scene inputs for keys and mouse
    private talkKey!: Phaser.Input.Keyboard.Key;
    private actionKey!: Phaser.Input.Keyboard.Key;
    private bombKey!: Phaser.Input.Keyboard.Key;

    private leftKey!: Phaser.Input.Keyboard.Key;
    private rightKey!: Phaser.Input.Keyboard.Key;
    private upKey!: Phaser.Input.Keyboard.Key;
    private downKey!: Phaser.Input.Keyboard.Key;
    private hideKey!: Phaser.Input.Keyboard.Key;
    private unHideKey!: Phaser.Input.Keyboard.Key;
    private mouse: Phaser.Input.Pointer;

    private link!: Link;
    private dir: Phaser.Math.Vector2;

    //flags to prevent repeat
    private allowAttack = true;
    private allowAction = true;
    private allowBomb = true;

    private leftDown = false;
    private rightDown = false;

    /**
     * Creates componemt with scene input reference
     * @param scene 
     */
    constructor(scene: Phaser.Scene) {

        //bind the controls
        this.slot1Key = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.slot2Key = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.storeKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);

        this.talkKey = scene.input.keyboard.addKey('T');
        this.actionKey = scene.input.keyboard.addKey('F');
        this.bombKey = scene.input.keyboard.addKey('R');
        
        this.leftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.rightKey = scene.input.keyboard.addKey('D');
        this.upKey = scene.input.keyboard.addKey('W');
        this.downKey = scene.input.keyboard.addKey('S');

        this.hideKey = scene.input.keyboard.addKey('Q');
        this.unHideKey = scene.input.keyboard.addKey('E');

        this.mouse = scene.input.activePointer;
        this.dir = new Phaser.Math.Vector2();
        
        //when the mouse is release, reset the flag to allow new attacks.
        scene.input.on('pointerup', (pointer) => {

            this.allowAttack = true;
            this.leftDown = this.mouse.leftButtonDown();
            this.rightDown = this.mouse.rightButtonDown();
        });

        scene.input.on('pointerdown', (pointer) => {

            this.leftDown = this.mouse.leftButtonDown();
            this.rightDown = this.mouse.rightButtonDown();
        });

        scene.input.keyboard.on('keyup-F', (e) => {
            this.allowAction = true;
        });

        scene.input.keyboard.on('keyup-R', (e) => {
            this.allowBomb = true;
        });

        this.slot1Key.on('down', () => {
            this.link.events.emit('onslot1');
        });

        this.slot2Key.on('down', () => {
            this.link.events.emit('onslot2');
        });

        this.storeKey.on('down', () => {
            this.link.events.emit('onstore');
        });

        this.talkKey.on('up', (e) => {
            SceneEvents.emit('ontalk');
            scene.input.keyboard.enabled = false;
            scene.input.keyboard.disableGlobalCapture();
        });

        SceneEvents.on('onmenuclosed', () => {
            scene.input.keyboard.enabled = true;
            scene.input.keyboard.enableGlobalCapture();
        });

        SceneEvents.on('ontalking', (event) => {
            (scene as GameScene).serverService.tryTalk(event.msg);
        });

        scene.game.events.addListener(Phaser.Core.Events.BLUR, () => {
            console.warn(`browser lost focus at ${new Date()}. try not to do that`)
            scene.input.keyboard.resetKeys();
        })
    }


    /**
     * Initialize component with GameObject
     * 
     * @param go 
     */
    init(go: Phaser.GameObjects.GameObject) {
        this.link = go as Link;
    }
    

    /**
     * Updates component to poll for keyboard and mouse input.
     * 
     * @param dt 
     * @param t 
     */
     update(dt: number, t: number) {

        if(this.link.hasControl && this.link.stateMachine.isCurrentState("walking")) {

            let dx = 0;
            let dy = 0;

            if(this.allowAttack && this.leftDown && this.link.weaponSlotOne && this.link.weaponSlotOne.weaponType != WeaponType.Shield) {
          
                //this.link.scene.time.delayedCall(100, () => this.link.attack1());
                this.link.attack1();
                this.allowAttack = false;
            }
            else if(this.allowAttack && this.rightDown && this.link.weaponSlotTwo && this.link.weaponSlotTwo.weaponType != WeaponType.Shield) {
                
                
                //this.link.scene.time.delayedCall(100, () => this.link.attack2());
                this.link.attack2();
                this.allowAttack = false;
            }
            else if(this.hideKey.isDown) {
                this.link.hide();
            }
            else if(this.unHideKey.isDown) {
                this.link.unHide();
            }
            else if(this.allowAction && this.actionKey.isDown) {
                
                this.link.action();
                this.allowAction = false;
            }
            else if(this.allowBomb && this.bombKey.isDown) {
                
                this.link.bomb();
                this.allowBomb = false;
            }
            else {

                if(this.leftKey.isDown) {
                    dx = -1;
                }
                else if(this.rightKey.isDown) {
                    dx = 1;
                }
                
                if(this.upKey.isDown) {
                    dy = -1;
                }
                else if(this.downKey.isDown) {
                    dy = 1;
                } 
            }

            this.link.dir.setTo(dx, dy).normalize().scale(this.link.speed);
        }
    }
}
