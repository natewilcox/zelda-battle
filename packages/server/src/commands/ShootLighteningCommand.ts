import { Command, Dispatcher } from "@colyseus/command";
import { ServerMessages } from "@natewilcox/zelda-battle-shared";
import { Direction } from "@natewilcox/zelda-battle-shared";
import { ShockPlayerCommand } from "./ShockPlayerCommand";
import { BattleRoyaleRoom } from "../rooms/BattleRoyaleRoom";

/**
 * Payload type definition
 */
type Payload = {
    client,
    dispatcher: Dispatcher<BattleRoyaleRoom>,
    x: number,
    y: number,
    dir: Direction
};


/**
 * Command to shoot lightening
 */
export class ShootLighteningCommand extends Command<BattleRoyaleRoom, Payload> {

    private MAGIC_COST = 10;

    /**
     * Executes command to shoot lightening
     * 
     * @param param0 
     */
    execute({ client, dispatcher, x, y, dir }) {

        const player = this.room.state.playerStates.find(p => p.clientId == client.id);

        if(player == null || player.magic < this.MAGIC_COST) return;

        player.magic -= this.MAGIC_COST;
        player.magicUsed += this.MAGIC_COST;
        
        this.room.broadcast(ServerMessages.LighteningShot, {
            who: player.id,
            x: x,
            y: y, 
            dir: dir
        });

        let lighteningHitbox = { x: x, y: y-20, w: 145, h: 40};

        switch(dir) {
            case Direction.North:
                lighteningHitbox = { x: x-20, y: y-145, w: 40, h: 145};
                break;

            case Direction.South:
                lighteningHitbox = { x: x-20, y: y, w: 40, h: 145};
                break;

            case Direction.West:
                lighteningHitbox = { x: x-145, y: y-20, w: 145, h: 40};
                break;
        }

        //check for anyone in the range of the lightening blast
        const hitPlayers = this.room.state.playerStates.filter(p => {

            const playerHitBox = { x: p.x-8, w: 16, y: p.y-8, h: 16 };
            return this.doHitBoxesOverlap(playerHitBox, lighteningHitbox);
        });

        //if we hit someone, do damage
        if(hitPlayers.length > 0) {

            const returnComamnds: Command[] = [];

            hitPlayers.forEach(p => returnComamnds.push(new ShockPlayerCommand().setPayload({ 
                client: client, 
                id: p.id, 
                dispatcher: dispatcher 
            })));

            return returnComamnds;
        }
    }

    private doHitBoxesOverlap = (a, b) => {
        return !(
            ((a.y + a.h) < (b.y)) ||
            (a.y > (b.y + b.h)) ||
            ((a.x + a.w) < b.x) ||
            (a.x > (b.x + b.w))
        );
    }
    
}