import { GameTextures, WeaponType } from "@natewilcox/zelda-battle-shared";
import Character from "../characters/Character";
import GameScene from "../scenes/GameScene";
import { Bow, Bow3Arrow, Bow5Arrow, MagicBow, MagicBow3Arrow, MagicBow5Arrow } from "../weapons/Bow";
import { Cape } from "../weapons/Cape";
import { Hammer } from "../weapons/Hammer";
import { BluePotion, GreenPotion, RedPotion } from "../weapons/Potion";
import { FireRod, IceRod, LightRod } from "../weapons/Rod";
import { BlueShield } from "../weapons/Shield";
import { BlueStaff, Staff, YellowStaff } from "../weapons/Staff";
import { Sword1, Sword2, Sword3, Sword4 } from "../weapons/Sword";

const checkUserAgent = (name) => {
	if (navigator.userAgent.indexOf(name) != -1)
	{
		return true;
	}
	else
	{
		return false;
	}
}

export enum Devices {
    Andoid,
    IPhone,
    Mac,
    Windows,
    Unknown
}

export const getDeviceName = () => {

	let device = Devices.Unknown;
	
	if (checkUserAgent('Android'))
	{
		device	= Devices.Andoid;
	}
	else if (checkUserAgent('iPhone'))
	{
		device	= Devices.IPhone;
	}
	else if (checkUserAgent('Mac OS') || checkUserAgent('Macintosh'))
	{
		device = Devices.Mac;
	}
	else if (checkUserAgent('Windows'))
	{
		device = Devices.Windows;
	}

	return device;
}

export const debugDraw = (layer: Phaser.Tilemaps.TilemapLayer, scene: Phaser.Scene) => {

    const debugGraphics = scene.add.graphics().setAlpha(0.7);
    layer.renderDebug(debugGraphics, {
        tileColor: null,
        collidingTileColor: new Phaser.Display.Color(243, 243, 48, 255),
        faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    });
};


/**
 * Generates a weapon object based on texture
 * 
 * @param textId 
 * @returns IWeapon | null
 */
export const weaponFactory = (textId: GameTextures, holder: Character, scene: GameScene) => {

	switch(textId) {

		case GameTextures.Sword1:
			return new Sword1(holder, scene);

		case GameTextures.Sword2:
			return new Sword2(holder, scene);

		case GameTextures.Sword3:
			return new Sword3(holder, scene);

		case GameTextures.Sword4:
			return new Sword4(holder, scene);

		case GameTextures.Staff:
			return new Staff(holder, scene);

		case GameTextures.BlueStaff:
			return new BlueStaff(holder, scene);
				
		case GameTextures.YellowStaff:
			return new YellowStaff(holder, scene);

		case GameTextures.FireRod:
			return new FireRod(holder, scene);

		case GameTextures.IceRod:
			return new IceRod(holder, scene);

		case GameTextures.LightRod:
			return new LightRod(holder, scene);

		case GameTextures.Hammer:
			return new Hammer(holder, scene);

		case GameTextures.Bow:
			return new Bow(holder, scene);

		case GameTextures.Bow3Arrow:
			return new Bow3Arrow(holder, scene);

		case GameTextures.Bow5Arrow:
			return new Bow5Arrow(holder, scene);

		case GameTextures.MagicBow:
			return new MagicBow(holder, scene);

		case GameTextures.MagicBow3Arrow:
			return new MagicBow3Arrow(holder, scene);

		case GameTextures.MagicBow5Arrow:
			return new MagicBow5Arrow(holder, scene);
		
		case GameTextures.Cape:
			return new Cape(holder, scene);

		case GameTextures.GreenPotion:
			return new GreenPotion(holder, scene);

		case GameTextures.RedPotion:
			return new RedPotion(holder, scene);
		
		case GameTextures.BluePotion:
			return new BluePotion(holder, scene);

		case GameTextures.BlueShield:
			return new BlueShield(holder, scene);
	}

	return null;
}


/**
 * Gets the weapon type
 * 
 * @param textId 
 * @returns 
 */
