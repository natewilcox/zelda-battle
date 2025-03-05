import { Command } from "@colyseus/command";
import { ServerMessages } from "@natewilcox/zelda-battle-shared";
import { Client } from "colyseus";
import { BattleRoyaleRoom } from '../rooms/BattleRoyaleRoom';

/**
 * Payload type definition
 */
type Payload = {
    client: Client,
}


/**
 * Server Command to disconnect
 */
export class DisconnectCommand extends Command<BattleRoyaleRoom, Payload> {


    /**
     * Executes the command.
     * 
     * @param payload 
     * @returns 
     */
    async execute({ client }: Payload) {

        const player = this.state.playerStates.find(p => p.clientId === client.id);
        if(!player) return;

        //sync the data to the server
        // if(!player.dataSynced) {
        //     await this.room.firebase.saveGameResults(player);
        //     player.dataSynced = true;
        // }

        client.send(ServerMessages.Disconnected)
    }
}