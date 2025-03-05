import { defineQuery, defineSystem, enterQuery, exitQuery } from "bitecs";
import { IBattleRoyaleRoomState } from "@natewilcox/zelda-battle-shared";
import { texturesIndex } from "@natewilcox/zelda-battle-shared";
import NPCharacter from "../characters/NPC";
import { NPC } from "../components/SpriteComponents";
import GameScene from "../scenes/GameScene";
import { NPCAICommand } from "~/commands/NPCAICommand";

export const createNPCSystem = (scene: GameScene, roomState: IBattleRoyaleRoomState) => {

    const changeHandlers: Map<string, (sprite: any, changes: any) => void> = new Map();

    const serverSpriteQuery = defineQuery([NPC]);
    const serverSpriteEnterQuery = enterQuery(serverSpriteQuery);
    const serverSpriteExitQuery = exitQuery(serverSpriteQuery);

    const spriteMap = new Map<number, Phaser.GameObjects.Sprite>();

    scene.npcs = scene.add.group({
        classType: NPCharacter
    });

    const changeHandler = function(this: Phaser.GameObjects.Sprite, changes) {
     
        //call the change handler for each change coming from server
        changes.forEach(change => {

            if(changeHandlers.get(change.field)) {
                changeHandlers.get(change.field)!(this, change);
            }
        });
    };

    changeHandlers.set('anim', function(state, change) {

        const npc = spriteMap.get(state.id);
        const anim = `${texturesIndex[state.texture]}-${change.value}`;

        if(npc) {
            npc.anims.play(anim, true);
        }
    });

    const cleanupHandler = () => {
        
        spriteMap.clear();

        scene.npcs.clear(true, true);
        scene.npcs.destroy();
    };

    const world = defineSystem(world => {
    
        const enterEntities = serverSpriteEnterQuery(world);
        for(let i=0;i<enterEntities.length; i++) {
            
            const id = enterEntities[i];
            const npc = roomState.npcs.find(npc => npc.id == NPC.id[id]);

            if(npc) {

                //listen for changes
                npc.onChange = changeHandler;
                const anim = `${texturesIndex[npc.texture]}-standing`;
                const npcharacter = scene.npcs.get(npc.x, npc.y, 'npc');
                
                npcharacter.setDepth(3);
                npcharacter.anims.play(anim, true);
                npcharacter.id = npc.id;
                
                spriteMap.set(npc.id, npcharacter);
            }
        }

        const exitEntities = serverSpriteExitQuery(world);
        for(let i=0;i<exitEntities.length; i++) {
            const id = exitEntities[i];

            console.log(`exiting ${id}`);
        }

        return world;
    });

    return { world, cleanupHandler }
};