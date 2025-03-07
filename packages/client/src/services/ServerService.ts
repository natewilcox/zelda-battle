import { Client, Room, getStateCallbacks } from "colyseus.js";
import { ServerMessages } from "@natewilcox/zelda-battle-shared";
import { ClientMessages } from "@natewilcox/zelda-battle-shared";
import { IPlayerState } from "@natewilcox/zelda-battle-shared";
import { Link } from "../characters/Link";
import { Direction, GameTextures } from "@natewilcox/zelda-battle-shared";
import { RemoteBomb } from "../weapons/Bomb";
import { IBattleRoyaleRoomState } from "@natewilcox/zelda-battle-shared";
import { GameState } from "@natewilcox/zelda-battle-shared";

/**
 * enum for events that take place on server
 */
export enum ServerEvents {
    OnJoin = 'onjoin',
    OnLeave = 'onleave',
    OnError = 'onerror',
    OnPlayerJoin = 'onplayerjoin',
    OnPlayerLeave = 'onplayerleave',
    ChestOpened = 'onchestopened',
    OnHit = 'onhit',
    OnMessage = 'onmessage',
    OnPlacing = 'onplacing',
    OnSpriteAdded = 'onspriteadded',
    OnSpriteRemoved = 'onspriteremoved',
    OnGameStateChanged = 'ongamestatechanged',
    OnAttack = 'onattack',
    OnArrowShot = 'onarrowshot',
    OnFireballShot = 'onfireballshot',
    OnIceblastShot = 'oniceblastshot',
    OnLightBallShot = 'onlightballshot',
    OnBulletCollision = 'onbulletcollision',
    OnDynamicChestOpened = 'ondynamicchestopened',
    OnBombPlaced = 'onbombplaced',
    OnBlockPlaced = 'onblockplaced',
    OnBombDetonated = 'onbombdetonated',
    OnPong = 'onpong',
    OnTick = 'ontick',
    OnZoneChanged = 'onzonechanged',
    OnCameraBoundsChanged = 'oncameraboundschanged',
    OnFadeOut = 'onfadeout',
    OnFadeIn = 'onfadein',
    OnLighteningShot = 'onlighteningshot',
    OnPlayerReset = 'onplayerreset',
    OnPlayerShocked = 'onplayershocked',
    OnPlayerFreezed = 'onplayerfreezed',
    OnPlayerBurned = 'onplayerburned',
    OnWakeUp = 'onwakeup',
    OnTalk = 'ontalk',
    OnBagContentsChanged = 'onbagcontentschanged',
    OnMovePlayer = 'onmoveplayer',
    OnDisconnected = 'ondisconnected',
    OnLockedDoorOpened = 'onlockeddooropened'
}


/**
 * Service object for listening to server events and sending data to server.
 */
export default class ServerService {

    room!: Room<IBattleRoyaleRoomState>;

    //private reference
    private client!: Client;
    private events: Phaser.Events.EventEmitter;


    /**
     * Gets sessionid of client connected to server
     */
    get sessionId() {
        return this.room.sessionId
    }

    constructor() {

        if(process.env.NODE_ENV === 'development') {
            this.client = new Client('ws://localhost:2567');
        }
        else {
            this.client = new Client('wss://afklha.colyseus.dev:443');
        }

        this.events = new Phaser.Events.EventEmitter();
    }

