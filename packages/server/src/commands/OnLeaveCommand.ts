import { Command } from "@colyseus/command";
import { ServerMessages } from "@natewilcox/zelda-battle-shared";
import { CheckWinnerCommand } from "./CheckWinnerCommand";
import { BattleRoyaleRoom } from '../rooms/BattleRoyaleRoom';

/**
 * Payload type definition
 */
type Payload = {
    sessionId: string
}


/**
 * Server Command to leave the game
 */
export class OnLeaveCommand extends Command<BattleRoyaleRoom, Payload> {


    /**
     * Executes the command.
     * 
     * @param payload 
     * @returns 
     */
    async execute({ sessionId }: Payload) {

        //remove player from list
        const index = this.state.playerStates.findIndex(p => p.clientId === sessionId);
        const player = this.state.playerStates.find(p => p.clientId === sessionId);

        if(!player) return;

        this.state.playerStates.splice(index, 1);

        //update firebase when player disconnects if the data is not synced.
        //This is needed for unplanned disconnects
        // if(!player.dataSynced) {
        //     await this.room.firebase.saveGameResults(player);
        //     player.dataSynced = true;
        // }

        //find the client object by session id.
        const client = this.room.clients.find(c => c.id === sessionId);

        //broadcast message to other clients about the joining player.
        this.room.broadcast(ServerMessages.Message, `${player.handle} has left the match`, {
            except: client
        });

        //check for winner after every hit
        return [new CheckWinnerCommand()];
    }
}