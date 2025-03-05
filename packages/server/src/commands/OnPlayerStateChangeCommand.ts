import { Command } from "@colyseus/command";
import { Direction, LinkState } from "@natewilcox/zelda-battle-shared";
import { BattleRoyaleRoom } from '../rooms/BattleRoyaleRoom';

/**
 * Payload type definition
 */
type Payload = {
    payloadId: string,
    x: number,
    y: number,
    d: Direction,
    ls: LinkState,
    s: number,
    t: number,
    h: boolean
}


/**
 * Command to update player state with data from client.
 */
export class OnPlayerStateChangeCommand extends Command<BattleRoyaleRoom, Payload> {

    /**
     * Executes command to determine winner.
     * 
     * @param param0 
     */
    execute({ payloadId, x, y, d, ls, s, t, h }: Payload) {

        const currentState = this.state.playerStates.get(payloadId);
    
        //dont update when player is hurt state
        if(currentState && currentState.state != LinkState.Hurt) {
            
            //update player settings
            if(x !== undefined) currentState.x = x;
            if(y !== undefined) currentState.y = y;
            if(d !== undefined) currentState.dir = d;
            if(ls !== undefined) currentState.state = ls;
            if(s !== undefined) currentState.speed = s;
            if(t !== undefined) currentState.curLandType = t;
            if(h !== undefined) currentState.isHiding = h;
        }
    }
}