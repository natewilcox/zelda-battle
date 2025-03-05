import { Game } from "phaser";
import { Direction, directionLookupMap, GameTextures, WeaponType } from "@natewilcox/zelda-battle-shared";
import Character from "../characters/Character";
import { Link } from "../characters/Link";
import GameScene from "../scenes/GameScene";
import { Bullet } from "./Bullet";
import { IWeapon } from "./IWeapon";

export class FireRod implements IWeapon {

    name: string = 'firerod';

    holder: Character;
    scene: Phaser.Scene;
    textId = GameTextures.FireRod;
    weaponType = WeaponType.Hammer;


    constructor(holder: Character, scene: Phaser.Scene) {
        this.holder = holder;
        this.scene = scene;
    }

    fire = (x: number, y: number, idSeed: number, dir: Direction) => {

        //create a fireball in the scene
        const isLocal = (this.scene as GameScene).player!.id == this.holder.id;
        const cords = getCords(dir);

        const fireball = (this.scene as GameScene).addBullet(idSeed, GameTextures.Fireball, x + cords.x, y + cords.y, isLocal);
        fireball.anims.play('fireball-flight');
        fireball.setAngularVelocity(800);
        fireball.setSize(10, 10);

        if(dir == Direction.North) fireball.setVelocityY(-400);
        else if(dir == Direction.South) fireball.setVelocityY(400);
        else if(dir == Direction.East) fireball.setVelocityX(400);
        else if(dir == Direction.West) fireball.setVelocityX(-400);

        fireball.addListener('oncontact', (obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject, destroy: () => void) => {

            const bullet = obj1 as Bullet;
            const scene = this.scene as GameScene;

            destroy();

            //check if hit player
            if(obj2 instanceof Link) {

                const target = obj2 as Link;
                scene.serverService.tryBulletCollision(bullet.textId, bullet.id, bullet.x, bullet.y, target);
            }
            else {
                scene.playEffect(bullet.x, bullet.y, 'bullets', 'fireball-contact');
            }
        });
    }

    update = (anim?: Phaser.Animations.Animation, frame?: Phaser.Animations.AnimationFrame) => {

        if(frame?.index != 3) return;
        if(this.holder.magic < 5) return;

        const dir = anim!.key.split("-")[2];
        const dirId = directionLookupMap.get(dir);

        this.holder.serverService.tryShootFireball(this.textId, dirId!, this.holder.x, this.holder.y);
    }
}


export class IceRod implements IWeapon {

    name: string = 'icerod';

    holder: Character;
    scene: Phaser.Scene;
    textId = GameTextures.IceRod;
    weaponType = WeaponType.Hammer;


    constructor(holder: Character, scene: Phaser.Scene) {
        this.holder = holder;
        this.scene = scene;
    }

    fire = (x: number, y: number, idSeed: number, dir: Direction) => {

        //create a fireball in the scene
        const isLocal = (this.scene as GameScene).player!.id == this.holder.id;
        const cords = getCords(dir);

        const iceblast = (this.scene as GameScene).addBullet(idSeed, GameTextures.IceBlast, x + cords.x, y + cords.y, isLocal);
        iceblast.anims.play('fireball-flight');
        iceblast.setVisible(false);
        iceblast.setSize(10, 10);

        let particles, emitter; 

        particles = this.scene.add.particles('sparkle');
        emitter = particles.createEmitter({
            x: 0,
            y: 0,
            emitZone: {
                source: new Phaser.Geom.Circle(0, 0, 10),
                type: 'random',
                quantity: 10
            },
    
            scale: { start: 1, end: 0},
            lifespan: { min: 300, max: 400 },
            frequency: 10,
            blendMode: 'ADD'  
        });

        //when the bullet is destroyed, destroy the particles
        iceblast.once(Phaser.GameObjects.Events.DESTROY, () => {
            particles.destroy();
        });

        emitter.startFollow(iceblast);

        if(dir == Direction.North) iceblast.setVelocityY(-300);
        else if(dir == Direction.South) iceblast.setVelocityY(300);
        else if(dir == Direction.East) iceblast.setVelocityX(300);
        else if(dir == Direction.West) iceblast.setVelocityX(-300);

        iceblast.addListener('oncontact', (obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject, destroy: () => void) => {

            const bullet = obj1 as Bullet;
            const scene = this.scene as GameScene;

            destroy();

            //check if hit player
            if(obj2 instanceof Link) {

                const target = obj2 as Link;
                scene.serverService.tryBulletCollision(bullet.textId, bullet.id, bullet.x, bullet.y, target);
            }
            else {
                scene.playMagicFlash(bullet.x, bullet.y);
            }
        });
    }

