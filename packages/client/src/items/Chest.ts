import { IChestState } from "@natewilcox/zelda-battle-shared";
import GameScene from "../scenes/GameScene";

export enum ChestState {
    Opened,
    Closed
}
export class Chest extends Phaser.Physics.Arcade.Image {

    private _contents: string | null;
    
    id!: number;

    chestState: ChestState;

    constructor(scene: GameScene, state: IChestState, x: number, y: number) {
        super(scene, x+8, y-8, "chest-closed");

        this._contents = null;
        this.chestState = ChestState.Closed;

        //create hooks to listen for changes from server
        // state.onChange = () => {

        //     if(state.opened) {
        //         this.open();
        //     }
        // };

        //add the chest to the chest group and scene
        scene.chests.add(this, true);
    }


    open() {
        this.setTexture("chest-opened");
        this.chestState = ChestState.Opened;

        return this._contents;
    }

    close() {
        this.setTexture("chest-closed");
        this.chestState = ChestState.Closed;
    }

    addContents(contents: string) {
        this._contents = contents;
    }
}