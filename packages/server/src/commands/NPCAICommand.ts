import { Command, Dispatcher } from "@colyseus/command";
import { getDistanceBetween } from "@natewilcox/zelda-battle-shared";
import { IPlayerState } from "@natewilcox/zelda-battle-shared";
import { BattleRoyaleRoom } from "../rooms/BattleRoyaleRoom";
import _ from 'lodash';

/**
 * Payload type definition
 */
type Payload = {
};

interface aiMessage {
    id: number,
    msg: string
}
const frozenPlayers: number[] = [];

/**
 * Command to handle NPC AI
 */
export class NPCAICommand extends Command<BattleRoyaleRoom, Payload> {


    /**
     * Executes command to start NPC AI
     * 
     * @param param0 
     */
    execute({ }: Payload) {


        //start the ai processor
        this.aiTick(this.room.dispatcher);
    }


    private aiTick = (dispatcher: Dispatcher<BattleRoyaleRoom>) => {

        //collect npc/player data and process it
        const playersNearNPC = this.collectData();

        //process npc ai every second
        this.clock.setTimeout(() => this.aiTick(dispatcher), 100);
    }

    private collectData() {

        //check if anyone is near an npc
        this.room.state.npcs.forEach(npc => {

            const playersNearNPC: IPlayerState[] = [];
            this.room.state.playerStates.forEach(player => {

                const distance = getDistanceBetween(npc.x, npc.y, player.x, player.y);

                if(distance < 50) {

                    //add the player near the npc
                    playersNearNPC.push(player)
                }
            });

            

            npc.processNearPlayers(playersNearNPC, this.room.dispatcher);
        });
    }
}