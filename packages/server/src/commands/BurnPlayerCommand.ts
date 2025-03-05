import { Command, Dispatcher } from "@colyseus/command";
import { ServerMessages } from "@natewilcox/zelda-battle-shared";
import { IPlayerState } from "@natewilcox/zelda-battle-shared";
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

const burntPlayers: number[] = [];

/**
 * Command to handle Burn player
 */
export class BurnPlayerCommand extends Command<BattleRoyaleRoom, Payload> {


    private burnCounter = 10;
    private first = true;

    /**
     * Executes command to burn a player
     * 
     * @param param0 
     */
    execute({ client, id, dispatcher }: Payload) {


        const player = this.room.state.playerStates.find(player => player.id == id);
        if(player == null || burntPlayers.indexOf(player.id) > -1) return;

        burntPlayers.push(player.id);
        this.burnPlayer(client, dispatcher, player);
    }

    private burnPlayer = (client: Client, dispatcher: Dispatcher<BattleRoyaleRoom>, player: IPlayerState) => {

        //stop the effect when the player is dead
        if(player.health == 0) return;

        dispatcher.dispatch(new HitTargetsCommand().setPayload({
            client: client,
            dispatcher: dispatcher,
            weapon: GameTextures.Fireball,
            x: player.x,
            y: player.y,
            targetList: [{ id: player.id, clientId: player.clientId }],
            iframes: false
        }));

        this.room.broadcast(ServerMessages.BurnPlayer, {
            id: player.id,
            first: this.first
        });

        this.first = false;
        if(this.burnCounter-- > 0) {
            this.clock.setTimeout(() => this.burnPlayer(client, dispatcher, player), 1000);
        }
        else {

            const index = burntPlayers.findIndex(id => id == player.id);
            if(index > -1) {
                burntPlayers.splice(index, 1);
            }
        }
    }
}