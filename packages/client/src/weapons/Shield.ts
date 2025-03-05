import { directionLookupMap, GameTextures, texturesIndex, WeaponType } from "@natewilcox/zelda-battle-shared";
import Character from "../characters/Character";
import { Link } from "../characters/Link";
import { IWeapon } from "./IWeapon";


export class BlueShield implements IWeapon {

    holder: Character;
    scene: Phaser.Scene;
    textId = GameTextures.BlueShield;
    weaponType = WeaponType.Shield;

    constructor(holder: Character, scene: Phaser.Scene) {
        this.holder = holder;
        this.scene = scene;
    }

    start = (anim?: Phaser.Animations.Animation, frame?: Phaser.Animations.AnimationFrame, slot?: number, sprite?: Phaser.GameObjects.Sprite) => {

        if(anim) {
            
            sprite?.setVisible(true);

            const parts = anim.key.split("-");
            const dir = parts[2] != undefined ? parts[2] : 'south';
            const action = parts[1] != undefined ? parts[1] : 'stand';

            //sword left and right do not show shield
            if((action == 'stand' || action == 'walk' || action=='run') || ((action == 'sword' || action == 'hammer') && dir != 'west' && dir != 'east')) {
 
                const shieldAnim = `blue-shield-${action}-${dir}`;
                sprite?.anims.play(shieldAnim, false);

                switch(dir) {
                    case 'north':
                        sprite?.setPosition(5, -3);
                        this.holder.bringToTop((this.holder as Link).linkSprite);
                        break;

                    case 'south':
                        sprite?.setPosition(-4, 0);
                        this.holder.bringToTop(sprite!);
                        break;

                    case 'east':
                        sprite?.setPosition(8, -3);
                        this.holder.bringToTop((this.holder as Link).linkSprite);
                        break;

                    case 'west':
                        sprite?.setPosition(-9, -3);
                        this.holder.bringToTop((this.holder as Link).linkSprite);
                        break;
                }
            }
            else {
                sprite?.setVisible(false);
            }
        }
    }

    update = (anim?: Phaser.Animations.Animation, frame?: Phaser.Animations.AnimationFrame, slot?: number, sprite?: Phaser.GameObjects.Sprite) => {
      

    }
}