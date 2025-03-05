import { Command } from "@colyseus/command";
import { ServerMessages } from "@natewilcox/zelda-battle-shared";
import { BattleRoyaleRoom } from "../rooms/BattleRoyaleRoom";

/**
 * Payload type definition
 */
type Payload = {
    clientId: string,
    id: number
    x: number, 
    y: number
}

/**
 * Command to RESET player
 */
export class ResetPlayerCommand extends Command<BattleRoyaleRoom, Payload> {


    /**
     * Executes the command.
     * 
     * @param payload 
     * @returns 
     */
    async execute({ clientId, id, x, y }: Payload) {

        const client = this.room.clients.find(c => c.id == clientId);
        const player = this.room.state.playerStates.find(player => player.id == id);

        if(player == null || client == null) return;

        client.send(ServerMessages.MovePlayer, { x, y });
    }
}