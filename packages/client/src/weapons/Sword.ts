import { canWeaponBreakTile } from "@natewilcox/zelda-battle-shared";
import { Direction, directionLookupMap, GameTextures, WeaponType } from "@natewilcox/zelda-battle-shared";
import Character from "../characters/Character";
import { Link } from "../characters/Link";
import GameScene from "../scenes/GameScene";
import { IWeapon } from "./IWeapon";

export class Sword1 implements IWeapon {

    name: string = 'sword1';

    holder: Character;
    scene: GameScene;
    textId = GameTextures.Sword1;
    weaponType = WeaponType.Sword;

    constructor(holder: Character, scene: GameScene) {
        this.holder = holder;
        this.scene = scene;
    }

    update = (anim?: Phaser.Animations.Animation, frame?: Phaser.Animations.AnimationFrame) => {

        //only perform sword action on the 3rd frame
        if(frame!.index != 2) return;
        
        const dir = anim!.key.split("-")[2];
        this.scene.serverService.trySwordAttack(this.textId, directionLookupMap.get(dir)!);
        swordAttack(this.textId, directionLookupMap.get(dir)!, this.holder, 1, this.scene as GameScene);
    }
}

export class Sword2 implements IWeapon {

    name: string = 'sword2';

    holder: Character;
    scene: Phaser.Scene;
    textId = GameTextures.Sword2;
    weaponType = WeaponType.Sword;

    constructor(holder: Character, scene: Phaser.Scene) {
        this.holder = holder;
        this.scene = scene;
    }

    update = (anim?: Phaser.Animations.Animation, frame?: Phaser.Animations.AnimationFrame) => {

        //only perform sword action on the 3rd frame
        if(frame!.index != 2) return;
        
        const dir = anim!.key.split("-")[2];
        swordAttack(this.textId, directionLookupMap.get(dir)!, this.holder, 1.04, this.scene as GameScene);
    }
}

export class Sword3 implements IWeapon {

    name: string = 'sword3';

    holder: Character;
    scene: Phaser.Scene;
    textId = GameTextures.Sword3;
    weaponType = WeaponType.Sword;

    constructor(holder: Character, scene: Phaser.Scene) {
        this.holder = holder;
        this.scene = scene;
    }

    update = (anim?: Phaser.Animations.Animation, frame?: Phaser.Animations.AnimationFrame) => {

        //only perform sword action on the 3rd frame
        if(frame!.index != 2) return;
        
        const dir = anim!.key.split("-")[2];
        swordAttack(this.textId, directionLookupMap.get(dir)!, this.holder, 1.06, this.scene as GameScene);
    }
}

export class Sword4 implements IWeapon {

    name: string = 'sword4';

    holder: Character;
    scene: Phaser.Scene;
    textId = GameTextures.Sword4;
    weaponType = WeaponType.Sword;

    constructor(holder: Character, scene: Phaser.Scene) {
        this.holder = holder;
        this.scene = scene;
    }

    update = (anim?: Phaser.Animations.Animation, frame?: Phaser.Animations.AnimationFrame) => {

        //only perform sword action on the 3rd frame
        if(frame!.index != 2) return;
        
        const dir = anim!.key.split("-")[2];
        swordAttack(this.textId, directionLookupMap.get(dir)!, this.holder, 1.1, this.scene as GameScene);
    }
}


/**
 * Position the hitbox relative to attacker to scan for melee hits.
 * 
 * @param x 
 * @param y 
 * @param w 
 * @param h 
 * @param hitbox 
 */
const positionHitScan = (x: number, y: number, w: number, h: number, hitbox: Phaser.GameObjects.Rectangle) => {

    hitbox.setPosition(2+x-w/2, y+5-h/2);
    hitbox.setSize(w, h);
}

