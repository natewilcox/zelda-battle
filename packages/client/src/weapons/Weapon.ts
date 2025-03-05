import { GameTextures, WeaponType } from "@natewilcox/zelda-battle-shared";

export class Weapon {

    textId = GameTextures.Sword1;
    weaponType = WeaponType.Sword;
    
    constructor() {
    }

    checkContact = (anim: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {};
}