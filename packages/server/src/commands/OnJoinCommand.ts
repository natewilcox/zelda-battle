import generateUniqueId  from 'generate-unique-id';

import { Command, Dispatcher } from '@colyseus/command';
import { getRandomNumber } from '@natewilcox/zelda-battle-shared';
import { PlayerState } from '../rooms/schema/PlayerState';
import { ServerMessages } from '@natewilcox/zelda-battle-shared';
import { StartGameCommand } from './StartGameCommand';
import { BattleRoyaleRoom } from '../rooms/BattleRoyaleRoom';

/**
 * type defenition for command input
 */
type Payload = {
    dispatcher: Dispatcher<BattleRoyaleRoom>,
    sessionId: string,
    handle: string,
    uid: string,
    token: string,
    gameMode: number,
    minClients: number
}


/**
 * Server command for when players attempt to join game.
 * Creates a playerstate object and sprites for their character and weapons.
 */
export class OnJoinCommand extends Command<BattleRoyaleRoom, Payload> {

    private dispatcher!: Dispatcher<BattleRoyaleRoom>;

    /**
     * Creates player objects on server
     * 
     * @param param0 
     */
    async execute({ dispatcher, sessionId, handle, uid, token, gameMode, minClients }: Payload) {

        //find the client object by session id.
        const client = this.room.clients.find(c => c.id === sessionId);
        const uuid = +generateUniqueId({length: 5,useLetters: false});

        console.log(`${handle} has joined (${uuid}) gameMode=${gameMode}`);
        
        //start validating the users session id doesnt change

        this.dispatcher = dispatcher;

        //get random link texture
        const linkColor = getRandomNumber(0, 3);

        //create a new player state
        const playerState = new PlayerState(
            handle,
            uid,
            sessionId, 
            uuid,
            linkColor,
            12,
            12,
            0,
            100,
            0,
            99,
            0,
            10,
            0,
            50,
            this.room.state.spawnx,
            this.room.state.spawny,
            100
        );

        //add player state to list of current players
        this.room.state.playerStates.push(playerState);

        //broadcast message to other clients about the joining player.
        this.room.broadcast(ServerMessages.Message, `${handle} has joined the match`, {
            except: client
        });

        //check if there is enough to play and start the game
        if(this.room.hasReachedMaxClients()) {

            return [new StartGameCommand().setPayload({ dispatcher })];
        }
        else {

            //if more there are the minimum clients joined, start a time based on the percentage
            if(this.room.clients.length >= minClients) {
               
                //if room is half full, only wait 10 seconds for more players
                //else, lets wait 30
                if(this.room.clients.length >= (this.room.maxClients * 0.5)) {
                    this.room.state.timer = 10;
                }
                else {
                    this.room.state.timer = 30;
                }
           
                //remove all existing handlers for tick event
                this.room._events.removeAllListeners('ontick');
                
                //add a tick listen to start game when it counts down to 0
                this.room._events.on('ontick', (timer) => {
                   
                    //if the timer goes down and we still have more than one player
                    if(timer == 0 && this.room.clients.length >= minClients) {
                        
                        //when the timer reaches 0, start game
                        this.dispatcher.dispatch(new StartGameCommand().setPayload({ dispatcher }));
                    }
                });
            }
        }
    }
}