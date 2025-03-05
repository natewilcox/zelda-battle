import { Link } from "../characters/Link";
import GameScene from "../scenes/GameScene";
import { IComponent } from "../services/ComponentService";


/**
 * Componet for accepting touch input
 */
export default class TouchInputComponent implements IComponent {


    private link!: Link;
    private direction: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);

    private scene: Phaser.Scene;
    private pointer: Phaser.Input.Pointer;
    private move_to_x!: number;
    private move_to_y!: number;

    /**
     * Creates componemt with scene input reference
     * @param scene 
     */
    constructor(scene: Phaser.Scene) {

        this.scene = scene;
        this.pointer = this.scene.input.activePointer;

        scene.input.on('pointerdown', (pointer) => {
            
            if(this.link.stateMachine.isCurrentState("walking")) {

                this.move_to_x = pointer.x + this.scene.cameras.main.scrollX;
                this.move_to_y = pointer.y + this.scene.cameras.main.scrollY;

                this.scene.physics.moveTo(this.link, this.move_to_x, this.move_to_y, this.link.speed);
            }
         });
    }


    /**
     * Initialize component with GameObject
     * 
     * @param go 
     */
    init(go: Phaser.GameObjects.GameObject) {
        this.link = go as Link;

        this.move_to_x = this.link.x;
        this.move_to_y = this.link.y;
    }
    

    /**
     * Updates component to poll for touch input
     * 
     * @param dt 
     * @param t 
     */
     update(dt: number, t: number) {

        if(this.link.stateMachine.isCurrentState("walking")) {

            
            //move towards the touch point unless within 2 pixels away.
            if(Math.abs(this.move_to_x - this.link.x) < 2 && Math.abs(this.move_to_y - this.link.y) < 2) {
                this.link.setVelocity(0, 0);
            }
            else {
                this.scene.physics.moveTo(this.link, this.move_to_x, this.move_to_y, this.link.speed);
            }
        }
    }
}
