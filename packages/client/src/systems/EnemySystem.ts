import { defineQuery, defineSystem, enterQuery, exitQuery } from "bitecs";
import { IBattleRoyaleRoomState } from "@natewilcox/zelda-battle-shared";
import { directionIndex, GameTextures, texturesIndex } from "@natewilcox/zelda-battle-shared";
import { BadGuy } from "../components/SpriteComponents";
import GameScene from "../scenes/GameScene";
import Enemy from "../characters/Enemy";
import { IEnemyState } from "@natewilcox/zelda-battle-shared";
import { BatState, RatState, SkeletonState, SnakeState } from "@natewilcox/zelda-battle-shared";

export const createEnemySystem = (scene: GameScene, roomState: IBattleRoyaleRoomState) => {

    //maps tracking sprite and state data
    const enemyStatesById = new Map<number, IEnemyState>();
    const enemyById = new Map<number, Enemy>();

    const enemyStateByServerId = new Map<number, IEnemyState>();
    const enemyByServerId = new Map<number, Enemy>();
    const enemyMovementState = new Map<number, boolean>();

    const changeHandlers: Map<string, (sprite: any, changes: any) => void> = new Map();
    const $ = scene.serverService.getChangeCallbacks();

    const serverSpriteQuery = defineQuery([BadGuy]);
    const serverSpriteEnterQuery = enterQuery(serverSpriteQuery);
    const serverSpriteExitQuery = exitQuery(serverSpriteQuery);

    const spriteMap = new Map<number, Phaser.GameObjects.Sprite>();

    scene.enemies = scene.physics.add.group({
        classType: Enemy
    });

    const setChangeHandler = function(state: IEnemyState) {

        $(state).listen('state', (value, previous) => {

            const field = texturesIndex[state.texture] + '_state';
            changeHandlers.get(field)!(state, value);
        });

        $(state).listen('alpha', (value, previous) => {

            const field = texturesIndex[state.texture] + '_alpha';
            changeHandlers.get(field)!(state, value);
        });
    };

    const alphaChangeHandler = (state, change) => {

        const enemy = spriteMap.get(state.id);
        if(!enemy) return;

        enemy.setAlpha(change.value);
    }

    changeHandlers.set('bat_state', function(state, change) {

        const enemy = spriteMap.get(state.id);
        if(!enemy) return;

        if(change.value == BatState.Flying) {

            enemyMovementState.set(state.id, true);
            enemy.anims.play('bat-flying', true);
        }
        else if(change.value == BatState.Hurt) {

            scene.playFlash(state.x, state.y);

            enemyMovementState.set(state.id, true);
            enemy.anims.pause();
        }
        else {
            enemyMovementState.set(state.id, false);
            enemy.anims.play('bat-standing', true);
        }
    });
    changeHandlers.set('bat_alpha', alphaChangeHandler);
    changeHandlers.set('rat_state', function(state, change) {

        const enemy = spriteMap.get(state.id);
        if(!enemy) return;

        if(change.value == RatState.Standing) {

            enemyMovementState.set(state.id, false);
            const dir = directionIndex[state.dir];
            enemy.anims.play(`rat-standing-${dir}`, true);
        }
        else if (change.value == RatState.Walking) {

            enemyMovementState.set(state.id, true);
            const dir = directionIndex[state.dir];
            enemy.anims.play(`rat-walking-${dir}`, true);
        }
        else if (change.value == RatState.Hurt) {

            scene.playFlash(state.x, state.y);

            enemyMovementState.set(state.id, true);
            enemy.anims.pause();
        }
        else {
            enemyMovementState.set(state.id, false);
            enemy.anims.play('rat-standing-east', true);
        }
    });
    changeHandlers.set('rat_alpha', alphaChangeHandler);
    changeHandlers.set('rat_dir', function(state, change) {

        const enemy = spriteMap.get(state.id);
        if(!enemy) return;

        if (state.state == RatState.Walking) {

            enemyMovementState.set(state.id, true);
            const dir = directionIndex[change.value];
            enemy.anims.play(`rat-walking-${dir}`, true);
        }
    });
    changeHandlers.set('snake_state', function(state, change) {

        const enemy = spriteMap.get(state.id);
        if(!enemy) return;

        if(change.value == SnakeState.Standing) {

            enemyMovementState.set(state.id, false);
            const dir = directionIndex[state.dir];
            enemy.anims.play(`snake-standing-${dir}`, true);
        }
        else if (change.value == SnakeState.Walking) {

            enemyMovementState.set(state.id, true);
            const dir = directionIndex[state.dir];
            enemy.anims.play(`snake-walking-${dir}`, true);
        }
        else if (change.value == SnakeState.Hurt) {

            scene.playFlash(state.x, state.y);

            enemyMovementState.set(state.id, true);
            enemy.anims.pause();
        }
        else {
            enemyMovementState.set(state.id, false);
            enemy.anims.play('snake-standing-south', true);
        }
    });
    changeHandlers.set('snake_alpha', alphaChangeHandler);
    changeHandlers.set('snake_dir', function(state, change) {

        const enemy = spriteMap.get(state.id);
        if(!enemy) return;

        if (state.state == SnakeState.Walking) {

            enemyMovementState.set(state.id, true);
            const dir = directionIndex[change.value];
            enemy.anims.play(`snake-walking-${dir}`, true);
        }
    });
    changeHandlers.set('skeleton_state', function(state, change) {

        const enemy = spriteMap.get(state.id);
        if(!enemy) return;

        if(change.value == SkeletonState.Standing) {

            enemyMovementState.set(state.id, false);
            const dir = directionIndex[state.dir];
            enemy.anims.play(`skeleton-standing-${dir}`, true);
        }
        else if (change.value == SkeletonState.Walking) {

            enemyMovementState.set(state.id, true);
            const dir = directionIndex[state.dir];
            enemy.anims.play(`skeleton-walking-${dir}`, true);
        }
        else if (change.value == SkeletonState.Hurt) {

            scene.playFlash(state.x, state.y);

            enemyMovementState.set(state.id, true);
            enemy.anims.pause();
        }
        else {
            enemyMovementState.set(state.id, false);
            enemy.anims.play('skeleton-standing-south', true);
        }
    });
    changeHandlers.set('skeleton_alpha', alphaChangeHandler);
    changeHandlers.set('skeleton_dir', function(state, change) {

        const enemy = spriteMap.get(state.id);
        if(!enemy) return;

        if (state.state == SkeletonState.Walking) {

            enemyMovementState.set(state.id, true);
            const dir = directionIndex[change.value];
            enemy.anims.play(`skeleton-walking-${dir}`, true);
        }
    });
    const cleanupHandler = () => {
        
        spriteMap.clear();

        scene.enemies.clear(true, true);
        scene.enemies.destroy();
    };

    const world = defineSystem(world => {
    
        const enterEntities = serverSpriteEnterQuery(world);
        for(let i=0;i<enterEntities.length; i++) {
            
            const id = enterEntities[i];
            const enemyState = roomState.enemies.find(enemy => enemy.id == BadGuy.id[id]);

            if(enemyState) {

                //listen for changes
                setChangeHandler(enemyState);
                const enemy = enemyFactory(scene, enemyState);

                //store the state by id for fetching later
                enemyStatesById.set(id, enemyState);
                enemyById.set(id, enemy);
                enemyByServerId.set(enemy.id, enemy);
                enemyStateByServerId.set(enemy.id, enemyState);
                enemyMovementState.set(enemy.id, false);

                spriteMap.set(enemyState.id, enemy);
            }
        }

        const entities = serverSpriteQuery(world);
        for(let i=0;i<entities.length; i++) {

            const id = entities[i];
            const enemy = enemyById.get(id);
            const state = enemyStatesById.get(id);

            if(!enemy || !state || !state.x || !state.y) {
                continue;
            }

            if(!enemyMovementState.get(state.id)) {
                enemy.setVelocity(0, 0);
                enemy.setPosition(state.x, state.y);
            }
            else {
                scene.physics.moveTo(enemy!, state.x, state.y, state.speed);
            }
        }

        const exitEntities = serverSpriteExitQuery(world);
        for(let i=0;i<exitEntities.length; i++) {

            const id = exitEntities[i];
            const enemy = enemyById.get(id);
            const state = enemyStatesById.get(id);

            if(!enemy || !state) {
                continue;
            }

            scene.enemies.killAndHide(enemy);
            enemy.destroy();
            enemyById.delete(id);
            enemyStatesById.delete(id);
            enemyByServerId.delete(enemy.id);
            enemyStateByServerId.delete(enemy.id);

            //add a poof effect where the player disappearsw
            scene.playEffect(enemy.x, enemy.y, 'effects', 'death-poof');
        }

        return world;
    });

    return { world, cleanupHandler }
};

const enemyFactory = (scene, enemyState: IEnemyState) => {

    const enemy = scene.enemies.get(enemyState.x, enemyState.y, 'enemies');
    
    switch(enemyState.texture) {

        case GameTextures.Bat: 
            enemy.anims.play(`${texturesIndex[enemyState.texture]}-standing`, true); 
            break;

        case GameTextures.Rat: 
            enemy.anims.play(`${texturesIndex[enemyState.texture]}-standing-east`, true); 
            break;

        case GameTextures.Snake: 
            enemy.anims.play(`${texturesIndex[enemyState.texture]}-standing-south`, true); 
            break;

        case GameTextures.Skeleton: 
            enemy.anims.play(`${texturesIndex[enemyState.texture]}-standing-south`, true); 
            break;
    }

    enemy.setSize(10, 10)
    enemy.setDepth(3);
    enemy.id = enemyState.id;
    enemy.speed = enemyState.speed;

    return enemy;
}