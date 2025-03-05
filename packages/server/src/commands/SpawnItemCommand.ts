import pick from 'pick-random-weighted';

import generateUniqueId  from 'generate-unique-id';
import { Command } from "@colyseus/command";
import { ItemState } from '../rooms/schema/ItemState';
import { GameTextures } from '@natewilcox/zelda-battle-shared';
import { BattleRoyaleRoom } from '../rooms/BattleRoyaleRoom';

/**
 * Payload type definition
 */
type Payload = {
    x: number,
    y: number,
    item?: GameTextures,
    dx?: number,
    dy?: number,
    delay?: number
};

const itemDropRate = [
    [GameTextures.Sword1, 1],
    [GameTextures.Sword2, 1],
    // [GameTextures.Sword3, 1],
    // [GameTextures.Sword4, 1],
    // [GameTextures.Staff, 1],
    // [GameTextures.Hammer, 1],
    // [GameTextures.Bow, 1],
    // [GameTextures.Bow3Arrow, 1],
    // [GameTextures.Bow5Arrow, 1],
    // [GameTextures.MagicBow, 1],
    // [GameTextures.MagicBow3Arrow, 1],
    // [GameTextures.MagicBow5Arrow, 1],
    // [GameTextures.Arrow, 1],
    // [GameTextures.MagicArrow, 1],
    // [GameTextures.Bomb, 1],
    // [GameTextures.Cape, 1],
    //[GameTextures.GreenRupee, 1],
    // [GameTextures.BlueRupee, 1],
    // [GameTextures.RedRupee, 1],
    // [GameTextures.FiftyRupees, 1],
    // [GameTextures.FullHeart, 1],
    // [GameTextures.TenBombs, 1],
    // [GameTextures.TenArrows, 1],
    // [GameTextures.MagicJar, 1]
];


/**
 * Command to spawn a new item on the map
 */
export class SpawnItemCommand extends Command<BattleRoyaleRoom, Payload> {


    /**
     * Executes command to span an item
     * 
     * @param param0
     */
    async execute({x, y, item, dx, dy, delay }) {

        //const pick = await import('pick-random-weighted');

        //if item was provided, use that. otherwise pick random
        const newItem = item ? item : pick(itemDropRate);

        this.room.state.itemStates.push(new ItemState(+generateUniqueId({length: 5,useLetters: false}), x, y, newItem, dx, dy, delay));
    }
}