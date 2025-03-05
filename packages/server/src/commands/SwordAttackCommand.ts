import { Command } from "@colyseus/command";
import { IPlayerState } from "@natewilcox/zelda-battle-shared";
import { BattleRoyaleRoom } from "../rooms/BattleRoyaleRoom";
import { Direction, GameTextures } from "@natewilcox/zelda-battle-shared";
import { HitTargetsCommand } from "./HitTargetsCommand";

/**
 * Payload type definition
 */
type Payload = {
    client,
    texture: GameTextures,
    dir: Direction
};


/**
 * Command to swing a sword
 */
export class SwordAttackCommand extends Command<BattleRoyaleRoom, Payload> {


    /**
     * Executes command to use the cape
     * 
     * @param param0 
     */
    execute({ client, texture, dir }: Payload) {

        const player = this.room.state.playerStates.find(p => p.clientId == client.id);
        if(player == null) return;

        //console.log(`[${player.x},${player.y}] using ${texture} towards ${dir}`);
        this.swordAttack(client, player, texture, dir, 1, this.room.state.simulation.scene.getScene('SimulationScene'));
    }

    private swordAttack = (client, player: IPlayerState, texture: GameTextures, dir: Direction, hitboxMulti: number, scene: Phaser.Scene) => {

        const hitbox = scene.add.rectangle(-100, -100, 5, 10).setStrokeStyle(1, 0x000000);
    
        switch(dir) {
            case Direction.North : 
                this.positionHitScan(player.x, player.y - 20, 30*hitboxMulti, 15*hitboxMulti, hitbox);
                break;
            case Direction.South : 
                this.positionHitScan(player.x, player.y + 20, 30*hitboxMulti, 15*hitboxMulti, hitbox);
                break;
            case Direction.East : 
                this.positionHitScan(player.x + 20, player.y, 15*hitboxMulti, 30*hitboxMulti, hitbox);
                break;
            case Direction.West : 
                this.positionHitScan(player.x - 20, player.y, 15*hitboxMulti, 30*hitboxMulti, hitbox);
                break;
        }
    
        //check for contact
        const x = hitbox.x - (hitbox.width / 2);
        const y = hitbox.y - (hitbox.height / 2);
        const collidedObjects: any = scene.physics.overlapRect(x, y, hitbox.width, hitbox.height);
    
        //convert list of collided bodies into gameobjects
        const targets = collidedObjects
            .filter(co => co.gameObject.id != player.id && !(co.gameObject instanceof Phaser.GameObjects.Arc))
            .map(go => go.gameObject);
    
        if(targets.length > 0) {

            const targetIds: any = [];

            //let all the players in range know they are hit
            targets.forEach(target => {
                targetIds.push({id: target.id});
            });

            this.room.dispatcher.dispatch(new HitTargetsCommand().setPayload({
                client: client,
                dispatcher: this.room.dispatcher,
                weapon: texture,
                x: player.x,
                y: player.y,
                targetList: targetIds,
                iframes: false
            }));
        }
        
        //destroy hitbox
        hitbox.destroy();
    }

    private positionHitScan = (x: number, y: number, w: number, h: number, hitbox: Phaser.GameObjects.Rectangle) => {

        hitbox.setPosition(2+x-w/2, y+5-h/2);
        hitbox.setSize(w, h);
    }

}