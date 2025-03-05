import { Command } from "@colyseus/command";
import { ServerMessages } from "@natewilcox/zelda-battle-shared";
import { Direction } from "@natewilcox/zelda-battle-shared";
import { BattleRoyaleRoom } from '../rooms/BattleRoyaleRoom';

/**
 * Payload type definition
 */
type Payload = {
    client,
    x: number,
    y: number,
};


/**
 * Command to open locked door
 */
export class OpenLockedDoorCommand extends Command<BattleRoyaleRoom, Payload> {


    /**
     * Executes command to open locked door
     * 
     * @param param0 
     */
    execute({ client, x, y }) {

        //do nothing if cant find player or player has no keys
        const player = this.room.state.playerStates.find(p => p.clientId == client.id);
        if(player == null || player.keys < 0) return;

        //check if the root tile is a locked door
        // const tileProps = this.room.state.map.groundLayer.getTilePropertiesAt(x, y);
        // if(tileProps.find(prop => prop.name == 'type')?.value != 'lockedDoor') {
        //     return;
        // }

        // //take away key
        // player.keys--;
        // if(player.keys < 0) player.keys = 0;

        // console.log('unlocking door');
        // const dir = tileProps.find(prop => prop.name == 'dir')?.value;

        // if(dir == 'left') {
        //     this.room.state.map.groundLayer.animateTile(x, y);
        //     this.room.state.map.groundLayer.animateTile(x, y-1);
        //     this.room.state.map.groundLayer.animateTile(x, y-2);
        //     this.room.state.map.groundLayer.animateTile(x, y-3);
    
        //     this.room.state.map.groundLayer.animateTile(x-1, y);
        //     this.room.state.map.groundLayer.animateTile(x-1, y-1);
        //     this.room.state.map.groundLayer.animateTile(x-1, y-2);
        //     this.room.state.map.groundLayer.animateTile(x-1, y-3);
        // }
        // else if(dir == 'right') {
        //     this.room.state.map.groundLayer.animateTile(x, y);
        //     this.room.state.map.groundLayer.animateTile(x, y-1);
        //     this.room.state.map.groundLayer.animateTile(x, y-2);
        //     this.room.state.map.groundLayer.animateTile(x, y-3);
    
        //     this.room.state.map.groundLayer.animateTile(x+1, y);
        //     this.room.state.map.groundLayer.animateTile(x+1, y-1);
        //     this.room.state.map.groundLayer.animateTile(x+1, y-2);
        //     this.room.state.map.groundLayer.animateTile(x+1, y-3);
        // }
        // else if(dir == 'up') {
        //     this.room.state.map.groundLayer.animateTile(x, y);
        //     this.room.state.map.groundLayer.animateTile(x+1, y);
        //     this.room.state.map.groundLayer.animateTile(x+2, y);
        //     this.room.state.map.groundLayer.animateTile(x+3, y);
    
        //     this.room.state.map.groundLayer.animateTile(x, y-1);
        //     this.room.state.map.groundLayer.animateTile(x+1, y-1);
        //     this.room.state.map.groundLayer.animateTile(x+2, y-1);
        //     this.room.state.map.groundLayer.animateTile(x+3, y-1);
        // }
        // else if(dir == 'down') {
        //     this.room.state.map.groundLayer.animateTile(x, y);
        //     this.room.state.map.groundLayer.animateTile(x+1, y);
        //     this.room.state.map.groundLayer.animateTile(x+2, y);
        //     this.room.state.map.groundLayer.animateTile(x+3, y);
    
        //     this.room.state.map.groundLayer.animateTile(x, y+1);
        //     this.room.state.map.groundLayer.animateTile(x+1, y+1);
        //     this.room.state.map.groundLayer.animateTile(x+2, y+1);
        //     this.room.state.map.groundLayer.animateTile(x+3, y+1);
        // }

        //console.log(`opening door at [${x},${y}]`)
        this.room.broadcast(ServerMessages.LockedDoorOpened, { x, y }); 
    }
}