export const getWeaponType = (textId: GameTextures) => {

	switch(textId) {

		case GameTextures.Sword1:
		case GameTextures.Sword2:
		case GameTextures.Sword3:
		case GameTextures.Sword4:
			return WeaponType.Sword;

		case GameTextures.Staff:
		case GameTextures.BlueStaff:
		case GameTextures.YellowStaff:
			return WeaponType.Staff

		case GameTextures.FireRod:
		case GameTextures.IceRod:
		case GameTextures.LightRod:
		case GameTextures.Hammer:
			return WeaponType.Hammer

		case GameTextures.Bow:
		case GameTextures.Bow3Arrow:
		case GameTextures.Bow5Arrow:
		case GameTextures.MagicBow:
		case GameTextures.MagicBow3Arrow:
		case GameTextures.MagicBow5Arrow:
			return WeaponType.Bow
		
		case GameTextures.Cape:
		case GameTextures.GreenPotion:
		case GameTextures.RedPotion:
		case GameTextures.BluePotion:
			return WeaponType.None

		case GameTextures.GreenRupee:
		case GameTextures.BlueRupee:
		case GameTextures.RedRupee:
		case GameTextures.FiftyRupees:
		case GameTextures.SmallHeart:
		case GameTextures.FullHeart:
		case GameTextures.OneBomb:
		case GameTextures.FiveBombs:
		case GameTextures.EightBombs:
		case GameTextures.TenBombs:
		case GameTextures.OneArrow:
		case GameTextures.TenArrows:
		case GameTextures.MagicBottle:
		case GameTextures.MagicJar:
		case GameTextures.SmallKey:
			return WeaponType.Item;

		case GameTextures.BlueShield:
			return WeaponType.Shield;
	}

	return null;
}

/**
 * Calculates weapon type based on provided texture.
 * 
 * @param textId 
 * @returns 
 */
export const getWeaponTypeByTextid = (textId: GameTextures) => {

	switch(textId) {
		case GameTextures.Sword1:
			return WeaponType.Sword;

		case GameTextures.FireRod:
		case GameTextures.IceRod:
		case GameTextures.LightRod:
		case GameTextures.Hammer:
			return WeaponType.Hammer;

		case GameTextures.Staff:
		case GameTextures.BlueStaff:
		case GameTextures.YellowStaff:
			return WeaponType.Staff

		case GameTextures.Bow:
		case GameTextures.Bow3Arrow:
		case GameTextures.Bow5Arrow:
		case GameTextures.MagicBow:
		case GameTextures.MagicBow3Arrow:
		case GameTextures.MagicBow5Arrow:
			return WeaponType.Bow;

		case GameTextures.BlueShield:
			return WeaponType.Shield;

		default:
			return WeaponType.Sword;
	}
}


/**
 * Generates a name based on texture
 * 
 * @param textId 
 * @returns IWeapon | null
 */
 export const getCollectibleName = (textId: GameTextures) => {

	switch(textId) {

		case GameTextures.Sword1:
			return 'Basic Sword';

		case GameTextures.Sword2:
			return 'Ice Blade';

		case GameTextures.Sword3:
			return 'Fire Blade';

		case GameTextures.Sword4:
			return 'Power Blade';

		case GameTextures.Staff:
			return 'Red Staff';

		case GameTextures.BlueStaff:
			return 'Blue Staff';

		case GameTextures.YellowStaff:
			return 'Yellow Staff';

		case GameTextures.FireRod:
			return 'Fire Rod';

		case GameTextures.IceRod:
			return 'Ice Rod';

		case GameTextures.LightRod:
			return 'Light Rod';

		case GameTextures.Hammer:
			return 'Hammer';

		case GameTextures.Bow:
			return 'Bow';

		case GameTextures.Bow3Arrow:
			return 'Bow x 3';

		case GameTextures.Bow5Arrow:
			return 'Bow x 5';

		case GameTextures.MagicBow:
			return 'MagicBow';

		case GameTextures.MagicBow3Arrow:
			return 'MagicBow x 3';

		case GameTextures.MagicBow5Arrow:
			return 'MagicBow x 5';
		
		case GameTextures.Cape:
			return 'Cape';

		case GameTextures.GreenPotion:
			return 'Green Potion';

		case GameTextures.RedPotion:
			return 'Red Potion';
		
		case GameTextures.BluePotion:
			return 'Blue Potion';

		case GameTextures.BlueShield:
			return 'Blue Shield';
	}

	return 'Item';
}

export const openForm = (scene: Phaser.Scene, form, cb: () => void) => {

	form.setVisible(false);
    form.setScale(.02, .02);

	scene.tweens.add({
		targets: form,
		props: {
			scaleX: 1
		},
		duration: 100,
		onStart: () => {
			form.setVisible(true);
		},
		onComplete: () => {

			scene.tweens.add({
				targets: form,
				props: {
					scaleY: 1
				},
				duration: 100,
				onComplete: () => {
					cb();
				}
			})
		}
	});
};

