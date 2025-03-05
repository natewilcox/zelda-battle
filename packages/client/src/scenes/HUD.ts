import e from 'express';
import Phaser from 'phaser'
import { IBattleRoyaleRoomState } from '@natewilcox/zelda-battle-shared';
import { texturesIndex } from '@natewilcox/zelda-battle-shared';
import { Link } from '../characters/Link';
import { SceneEvents } from '../events/SceneEvents';
import { ServerEvents } from '../services/ServerService';
import { GameState } from '@natewilcox/zelda-battle-shared';


/**
 * Scene representing the HUD. Resonsible for drawing health, inventory, and message feed to screen.
 */
export default class HUD extends Phaser.Scene {

    private bindingsForm!: Phaser.GameObjects.DOMElement;
    private menuForm!: Phaser.GameObjects.DOMElement;
    private menuOpen = false;

    private talkForm;
    private readyUpForm;

    //groups to hold health and inventory sprites.
    private items!: Phaser.Physics.Arcade.StaticGroup;
    private hearts!: Phaser.GameObjects.Group;
    
    //item related hud objects
    private itemSlots!: Phaser.GameObjects.Group;
    private itemSlot1!: Phaser.Physics.Arcade.Sprite;
    private itemSlot2!: Phaser.Physics.Arcade.Sprite;
    private fullScreen!: Phaser.GameObjects.Image;
    private menu!: Phaser.GameObjects.Image;

    //magic meter
    private magicMeter!: Phaser.GameObjects.Image;
    private magic1!: Phaser.GameObjects.Image;
    private magic2!: Phaser.GameObjects.Image;

    //rupee counter
    private rupeePos = 90;
    private rupeeIcon!: Phaser.GameObjects.Image;
    private rupeeOnesCounter!: Phaser.GameObjects.Image;
    private rupeeTensCounter!: Phaser.GameObjects.Image;
    private rupeeHundredsCounter!: Phaser.GameObjects.Image;

    //rupee counter
    private bombPos = 120;
    private bombIcon!: Phaser.GameObjects.Image;
    private bombOnesCounter!: Phaser.GameObjects.Image;
    private bombTensCounter!: Phaser.GameObjects.Image;
    private bombHundredsCounter!: Phaser.GameObjects.Image;

    //rupee counter
    private arrowPos = 150;
    private arrowIcon!: Phaser.GameObjects.Image;
    private arrowOnesCounter!: Phaser.GameObjects.Image;
    private arrowTensCounter!: Phaser.GameObjects.Image;
    private arrowHundredsCounter!: Phaser.GameObjects.Image;

    //clock counter
    private clockPos = 210;
    private clockIcon!: Phaser.GameObjects.Image;
    private clockMinuteCounter!: Phaser.GameObjects.Image;
    private clockColon!: Phaser.GameObjects.Image;
    private clockSecondsTensCounter!: Phaser.GameObjects.Image;
    private clockSecondsOnesCounter!: Phaser.GameObjects.Image;

    //key counter
    private keyPos = 180;
    private keyIcon!: Phaser.GameObjects.Image;
    private keyOnesCounter!: Phaser.GameObjects.Image;

    //message group and feed list
    private messages!: Phaser.GameObjects.Group;    
    private messageFeed: Phaser.GameObjects.BitmapText[] = [];

    //game state message
    private stateMessage!: Phaser.GameObjects.BitmapText;

    //input message
    private inputMessage!: Phaser.GameObjects.BitmapText;

    /**
     * Creates the hud scene
     */
	constructor() {
        super('hud');
    }

    preload() {
        this.load.html('readyUpForm', 'html/readyUpForm.html');
        this.load.html('menuForm', 'html/menuForm.html');
        this.load.html('bindingsForm', 'html/bindingsForm.html');
        this.load.html('talkForm', 'html/talkForm.html');
    }

