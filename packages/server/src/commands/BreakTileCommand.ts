import pick from 'pick-random-weighted';

import { Command } from "@colyseus/command";
import { MutatedTile } from "../rooms/schema/MutatedTile";
import { GameTextures, MapTextures } from "@natewilcox/zelda-battle-shared";
import { canWeaponBreakTile } from '@natewilcox/zelda-battle-shared';
import { SpawnItemCommand } from './SpawnItemCommand';
import { BattleRoyaleRoom } from "../rooms/BattleRoyaleRoom";

/**
 * Payload type definition
 */
type Payload = {
    texture: MapTextures,
    weapon: GameTextures,
    x: number,
    y: number
};

/**
 * Command to break a tile
 */
export class BreakTileCommand extends Command<BattleRoyaleRoom, Payload> {


    /**
     * Executes command to break a tile.
     * 
     * @param param0 
     * @returns 
     */
    async execute({ texture, weapon, x, y }: Payload) {

        //make sure this tile object hasnt already been altered by someone
        const existingMutation = this.room.state.mutatedTiles.find(tile => tile.x == x && tile.y == y);

        //if there is an existing mutation at these cordinates, skip.
        if(existingMutation) return;

        //check if the weapon used can break the tile
        if(canWeaponBreakTile(weapon, texture)) {

            //update maptiles
            // TODO FIX
            //this.room.state.map.groundLayer.mutateTile(x, y);

            //create a new mutation for this spot on the map.
            this.room.state.mutatedTiles.push(new MutatedTile(x, y, texture));

            //do not drop anything when hammering stake
            if(texture == MapTextures.Stake) return;

            const item = pick(this.room.floorDropRate);

            //do not spawn anythign when nothing comes up
            if(item == GameTextures.Nothing) return;

            return [
                new SpawnItemCommand().setPayload({
                    x: x*8+8,
                    y: y*8+8,
                    item: item
                })
            ];
        }
    }
}