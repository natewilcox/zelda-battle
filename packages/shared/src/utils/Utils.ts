import { IPlayerState } from "../types/IPlayerState";
import { GameTextures, MapTextures } from "../types/Animations";
import generateUniqueId  from 'generate-unique-id';
//import { SwitchState } from "../rooms/schema/SwitchState";
import { IBattleRoyaleRoomState } from "../types/IBattleRoyaleRoomState";

/**
 * Calculates if weapon can break tile.
 * 
 * @param weaponTexture 
 * @param mapTexture 
 * @returns 
 */
 export const canWeaponBreakTile = (weaponTexture: GameTextures, mapTexture: MapTextures) => {


	switch(mapTexture) {
		case MapTextures.Bush:
		case MapTextures.BrownBush:
			return isSharp(weaponTexture);
		case MapTextures.Grass:
			return isSharp(weaponTexture);

		case MapTextures.Rock:
		case MapTextures.Stake:
			return canCrush(weaponTexture)


		default:
			return false;
	}
};

const isSharp = (weaponTexture: GameTextures) => {
	return weaponTexture === GameTextures.Sword1 ||
		weaponTexture === GameTextures.Sword2 ||
		weaponTexture === GameTextures.Sword3 ||
		weaponTexture === GameTextures.Sword4;
};

const canCrush = (weaponTexture: GameTextures) => {
	return weaponTexture === GameTextures.Hammer;
};


export const adjustMagicByItem = (magic: number, textId: GameTextures) => {

	switch(textId) {
		case GameTextures.MagicBow:
			magic -= 5;
			break;
		case GameTextures.MagicBow3Arrow:
			magic -= 10;
			break;
		case GameTextures.MagicBow5Arrow:
			magic -= 20;
			break;
			
	}

	if(magic < 0) {
		magic = 0;
	}

	return magic;
}

export const getDamageDeltByWeapon = (textId: GameTextures) => {

	let damage = 0;

	switch(textId) {

		case GameTextures.Arrow:
			damage = 5;
			break;

		case GameTextures.MagicArrow:
			damage = 10;
			break;

		case GameTextures.Sword1:
			damage = 2;
			break;
		
		case GameTextures.Sword2:
			damage = 4;
			break;
		
		case GameTextures.Sword3:
			damage = 8;
			break;
		
		case GameTextures.Sword4:
			damage = 16;
			break;
				
		case GameTextures.Staff:
			damage = 1;
			break;

		case GameTextures.Hammer:
			damage = 2;
			break;

		case GameTextures.Bomb:
			damage = 5;
			break;

		case GameTextures.Storm:
			damage = 1;
			break;

		case GameTextures.Lightening:
			damage = 4;
			break;
		
		case GameTextures.Fireball:
			damage = 1;
			break;
		case GameTextures.IceBlast:
			damage = 2;
			break;

		case GameTextures.LargeLightBall:
			damage = 6;
			break;
	}
	
	return damage;
};

export const adjustBulletByItem = (bullets: number, textId: GameTextures) => {

	let newCount = bullets;

	switch(textId) {
		case GameTextures.FireRod:
		case GameTextures.Bow:
		case GameTextures.MagicBow:
		case GameTextures.LightRod:
		case GameTextures.FireRod:
		case GameTextures.IceRod:
			newCount++;
			break;

		case GameTextures.Bow3Arrow:
		case GameTextures.MagicBow3Arrow:
			newCount += 3;
			break;

		case GameTextures.Bow5Arrow:
		case GameTextures.MagicBow5Arrow:
			newCount += 5;
			break;
			
	}

	return newCount;
}


/**
 * Accepts cur value with diff, and makes sure the new value is between 0 and max.
 * 
 * @param cur 
 * @param diff 
 * @param max 
 * @returns 
 */
export const getUpdatedMetrix = (cur, diff, max) => {

	let newVal = cur + diff;
	
	//make sure player health is not past max
	if(newVal > max) {
		newVal -= (newVal - max);
	}

	return newVal < 0 ? 0 : newVal;
}


export const getKillFeedMessage = (victim: string, textureId: GameTextures, attacker?: string) => {

	let message = `Player ${victim} has sadly passed away`;
	switch(textureId) {

		case GameTextures.Arrow:
			message = `${attacker} eliminated ${victim} with an arrow`;
			break;

		case GameTextures.MagicArrow:
			message = `${attacker} eliminated ${victim} with a magic arrow`;
			break;

		case GameTextures.Sword1:
		case GameTextures.Sword2:
		case GameTextures.Sword3:
		case GameTextures.Sword4:
			message = `${attacker} sliced and diced ${victim}`;
			break;

		case GameTextures.Staff:
			message = `${attacker} eliminated ${victim} with a regular ole beating`;
			break;

		case GameTextures.Hammer:
			message = `${attacker} eliminated ${victim} with a hammer`;
			break;
	
		case GameTextures.Bomb:
			message = `${attacker} eliminated ${victim} with a bang`;
			break;

		case GameTextures.Storm:
			message = `${victim} was lost in the storm`;
			break;

		case GameTextures.Lightening:
			message = `${attacker} shocked ${victim} to death`;
			break;

		case GameTextures.Fireball:
			message = `${attacker} turned up the heat on ${victim}`;
			break;

		case GameTextures.IceBlast:
			message = `${attacker} chilled out ${victim}`;
			break;

		case GameTextures.LargeLightBall:
			message = `${attacker} eliminated ${victim} with grace`;
			break;

    }

	return message;
}

