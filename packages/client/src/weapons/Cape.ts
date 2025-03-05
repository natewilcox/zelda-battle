import { GameTextures, WeaponType } from "@natewilcox/zelda-battle-shared";
import Character from "../characters/Character";
import { IWeapon } from "./IWeapon";

export class Cape implements IWeapon {

    name: string = 'cape';

    holder: Character;
    scene: Phaser.Scene;
    textId = GameTextures.Cape;
    weaponType = WeaponType.None;

    //flag to tell if the holder is wearing the cape.
    wearing = false;

    constructor(holder: Character, scene: Phaser.Scene) {
        this.holder = holder;
        this.scene = scene;
    }

    update = () => {
        this.wearing = !this.wearing;
        this.holder.scene.serverService.tryUseCape(this.wearing);
    }
}