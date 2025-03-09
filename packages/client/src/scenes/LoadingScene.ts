import Phaser from 'phaser'
import { SceneEvents } from '../events/SceneEvents';
import { ILoadingSceneConfig } from './Config';

export enum LoadingState {

    Authenticating,
    LoadingResources,
    SearchingMatch,
    JoiningRoom,
    Done
}

/**
 * Scene to display while the game is loading
 */
export default class LoadingScene extends Phaser.Scene {

    //state
    private loadingState: LoadingState = LoadingState.LoadingResources;

    //loading screen objects
    private hintText!: Phaser.GameObjects.BitmapText;
    private spinner1!: Phaser.GameObjects.Sprite;
    private spinner2!: Phaser.GameObjects.Sprite;
    private spinner3!: Phaser.GameObjects.Sprite;
    private loadingStatus!: Phaser.GameObjects.BitmapText;
    
    private config?: ILoadingSceneConfig;

    /**
     * Constructs scene object
     */
	constructor() {
        super('loading');
    }

    init(config: ILoadingSceneConfig) {
        this.config = config;
    }

    /**
     * Creates resources for loading screen objects.
     */
    preload() {
        
        //create loading screen animations
        this.anims.create({
            key: `spinning`, 
            frames: this.anims.generateFrameNames('loading', {start: 94, end: 170, prefix: 'tri-', suffix: '.png'}),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: `done`, 
            frames: [{ key: 'loading', frame: 'tri-171.png' }]
        });

        if(this.config && this.config.map) {

            //destroy all existing maps and load new
            this.cache.tilemap.getKeys().forEach(k => this.cache.tilemap.remove(k));
            this.load.tilemapTiledJSON(this.config.map, `maps/${this.config.map}.json`);    
        }
    }


    /**
     * Creates the loading screen objects.
     */
    async create(config: ILoadingSceneConfig) {

        //draw background
        const background = this.add.image(200, 150, 'loading-background');
        background.displayWidth = this.sys.canvas.width;
        background.displayHeight = this.sys.canvas.height;
        background.setTint(0x444444)

        this.hintText = this.add.bitmapText(10, 10, 'minecraft', config.hint);
        this.hintText.setDropShadow(5, 5);
        this.hintText.setScale(0.3, 0.3);

        this.spinner1 = this.add.sprite(310, 200, 'loading');
        this.spinner1.anims.play('spinning');

        this.spinner2 = this.add.sprite(290, 240, 'loading');
        this.spinner2.anims.play('spinning');

        this.spinner3 = this.add.sprite(330, 240, 'loading');
        this.spinner3.anims.play('spinning');

        this.loadingStatus = this.add.bitmapText(310, 280, 'minecraft', config.defaultState);
        this.loadingStatus.setScale(0.3, 0.3);
        this.loadingStatus.setDropShadow(5, 5);
        this.loadingStatus.setOrigin(0.5);

        // SceneEvents.on('onloadingstatechange', this.handleLoadingStateChange, this);

        // //remove event handlers when scene is shutdown
        // this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
        //     SceneEvents.off('onloadingstatechange', this.handleLoadingStateChange, this);
        // }); 
    }


    /**
     * Handles when loading state has changed in game.
     */
    // private handleLoadingStateChange(newState: LoadingState) {
     
    //     switch(newState) {

    //         case LoadingState.Authenticating: 
    //             this.loadingStatus.setText('Loading User Data');
    //             break;

    //         case LoadingState.LoadingResources: 
    //             this.loadingStatus.setText('Loading Resources');
    //             break;

    //         case LoadingState.LoadingResources: 
    //             this.loadingStatus.setText('Loading Resources');
    //             break;

    //         case LoadingState.SearchingMatch: 
    //             this.loadingStatus.setText('Searching for match');
    //             break;
            
    //         case LoadingState.JoiningRoom: 
    //             this.loadingStatus.setText('Joining server');
    //             break;
            
    //         case LoadingState.Done: 
    //             this.loadingStatus.setText('Get Ready!');
    //             break;
    //     }
    // }
}
