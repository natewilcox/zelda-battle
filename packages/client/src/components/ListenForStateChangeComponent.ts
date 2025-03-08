import { Direction, LinkState } from "@natewilcox/zelda-battle-shared";
import { IPlayerState } from "@natewilcox/zelda-battle-shared";
import { Link } from "../characters/Link";
import { SceneEvents } from "../events/SceneEvents";
import { IComponent } from "../services/ComponentService";
import ServerService from "../services/ServerService";
import { animateTileObject, updateHouseRoof, weaponFactory } from "../utils/Utils";
import { RemoteBomb } from "../weapons/Bomb";
import { Bullet } from "../weapons/Bullet";
import { IBow } from "../weapons/IBow";
import { FireRod, IceRod, LightRod } from "../weapons/Rod";


/**
 * Componet for listening for changes on the server
 */
export default class ListenForStateChangeComponent implements IComponent {

    private serverControlled = false;

    private link!: Link;
    private playerState: IPlayerState;
    private serverService: ServerService;

    /**
     * Creates componemt that will listen for changes on the server
     * 
     * @param playerState 
     */
    constructor(playerState: IPlayerState, serverService: ServerService) {

        this.playerState = playerState;
        this.serverService = serverService;
        
        //handlers for server events.
        this.serverService.onHit(this.handleHit);
        this.serverService.onArrowShot(this.handleArrowShot);
        this.serverService.onFireballShot(this.handleFireballShot);
        this.serverService.onIceblastShot(this.handleIceblastShot);
        this.serverService.onLightBallShot(this.handleLightBallShot);
        this.serverService.onBulletCollision(this.handleBulletCollision);
        this.serverService.onDynamicChestOpened(this.handleDynamicChestOpened);
        this.serverService.onBombPlaced(this.handleBombPlaced);
        this.serverService.onBlockPlaced(this.handleBlockPlaced)
        this.serverService.onBombDetonated(this.handleBombDetonated);
        this.serverService.onLighteningShot(this.handleLighteningShot);
        this.serverService.onPlayerReset(this.handlePlayerReset);
        this.serverService.onPlayerShocked(this.handlePlayerShocked);
        this.serverService.onPlayerFrozen(this.handlePlayerFrozen);
        this.serverService.onPlayerBurned(this.handlePlayerBurned);
        this.serverService.onWakeUp(this.handlePlayerWakeUp);
        this.serverService.onMovePlayer(this.handlePlayerMoved);
        this.serverService.onBagContentsChanged(this.handleBagContentsChanged);
        this.serverService.onLockedDoorOpened(this.handleLockedDoorOpened);

        const $ = this.serverService.getChangeCallbacks();

        $(this.playerState).listen('health', (value) => { if(!this.link) return;
            //emit event to update hud
            SceneEvents.emit('onhealthchanged', value);

            //if the health is changed to 0, die....
            if(value <= 0) {
                this.link!.die()
            }
        });

        $(this.playerState).listen('magic', (value) => { if(!this.link) return;
            this.link.magic = value;
                
            //emit event to update hud
            SceneEvents.emit('onmagicchanged', this.link.magic / this.link.maxMagic);
        });

        $(this.playerState).listen('rupees', (value) => { if(!this.link) return;
            this.link.rupees = value;
                
            //emit event to update hud
            SceneEvents.emit('onrupeeschanged', value);
        });

        $(this.playerState).listen('bombs', (value) => { if(!this.link) return;
            this.link.bombs = value;
                
            //emit event to update hud
            SceneEvents.emit('onbombschanged', value);
        });

        $(this.playerState).listen('arrows', (value) => { if(!this.link) return;
            this.link.arrows = value;
                
            //emit event to update hud
            SceneEvents.emit('onarrowschanged', value);
        });

        $(this.playerState).listen('keys', (value) => { if(!this.link) return;
            this.link.keys = value;
                
            //emit event to update hud
            SceneEvents.emit('onkeyschanged', value);
        });

        $(this.playerState).listen('visible', (value) => { if(!this.link) return;
         
            //if the health is changed to 0, die....
            if(value) {
                this.link!.reappear();
            }
            else {
                this.link!.vanish(false);
            }
        });

        $(this.playerState).listen('wearingCape', (value) => { if(!this.link) return;
            //if the health is changed to 0, die....
            if(value) {
                this.link!.vanish(true);
            }
            else {
                this.link!.reappear();
            }
        });

        $(this.playerState).listen('hasMagicShield', (value) => { if(!this.link) return;
            this.link.createMagicShield(value);
        });

        $(this.playerState).listen('hasShadow', (value) => { if(!this.link) return;
            this.link.showShadow(value);
        });

        $(this.playerState).listen('hasOra', (value) => { if(!this.link) return;
            this.link.showOra(value);
        });


        $(this.playerState).listen('hasControl', (value) => { if(!this.link) return;
            this.link.hasControl = value;
        });

        $(this.playerState).listen('alpha', (value) => { if(!this.link) return;
            this.link.setAlpha(value);
        });

        $(this.playerState).listen('maxHealth', (value) => { if(!this.link) return;
            SceneEvents.emit('onmaxhealthchanged', value);
        });

        $(this.playerState).listen('weaponSlot1', (value) => { if(!this.link) return;
            this.link.collectItem(value, 1);
        });

        $(this.playerState).listen('weaponSlot2', (value) => { if(!this.link) return;
            this.link.collectItem(value, 2);
        });

        $(this.playerState).listen('teleport_x', (value) => { if(!this.link) return;
            this.link.setPosition(this.playerState.x, this.playerState.y);
            this.link.sleep();

            const coverLayer = this.link.scene.map.getLayer('Cover Layer').tilemapLayer;
            const firstTile = coverLayer.getTileAtWorldXY(this.link.x, this.link.y);

            updateHouseRoof(this.link.scene, firstTile, coverLayer, true);
        });

        $(this.playerState).listen('teleport_y', (value) => { if(!this.link) return;
            this.link.setPosition(this.playerState.x, this.playerState.y);
            this.link.sleep();

            const coverLayer = this.link.scene.map.getLayer('Cover Layer').tilemapLayer;
            const firstTile = coverLayer.getTileAtWorldXY(this.link.x, this.link.y);

            updateHouseRoof(this.link.scene, firstTile, coverLayer, true);
        });

        $(this.playerState).listen('state', (value, previous) => {
          
            //ignore all state changes for dead players.
            if(this.link?.stateMachine.currentState.name == "dead") {
                return
            }

            if(value == LinkState.Hurt) {
                this.link.takeDamage(0, 0);
            }
            else if(value == LinkState.Dead) {
                this.link.scene.playEffect(this.link.x, this.link.y, 'effects', 'death-poof');
            }
            else if(previous == LinkState.Hurt) {
                this.link.reset()
            }
        });
    }


