import { Command } from "@colyseus/command";
import { Client, Room } from "colyseus";
import { ItemState } from "../rooms/schema/ItemState";
import { PlayerState } from "../rooms/schema/PlayerState";
import { ServerMessages } from "@natewilcox/zelda-battle-shared";
import { SpawnItemCommand } from "./SpawnItemCommand";
import { getRandomNumber } from "@natewilcox/zelda-battle-shared";
import { BattleRoyaleRoom } from "../rooms/BattleRoyaleRoom";

/**
 * Payload type definition
 */
type Payload = {
    client: Client,
    id: number,
    who: number
}

const drop_cords = [
    {dx: -15, dy: 0},
    {dx: -10, dy: 10},
    {dx: 0, dy: 15},
    {dx: 10, dy: 10},
    {dx: 15, dy: 0},
]

/**
 * Server Command to try and collect and store an item in the players bag
 */
export class StoreItemCommand extends Command<BattleRoyaleRoom, Payload> {


    /**
     * Executes the command.
     * 
     * @param param0 
     * @returns 
     */
    execute({ client, id, who }: Payload) {

        const room = this.room;

        //get item reference
        const item = room.state.itemStates.find(i => i.id === id) as ItemState;
        const player = room.state.playerStates.find(p => p.id === who) as PlayerState;

        //return if item|player is not available
        if(item == null || player == null) return;

        //remove item from available
        const itemIndex = room.state.itemStates.findIndex(i => i.id === id);
        room.state.itemStates.splice(itemIndex, 1);

        let added = false;
        
        //add the item to the bag in first empty slot
        for(let i=0;i<player.bag.length;i++) {
            if(player.bag[i] == undefined) {
                added = true;
                player.bag[i] = item.itemType;
                break;
            }
        }

        if(!added) {
            player.bag.push(item.itemType);
        }

        //only can hold 6 items, remove the firs item
        if(player.bag.length > 6) {

            const dropped = player.bag.shift();
            const drop = drop_cords[getRandomNumber(0, 5)];
            
            this.room.dispatcher.dispatch(new SpawnItemCommand().setPayload({
                x: player.x,
                y: player.y,
                item: dropped,
                dx: drop.dx,
                dy: drop.dy
            }));
        }

        //update the client with the contents of the bag
        client.send(ServerMessages.BagContentsChanged, player.bag);
    }
}