    /**
     * Creates the scene.
     * Initializes groups and creates default sprites for HUD.
     * Also adds callbacks to SceneEvents object to response to game events, such as health changing.
     */
    create() {

        this.scale.fullscreenTarget = document.getElementById('gameDiv');

        //initially not visible, but when game is ready, hud will show.
        this.sys.setVisible(false);

        this.hearts = this.add.group({
            classType: Phaser.GameObjects.Image
        });

        this.messageFeed = [];
        this.messages = this.add.group({
            classType: Phaser.GameObjects.BitmapText
        });

        this.itemSlots = this.add.group({
            classType: Phaser.GameObjects.Image
        });

        this.items = this.physics.add.staticGroup({
            classType: Phaser.Physics.Arcade.Sprite
        });

        this.hearts.createMultiple({
            key: 'heart-full',
            setXY: {
                x: 280,
                y: 10,
                stepX: 9
            },
            quantity: 3
        });

        this.itemSlots.createMultiple({
            key: 'item-slot',
            setXY: {
                x: 37,
                y: 20,
                stepX: 25
            },
            quantity: 2
        });


        //add rupee counter to hud
        this.rupeeIcon = this.add.image(this.rupeePos, 10, 'rupee-icon');
        this.rupeeOnesCounter = this.add.image(this.rupeePos+7, 20, '0');
        this.rupeeTensCounter = this.add.image(this.rupeePos, 20, '0');
        this.rupeeHundredsCounter = this.add.image(this.rupeePos-7, 20, '0');

        //add bomb counter to hud
        this.bombIcon = this.add.image(this.bombPos, 10, 'bomb-icon');
        this.bombOnesCounter = this.add.image(this.bombPos+7, 20, '0');
        this.bombTensCounter = this.add.image(this.bombPos, 20, '0');
        this.bombHundredsCounter = this.add.image(this.bombPos-7, 20, '0');

        //add arrow counter to hud
        this.arrowIcon = this.add.image(this.arrowPos, 10, 'arrow-icon');
        this.arrowOnesCounter = this.add.image(this.arrowPos+7, 20, '0');
        this.arrowTensCounter = this.add.image(this.arrowPos, 20, '0');
        this.arrowHundredsCounter = this.add.image(this.arrowPos-7, 20, '0');

        //add clock to hud
        this.clockIcon = this.add.image(this.clockPos, 10, 'clock-icon');
        this.clockMinuteCounter = this.add.image(this.clockPos-7, 20, '0');
        this.clockColon = this.add.image(this.clockPos-2, 21, ':');
        this.clockSecondsTensCounter = this.add.image(this.clockPos+2, 20, '0');
        this.clockSecondsOnesCounter = this.add.image(this.clockPos+9, 20, '0');

        //add key counter to hud
        this.keyIcon = this.add.image(this.keyPos, 10, 'key-icon');
        this.keyOnesCounter = this.add.image(this.keyPos, 20, '0');

        //add magic meter to hud
        this.magicMeter = this.add.image(15, 25, 'magic-meter');
        this.magic1 = this.add.image(15, 42, 'magic-1');
        this.magic1.setOrigin(.5, 1);
        this.magic1.setScale(1, 1)

        this.magic2 = this.add.image(15, 20, 'magic-2');
        this.magic2.setOrigin(.5, 1);
        this.setMagic(0);

        this.fullScreen = this.add.image(392, 8, 'full-screen');
        this.fullScreen.setInteractive({ useHandCursor: true });
        this.fullScreen.on('pointerdown', () => this.toggleFullscreen());

        this.menu = this.add.image(376, 8, 'menu');
        this.menu.setInteractive({ useHandCursor: true });
        this.menu.on('pointerdown', (e) => this.toggleMenu(e));

        this.inputMessage = this.add.bitmapText(200, 170, 'minecraft', '');
        this.inputMessage.setVisible(false);

        SceneEvents.on('ongameready', this.handleGameReady, this);
        
        //handlers for when hud values change
        SceneEvents.on('onhealthchanged', this.onHealthChangeHandler, this);
        SceneEvents.on('onmaxhealthchanged', this.onMaxHealthChangeHandler, this);
        SceneEvents.on('onmagicchanged', this.onMagicChangeHandler, this);
        SceneEvents.on('onrupeeschanged', this.onRupeeChangeHandler, this);
        SceneEvents.on('onbombschanged', this.onBombChangeHandler, this);
        SceneEvents.on('onarrowschanged', this.onArrowChangeHandler, this);
        SceneEvents.on('onkeyschanged', this.onKeysChangeHandler, this);
        SceneEvents.on('oninventorychanged', this.onInventoryChangeHandler, this);
        SceneEvents.on('onbagcontentschanged', this.onBagContentsChangeHandler, this);
        SceneEvents.on('oninputmessagechanged', this.onInputMessageChangeHandler, this);

        SceneEvents.on('onmessage', this.onMessageHandler, this);
        SceneEvents.on('onplacing', this.onPlacingHandler, this);
        SceneEvents.on('ontick', this.onTick, this);
        SceneEvents.on('ontalk', this.onTalk, this);
        SceneEvents.on(ServerEvents.OnGameStateChanged, this.onGameStateChangeHandler, this);

        //remove event handlers when scene is shutdown
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {

            SceneEvents.off('ongameready', this.handleGameReady, this);
            SceneEvents.off('onhealthchanged', this.onHealthChangeHandler, this);
            SceneEvents.off('onmaxhealthchanged', this.onMaxHealthChangeHandler, this);
            SceneEvents.off('onmagicchanged', this.onMagicChangeHandler, this);
            SceneEvents.off('onrupeeschanged', this.onRupeeChangeHandler, this);
            SceneEvents.off('onbombschanged', this.onBombChangeHandler, this);
            SceneEvents.off('onarrowschanged', this.onArrowChangeHandler, this);
            SceneEvents.off('onarrowschanged', this.onKeysChangeHandler, this);
            SceneEvents.off('oninventorychanged', this.onInventoryChangeHandler)
            SceneEvents.off('onbagcontentschanged', this.onBagContentsChangeHandler);
            SceneEvents.off('onmessage', this.onMessageHandler, this);
            SceneEvents.off('oncollect', this.onInventoryChangeHandler, this);
            SceneEvents.off('onplacing', this.onPlacingHandler, this);
            SceneEvents.off('ontick', this.onTick, this);
            SceneEvents.off('ontalk', this.onTalk, this);
            SceneEvents.off(ServerEvents.OnGameStateChanged, this.onGameStateChangeHandler, this);
            SceneEvents.off('oninputmessagechanged', this.onInputMessageChangeHandler, this);
        });  
    }


    /**
     * Sets the amount of magic in the meter
     * 0 - 1
     * 
     * @param amount 
     */
    private setMagic(amount: number) {

        const fullScale = 15;
        const fillScale = fullScale * amount;

        this.magic1.setScale(1, fillScale);

        const top = this.magic1.getTopCenter();
        this.magic2.setPosition(top.x, top.y);

    }


    /**
     * Sets the amount of rupees displayed in the hud
     * 
     * @param amount 
     */
     private setRupee(amount: number) {

        //create 0 padded string based on amount
        const str = ('' + amount).padStart(3, '0');

        this.rupeeHundredsCounter.setTexture(str[0]);
        this.rupeeTensCounter.setTexture(str[1]);
        this.rupeeOnesCounter.setTexture(str[2]);
    }


    /**
     * Sets the amount of bombs displayed in the hud
     * 
     * @param amount 
     */
     private setBombs(amount: number) {

        //create 0 padded string based on amount
        const str = ('' + amount).padStart(3, '0');

        this.bombHundredsCounter.setTexture(str[0]);
        this.bombTensCounter.setTexture(str[1]);
        this.bombOnesCounter.setTexture(str[2]);
    }


    /**
     * Sets the amount of arrows displayed in the hud
     * 
     * @param amount 
     */
     private setArrows(amount: number) {

        //create 0 padded string based on amount
        const str = ('' + amount).padStart(3, '0');

        this.arrowHundredsCounter.setTexture(str[0]);
        this.arrowTensCounter.setTexture(str[1]);
        this.arrowOnesCounter.setTexture(str[2]);
    }

    /**
     * Sets the amount of keys displayed in the hud
     * 
     * @param amount 
     */
     private setKeys(amount: number) {

        //create 0 padded string based on amount
        const str = ('' + amount).padStart(3, '0');
        this.keyOnesCounter.setTexture(str[2]);
    }

    private setClock(time: number) {

        const minutes = Math.floor(time/60);
        const seconds = time - (minutes*60);

        const minuteStr = minutes + '';
        const secondStr = ('' + seconds).padStart(2, '0');

        this.clockMinuteCounter.setTexture(minutes + "");
        this.clockSecondsTensCounter.setTexture(secondStr[0]);
        this.clockSecondsOnesCounter.setTexture(secondStr[1]);
    }


    /**
     * Handler for when game is ready.
     * Make HUD visible.
     */
    private handleGameReady() {

        //when game is ready, we want to make the hud visble
        this.sys.setVisible(true);

        this.menuForm = this.add.dom(600, 160).createFromCache('menuForm') as Phaser.GameObjects.DOMElement;
        this.menuForm.setPerspective(100);
        this.menuForm.setAlpha(0.8);

        this.menuForm.addListener('click');
        this.menuForm.addListener('contextmenu');
        this.menuForm.on('click', (event) => {
            
            if (event.target.id === 'returnToLobbyBtn') {
                SceneEvents.emit('onreturntolobby');
            }

            if(event.target.className.startsWith('slot')) {
                const id = event.target.id.replace('slot', '');
                SceneEvents.emit('onswitchweapon', { slot: 1, bagPosition: id*1});
            }

        });

        this.menuForm.on('contextmenu', (event) => {
            
            if(event.target.className.startsWith('slot')) {
                const id = event.target.id.replace('slot', '');
                SceneEvents.emit('onswitchweapon', { slot: 2, bagPosition: id*1});
            }

        });

        this.bindingsForm = this.add.dom(30, 180).createFromCache('bindingsForm') as Phaser.GameObjects.DOMElement;
        this.bindingsForm.setPerspective(100);
    }

    private setMenuSlot(slotNumber: number, itemName: string) {

        const slot = this.menuForm.getChildByID(`slot${slotNumber}`);
        slot.className = itemName != null ? `slot ${itemName}` : 'slot';
    }


    /**
     * Causes game to enter full screen
     */
    private toggleFullscreen() {

        this.scale.toggleFullscreen();
    }

    private toggleMenu(e) {
        
        if(this.menuOpen) {

            this.tweens.add({
                targets: this.menuForm,
                props: {
                    x: 600
                },
                duration: 300,
                ease: 'Circ'
            })
        }
        else {

            this.tweens.add({
                targets: this.menuForm,
                props: {
                    x: 463
                },
                duration: 300,
                ease: 'Circ'
            })
        }

        this.menuOpen = !this.menuOpen;
    }


     /**
     * Updates the heart containers using the health number passed as an argument.
     * 
     * @param health
     */
    private onHealthChangeHandler(health: number) {

        let h = health/2;
        this.hearts.children.each((go, i) => {

            const heart = go as Phaser.GameObjects.Image;
            heart.setVisible(true);

            if(h >= 1) {
                heart.setTexture('heart-full');
            }
            else if(h == 0.5) {
                heart.setTexture('heart-half');
            }
            else {
                heart.setTexture('heart-empty');
            }

            h--;
        });
    }


    private onMaxHealthChangeHandler(maxHealth: number) {
        
        const currentCount = this.hearts.children.size;
        const newCount = (maxHealth/2) - currentCount;

        for(let i=0;i<newCount;i++) {

            //add a new heart to the hud
            const lastHeart = this.hearts.getLast(true) as Phaser.GameObjects.Image;
            this.hearts.get(lastHeart.x + 9, lastHeart.y, 'heart-empty');
        }
    }


    /**
     * Handler for when magic amount changed.
     * 
     * @param amount 
     */
    private onMagicChangeHandler(amount: number) {
        this.setMagic(amount);
    }


    /**
     * Handler when rupee change event is fired.
     * 
     * @param amount 
     */
     private onRupeeChangeHandler(amount: number) {
        this.setRupee(amount);
    }


    /**
     * Handler when bombs change event is fired.
     * 
     * @param amount 
     */
     private onBombChangeHandler(amount: number) {
        this.setBombs(amount);
    }


    /**
     * Handler when bombs change event is fired.
     * 
     * @param amount 
     */
    private onArrowChangeHandler(amount: number) {
        this.setArrows(amount);
    }

    /**
     * Handler when bombs change event is fired.
     * 
     * @param amount 
     */
    private onKeysChangeHandler(amount: number) {
        this.setKeys(amount);
    }

    /**
     * Updates the item slots on the HUD using the objects referenced by link class instance.
     * 
     * @param link 
     */
    private onInventoryChangeHandler(link: Link) {

        if(link.weaponSlotOne) {

            if(this.itemSlot1) {

                this.items.killAndHide(this.itemSlot1)
                this.itemSlot1.destroy();
            }

            const itemName = texturesIndex[link.weaponSlotOne.textId]
            this.itemSlot1 = this.items.get(37, 27, itemName);
            this.itemSlot1.anims.play(`${itemName}-slot`);
        }
        else {
            if(this.itemSlot1) {
                this.items.killAndHide(this.itemSlot1)
                this.itemSlot1.destroy();
            }
        }

        if(link.weaponSlotTwo) {

            if(this.itemSlot2) {

                this.items.killAndHide(this.itemSlot2)
                this.itemSlot2.destroy();
            }

            const itemName = texturesIndex[link.weaponSlotTwo.textId]
            this.itemSlot2 = this.items.get(62, 27, itemName);
            this.itemSlot2.anims.play(`${itemName}-slot`);
        }
        else {
            if(this.itemSlot2) {
                this.items.killAndHide(this.itemSlot2)
                this.itemSlot2.destroy();
            }
        }
    }


    /**
     * Handler for receiving a new message to add into the message feed.
     * 
     * @param serverMessage 
     */
    private onMessageHandler(serverMessage: string) {
     
        //build message and add to feed
        const message = serverMessage.replace(/ /g, '_');

        const msg = this.messages.get(10, 250, 'minecraft_background', message) as Phaser.GameObjects.BitmapText;

        msg.setText(message);
        msg.setScale(0.2, 0.2);
        msg.setActive(true);
        msg.setVisible(true);

        this.messageFeed.push(msg);

        //print the feed
        this.printMessageFeed();

        this.time.delayedCall(3000, () => {
            const removed = this.messageFeed.shift() as Phaser.GameObjects.BitmapText;
            this.messages.killAndHide(removed);

            //reprint after message is removed
            this.printMessageFeed();
        });
    }


    /**
     * Prints the message feed based on the messages in the Phaser message group.
     */
    private printMessageFeed() {

        let dy = 10;
        let counter = 0;

        for(let i=this.messageFeed.length-1;i>=0;i--) {
            this.messageFeed[i].y = 250 + (dy * counter++);
        }
           
    }


    /**
     * Handles printing the placement on the screen
     */
    private onPlacingHandler(event: any) {

        //create banner and center it
        const placementMessage = event.placement == 1 ? 'You Won' : `You placed #${event.placement}`;
        const placementBanner = this.add.bitmapText(200, 80, 'minecraft', placementMessage);
        placementBanner.setScale(0.8, 0.8)
        placementBanner.setOrigin(0.5);
        placementBanner.setDropShadow(5, 5);

        this.time.delayedCall(500, () => {
            const elimMetric = this.add.bitmapText(200, 130, 'minecraft', `Eliminations: ${event.eliminations}`);
            elimMetric.setScale(0.4, 0.4)
            elimMetric.setOrigin(0.5);
            elimMetric.setDropShadow(5, 5);
        });

        this.time.delayedCall(1000, () => {
            const damageGivenMetric = this.add.bitmapText(200, 160, 'minecraft', `Damage Given: ${event.damageGiven}`);
            damageGivenMetric.setScale(0.4, 0.4)
            damageGivenMetric.setOrigin(0.5);
            damageGivenMetric.setDropShadow(5, 5);
        });

        this.time.delayedCall(1500, () => {
            const damageTakenMetric = this.add.bitmapText(200, 190, 'minecraft', `Damage Taken: ${event.damageTaken}`);
            damageTakenMetric.setScale(0.4, 0.4)
            damageTakenMetric.setOrigin(0.5);
            damageTakenMetric.setDropShadow(5, 5);
        });

        this.time.delayedCall(2000, () => {
            const magicUsedMetric = this.add.bitmapText(200, 220, 'minecraft', `Magic Used: ${event.magicUsed}`);
            magicUsedMetric.setScale(0.4, 0.4)
            magicUsedMetric.setOrigin(0.5);
            magicUsedMetric.setDropShadow(5, 5);
        });

        this.time.delayedCall(3000, () => {

            this.readyUpForm = this.add.dom(200, 150).createFromCache('readyUpForm');
            this.readyUpForm.setPerspective(100);
            this.readyUpForm.addListener('click');
            this.readyUpForm.on('click', async (event) => {

                if (event.target.id === 'playAgainBtn') this.onReadyUp();
                if (event.target.id === 'returnToLobbyBtn') this.onReturnToLobby();
            });
        });
    }

    private onReadyUp = () => {
        SceneEvents.emit('onreadyup');
    };

    private onReturnToLobby = () => {
        SceneEvents.emit('onreturntolobby');
    };


    /**
     * Updates the hud wtih the seconds on time game timer
     * 
     * @param seconds 
     */
    private onTick(seconds: number) {
        this.setClock(seconds);
    }

    private onTalk() {
        
        //this.input.keyboard.enableGlobalCapture();
        this.talkForm = this.add.dom(200, 150).createFromCache('talkForm');
        this.talkForm.setPerspective(100);
        this.talkForm.addListener('keypress');
        this.talkForm.addListener('click');
        this.talkForm.getChildByID('msgBox').focus();
        this.talkForm.getChildByID('msgBox').value = '';
        
        this.talkForm.on('keypress', async (event) => {
            
            if(event.key == 'Enter') {
                const msg = this.talkForm.getChildByID('msgBox').value;

                if(msg) {
                    SceneEvents.emit('ontalking', { msg });
                }

                this.talkForm.destroy();
                SceneEvents.emit('onmenuclosed');
            }
        });

        this.talkForm.on('click', async (event) => {

            if (event.target.id === 'talkBtn') {
                const msg = this.talkForm.getChildByID('msgBox').value;
                
                SceneEvents.emit('ontalking', { msg });
                this.talkForm.destroy();
                SceneEvents.emit('onmenuclosed');
            }
            if (event.target.id === 'cancelBtn') {
                this.talkForm.destroy();
                SceneEvents.emit('onmenuclosed');
            }
        });
    }

    /**
     * Handles updating the state message when game state change events are captured
     * 
     * @param roomState 
     * @param state 
     */
    private onGameStateChangeHandler(roomState: IBattleRoyaleRoomState, state: GameState) {

        //destroy the old message
        if(this.stateMessage) {
            this.stateMessage.destroy();
        }

        //if we are waiting for players, show a message
        if(state == GameState.WaitingForPlayers) {

            const message = `Waiting for players... ${roomState.playerStates.length} of ${roomState.maxPlayers}`;

            //create the message if it doesnt exist. otherwise, just update the text
            this.stateMessage = this.add.bitmapText(200, 220, 'minecraft', message);
            this.stateMessage.setScale(0.3, 0.3);
            this.stateMessage.setOrigin(0.5);
            this.stateMessage.setDropShadow(5, 5);
            
        }
        else if(state === GameState.InProgress) {

            //when the game is in progress, destroy the state message.
            if(this.stateMessage) {
                this.stateMessage.setVisible(false);
                this.stateMessage.setActive(false);
            }
        }
    }

    private onInputMessageChangeHandler = (msg: string | null) => {

        //do nothing when message is already the same
        if(this.inputMessage.text == msg) return;

        if(msg != null) {

            this.inputMessage.setText(msg);
            this.inputMessage.setVisible(true);
            this.inputMessage.setScale(0.2, 0.2);
            this.inputMessage.setOrigin(0.5);
            this.inputMessage.setDropShadow(5, 5);
        }
        else {
            this.inputMessage.setVisible(false);
            this.inputMessage.setText("");
        }
    };

    private onBagContentsChangeHandler = (contents) => {

        for(let i = 0;i<contents.length;i++) {
            this.setMenuSlot(i+1, texturesIndex[contents[i]]);
        }
    }
}
