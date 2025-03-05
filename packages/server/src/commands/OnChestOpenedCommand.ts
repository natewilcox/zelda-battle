import { Command } from "@colyseus/command";
import { Client, Room } from "colyseus";
import { ServerMessages } from "@natewilcox/zelda-battle-shared";
import { ChestState } from "../rooms/schema/ChestState";
import { applyContentsToPlayer, getUpdatedMetrix } from "@natewilcox/zelda-battle-shared";
import { BattleRoyaleRoom } from '../rooms/BattleRoyaleRoom';

/**
 * Payload type definition
 */
type Payload = {
    id: number,
    who: number,
    client: Client,
    room: Room
}


/**
 * Server Command to try and open a chest
 * Does nothing when the game hasnt started yet.
 */
export class OnChestOpenedCommand extends Command<BattleRoyaleRoom, Payload> {


    /**
     * Executes the command.
     * 
     * @param param0 
     * @returns 
     */
    execute({ id, who, client, room }: Payload) {
        
        //if the game hasnt started yet, dont do anything
        //if(this.room.state.gameState !== GameState.InProgress) return;
        
        //find the player and chest states before continuing
        const player = this.room.state.playerStates.find(s => s.clientId == client.id);
        const chest = room.state.chestStates.find((c: any) => c.id === id) as ChestState;

        if(!player || !chest || chest.opened) return;

        chest.opened = true;

        applyContentsToPlayer(player, chest.contents);

        //tell everyone else that this chest was opened
        room.broadcast(ServerMessages.ChestOpened, {
            id: id,
            who: who,
            client: client.id,
            contents: chest.contents
        });
    }
}