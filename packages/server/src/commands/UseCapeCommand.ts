import { Command } from "@colyseus/command";
import { IPlayerState } from "@natewilcox/zelda-battle-shared";
import { BattleRoyaleRoom } from "../rooms/BattleRoyaleRoom";

/**
 * Payload type definition
 */
type Payload = {
    client,
    on: boolean
};


/**
 * Command to use the cape
 */
export class UseCapeCommand extends Command<BattleRoyaleRoom, Payload> {

    private MAGIC_COST = 2;

    /**
     * Executes command to use the cape
     * 
     * @param param0 
     */
    execute({ client, on }) {

        const player = this.room.state.playerStates.find(p => p.clientId == client.id);

        if(player == null) return;

        if(on && player.magic >= this.MAGIC_COST) {

            player.wearingCape = true;
            this.room.clock.setTimeout(() => this.drainMagic(player), 500);
        }
        else {
            player.wearingCape = false;
        }
    }

    private drainMagic = (player: IPlayerState) => {

        //stop when not wearing the cape anymore or out of magic
        if(!player.wearingCape || player.magic < this.MAGIC_COST) return;

        player.magic -= this.MAGIC_COST;
        player.magicUsed += this.MAGIC_COST;

        if(player.magic <= 0) {

            player.magic = 0;
            player.wearingCape = false;
        }
        else {
            this.room.clock.setTimeout(() => this.drainMagic(player), 500); 
        }  
    }
}