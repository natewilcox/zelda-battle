import { Command } from "@colyseus/command";
import { Client } from "colyseus";
import { ServerMessages } from "@natewilcox/zelda-battle-shared";
import { BattleRoyaleRoom } from "../rooms/BattleRoyaleRoom";

/**
 * Payload type definition
 */
type Payload = {
    client: Client,
    id: number,
    placement: number,
};


/**
 * Command to send placement to a player
 */
export class SendPlacementCommand extends Command<BattleRoyaleRoom, Payload> {

    /**
     * Executes command to send placement details
     * 
     * @param param0 
     */
    execute({ client, id, placement }) {

        const player = this.room.state.playerStates.find(p => p.id == id);

        if(player == null) return;
        player.placement =placement;

        client.send(ServerMessages.Placement, {
            placement: player.placement,
            eliminations: player.eliminations,
            damageGiven: player.damageGiven,
            damageTaken: player.damageTaken,
            magicUsed: player.magicUsed
        });
    }

}