import { ICharacter } from "@natewilcox/zelda-battle-shared";
import { IPlayerState } from "@natewilcox/zelda-battle-shared";
import { IGameObject } from "@natewilcox/zelda-battle-shared";
import { IComponent } from "../services/ComponentService";
import ServerService from "../services/ServerService";
import { directionIndex, LinkState } from "@natewilcox/zelda-battle-shared";
import { Link } from "../characters/Link";


/**
 * Componet for character being controlled by server
 */
export default class ServerControlledComponent implements IComponent {


    private player!: Link;
    private scene: Phaser.Scene;
    private serverService: ServerService;
    private remotePlayerState: IPlayerState;
    private lastUpdateTime: number;

    /**
     * Creates componemt with scene and serverservice inputs
     * 
     * @param scene 
     */
    constructor(scene: Phaser.Scene, serverService: ServerService, remotePlayerState: IPlayerState) {
        this.scene = scene;
        this.serverService = serverService;
        this.remotePlayerState = remotePlayerState;
        this.lastUpdateTime = 0;
    }


    /**
     * Initialize component with GameObject
     * 
     * @param go 
     */
    init(go: Phaser.GameObjects.GameObject) {
        this.player = go as Link;
    }
    

    start() {

        //add event handlers to state object
        // TODO - does this even do anything?!
        //this.remotePlayerState.onChange = (changes) => this.playerStateChangeHandler;
    }

    /**
     * 
     * @param t 
     * @param dt 
     */
    update(t: number, dt: number) {

        //if the last update was over 500ms ago, perform a rapid update
        if(t - this.lastUpdateTime > 500) {
            this.player.setPosition(this.remotePlayerState.x, this.remotePlayerState.y);
            this.lastUpdateTime = t;
            return;
        }

        this.lastUpdateTime = t;

        const dir = directionIndex[this.remotePlayerState.dir];
        if(this.remotePlayerState.state == LinkState.Running) {

            //move the player in the direction last updated until told otherwise.
            this.scene.physics.moveTo(this.player, this.remotePlayerState.x, this.remotePlayerState.y, this.player.speed);
            this.player.anims.play(`${this.player.color}-run-${dir}`, true);
        }
        else {

            const delta = (this.player.speed / 1000) * dt;
            let dx = this.remotePlayerState.x - this.player.x
            let dy = this.remotePlayerState.y - this.player.y

            // if the player is close enough to the target position, directly snap the player to that position
            if (Math.abs(dx) < delta) {
                this.player.x = this.remotePlayerState.x;
                dx = 0;
            }

            if (Math.abs(dy) < delta) {
                this.player.y = this.remotePlayerState.y;
                dy = 0;
            }

            //if arrived at target position, move to standing
            if(dx == 0 && dy == 0) {
                this.player.anims.play(`${this.player.color}-stand-${dir}`, true);
                this.player.setVelocity(0, 0);
            }
            else {

                //make small adjustments to target position
                this.player.dir.setTo(dx, dy).normalize().scale(this.player.speed);
                this.player.setVelocity(this.player.dir.x, this.player.dir.y);
            }
        }
    }

    private playerStateChangeHandler = (changes) => {

        //
        changes.forEach(change => {

        });
    }


}