    update = (anim?: Phaser.Animations.Animation, frame?: Phaser.Animations.AnimationFrame) => {

        if(frame?.index != 3) return;
        if(this.holder.magic < 5) return;

        const dir = anim!.key.split("-")[2];
        const dirId = directionLookupMap.get(dir);

        this.holder.serverService.tryShootIceblast(this.textId, dirId!, this.holder.x, this.holder.y);
    }
}

export class LightRod implements IWeapon {

    name: string = 'lightrod';

    holder: Character;
    scene: Phaser.Scene;
    textId = GameTextures.LightRod;
    weaponType = WeaponType.Hammer;


    constructor(holder: Character, scene: Phaser.Scene) {
        this.holder = holder;
        this.scene = scene;
    }

    private setVelocity = (bullet: Bullet, dir: Direction, speed: number) => {
        if(dir == Direction.North) bullet.setVelocityY(-speed);
        else if(dir == Direction.South) bullet.setVelocityY(speed);
        else if(dir == Direction.East) bullet.setVelocityX(speed);
        else if(dir == Direction.West) bullet.setVelocityX(-speed);
    }

    fire = (x: number, y: number, idSeed: number, dir: Direction) => {
        
        const isLocal = (this.scene as GameScene).player!.id == this.holder.id;
    
        const cords = getCords(dir);
        const smalllightball = (this.scene as GameScene).addBullet(idSeed, GameTextures.LargeLightBall, x + cords.x, y + cords.y, isLocal);
        smalllightball.anims.play('small-lightball-flight');
        smalllightball.setSize(10, 10);

        const mediumlightball = (this.scene as GameScene).addBullet(idSeed, GameTextures.LargeLightBall, x + cords.x, y + cords.y, isLocal);
        mediumlightball.anims.play('medium-lightball-flight');
        mediumlightball.setSize(10, 10);

        const largelightball = (this.scene as GameScene).addBullet(idSeed, GameTextures.LargeLightBall, x + cords.x, y + cords.y, isLocal);
        largelightball.anims.play('large-lightball-flight');
        largelightball.setSize(10, 10);

        this.setVelocity(largelightball, dir, 300);
        this.scene.time.delayedCall(30, () => this.setVelocity(mediumlightball, dir, 300));
        this.scene.time.delayedCall(50, () => this.setVelocity(smalllightball, dir, 300));

        largelightball.addListener('oncontact', (obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject, destroy: () => void) => {
            
            const bullet = obj1 as Bullet;
            const scene = this.scene as GameScene;

            //check if hit player
            if(obj2 instanceof Link) {

                const target = obj2 as Link;
                scene.serverService.tryBulletCollision(bullet.textId, bullet.id, bullet.x, bullet.y, target);
            }
            else {
                destroy();
            }
        });

        mediumlightball.addListener('oncontact', (obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject, destroy: () => void) => {
            if(!(obj2 instanceof Link)) {
                destroy();
            }
        });

        smalllightball.addListener('oncontact', (obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject, destroy: () => void) => {
            if(!(obj2 instanceof Link)) {
                destroy();
            }
        });
    }
    
    update = (anim?: Phaser.Animations.Animation, frame?: Phaser.Animations.AnimationFrame) => {

        if(frame?.index != 3) return;
        if(this.holder.magic < 10) return;

        const dir = anim!.key.split("-")[2];
        const dirId = directionLookupMap.get(dir);

        this.holder.serverService.tryShootLightBall(this.textId, dirId!, this.holder.x, this.holder.y);
    }
}

const getCords = (dir: Direction) => {

    switch(dir) {
        case Direction.East:
            return { x: 15, y: 0 }
        
        case Direction.West:
            return { x: -15, y: 0 }
        
        case Direction.North:
            return { x: -5, y: -15 }
        case Direction.South:
            return { x: 5, y: 15 }
    }
};