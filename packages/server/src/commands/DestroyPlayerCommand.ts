import { Command, Dispatcher } from "@colyseus/command";
import { BattleRoyaleRoom } from "../rooms/BattleRoyaleRoom";
import { SpawnItemCommand } from "./SpawnItemCommand";
import { GameTextures, getKillFeedMessage, getRandomNumber, LinkState, ServerMessages } from "@natewilcox/zelda-battle-shared";
import { IPlayerState } from "@natewilcox/zelda-battle-shared";
import { SendPlacementCommand } from "./SendPlacementCommand";

/**
 * Payload type definition
 */
type Payload = {
    playerState: IPlayerState
};

const one_cords = [
    {dx: 0, dy: 15}
]

const two_cords = [
    {dx: -10, dy: 10},
    {dx: 10, dy: 10},
]

const three_cords = [
    {dx: -10, dy: 10},
    {dx: 0, dy: 15},
    {dx: 10, dy: 10},
]

const four_Cords = [
    {dx: -13, dy: 0},
    {dx: -7, dy: 10},
    {dx: 7, dy: 10},
    {dx: 13, dy: 0},
]

const five_cords = [
    {dx: -15, dy: 0},
    {dx: -10, dy: 10},
    {dx: 0, dy: 15},
    {dx: 10, dy: 10},
    {dx: 15, dy: 0},
]

const cords = [
    one_cords,
    two_cords,
    three_cords,
    four_Cords,
    five_cords
];

/**
 * Command destroy a player
 */
export class DestroyPlayerCommand extends Command<BattleRoyaleRoom, Payload> {


    /**
     * Executes command.
     * 
     * @param param0 
     * @returns 
     */
    async execute({ playerState }: Payload) {

        const client = this.room.clients.find(c => c.id == playerState.clientId);
        playerState.hasControl = false;

        //if the client is valid amd not currently invulnerable, has a shirle, or not dead, send hit
        if(client) {
            
            //if there is an attacker, increment their elimination counter
            // if(attacker) {
            //     attacker.eliminations++;
            // }

            //broadcast message to other clients about the death.
            //this.room.broadcast(ServerMessages.Message, getKillFeedMessage(playerState.handle, weapon, attacker?.handle));

            const alivePlayers = this.room.state.playerStates.filter(player => player.health > 0);

            this.room.dispatcher.dispatch(new SendPlacementCommand().setPayload({
                client: client,
                id: playerState.id,
                placement: alivePlayers.length + 1
            }));

            //if the player is dead, we need to hide their sprite
            this.clock.setTimeout(() => {
                playerState.visible = false;
                spawnHeldItems(playerState, this.room.dispatcher);
            }, 2000);
        }
    }
}


            

/**
 * Spawns the held items onto the ground where the player died
 * 
 * @param player 
 * @param Dispatcher 
 */
export const spawnHeldItems = (player: IPlayerState, dispatcher: Dispatcher<BattleRoyaleRoom>) => {

    const itemsToSpawn: GameTextures[] = buildDropPackage(player);
    
    let i = 0;
    const dropCords = cords[itemsToSpawn.length-1];

    //randomly pick the items and spawn in random order.
    while(itemsToSpawn.length > 0) {

        const itemIndex = getRandomNumber(0, itemsToSpawn.length);
        
        const item = itemsToSpawn[itemIndex];
        const cord = dropCords[i++];

        let dx = cord.dx;
        let dy = cord.dy;

        dispatcher.dispatch(new SpawnItemCommand().setPayload({ x: player.x, y: player.y, item: item, dx: dx, dy: dy, delay: 0 }));
        itemsToSpawn.splice(itemIndex, 1);
    }
}



/**
 * Builds a drop package based on what the player is holding.
 * 
 * @param player 
 * @returns 
 */
export const buildDropPackage = (player: IPlayerState) => {

    const itemsToSpawn: GameTextures[] = [];

    //create list of 5 items that includes the held items
    if(player.weaponSlot1) {
        itemsToSpawn.push(player.weaponSlot1);
    }
    if(player.weaponSlot2) {
        itemsToSpawn.push(player.weaponSlot2);
    }
    if(player.bombs > 0) {

        if(player.bombs >= 10) itemsToSpawn.push(GameTextures.TenBombs);
        else if(player.bombs >= 8) itemsToSpawn.push(GameTextures.EightBombs);
        else if(player.bombs >= 5) itemsToSpawn.push(GameTextures.FiveBombs);
        else itemsToSpawn.push(GameTextures.OneBomb);
    }
    if(player.arrows > 0) {
        if(player.arrows >= 10) itemsToSpawn.push(GameTextures.TenArrows);
        else itemsToSpawn.push(GameTextures.OneArrow);
    }
    if(player.rupees > 0) {
        if(player.rupees >= 20) itemsToSpawn.push(GameTextures.RedRupee);
        else if(player.rupees >= 10) itemsToSpawn.push(GameTextures.BlueRupee);
        else itemsToSpawn.push(GameTextures.GreenRupee);
    }

    return itemsToSpawn;
}