    async join(handle: string, uid: string, token: string, gameMode: number) {

        const room_name = `room_${gameMode}`;
    
        try {

            //get a reference to the room when joining.
            this.room = await this.client.joinOrCreate<IBattleRoyaleRoomState>(room_name, {
                handle: handle,
                uid: uid,
                token: token,
                gameMode: gameMode
            });

            this.room.onLeave((code) => {
                this.events.emit(ServerEvents.OnLeave, code);
            });

            this.room.onError((code, message) => {
                this.events.emit(ServerEvents.OnError, code, message);
            });

            this.room.onStateChange.once(state => {
                this.events.emit(ServerEvents.OnJoin, state);
            });

            const $ = getStateCallbacks(this.room);

            $(this.room.state).playerStates.onAdd((state, i) => {
                this.events.emit(ServerEvents.OnPlayerJoin, state);
                this.events.emit(ServerEvents.OnGameStateChanged, this.room.state, this.room.state.gameState);
            });

            $(this.room.state).playerStates.onRemove((state, i) => {
                this.events.emit(ServerEvents.OnPlayerLeave, state);
                this.events.emit(ServerEvents.OnGameStateChanged, this.room.state, this.room.state.gameState);
            });

            this.room.onMessage(ServerMessages.PONG, (data) => {
                this.events.emit(ServerEvents.OnPong, data);
            });
            
            this.room.onMessage(ServerMessages.ChestOpened, (id) => {
                this.events.emit(ServerEvents.ChestOpened, id);
            });

            this.room.onMessage(ServerMessages.Hit, (data) => {
                this.events.emit(ServerEvents.OnHit, data);
            });

            this.room.onMessage(ServerMessages.Attack, (data) => {
                this.events.emit(ServerEvents.OnAttack, data);
            });

            this.room.onMessage(ServerMessages.Message, (data) => {
                this.events.emit(ServerEvents.OnMessage, data);
            });

            this.room.onMessage(ServerMessages.Placement, (data) => {
                this.events.emit(ServerEvents.OnPlacing, data);
            });

            this.room.onMessage(ServerMessages.ArrowShot, (data) => {
                this.events.emit(ServerEvents.OnArrowShot, data);
            });

            this.room.onMessage(ServerMessages.FireballShot, (data) => {
                this.events.emit(ServerEvents.OnFireballShot, data);
            });

            this.room.onMessage(ServerMessages.IceblastShot, (data) => {
                this.events.emit(ServerEvents.OnIceblastShot, data);
            });

            this.room.onMessage(ServerMessages.LightBallShot, (data) => {
                this.events.emit(ServerEvents.OnLightBallShot, data);
            });

            this.room.onMessage(ServerMessages.BulletCollision, (data) => {
                this.events.emit(ServerEvents.OnBulletCollision, data);
            });

            this.room.onMessage(ServerMessages.DynamicChestOpened, (data) => {
                this.events.emit(ServerEvents.OnDynamicChestOpened, data);
            });

            this.room.onMessage(ServerMessages.BombPlaced, (data) => {
                this.events.emit(ServerEvents.OnBombPlaced, data);
            });

            this.room.onMessage(ServerMessages.BlockPlaced, (data) => {
                this.events.emit(ServerEvents.OnBlockPlaced, data);
            });

            this.room.onMessage(ServerMessages.BombDetonated, (data) => {
                this.events.emit(ServerEvents.OnBombDetonated, data);
            });

            this.room.onMessage(ServerMessages.SetCameraBounds, (data) => {
                this.events.emit(ServerEvents.OnCameraBoundsChanged, data);
            });

            this.room.onMessage(ServerMessages.FadeIn, (data) => {
                this.events.emit(ServerEvents.OnFadeIn, data);
            });

            this.room.onMessage(ServerMessages.FadeOut, (data) => {
                this.events.emit(ServerEvents.OnFadeOut, data);
            });

            this.room.onMessage(ServerMessages.LighteningShot, (data) => {
                this.events.emit(ServerEvents.OnLighteningShot, data);
            });

            this.room.onMessage(ServerMessages.ResetPlayer, (data) => {
                this.events.emit(ServerEvents.OnPlayerReset, data);
            });

            this.room.onMessage(ServerMessages.ShockPlayer, (data) => {
                this.events.emit(ServerEvents.OnPlayerShocked, data);
            });

            this.room.onMessage(ServerMessages.FreezePlayer, (data) => {
                this.events.emit(ServerEvents.OnPlayerFreezed, data);
            });

            this.room.onMessage(ServerMessages.BurnPlayer, (data) => {
                this.events.emit(ServerEvents.OnPlayerBurned, data);
            });

            this.room.onMessage(ServerMessages.WakePlayerUp, (data) => {
                this.events.emit(ServerEvents.OnWakeUp, data);
            });

            this.room.onMessage(ServerMessages.Talk, (data) => {
                this.events.emit(ServerEvents.OnTalk, data);
            });

            this.room.onMessage(ServerMessages.BagContentsChanged, (data) => {
                this.events.emit(ServerEvents.OnBagContentsChanged, data);
            });

            this.room.onMessage(ServerMessages.MovePlayer, (data) => {
                this.events.emit(ServerEvents.OnMovePlayer, data);
            });

            this.room.onMessage(ServerMessages.Disconnected, (data) => {
                this.events.emit(ServerEvents.OnDisconnected, data);
            });

            this.room.onMessage(ServerMessages.LockedDoorOpened, (data) => {
                this.events.emit(ServerEvents.OnLockedDoorOpened, data);
            });

            $(this.room.state).listen('timer', (cur, prev) => {
                this.events.emit(ServerEvents.OnTick, cur);
            });

            $(this.room.state).listen('gameState', (cur, prev) => {
                this.events.emit(ServerEvents.OnGameStateChanged, this.room.state, cur);
            });

            function debounce(func, delay) {
                let timeout;
                return (...args) => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func(...args), delay);
                };
            }

