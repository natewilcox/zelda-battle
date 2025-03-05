import { GameTextures, WeaponType } from "@natewilcox/zelda-battle-shared";
import { ICollectible } from "@natewilcox/zelda-battle-shared";
import { IItemState, ItemType } from "@natewilcox/zelda-battle-shared";


/**
 * Class representing green rupee collectible
 */
export class GreenRupee extends Phaser.Physics.Arcade.Sprite implements ICollectible {

    id: number;
    itemType: number;
    textId = GameTextures.GreenRupee;
    weaponType = WeaponType.Item;
    disabled = true;

    /**
     * Creates a green rupee collectible.
     * 
     * @param scene 
     * @param itemState 
     */
    constructor(scene: Phaser.Scene, itemState: IItemState) {
        super(scene, itemState.x, itemState.y, 'green-rupee');

        this.id = itemState.id;
        this.itemType = ItemType.GreenRupee;

        this.anims.play('green-rupee-idle', true);
    }
}


/**
 * Class representing red rupee collectible
 */
 export class RedRupee extends Phaser.Physics.Arcade.Sprite implements ICollectible {

    id: number;
    itemType: number;
    textId = GameTextures.RedRupee;
    weaponType = WeaponType.Item;
    disabled = true;

    /**
     * Creates a red rupee collectible.
     * 
     * @param scene 
     * @param itemState 
     */
    constructor(scene: Phaser.Scene, itemState: IItemState) {
        super(scene, itemState.x, itemState.y, 'red-rupee');

        this.id = itemState.id;
        this.itemType = ItemType.RedRupee;

        this.anims.play('red-rupee-idle', true);
    }
}


/**
 * Class representing blue rupee collectible
 */
 export class BlueRupee extends Phaser.Physics.Arcade.Sprite implements ICollectible {

    id: number;
    itemType: number;
    textId = GameTextures.BlueRupee;
    weaponType = WeaponType.Item;
    disabled = true;
    
    /**
     * Creates a blue rupee collectible.
     * 
     * @param scene 
     * @param itemState 
     */
    constructor(scene: Phaser.Scene, itemState: IItemState) {
        super(scene, itemState.x, itemState.y, 'blue-rupee');

        this.id = itemState.id;
        this.itemType = ItemType.BlueRupee;

        this.anims.play('blue-rupee-idle', true);
    }
}