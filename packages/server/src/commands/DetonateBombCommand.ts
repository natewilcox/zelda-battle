import { Command, Dispatcher } from "@colyseus/command";
import { ServerMessages } from "@natewilcox/zelda-battle-shared";
import { GameTextures } from "@natewilcox/zelda-battle-shared";
import { getDistanceBetween } from "@natewilcox/zelda-battle-shared";
import { HitTargetsCommand } from "./HitTargetsCommand";
import { Client } from "colyseus";
import { BattleRoyaleRoom } from '../rooms/BattleRoyaleRoom';

/**
 * Payload type definition
 */
type Payload = {
    client: Client,
    dispatcher: Dispatcher<BattleRoyaleRoom>,
    id: number,
    x: number,
    y: number
};


/**
 * Command to detonate a bomb
 */
export class DetonateBombCommand extends Command<BattleRoyaleRoom, Payload> {


    /**
     * Executes command to shot bow
     * 
     * @param param0 
     */
    execute({ client, dispatcher, id, x, y }) {

        const player = this.room.state.playerStates.find(p => p.clientId == client.id);

        if(player == null) return;

        //get all players close enough to take damage
        const damagedPlayers = this.room.state.playerStates.filter(p => p.alpha != 0.5 && getDistanceBetween(p.x, p.y, x, y) < 50);
        const damagedIds: any = [];

        //let all the players in range know they are hit
        damagedPlayers.forEach(p => {
            damagedIds.push({id: p.id, clientId: p.clientId});
        });

        this.room.broadcast(ServerMessages.BombDetonated, {
            who: player.id,
            id: id
        });

        return [new HitTargetsCommand().setPayload({
            client: client,
            dispatcher: dispatcher,
            weapon: GameTextures.Bomb,
            x: x,
            y: y,
            targetList: damagedPlayers as any
        })];
    }
}