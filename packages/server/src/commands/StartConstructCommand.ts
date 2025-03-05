import { Command } from '@colyseus/command';
import { GameTextures } from '@natewilcox/zelda-battle-shared';
import { BattleRoyaleRoom } from '../rooms/BattleRoyaleRoom';
import { GameState } from '@natewilcox/zelda-battle-shared';
import { ServerMessages } from '@natewilcox/zelda-battle-shared';


/**
 * type defenition for command input
 */
type Payload = {
}


/**
 * Server command to start the construct.
 */
export class StartConstructCommand extends Command<BattleRoyaleRoom, Payload> {
    
    /**
     * Executes the command to start
     * 
     * @param param0 
     */
    execute({  } : Payload) {

        //check if the game is already in progress
        if(this.room.state.gameState == GameState.InProgress) return;

        //lock the room and change room state to 'inprogress'
        this.room.lock();
        this.room.state.gameState = GameState.InProgress;

        console.log('construct started');

        setTimeout(() => {
            this.room.broadcast(ServerMessages.SetCameraBounds, {
                x: 0,
                y: 0,
                w: 100*8, 
                h: 100*8
            });
        }, 2000);
    }
}