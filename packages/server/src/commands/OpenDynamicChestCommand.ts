import pick from 'pick-random-weighted';

import { Command } from "@colyseus/command";
import { Client } from "colyseus";
import { ServerMessages } from "@natewilcox/zelda-battle-shared";
import { SpawnItemCommand } from './SpawnItemCommand';
import { getRandomNumber } from '@natewilcox/zelda-battle-shared';
import { BattleRoyaleRoom } from "../rooms/BattleRoyaleRoom";

/**
 * Payload type definition
 */
type Payload = {
    client: Client,
    x: number,
    y: number
}

const itemCountRate = [
    [3, 60],
    [4, 30],
    [5, 10]
]

const three_cords = [
    {dx: -10, dy: 10},
    {dx: 0, dy: 15},
    {dx: 10, dy: 10},
]

const four_Cords = [
    {dx: -13, dy: 0},
    {dx: -7, dy: 10},
    {dx: 7, dy: 10},
    {dx: 13, dy: 0},
]
const five_cords = [
    {dx: -15, dy: 0},
    {dx: -10, dy: 10},
    {dx: 0, dy: 15},
    {dx: 10, dy: 10},
    {dx: 15, dy: 0},
]

const getCords = (i, t) => {

    //if 3 or 4 item count
    if(t==3) return three_cords[i];
    if(t==4) return four_Cords[i];

    //default to 5
    return five_cords[i];
}


/**
 * Server Command to try and open a chest
 * Does nothing when the game hasnt started yet.
 */
export class OpenDynamicChestCommand extends Command<BattleRoyaleRoom, Payload> {


    /**
     * Executes the command.
     * 
     * @param param0 
     * @returns 
     */
    async execute({ client, x, y }: Payload) {
        
        //const pick = await import('pick-random-weighted');

        const player = this.room.state.playerStates.find(s => s.clientId == client.id);
        const chest_pos = `${x}, ${y}`;

        //check if a chest at this pos was already opened
        const existing = this.room.state.chests.find(c => c == chest_pos);

        if(!existing && player) {
            
            //pick how many items will spawn
            const itemCount = pick(itemCountRate);
            const weaponIndex = getRandomNumber(0, itemCount-1);
            const spawnCommands: any = [];
        
            for(let i=0;i<itemCount;i++) {

                const item = i == weaponIndex ? pick(this.room.weaponDropRate) : pick(this.room.itemDropRate);
                const cord = getCords(i, itemCount);

                let dx = cord.dx;
                let dy = cord.dy;

                spawnCommands.push(new SpawnItemCommand().setPayload({x: x*8+8, y: y*8+16, item: item, dx: dx, dy: dy, delay: (i*100)}));
            }

            this.room.state.chests.push(chest_pos);

            //tell everyone else that this chest was opened
            this.room.broadcast(ServerMessages.DynamicChestOpened, {
                x: x,
                y: y
            });

            return spawnCommands;
        }
    }
}