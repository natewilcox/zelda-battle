import { IGameSceneConfig } from './Config';
import { Chest } from '../items/Chest';
import { IChestState } from '@natewilcox/zelda-battle-shared';
import { SceneEvents } from '../events/SceneEvents';
import { Link } from '../characters/Link';
import ComponentService from '../services/ComponentService';
import ServerService, { ServerEvents } from '../services/ServerService';
import { addComponent, addEntity, createWorld, deleteWorld, IWorld, pipe, removeEntity, System } from 'bitecs';
import { StateMachine } from '@natewilcox/zelda-battle-shared';
import { LoadingState } from './LoadingScene';
import { createServerSystem } from '../systems/ServerSystem';
import { BadGuy, Dialog, NPC, Player, Server } from '../components/SpriteComponents';
import { IPlayerState } from '@natewilcox/zelda-battle-shared';
import { GameTextures, linkColorIndex, MapTextures, texturesIndex } from '@natewilcox/zelda-battle-shared';
import ListenForStateChangeComponent from '../components/ListenForStateChangeComponent';
import { debugDraw, Devices, getDeviceName, getLockedDoorRootTile, updateHouseRoof } from '../utils/Utils';
import KeyboardInputComponent from '../components/KeyboardInputComponent';
import TouchInputComponent from '../components/TouchInputComponent';
import OpenChestComponent from '../components/OpenChestComponent';
import PatchServerStateComponent from '../components/PatchServerStateComponent';
import CollectItemComponent from '../components/CollectItemComponent';
import { IItemState } from '@natewilcox/zelda-battle-shared';
import { ICollectible } from '@natewilcox/zelda-battle-shared';

import '../characters/Link';
import "regenerator-runtime/runtime.js";
import { IMutatedTile } from '@natewilcox/zelda-battle-shared';
import { LandType } from '@natewilcox/zelda-battle-shared';
import { Bullet } from '../weapons/Bullet';
import { RemoteBomb } from '../weapons/Bomb';
import { Collectible } from '../items/Collectible';
import { createNPCSystem } from '../systems/NPCSystem';
import { createDialogSystem, queueMessage } from '../systems/DialogSystem';
import { IBattleRoyaleRoomState } from '@natewilcox/zelda-battle-shared';
import { GameState } from '@natewilcox/zelda-battle-shared';
import { createEnemySystem } from '../systems/EnemySystem';
import { getStateCallbacks } from 'colyseus.js';


/**
 * GameScene class
 */
export default class GameScene extends Phaser.Scene {

    initialized = false;

    //game metrics
    gameModeId: number = -1;
    frameRate = 0;
    ping = 0;

    //player objects
    player!: Link | undefined;
    players!: Phaser.Physics.Arcade.Group;
    npcs!: Phaser.GameObjects.Group;
    enemies!: Phaser.Physics.Arcade.Group;

    map!: Phaser.Tilemaps.Tilemap;
    tilesetNames: string[] = [];

    zone!: Phaser.GameObjects.Graphics;
    zoneWidth = 100;
    zoneX = 100
    zoneY = 100;

    storm!: Phaser.GameObjects.Graphics;

    componentService!: ComponentService;
    serverService!: ServerService;

    private onGameError?: () => void;

    //references for players playing across network.
    private world?: IWorld | undefined;
    entityMap = new Map<number, number>();
    private remotePlayersMap = new Map<string, number>();

    //systems
    private updatePipeline: any;
    private postUpdatePipeline: any;

    private serverSystem?: System | undefined;
    private serverSystemConfig: any;

    private npcSystem?: System | undefined;
    private npcSystemConfig: any;

    private enemySystem?: System | undefined;
    private enemySystemConfig: any;

    private dialogSystem?: System | undefined;
    private dialogSystemConfig: any;

    animatedTiles: any;

    clientState: StateMachine = new StateMachine(this, 'game_fsm');

    //group factories
    chests!: Phaser.Physics.Arcade.StaticGroup;
    items!: Phaser.Physics.Arcade.StaticGroup;
    effects!: Phaser.Physics.Arcade.StaticGroup;
    bullets!: Phaser.Physics.Arcade.Group;
    remoteBullets!: Phaser.Physics.Arcade.Group;
    bombs!: Phaser.Physics.Arcade.StaticGroup;
    switches!: Phaser.Physics.Arcade.StaticGroup;

