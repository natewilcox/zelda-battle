import Phaser from 'phaser';

import { defineQuery, defineSystem, enterQuery, exitQuery } from "bitecs";
import { Server } from "../components/SpriteComponents";
import { Direction, directionIndex, GameTextures, linkColorIndex, LinkState, WeaponType } from '@natewilcox/zelda-battle-shared';
import { IPlayerState } from '@natewilcox/zelda-battle-shared';
import { Link } from '../characters/Link';
import GameScene from '../scenes/GameScene';
import { getWeaponType, weaponFactory } from '../utils/Utils';
import { IBow } from '../weapons/IBow';
import { Bullet } from '../weapons/Bullet';
import ShowDamageComponent from '../components/ShowDamageComponent';
import { FireRod, IceRod, LightRod } from '../weapons/Rod';
import { IBattleRoyaleRoomState } from '@natewilcox/zelda-battle-shared';


/**
 * Creates sprite system to control server entities
 * 
 * @param scene 
 * @param group 
 * @param poofs 
 * @param roomState 
 * @returns 
 */
export const createServerSystem = (scene: GameScene, roomState: IBattleRoyaleRoomState) => {

    //maps tracking sprite and state data
    const playerStatesById = new Map<number, IPlayerState>();
    const playerById = new Map<number, Link>();

    const playerStateByServerId = new Map<number, IPlayerState>();
    const playerByServerId = new Map<number, Link>();

    const serverSpriteQuery = defineQuery([Server]);
    const serverSpriteEnterQuery = enterQuery(serverSpriteQuery);
    const serverSpriteExitQuery = exitQuery(serverSpriteQuery);

    const $ = scene.serverService.getChangeCallbacks();

    const spriteGroup = scene.add.group({
        classType: Phaser.GameObjects.Sprite
    });

    
    const bullets = scene.add.group({
        classType: Bullet
    });

    scene.serverService.onDynamicChestOpened(e => {

        const player = playerByServerId.get(e.who);
        const state = playerStateByServerId.get(e.who);
    });

    scene.serverService.onArrowShot(e => {

        const player = playerByServerId.get(e.who);
        const state = playerStateByServerId.get(e.who);

        if(!player || !state) return;

        //make sure the player magic is updated
        player.magic = state.magic;
        player.arrows = state.arrows;

        //create a bow and fire it
        const bow = weaponFactory(e.text, player, scene) as IBow;
        bow.fire(e.b, e.dir);
    });

    scene.serverService.onFireballShot(e => {

        const player = playerByServerId.get(e.who);
        const state = playerStateByServerId.get(e.who);

        if(!player || !state) return;

        const rod = weaponFactory(e.text, player, scene) as FireRod;
        rod.fire(e.x, e.y, e.b, e.dir);
    });

    scene.serverService.onIceblastShot(e => {

        const player = playerByServerId.get(e.who);
        const state = playerStateByServerId.get(e.who);

        if(!player || !state) return;

        const rod = weaponFactory(e.text, player, scene) as IceRod;
        rod.fire(e.x, e.y, e.b, e.dir);
    });

    scene.serverService.onLightBallShot(e => {

        const player = playerByServerId.get(e.who);
        const state = playerStateByServerId.get(e.who);

        if(!player || !state) return;

        const rod = weaponFactory(e.text, player, scene) as LightRod;
        rod.fire(e.x, e.y, e.b, e.dir);
    });

    scene.serverService.onPlayerBurned(e => {

        const player = playerByServerId.get(e.id);
        const state = playerStateByServerId.get(e.id);

        if(!player || !state) return;

        player.burn(e.first);
    });

    scene.serverService.onPlayerReset(e => {
        const player = playerByServerId.get(e.id);
        const state = playerStateByServerId.get(e.id);

        if(!player || !state) return;

        player.reset();
    })

    const handleStateChange = (player: Link, playerState: IPlayerState, linkState: LinkState) => {

        switch(linkState) {

            case LinkState.Hurt: 
                player.playHurt(playerState.dir == Direction.East ? 'east' : 'west');
                break;

            case LinkState.Shocked: 
                player.playShock();
                break;

            case LinkState.Frozen: 
                player.playFrozen(true);
                break;

            case LinkState.Burned: 
                player.playBurned();
                break;

            case LinkState.Dead:

                scene.playEffect(player.x, player.y, 'effects', 'death-poof');
                break;

            case LinkState.Attack1:
            case LinkState.Attack1Alt:

                if(playerState.wearingCape) break;

                if(playerState.weaponSlot1 && getWeaponType(playerState.weaponSlot1) != WeaponType.None) {

                    player.magic = playerState.magic;
                    player.playAttack(playerState.weaponSlot1, playerState.dir);
                }
                
                break;

            case LinkState.Attack2:
            case LinkState.Attack2Alt:

                if(playerState.wearingCape) break;
                
                if(playerState.weaponSlot2 && getWeaponType(playerState.weaponSlot2) != WeaponType.None) {

                    player.magic = playerState.magic;
                    player.playAttack(playerState.weaponSlot2, playerState.dir);
                }

                break;
        }
    }

    const setPlayerChangeHandler = (state: IPlayerState) => {

        const player = playerById.get(state.id);
        if(!player) return;

        let movedOnServer = false;


        $(state).listen('hasOra', (value) => {
            player.showOra(value);
        });

        $(state).listen('state', (value) => {
            handleStateChange(player, state, value);
        });

        $(state).listen('x', (value) => {
            scene.physics.moveTo(player, state.x, state.y, player.speed);
        });

        $(state).listen('y', (value) => {
            scene.physics.moveTo(player, state.x, state.y, player.speed);
        });

        $(state).listen('visible', (value) => {
            
            //if the health is changed to 0, die....
            if(value) {
                player!.reappear();
            }
            else {
                player!.vanish(false);
            }
        });

        $(state).listen('wearingCape', (value) => {
            
            //if the health is changed to 0, die....
            if(value) {
                player!.vanish(false);
            }
            else {
                player!.reappear();
            }
        });

        $(state).listen('speed', (value) => {
            
            //if the health is changed to 0, die....
            player.speed = value;
        });

        $(state).listen('teleport_x', (value) => {
            player.setPosition(state.x, state.y);
        });

        $(state).listen('teleport_y', (value) => {
            player.setPosition(state.x, state.y);
        });

        $(state).listen('curLandType', (value) => {
            player.setCurLandType(value);
        });
        
        $(state).listen('alpha', (value) => {
            player.setAlpha(value);
        });
        
        $(state).listen('weaponSlot1', (value, previous) => {

            //if last value was shield, remove shield
            if(previous == GameTextures.BlueShield) {
                player.removeShield();
            }

            if(value != undefined) {
                state.state = LinkState.Collecting;

                player.playCollectItem(value, undefined, () => {
                
                    if(value == GameTextures.BlueShield) {
                        
                        let item = weaponFactory(value, player, scene);
                        player.addShield(item);
                    }
                });
            }
        });
        
        $(state).listen('weaponSlot2', (value, previous) => {

            //if last value was shield, remove shield
            if(previous == GameTextures.BlueShield) {
                player.removeShield();
            }

            if(value != undefined) {
                state.state = LinkState.Collecting;

                player.playCollectItem(value, undefined, () => {
                
                    if(value == GameTextures.BlueShield) {
                        
                        let item = weaponFactory(value, player, scene);
                        player.addShield(item);
                    }
                });
            }
        });
        
        $(state).listen('health', (value, previous) => {

            player.health = value;

            //disable body when dead
            if(player.health == 0) {
                scene.physics.world.disable(player);
            }
        });
        
        $(state).listen('isHiding', (value, previous) => {

            if(value) {
                player.hide();
            }
            else {
                player.unHide();
            }
        });
        
        $(state).listen('hasMagicShield', (value, previous) => {

            player.createMagicShield(value);
        });
    }


    const cleanupHandler = () => {
        spriteGroup.clear(true, true);
        spriteGroup.destroy();
    };


    /**
     * Return new system to handle creation, updating, and deletion of server sprite entities.
     */
    const world = defineSystem(world => {


        /**
         * Entities entering the game world
         */
        const enterEntities = serverSpriteEnterQuery(world);
        for(let i=0;i<enterEntities.length; i++) {
            const id = enterEntities[i];

            //skip if state is missing
            const playerState = roomState.playerStates.find(s => s.id === Server.id[id]) as IPlayerState;
            if(!playerState) continue;

            //create a remote controlled link instance
            const player = new Link(scene, playerState);
            player.id = playerState.id;
            player.clientId = playerState.clientId;
            player.color = linkColorIndex[playerState.linkColor];
            player.setDepth(3);
            player.anims.play(`${player.color}-stand-south`);

            //add component to show damange counter
            scene.componentService.addComponent(player, new ShowDamageComponent(scene));

            //listen for any changes on sprites.
            //playerState.onChange = (changes) => playerChangeHandler(id, changes, playerState);
            setPlayerChangeHandler(playerState);

            //add player to scene
            scene.players.add(player, true)

            //store the state by id for fetching later
            playerStatesById.set(id, playerState);
            playerById.set(id, player);
            playerByServerId.set(player.id, player);
            playerStateByServerId.set(player.id, playerState);

            //add a poof effect where the player appears
            scene.playEffect(playerState.x, playerState.y, 'effects', 'poof');
        }


        /**
         * Entities being updated the game world
         */
        const entities = serverSpriteQuery(world);
        for(let i=0;i<entities.length; i++) {

            const id = entities[i];
            const player = playerById.get(id);
            const state = playerStatesById.get(id);

            if(!player || !state || !state.x || !state.y) {
                continue;
            }

            const distance = Phaser.Math.Distance.Between(state.x, state.y, player.x, player.y);
            const dir = directionIndex[state.dir];

            if(distance >= 2) {

                if(state.state == LinkState.Running || state.state == LinkState.Standing) {
                    player.anims.play(`${player.color}-run-${dir}`, true);
                }
            }
            else {

                player.setVelocity(0, 0);

                if(state.state == LinkState.Running) {
                    player.anims.play(`${player.color}-run-${dir}`, true);
                }
                else if(state.state == LinkState.Standing) {
                    player.anims.play(`${player.color}-stand-${dir}`, true);
                }
            }
        }


        /**
         * Entities leaving the game world
         */
        const exitEntities = serverSpriteExitQuery(world);
        for(let i=0;i<exitEntities.length; i++) {
            
            const id = exitEntities[i];
            const player = playerById.get(id);
            const playerState = playerStatesById.get(id);

            if(!player || !playerState) {
                continue;
            }

            player.destroy();
            playerById.delete(id);
            playerStatesById.delete(id);
            playerByServerId.delete(player.id);
            playerStateByServerId.delete(player.id);

            //add a poof effect where the player disappears
            scene.playEffect(playerState.x, playerState.y, 'effects', 'poof');
        }

        return world;
    });


    return { world, cleanupHandler }
};