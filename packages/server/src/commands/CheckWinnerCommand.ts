import { Command } from "@colyseus/command";
import { IPlayerState } from "@natewilcox/zelda-battle-shared";
import { SendPlacementCommand } from './SendPlacementCommand';
import { BattleRoyaleRoom } from '../rooms/BattleRoyaleRoom';
import { GameState } from "@natewilcox/zelda-battle-shared";

/**
 * Payload type definition
 */
type Payload = {

};


/**
 * Command to check if a single player remains. They are the winner
 */
export class CheckWinnerCommand extends Command<BattleRoyaleRoom, Payload> {


    /**
     * Checks if a single player remains. Returns player state of winner, 
     * or null if no winner has been decided.
     * 
     * @returns IPlayerState | null
     */
    private determineWinner(): IPlayerState | null {

        //find players with health greater than 0
        const alivePlayers = this.room.state.playerStates.filter(player => player.health > 0);
        
        let winner = null;

        //if there is only 1 alive player, they are the winner
        if(alivePlayers?.length == 1) {
            winner = alivePlayers[0];
        }

        //return the winner
        return winner;
    }


    /**
     * Executes command to determine winner.
     * 
     * @param param0
     */
    execute() {

        //if the game hasnt started yet, dont do this
        if(this.room.state.gameState !== GameState.InProgress) return;
        
        const winner = this.determineWinner();

        //if there is a winner, end the game
        if(winner) {

            const winningClient = this.room.clients.find(c=> c.id === winner.clientId);

            if(winningClient) {

                //change game state to finished so all clients are aware
                this.room.state.gameState = GameState.Completed;

                return [new SendPlacementCommand().setPayload({
                    client: winningClient,
                    id: winner.id,
                    placement: 1
                })];
            }
        }
    }
}