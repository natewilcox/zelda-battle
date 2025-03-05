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
 * Command to create shield
 */
export class CreateShieldCommand extends Command<BattleRoyaleRoom, Payload> {

    private MAGIC_COST = 1;

    /**
     * Executes command to create shield
     * 
     * @param param0 
     */
    execute({ client, on }) {

        const player = this.room.state.playerStates.find(p => p.clientId == client.id);

        if(player == null) return;

        if(on && player.magic >= this.MAGIC_COST) {
            
            player.hasMagicShield = true;
            this.room.clock.setTimeout(() => this.drainMagic(player), 500);
        }
        else {
            player.hasMagicShield = false;
        }
    }

    private drainMagic = (player: IPlayerState) => {

        //stop when not wearing the cape anymore.
        if(!player.hasMagicShield) return;

        player.magic -= this.MAGIC_COST;
        player.magicUsed += this.MAGIC_COST;
        
        if(player.magic <= 0) {

            player.magic = 0;
            player.hasMagicShield = false;
        }
        else {
            this.room.clock.setTimeout(() => this.drainMagic(player), 500); 
        }  
    }
}