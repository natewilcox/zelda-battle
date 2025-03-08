import { Command, Dispatcher } from "@colyseus/command";
import { GameTextures } from '@natewilcox/zelda-battle-shared'
import { Client } from "colyseus";
import { BattleRoyaleRoom } from "../rooms/BattleRoyaleRoom";
import { GameState } from "@natewilcox/zelda-battle-shared";
import { HurtPlayerCommand } from "./HurtPlayerCommand";
import { HurtEnemyCommand } from "./HurtEnemyCommand";

/**
 * Payload type definition
 */
type Payload = {
    client?: Client,
    dispatcher: Dispatcher<BattleRoyaleRoom>,
    weapon: number,
    x: number,
    y: number,
    targetList: [{id: number, clientId: string}],
    iframes?: boolean
}

const itemDropRate = [
    [GameTextures.RedRupee, 1],
    [GameTextures.BlueRupee, 5],
    [GameTextures.GreenRupee, 10],
    [GameTextures.OneArrow, 10],
    [GameTextures.OneBomb, 5],
    [GameTextures.SmallHeart, 10],
    [GameTextures.MagicBottle, 5],
    [GameTextures.MagicJar, 1]
];

/**
 * Server Command to try and attack a target
 * Does nothing when the game hasnt started yet.
 */
export class HitTargetsCommand extends Command<BattleRoyaleRoom, Payload> {


    /**
     * Executes the command.
     * 
     * @param param0 
     * @returns 
     */
    execute({ client, dispatcher, weapon, x, y, targetList, iframes = true}: Payload) {
        
        //if the game hasnt started yet, dont do anything
        if(this.room.state.gameState !== GameState.InProgress) return;

        //if attack comes from player, find the attacker
        const attackerState = client ? this.room.state.playerStates.find(s => s.clientId == client.id) : undefined;


        targetList.forEach(target => {


            //determine what is being hit
            const enemy = this.room.state.enemies.find(e => e.id == target.id);
            if(enemy) {
                this.room.dispatcher.dispatch(new HurtEnemyCommand().setPayload({ attackerState, enemyState: enemy, x, y, weapon }));
            }

            const player = this.room.state.playerStates.find(p => p.id == target.id);
            if(player) {
                this.room.dispatcher.dispatch(new HurtPlayerCommand().setPayload({ attackerState, playerState: player, x, y, weapon }));
            }
            
        });
    }
}