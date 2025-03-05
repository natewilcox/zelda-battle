import { IGameObject } from "@natewilcox/zelda-battle-shared";
import { Link } from "../characters/Link";
import GameScene from "../scenes/GameScene";
import { IComponent } from "../services/ComponentService";


/**
 * Componet for showing damage taken to characters
 */
export default class ShowDamageComponent implements IComponent {


    private go!: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform & IGameObject;
    private scene: Phaser.Scene;

    //heart and text objects
    private damageMessage!: Phaser.GameObjects.BitmapText;
    private damageHeart!: Phaser.GameObjects.Image;

    /**
     * Creates componemt with scene input reference
     * @param scene 
     */
    constructor(scene: Phaser.Scene) {

        this.scene = scene;
    }


    /**
     * Handler for when the go health attribute changes.
     * 
     * @param newValue 
     * @param oldValue 
     */
    private healthChangedHandler = (newValue: number, oldValue: number) => {
        
        const diff = newValue - oldValue;

        //if value goes down but still above 0
        if(diff < 0 && newValue > 0) {

            this.damageMessage.setText(`${diff}`);
            this.damageHeart.setVisible(true);
            this.damageMessage.setVisible(true);

            //hide after 500 seconds
            this.scene.time.delayedCall(500, () => {
                this.damageHeart.setVisible(false);
                this.damageMessage.setVisible(false);
            })
        }
    }

    /**
     * Initialize component with GameObject
     * 
     * @param go 
     */
    init(go: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform & IGameObject) {
        this.go = go;
    }
    

    /**
     * Create the obejcts needed to show damage counter
     */
    start() {

        this.damageHeart = this.scene.add.image(this.go.x + 7, this.go.y - 21, 'heart');
        this.damageHeart.setVisible(false);
        this.damageHeart.setDepth(300);
        this.damageMessage = this.scene.add.bitmapText(this.go.x - 5, this.go.y - 20, 'minecraft', '-3');
        this.damageMessage.setVisible(false);
        this.damageMessage.setFontSize(10);
        this.damageMessage.setOrigin(0.5);
        this.damageMessage.setDepth(300);
        
        this.go.on('onhealthchanged', this.healthChangedHandler);
    }
    

    /**
     * Updates component to move the damage counter with the game object
     * 
     * @param dt 
     * @param t 
     */
    update(dt: number, t: number) {

        //if not define or not visible, do nothing
        if(!this.damageHeart || !this.damageMessage || !this.damageHeart.visible) return;

        this.damageHeart.x = this.go.x + 7;
        this.damageHeart.y = this.go.y - 21;

        this.damageMessage.x = this.go.x - 5;
        this.damageMessage.y = this.go.y - 20;
    }


    /**
     * Destroyts the obejcst and removes the event handler from the game object.
     */
    destroy() {

        this.go.off('onhealthchanged', this.healthChangedHandler);

        this.damageHeart.destroy();
        this.damageMessage.destroy();
    }
}