const swordAttack = (texture: GameTextures, dir: Direction, attacker: Character, hitboxMulti: number, scene: GameScene) => {
    
    const hitbox = scene.add.rectangle(-100, -100, 5, 10).setStrokeStyle(1, 0x000000);

    switch(dir) {
        case Direction.North : 
            positionHitScan(attacker.x, attacker.y - 20, 30*hitboxMulti, 15*hitboxMulti, hitbox);
            break;
        case Direction.South : 
            positionHitScan(attacker.x, attacker.y + 20, 30*hitboxMulti, 15*hitboxMulti, hitbox);
            break;
        case Direction.East : 
            positionHitScan(attacker.x + 20, attacker.y, 15*hitboxMulti, 30*hitboxMulti, hitbox);
            break;
        case Direction.West : 
            positionHitScan(attacker.x - 20, attacker.y, 15*hitboxMulti, 30*hitboxMulti, hitbox);
            break;
    }

    //check for contact
    const x = hitbox.x - (hitbox.width / 2);
    const y = hitbox.y - (hitbox.height / 2);
    const collidedObjects: any = scene.physics.overlapRect(x, y, hitbox.width, hitbox.height);
    

    const groundLayer = scene.map.getLayer('Ground Layer').tilemapLayer;


    //convert list of collided bodies into gameobjects
    const targets = collidedObjects
        .filter(co => {
            const go = co.gameObject;

            //make sure its a link, and not this link
            return (go instanceof Link && go.id != attacker.id);
        })
        .map(go => go.gameObject);

        
    //if there is more than 0, send to server
    if(targets.length > 0) {

        //send to server the hit and play flash
        scene.playFlash(hitbox.x, hitbox.y);
        scene.serverService.tryHitTargets(texture, attacker.x, attacker.y, targets);
    }
    
    //destroy hitbox
    hitbox.destroy();
                
    const breakableTile = scanAdjacentTiles(attacker.x, attacker.y, groundLayer, dir);
   
    if(breakableTile && canWeaponBreakTile(texture, breakableTile.properties.texture)) {
    
        scene.serverService.tryBreakTile(breakableTile.properties.texture, texture, breakableTile.x, breakableTile.y);
    }
}

const scanAdjacentTiles = (x: number, y: number, mapLayer: Phaser.Tilemaps.TilemapLayer, dir: Direction) => {
        
    let tiles: Phaser.Tilemaps.Tile[] = [];

    //collect 4 adjacent tiles in 4 directions
    switch(dir) {
        case Direction.North : 
            tiles.push(mapLayer.getTileAtWorldXY(x, y-8));
            tiles.push(mapLayer.getTileAtWorldXY(x, y-16));
            tiles.push(mapLayer.getTileAtWorldXY(x-8, y-8));
            tiles.push(mapLayer.getTileAtWorldXY(x-8, y-16));
            break;
            
        case Direction.South : 
            tiles.push(mapLayer.getTileAtWorldXY(x, y+16));
            tiles.push(mapLayer.getTileAtWorldXY(x, y+24));
            tiles.push(mapLayer.getTileAtWorldXY(x-8, y+16));
            tiles.push(mapLayer.getTileAtWorldXY(x-8, y+24));
            break;

        case Direction.East : 
            tiles.push(mapLayer.getTileAtWorldXY(x+8, y-8));
            tiles.push(mapLayer.getTileAtWorldXY(x+16, y-8));
            tiles.push(mapLayer.getTileAtWorldXY(x+8, y));
            tiles.push(mapLayer.getTileAtWorldXY(x+16, y));
            break;

        case Direction.West : 
            tiles.push(mapLayer.getTileAtWorldXY(x-8, y-8));
            tiles.push(mapLayer.getTileAtWorldXY(x-16, y-8));
            tiles.push(mapLayer.getTileAtWorldXY(x-8, y));
            tiles.push(mapLayer.getTileAtWorldXY(x-16, y));
            break;
    }

    //get a list of tiles to set to broken status
    return getMainTile(tiles, mapLayer);
}

const getMainTile = (tiles: Phaser.Tilemaps.Tile[], ground: Phaser.Tilemaps.TilemapLayer) => {

    //loop all the breakable tiles in the adjacent tiles
    for(let tile of tiles.filter(tile => tile.properties.breakable)) {

        const idx = tile.properties.idx;

        if(idx == 1) {
            return tile;
        }
        else if(idx == 2) {
            return ground.getTileAt(tile.x-1, tile.y);
        }

        else if(idx == 3) {
            return ground.getTileAt(tile.x, tile.y-1);
        }

        else if(idx == 4) {
            return ground.getTileAt(tile.x-1, tile.y-1);
        }
        
        return tile;
    };

    return null;
}