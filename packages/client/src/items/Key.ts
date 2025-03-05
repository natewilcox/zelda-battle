import { ICollectible } from "@natewilcox/zelda-battle-shared";
import { IItemState, ItemType } from "@natewilcox/zelda-battle-shared";


/**
 * Class representing small key collectible
 */
export class SmallKey extends Phaser.Physics.Arcade.Image implements ICollectible {

    id: number;
    itemType: number;
    disabled = true;

    /**
     * Creates a small key collectible.
     * 
     * @param scene 
     * @param itemState 
     */
    constructor(scene: Phaser.Scene, itemState: IItemState) {
        super(scene, itemState.x, itemState.y, 'small-key');

        this.id = itemState.id;
        this.itemType = ItemType.SmallKey;
    }
}