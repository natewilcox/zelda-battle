import { GameTextures, WeaponType } from "@natewilcox/zelda-battle-shared";
import Character from "../characters/Character";

export interface IWeapon {

    holder: Character;
    scene: Phaser.Scene;
    textId: GameTextures;
    weaponType: WeaponType;

    update: (anim?: Phaser.Animations.Animation, frame?: Phaser.Animations.AnimationFrame, slot?: number, sprite?: Phaser.GameObjects.Sprite) => void;
}