import { GameTextures, WeaponType } from "@natewilcox/zelda-battle-shared";
import Character from "../characters/Character";
import { Link } from "../characters/Link";
import { IWeapon } from "./IWeapon";

export class GreenPotion implements IWeapon {

    name: string = 'green-potion';

    holder: Character;
    scene: Phaser.Scene;
    textId = GameTextures.GreenPotion;
    weaponType = WeaponType.None;

    private used = false;

    constructor(holder: Character, scene: Phaser.Scene) {
        this.holder = holder;
        this.scene = scene;
    }

    update = (anim?: Phaser.Animations.Animation, frame?: Phaser.Animations.AnimationFrame, slot?: number) => {
        if(!this.used) {
            this.used = true;

            if(slot != null) {
                (this.holder as Link).playEffect(0, -10, 'effects', 'green-effect', true, true, true);
                this.holder.scene.serverService.tryUseGreenPotion(slot);
            }
        }
    }
}

export class RedPotion implements IWeapon {

    name: string = 'red-potion';

    holder: Character;
    scene: Phaser.Scene;
    textId = GameTextures.RedPotion;
    weaponType = WeaponType.None;
    
    private used = false;

    constructor(holder: Character, scene: Phaser.Scene) {
        this.holder = holder;
        this.scene = scene;
    }

    update = (anim?: Phaser.Animations.Animation, frame?: Phaser.Animations.AnimationFrame, slot?: number) => {
        if(!this.used) {
            this.used = true;

            if(slot != null) {
                (this.holder as Link).playEffect(0, -10, 'effects', 'red-effect', true, true, true);
                this.holder.scene.serverService.tryUseRedPotion(slot);
            }
        }
    }
}

export class BluePotion implements IWeapon {

    name: string = 'blue-potion';

    holder: Character;
    scene: Phaser.Scene;
    textId = GameTextures.BluePotion;
    weaponType = WeaponType.None;

    private used = false;

    constructor(holder: Character, scene: Phaser.Scene) {
        this.holder = holder;
        this.scene = scene;
    }

    update = (anim?: Phaser.Animations.Animation, frame?: Phaser.Animations.AnimationFrame, slot?: number) => {
        if(!this.used) {
            this.used = true;

            if(slot != null) {
                (this.holder as Link).playEffect(0, -10, 'effects', 'blue-effect', true, true, true);
                this.holder.scene.serverService.tryUseBluePotion(slot);
            }
        }
    }
}