import { GameTextures, texturesIndex } from "@natewilcox/zelda-battle-shared";
import { IItemState } from "@natewilcox/zelda-battle-shared";
import { ICollectible } from "@natewilcox/zelda-battle-shared";
import { getCollectibleName } from "../utils/Utils";
import GameScene from "../scenes/GameScene";
import ShadowComponent from "../components/ShadowComponent";

/**
 * Class representing am item drop on the map
 */
 export class Collectible extends Phaser.Physics.Arcade.Sprite implements ICollectible {

    id: number;
    name: string;
    itemType: GameTextures;
    disabled = true;
    z = 0;

    /**
     * Creates a blue rupee collectible.
     * 
     * @param scene 
     * @param itemState 
     */
    constructor(scene: Phaser.Scene, itemState: IItemState) {
        super(scene, itemState.x, itemState.y, texturesIndex[itemState.itemType]);

        this.id = itemState.id;
        this.itemType = itemState.itemType;
        this.name = getCollectibleName(itemState.itemType);;

        const dx = itemState.dx != null ? itemState.dx : 0;
        const dy = itemState.dy != null ? itemState.dy : 0;
        const gameScene = scene as GameScene;

        this.anims.play(`${texturesIndex[itemState.itemType]}-item`, true);
        gameScene.componentService.addComponent(this, new ShadowComponent(gameScene));

        const originalHeight = this.displayOriginY;
        const maxHeight = this.displayOriginY + 5;
        const bounceHeight = this.displayOriginY + 3;

        this.setDisplayOrigin(this.displayOriginX, this.displayOriginY + 5);
        this.setVisible(false)

        scene.time.delayedCall(itemState.delay ? itemState.delay : 0, () => {
            
            scene.tweens.timeline({
                targets: this,
                onStart: () => {
                    this.setVisible(true);
                },
                tweens:[
                    { 
                        x: itemState.x + (dx * 0.25),
                        y: itemState.y + (dy * 0.25),
                        displayOriginY: { value: maxHeight },
                        duration: 75,
                        delay: 0
                    },
                    { 
                        x: itemState.x + (dx * 0.5),
                        y: itemState.y + (dy * 0.5),
                        displayOriginY: { value: originalHeight },
                        duration: 75,
                        delay: 0
                    },
                    { 
                        x: itemState.x + (dx * 0.75),
                        y: itemState.y + (dy * 0.75),
                        displayOriginY: { value: bounceHeight },
                        duration: 75,
                        delay: 0
                    },
                    { 
                        x: itemState.x + dx,
                        y: itemState.y + dy,
                        displayOriginY: { value: originalHeight },
                        duration: 75,
                        delay: 0
                    },
                ],
                onComplete: () => {
                
                    this.refreshBody();
                    this.anims.play(`${texturesIndex[itemState.itemType]}-idle`, true);
    
                    //delay 100ms before making it collectible
                    scene.time.delayedCall(500, () => this.disabled = false);
    
                    //remove shadow component
                    gameScene.componentService.destroyComponent(this, ShadowComponent);
                }
    
            });
        });
    }
}