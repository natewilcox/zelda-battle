import { Command } from "@colyseus/command";
import { Client, Room } from "colyseus";
import { ItemState } from "../rooms/schema/ItemState";
import { PlayerState } from "../rooms/schema/PlayerState";
import { applyContentsToPlayer } from "@natewilcox/zelda-battle-shared";
import { SpawnItemCommand } from "./SpawnItemCommand";
import { getRandomNumber } from "@natewilcox/zelda-battle-shared";
import { GameTextures } from "@natewilcox/zelda-battle-shared";
import { BattleRoyaleRoom } from '../rooms/BattleRoyaleRoom';

/**
 * Payload type definition
 */
type Payload = {
    client: Client,
    id: number,
    who: number,
    slot?: number
}

const drop_cords = [
    {dx: -15, dy: 0},
    {dx: -10, dy: 10},
    {dx: 0, dy: 15},
    {dx: 10, dy: 10},
    {dx: 15, dy: 0},
]



/**
 * Server Command to try and collect an item
 * Does nothing when the game hasnt started yet.
 */
export class OnItemCollectedCommand extends Command<BattleRoyaleRoom, Payload> {


    /**
     * Executes the command.
     * 
     * @param param0 
     * @returns 
     */
    execute({ client, id, who, slot }: Payload) {

        const room = this.room;

        //get item reference
        const item = room.state.itemStates.find(i => i.id === id) as ItemState;
        const player = room.state.playerStates.get(who + "") as PlayerState;

        //return if item|player is not available
        if(item == null || player == null) return;

        //applyItemToPlayer(item, player);
        const dropped = applyContentsToPlayer(player, item.itemType, slot);

        //remove item from available
        const itemIndex = room.state.itemStates.findIndex(i => i.id === id);
        room.state.itemStates.splice(itemIndex, 1);

        //you can only hold a single shield at once, so drop the other when picking one up.
        if(item.itemType == GameTextures.BlueShield) {

            //drop the shield in the other hand when picking up a new shield
            if(slot == 1 && player.weaponSlot2 == GameTextures.BlueShield) {

                player.weaponSlot2 = undefined;
                const drop = drop_cords[getRandomNumber(0, 5)];
                this.room.dispatcher.dispatch(new SpawnItemCommand().setPayload({
                    x: player.x,
                    y: player.y,
                    item: GameTextures.BlueShield,
                    dx: drop.dx,
                    dy: drop.dy
                }));
            }

            //drop the shield in the other hand when picking up a new shield
            if(slot == 2 && player.weaponSlot1 == GameTextures.BlueShield) {

                player.weaponSlot1 = undefined;
                const drop = drop_cords[getRandomNumber(0, 5)];
                this.room.dispatcher.dispatch(new SpawnItemCommand().setPayload({
                    x: player.x,
                    y: player.y,
                    item: GameTextures.BlueShield,
                    dx: drop.dx,
                    dy: drop.dy
                }));
            }
        }
        
        //if the player dropped something will picking up something else, respawn it.
        if(dropped) {

            const drop = drop_cords[getRandomNumber(0, 5)];

            return [new SpawnItemCommand().setPayload({
                x: player.x,
                y: player.y,
                item: dropped,
                dx: drop.dx,
                dy: drop.dy
            })]
        }
    }
}