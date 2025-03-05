import { Direction, directionIndex, directionLookupMap, GameTextures, LinkState, MapTextures, textureLookupMap, texturesIndex, WeaponType, weaponTypeIndex, weaponTypeLookupMap } from "@natewilcox/zelda-battle-shared";
import ServerService from "../services/ServerService";
import Character from "./Character";
import { SceneEvents } from "../events/SceneEvents";
import { IPlayerState } from "@natewilcox/zelda-battle-shared";
import { LandType } from "@natewilcox/zelda-battle-shared";
import { getWeaponType, getWeaponTypeByTextid, talkingDialog, weaponFactory } from "../utils/Utils";
import { IWeapon } from "../weapons/IWeapon";
import { RemoteBomb } from "../weapons/Bomb";
import { getRandomNumber } from "@natewilcox/zelda-battle-shared";
import { BlueShield } from "../weapons/Shield";

/**
 * Main class for Players.
 * Builds an object to represent each link on screen.
 * Local links will be controlled by client.
 * Remote links will be controlled across network.
 */
export class Link extends Character {

    linkState: LinkState;
    
    //references to server state and service
    //serverService!: ServerService;
    serverPlayerState!: IPlayerState;

    //event emitter
    events: Phaser.Events.EventEmitter;

    //internal state objects
    private lastAnimationMap: Map<string, string>;
    private direction = new Phaser.Math.Vector2();

    //link sprite objects and settings
    color: string = 'blue'; //TODO refactor to better name
    linkSprite!: Phaser.GameObjects.Sprite;
    shadowSprite?: Phaser.GameObjects.Image;

    oraSprite?: Phaser.GameObjects.Sprite;
    landTypeSprite?: Phaser.GameObjects.Sprite;
    magicShieldSprite?: Phaser.Physics.Arcade.Sprite;
    shieldSprite?: Phaser.GameObjects.Sprite;

    effects: Phaser.GameObjects.Group;

    private linkSpriteOffsetX = 0;
    private linkSpriteOffsetY = 8;

    hasControl = true;
    isVisible = true;
    hasOra = false;
    hasShadow = true;
    inWater = false;
    isHiding = false;

    curLandType: LandType = LandType.Grass;

    //weapon slots
    activeWeapon?: IWeapon;
    weaponSlotOne?: IWeapon;
    weaponSlotTwo?: IWeapon;

    placedBomb = false;
    placedBombId?;

    private lastAttack1: LinkState = LinkState.Attack1Alt;
    private lastAttack2: LinkState = LinkState.Attack2Alt;

    //frozen emiiter
    private frozenParticle: any;
    private freezeEmitter: any;

    get anims() {
        return this.linkSprite.anims;
    }

    constructor(scene: Phaser.Scene, playerState: IPlayerState) {
        super(scene, playerState.x, playerState.y);

        this.id = playerState.id;
        this._health = playerState.health;
        this.magic = playerState.magic;
        this.maxMagic = playerState.maxMagic;
        this.rupees = playerState.rupees;
        this.arrows = playerState.arrows;
        this.bombs = playerState.bombs;
        this.keys = playerState.keys;

        this.effects = scene.add.group({
            classType: Phaser.GameObjects.Sprite
        });

        this.events = new Phaser.Events.EventEmitter();
        this.linkState = LinkState.Standing;

        this.stateMachine
        .addState("walking", {
            onUpdate: this.onWalkingUpdate
        })
        .addState("attacking", {
            onEnter: this.onAttackEnter
        })
        .addState('collect-item', {
            onEnter: this.onCollectItemEnter,
        })
        .addState('hurt', {
            onEnter: this.onHurtEnter,
            onUpdate: this.onHurtUpdate,
            onExit: this.onHurtExit
        })
        .addState('shocked', {
            onEnter: this.onShockedEnter
        })
        .addState('frozen', {
            onEnter: this.onFrozenEnter,
            onExit: this.onFrozenExit
        })
        .addState('burned', {
            onEnter: this.onBurnedEnter
        })
        .addState('dead', {
            onEnter: this.onDeadEnter
        })
        .addState('sleep', {
            onEnter: this.onSleepEnter
        })
        .addState('awake', {
            onEnter: this.onAwakeEnter
        });

        this.lastAnimationMap = new Map<string, string>();

        this.linkSprite = scene.add.sprite(this.linkSpriteOffsetX, this.linkSpriteOffsetY, 'greenlink');
        this.add(this.linkSprite);

        //add physical body to container
        this.width = 16;
        this.height = 16;
        this.speed = playerState.speed;

        //scene.physics.add.existing(this);
        scene.physics.world.enable(this);
        (this.body as any).pushable = false;

        //create a shadow for link
        this.showShadow(playerState.hasShadow);

        this.stateMachine.setState("walking");
    }

