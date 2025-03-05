import { directionLookupMap } from "@natewilcox/zelda-battle-shared";
import { IPlayerState } from "@natewilcox/zelda-battle-shared";
import { Link } from "../characters/Link";
import { IComponent } from "../services/ComponentService";
import ServerService from "../services/ServerService";


/**
 * Componet for pushing state changes to server
 */
export default class PatchServerStateComponent implements IComponent {


    private link!: Link;

    private patchRate: number;
    private playerState: IPlayerState;
    private serverService: ServerService;

    private timer: number = 0;

    /**
     * Creates componemt with scene input reference
     * 
     * @param patchRate 
     * @param playerState 
     * @param serverService 
     */
    constructor(patchRate: number, playerState: IPlayerState, serverService: ServerService) {

        this.patchRate = 1000 / patchRate;
        this.playerState = playerState;
        this.serverService = serverService;
    }


    /**
     * Initialize component with GameObject
     * 
     * @param go 
     */
    init(go: Phaser.GameObjects.GameObject) {
        this.link = go as Link;
    }
    

    /**
     * Pushes changes to the player state to the server.
     * 
     * @param dt 
     * @param t 
     */
    update(dt: number, t: number) {

        //check if the patch rate timer has been met before patching server state
        this.timer += t;
        if(this.timer < this.patchRate) return;

        //reset the timer and send patch info to the server
        this.timer = 0;

        //create patch of what changed and send to server
        const patch: any = this.createDiffPatch();
        this.serverService.patchPlayerState(patch);
    }


    /**
     * Creates an object with only properties that have changed from server state.
     * 
     * @returns 
     */
    private createDiffPatch() {

        const patch: any = {};

        const parts = this.link.anims.currentAnim.key.split('-');
        const dir = directionLookupMap.get(parts[2]);

        //patch player and local sprite states to server
        if(this.playerState.x !== this.link.x) patch.x = this.link.x;
        if(this.playerState.y !== this.link.y) patch.y = this.link.y;
        if(this.playerState.dir !== dir) patch.d = dir;
        if(this.playerState.state !== this.link.linkState) patch.ls = this.link.linkState;
        if(this.playerState.speed !== this.link.speed) patch.s = this.link.speed;
        if(this.playerState.curLandType !== this.link.curLandType) patch.t = this.link.curLandType;
        if(this.playerState.isHiding !== this.link.isHiding) patch.h = this.link.isHiding;


        return patch;
    }
}
