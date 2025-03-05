import { Command } from "@colyseus/command";
import { ResetPlayerCommand } from "./ResetPlayerCommand";
import { BattleRoyaleRoom } from '../rooms/BattleRoyaleRoom';

/**
 * Payload type definition
 */
type Payload = {
    playerAuditData: Map<number, {x:number, y:number}>
}

/**
 * Command to audit player movements
 */
export class AuditPlayerMovementCommand extends Command<BattleRoyaleRoom, Payload> {


    /**
     * Executes the command.
     * 
     * @param payload 
     * @returns 
     */
    async execute({ playerAuditData }: Payload) {

        //const start = new Date().getTime();

        //audit player against last audited state
        this.room.state.playerStates.forEach(player => {

            //reset the audit cache when the player state is flagged to do so
            if(player.resetAudit) {
                playerAuditData.set(player.id, { x: player.x, y: player.y });
                player.resetAudit = false;
            }

            const oldState = playerAuditData.get(player.id);
            let isValid = true;

            if(oldState != null) {

                //console.log(`x1:${oldState.x} y1:${oldState.y} x2:${player.x} y2:${player.y}`)
                //audit the last and new position to confirm there is a valid path.
                isValid = true;//this.room.state.map.auditMovement(oldState.x, oldState.y, player.x, player.y);

                if(!isValid) {
                    //add greviance to player
                    player.greviances++;

                    //if the player has exceeded greviange threshold, boot them
                    if(player.greviances > 10) {
                        
                        const client = this.room.clients.find(c => c.id == player.clientId);

                        if(client) {
                            client.leave();
                        }
                    }
                    else {

                        //else just reset them
                        this.room.dispatcher.dispatch(new ResetPlayerCommand().setPayload({
                            clientId: player.clientId,
                            id: player.id,
                            x: oldState.x,
                            y: oldState.y
                        }));
                    }
                }
            }

            //update audit data only if current state is valid.
            if(isValid) {
                playerAuditData.set(player.id, { x: player.x, y: player.y });
            }
        });

        
        this.clock.setTimeout(() => this.room.dispatcher.dispatch(new AuditPlayerMovementCommand(), { playerAuditData: playerAuditData }), 200);

        //let elapsed = new Date().getTime() - start;
        //console.log(`excuted in ${elapsed} ms`);
    }
}