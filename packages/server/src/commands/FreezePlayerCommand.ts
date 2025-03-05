import { Command, Dispatcher } from "@colyseus/command";
import { ServerMessages } from "@natewilcox/zelda-battle-shared";
import { GameTextures } from "@natewilcox/zelda-battle-shared";
import { HitTargetsCommand } from "./HitTargetsCommand";
import { Client } from "colyseus";
import { BattleRoyaleRoom } from "../rooms/BattleRoyaleRoom";

/**
 * Payload type definition
 */
 type Payload = {
    client: Client,
    id: number,
    dispatcher: Dispatcher<BattleRoyaleRoom>
};

const frozenPlayers: number[] = [];

/**
 * Command to handle freezing player
 */
export class FreezePlayerCommand extends Command<BattleRoyaleRoom, Payload> {


    /**
     * Executes command to handle freezing player
     * 
     * @param param0 
     */
    execute({ client, id, dispatcher }: Payload) {


        const player = this.room.state.playerStates.find(player => player.id == id);
        if(player == null || frozenPlayers.indexOf(player.id) > -1) return;

        frozenPlayers.push(player.id);

        this.room.broadcast(ServerMessages.FreezePlayer, {
            id: id
        });

        //unfreeze after period of time
        this.clock.setTimeout(() => {

            const index = frozenPlayers.findIndex(id => id == player.id);
    
            if(index > -1) {
                frozenPlayers.splice(index, 1);
            }

            this.room.broadcast(ServerMessages.ResetPlayer, {
                id: id
            });

            dispatcher.dispatch(new HitTargetsCommand().setPayload({
                client: client,
                dispatcher: dispatcher,
                weapon: GameTextures.IceBlast,
                x: player.x,
                y: player.y,
                targetList: [{ id: player.id, clientId: player.clientId }],
                iframes: false
            }));

        }, 10000);
    }
}