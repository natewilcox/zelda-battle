import { Command } from "@colyseus/command";
import { ServerMessages } from "@natewilcox/zelda-battle-shared";
import { Direction, GameTextures } from "@natewilcox/zelda-battle-shared";
import { adjustBulletByItem } from "@natewilcox/zelda-battle-shared";
import { BattleRoyaleRoom } from "../rooms/BattleRoyaleRoom";

/**
 * Payload type definition
 */
type Payload = {
    client,
    t: GameTextures,
    d: Direction,
    x: number,
    y: number
};


/**
 * Command to shoot fireball
 */
export class ShootFireballCommand extends Command<BattleRoyaleRoom, Payload> {

    private MAGIC_COST = 5;

    /**
     * Executes command to shoot fireball
     * 
     * @param param0 
     */
    execute({client, t, d, x, y}) {

        const player = this.room.state.playerStates.find(p => p.clientId == client.id);

        if(player == null || player.magic < this.MAGIC_COST) return;
        player.magic -= this.MAGIC_COST;
        player.magicUsed += this.MAGIC_COST;
        
        const startingBulletCount = this.room.state.bulletCounter;
        this.room.state.bulletCounter = adjustBulletByItem(startingBulletCount, t);

        //broacast to everyone that the client initiated an attack
        this.room.broadcast(ServerMessages.FireballShot, {
            who: player.id,
            text: t,
            dir: d,
            x: x,
            y: y,
            b: startingBulletCount
        });
    }
}