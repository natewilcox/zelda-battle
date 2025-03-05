import { Command } from "@colyseus/command";
import { ServerMessages } from "@natewilcox/zelda-battle-shared";
import { BattleRoyaleRoom } from "../rooms/BattleRoyaleRoom";
import Filter from 'bad-words';

/**
 * Payload type definition
 */
type Payload = {
    msg: string,
    client?,
    id?
};

const customFilter = new Filter({ placeHolder: 'X'});

/**
 * Command to have character talk
 */
export class TalkCommand extends Command<BattleRoyaleRoom, Payload> {

    /**
     * Executes command to have character talk
     * 
     * @param param0 
     */
    execute({ msg, client, id }) {

        //truncate message
        if(msg.length > 100) {
           msg = msg.substring(0, 100) + "...";
        }

        if(client) {

            const player = this.room.state.playerStates.find(p => p.clientId == client.id);
            if(player == null) return;

            const filteredMessage = customFilter.clean(msg);
            this.room.broadcast(ServerMessages.Talk, { id: player.id, msg: filteredMessage }); 

        }
        else if(id) {

            const filteredMessage = customFilter.clean(msg);
            this.room.broadcast(ServerMessages.Talk, { id, msg: filteredMessage }); 
        }  
    }
}