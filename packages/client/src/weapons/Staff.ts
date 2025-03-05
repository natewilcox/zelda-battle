import { Direction, directionLookupMap, GameTextures, WeaponType } from "@natewilcox/zelda-battle-shared";
import Character from "../characters/Character";
import GameScene from "../scenes/GameScene";
import { IWeapon } from "./IWeapon";

export class Staff implements IWeapon {

    name: string = 'staff';

    holder: Character;
    scene: Phaser.Scene;
    textId = GameTextures.Staff;
    weaponType = WeaponType.Staff;

    magicSprite!: Phaser.GameObjects.Sprite;

    constructor(holder: Character, scene: Phaser.Scene) {
        this.holder = holder;
        this.scene = scene;
    }

    update = (anim?: Phaser.Animations.Animation, frame?: Phaser.Animations.AnimationFrame) => {
        
        if(this.holder.magic < 10) return;

        const dir = directionLookupMap.get(anim!.key.split("-")[2]);
        if(frame == null || dir == null) return;

        if(frame.index == 1) this.magicSprite = this.scene.add.sprite(0, 0, 'effects');

        staffFlash(this.scene, this.holder, this.magicSprite, frame.index, dir, () => {
            this.placeBlocks(dir);
        });
    }

    private placeBlocks = (dir: Direction) => {

        //collect 4 adjacent tiles in 4 directions
        switch(dir) {
            case Direction.North : 
                (this.scene as GameScene).serverService.tryPlaceBlock(Math.floor(this.holder.x/8), Math.floor(this.holder.y/8)-2, dir);
                break;
                
            case Direction.South : 
                (this.scene as GameScene).serverService.tryPlaceBlock(Math.floor(this.holder.x/8), Math.floor(this.holder.y/8)+2, dir);
                break;

            case Direction.East : 
                (this.scene as GameScene).serverService.tryPlaceBlock(Math.floor(this.holder.x/8)+2, Math.floor(this.holder.y/8), dir);
                break;

            case Direction.West : 
                (this.scene as GameScene).serverService.tryPlaceBlock(Math.floor(this.holder.x/8)-2, Math.floor(this.holder.y/8), dir);
                break;
        }
    }
}

export class YellowStaff implements IWeapon {

    name: string = 'yellowstaff';

    holder: Character;
    scene: Phaser.Scene;
    textId = GameTextures.YellowStaff;
    weaponType = WeaponType.Staff;

    magicSprite!: Phaser.GameObjects.Sprite;

    constructor(holder: Character, scene: Phaser.Scene) {
        this.holder = holder;
        this.scene = scene;
    }

    update = (anim?: Phaser.Animations.Animation, frame?: Phaser.Animations.AnimationFrame) => {
   
        if(this.holder.magic < 10) return;

        const dir = directionLookupMap.get(anim!.key.split("-")[2]);
        if(frame == null || dir == null) return;

        if(frame.index == 1) this.magicSprite = this.scene.add.sprite(0, 0, 'effects');

        staffFlash(this.scene, this.holder, this.magicSprite, frame.index, dir, () => {
            this.shootLightening(dir);
        });
    }

    private shootLightening = (dir: Direction) => {

        //collect 4 adjacent tiles in 4 directions
        switch(dir) {
            case Direction.North : 
                (this.scene as GameScene).serverService.tryShootLightening(this.holder.x-7, this.holder.y-22, dir);
                break;
                
            case Direction.South : 
                (this.scene as GameScene).serverService.tryShootLightening(this.holder.x+3, this.holder.y+18, dir);
                break;

            case Direction.East : 
                (this.scene as GameScene).serverService.tryShootLightening(this.holder.x+22, this.holder.y, dir);
                break;

            case Direction.West : 
                (this.scene as GameScene).serverService.tryShootLightening(this.holder.x-22, this.holder.y, dir);
                break;
        }
    }
}

export class BlueStaff implements IWeapon {

    name: string = 'bluestaff';

    holder: Character;
    scene: Phaser.Scene;
    textId = GameTextures.BlueStaff;
    weaponType = WeaponType.Staff;

    magicSprite!: Phaser.GameObjects.Sprite;

    //flag to tell if the holder is wearing the cape.
    isActive = false;

    constructor(holder: Character, scene: Phaser.Scene) {
        this.holder = holder;
        this.scene = scene;
    }

    update = (anim?: Phaser.Animations.Animation, frame?: Phaser.Animations.AnimationFrame) => {
    
        if(this.holder.magic < 1) return;

        const dir = directionLookupMap.get(anim!.key.split("-")[2]);
        if(frame == null || dir == null) return;

        if(frame.index == 1) this.magicSprite = this.scene.add.sprite(0, 0, 'effects');

        staffFlash(this.scene, this.holder, this.magicSprite, frame.index, dir, () => {
            this.spawnShield();
        });
    }

    private spawnShield = () => {
        //create the shield sprites
        this.isActive = !this.isActive;
        (this.scene as GameScene).serverService.tryCreateShield(this.isActive);
    } 
}

const staffFlash = (scene: Phaser.Scene, holder: Character, sprite: Phaser.GameObjects.Sprite, frameIndex: number, dir: Direction, onComplete: () => void) => {

        const c = getFlashCords(frameIndex, dir);

        if(frameIndex == 1) {

            sprite.setPosition(holder.x + c!.x, holder.y + c!.y);
            sprite.anims.play('magic-spawn-intro');
        }
        else if(frameIndex == 2) {

            sprite.setPosition(holder.x + c!.x, holder.y + c!.y);
            sprite.anims.play('magic-spawn-mid');
        }
        else if(frameIndex == 3) {

            sprite.setPosition(holder.x + c!.x, holder.y + c!.y);

            scene.time.delayedCall(200, () => {

                sprite.anims.play('magic-spawn-end');
                sprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'magic-spawn-end', () => {
                    sprite.destroy();
                });
            });

            if(onComplete) {
                onComplete();
            }
        }
};

const getFlashCords = (i: number, dir: Direction) => {

    switch(dir) {
        case Direction.East:

            if(i == 1) return { x: -13, y: -8 }
            else if(i == 2) return { x: 2, y: -13 }
            else if(i == 3) return { x: 18, y: 0 }
            break;
        
        case Direction.West:
            if(i == 1) return { x: 13, y: -8 }
            else if(i == 2) return { x: -2, y: -13 }
            else if(i == 3) return { x: -19, y: 0 }
            break;
        
        case Direction.North:
            if(i == 1) return { x: -5, y: -8 }
            else if(i == 2) return { x: -8, y: -15 }
            else if(i == 3) return { x: -8, y: -18 }
            break;
        
        case Direction.South:
            if(i == 1) return { x: 5, y: -20 }
            else if(i == 2) return { x: 8, y: -16 }
            else if(i == 3) return { x: 4, y: 13 }
            break;
    }
};