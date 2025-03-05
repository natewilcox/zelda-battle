import { Direction, directionLookupMap, GameTextures, texturesIndex, WeaponType } from "@natewilcox/zelda-battle-shared";
import Character from "../characters/Character";
import { Link } from "../characters/Link";
import GameScene from "../scenes/GameScene";
import { Bullet } from "./Bullet";
import { IBow } from "./IBow";
import { IWeapon } from "./IWeapon";

const radsToDegs = rad => rad * 180 / Math.PI;
const degsToRads = deg => (deg * Math.PI) / 180.0;


/**
 * Shoots group of arrows based on parameters
 * 
 * @param idSeed 
 * @param dir 
 * @param speed 
 * @param count 
 * @param isMagic 
 * @param scene 
 * @param holder 
 * @returns 
 */
const shootArrows = (textId: GameTextures, idSeed: number, dir: Direction, speed: number, count: number, isMagic: boolean, scene: GameScene, holder: Character) => {

    //check if there are any arrows to shoot
    if(holder.arrows <= 0) return;

    //check if the holder has enough magic for magic arrows
    let useMagic = false;
    if(isMagic && holder.magic >= 5) {
        useMagic = true;
    }

    const traj = new Phaser.Math.Vector2();
    switch(dir) {
        case Direction.North: 

            //center arrow
            traj.setTo(0, -5).normalize().scale(speed);
            shootArrow(textId, idSeed++, scene, holder, dir, traj.x, traj.y, isMagic, useMagic, degsToRads(90), 4, 10, 4, 1);

            if(count >= 3) {
                traj.setTo(-1, -5).normalize().scale(speed);
                shootArrow(textId, idSeed++, scene, holder, dir, traj.x, traj.y, isMagic, useMagic, degsToRads(80), 4, 10, 4, 1);
    
                traj.setTo(1, -5).normalize().scale(speed);
                shootArrow(textId, idSeed++, scene, holder, dir, traj.x, traj.y, isMagic, useMagic, degsToRads(100), 4, 10, 4, 1);
            }

            if(count >= 5) {
                traj.setTo(-2, -5).normalize().scale(speed);
                shootArrow(textId, idSeed++, scene, holder, dir, traj.x, traj.y, isMagic, useMagic, degsToRads(70), 4, 10, 4, 1);
    
                traj.setTo(2, -5).normalize().scale(speed);
                shootArrow(textId, idSeed++, scene, holder, dir, traj.x, traj.y, isMagic, useMagic, degsToRads(110), 4, 10, 4, 1);
            }

            break;

        case Direction.South: 

            //center arrow
            traj.setTo(0, 5).normalize().scale(speed);
            shootArrow(textId, idSeed++, scene, holder, dir, traj.x, traj.y, isMagic, useMagic, degsToRads(270), 4, 10, 4, -6);

            if(count >= 3) {
                traj.setTo(-1, 5).normalize().scale(speed);
                shootArrow(textId, idSeed++, scene, holder, dir, traj.x, traj.y, isMagic, useMagic, degsToRads(280), 4, 10, 4, -6);

                traj.setTo(1, 5).normalize().scale(speed);
                shootArrow(textId, idSeed++, scene, holder, dir, traj.x, traj.y, isMagic, useMagic, degsToRads(260), 4, 10, 4, -6);
            }

            if(count >= 5) {
                traj.setTo(-2, 5).normalize().scale(speed);
                shootArrow(textId, idSeed++, scene, holder, dir, traj.x, traj.y, isMagic, useMagic, degsToRads(290), 4, 10, 4, -6);

                traj.setTo(2, 5).normalize().scale(speed);
                shootArrow(textId, idSeed++, scene, holder, dir, traj.x, traj.y, isMagic, useMagic, degsToRads(250), 4, 10, 4, -6);
            }
            break;

        case Direction.West:

            traj.setTo(-5, 0).normalize().scale(speed);
            shootArrow(textId, idSeed++, scene, holder, dir, traj.x, traj.y, isMagic, useMagic, degsToRads(0), 10, 4, 3, 1);

            if(count >= 3) {
                traj.setTo(-5, -1).normalize().scale(speed);
                shootArrow(textId, idSeed++, scene, holder, dir, traj.x, traj.y, isMagic, useMagic, degsToRads(10), 10, 4, 3, 1);

                traj.setTo(-5, 1).normalize().scale(speed);
                shootArrow(textId, idSeed++, scene, holder, dir, traj.x, traj.y, isMagic, useMagic, degsToRads(-10), 10, 4, 3, 1);
            }

            if(count >= 5) {
                traj.setTo(-5, -2).normalize().scale(speed);
                shootArrow(textId, idSeed++, scene, holder, dir, traj.x, traj.y, isMagic, useMagic, degsToRads(20), 10, 4, 3, 1);

                traj.setTo(-5, 2).normalize().scale(speed);
                shootArrow(textId, idSeed++, scene, holder, dir, traj.x, traj.y, isMagic, useMagic, degsToRads(-20), 10, 4, 3, 1);
            }
            break;

        case Direction.East: 

            traj.setTo(5, 0).normalize().scale(speed);
            shootArrow(textId, idSeed++, scene, holder, dir, traj.x, traj.y, isMagic, useMagic, degsToRads(180), 10, 4, -3, 0);

            if(count >= 3) {
                traj.setTo(5, -1).normalize().scale(speed);
                shootArrow(textId, idSeed++, scene, holder, dir, traj.x, traj.y, isMagic, useMagic, degsToRads(170), 10, 4, -3, 0);

                traj.setTo(5, 1).normalize().scale(speed);
                shootArrow(textId, idSeed++, scene, holder, dir, traj.x, traj.y, isMagic, useMagic, degsToRads(190), 10, 4, -3, 0);
            }

            if(count >= 5) {
                traj.setTo(5, -2).normalize().scale(speed);
                shootArrow(textId, idSeed++, scene, holder, dir, traj.x, traj.y, isMagic, useMagic, degsToRads(160), 10, 4, -3, 0);

                traj.setTo(5, 2).normalize().scale(speed);
                shootArrow(textId, idSeed++, scene, holder, dir, traj.x, traj.y, isMagic, useMagic, degsToRads(200), 10, 4, -3, 0);
            }
    }
}


