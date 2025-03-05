import { IGameObject } from "@natewilcox/zelda-battle-shared";
import { Link } from "../characters/Link";
import GameScene from "../scenes/GameScene";
import { IComponent } from "../services/ComponentService";

export enum ShadowSize {
    Small,
    Medium,
    Large
}

/**
 * Componet for accepting touch input
 */
export default class ShadowComponent implements IComponent {


    private go!: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform & Phaser.GameObjects.Components.Depth & Phaser.GameObjects.Components.Origin & IGameObject;
    private scene: Phaser.Scene;
    private shadowImage!: Phaser.GameObjects.Image;

    /**
     * Creates componemt with scene input reference
     * @param scene 
     */
    constructor(scene: Phaser.Scene) {

        this.scene = scene;
    }


    /**
     * Initialize component with GameObject
     * 
     * @param go 
     */
    init(go: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform & Phaser.GameObjects.Components.Depth & Phaser.GameObjects.Components.Origin & IGameObject) {
        this.go = go;

        //add shadow and make sure its under the game object
        this.shadowImage = this.scene.add.image(-100, -100, 'small-shadow');
        this.go.setDepth(this.shadowImage.depth+1);
    }
    

    start() {

        
    }

    /**
     * Updates component to poll for touch input
     * 
     * @param dt 
     * @param t 
     */
    update(dt: number, t: number) {

        this.shadowImage.x = this.go.x;
        this.shadowImage.y = this.go.y+1;
    }

    destroy() {
        this.shadowImage.destroy();
    }
}
