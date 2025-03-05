import { ICollectible } from "@natewilcox/zelda-battle-shared";
import { IItemState, ItemType } from "@natewilcox/zelda-battle-shared";


/**
 * Class representing bomb collectible
 */
 export class Bomb extends Phaser.Physics.Arcade.Image implements ICollectible {

    id: number;
    itemType: number;
    disabled = true;

    /**
     * Creates a bomb collectible.
     * 
     * @param scene 
     * @param itemState 
     */
    constructor(scene: Phaser.Scene, itemState: IItemState) {
        super(scene, itemState.x, itemState.y, 'bomb');

        this.id = itemState.id;
        this.itemType = ItemType.Bomb;
    }
}


/**
 * Class representing bomb 4-pack collectible
 */
 export class BombFourPack extends Phaser.Physics.Arcade.Image implements ICollectible {

    id: number;
    itemType: number;
    disabled = true;

    /**
     * Creates a bomb 4-pack collectible.
     * 
     * @param scene 
     * @param itemState 
     */
    constructor(scene: Phaser.Scene, itemState: IItemState) {
        super(scene, itemState.x, itemState.y, 'bomb-four-pack');

        this.id = itemState.id;
        this.itemType = ItemType.BombFourPack;
    }
}



/**
 * Class representing bomb 8-pack collectible
 */
 export class BombEightPack extends Phaser.Physics.Arcade.Image implements ICollectible {

    id: number;
    itemType: number;
    disabled = true;

    /**
     * Creates a bomb 8-pack collectible.
     * 
     * @param scene 
     * @param itemState 
     */
    constructor(scene: Phaser.Scene, itemState: IItemState) {
        super(scene, itemState.x, itemState.y, 'bomb-eight-pack');

        this.id = itemState.id;
        this.itemType = ItemType.BombEightPack;
    }
}


/**
 * Class representing bomb 10-pack collectible
 */
 export class BombTenPack extends Phaser.Physics.Arcade.Image implements ICollectible {

    id: number;
    itemType: number;
    disabled = true;

    /**
     * Creates a bomb 10-pack collectible.
     * 
     * @param scene 
     * @param itemState 
     */
    constructor(scene: Phaser.Scene, itemState: IItemState) {
        super(scene, itemState.x, itemState.y, 'bomb-ten-pack');

        this.id = itemState.id;
        this.itemType = ItemType.BombTenPack;
    }
}