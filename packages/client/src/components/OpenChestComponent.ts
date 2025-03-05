import { Link } from "../characters/Link";
import { Chest, ChestState } from "../items/Chest";
import GameScene from "../scenes/GameScene";
import { IComponent } from "../services/ComponentService";
import ServerService from "../services/ServerService";


/**
 * Componet for containing the logic for opening chests
 */
export default class OpenChestComponent implements IComponent {


    private link!: Link;

    private scene: GameScene;
    private serverService: ServerService;

    /**
     * Creates componemt that will open chests
     * 
     * @param playerState 
     */
    constructor(scene: GameScene, serverService: ServerService) {

        this.scene = scene;
        this.serverService = serverService;

        //create handlers for different actions
        this.serverService.onChestOpened(this.handleChestOpened);
    }


    /**
     * Initialize component with GameObject
     * 
     * @param go 
     */
    init(go: Phaser.GameObjects.GameObject) {
        this.link = go as Link;

        
        this.scene.physics.add.collider(this.link, this.scene.chests, this.handleTryOpenChest);
    }


    /**
     * Handler for collision between player and chest objects.
     * 
     * @param obj1 
     * @param obj2 
     */
    private handleTryOpenChest = (obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) => {

        const link = obj1 as Link;
        const chest = obj2 as Chest;

        //try to open the chest if closed.
        if(chest.chestState == ChestState.Closed) {

            //try to open chest and wait for callback
            this.serverService.tryOpenChest(chest.id, link.id);
        }
    }


    /**
     * Handler when the server sends back a message that the chest was opened.
     * Player will collect the contents that came from the server.
     * 
     * @param data 
     * @returns 
     */
    private handleChestOpened = (data) => {
    
        const chest = this.scene.chests.getChildren().find(obj => {
            const c = obj as Chest;
            return c.id === data.id;
        }) as Chest;

        //display the chest as open
        if(!chest) return;
        chest.open();

        //check if i was the one that opened the chest
        if(data.who !== this.link!.id) return;

        this.link!.collectItem(data.contents);
    }
}