/**
 * Shoots an arrow
 * 
 * @param id 
 * @param scene 
 * @param holder 
 * @param dir 
 * @param dx 
 * @param dy 
 * @param isMagic 
 * @param useMagic 
 * @param rotation 
 * @param w 
 * @param h 
 * @param x 
 * @param y 
 */
const shootArrow = (textId: GameTextures, id: number, scene: GameScene, holder: Character, dir: Direction, dx: number, dy: number, isMagic: boolean, useMagic: boolean, rotation: number, w: number, h: number, x: number, y: number) => {

    const isLocal = scene.player!.id == holder.id;
    const texture = texturesIndex[textId];

    const arrow = scene.addBullet(id, textId, holder.x, holder.y, isLocal);

    arrow.setVelocity(dx, dy);
    arrow.setRotation(rotation);
    arrow.setSize(w, h);
    arrow.setOffset(x, y);
    arrow.play(`${texture}-flight`, true);

    let particles, emitter; 

    arrow.addListener('oncontact', (obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject, destroy: () => void) => {
        
        //if there is an emitter, stop it on contact
        if(emitter) {
            emitter.stop();
        }
        
        const bullet = obj1 as Phaser.Physics.Arcade.Sprite as Bullet;
        bullet.setVelocity(0, 0);

        //check if hit player
        if(obj2 instanceof Link) {

            destroy();
            const target = obj2 as Link;
            scene.serverService.tryBulletCollision(bullet.textId, bullet.id, bullet.x, bullet.y, target);
        }
        else {

            bullet.anims.play(`${texture}-contact`, true);
            scene.physics.world.disable(bullet);
            scene.tweens.add({
                targets: bullet,
                props: { alpha: 0 },
                duration: 1000,
                delay: 1000,
                onComplete: () => {
                    destroy();
                }
            });
        }
        
    });

    if(useMagic) {

        particles = scene.add.particles('sparkle');
        emitter = particles.createEmitter({
            x: 0,
            y: 0,
            emitZone: {
                source: new Phaser.Geom.Circle(0, 0, 5),
                type: 'random',
                quantity: 3
            },
    
            scale: { start: 1, end: 0},
            lifespan: { min: 300, max: 400 },
            frequency: 40,
            blendMode: 'ADD'  
        });

        //when the bullet is destroyed, destroy the particles
        arrow.once(Phaser.GameObjects.Events.DESTROY, () => {
            particles.destroy();
        });

        emitter.startFollow(arrow);
    }
};


