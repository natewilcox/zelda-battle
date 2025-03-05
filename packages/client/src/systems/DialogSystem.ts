import { addComponent, defineQuery, defineSystem, enterQuery, exitQuery, removeComponent } from "bitecs";
import { IBattleRoyaleRoomState } from "@natewilcox/zelda-battle-shared";
import { Link } from "../characters/Link";
import NPCharacter from "../characters/NPC";
import { Dialog } from "../components/SpriteComponents";
import GameScene from "../scenes/GameScene";

const messageQueue = new Map<number, string[]>(); 

export const queueMessage = (id, message) => {

    if(!messageQueue.get(id)) {
        messageQueue.set(id, []);
    }

    messageQueue.get(id)?.push(message);
}

export const createDialogSystem = (scene: GameScene, roomState: IBattleRoyaleRoomState) => {

    const serverSpriteQuery = defineQuery([Dialog]);
    const serverSpriteEnterQuery = enterQuery(serverSpriteQuery);
    const serverSpriteExitQuery = exitQuery(serverSpriteQuery);

    const characterMap = new Map<number, Phaser.GameObjects.GameObject>();
    const dialogMap = new Map<number, Phaser.GameObjects.BitmapText>();
    const dialogWindowMap = new Map<number, Phaser.GameObjects.Rectangle>();

    const dialogGroup = scene.add.group({
        classType: Phaser.GameObjects.BitmapText
    });

    const dialogWindowGroup = scene.add.group({
        classType: Phaser.GameObjects.Rectangle
    });

    const cleanupHandler = () => {
        
        characterMap.clear();
        dialogGroup.clear();
        dialogWindowGroup.clear();
    };

    const showDialog = (dialog, dialogWindow, msg, cb:() => void) => {

        dialog.setFontSize(10);
        dialog.setOrigin(0.5, 1);
        dialog.setDepth(200);

        // dialogWindow
        dialogWindow.setOrigin(0.5, 1);
        dialogWindow.setAlpha(1);
        dialogWindow.setDepth(199);
        dialogWindow.fillColor = 0x000000;
        dialogWindow.width = 5;
        dialogWindow.height = 10;
        dialogWindow.isFilled = true;
        dialogWindow.isStroked = true;

        talkingDialog(scene, dialogWindow, dialog, msg, cb);
    }

    const talkingDialog = (scene: Phaser.Scene, dialogWindow, dialog, msg: string, cb: () => void) => {

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

    const world = defineSystem(world => {
    
        const enterEntities = serverSpriteEnterQuery(world);
        for(let i=0;i<enterEntities.length; i++) {
            
            const id = enterEntities[i];
            const playerId = Dialog.id[id];
            
            let player = scene.player!.id == playerId ? scene.player : null;
            if(player == null) {
                player = scene.players.getChildren().find(go => {
                    return (go as Link).id == playerId;
                }) as Link
            }
            if(player == null) {
                player = scene.npcs.getChildren().find(go => {
                    return (go as NPCharacter).id == playerId;
                }) as Link
            }

            const dialogWindow = dialogWindowGroup.get(player.x, player.y-20) as Phaser.GameObjects.Rectangle;
            const dialog = dialogGroup.get(player.x, player.y-20, 'minecraft');
            const msg = messageQueue!.get(id)![0];

            showDialog(dialog, dialogWindow, msg, () => {

                dialogGroup.killAndHide(dialog);
                dialogWindowGroup.killAndHide(dialogWindow);
                dialog.destroy();
                dialogWindow.destroy();

                removeComponent(world, Dialog, id);
            });

            dialogMap.set(id, dialog);
            dialogWindowMap.set(id, dialogWindow);
            characterMap.set(id, player);
        }

        const entities = serverSpriteQuery(world);
        for(let i=0;i<entities.length; i++) {
            const id = entities[i];

            const player = characterMap.get(id) as Link;
            const dialog = dialogMap.get(id) as Phaser.GameObjects.BitmapText;
            const window = dialogWindowMap.get(id) as Phaser.GameObjects.Rectangle;

            dialog.setPosition(player.x, player.y-15);
            window.setPosition(player.x, player.y-15);
        }

        const exitEntities = serverSpriteExitQuery(world);
        for(let i=0;i<exitEntities.length; i++) {
            const id = exitEntities[i];
            const pid = Dialog.id[id];

            dialogMap.delete(id);
            dialogWindowMap.delete(id);
            characterMap.delete(id);

            //remove item from queue
            messageQueue.get(id)?.shift();

            //if there is another item in the queue, add new dialog component
            if(messageQueue!.get(id)!.length > 0) {

                addComponent(world, Dialog, id);
                Dialog.id[id] = pid;
            }   
        }

        return world;
    });

    return { world, cleanupHandler }
};