export const getDistanceBetween = (x1, y1, x2, y2) => {
	
    let y = x2 - x1;
    let x = y2 - y1;
    
    return Math.sqrt(x * x + y * y);
}

export const applyContentsToPlayer = (player: IPlayerState, contents: GameTextures, slot?: number) => {

	switch(contents) {

		case GameTextures.Sword1:
		case GameTextures.Sword2:
		case GameTextures.Sword3:
		case GameTextures.Sword4:
		case GameTextures.Hammer:
		case GameTextures.Staff:
		case GameTextures.BlueStaff:
		case GameTextures.YellowStaff:
		case GameTextures.FireRod:
		case GameTextures.IceRod:
		case GameTextures.LightRod:
		case GameTextures.Cape:
		case GameTextures.Bow:
		case GameTextures.Bow3Arrow:
		case GameTextures.Bow5Arrow:
		case GameTextures.MagicBow:
		case GameTextures.MagicBow3Arrow:
		case GameTextures.MagicBow5Arrow:
		case GameTextures.GreenPotion:
		case GameTextures.RedPotion:
		case GameTextures.BluePotion:
		case GameTextures.BlueShield:

			if(slot) {

				if(slot == 1) {
					const curWeapon = player.weaponSlot1;
					player.weaponSlot1 = contents;
					return curWeapon;
				}
				else if(slot == 2) {
					const curWeapon = player.weaponSlot2;
					player.weaponSlot2 = contents;
					return curWeapon;
				}
			}
			else {
				if(!player.weaponSlot1) {
					player.weaponSlot1 = contents
				}
				else {
					player.weaponSlot2 = contents
				}
			}
		
			break;
			
		case GameTextures.GreenRupee:
			player.rupees = getUpdatedMetrix(player.rupees, 1, player.maxRupees);
			break;

		case GameTextures.BlueRupee:
			player.rupees = getUpdatedMetrix(player.rupees, 10, player.maxRupees);
			break;

		case GameTextures.RedRupee:
			player.rupees = getUpdatedMetrix(player.rupees, 20, player.maxRupees);
			break;

		case GameTextures.FiftyRupees:
			player.rupees = getUpdatedMetrix(player.rupees, 50, player.maxRupees);
			break;

		case GameTextures.SmallHeart:
			player.health = getUpdatedMetrix(player.health, 2, player.maxHealth);
			break;

		case GameTextures.FullHeart:
			player.maxHealth = getUpdatedMetrix(player.maxHealth, 2, 20);
			break;

		case GameTextures.OneBomb:
			player.bombs = getUpdatedMetrix(player.bombs, 1, player.maxBombs);
			break;

		case GameTextures.FiveBombs:
			player.bombs = getUpdatedMetrix(player.bombs, 5, player.maxBombs);
			break;

		case GameTextures.EightBombs:
			player.bombs = getUpdatedMetrix(player.bombs, 8, player.maxBombs);
			break;

		case GameTextures.TenBombs:
			player.bombs = getUpdatedMetrix(player.bombs, 10, player.maxBombs);
			break;

		case GameTextures.OneArrow:
			player.arrows = getUpdatedMetrix(player.arrows, 1, player.maxArrows);
			break;

		case GameTextures.TenArrows:
			player.arrows = getUpdatedMetrix(player.arrows, 10, player.maxArrows);
			break;

		case GameTextures.MagicBottle:
			player.magic = getUpdatedMetrix(player.magic, 10, player.maxMagic);
			break;

		case GameTextures.MagicJar:
			player.magic = getUpdatedMetrix(player.magic, 25, player.maxMagic);
			break;	

		case GameTextures.SmallKey:
			player.keys = getUpdatedMetrix(player.keys, 1, player.maxKeys);
			break;	
	}
}


export const calculatePoints = (player: IPlayerState) => {
	const points = (player.eliminations*100) + (player.damageGiven*2) + (player.magicUsed);
	return points;
}

export const calculateCollisionDamage = (texture: GameTextures) => {

	if(texture == GameTextures.Bat || texture == GameTextures.Rat || texture == GameTextures.Snake) {
		return 2;
	}

	if(texture == GameTextures.Skeleton) {
		return 5;
	}

	return 0;
}