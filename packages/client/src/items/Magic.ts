import { ICollectible } from "@natewilcox/zelda-battle-shared";
import { IItemState, ItemType } from "@natewilcox/zelda-battle-shared";


/**
 * Class representing magic jar collectible
 */
export class MagicJar extends Phaser.Physics.Arcade.Image implements ICollectible {

    id: number;
    itemType: number;
    disabled = true;

    /**
     * Creates a magic jar collectible.
     * 
     * @param scene 
     * @param itemState 
     */
    constructor(scene: Phaser.Scene, itemState: IItemState) {
        super(scene, itemState.x, itemState.y, 'magic-jar');

        this.id = itemState.id;
        this.itemType = ItemType.MagicJar;
    }
}


/**
 * Class representing magic bottle collectible
 */
 export class MagicBottle extends Phaser.Physics.Arcade.Image implements ICollectible {

    id: number;
    itemType: number;
    disabled = true;

    /**
     * Creates a magic bottle collectible.
     * 
     * @param scene 
     * @param itemState 
     */
    constructor(scene: Phaser.Scene, itemState: IItemState) {
        super(scene, itemState.x, itemState.y, 'magic-bottle');

        this.id = itemState.id;
        this.itemType = ItemType.MagicBottle;
    }
}