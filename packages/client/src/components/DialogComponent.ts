import { IGameObject } from "@natewilcox/zelda-battle-shared";
import { IComponent } from "../services/ComponentService";

export enum ShadowSize {
    Small,
    Medium,
    Large
}

/**
 * Componet for showing dialog window
 */
export default class DialogComponent implements IComponent {


    private go!: Phaser.GameObjects.GameObject;
    private scene: Phaser.Scene;

    private dialog?: Phaser.GameObjects.BitmapText;
    private dialogWindowGroup?: Phaser.GameObjects.Rectangle;

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
    init(go: Phaser.GameObjects.GameObject) {
        this.go = go;
    }
    

    start() {

        
    }

    /**
     * Updates component to sync dialog window position
     * 
     * @param dt 
     * @param t 
     */
    update(dt: number, t: number) {

        //this.shadowImage.x = this.go.x;
        //this.shadowImage.y = this.go.y+1;
    }

    destroy() {
        this.dialog?.destroy();
        this.dialogWindowGroup?.destroy();
    }
}