    //emitters
    sparkEmitter: any;
    sparkleEmitter: any;
    explosionEmitter: any;
    snowEmitter: any;


    /**
     * Creates the game
     */
	constructor() {
		super('game');

        
	}


    /**
     * Scene fading transision.
     * 
     * @param fadeIn 
     * @param duration 
     */
    private fadeScene(fadeIn: boolean, duration: number = 1000) {
        
        if(fadeIn) {
            this.cameras.main.fadeIn(duration, 0, 0, 0);
        }
        else {
            this.cameras.main.fadeOut(duration, 0, 0, 0);
        }
    }

    private printMetrics = () => {

        console.log("---------")
        console.log(`FPS: ${this.frameRate} frames/second`);
        console.log(`PING: ${this.ping} ms`);

        this.frameRate = 0;

        this.time.delayedCall(1000, this.printMetrics);
        this.time.delayedCall(500, this.testPing);
    }	

    private testPing = () => {

        const send = new Date();
        this.serverService.ping(() => {
            const response = new Date();

            this.ping = response.getTime() - send.getTime();
        });
    }
 

    /**
     * Add a bullet to the scene. Either local with collison or remote without collision
     * 
     * @param id 
     * @param textId 
     * @param x 
     * @param y 
     * @param isLocal 
     * @returns 
     */
    addBullet(id: number, textId: GameTextures, x: number, y: number, isLocal: boolean) {
        
        const bullet = (isLocal ? this.bullets.get(x, y) : this.remoteBullets.get(x, y)) as Bullet;
        bullet.id = id;
        bullet.textId = textId;

        return bullet;
    }


    addBomb(id: number, x: number, y: number) {

        const bomb = this.bombs.get(x, y, 'bombs') as RemoteBomb;
        bomb.play('bomb-ticking');

        bomb.id = id;
        return bomb;
    }