/**
 * Bow that fires 1 arrow.
 */
 export class Bow implements IBow {

    name: string = 'bow';

    holder: Character;
    scene: GameScene;
    textId = GameTextures.Bow;
    weaponType = WeaponType.Bow;
    arrowSpeed = 300;


    /**
     * Create new bow object.
     * 
     * @param holder 
     * @param scene 
     */
    constructor(holder: Character, scene: GameScene) {
        this.holder = holder;
        this.scene = scene;
    }


    /**
     * Fires the bow in direction provided.
     * 
     * @param idSeed 
     * @param dir 
     */
    fire = (idSeed: number, dir: Direction) => {
        shootArrows(GameTextures.Arrow, idSeed, dir, 300, 1, false, this.scene, this.holder);
    }


    /**
     * Update the weapon per animation frame.
     * 
     * @param anim 
     * @param frame 
     */
    update = (anim?: Phaser.Animations.Animation, frame?: Phaser.Animations.AnimationFrame) => {
   
        //on the 3rd frame, fire the bow projectiles
        if(frame!.index === 3) {
            const dir = anim!.key.split("-")[2];
            const dirId = directionLookupMap.get(dir);

            if(dirId != null && this.holder.arrows > 0) {
                this.scene.serverService.tryShootArrow(this.textId, dirId, this.holder.x, this.holder.y);
            }
        }
    }
}


/**
 * Bow that fires 3 arrows.
 */
 export class Bow3Arrow implements IBow {

    name: string = 'bow3arrow';

    holder: Character;
    scene: GameScene;
    textId = GameTextures.Bow3Arrow;
    weaponType = WeaponType.Bow;
    arrowSpeed = 300;


    /**
     * Create new bow object.
     * 
     * @param holder 
     * @param scene 
     */
    constructor(holder: Character, scene: GameScene) {
        this.holder = holder;
        this.scene = scene;
    }


    /**
     * Fires the bow in direction provided.
     * 
     * @param idSeed 
     * @param dir 
     */
    fire = (idSeed: number, dir: Direction) => {
        shootArrows(GameTextures.Arrow, idSeed, dir, 300, 3, false, this.scene, this.holder);
    }


    /**
     * Update the weapon per animation frame.
     * 
     * @param anim 
     * @param frame 
     */
    update = (anim?: Phaser.Animations.Animation, frame?: Phaser.Animations.AnimationFrame) => {
   
        //on the 3rd frame, fire the bow projectiles
        if(frame!.index === 3) {
            const dir = anim!.key.split("-")[2];
            const dirId = directionLookupMap.get(dir);

            if(dirId != null && this.holder.arrows > 0) {
                this.scene.serverService.tryShootArrow(this.textId, dirId, this.holder.x, this.holder.y);
            }
        }
    }
}


/**
 * Bow that fires 3 arrows.
 */
 export class Bow5Arrow implements IBow {

    name: string = 'bow5arrow';

    holder: Character;
    scene: GameScene;
    textId = GameTextures.Bow5Arrow;
    weaponType = WeaponType.Bow;
    arrowSpeed = 300;


    /**
     * Create new bow object.
     * 
     * @param holder 
     * @param scene 
     */
    constructor(holder: Character, scene: GameScene) {
        this.holder = holder;
        this.scene = scene;
    }


    /**
     * Fires the bow in direction provided.
     * 
     * @param idSeed 
     * @param dir 
     */
    fire = (idSeed: number, dir: Direction) => {
        shootArrows(GameTextures.Arrow, idSeed, dir, 300, 5, false, this.scene, this.holder);
    }


    /**
     * Update the weapon per animation frame.
     * 
     * @param anim 
     * @param frame 
     */
    update = (anim?: Phaser.Animations.Animation, frame?: Phaser.Animations.AnimationFrame) => {
   
        //on the 3rd frame, fire the bow projectiles
        if(frame!.index === 3) {
            const dir = anim!.key.split("-")[2];
            const dirId = directionLookupMap.get(dir);
  
            if(dirId != null && this.holder.arrows > 0) {
                this.scene.serverService.tryShootArrow(this.textId, dirId, this.holder.x, this.holder.y);
            }
        }
    }
}


