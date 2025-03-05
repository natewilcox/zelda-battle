import Phaser from 'phaser'


/**
 * Preloader scene for all general game assets to be loaded prior starting the game.
 */
export default class Preloader extends Phaser.Scene {


    /**
     * Creates a preloader scene
     */
	constructor() {
        super('preloader');
    }


    /**
     * Load all game assets needed to run game.
     */
    preload() {

        //loading screen files
        this.load.image("loading-background", "images/loading-background.png");

        //map files
        //extruder command
        //tile-extruder -w 8 -h 8 -m 0 -s 1 -i ./public/images/ground.png -o ./public/images/ground-extruded.png
        //tile-extruder -w 8 -h 8 -m 0 -s 1 -i ./public/images/dungeon.png -o ./public/images/dungeon-extruded.png
        this.load.image("ground", "images/ground-extruded.png");
        this.load.image("trees", "images/trees1-extruded.png");
        this.load.image("houses", "images/houses-extruded.png");
        this.load.image("cliffs", "images/cliffs-extruded.png");
        this.load.image("dungeon", "images/dungeon-extruded.png");

        //link files
        this.load.image('link-sheet', 'characters/link.png');
        this.load.image('link-green-palette', 'images/link-green-palette.png');
        this.load.image('link-blue-palette', 'images/link-blue-palette.png');
        this.load.image('link-red-palette', 'images/link-red-palette.png');
        this.load.json('link-json', 'characters/link.json');

        //map objects
        this.load.atlas("agahnim", "characters/agahnim.png", "characters/agahnim.json");
        this.load.atlas("npcs", "characters/npcs.png", "characters/npcs.json");
        this.load.atlas("enemies", "characters/enemies.png", "characters/enemies.json");
        this.load.atlas("mapObjects", "mapObjects/mapObjects.png", "mapObjects/mapObjects.json");

        //weapon files
        this.load.atlas("weapons", "weapons/weapons.png", "weapons/weapons.json");
        this.load.atlas("bullets", "weapons/bullets.png", "weapons/bullets.json");
        this.load.image('placed-bomb', 'images/placed_bomb.png');
        this.load.atlas('bombs', 'bombs/bombs.png', 'bombs/bombs.json');

        //effects
        this.load.atlas("loading", "animations/loading.png", "animations/loading.json");
        this.load.atlas("effects", "animations/Effects.png", "animations/Effects.json");
        this.load.image("sparkle", "particle/spark.png");
        this.load.image("flash", "particle/flash.png");
        this.load.image("smoke", "particle/smoke.png");
        this.load.image("snow", "particle/snow.png");

        //hud files
        this.load.image("clock-icon", "images/clock.png");
        this.load.image("rupee-icon", "images/rupee-icon.png");
        this.load.image("bomb-icon", "images/bomb-icon.png");
        this.load.image("arrow-icon", "images/arrow-icon.png");
        this.load.image("key-icon", "images/key-icon.png");
        this.load.image("full-screen", "images/full-screen.png");
        this.load.image("menu", "images/menu.png");
        this.load.image("chest-opened", "images/chest-opened.png");
        this.load.image("chest-closed", "images/chest-closed.png");
        this.load.image("item-slot", "images/item-slot.png");
        this.load.image("item-slot-active", "images/item-slot-active.png");
        this.load.image("magic-meter", "images/magic-meter.png");
        this.load.image("magic-1", "images/magic-1.png");
        this.load.image("magic-2", "images/magic-2.png");
        this.load.image("heart-empty", "images/heart-empty.png");
        this.load.image("heart-half", "images/heart-half.png");
        this.load.image("heart-full", "images/heart-full.png");
        this.load.image("0", "images/zero.png");
        this.load.image("1", "images/one.png");
        this.load.image("2", "images/two.png");
        this.load.image("3", "images/three.png");
        this.load.image("4", "images/four.png");
        this.load.image("5", "images/five.png");
        this.load.image("6", "images/six.png");
        this.load.image("7", "images/seven.png");
        this.load.image("8", "images/eight.png");
        this.load.image("9", "images/nine.png");
        this.load.image(":", "images/colon.png");

        //font resouces
        this.load.bitmapFont('minecraft', 'font/minecraft.png', 'font/minecraft.xml');
        this.load.bitmapFont('minecraft_background', 'font/minecraft_background.png', 'font/minecraft_background.xml');

        //items
        this.load.atlas("items", "items/items.png", "items/items.json");
        this.load.image('magic-jar', 'images/magic-jar.png');
        this.load.image('magic-bottle', 'images/magic-bottle.png');
        this.load.image('heart', 'images/heart.png');
        this.load.image('bomb', 'images/bomb.png');
        this.load.image('bomb-four-pack', 'images/bomb-four-pack.png');
        this.load.image('bomb-eight-pack', 'images/bomb-eight-pack.png');
        this.load.image('bomb-ten-pack', 'images/bomb-ten-pack.png');
        this.load.image('arrow', 'images/arrow.png');
        this.load.image('arrow-five-pack', 'images/arrow-five-pack.png');
        this.load.image('arrow-ten-pack', 'images/arrow-ten-pack.png');

        //shadows
        this.load.image('shadow', 'images/shadow.png');
        this.load.image('small-shadow', 'images/small-shadow.png');
        this.load.image('smaller-shadow', 'images/smaller-shadow.png');
    }


    /**
     * Creates a preloader scene object.
     */
    create() {
        this.scene.start("bootstrap");
    }
}