    /**
     * Play a sprite effect at a specific map location, and then destroy the sprite after animation is complete.
     * 
     * @param x 
     * @param y 
     * @param texture 
     * @param animation 
     */
    playEffect = (x: number, y: number, texture: string, animation: string) => {

        const effectSprite = this.effects.get(x, y, texture) as Phaser.GameObjects.Sprite;
        effectSprite.anims.play(animation, true);
        effectSprite.setDepth(100);

        effectSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + animation, () => {

            effectSprite.destroy();
            this.effects.killAndHide(effectSprite);
        });
    };


    playFlash = (x: number, y: number) => {
        this.sparkEmitter.setPosition(x, y);
        this.sparkEmitter.explode(10);
    }

    playSparkleFlash = (x: number, y: number) => {
        this.playEffect(x, y, 'effects', 'ice-explosion');
    }

    playFireFlash = (x: number, y: number) => {
        this.playEffect(x, y, 'effects', 'fire-explosion');
    }

    playMagicFlash = (x: number, y: number) => {
        this.sparkleEmitter.setPosition(x, y);
        this.sparkleEmitter.explode(10);
    }

    playExplosion = (x: number, y: number) => {
        this.explosionEmitter.setPosition(x, y);
        this.explosionEmitter.explode(10);
    }

    /**
     * Creates the map for the scene.
     * Creates tiledmap from json
     * Add chests that match server state
     * 
     * @param roomState 
     * @param debug 
     */
    protected createMap(player: Link, roomState: IBattleRoyaleRoomState, debug: boolean | undefined) {

        const mapName = roomState.mapName;

        //when you join a room, load the map
        this.map = this.make.tilemap({
            key: mapName,
            tileHeight: 8,
            tileWidth: 8
        });
      
        //create tilesets and add to layers
        const mapData = this.cache.tilemap.get(mapName).data;
        const mapProps = mapData.properties;
        const hasStorm = mapProps ? mapData.properties.find(prop => prop.name == 'hasStorm')?.value : false;
    
        const tilesets = mapData.tilesets;

        tilesets.forEach(tileset => {
            
            //only support tiles that are width=8
            if(tileset.tileheight == 8) {
                const tilesetObj = this.map.addTilesetImage(tileset.name, tileset.name, 8, 8, 1, 3);
                this.tilesetNames.push(tileset.name);
            }
        })
        
        //create layers in map
        const groundLayer = this.map.createLayer("Ground Layer", this.tilesetNames);
        groundLayer!.setDepth(1);
        groundLayer!.setCollisionByProperty({ 
            collides: true,
        });

        //create cover over top of the player
        const coverLayer = this.map.createLayer('Cover Layer', this.tilesetNames);
        coverLayer!.setDepth(100);

        //add interactions between map and player
        this.addMapInteraction(player, roomState);

        const $ = this.serverService.getChangeCallbacks();
        //create items based on room state
        roomState.itemStates.forEach(this.createItemHandler);
        $(roomState).itemStates.onAdd(this.createItemHandler);
        $(roomState).itemStates.onRemove(this.handleOnItemCollected);

        // when tiles are mutated
        $(roomState).mutatedTiles.onAdd(this.handleTileMutation);

        this.serverService.onTick((timer) => {
            SceneEvents.emit('ontick', timer)
        });

        this.serverService.onZoneChanged((zone) => {
            this.shrinkZone(zone.width, zone.x, zone.y, 1000);
        });

        // //init animated map and animations and set bounds
        this.animatedTiles.init(this.map);
        this.cameras.main.setBounds(0, 0, 440, 380);
        this.serverService.onCameraBoundsChanged((e) => {
            this.cameras.main.setBounds(e.x, e.y, e.w, e.h);
        });
        this.serverService.onFadeIn(() => this.fadeScene(true));
        this.serverService.onFadeOut(() => this.fadeScene(false));

        //if debug is enabled, draw collision
        if(debug) {
            debugDraw(groundLayer, this);
        }

        this.sparkEmitter = this.add.particles('flash').setDepth(40).createEmitter({
            x: 100,
            y: 100,
            speed: { min: -500, max: 500 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            blendMode: 'MULTI',
            active: true,
            lifespan: 100,
            frequency: -1
        });

        this.sparkleEmitter = this.add.particles('sparkle').setDepth(40).createEmitter({
            x: 100,
            y: 100,
            speed: 200,
            angle: { min: 0, max: 360 },
            scale: { start: 2, end: 0 },
            blendMode: 'ADD',
            active: true,
            lifespan: 200,
            frequency: -1
        });

        this.explosionEmitter = this.add.particles('smoke').setDepth(40).createEmitter({
            x: 100,
            y: 100,
            emitZone: {
                source: new Phaser.Geom.Circle(0, 0, 5),
                type: 'random',
                quantity: 10
            },
            speed: { min: 50, max: 500 },
            angle: { min: 0, max: 360 },
            scale: { start: 2, end: 0 },
            alpha: 0.5,
            blendMode: 'SCREEN',
            active: true,
            lifespan: 200,
            frequency: -1
        });

        if(hasStorm == true) {
            this.initStorm(player, roomState);
        }
    }

    private handleTileMutation = (tile: IMutatedTile) => {

     
        const ground = this.map.getLayer('Ground Layer')!.tilemapLayer;
        const oldTile = ground.getTileAt(tile.x, tile.y);
        const idx = oldTile.properties.idx;
        const indexes: number[][] = [];

        if(idx == 1) {
            indexes.push([tile.x, tile.y]);
            indexes.push([tile.x+1, tile.y]);
            indexes.push([tile.x, tile.y+1]);
            indexes.push([tile.x+1, tile.y+1]);
        }

        else if(idx == 2) {
            indexes.push([tile.x-1, tile.y]);
            indexes.push([tile.x, tile.y]);
            indexes.push([tile.x-1, tile.y+1]);
            indexes.push([tile.x, tile.y+1]);
        }

        else if(idx == 3) {
            indexes.push([tile.x, tile.y-1]);
            indexes.push([tile.x+1, tile.y-1]);
            indexes.push([tile.x, tile.y]);
            indexes.push([tile.x+1, tile.y]);
        }

        else if(idx == 4) {
            indexes.push([tile.x-1, tile.y-1]);
            indexes.push([tile.x, tile.y-1]);
            indexes.push([tile.x-1, tile.y]);
            indexes.push([tile.x, tile.y]);
        }

        indexes.forEach(idx => {
            const curTile = ground.getTileAt(idx[0], idx[1]);
            const newTile = ground.putTileAt(curTile.index-2, curTile.x, curTile.y);
            newTile.properties.breakable = false;
        })

        //play effect of tile mutation.
        if(tile.type == MapTextures.Bush) {
            this.playEffect(tile.x*8+8, tile.y*8, 'effects', 'leafs-falling');
        }
        else if(tile.type == MapTextures.BrownBush) {
            this.playEffect(tile.x*8+8, tile.y*8, 'effects', 'brownleafs-falling');
        }
        else if(tile.type == MapTextures.Rock) {
            this.playEffect(tile.x*8+8, tile.y*8+8, 'effects', 'rock-breaking');
        }
    }


    /**
     * Hanlder for removing items from scene when someone collects it.
     * 
     * @param itemState 
     */
    private handleOnItemCollected = (itemState: IItemState) => {
        
        const item = this.items.getChildren().find(i => {
            const collectible = i as any as ICollectible
            return collectible.id === itemState.id;
        });

        //if an item is found, detroy it
        if(item) {

            this.items.killAndHide(item);
            item.destroy();
        }
    }


    private createItemHandler = (itemState: IItemState) => {

        //create a collectible from item state from server.
        const collectible = new Collectible(this, itemState);
        
        if(collectible) {

            this.add.existing(collectible);
            this.items.add(collectible);
        }
    }


    /**
     * Handler for when the game changes on the server.
     * 
     * @param roomState 
     * @param gameState 
     */
    private handleGameStateChange = (roomState: IBattleRoyaleRoomState, gameState: GameState) => {

        //emit event
        SceneEvents.emit(ServerEvents.OnGameStateChanged, roomState, gameState);

        switch(gameState) {
            case GameState.WaitingForPlayers:

                if(!this.clientState.isCurrentState('waiting-for-players')) {
                    this.clientState.setState('waiting-for-players');
                }

                break;

            case GameState.InProgress:
                
                if(!this.clientState.isCurrentState('in-progress')) {
                    this.clientState.setState('in-progress');
                }

                break;

            case GameState.Completed:
                
                if(!this.clientState.isCurrentState('game-over')) {
                    this.clientState.setState('game-over');
                }

                break;
        }
    }
    

    private cleanup() {

        this.serverService.tryDisconnect();
        this.serverService.onceDisconnected(async () => {

            //leave the game and refresh data
            this.serverService.leave();
            
            SceneEvents.emit('datasaved');
        });

        //clear server resources
        if(this.world) {

            deleteWorld(this.world);
            this.world = undefined;
            this.serverSystem = undefined;
            this.npcSystem = undefined;
            this.enemySystem = undefined;
            this.dialogSystem = undefined;
        }
        
        this.player = undefined;
        this.players.clear(true, true);

        this.chests.clear(true, true);
        this.items.clear(true, true);
        this.effects.clear(true, true);
        this.bullets.clear(true, true);
        this.remoteBullets.clear(true, true);
        this.bombs.clear(true, true);
        this.switches.clear(true, true);

        this.serverSystemConfig.cleanupHandler();
        this.serverSystemConfig = undefined;

        this.npcSystemConfig.cleanupHandler();
        this.npcSystemConfig = undefined;

        this.enemySystemConfig.cleanupHandler();
        this.enemySystemConfig = undefined;

        this.dialogSystemConfig.cleanupHandler();
        this.dialogSystemConfig = undefined;

        this.clientState.setState('game-over');

        this.map.destroy();
        SceneEvents.removeAllListeners();
        this.componentService.destroy();
    }
    
    /**
     * Joins the server and creates callbacks for server events.
     */
    private onJoinGameEnter() {


        this.serverService.onJoin(this.handleOnJoin);
        this.serverService.onError(this.handleOnError);

        this.serverService.join('john', 'id', 'token', 1);

        //register callback when recieving messages from server
        this.serverService.onMessage((message) => {
            SceneEvents.emit('onmessage', message);
        });

        //register callback when receiving placing
        this.serverService.onPlacing((event) => {
            SceneEvents.emit('onplacing', event);
        });
        
        //listen for server game state to change
        this.serverService.onGameStateChange(this.handleGameStateChange);
    }


    /**
     * Handles joining room
     * Intializes current players in room and map while adding listeners for new playesr when they join
     * 
     * @param roomState 
     */
    private handleOnJoin = (roomState: IBattleRoyaleRoomState) => {

        //emit scene event that game is ready
        SceneEvents.emit('onloadingstatechange', LoadingState.Done);
    
        //wait to start
        this.time.delayedCall(1000, () => {
  
            this.intializeMapAndSprites(roomState);
        })
    }

    private handleOnError = (code, message) => {

        this.cleanup();
        
        if(!this.onGameError) {
            return;
        }

        this.onGameError();
    };

   /**
     * Intialized map and sprites and objects in map.
     * 
     * @param roomState 
     * @returns 
     */
    private intializeMapAndSprites(roomState: IBattleRoyaleRoomState) {

        //create entity worlds/systems
        this.world = createWorld();

        //fetch my state from room
        const myState = roomState.playerStates.find(p => p.clientId == this.serverService.sessionId);
        if(!myState) return;

        //create player object
        const player = this.createPlayerObject(myState);

        //if unable to create player, cut join short
        if(!player) return;
        this.player = player;
        this.player.setDepth(2);

        //when you join a room, load the map based on room state
        this.createMap(player, roomState, this.physics.config.debug);

        this.serverSystemConfig = createServerSystem(this, roomState);
        this.serverSystem = this.serverSystemConfig.world;

        this.npcSystemConfig = createNPCSystem(this, roomState);
        this.npcSystem = this.npcSystemConfig.world;

        this.enemySystemConfig = createEnemySystem(this, roomState);
        this.enemySystem = this.enemySystemConfig.world;

        this.updatePipeline = pipe(this.serverSystem!, this.enemySystem!, this.npcSystem!);

        this.dialogSystemConfig = createDialogSystem(this, roomState);
        this.dialogSystem = this.dialogSystemConfig.world;
        this.postUpdatePipeline = pipe(this.dialogSystem!);

        //add map objects
        roomState.switches.forEach(obj => {
            
            const switchObj = this.switches.get(obj.x, obj.y);
            switchObj.anims.play(texturesIndex[obj.texture]);
        });

        this.input.mouse.disableContextMenu();

        //handler for creating new player entities
        const createPlayerHandler = (playerState) => {
            if(playerState.clientId != this.serverService.sessionId) {

                const id = addEntity(this.world!);
                Player.id[id] = playerState.id;
                this.entityMap.set(playerState.id, id);

                addComponent(this.world!, Server, id);
                Server.id[id] = playerState.id;
                
                this.remotePlayersMap.set(playerState.clientId, id);
            }
        }

        //init npcs
        roomState.npcs.forEach(npc => {

            const id = addEntity(this.world!);
            addComponent(this.world!, NPC, id);

            this.entityMap.set(npc.id, id);
            NPC.id[id] = npc.id;
        });

        //init enemies
        roomState.enemies.forEach(enemy => {

            const id = addEntity(this.world!);
            addComponent(this.world!, BadGuy, id);

            this.entityMap.set(enemy.id, id);
            BadGuy.id[id] = enemy.id;
        });

        const $ = this.serverService.getChangeCallbacks();
        $(roomState).enemies.onRemove(enemy => {
            const id = this.entityMap.get(enemy.id);

            if(id) {
                removeEntity(this.world!, id);
                this.entityMap.delete(id);
            }
        });

        //create remote player entities for existing and new players
        roomState.playerStates.forEach(createPlayerHandler);
        this.serverService.onPlayerJoin(createPlayerHandler);

        //listen for npcs talking
        this.serverService.onTalk(e => {
            
            const id = this.entityMap.get(e.id);
            if(id == null) return;

            //add dialog component
            addComponent(this.world!, Dialog, id);
            Dialog.id[id] = e.id;

            //queue message
            queueMessage(id, e.msg);
        });

        //when other players leave
        this.serverService.onPlayerLeave(playerState => {
            if(playerState.clientId != this.serverService.sessionId) {

                //look up local entity based on player id
                const remotePlayer = this.remotePlayersMap.get(playerState.clientId);

                if(remotePlayer !== undefined) {

                    removeEntity(this.world!, remotePlayer);
                    this.remotePlayersMap.delete(playerState.clientId);
                }
            }
        });

        this.initialized = true;
        SceneEvents.emit('ongameready');
    }


    private initStorm(player: Link, roomState: IBattleRoyaleRoomState) {
  
        //init zone settings from server
        this.zoneWidth = roomState.zoneWidth;
        this.zoneX = roomState.zoneX;
        this.zoneY = roomState.zoneY;

        //create storm screen
        this.storm = this.add.graphics({ fillStyle: { color: 0x062c39, alpha: 0.5 } }).setDepth(100);

        //create zone circle
        this.zone = this.add.graphics();
        this.zone.lineStyle(4, 0xff00ff, 1);
        this.zone.fillStyle(0xffffff);
        this.zone.setAlpha(0);
        this.zone.beginPath();
        this.zone.arc(0, 0, this.zoneWidth, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(360), true);
        this.zone.fillPath();
        this.zone.setPosition(this.zoneX, this.zoneY)

        //create mask to reveal zone in storm
        const zoneMask = this.zone.createGeometryMask();
        zoneMask.setInvertAlpha(true)

        //set mask
        this.storm.setMask(zoneMask);
        this.storm.fillRect(0, 0, 2400, 2400);

        // //configure snow particles with storm and player
        this.snowEmitter = this.add.particles('snow').setDepth(41).createEmitter({
            x: 0,
            y: 0,
            emitZone: {
                source: new Phaser.Geom.Rectangle(0, 0, 400, 300),
                type: 'random',
                quantity: 20
            },
            speedY: { min: 10, max: 20 },
            speedX: { min: 5, max: 20},
            accelerationY: { random: [10, 15] },
            lifespan: { min: 2000, max: 4000 },
            scaleX: { random: [1, 3] },
            scaleY: { random: [1, 3] },
            //tint: {min: 0xCCCCCC, max: 0xffffff},
            frequency: 10,
            blendMode: 'ADD',
            follow: player,
            followOffset: { x: -200, y: -150 }
        });
        this.snowEmitter.mask = zoneMask;
    }

    private shrinkZone(rx: number, dx: number, dy: number, duration: number) {

        const scale = rx / 1700;
        this.tweens.add({
            targets: this.zone,
            props: { scale: scale, x: dx, y: dy },
            duration: duration
        });
    }

    private onWaitingForPlayersEnter() {
        console.log('waiting for players');
    }

    private onInProgressEnter() {
        console.log('game in progress');
    }

    private onGameOverEnter() {
        console.log('game has ended');
    }
    

    /**
     * Creates an instance of a player object based on provided server state.
     * 
     * @param state
     * @returns 
     */
    private createPlayerObject = (state: IPlayerState) => {

        if(!state) return;

        const id = addEntity(this.world!);
        Player.id[id] = state.id;
        this.entityMap.set(state.id, id);

        //const link = this.add.link(playerSprite.x!, playerSprite.y!) as Link;
        const link = new Link(this, state);
        this.add.existing(link);
        
        link.color = linkColorIndex[state.linkColor];
        link.anims.play(`${link.color}-stand-south`);

        //link.id = state.playerSprite.id;
        link.serverService = this.serverService;
        link.serverPlayerState = state;
        
        //emit events to update hud with initial state
        SceneEvents.emit('onmaxhealthchanged', state.maxHealth);
        SceneEvents.emit('onhealthchanged', state.health);
        SceneEvents.emit('onarrowschanged', state.arrows);
        SceneEvents.emit('onrupeeschanged', state.rupees);
        SceneEvents.emit('onbombschanged', state.bombs);
        SceneEvents.emit('onkeyschanged', state.keys);

        const magic = (+state.magic) / (+state.maxMagic);
        SceneEvents.emit('onmagicchanged', magic);

        //add component to listen for changes from server for player, such as health and events like getting hit
        this.componentService.addComponent(link, new ListenForStateChangeComponent(state, this.serverService));

        //assign input components for player based on device.
        //Keyboard for windows and mac, and touch for everything else.
        if(getDeviceName() === Devices.Windows || getDeviceName() == Devices.Mac) {
            this.componentService.addComponent(link, new KeyboardInputComponent(this));
        }
        else {
            this.componentService.addComponent(link, new TouchInputComponent(this));
        }
        
        //add behavior components like the ability to interact with chests
        this.componentService.addComponent(link, new OpenChestComponent(this, this.serverService));
        this.componentService.addComponent(link, new CollectItemComponent(this, this.serverService));
        //this.componentService.addComponent(link, new ShowDamageComponent(this));

        //add components to sync client with server after user inputs.
        this.componentService.addComponent(link, new PatchServerStateComponent(20, state, this.serverService));

        //have the camera follow link
        this.cameras.main.startFollow(link);
        return link;
    }

    private addMapInteraction(player: Link, roomState: IBattleRoyaleRoomState) {
        
        //add colision with wall layer
        const groundLayer = this.map.getLayer('Ground Layer').tilemapLayer;
        groundLayer.setZ(1);

        this.physics.add.collider(player, groundLayer, (obj1: any, obj2: any) => {
       
            //if you are colliding with a locked door and have a key
            if(obj2.properties.type == 'lockedDoor' && obj1.keys > 0) {

                const rootTile = getLockedDoorRootTile(obj2, groundLayer);

                if(rootTile) {
                    this.serverService.tryOpenLockedDoor(rootTile.x, rootTile.y);
                }
            }
        });

        //add local bullet collisions between players
        this.physics.add.overlap(this.bullets, this.players, (obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) => {
       
            const bullet = obj1 as Bullet;
            obj1.emit('oncontact', obj1, obj2, () => {
                this.bullets.killAndHide(bullet);
                bullet.destroy();
            });
        });

        this.physics.add.collider(this.bullets, groundLayer, (obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) => {
           
            const bullet = obj1 as Bullet;
            obj1.emit('oncontact', obj1, obj2, () => {
                this.bullets.killAndHide(bullet);
                bullet.destroy();
            });
        });

        this.physics.add.collider(this.remoteBullets, groundLayer, (obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) => {
            
            const bullet = obj1 as Bullet;
            obj1.emit('oncontact', obj1, obj2, () => {
                this.remoteBullets.killAndHide(bullet);
                bullet.destroy();
            });
        });

        //add terrain events on ground layer
        this.addTerrainEvents(player, [236], groundLayer, LandType.ShallowWater);
        this.addTerrainEvents(player, [61, 62, 90, 91, 1], groundLayer, LandType.Grass);
        this.addTerrainEvents(player, [63, 64, 92, 93], groundLayer, LandType.TallGrass);

        groundLayer.setTileIndexCallback([599], () => {
          
            const centerTile = groundLayer.getTileAtWorldXY(player.x, player.y);
            if([599].indexOf(centerTile.index) > -1) {

                const coverLayer = this.map.getLayer('Cover Layer').tilemapLayer;
                const firstTile = coverLayer.getTileAtWorldXY(player.x, player.y-16);

                updateHouseRoof(this, firstTile, coverLayer, true);
            }

        }, this);

        groundLayer.setTileIndexCallback([628], () => {
            
            const centerTile = groundLayer.getTileAtWorldXY(player.x, player.y);
            if([628].indexOf(centerTile.index) > -1) {
                const coverLayer = this.map.getLayer('Cover Layer').tilemapLayer;
                const firstTile = coverLayer.getTileAtWorldXY(player.x, player.y-24);

                updateHouseRoof(this, firstTile, coverLayer, false);
            }

        }, this);

        //add interactions for cameraBounds
        const mapData = this.cache.tilemap.get(roomState.mapName).data;
        const itemLayer = mapData.layers.find(l => l.name == 'Item Layer');

        if(itemLayer) {
            const objs = itemLayer.objects.filter(obj => obj.type == 'cameraBounds');

            if(objs) {

                const bounds = this.add.group({
                    classType: Phaser.GameObjects.Rectangle
                });

                objs.forEach(obj => {
                    const b = bounds.get(obj.x, obj.y) as Phaser.GameObjects.Rectangle;
                    b.setSize(obj.width, obj.height);
                    
                    this.physics.world.enable(b);
                });

                let curBounds: any = null;
                let curTween: any = null;

                this.physics.add.overlap(player, bounds, (player, bounds: any) => {
                    
                    if(bounds.x != curBounds?.x && bounds.y != curBounds?.y) {
                        
                        //console.log('changing');
                        const offset = 16;

                        const now = this.cameras.main.getBounds();
                        const x1 = this.cameras.main.scrollX;
                        const y1 = this.cameras.main.scrollY;

                        this.cameras.main.setBounds(bounds.x - offset, bounds.y-offset, bounds.width+(offset*2), bounds.height+(offset*2));
                        this.cameras.main.startFollow(player);

                        const x2 = this.cameras.main.scrollX;
                        const y2 = this.cameras.main.scrollY;

                        this.cameras.main.setScroll(x1, y1);
            
                        //console.log(`x:${x1}=>${x2}, y:${y1}=>${y2}`);
                        
                        this.cameras.main.stopFollow();
                        this.cameras.main.setBounds(0, 0, 2400, 2400);
                        curBounds = bounds;

                        if(curTween) {
                            curTween.stop();
                        }

                        curTween = this.tweens.add({
                            targets: this.cameras.main,
                            scrollX: x2,
                            scrollY: y2,
                            duration: 600,
                            onComplete: () => {
                                this.cameras.main.startFollow(player);
                                this.cameras.main.setBounds(bounds.x - offset, bounds.y-offset, bounds.width+(offset*2), bounds.height+(offset*2));
                                curTween = null;
                                // const cam = this.cameras.main;
                                // cam.pan(player.body.x, player.body.y, 1000, 'Sine.easeInOut', true, (cam, progress) => {

                                //     cam.panEffect.destination.x = player.body.x;
                                //     cam.panEffect.destination.y = player.body.y;

                                //     if(progress == 1){
                                //         console.log(2)
                                //         this.cameras.main.startFollow(player);
                                //         this.cameras.main.setBounds(bounds.x - offset, bounds.y-offset, bounds.width+(offset*2), bounds.height+(offset*2));
                                //     }
                                // });
                                
                            }
                        })
                    }
                });
            }
        }
    }

    /**
     * Sets the player land type based on tile index event handlers
     * 
     * @param player 
     * @param tileIndexes 
     * @param mapLayer 
     * @param landType 
     */
    private addTerrainEvents = (player: Link, tileIndexes: number[], mapLayer: Phaser.Tilemaps.TilemapLayer, landType: LandType) => {

        mapLayer.setTileIndexCallback(tileIndexes, () => {
            
            if(player.curLandType != landType) {

                const centerTile = mapLayer.getTileAtWorldXY(player.x, player.y+3);
                if(tileIndexes.indexOf(centerTile.index) > -1) player.setCurLandType(landType);
            }

        }, this);
    };
    

    /**
     * Load resources/plugin for scene.
     */
	preload() {

        //emit scene event that game is intializing
        SceneEvents.emit('onloadingstatechange', LoadingState.LoadingResources);

        //load plugin to animate tiledmap
        this.load.scenePlugin('AnimatedTiles', 'js/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }
    

    /**
     * Create/Initialize game resources
     * 
     * @param config 
     */
    create(config: IGameSceneConfig) {

        //store references from scene inputs
        this.gameModeId = config.gameMode;
        this.componentService = config.componentService;
        this.serverService = config.serverService;
        this.onGameError = config.onGameError;

        SceneEvents.once('onreadyup', () => {
            this.cleanup();
            config.onPlayAgain(config.gameMode);
        });

        // SceneEvents.once('onreturntolobby', () => {
        //     this.cleanup();
        //     config.onReturnToLobby();
        // });

        SceneEvents.on('onswitchweapon', (event) => {
            this.serverService.trySwitchWeaponFromBag(event.slot, event.bagPosition);
        });

        this.players = this.physics.add.group({
            classType: Link
        });
        this.chests = this.physics.add.staticGroup({
            classType: Chest
        });
        this.items = this.physics.add.staticGroup({
            classType: Phaser.GameObjects.GameObject
        });
        this.effects = this.physics.add.staticGroup({
            classType: Phaser.GameObjects.Sprite
        });
        this.bullets = this.physics.add.group({
            classType: Bullet
        });
        this.remoteBullets = this.physics.add.group({
            classType: Bullet
        });
        this.bombs = this.physics.add.staticGroup({
            classType: RemoteBomb
        });
        this.switches = this.physics.add.staticGroup({
            classType: Phaser.GameObjects.Sprite
        });

        //create client states
        this.clientState
        .addState('joining-game', {
            onEnter: this.onJoinGameEnter
        })
        .addState('waiting-for-players',{
            onEnter: this.onWaitingForPlayersEnter
        })
        .addState('in-progress', {
            onEnter: this.onInProgressEnter
        })
        .addState('game-over', {
            onEnter: this.onGameOverEnter
        });
        
        this.clientState.setState('joining-game');
        this.events.on(Phaser.Scenes.Events.POST_UPDATE, this.postUpdate, this);
    }


    /**
     * Updates entity systems and local player object.
     * 
     * @param dt 
     * @param t 
     * @returns 
     */
    update(dt: number, t: number) {
       
        this.frameRate++;
        
        //if any of the constructs is missing, do nothing
        if(!this.initialized) return;

        //update sprites from server
        this.updatePipeline(this.world);

        //update component stacks and client state
        //this.componentService.update(dt, t);

        //update player state
        this.player!.update(dt);

        //update client state
        this.clientState.update(dt);
    }

    postUpdate(dt: number, t: number) {

        if(!this.initialized) return;

        //update component stacks and client state
        this.componentService.update(dt, t);

        this.postUpdatePipeline(this.world);
    }
}