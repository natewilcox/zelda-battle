import { Command } from "@colyseus/command";
import { ServerMessages } from "@natewilcox/zelda-battle-shared";
import { Direction, GameTextures } from "@natewilcox/zelda-battle-shared";
import { adjustBulletByItem, adjustMagicByItem } from "@natewilcox/zelda-battle-shared";
import { BattleRoyaleRoom } from '../rooms/BattleRoyaleRoom';

/**
 * Payload type definition
 */
type Payload = {
    client,
    t: GameTextures,
    d: Direction,
    x: number,
    y: number
};


/**
 * Command to fire bow and shoot arros
 */
export class FireBowCommand extends Command<BattleRoyaleRoom, Payload> {


    /**
     * Executes command to shot bow
     * 
     * @param param0 
     */
    execute({client, t, d, x, y}) {

        const player = this.room.state.playerStates.find(p => p.clientId == client.id);

        if(player == null) return;

        //check if the player has any arrows first
        if(player.arrows > 0) {

            player.arrows--;

            const magicCost = this.magicCostByBow(t);

            if(player.magic >= magicCost) {

                player.magic -= magicCost;
                player.magicUsed += magicCost;

                if(player.magic < 0) player.magic = 0;
            }
            
            const startingBulletCount = this.room.state.bulletCounter;
            this.room.state.bulletCounter = adjustBulletByItem(startingBulletCount, t);

            //broacast to everyone that the client initiated an attack
            this.room.broadcast(ServerMessages.ArrowShot, {
                who: player.id,
                text: t,
                dir: d,
                b: startingBulletCount
            });
        }
    }

    private magicCostByBow = (textId: GameTextures) => {

        let magic = 0;

        switch(textId) {
            case GameTextures.MagicBow:
                magic = 5;
                break;
            case GameTextures.MagicBow3Arrow:
                magic = 10;
                break;
            case GameTextures.MagicBow5Arrow:
                magic = 20;
                break;
                
        }
    
        return magic;
    }
}