    /**
     * Initialize component with GameObject
     * 
     * @param go 
     */
    init(go: Phaser.GameObjects.GameObject) {
        this.link = go as Link;
    }

    update(dt: number, t: number) {

        if(this.serverControlled) {

            this.link.scene.physics.moveTo(this.link!, this.playerState.x, this.playerState.y, this.playerState.speed);
  
            // if(state.state == BatState.Idle) {
            //     enemy.setVelocity(0, 0);
            //     enemy.setPosition(state.x, state.y);
            // }
            // else {
            //     scene.physics.moveTo(enemy!, state.x, state.y, state.speed);
            // }
        }
    }


    /**
     * Handles being hit by other players
     * 
     * @param event 
     */
    private handleHit = (event) => {

        this.link.scene.playFlash(this.link.x, this.link.y);
        this.link!.takeDamage(event.x, event.y);
    }


    private handleArrowShot = (event) => {

        //check if i was the one that shot an arrow
        if(event.who !== this.link!.id) return;

        //create a bow and fire it
        const bow = weaponFactory(event.text, this.link, this.link.scene) as IBow;
        bow.fire(event.b, event.dir);
    }

    private handleFireballShot = (event) => {

        //check if i was the one that shot an arrow
        if(event.who !== this.link!.id) return;

        //create a bow and fire it
        const rod = weaponFactory(event.text, this.link, this.link.scene) as FireRod;
        rod.fire(event.x, event.y, event.b, event.dir);
    };

    private handleIceblastShot = (event) => {
        //check if i was the one that shot an arrow
        if(event.who !== this.link!.id) return;

        //create a bow and fire it
        const rod = weaponFactory(event.text, this.link, this.link.scene) as IceRod;
        rod.fire(event.x, event.y, event.b, event.dir);
    };

    private handleLightBallShot = (event) => {
        //check if i was the one that shot an arrow
        if(event.who !== this.link!.id) return;

        //create a bow and fire it
        const rod = weaponFactory(event.text, this.link, this.link.scene) as LightRod;
        rod.fire(event.x, event.y, event.b, event.dir);
    };

    private handleBulletCollision = (event) => {
        

        const bullets = this.link.scene.remoteBullets.getChildren();
        const bullet = bullets.find(b => (b as Bullet).id == event.id) as Bullet;

        if(!bullet) return;

        if(event.remove) {
            //return the bullet back to the group
            this.link.scene.remoteBullets.killAndHide(bullet);
            bullet.destroy();
        }
    }

