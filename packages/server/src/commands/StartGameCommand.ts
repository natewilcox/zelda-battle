import { Command, Dispatcher } from '@colyseus/command';
import { IPlayerState } from '@natewilcox/zelda-battle-shared';
import { getRandomNumber } from '@natewilcox/zelda-battle-shared';
import { GameTextures } from '@natewilcox/zelda-battle-shared';
import { getDistanceBetween } from '@natewilcox/zelda-battle-shared';
import { HitTargetsCommand } from './HitTargetsCommand';
import { ServerMessages } from '@natewilcox/zelda-battle-shared';
import { BattleRoyaleRoom } from '../rooms/BattleRoyaleRoom';
import { GameState } from '@natewilcox/zelda-battle-shared';


/**
 * type defenition for command input
 */
type Payload = {
    dispatcher: Dispatcher<BattleRoyaleRoom>
}


/**
 * Server command to start the game.
 * Wizard will warp all players to various spots around the map.
 */
export class StartGameCommand extends Command<BattleRoyaleRoom, Payload> {
    
    private dispatcher!: Dispatcher<BattleRoyaleRoom>;
    private currentWidth = 1700;

    //points to spawn across the map.
    private spawnPoints = [
        [27, 122],
        [26, 184],
        [26, 214],
        [26, 240],
        [50, 184],
        [134, 273],
        [269, 160],
        [201, 72],
        [176, 11],
        [219, 11],
        [268, 15]
    ];

     private zones = [
        { length: 180, width: 1700, moves: false },
        { length: 60, width: 1000,  moves: false },
        { length: 120, width: 1000,  moves: false },
        { length: 60, width: 600,  moves: false },
        { length: 60, width: 600,  moves: false },
        { length: 30, width: 300,  moves: false },
        { length: 60, width: 300,  moves: false },
        { length: 30, width: 100,  moves: false },
        { length: 10, width: 50,  moves: true },
        { length: 10, width: 0,  moves: false },
    ];

    private zoneIndex = 0;

    private dw = 0;
    private dx = 0;
    private dy = 0;

    /**
     * Executes the command to start the game.
     * 
     * @param param0 
     */
    execute({ dispatcher } : Payload) {

        //check if the game is already in progress
        if(this.room.state.gameState == GameState.InProgress) return;

        //remove all handlers for tick event
        this.room._events.removeAllListeners('ontick');

        this.dispatcher = dispatcher;

        //lock the room and change room state to 'inprogress'
        this.room.lock();
        this.room.state.gameState = GameState.InProgress;
        
        //in 5 seconds, have wizard warp players
        this.clock.setTimeout(this.startGameHandler, 5000);
    }


    /**
     * Handler when game starts.
     * Will move players across map.
     */
    private startGameHandler = () => {

        const agahnim = this.room.state.npcs.find(npc => npc.texture == GameTextures.Agahnim);

        //for dramatic effect, wait 1 second and then teleport
        this.clock.setTimeout(() => {

            //set casting animation and move each player
            if(agahnim) {
                agahnim.anim = 'casting';
            }

            this.room.state.playerStates.forEach(this.teleportPlayer);

             //for dramatic effect, wait 1 second and then teleport
            this.clock.setTimeout(() => {

                //set back to idle
                if(agahnim) {
                    agahnim.anim = 'standing';
                }

                this.room._events.on('ontick', this.tickHandler)

            }, 2500);

        }, 1000);
    }


    private getRandomZone = (i: number, width: number, move: boolean) => {
   
        let x, y;

        //first zone is restricted by map
        if(i == 2) {

            x = getRandomNumber(width, 2400 - width);
            y = getRandomNumber(width, 2400 - width);
        }
        else {

            let offsetX = 0, offsetY = 0;

            if(move) {
                offsetX = getRandomNumber(-500, 500);
                offsetY = getRandomNumber(-500, 500);
            }

            x = getRandomNumber(this.state.zoneX - this.state.zoneWidth + width, this.state.zoneX + this.state.zoneWidth - width) + offsetX;
            y = getRandomNumber(this.state.zoneY - this.state.zoneWidth + width, this.state.zoneY + this.state.zoneWidth - width) + offsetY;
        }

        return { x, y };
    }

