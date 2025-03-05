import { Command } from "@colyseus/command";
import { Client, Room } from "colyseus";
import { PlayerState } from "../rooms/schema/PlayerState";
import { ServerMessages } from "@natewilcox/zelda-battle-shared";
import { SpawnItemCommand } from "./SpawnItemCommand";
import { getRandomNumber } from "@natewilcox/zelda-battle-shared";
import { GameTextures } from "@natewilcox/zelda-battle-shared";
import { BattleRoyaleRoom } from "../rooms/BattleRoyaleRoom";

/**
 * Payload type definition
 */
type Payload = {
    client: Client,
    slot: number,
    bagPosition: number
}

const drop_cords = [
    {dx: -15, dy: 0},
    {dx: -10, dy: 10},
    {dx: 0, dy: 15},
    {dx: 10, dy: 10},
    {dx: 15, dy: 0},
]

/**
 * Server Command to switch weapons
 */
export class SwitchWeaponCommand extends Command<BattleRoyaleRoom, Payload> {


    /**
     * Executes the command.
     * 
     * @param param0 
     * @returns 
     */
    execute({ client, slot, bagPosition }: Payload) {

        const room = this.room;

        //get player reference
        const player = room.state.playerStates.find(p => p.clientId == client.id) as PlayerState;

        //return if item|player is not available
        if(player == null) return;

        const currentHeldWeapon = slot == 1 ? player.weaponSlot1 : player.weaponSlot2;
        const baggedItem = bagPosition <= player.bag.length ? player.bag[bagPosition-1] : undefined;
        
        //put the current item in the bag

        //swap the weapon slot with the bagged item
        if(slot == 1) {
            player.weaponSlot1 = baggedItem!;

            //cannot hold shield in 2 hands
            if(player.weaponSlot1 == GameTextures.BlueShield && player.weaponSlot2 == GameTextures.BlueShield) {

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
        }
        
        if(slot == 2) {
            player.weaponSlot2 = baggedItem!;

            //cannot hold shield in 2 hands
            if(player.weaponSlot1 == GameTextures.BlueShield && player.weaponSlot2 == GameTextures.BlueShield) {

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

        player.bag[bagPosition-1] = currentHeldWeapon!;

        //update the client with the contents of the bag
        client.send(ServerMessages.BagContentsChanged, player.bag);
    }
}