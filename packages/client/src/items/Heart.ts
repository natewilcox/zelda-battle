import { ICollectible } from "@natewilcox/zelda-battle-shared";
import { IItemState, ItemType } from "@natewilcox/zelda-battle-shared";


/**
 * Class representing heart collectible
 */
export class Heart extends Phaser.Physics.Arcade.Image implements ICollectible {

    id: number;
    itemType: number;
    disabled = true;

    /**
     * Creates a heart collectible.
     * 
     * @param scene 
     * @param itemState 
     */
    constructor(scene: Phaser.Scene, itemState: IItemState) {
        super(scene, itemState.x, itemState.y, 'heart');

        this.id = itemState.id;
        this.itemType = ItemType.Heart;
    }
}