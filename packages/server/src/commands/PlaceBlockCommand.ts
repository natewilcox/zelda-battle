import { Command } from "@colyseus/command";
import { ServerMessages } from "@natewilcox/zelda-battle-shared";
import { Direction } from "@natewilcox/zelda-battle-shared";
import { BattleRoyaleRoom } from '../rooms/BattleRoyaleRoom';

/**
 * Payload type definition
 */
type Payload = {
    client,
    x: number,
    y: number,
    dir: Direction
};


/**
 * Command to place a block
 */
export class PlaceBlockCommand extends Command<BattleRoyaleRoom, Payload> {

    private MAGIC_COST = 10;

    /**
     * Executes command to place block
     * 
     * @param param0 
     */
    execute({ client, x, y, dir }) {

        const player = this.room.state.playerStates.find(p => p.clientId == client.id);

        if(player == null || player.magic < this.MAGIC_COST) return;

        player.magic -= this.MAGIC_COST;
        player.magicUsed += this.MAGIC_COST;

        const placed_x = x % 2 == 0 ? x : x-1;
        const placed_y = y % 2 == 0 ? y : y-1;

        this.room.broadcast(ServerMessages.BlockPlaced, { x: placed_x, y: placed_y });

        this.clock.setTimeout(() => {

            if(dir == Direction.North || dir == Direction.South) {

                this.room.broadcast(ServerMessages.BlockPlaced, { x: placed_x + 2, y: placed_y });
                this.room.broadcast(ServerMessages.BlockPlaced, { x: placed_x - 2, y: placed_y });
            }
            else {
                this.room.broadcast(ServerMessages.BlockPlaced, { x: placed_x, y: placed_y+2 });
                this.room.broadcast(ServerMessages.BlockPlaced, { x: placed_x, y: placed_y-2 });
            }

        }, 200);
        
    }
}