export const closeForm = (scene: Phaser.Scene, form, cb: () => void) => {

	scene.tweens.add({
		targets: form,
		props: {
			scaleY: .02
		},
		duration: 100,
		onStart: () => {
			form.setVisible(true);
		},
		onComplete: () => {

			scene.tweens.add({
				targets: form,
				props: {
					scaleX: 0
				},
				duration: 100,  
				completeDelay: 500,
				onComplete: () => {
					cb();
				}
			})
		}
	});
}

export const getHint = () => {

	return 'Quicking finding a weapon and magic is the \r\nkey to victory';
	
}

export const updateHouseRoof = (scene: Phaser.Scene, tile: Phaser.Tilemaps.Tile, layer: Phaser.Tilemaps.TilemapLayer, hide: boolean) => {

	scene.time.delayedCall(10, () => {

		if(tile && tile.properties.hideable == true && hide == tile.properties.visible) {

			tile.setAlpha(hide ? 0 : 1);
			tile.properties.visible = hide ? false : true;

			updateHouseRoof(scene, layer.getTileAt(tile.x-1, tile.y-1), layer, hide);
			updateHouseRoof(scene, layer.getTileAt(tile.x, tile.y-1), layer, hide);
			updateHouseRoof(scene, layer.getTileAt(tile.x+1, tile.y-1), layer, hide);

			updateHouseRoof(scene, layer.getTileAt(tile.x-1, tile.y), layer, hide);
			updateHouseRoof(scene, layer.getTileAt(tile.x+1, tile.y), layer, hide);

			updateHouseRoof(scene, layer.getTileAt(tile.x-1, tile.y+1), layer, hide);
			updateHouseRoof(scene, layer.getTileAt(tile.x, tile.y+1), layer, hide);
			updateHouseRoof(scene, layer.getTileAt(tile.x+1, tile.y+1), layer, hide);
		}
	});
}

export const talkingDialog = (scene: Phaser.Scene, dialogWindow, dialog, msg: string, cb: () => void) => {

	dialogWindow.setDepth(200);
	dialog.setDepth(200);

	const print = (printed, msg, i) => {

		dialog.setText(printed);
		let printedAlready = printed + msg.substring(i, i+1);

		//insert newline when window gets too big
		if(dialog.width > 150) {
			printedAlready = printedAlready.replace(/ ([^ ]*)$/, '\r\n$1');
		}

		//recenter dialog window around dialog text.
		dialogWindow.width = dialog.width+3;
		dialogWindow.height = dialog.height+3;
		dialogWindow.setOrigin(0.5, 1);

		//keep printing until complete message is visible
		if(i < msg.length) {
			scene.time.delayedCall(50, () => print(printedAlready, msg, i+1));
		}
		else {
			//destroy after 3 seconds
			scene.time.delayedCall(3000, () => {

				cb();
			})
		}
	};

	print('', msg, 0);	
}

const gameMaps = ['overworld1', 'overworld2', 'testing', 'dungeon1'];
const thumbNails = [
	'./gamemodeThumbnails/battleroyale.png', 
	'./gamemodeThumbnails/battleroyaleTEST.png', 
	'./gamemodeThumbnails/testing.png', 
	'./gamemodeThumbnails/dungeon1.png'
];
const defaultThumbname = './gamemodeThumbnails/comingsoon.png';

export const getModeThumbnail = (gameId: number) => {
	return (gameId-1) < thumbNails.length ? thumbNails[gameId-1] : defaultThumbname;	
}

export const getMapByGameId  = (gameId: number) => {
	return (gameId-1) < gameMaps.length ? gameMaps[gameId-1] : null;	
}

export const getLockedDoorRootTile = (tile: Phaser.Tilemaps.Tile, layer: Phaser.Tilemaps.TilemapLayer) => {

	if(tile.properties.dir == 'left' || tile.properties.dir == 'right') {
		if(tile.properties.idx == 2) return layer.getTileAt(tile.x, tile.y+1);
		else if(tile.properties.idx == 3) return layer.getTileAt(tile.x, tile.y+2);
		else if(tile.properties.idx == 4) return layer.getTileAt(tile.x, tile.y+3);
		else return layer.getTileAt(tile.x, tile.y);
	}
	else if(tile.properties.dir == 'up' || tile.properties.dir == 'down') {
		if(tile.properties.idx == 2) return layer.getTileAt(tile.x-1, tile.y);
		else if(tile.properties.idx == 3) return layer.getTileAt(tile.x-2, tile.y);
		else if(tile.properties.idx == 4) return layer.getTileAt(tile.x-3, tile.y);
		else return layer.getTileAt(tile.x, tile.y);
	}
}