    private tickHandler = (timer) => {
        
        //if the game is not in progress, do not change storm
        if(this.room.state.gameState !== GameState.InProgress) return;

        if(timer == 0) {

            if(this.zoneIndex <= this.zones.length-1) {
        
                const zone = this.zones[this.zoneIndex++];
                this.state.timer = zone.length;

                if(zone.width != this.state.zoneWidth) {

                    const center = this.getRandomZone(this.zoneIndex, zone.width, zone.moves);
            
                    this.dw = Math.floor((this.state.zoneWidth - zone.width) / zone.length);
                    this.dx = Math.floor((this.state.zoneX - center.x) / zone.length);
                    this.dy = Math.floor((this.state.zoneY - center.y) / zone.length);
         
                    //if the storm is changing by any metric, send warning
                    if(this.dw != 0 || this.dx != 0 || this.dy != 0) {
                        this.room.broadcast(ServerMessages.Message, "Warning: Safe Zone is Changing!");
                    }
                }
                else {
                    this.dw = 0;
                    this.dx = 0;
                    this.dy = 0;
                }
                //console.log(`starting zone ${this.zoneIndex}. shrinks by ${this.dw}, moves by [${this.dx},${this.dy}] for ${this.state.timer} seconds`);
            }
            else {
                this.dw = 0;
                this.dx = 0;
                this.dy = 0;
            }
        }

        //check for anyone in the storm
        this.hurtPeopleInStorm();

        //adjust storm based on zone
        this.state.zoneWidth -= this.dw;
        this.state.zoneX += this.dx;
        this.state.zoneY += this.dy;

        //console.log(`${timer} - ${this.state.zoneWidth}@[${this.state.zoneX},${this.state.zoneY}]`)
    }

    private hurtPeopleInStorm = () => {

        const offset = this.dw > 0 ? -this.dw : 0;

        this.room.state.playerStates
            .filter(player => getDistanceBetween(player.x, player.y, this.room.state.zoneX, this.room.state.zoneY) > (this.room.state.zoneWidth - offset))
            .filter(player => player.health > 0)
            .forEach(player => {

                const client = this.room.clients.find(c => c.id == player.clientId);

                if(client) {

                    this.dispatcher.dispatch(new HitTargetsCommand().setPayload({
                        dispatcher: this.dispatcher,
                        weapon: GameTextures.Storm,
                        x: player.x,
                        y: player.y,
                        targetList: [{ id: player.id, clientId: player.clientId }],
                        iframes: false
                    }));
                }
            }
        );
    };


    /**
     * Handler for moving each player
     * 
     * @param playerState 
     */
    private teleportPlayer = (playerState: IPlayerState) => {


        //show ring around player
        playerState.hasOra = true;

        //after 2 seconds make not visible and move to spawn point
        this.clock.setTimeout(() => {
            
            playerState.visible = false;
            playerState.hasControl = false;

            //after a second, move the player into position
            this.clock.setTimeout(() => {

                //notify client to change camera bounds
                const client = this.room.clients.find(c => c.id == playerState.clientId);
                
                if(!client) return;

                //fade out client for transition
                client.send(ServerMessages.FadeOut);

                this.clock.setTimeout(() => {

                    //change camera bounds
                    client.send(ServerMessages.SetCameraBounds, {
                        x: 0,
                        y: 0,
                        w: 300*8, 
                        h: 300*8
                    });

                    const spawnPoint = this.getSpawnPoint();
                    const starting_x = spawnPoint[0];
                    const starting_y = spawnPoint[1];

                    playerState.teleport_x = starting_x;
                    playerState.teleport_y = starting_y;
                    playerState.x = starting_x;
                    playerState.y = starting_y;
                    playerState.visible = true;
                    playerState.hasControl = true;
                    playerState.hasOra = false;
                    playerState.resetAudit = true;
                    
                    client.send(ServerMessages.FadeIn);

                    this.clock.setTimeout(() => {

                        client.send(ServerMessages.WakePlayerUp, {
                            id: playerState.id
                        });
                        
                    }, 2000)

                }, 2000);

            }, 1000);

        }, 2000);
    }


    /**
     * Gets a random spawn point and removes it from the list.
     * 
     * @returns 
     */
    private getSpawnPoint() {

        const randomIndex = getRandomNumber(0, this.spawnPoints.length);

        //get the point and remove from list
        const point = this.spawnPoints[randomIndex];
        this.spawnPoints.splice(randomIndex, 1);

        return [point[0]*8, point[1]*8];
    }
}