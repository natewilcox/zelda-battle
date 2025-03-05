import { Command } from "@colyseus/command";
import { GameTextures } from "@natewilcox/zelda-battle-shared";
import { BattleRoyaleRoom } from "../rooms/BattleRoyaleRoom";
import { IPlayerState } from '@natewilcox/zelda-battle-shared';
import { calculateCollisionDamage, getDamageDeltByWeapon } from "@natewilcox/zelda-battle-shared";
import { IEnemyState } from "@natewilcox/zelda-battle-shared";

/**
 * Payload type definition
 */
type Payload = {
    attackerState?: IPlayerState,
    playerState: IPlayerState,
    enemyState?: IEnemyState,
    x: number,
    y: number,
    weapon?: GameTextures
};

/**
 * Command to hurt a player
 */
export class HurtPlayerCommand extends Command<BattleRoyaleRoom, Payload> {


    /**
     * Executes command
     * 
     * @param param0 
     * @returns 
     */
    async execute({ attackerState, playerState, enemyState, x, y, weapon }: Payload) {

        const player = this.room.state.playerStates.find(p => p.id == playerState.id);
        if(!player || player.alpha == 0.5) return;

        let damage = 0;

        if(weapon) {
            damage = getDamageDeltByWeapon(weapon);
        }

        if(attackerState) {
            attackerState.damageGiven += damage;
        }

        if(enemyState) {
            damage = calculateCollisionDamage(enemyState.texture);
        }

        player.health -= damage;
        player.damageTaken += damage;
        player.alpha = 0.5;
        
        this.room.emit('onplayerhurt', { id: playerState.id, x, y });

        this.clock.setTimeout(() => {
            player.alpha = 1;
        }, 2000);
    }
}