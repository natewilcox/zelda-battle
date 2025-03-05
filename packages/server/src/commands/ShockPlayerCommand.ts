import { Command, Dispatcher } from "@colyseus/command";
import { ServerMessages } from '@natewilcox/zelda-battle-shared';
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

const shockedPlayers: number[] = [];

/**
 * Command to shock player
 */
export class ShockPlayerCommand extends Command<BattleRoyaleRoom, Payload> {


    /**
     * Executes command to shock a player
     * 
     * @param param0 
     * @returns 
     */
    async execute({ client, id, dispatcher }: Payload) {

        //if the player is null or already being shocked, return
        const player = this.room.state.playerStates.find(p => p.id == id);
        if(player == null || shockedPlayers.indexOf(player.id) > -1) return;

        shockedPlayers.push(player.id);

        this.room.broadcast(ServerMessages.ShockPlayer, {
            id: id
        });

        this.clock.setTimeout(() => {
            
            const index = shockedPlayers.findIndex(id => id == player.id);

            if(index > -1) {
                shockedPlayers.splice(index, 1);
            }

            this.room.broadcast(ServerMessages.ResetPlayer, {
                id: id
            });
            
            dispatcher.dispatch(new HitTargetsCommand().setPayload({
                client: client,
                dispatcher: dispatcher,
                weapon: GameTextures.Lightening,
                x: player.x,
                y: player.y,
                targetList: [{ id: player.id, clientId: player.clientId }],
                iframes: false
            }));

        }, 500);
    }
}