/**
 * Magic Bow that fires 1 arrow.
 */
 export class MagicBow implements IBow {

    name: string = 'magicbow';

    holder: Character;
    scene: GameScene;
    textId = GameTextures.MagicBow;
    weaponType = WeaponType.Bow;
    arrowSpeed = 300;

    constructor(holder: Character, scene: GameScene) {
        this.holder = holder;
        this.scene = scene;
    }


    /**
     * Fires the bow in direction provided.
     * 
     * @param idSeed 
     * @param dir 
     */
    fire = (idSeed: number, dir: Direction) => {
        shootArrows(GameTextures.MagicArrow, idSeed, dir, 300, 1, true, this.scene, this.holder);
    }


    /**
     * Update the weapon per animation frame.
     * 
     * @param anim 
     * @param frame 
     */
    update = (anim?: Phaser.Animations.Animation, frame?: Phaser.Animations.AnimationFrame) => {
   
        //on the 3rd frame, fire the bow projectiles
        if(frame!.index === 3) {
            const dir = anim!.key.split("-")[2];
            const dirId = directionLookupMap.get(dir);

            if(dirId != null && this.holder.arrows > 0) {
                this.scene.serverService.tryShootArrow(this.textId, dirId, this.holder.x, this.holder.y);
            }
        }
    }
}


/**
 * Magic Bow that fires 3 arrows at once.
 */
 export class MagicBow3Arrow implements IBow {

    name: string = 'magicbow3arrow';

    holder: Character;
    scene: GameScene;
    textId = GameTextures.MagicBow3Arrow;
    weaponType = WeaponType.Bow;
    arrowSpeed = 300;

    constructor(holder: Character, scene: GameScene) {
        this.holder = holder;
        this.scene = scene;
    }


    /**
     * Fires the bow in direction provided.
     * 
     * @param idSeed 
     * @param dir 
     */
    fire = (idSeed: number, dir: Direction) => {
        shootArrows(GameTextures.MagicArrow, idSeed, dir, 300, 3, true, this.scene, this.holder);
    }


    /**
     * Update the weapon per animation frame.
     * 
     * @param anim 
     * @param frame 
     */
    update = (anim?: Phaser.Animations.Animation, frame?: Phaser.Animations.AnimationFrame) => {
   
        //on the 3rd frame, fire the bow projectiles
        if(frame!.index === 3) {
            const dir = anim!.key.split("-")[2];
            const dirId = directionLookupMap.get(dir);

            if(dirId != null && this.holder.arrows > 0) {
                this.scene.serverService.tryShootArrow(this.textId, dirId, this.holder.x, this.holder.y);
            }
        }
    }
}


/**
 * Magic Bow that fires 5 arrows at once.
 */
export class MagicBow5Arrow implements IBow {

    name: string = 'magicbow5arrow';

    holder: Character;
    scene: GameScene;
    textId = GameTextures.MagicBow5Arrow;
    weaponType = WeaponType.Bow;
    arrowSpeed = 300;

    constructor(holder: Character, scene: GameScene) {
        this.holder = holder;
        this.scene = scene;
    }


    /**
     * Fires the bow in direction provided.
     * 
     * @param idSeed 
     * @param dir 
     */
    fire = (idSeed: number, dir: Direction) => {
        shootArrows(GameTextures.MagicArrow, idSeed, dir, 300, 5, true, this.scene, this.holder);
    }


    /**
     * Update the weapon per animation frame.
     * 
     * @param anim 
     * @param frame 
     */
    update = (anim?: Phaser.Animations.Animation, frame?: Phaser.Animations.AnimationFrame) => {
   
        //on the 3rd frame, fire the bow projectiles
        if(frame!.index === 3) {

            const dir = anim!.key.split("-")[2];
            const dirId = directionLookupMap.get(dir);

            if(dirId != null && this.holder.arrows > 0) {
                this.scene.serverService.tryShootArrow(this.textId, dirId, this.holder.x, this.holder.y);
            }
        }
    }
}