    private handleDynamicChestOpened = (event) => {
        
        const map = this.link.scene.map;
        const groundLayer = map.getLayer('Ground Layer').tilemapLayer;

        const curTile1 = groundLayer.getTileAt(event.x, event.y);
        const newTile1 = groundLayer.putTileAt(curTile1.index - 2, curTile1.x, curTile1.y, true);
        newTile1.setCollision(true, true, true, true, true);

        const curTile2 = groundLayer.getTileAt(event.x+1, event.y);
        const newTile2 = groundLayer.putTileAt(curTile2.index - 2, curTile2.x, curTile2.y, true);
        newTile2.setCollision(true, true, true, true, true);

        const curTile3 = groundLayer.getTileAt(event.x, event.y+1);
        const newTile3 = groundLayer.putTileAt(curTile3.index - 2, curTile3.x, curTile3.y, true);
        newTile3.setCollision(true, true, true, true, true);

        const curTile4 = groundLayer.getTileAt(event.x+1, event.y+1);
        const newTile4 = groundLayer.putTileAt(curTile4.index - 2, curTile4.x, curTile4.y, true);
        newTile4.setCollision(true, true, true, true, true);
    }

    private handleBombPlaced = (event) => {

        //check if i was the one that placed the bomb
        if(event.who === this.link!.id) {
            this.link.placedBombId = event.id;
        }

        //add bomb image
        this.link.scene.addBomb(event.id, event.x, event.y);
    };

    private handleBlockPlaced = (event) => {

        const map = this.link.scene.map;
        const groundLayer = map.getLayer('Ground Layer').tilemapLayer;

        const groundTile1 = groundLayer.getTileAt(event.x, event.y);
        const overTile1 = groundLayer.putTileAt(258, event.x, event.y, true);
        groundTile1.setCollision(true, true, true, true, true);

        const groundTile2 = groundLayer.getTileAt(event.x+1, event.y);
        const overTile2 = groundLayer.putTileAt(259, event.x+1, event.y, true);
        groundTile2.setCollision(true, true, true, true, true);

        const groundTile3 = groundLayer.getTileAt(event.x, event.y+1);
        const overTile3 = groundLayer.putTileAt(284, event.x, event.y+1, true);
        groundTile3.setCollision(true, true, true, true, true);

        const groundTile4 = groundLayer.getTileAt(event.x+1, event.y+1);
        const overTile4 = groundLayer.putTileAt(285, event.x+1, event.y+1, true);
        groundTile4.setCollision(true, true, true, true, true);

    };

    private handleBombDetonated = (event) => {
        
        //check if i was the one that placed the bomb
        if(event.who === this.link!.id) {
            this.link.placedBombId = undefined;
            this.link.placedBomb = false;
        }

        const bomb = this.link.scene.bombs.getChildren().find((b => (b as RemoteBomb).id == event.id)) as RemoteBomb;
        const bombAnim = 'bomb-explode';

        if(!bomb) return;

        this.link.scene.bombs.killAndHide(bomb);
        bomb.destroy();

        this.link.scene.playEffect(bomb.x, bomb.y, 'effects', 'explosion');
    }


    private handleLighteningShot = (event) => {

        const bolt = this.link.scene.add.sprite(event.x, event.y, 'bullets');
        bolt.anims.play('lighteningbolt-flight');

        bolt.setScale(0);

        switch(event.dir) {
            case Direction.North:
                bolt.setAngle(180);
                break;

            case Direction.South:
                bolt.setAngle(0);
                break;

            case Direction.East:
                bolt.setAngle(-90);
                break;

            case Direction.West:
                bolt.setAngle(90);
                break;
        }

        this.link.scene.tweens.add({
            targets: bolt,
            props: {
                scale: 1
            },
            duration: 30
        })
    };

    private handlePlayerReset = (event) => {
        
        if(event.id !== this.link!.id) return;
        this.link.reset();
        this.link.linkSprite.setTint(undefined);
    };

    private handlePlayerShocked = (event) => {

        if(event.id !== this.link!.id) return;
        this.link.zapped();
    }

    private handlePlayerFrozen = (event) => {

        if(event.id !== this.link!.id) return;
        this.link.freeze();
    }

    private handlePlayerBurned = (event) => {

        if(event.id !== this.link!.id) return;
        this.link.burn(event.first);
    }

    private handlePlayerWakeUp = (event) => {
        if(event.id !== this.link!.id) return;
        this.link.awake();
    }

    private handleBagContentsChanged = (event) => {
        SceneEvents.emit('onbagcontentschanged', event);
    }

    private handlePlayerMoved = (event) => {
        this.link.setPosition(event.x, event.y);
    }

    private handleLockedDoorOpened = (event) => {
        
        const map = this.link.scene.map;
        const groundLayer = map.getLayer('Ground Layer').tilemapLayer;
        const tile = groundLayer.getTileAt(event.x, event.y);
    
        animateTileObject(tile, groundLayer, 400);
    }
}