    setCurLandType(landType: LandType) {

        //set the type if different.
        if(landType != this.curLandType) {

            //show shadow when on grass, and unhide when changing types
            this.showShadow(landType == LandType.Grass);
            this.unHide();

            //if changing away from tall grass, remove the handler
            if(this.curLandType == LandType.TallGrass) {
                this.events.off('onmove', this.onMovingInGrassHandler);
                this.events.off('onstop', this.onStoppingInGrassHandler);
            }

            this.curLandType = landType;

            switch(landType) {
                
                case LandType.Grass:
                    this.speed = 100;

                    if(this.landTypeSprite !== undefined) {
                        this.landTypeSprite.destroy();
                        this.landTypeSprite = undefined;
                    }
                    
                    break;

                case LandType.TallGrass:
                    this.speed = 80;

                    if(this.landTypeSprite == undefined) {
                        this.landTypeSprite = this.scene.add.sprite(0, 4, 'effects');
                        this.add(this.landTypeSprite);      

                        //when the player moves, we need to play the moving grass animation
                        this.events.on('onmove', this.onMovingInGrassHandler);
                        this.events.on('onstop', this.onStoppingInGrassHandler);
                    }
                    break;

                case LandType.ShallowWater:
                    this.speed = 70;

                    if(this.landTypeSprite == undefined) {
                        this.landTypeSprite = this.scene.add.sprite(0, 4, 'effects');
                        this.add(this.landTypeSprite);
                    }

                    this.landTypeSprite.anims.play('wake', true);
                    break;
            }
        }
    }

    private onMovingInGrassHandler = () => {

        if(!this.isHiding && this.landTypeSprite !== undefined) {
            this.landTypeSprite.anims.play('grass-moving', true);
        }
    };

    private onStoppingInGrassHandler = () => {

        if(!this.isHiding && this.landTypeSprite !== undefined) {
            this.landTypeSprite.anims.play('grass-standing', true);
        }
    };


    /**
     * Attempts to set velocity.
     * If control flag is false, the object wont move
     * 
     * @param x 
     * @param y 
     */
    setVelocity(x: number, y: number) {

        if(this.hasControl) {
            this.body!.velocity.x = x;
            this.body!.velocity.y = y;
        }
        else {
            this.body!.velocity.x = 0;
            this.body!.velocity.y = 0;
        }

        if(x != 0 || y != 0) {
            this.events.emit('onmove');
        }
        else {
            this.events.emit('onstop');
        }
    }
    
    playEffect = (x: number, y: number, texture: string, animation: string, ignoreIfPlaying: boolean, playOnTop: boolean, removeOnComplete: boolean) => {

        //create an effect sprite and add to container
        const effectSprite = this.effects.get(x + this.linkSpriteOffsetX, y + this.linkSpriteOffsetY, texture) as Phaser.GameObjects.Sprite;


        effectSprite.setAlpha(this.linkSprite.alpha);
        this.add(effectSprite);

        //if this isnt supposed to play on top, bring link to top
        if(!playOnTop) {
            this.bringToTop(this.linkSprite);

            //if there is a terrain sprite, bring that top 
            if(this.landTypeSprite) {
                this.bringToTop(this.landTypeSprite);
            }
        }

        //play the animation and remove when done.
        effectSprite.anims.play(animation, ignoreIfPlaying);

        if(removeOnComplete) {
            effectSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + animation, () => {

                effectSprite.destroy();
                this.effects.killAndHide(effectSprite);
            });
        }

