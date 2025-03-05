import { Command } from "@colyseus/command";
import { BattleRoyaleRoom } from "../rooms/BattleRoyaleRoom";
import { IEnemyState } from '@natewilcox/zelda-battle-shared';
import { SpawnItemCommand } from "./SpawnItemCommand";

/**
 * Payload type definition
 */
type Payload = {
    enemyState: IEnemyState
};

/**
 * Command destroy an enemy
 */
export class DestroyEnemyCommand extends Command<BattleRoyaleRoom, Payload> {


    /**
     * Executes command to break a tile.
     * 
     * @param param0 
     * @returns 
     */
    async execute({ enemyState }: Payload) {

        const index = this.state.enemies.findIndex(e => e.id == enemyState.id);
        const state = this.state.enemies.find(e => e.id == enemyState.id);

        if(!state) return;

        if(state.drops) {

            this.room.dispatcher.dispatch(new SpawnItemCommand().setPayload({
                x: enemyState.x,
                y: enemyState.y,
                item: state.drops
            }));
        }

        this.state.enemies.splice(index, 1);
    }
}