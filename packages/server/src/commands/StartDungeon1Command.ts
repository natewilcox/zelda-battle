import { Command } from '@colyseus/command';
import { GameTextures } from '@natewilcox/zelda-battle-shared';
import { BattleRoyaleRoom } from '../rooms/BattleRoyaleRoom';
import { GameState } from '@natewilcox/zelda-battle-shared';
import { TalkCommand } from './TalkCommand';
import { SpawnItemCommand } from './SpawnItemCommand';
import _ from 'lodash';

/**
 * type defenition for command input
 */
type Payload = {
}

/**
 * Server command to start the dungeon1.
 */
export class StartDungeon1Command extends Command<BattleRoyaleRoom, Payload> {
    

    /**
     * Executes the command to start
     * 
     * @param param0 
     */
    execute({  } : Payload) {

        const roomState = this.room.state
        
        //check if the game is already in progress
        if(this.room.state.gameState == GameState.InProgress) return;

        //lock the room and change room state to 'inprogress'
        this.room.lock();
        this.room.state.gameState = GameState.InProgress;

        console.log('dungeon started');
        this.configureOldMan();
        
        this.room.state.enemies.forEach(enemy => this.room.emit('onememyadded', enemy));
        this.room.state.playerStates.forEach(player => this.room.emit('onplayeradded', player));
    }

    private configureOldMan = () => {

        let spawned = 0;
        let asked = 0;

        const oldMan = this.room.state.npcs.find(npc => npc.texture == GameTextures.OldMan);

        oldMan?.onProcess(() => {

            if(spawned == 0) {

                spawned++;
                this.room.dispatcher.dispatch(new TalkCommand().setPayload({
                    id: oldMan.id,
                    msg: `It's dangerous to go alone. Take this.`
                }));

                this.clock.setTimeout(() => {

                    this.room.dispatcher.dispatch(new SpawnItemCommand().setPayload({
                        x: oldMan.x, 
                        y: oldMan.y+16, 
                        item: GameTextures.Sword1, 
                        dx: 10, 
                        dy: 10, 
                        delay: 0
                    }));
                }, 3000);
            }
            else if(spawned == 1) {

                spawned++;
                this.room.dispatcher.dispatch(new TalkCommand().setPayload({
                    id: oldMan.id,
                    msg: `...You can have this too.`
                }));

                this.clock.setTimeout(() => {

                    this.room.dispatcher.dispatch(new SpawnItemCommand().setPayload({
                        x: oldMan.x, 
                        y: oldMan.y+16, 
                        item: GameTextures.BlueShield, 
                        dx: -10, 
                        dy: 10, 
                        delay: 0
                    }));
                }, 2000);
            }
            else {

                asked++;
                if(asked != 10) {
                    this.room.dispatcher.dispatch(new TalkCommand().setPayload({
                        id: oldMan.id,
                        msg: `I have nothing left...`
                    }));
                }
                else {

                    this.room.dispatcher.dispatch(new TalkCommand().setPayload({
                        id: oldMan.id,
                        msg: `...Fine. Take this too`
                    }));
    
                    this.clock.setTimeout(() => {
    
                        this.room.dispatcher.dispatch(new SpawnItemCommand().setPayload({
                            x: oldMan.x, 
                            y: oldMan.y+16, 
                            item: GameTextures.SmallKey, 
                            dx: -10, 
                            dy: 10, 
                            delay: 0
                        }));
                    }, 2000);
                }
            }
        });
    }
}