import { Command } from "@colyseus/command";
import { IEnemyState } from "@natewilcox/zelda-battle-shared";
import { BattleRoyaleRoom } from "../rooms/BattleRoyaleRoom";
import { GameTextures } from "@natewilcox/zelda-battle-shared";
import { getDamageDeltByWeapon } from "@natewilcox/zelda-battle-shared";
import { IPlayerState } from "@natewilcox/zelda-battle-shared";

/**
 * Payload type definition
 */
type Payload = {
    attackerState?: IPlayerState,
    enemyState: IEnemyState,
    x: number,
    y: number,
    weapon?: GameTextures
};

/**
 * Command to hurt an enemy
 */
export class HurtEnemyCommand extends Command<BattleRoyaleRoom, Payload> {


    /**
     * Executes command
     * 
     * @param param0 
     * @returns 
     */
    async execute({ attackerState, enemyState, x, y, weapon }: Payload) {

        const enemy = this.room.state.enemies.find(p => p.id == enemyState.id);
        if(!enemy || enemy.alpha == 0.5) return;

        let damage = 0;

        if(weapon) {
            damage = getDamageDeltByWeapon(weapon);
            enemy.health -= damage;
        }
        
        if(attackerState) {
            attackerState.damageGiven += damage;
        }

        this.room.emit('onenemyhurt', { id: enemy.id, x, y });
    }
}