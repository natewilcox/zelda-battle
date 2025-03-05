import { Command, Dispatcher } from "@colyseus/command";
import { ServerMessages } from "@natewilcox/zelda-battle-shared";
import { GameTextures } from "@natewilcox/zelda-battle-shared";
import { HitTargetsCommand } from "./HitTargetsCommand";
import { FreezePlayerCommand } from './FreezePlayerCommand';
import { BurnPlayerCommand } from './BurnPlayerCommand';
import { Client } from "colyseus";
import { BattleRoyaleRoom } from "../rooms/BattleRoyaleRoom";

/**
 * Payload type definition
 */
type Payload = {
    client: Client,
    dispatcher: Dispatcher<BattleRoyaleRoom>,
    t: GameTextures,
    id: number,
    x: number,
    y: number,
    clientId: string,
    playerId: number
};


/**
 * Command to handle bullet collision
 */
export class BulletCollisionCommand extends Command<BattleRoyaleRoom, Payload> {


    /**
     * Executes command to handle bullet collision
     * 
     * @param param0 
     */
    execute({client, dispatcher, t, id, x, y, clientId, playerId}) {

        const targetClient = this.room.clients.find(c => c.id == clientId);
        const state = this.room.state.playerStates.find(s => s.clientId == clientId);

        //you cannot collide with a client/state that doesnt exist, or someone that is dead
        if(!targetClient || !state || state.health ==0) return;

        //tell all clients about the collision
        this.room.broadcast(ServerMessages.BulletCollision, {
            id: id, 
            x: x, 
            y: y,
            remove: t != GameTextures.LargeLightBall
        }, {
            except: client
        });

        const targets: any = [];
        targets.push({id: state.id, clientId: state.clientId});

        if(t == GameTextures.Fireball) {
            
            return [new BurnPlayerCommand().setPayload({
                client: client,
                id: state.id,
                dispatcher: dispatcher
            })];
        }
        else if(t == GameTextures.IceBlast) {
            
            return [new FreezePlayerCommand().setPayload({
                client: client,
                id: state.id,
                dispatcher: dispatcher
            })];
        }
        else if(t == GameTextures.MagicArrow) {

            return [new HitTargetsCommand().setPayload({
                client: client,
                dispatcher: dispatcher,
                weapon: t,
                x: x,
                y: y,
                targetList: targets
            })];
        }
        else if(t == GameTextures.Arrow) {

            return [new HitTargetsCommand().setPayload({
                client: client,
                dispatcher: dispatcher,
                weapon: t,
                x: x,
                y: y,
                targetList: targets
            })];
        }
        else if(t == GameTextures.LargeLightBall) {
        
            return [new HitTargetsCommand().setPayload({
                client: client,
                dispatcher: dispatcher,
                weapon: t,
                x: x,
                y: y,
                targetList: targets
            })];
        }
    }
}