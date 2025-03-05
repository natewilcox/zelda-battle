import { Command } from "@colyseus/command";
import { IPlayerState } from "@natewilcox/zelda-battle-shared";
import { GameTextures } from "@natewilcox/zelda-battle-shared";
import { getUpdatedMetrix } from "@natewilcox/zelda-battle-shared";
import { BattleRoyaleRoom } from "../rooms/BattleRoyaleRoom";

/**
 * Payload type definition
 */
type Payload = {
    client,
    slot: number,
    texture: GameTextures
};


/**
 * Command to use a potion
 */
export class UsePotionCommand extends Command<BattleRoyaleRoom, Payload> {

    private MAGIC_FILL = 1;
    private HEALTH_FILL = 1;

    /**
     * Executes command
     * 
     * @param param0 
     */
    execute({ client, slot, texture }) {

        const player = this.room.state.playerStates.find(p => p.clientId == client.id);
        if(player == null) return;

        //verify the player has the item
        if(slot == 1 && player.weaponSlot1 != texture) return;
        if(slot == 2 && player.weaponSlot2 != texture) return;

        if(slot == 1) player.weaponSlot1 = undefined;
        if(slot == 2) player.weaponSlot2 = undefined;

        //apply potion affect
        if(texture == GameTextures.GreenPotion) {
            this.fillMagic(player, 120);
        }
        else if(texture == GameTextures.RedPotion) {
            this.fillHealth(player, 120);
        }
        else if(texture == GameTextures.BluePotion) {
            this.fillHealth(player, 120);
            this.fillMagic(player, 120);
        }
    }

    private fillMagic = (player: IPlayerState, left: number) => {

        //stop effect wears off or player dies
        if(left <= 0 || player.health <= 0) return;

        //fill magic and call again in 500ms
        player.magic = getUpdatedMetrix(player.magic, this.MAGIC_FILL, player.maxMagic);

        //console.log('magic='+player.magic)
        this.room.clock.setTimeout(() => this.fillMagic(player, left-1), 500); 
    }

    private fillHealth = (player: IPlayerState, left: number) => {

         //stop effect wears off or player dies
        if(left <= 0 || player.health <= 0) return;

        //fill magic and call again in 500ms
        player.health = getUpdatedMetrix(player.health, this.HEALTH_FILL, player.maxHealth);

        //console.log('health='+player.health)
        this.room.clock.setTimeout(() => this.fillHealth(player, left-1), 500); 
    }
}