        return effectSprite;
    };


    attack1() {
        
        //cannot attack when not in control
        if(!this.hasControl) return;

        //cannot attack from hiding state
        if(this.isHiding) return;

        if(this.weaponSlotOne && !this.stateMachine.isCurrentState("attacking")) {

            this.linkState = this.lastAttack1 === LinkState.Attack1 ? LinkState.Attack1Alt : LinkState.Attack1;
            this.lastAttack1 = this.linkState;

            this.activeWeapon = this.weaponSlotOne;

            //check weapon type before attacking
            if(this.activeWeapon.weaponType != WeaponType.None) {
                this.stateMachine.setState("attacking", { slot: 1 });
            }
            else {
                this.activeWeapon.update(undefined, undefined, 1);
            }
        }
    }

    attack2() {

        //cannot attack when not in control
        if(!this.hasControl) return;

        //cannot attack from hiding state
        if(this.isHiding) return;

        if(this.weaponSlotTwo && !this.stateMachine.isCurrentState("attacking")) {
        
            this.linkState = this.lastAttack2 === LinkState.Attack2 ? LinkState.Attack2Alt : LinkState.Attack2;
            this.lastAttack2 = this.linkState;

            this.activeWeapon = this.weaponSlotTwo;
            
            //check weapon type before attacking
            if(this.activeWeapon.weaponType != WeaponType.None) {
                this.stateMachine.setState("attacking", { slot: 2 });
            }
            else {
                this.activeWeapon.update(undefined, undefined, 2);
            }
        }
    }

    addShield(shieldObject: any) {
        
        if(shieldObject instanceof BlueShield) {

            const texture = texturesIndex[shieldObject.textId];
            if(texture == null) return;

            this.removeShield();

            //const shieldAnim = `${texture}-south`;
            this.shieldSprite = this.effects.get(-5, 2, texture) as Phaser.GameObjects.Sprite;
            //shieldSprite.anims.play(shieldAnim, true);

            this.shieldSprite.setAlpha(this.linkSprite.alpha);
            this.shieldSprite.anims.play('blue-shield-stand-south', true);
            this.add(this.shieldSprite);

            //update shield when link updates
            this.linkSprite.on(Phaser.Animations.Events.ANIMATION_START, (a, f) => shieldObject.start(a, f, 1, this.shieldSprite));
        }
    }

    removeShield() {

        if(this.shieldSprite != undefined) {

            this.effects.killAndHide(this.shieldSprite);
            this.shieldSprite.destroy();

            this.linkSprite.off(Phaser.Animations.Events.ANIMATION_START);
        }
    }

    collectItem(textId: GameTextures, slot?: number) {

        const texture = texturesIndex[textId];
        if(!texture) {

            if(slot == 1) {

                if(this.weaponSlotOne?.weaponType == WeaponType.Shield) {
                    this.removeShield();
                }

                this.weaponSlotOne = undefined;
            }

            if(slot == 2) {

                if(this.weaponSlotTwo?.weaponType == WeaponType.Shield) {
                    this.removeShield();
                }

                this.weaponSlotTwo = undefined;
            }

            SceneEvents.emit('oninventorychanged', this);
            return;
        }

        this.stateMachine.setState("collect-item", {
            textId: textId,
            slot: slot
        });

        SceneEvents.emit('oninventorychanged', this);
    }

    takeDamage(x: number, y: number) {

        //change to hurt state, which will fling the character based on point of contact
        this.stateMachine.setState('hurt', {
            x: x,
            y: y,
            speed: 200
        });
    }

    reset() {
        this.setVelocity(0, 0);
        this.playFrozen(false);

        this.scene.time.delayedCall(100, () => {
            this.setPosition(this.serverPlayerState.x, this.serverPlayerState.y);
            this.stateMachine.setState('walking');
        });
    }

    zapped() {
        this.stateMachine.setState('shocked');
    }

    freeze() {
        this.stateMachine.setState('frozen');
    }

    burn(first: boolean) {
        
        if(first) {
            this.scene.playFireFlash(this.x, this.y);
        }
        else {
            this.playEffect(getRandomNumber(-5, 5), getRandomNumber(-11, 5), 'bullets', 'fireball-contact', true, true, true);
        }
    }

    die() {

        //change to dead state, which will cause the character to fall down
        this.stateMachine.setState('dead');
    }

    sleep() {
        this.stateMachine.setState('sleep');
    }

    awake() {
        this.stateMachine.setState('awake');
    }

    vanish(hasGhost: boolean) {

        if(!this.isVisible) return;
     
        //hide link and shadow
        if(hasGhost) {
            this.linkSprite.setAlpha(0.25);
        }
        else {
            this.linkSprite.setVisible(false);
        }
        
        this.shadowSprite?.setVisible(false);
        this.oraSprite?.setVisible(false);

        this.scene.playEffect(this.x, this.y, 'effects', 'poof');
        this.isVisible = false;
    }

    reappear() {
        
        if(this.isVisible) return;

        //show link and shadow sprite
        this.linkSprite.setAlpha(1);
        this.linkSprite.setVisible(true);
        this.shadowSprite?.setVisible(true);
        this.oraSprite?.setVisible(true);

        this.scene.playEffect(this.x, this.y, 'effects', 'poof');
        this.isVisible = true;
    }

    createMagicShield(create: boolean) {

        if(this.magicShieldSprite) {
            this.magicShieldSprite.destroy();
        }

        if(create) {

            const parts = this.anims.currentAnim!.key.split("-");
            const dir = parts[2] != undefined ? parts[2] : 'south';
            const dirId = directionLookupMap.get(dir);

            this.magicShieldSprite = this.scene.physics.add.sprite(0, -3, 'effects') as Phaser.Physics.Arcade.Sprite;
            this.magicShieldSprite.anims.play('magic-spark');
            this.magicShieldSprite.setAngularVelocity(800);
            this.add(this.magicShieldSprite);

            if(dirId == Direction.South) this.magicShieldSprite.setAngle(0);
            else if(dirId == Direction.West) this.magicShieldSprite.setAngle(90);
            else if(dirId == Direction.North) this.magicShieldSprite.setAngle(180);
            else if(dirId == Direction.East) this.magicShieldSprite.setAngle(270);

        }
    }

    showOra(show: boolean) {
        this.hasOra = show;

        if(show) {

            //create an ora sprite if not already created
            if(this.oraSprite == undefined) {

                this.oraSprite = this.scene.add.sprite(0, -3, 'ora');
                this.oraSprite.anims.play('ora', true);

                //add sprite to container and order
                this.add(this.oraSprite);
            }
        }
        else {

            //if there is an ora sprite, destroy it
            if(this.oraSprite != undefined) {

                this.oraSprite.destroy();
                this.oraSprite = undefined;
            }
        }
    }

    showShadow(show: boolean) {
        this.hasShadow = show;

        if(show) {

            //create an shadow sprite if not already created
            if(this.shadowSprite == undefined) {

                this.shadowSprite = this.scene.add.image(0, 5, 'shadow');
                this.shadowSprite.setDepth(0);

                //add shadow and bring link on top of it
                this.add(this.shadowSprite);
                this.bringToTop(this.linkSprite);
            }
        }
        else {

            //if there is an ora sprite, destroy it
            if(this.shadowSprite != undefined) {

                this.shadowSprite.destroy();
                this.shadowSprite = undefined;
            }
        }
    }

    checkAreaAtFeet() {

        const groundLayer = this.scene.map.getLayer("Ground Layer")!.tilemapLayer;
        const parts = this.anims.currentAnim!.key.split("-");
        const dir = parts[2] != undefined ? parts[2] : 'south';
        const dirId = directionLookupMap.get(dir);

        switch(dirId) {
            case Direction.North:

                const tileNW = groundLayer.getTileAtWorldXY(this.x-4, this.y-9);
                const tileNE = groundLayer.getTileAtWorldXY(this.x+4, this.y-9);

                if(tileNW.properties.idx == 3 && tileNE.properties.idx == 4) {
                    this.interactWithMap(tileNW.properties.texture, tileNW.x, tileNW.y-1);
                }

                break;

            case Direction.South:

                const tileSW = groundLayer.getTileAtWorldXY(this.x-4, this.y+9);
                const tileSE = groundLayer.getTileAtWorldXY(this.x+4, this.y+9);

                if(tileSW.properties.idx == 1 && tileSE.properties.idx == 2) {
                    this.interactWithMap(tileSW.properties.texture, tileSW.x, tileSW.y);
                }

                break;

            case Direction.East:

                const tileEN = groundLayer.getTileAtWorldXY(this.x+9, this.y-4);
                const tileES = groundLayer.getTileAtWorldXY(this.x+9, this.y+4);

                if(tileEN.properties.idx == 1 && tileES.properties.idx == 3) {
                    this.interactWithMap(tileEN.properties.texture, tileEN.x, tileEN.y);
                }

                break;

            case Direction.West:

                const tileWN = groundLayer.getTileAtWorldXY(this.x-9, this.y-4);
                const tileWS = groundLayer.getTileAtWorldXY(this.x-9, this.y+4);

                if(tileWN.properties.idx == 2 && tileWS.properties.idx == 4) {
                    
                    this.interactWithMap(tileWN.properties.texture, tileWN.x-1, tileWN.y);
                }

                break;
        }
    }

    interactWithMap(texture: MapTextures, x: number, y: number) {

        switch(texture) {

            case MapTextures.Bush:
                console.log("TODO: pickup bush");
                break;

            case MapTextures.ClosedChest:
                this.serverService.tryOpenDynamicChest(x, y);
                break;

            case MapTextures.Rock:
                console.log("TODO: pickup rock");
                break;
        }
    }

    action() {

        this.checkAreaAtFeet();
    }

    bomb() {

        if(!this.placedBomb) {

            if(this.bombs > 0) {

                this.placedBomb = true;
                this.serverService.tryPlaceBomb(this.x, this.y);
            }
        }
        else if(this.placedBomb && this.placedBombId != undefined) {
           
            const bomb = this.scene.bombs.getChildren().find(b => (b as RemoteBomb).id == this.placedBombId) as RemoteBomb;

            if(bomb) {
                this.serverService.tryDetonateBomb(bomb);
            }
        }
    }

    hide() {

        //return if state already matches
        if(this.isHiding) return;
      
        //if there is a landtype you can hide in, then hide
        if(this.curLandType === LandType.TallGrass) {

            //mark as hiding and prevent movement while hiding
            //TODO need to prevent moving while hiding
            this.isHiding = true;

            if(this.landTypeSprite) {

                //when wiggling is done, hide link
                this.landTypeSprite.anims.play('grass-wiggling', true);
                this.landTypeSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'grass-wiggling', () => {

                    //hide links and play effect
                    this.linkSprite.setVisible(false);
                    this.scene.playEffect(this.x, this.y, 'effects', 'leafs-falling');
                });
            }
        }
        else if(this.curLandType === LandType.ShallowWater) {

            //mark as hiding and prevent movement while hiding
            //TODO need to prevent moving while hiding
            this.isHiding = true;

            if(this.landTypeSprite) {

                //hide links and play effect
                this.linkSprite.setVisible(false);
                this.landTypeSprite.setVisible(false);
                this.scene.playEffect(this.x, this.y, 'effects', 'splash');
            }
        }
    }


    unHide() {

        //return if state already matches
        if(!this.isHiding) return;
       
        if(this.curLandType === LandType.TallGrass) {
       
            //mark as hiding and prevent movement while hiding
            //TODO need to prevent moving while hiding
            this.isHiding = false;
          
            if(this.landTypeSprite) {
              
                //play effects of hiding
                this.linkSprite.setVisible(true);
                this.landTypeSprite.anims.play('grass-standing', true);
                this.scene.playEffect(this.x, this.y, 'effects', 'leafs-falling');
            }
        }
        else if(this.curLandType === LandType.ShallowWater) {

            //mark as hiding and prevent movement while hiding
            //TODO need to prevent moving while hiding
            this.isHiding = false;

            if(this.landTypeSprite) {

                //play effects of revealing
                this.linkSprite.setVisible(true);
                this.landTypeSprite.setVisible(true);
                this.landTypeSprite.anims.play('wake-ripple', true);
                this.scene.playEffect(this.x, this.y, 'effects', 'splash');
            }
        }
    }


    walkTo(x: number, y: number) {

    }


    update(dt) {
        this.stateMachine.update(dt);
    }

    playRunning(dir: string) {
        this.anims.play(`${this.color}-run-${dir}`, true);
    }


    playAttack(textId: GameTextures, dirId: Direction, onStart?: () => void, onUpdate?: (anim: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => void, onEnd?: () => void) {

        const texture = texturesIndex[textId];
        const dir = directionIndex[dirId];
        let weaponTypeId = getWeaponTypeByTextid(textId);

        const weaponType = weaponTypeIndex[weaponTypeId];

        if(texture == null || weaponType == null || dir == null) return;

        const linkAnim = `${this.color}-${weaponType}-${dir}`;
        const weaponAnim = `${texture}-attack-${dir}`;

        //execute the start event when beginngin
        if(onStart) {
            onStart();
        }

        //if there is an update method, use it during the animation
        if(onUpdate) {
            this.linkSprite.once(Phaser.Animations.Events.ANIMATION_START, onUpdate);
            this.linkSprite.on(Phaser.Animations.Events.ANIMATION_UPDATE, onUpdate);
        }

        this.anims.play(linkAnim, false);
        this.playEffect(0, 0, 'weapon', weaponAnim, false, dirId !== Direction.North, true);

        //register callback to remove update method and execute off callback
        this.linkSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + linkAnim, () => {
            this.linkSprite.off(Phaser.Animations.Events.ANIMATION_UPDATE, onUpdate);

            if(onEnd) {
                onEnd();
            }
        });


    }

    playCollectItem(textId: GameTextures, onStart?: () => void, onEnd?: () => void) {

        //play link anim
        const linkAnim = `${this.color}-collect`;
        this.anims.play(linkAnim, true);

        //play weapon effect
        const texture = texturesIndex[textId];
        const effectSprite = this.playEffect(6, -20, texture, `${texture}-item`, false, true, false);

        this.scene.time.delayedCall(500, () => {
            
            this.effects.killAndHide(effectSprite);
            effectSprite.destroy();

            if(onEnd) {
                onEnd();
            }
        })

        //execute the start event when beginngin
        if(onStart) {
            onStart();
        }

    }

    playHurt(dir: string, onStart?: () => void, onEnd?: () => void) {
        
        //this.scene.playFlash(this.x, this.y)
        this.anims.play(`${this.color}-fly-${dir}`, true);
        
        if(onStart) {
            onStart();
        }
    }

    playSleep() {

        this.anims.play(`${this.color}-sleeping`);
    }

    playAwake() {

        this.anims.play(`${this.color}-awake`);
    }

    playShock(onStart?: () => void, onEnd?: () => void) {
        
        if(onStart) {
            onStart();
        }
        const anim = `${this.color}-shock`;
        this.anims.play(anim, true);

        if(onEnd) {
            this.linkSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + anim, () => {
                onEnd();
            });
        }
    }

    playFrozen(freeze: boolean) {
        console.warn("not implemented")
        // if(freeze) {

        //     this.scene.playSparkleFlash(this.x, this.y);
        //     this.linkSprite.anims.pause()
        //     this.linkSprite.setTintFill(0xb1e9f1);
    
        //     this.frozenParticle = this.scene.add.particles('sparkle');
        //     this.freezeEmitter = this.frozenParticle.setDepth(40).createEmitter({
        //         x: this.x,
        //         y: this.y,
        //         emitZone: {
        //             source: new Phaser.Geom.Circle(0, 0, 8),
        //             type: 'random',
        //             quantity: 2
        //         },
        //         scale: { start: 1, end: 0 },
        //         blendMode: 'MULTI',
        //         active: true,
        //         lifespan: 150,
        //         frequency: 500
        //     });

        //     const originalHeight = this.linkSprite.displayOriginY;
        //     const maxHeight = this.linkSprite.displayOriginY + 5;
        //     const bounceHeight = this.linkSprite.displayOriginY + 2;

        //     this.scene.tweens.timeline({
        //         targets: this.linkSprite,
        //         tweens:[
        //             { 
        //                 displayOriginY: { value: maxHeight },
        //                 duration: 100,
        //                 delay: 0
        //             },
        //             { 
        //                 displayOriginY: { value: originalHeight },
        //                 duration: 100,
        //                 delay: 0
        //             },
        //             { 
        //                 displayOriginY: { value: bounceHeight },
        //                 duration: 50,
        //                 delay: 0
        //             },
        //             { 
        //                 displayOriginY: { value: originalHeight },
        //                 duration: 50,
        //                 delay: 0
        //             },
        //         ]
        //     });
        // }
        // else {
        //     this.linkSprite.clearTint()

        //     if(this.frozenParticle) {
        //         this.frozenParticle.destroy();
        //     }
        // }
    }

    playBurned() {

    }


    playDead(onStart?: () => void, onEnd?: () => void) {
        
        this.scene.playFlash(this.x, this.y);
        //this.anims.play(`${this.color}-shock`);
        this.anims.play(`${this.color}-spin`);
        this.anims.chain(`${this.color}-die`);

        //when the player is dead, we dont need the regular sprite shadow anymore
        this.linkSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + `${this.color}-spin`, () => {
            this.showShadow(false);
        });
    }

    private onHurtEnter(config) {

        const dx = this.x - this.serverPlayerState.x;

        if(dx < 0) {
            this.playHurt('west');
        }
        else {
            this.playHurt('east')
        }
    }

    private onHurtUpdate() {

        const dx = this.x - this.serverPlayerState.x;
        const dy = this.y - this.serverPlayerState.y;

        if(Math.abs(dx) < 2 && Math.abs(dy) < 2) {
            this.setPosition(this.serverPlayerState.x, this.serverPlayerState.y);
        }
        else {
            this.scene.physics.moveTo(this!, this.serverPlayerState.x, this.serverPlayerState.y, this.serverPlayerState.speed);
        }
    }

    private onHurtExit() {

        const parts = this.anims.currentAnim!.key.split('-');
        const dir = parts[2] == 'west' ? 'west' : 'east';
        this.anims.play(`${this.color}-stand-${dir}`, true);

        //reset properties
        this.setVelocity(0, 0);

    }

    private onWalkingUpdate(dt) {
       
        const dx = this.dir.x;
        const dy = this.dir.y;

        const mostlyHorizontal = Math.abs(dx) >= Math.abs(dy);
        const pace = this.curLandType == LandType.Grass ? 'run' : 'walk';

        if(dx == 0 && dy == 0) {
            this.linkState = LinkState.Standing;
            const parts = this.anims.currentAnim!.key.split("-");
            const dir = parts[2] != undefined ? parts[2] : 'south';
            this.anims.play(`${this.color}-stand-${dir}`, true);
        }
        else {
            this.linkState = LinkState.Running;
            if(dx < 0 && mostlyHorizontal) {
                this.anims.play(`${this.color}-${pace}-west`, true);
            }
            else  if(dx > 0 && mostlyHorizontal) {
                this.anims.play(`${this.color}-${pace}-east`, true);
            }
            else if(dy < 0) {
                this.anims.play(`${this.color}-${pace}-north`, true);
            }
            else if(dy > 0) {
                this.anims.play(`${this.color}-${pace}-south`, true);
            }
        }

        this.setVelocity(this.dir.x, this.dir.y);
    }

    private onAttackEnter(config) {
        
        //if you dont have an active weapon, return to walking
        if(this.activeWeapon == undefined) {
            this.stateMachine?.setState('walking');
            return;
        }
     
        this.setVelocity(0, 0);
        const parts = this.anims.currentAnim!.key.split("-");
        const dir = parts[2];
        const dirId = directionLookupMap.get(dir);
        
        this.playAttack(this.activeWeapon.textId, dirId!, undefined, 
            this.activeWeapon.update,
            () => {
                this.stateMachine?.setState('walking');
                this.activeWeapon = undefined;
            }
        );
    }


    private onCollectItemEnter(data) {

        const textId = data.textId;
        const slot = data.slot;

        //if the textId is empty, remove slot
        if(textId == null) {

            if(slot == 1) {
                this.weaponSlotOne = undefined;
            }
            else if(slot == 2) {
                this.weaponSlotTwo = undefined;
            }

            this.stateMachine?.setState('walking');
            return;
        }

        const weaponType = getWeaponType(textId);
      
        if(weaponType != WeaponType.Item) {

            let item = weaponFactory(textId, this, this.scene);

            if(item == null) {
                this.stateMachine?.setState('walking');
                return;
            }

            if(slot == 1) {
                this.weaponSlotOne = item;
            }
            else if(slot == 2) {
                this.weaponSlotTwo = item;
            }

            this.setVelocity(0, 0);
            this.linkState = LinkState.Collecting;

            this.playCollectItem(textId, undefined, () => {
                this.stateMachine?.setState('walking');

                //if the item is a shield, do something different
                if(weaponType == WeaponType.Shield) {
                    this.addShield(item);
                }
            });
        }
    }

    private onShockedEnter() {
        
        this.linkState = LinkState.Shocked;

        this.setVelocity(0, 0);
        this.playShock();
    }

    private onFrozenEnter() {
        this.linkState = LinkState.Frozen;

        this.setVelocity(0, 0);
        this.playFrozen(true);
    }

    private onFrozenExit() {
        this.playFrozen(false);
    }

    private onBurnedEnter() {
        this.linkState = LinkState.Burned;
    }

    private onDeadEnter() {
        
        this.linkState = LinkState.Dead;

        this.setVelocity(0, 0);
        this.playDead();
    }

    private onSleepEnter() {
        
        this.linkState = LinkState.Sleeping;

        this.setVelocity(0, 0);
        this.playSleep();
    }

    private onAwakeEnter() {
        
        this.linkState = LinkState.Awake;

        this.setVelocity(0, 0);
        this.playAwake();

        //set to walking state after delay
        this.scene.time.delayedCall(2000, () => this.stateMachine.setState("walking"));
    }
}