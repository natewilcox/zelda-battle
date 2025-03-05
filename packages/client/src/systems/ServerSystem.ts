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

    const playerChangeHandler = (id: number, changes, state: IPlayerState) => {

        const player = playerById.get(id);
        if(!player) return;

        let movedOnServer = false;

        changes.forEach(change => {

            if(change.field == 'hasOra') {
                player.showOra(change.value);
            }
            else if(change.field == 'state') {
                handleStateChange(player, state, change.value);
            }
            else if(change.field == 'x' || change.field == 'y') {
                scene.physics.moveTo(player, state.x, state.y, player.speed);
            }
            else if(change.field == 'visible') {
    
                //if the health is changed to 0, die....
                if(change.value) {
                    player!.reappear();
                }
                else {
                    player!.vanish(false);
                }
            }
            else if(change.field == 'wearingCape') {
                //if the health is changed to 0, die....
                if(change.value) {
                    player!.vanish(false);
                }
                else {
                    player!.reappear();
                }
            }
            else if(change.field == 'speed') {
                player.speed = change.value;
            }
            else if(change.field == 'teleport_x' || change.field == 'teleport_y') {
                movedOnServer = true;
            }
            else if(change.field == 'curLandType') {
                player.setCurLandType(change.value);
            }
            else if(change.field == 'alpha') {
                player.setAlpha(change.value);
            }
            else if(change.field == 'weaponSlot1') {

                //if last value was shield, remove shield
                if(change.previousValue == GameTextures.BlueShield) {
                    player.removeShield();
                }

                if(change.value != undefined) {
                    state.state = LinkState.Collecting;

                    player.playCollectItem(change.value, undefined, () => {
                    
                        if(change.value == GameTextures.BlueShield) {
                            
                            let item = weaponFactory(change.value, player, scene);
                            player.addShield(item);
                        }
                    });
                }
            }
            else if(change.field == 'weaponSlot2') {

                //if last value was shield, remove shield
                if(change.previousValue == GameTextures.BlueShield) {
                    player.removeShield();
                }

                if(change.value != undefined) {
                    state.state = LinkState.Collecting;

                    player.playCollectItem(change.value, undefined, () => {
                    
                        if(change.value == GameTextures.BlueShield) {
                            
                            let item = weaponFactory(change.value, player, scene);
                            player.addShield(item);
                        }
                    });
                }
            }
            else if(change.field == 'health') {
                player.health = change.value;

                //disable body when dead
                if(player.health == 0) {
                    scene.physics.world.disable(player);
                }
            }
            else if(change.field == 'isHiding') {
                if(change.value) {
                    player.hide();
                }
                else {
                    player.unHide();
                }
            }
            else if(change.field == 'hasMagicShield') {
                player.createMagicShield(change.value);
            }
        });

        //if the server moved me, then move to that location
        if(movedOnServer) { 
            player.setPosition(state.x, state.y);
        }
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
            playerState.onChange = (changes) => playerChangeHandler(id, changes, playerState);

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