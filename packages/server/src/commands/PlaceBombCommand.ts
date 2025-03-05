import { Command } from "@colyseus/command";
import { ServerMessages } from "@natewilcox/zelda-battle-shared";
import { BattleRoyaleRoom } from '../rooms/BattleRoyaleRoom';

/**
 * Payload type definition
 */
type Payload = {
    client,
    x: number,
    y: number
};


/**
 * Command to place a bomb
 */
export class PlaceBombCommand extends Command<BattleRoyaleRoom, Payload> {


    /**
     * Executes command to shot bow
     * 
     * @param param0 
     */
    execute({client, x, y}) {

        const player = this.room.state.playerStates.find(p => p.clientId == client.id);

        if(player == null) return;

        if(player.bombs > 0) {
            player.bombs--;

            const bombId = this.room.state.bombCounter++;

            //broacast to everyone that the client initiated an attack
            this.room.broadcast(ServerMessages.BombPlaced, {
                who: player.id,
                id: bombId,
                x: x,
                y: y
            });
        }
    }
}