export const animateTileObject = (rootTile: Phaser.Tilemaps.Tile, layer: Phaser.Tilemaps.TilemapLayer, rate: number) => {

	//create list of tiles
	const tiles = collectObjectTiles(rootTile, layer);

	tiles.forEach(tile => {

		const anim = tile.properties.anim.split(",").map(str => +str);
		const props = tile.tileset!.getTileProperties(anim[0]+1) as any;

		const changedTile = layer.putTileAt(anim[0]+1, tile.x, tile.y, true);
		changedTile.properties.type = null;

		if(props?.collides) {
			changedTile.setCollision(true, true, true, true, true);
		}
	});

	setTimeout(() => {
		tiles.forEach(tile => {

			const anim = tile.properties.anim.split(",").map(str => +str);
			const props = tile.tileset!.getTileProperties(anim[1]+1) as any;
			const changedTile = layer.putTileAt(anim[1]+1, tile.x, tile.y, true);

			if(props?.collides) {
				changedTile.setCollision(true, true, true, true, true);
			}
		});
	}, 100)
}

export const collectObjectTiles = (rootTile: Phaser.Tilemaps.Tile, layer: Phaser.Tilemaps.TilemapLayer) => {

	const tiles: Phaser.Tilemaps.Tile[] = [];

	if(rootTile.properties.dir == 'left') {
		tiles.push(layer.getTileAt(rootTile.x, rootTile.y));
		tiles.push(layer.getTileAt(rootTile.x, rootTile.y-1));
		tiles.push(layer.getTileAt(rootTile.x, rootTile.y-2));
		tiles.push(layer.getTileAt(rootTile.x, rootTile.y-3));
		tiles.push(layer.getTileAt(rootTile.x-1, rootTile.y));
		tiles.push(layer.getTileAt(rootTile.x-1, rootTile.y-1));
		tiles.push(layer.getTileAt(rootTile.x-1, rootTile.y-2));
		tiles.push(layer.getTileAt(rootTile.x-1, rootTile.y-3));
	}
	else if(rootTile.properties.dir == 'right') {
		tiles.push(layer.getTileAt(rootTile.x, rootTile.y));
		tiles.push(layer.getTileAt(rootTile.x, rootTile.y-1));
		tiles.push(layer.getTileAt(rootTile.x, rootTile.y-2));
		tiles.push(layer.getTileAt(rootTile.x, rootTile.y-3));
		tiles.push(layer.getTileAt(rootTile.x+1, rootTile.y));
		tiles.push(layer.getTileAt(rootTile.x+1, rootTile.y-1));
		tiles.push(layer.getTileAt(rootTile.x+1, rootTile.y-2));
		tiles.push(layer.getTileAt(rootTile.x+1, rootTile.y-3));
	}
	else if(rootTile.properties.dir == 'up') {
		tiles.push(layer.getTileAt(rootTile.x, rootTile.y));
		tiles.push(layer.getTileAt(rootTile.x+1, rootTile.y));
		tiles.push(layer.getTileAt(rootTile.x+2, rootTile.y));
		tiles.push(layer.getTileAt(rootTile.x+3, rootTile.y));
		tiles.push(layer.getTileAt(rootTile.x, rootTile.y-1));
		tiles.push(layer.getTileAt(rootTile.x+1, rootTile.y-1));
		tiles.push(layer.getTileAt(rootTile.x+2, rootTile.y-1));
		tiles.push(layer.getTileAt(rootTile.x+3, rootTile.y-1));
	}
	else if(rootTile.properties.dir == 'down') {
		tiles.push(layer.getTileAt(rootTile.x, rootTile.y));
		tiles.push(layer.getTileAt(rootTile.x+1, rootTile.y));
		tiles.push(layer.getTileAt(rootTile.x+2, rootTile.y));
		tiles.push(layer.getTileAt(rootTile.x+3, rootTile.y));
		tiles.push(layer.getTileAt(rootTile.x, rootTile.y+1));
		tiles.push(layer.getTileAt(rootTile.x+1, rootTile.y+1));
		tiles.push(layer.getTileAt(rootTile.x+2, rootTile.y+1));
		tiles.push(layer.getTileAt(rootTile.x+3, rootTile.y+1));
	}

	return tiles;
}

export function debounce(func, delay) {
	let timeout;
	return (...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), delay);
	};
}