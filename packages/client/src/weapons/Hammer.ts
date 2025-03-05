import { GameTextures, MapTextures, textureLookupMap, WeaponType } from "@natewilcox/zelda-battle-shared";
import Character from "../characters/Character";
import { Link } from "../characters/Link";
import GameScene from "../scenes/GameScene";
import { IWeapon } from "./IWeapon";

export class Hammer implements IWeapon {

    name: string = 'hammer';

    holder: Character;
    scene: Phaser.Scene;
    textId = GameTextures.Hammer;
    weaponType = WeaponType.Hammer;

    constructor(holder: Character, scene: Phaser.Scene) {
        this.holder = holder;
        this.scene = scene;
    }

    update = (anim?: Phaser.Animations.Animation, frame?: Phaser.Animations.AnimationFrame) => {

        //only perform hammer action on the 3rd frame
        if(frame!.index != 3) return;

        const dir = anim!.key.split("-")[2];
        const hitbox = this.scene.add.rectangle(-100, -100, 5, 10);//.setStrokeStyle(1, 0x0000);

        switch(dir) {
            case "north" : 
                hitbox.setSize(15, 10);
                hitbox.x = this.holder.x-5;
                hitbox.y = this.holder.y-15;
                break;
            case "south" : 
                hitbox.setSize(15, 10);
                hitbox.x = this.holder.x-5;
                hitbox.y = this.holder.y+15;
                break;
            case "east" : 
                hitbox.setSize(10, 20);
                hitbox.x = this.holder.x+12;
                hitbox.y = this.holder.y-5;
                break;
            case "west" : 
                hitbox.setSize(10, 20);
                hitbox.x = this.holder.x-20;
                hitbox.y = this.holder.y-5;
                break;
        }

        //check for contact
        const x = hitbox.x - (hitbox.width / 2);
        const y = hitbox.y - (hitbox.height / 2);
        const collidedObjects: any = this.scene.physics.overlapRect(x, y, hitbox.width, hitbox.height);
        

        const gameScene = this.scene as GameScene;
        const groundLayer = gameScene.map.getLayer('Ground Layer').tilemapLayer;


        //convert list of collided bodies into gameobjects
        const targets = collidedObjects
            .filter(co => {
                const go = co.gameObject;

                //make sure its a link, and not this link
                return (go instanceof Link && go.id != this.holder.id);
            })
            .map(go => go.gameObject);

            
        //if there is more than 0, send to server
        if(targets.length > 0) {
            gameScene.serverService.tryHitTargets(this.textId, this.holder.x, this.holder.y, targets);
        }
        
        //destroy hitbox
        hitbox.destroy();

                        
        const breakableTile = this.scanAdjacentTiles(groundLayer, dir);

        if(breakableTile && (breakableTile.properties.texture == MapTextures.Rock || breakableTile.properties.texture == MapTextures.Stake)) {
            gameScene.serverService.tryBreakTile(breakableTile.properties.texture, this.textId, breakableTile.x, breakableTile.y);
        }
    }

    private scanAdjacentTiles(mapLayer: Phaser.Tilemaps.TilemapLayer, dir: string) {
        
        let tiles: Phaser.Tilemaps.Tile[] = [];

        //collect 4 adjacent tiles in 4 directions
        switch(dir) {
            case "north" : 
                tiles.push(mapLayer.getTileAtWorldXY(this.holder.x, this.holder.y-8));
                tiles.push(mapLayer.getTileAtWorldXY(this.holder.x, this.holder.y-16));
                tiles.push(mapLayer.getTileAtWorldXY(this.holder.x-8, this.holder.y-8));
                tiles.push(mapLayer.getTileAtWorldXY(this.holder.x-8, this.holder.y-16));
                break;
                
            case "south" : 
                tiles.push(mapLayer.getTileAtWorldXY(this.holder.x, this.holder.y+16));
                tiles.push(mapLayer.getTileAtWorldXY(this.holder.x, this.holder.y+24));
                tiles.push(mapLayer.getTileAtWorldXY(this.holder.x-8, this.holder.y+16));
                tiles.push(mapLayer.getTileAtWorldXY(this.holder.x-8, this.holder.y+24));
                break;

            case "east" : 
                tiles.push(mapLayer.getTileAtWorldXY(this.holder.x+8, this.holder.y-8));
                tiles.push(mapLayer.getTileAtWorldXY(this.holder.x+16, this.holder.y-8));
                tiles.push(mapLayer.getTileAtWorldXY(this.holder.x+8, this.holder.y));
                tiles.push(mapLayer.getTileAtWorldXY(this.holder.x+16, this.holder.y));
                break;

            case "west" : 
                tiles.push(mapLayer.getTileAtWorldXY(this.holder.x-8, this.holder.y-8));
                tiles.push(mapLayer.getTileAtWorldXY(this.holder.x-16, this.holder.y-8));
                tiles.push(mapLayer.getTileAtWorldXY(this.holder.x-8, this.holder.y));
                tiles.push(mapLayer.getTileAtWorldXY(this.holder.x-16, this.holder.y));
                break;
        }

        //get a list of tiles to set to broken status
        return this.getMainTile(tiles, mapLayer);
    }

    private getMainTile(tiles: Phaser.Tilemaps.Tile[], ground: Phaser.Tilemaps.TilemapLayer) {

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
}