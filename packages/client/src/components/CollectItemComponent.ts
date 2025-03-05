import { LinkState, WeaponType } from "@natewilcox/zelda-battle-shared";
import { ICollectible } from "@natewilcox/zelda-battle-shared";
import { Link } from "../characters/Link";
import { SceneEvents } from "../events/SceneEvents";
import GameScene from "../scenes/GameScene";
import { IComponent } from "../services/ComponentService";
import ServerService from "../services/ServerService";
import { getWeaponType } from "../utils/Utils";


/**
 * Componet for containing the logic for collecting an item off the ground
 */
export default class CollectItemComponent implements IComponent {

    private link!: Link;
    private scene: GameScene;
    private serverService: ServerService;
    private touchingItem?: ICollectible;
    private touchingStart = 0;
    private startTouch = false;
    private inputMessage = "";
    private isEventSet = false;

    /**
     * Creates componemt that will collect floor loot
     * 
     * @param playerState 
     */
    constructor(scene: GameScene, serverService: ServerService) {

        this.scene = scene;
        this.serverService = serverService;
    }


    /**
     * Initialize component with GameObject
     * 
     * @param go 
     */
    init(go: Phaser.GameObjects.GameObject) {
        this.link = go as Link;
        this.scene.physics.add.overlap(this.link, this.scene.items, this.handleTryCollectItem);
    }


    /**
     * Handler for collision between player and items.
     * 
     * @param obj1 
     * @param obj2 
     */
    private handleTryCollectItem = (obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) => {

        const link = obj1 as Link;
        const item = obj2 as any as ICollectible;

        //skip handling event when item is disabled or link is dead
        if(item.disabled || link.linkState == LinkState.Dead) return;

        const weaponType = getWeaponType(item.itemType);

        //items are auto collected.
        if(weaponType == WeaponType.Item) {

            this.scene.items.killAndHide(obj2);
            obj2.destroy();

            //try to collect the item
            this.serverService.tryCollectItem(item.id, link.id);
        }
        else {

            this.touchingItem = item;
            this.startTouch = true;

            if(!this.isEventSet) {
                this.link.events.on('onslot1', this.assignOne);
                this.link.events.on('onslot2', this.assignTwo);
                this.link.events.on('onstore', this.storeItem);
                this.isEventSet = true;
            }
        }
    }

    private assignOne = () => {

        if(this.touchingItem) {
            this.serverService.tryCollectItem(this.touchingItem.id, this.link.id, 1);
        }
    }

    private assignTwo = () => {

        if(this.touchingItem) {
            this.serverService.tryCollectItem(this.touchingItem.id, this.link.id, 2);
        }
    }

    private storeItem = () => {

        if(this.touchingItem) {
            this.serverService.tryStoreItem(this.touchingItem.id, this.link.id);
        }
    }

    update(t: number, dt: number) {


        //stop early if didnt start touching anything
        if(this.touchingItem == undefined) return;

        if(this.startTouch) {
            
            const msg = `Swap/Store ${this.touchingItem.name}`;

            if(msg != this.inputMessage) {

                SceneEvents.emit('oninputmessagechanged', msg);
                this.inputMessage = msg;
            }
            
            this.startTouch = false;
            this.touchingStart = 0;
        }
        else {
            this.touchingStart += dt;
            if(this.touchingStart > 100) {

                SceneEvents.emit('oninputmessagechanged', null);
                this.touchingItem = undefined;
                this.inputMessage = "";

                if(this.isEventSet) {
                    this.link.events.off('onslot1', this.assignOne);
                    this.link.events.off('onslot2', this.assignTwo);
                    this.link.events.off('onstore', this.storeItem);
                    this.isEventSet = false;
                }
            }
        }
    }
}