            // Debounced function to emit the event
            const emitZoneChanged = debounce(() => {
                this.events.emit(ServerEvents.OnZoneChanged, {
                    width: this.room.state.zoneWidth,
                    x: this.room.state.zoneX,
                    y: this.room.state.zoneY
                });
            }, 0);

            $(this.room.state).listen('zoneWidth', (cur, prev) => emitZoneChanged());
            $(this.room.state).listen('zoneX', (cur, prev) => emitZoneChanged());
            $(this.room.state).listen('zoneY', (cur, prev) => emitZoneChanged());
        }
        catch(ex) {
            console.error(`unable to join room '${room_name}'`, ex);
        }
    }

    leave() {

        if(!this.room) return;

        //leave the room and clear all listeners
        this.room.leave();
        this.events.removeAllListeners();
    }

    onJoin(cb: (state: IBattleRoyaleRoomState) => void, context?: any) {
        this.events.once(ServerEvents.OnJoin, cb, context);
    }

    onLeave(cb: (code) => void, context?: any) {
        this.events.once(ServerEvents.OnLeave, cb, context);
    }

    onError(cb: (code, message) => void, context?: any) {
        this.events.once(ServerEvents.OnLeave, cb, context);
    }

    onPlayerJoin(cb: (state: IPlayerState) => void, context?: any) {
        this.events.on(ServerEvents.OnPlayerJoin, cb, context);
    }

    onPlayerLeave(cb: (state: IPlayerState) => void, context?: any) {
        this.events.on(ServerEvents.OnPlayerLeave, cb, context);
    }

    ping(cb: (state: IPlayerState) => void, context?: any) {

        if(!this.room) return;
        
        this.room.send(ClientMessages.PING);
        this.events.once(ServerEvents.OnPong, cb, context);
    }

    getChangeCallbacks() {
        return getStateCallbacks(this.room);
    }

    getSizeInBytes(obj) {
        let str: any = null;
        if (typeof obj === 'string') {
          // If obj is a string, then use it
          str = obj;
        } else {
          // Else, make obj into a string
          str = JSON.stringify(obj);
        }
        // Get the length of the Uint8Array
        const bytes = new TextEncoder().encode(str).length;
        return bytes;
      };

    logSizeInBytes (description, obj) {
        const bytes = this.getSizeInBytes(obj);
        console.log(`${description} is approximately ${bytes} B`);
    };

    logSizeInKilobytes (description, obj) {
        const bytes = this.getSizeInBytes(obj);
        const kb = (bytes / 1000).toFixed(2);
        console.log(`${description} is approximately ${kb} kB`);
    };


    patchPlayerState(patchData: any) {

        if(!this.room) {
            return;
        }

        this.room.send(ClientMessages.PlayerStateUpdated, patchData);
    }

    tryDisconnect() {

        if(!this.room) {
            return;
        }

        this.room.send(ClientMessages.Disconnect);
    }

    tryCollectItem(id: number, who: number, slot?: number) {

        if(!this.room) {
            return;
        }

        this.room.send(ClientMessages.ItemCollected, { id, who, slot });
    }

    tryStoreItem(id: number, who: number) {

        if(!this.room) {
            return;
        }

        this.room.send(ClientMessages.ItemStored, { id, who });
    }

    tryOpenChest(id: number, who: number) {

        if(!this.room) {
            return;
        }

        this.room.send(ClientMessages.ChestOpened, {
            id: id,
            who: who
        });
    }

    tryOpenDynamicChest(x: number, y: number) {

        if(!this.room) {
            return;
        }

        this.room.send(ClientMessages.OpenDynamicChest, { x, y });
    }

    tryHitTargets(weapon: number, x: number, y: number, targets: Link[]) {

        if(!this.room) {
            return;
        }

        const targetList: any = [];
        targets.forEach(t => {
            targetList.push({
                id: t.id, 
                clientId: t.clientId
            });
        });
        
        this.room.send(ClientMessages.HitTarget, { weapon, x, y, targetList });
    }

    tryBreakTile(texture: number, weapon: number, x: number, y: number) {

        if(!this.room) {
            return;
        }

        this.room.send(ClientMessages.BreakTile, {texture, weapon, x, y });
    }

    tryShootArrow(texture: GameTextures, dir: Direction, x: number, y: number) {

        if(!this.room) {
            return;
        }

        this.room.send(ClientMessages.ShootArrow, {t: texture, d: dir, x: x, y: y});
    }

    tryBulletCollision(texture: GameTextures, id: number, x: number, y: number, target: Link) {

        if(!this.room) {
            return;
        }

        this.room.send(ClientMessages.BulletCollision, {t: texture, id: id, x: x, y: y, clientId: target.clientId, playerId: target.id });
    }

    tryPlaceBomb(x: number, y: number) {

        if(!this.room) {
            return;
        }

        this.room.send(ClientMessages.PlaceBomb, { x, y });
    }

    tryDetonateBomb(bomb: RemoteBomb) {

        if(!this.room) {
            return;
        }

        this.room.send(ClientMessages.DetonateBomb, { id: bomb.id, x: bomb.x, y: bomb.y });
    }

    tryUseCape(on: boolean) {

        if(!this.room) {
            return;
        }

        this.room.send(ClientMessages.UseCape, { on });
    }

    tryPlaceBlock(x: number, y: number, dir: Direction) {

        if(!this.room) {
            return;
        }

        this.room.send(ClientMessages.PlaceBlock, { x, y, dir });
    }

    tryShootLightening(x: number, y: number, dir: Direction) {

        if(!this.room) {
            return;
        }

        this.room.send(ClientMessages.ShootLightening, { x, y, dir });
    }

    tryCreateShield(on: boolean) {

        if(!this.room) {
            return;
        }

        this.room.send(ClientMessages.CreateShield, { on });
    }

    tryShootFireball(texture: GameTextures, dir: Direction, x: number, y: number) {

        if(!this.room) {
            return;
        }

        this.room.send(ClientMessages.ShootFireball, {t: texture, d: dir, x: x, y: y});
    }

    tryShootIceblast(texture: GameTextures, dir: Direction, x: number, y: number) {

        if(!this.room) {
            return;
        }

        this.room.send(ClientMessages.ShootIceblast, {t: texture, d: dir, x: x, y: y});
    }

    tryShootLightBall(texture: GameTextures, dir: Direction, x: number, y: number) {

        if(!this.room) {
            return;
        }

        this.room.send(ClientMessages.ShootLightBall, {t: texture, d: dir, x: x, y: y});
    }

    tryTalk(msg: string) {

        if(!this.room) {
            return;
        }

        this.room.send(ClientMessages.Talk, { msg });
    }

    trySwitchWeaponFromBag(slot: number, bagPosition: number) {

        if(!this.room) {
            return;
        }

        this.room.send(ClientMessages.SwitchWeaponFromBag, { slot, bagPosition });
    }

    tryUseGreenPotion(slot: number) {

        if(!this.room) {
            return;
        }

        this.room.send(ClientMessages.UseGreenPotion, { slot });
    }

    tryUseRedPotion(slot: number) {

        if(!this.room) {
            return;
        }

        this.room.send(ClientMessages.UseRedPotion, { slot });
    }

    tryUseBluePotion(slot: number) {

        if(!this.room) {
            return;
        }

        this.room.send(ClientMessages.UseBluePotion, { slot });
    }

    tryOpenLockedDoor(x: number, y: number) {

        if(!this.room) {
            return;
        }

        this.room.send(ClientMessages.OpenLockedDoor, { x, y });
    }

    trySwordAttack(texture: GameTextures, dir: Direction) {

        if(!this.room) {
            return;
        }

        this.room.send(ClientMessages.SwordAttack, { texture, dir });
    }

    onChestOpened(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.ChestOpened, cb, context);
    }

    onHit(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.OnHit, cb, context);
    }

    onAttack(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.OnAttack, cb, context);
    }

    onArrowShot(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.OnArrowShot, cb, context);
    }

    onFireballShot(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.OnFireballShot, cb, context);
    }

    onIceblastShot(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.OnIceblastShot, cb, context);
    }

    onLightBallShot(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.OnLightBallShot, cb, context);
    }

    onBulletCollision(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.OnBulletCollision, cb, context);
    }

    onMessage(cb: (message: any) => void, context?: any) {
        this.events.on(ServerEvents.OnMessage, cb, context);
    }

    onPlacing(cb: (message: any) => void, context?: any) {
        this.events.on(ServerEvents.OnPlacing, cb, context);
    }

    onGameStateChange(cb: (roomState: IBattleRoyaleRoomState, state: GameState) => void, context?: any) {
        this.events.on(ServerEvents.OnGameStateChanged, cb, context);
    }

    onDynamicChestOpened(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.OnDynamicChestOpened, cb, context);
    }

    onBombPlaced(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.OnBombPlaced, cb, context);
    }

    onBlockPlaced(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.OnBlockPlaced, cb, context);
    }

    onBombDetonated(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.OnBombDetonated, cb, context);
    }

    onTick(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.OnTick, cb, context);
    }

    onZoneChanged(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.OnZoneChanged, cb, context);
    }

    onCameraBoundsChanged(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.OnCameraBoundsChanged, cb, context);
    }

    onFadeIn(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.OnFadeIn, cb, context);
    }

    onFadeOut(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.OnFadeOut, cb, context);
    }

    onLighteningShot(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.OnLighteningShot, cb, context);
    }

    onPlayerReset(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.OnPlayerReset, cb, context);
    }

    onPlayerShocked(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.OnPlayerShocked, cb, context);
    }

    onPlayerFrozen(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.OnPlayerFreezed, cb, context);
    }

    onPlayerBurned(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.OnPlayerBurned, cb, context);
    }

    onWakeUp(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.OnWakeUp, cb, context);
    }

    onTalk(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.OnTalk, cb, context);
    }

    onBagContentsChanged(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.OnBagContentsChanged, cb, context);
    }

    onMovePlayer(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.OnMovePlayer, cb, context);
    }

    onLockedDoorOpened(cb: (data: any) => void, context?: any) {
        this.events.on(ServerEvents.OnLockedDoorOpened, cb, context);
    }

    onceDisconnected(cb: (data: any) => void, context?: any) {
        this.events.once(ServerEvents.OnDisconnected, cb, context);
    }
}