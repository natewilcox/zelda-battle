import { ICollectible } from "@natewilcox/zelda-battle-shared";
import { IItemState, ItemType } from "@natewilcox/zelda-battle-shared";


/**
 * Class representing arrow collectible
 */
 export class Arrow extends Phaser.Physics.Arcade.Image implements ICollectible {

    id: number;
    itemType: number;
    disabled = true;

    /**
     * Creates an arrow collectible.
     * 
     * @param scene 
     * @param itemState 
     */
    constructor(scene: Phaser.Scene, itemState: IItemState) {
        super(scene, itemState.x, itemState.y, 'arrow');

        this.id = itemState.id;
        this.itemType = ItemType.Arrow;
    }
}


/**
 * Class representing arrow five pack collectible
 */
 export class ArrowFivePack extends Phaser.Physics.Arcade.Image implements ICollectible {

    id: number;
    itemType: number;
    disabled = true;

    /**
     * Creates a 5-pack of arrows collectible.
     * 
     * @param scene 
     * @param itemState 
     */
    constructor(scene: Phaser.Scene, itemState: IItemState) {
        super(scene, itemState.x, itemState.y, 'arrow-five-pack');

        this.id = itemState.id;
        this.itemType = ItemType.ArrowFivePack;
    }
}



/**
 * Class representing arrow ten pack collectible
 */
 export class ArrowTenPack extends Phaser.Physics.Arcade.Image implements ICollectible {

    id: number;
    itemType: number;
    disabled = true;

    /**
     * Creates a 10-pack of arrows collectible.
     * 
     * @param scene 
     * @param itemState 
     */
    constructor(scene: Phaser.Scene, itemState: IItemState) {
        super(scene, itemState.x, itemState.y, 'arrow-ten-pack');

        this.id = itemState.id;
        this.itemType = ItemType.ArrowTenPack;
    }
}