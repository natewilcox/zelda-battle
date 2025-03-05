import Phaser from 'phaser'
import { createLinkAtlases } from '../anims/LinkAnims';
import { createEffectsAnims } from '../anims/EffectsAnims';
import { SceneEvents } from '../events/SceneEvents';
import ComponentService from '../services/ComponentService';
import ServerService from '../services/ServerService';
import { createWeaponAnims } from '../anims/WeaponAnims';
import { createItemAnims } from '../anims/ItemAnims';
import { createBulletAnims } from '../anims/BulletAnims';
import { createBombsAnims } from '../anims/BombAnims';
import { getHint, getMapByGameId } from '../utils/Utils';
import { createNPCAnims } from '../anims/NPCAnims';
import { createMapObjectsAnims } from '../anims/MapObjectsAnims';
import { createEnemyAnims } from '../anims/EnemyAnims';
import { ServerMessages } from "@natewilcox/zelda-battle-shared";

/**
 * Bootstrap scene that runs globally and manages sub scenes, such as game, hud, and loading screens.
 */
export default class Bootstrap extends Phaser.Scene {

    //global instances of server and component servers.
    componentService: ComponentService;
    serverService: ServerService


    /**
     * Constructs the bootstrap scene and instantiates services that will be injected into child scenes.
     */
	constructor() {
        super('bootstrap');
    
        this.componentService = new ComponentService();
        this.serverService = new ServerService();
    }


    /**
     * Creates the bootstrap scene and general game objects.
     * Connects scene events for gmaeready
     */
    create() {
   
        //create general game resources
        createLinkAtlases(this);
        createEffectsAnims(this.anims);
        createWeaponAnims(this.anims);
        createItemAnims(this.anims);
        createBulletAnims(this.anims);
        createBombsAnims(this.anims);
        createNPCAnims(this.anims);
        createEnemyAnims(this.anims);
        createMapObjectsAnims(this.anims);

        this.startGame();
    }

    private startGame = () => {

        this.scene.launch('loading', {
            defaultState: 'Firing Up',
            hint: getHint(),
            map: 'overworld1'
        });

        this.scene.launch("game", {
            gameMode: 'overworld1',
            serverService: this.serverService,
            componentService: this.componentService,
            onPlayAgain: this.onPlayAgain,
            onGameError: this.onGameError
        });
        this.scene.launch('hud');

        //when the game emits its ready, stop the loading scene
        SceneEvents.once('ongameready', () => {
            this.scene.stop('loading');
        });
    }

    private onPlayAgain = (gameId: number) => {

        this.scene.stop('game');
        this.scene.stop('hud');

        this.scene.launch('loading', {
            defaultState: 'Reading up...',
            hint: getHint()
        });

        // TODO need to run:
        // this.startGame(gameId);
    }

    private onGameError = () => {
        this.serverService.leave();
        
        //stop game and hud scenes
        this.scene.stop('game');
        this.scene.stop('hud');
        this.scene.start('error', {
            message: 'Error encountered...'
        });
    }
}
