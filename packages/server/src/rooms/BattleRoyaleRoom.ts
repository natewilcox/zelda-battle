import '@geckos.io/phaser-on-nodejs';
import Phaser from 'phaser';
import { Command, Dispatcher } from '@colyseus/command';
import { Room, Client } from 'colyseus';
import { ClientMessages } from '@natewilcox/zelda-battle-shared';
import { OnLeaveCommand } from '../commands/OnLeaveCommand';
import { OnChestOpenedCommand } from '../commands/OnChestOpenedCommand';
import { HitTargetsCommand } from '../commands/HitTargetsCommand';
import { OnPlayerStateChangeCommand } from '../commands/OnPlayerStateChangeCommand';
import { OnItemCollectedCommand } from '../commands/OnItemCollectedCommand';
import { BreakTileCommand } from '../commands/BreakTileCommand';
import { FireBowCommand } from '../commands/FireBowCommand';
import { BulletCollisionCommand } from '../commands/BulletCollisionCommand';
import { OpenDynamicChestCommand } from '../commands/OpenDynamicChestCommand';
import { PlaceBombCommand } from '../commands/PlaceBombCommand';
import { DetonateBombCommand } from '../commands/DetonateBombCommand';
import { UseCapeCommand } from '../commands/UseCapeCommand';
import { ServerMessages } from '@natewilcox/zelda-battle-shared';
import { PlaceBlockCommand } from '../commands/PlaceBlockCommand';
import { ShootLighteningCommand } from '../commands/ShootLighteningCommand';
import { CreateShieldCommand } from '../commands/CreateShieldCommand';
import { ShootFireballCommand } from '../commands/ShootFireballCommand';
import { ShootIceblastCommand } from '../commands/ShootIceblastCommand';
import { ShootLightBallCommand } from '../commands/ShootLightBallCommand';
import { TalkCommand } from '../commands/TalkCommand';
import { StoreItemCommand } from '../commands/StoreItemCommand';
import { SwitchWeaponCommand } from '../commands/SwitchWeaponCommand';
import { UsePotionCommand } from '../commands/UsePotionCommand';
import { GameTextures } from '@natewilcox/zelda-battle-shared';
import { AuditPlayerMovementCommand } from '../commands/AuditPlayerMovementsCommand';
import { NPCAICommand } from '../commands/NPCAICommand';
import { DisconnectCommand } from '../commands/DisconnectCommand';
import { BattleRoyaleRoomState } from './schema/BattleRoyaleRoomState';
import { GameState } from '@natewilcox/zelda-battle-shared';
import { mapFiles } from '../app.config';
import { OpenLockedDoorCommand } from '../commands/OpenLockedDoorCommand';
//import '@geckos.io/phaser-on-nodejs';
//import Phaser from 'phaser';
import { ServerSimulationScene, SimulationEvents } from './simulation/ServerSimulationScenes';
import { SwordAttackCommand } from '../commands/SwordAttackCommand';
import { DestroyEnemyCommand } from '../commands/DestroyEnemyCommand';
import { HurtPlayerCommand } from '../commands/HurtPlayerCommand';
import { DestroyPlayerCommand } from '../commands/DestroyPlayerCommand';

export const gameInputCache = new Map<string, any>();

/**
 * BattleRoyaleRoom class
 * Contains all hooks for receiving data from clients.
 */
export class BattleRoyaleRoom extends Room<BattleRoyaleRoomState> {

  simulation: Phaser.Game;

  minClients: number = 1;
  joinCommand!: any;
  startCommand!: Command<BattleRoyaleRoom, any>;

  //drop rates
  itemDropRate: any[][] = [];
  weaponDropRate: any[][] = [];
  floorDropRate: any[][] = [];

  //dispatcher for commands from clients
  dispatcher: Dispatcher<BattleRoyaleRoom> = new Dispatcher(this);
  state = new BattleRoyaleRoomState(10, 'overworld1', '');

  private gameTicker = () => {

    //tick down to zero
    if(this.state && this.state.timer - 1 >= 0) {
      this._events.emit('ontick', --this.state.timer);
    }
    else {
      this._events.emit('ontick', 0);
    }

    this.clock.setTimeout(this.gameTicker, 1000);
  }

  
  /**
   * Life cycle event for when room is creates.
   * 
   * @param options 
   */
  async onCreate (options: any) {

    this.minClients = options.minClients;
    this.joinCommand = options.joinCommand;
    this.startCommand = options.startCommand;

    this.gameTicker();
    this.maxClients = options.maxClients;

    //fetch drop rates from database
    this.itemDropRate = [
      [GameTextures.GreenRupee, 10],
      [GameTextures.BlueRupee, 5],
      [GameTextures.MagicBottle, 5],
      [GameTextures.MagicJar, 5],
      [GameTextures.OneArrow, 10],
      [GameTextures.TenArrows, 20],
      [GameTextures.OneBomb, 5],
      [GameTextures.TenBombs, 20],
      [GameTextures.RedRupee, 5],
      [GameTextures.SmallHeart, 10],
      [GameTextures.FiftyRupees, 1],
      [GameTextures.FullHeart, 5]
    ];

    this.weaponDropRate = [
      [GameTextures.BluePotion, 10],
      [GameTextures.BlueShield, 15],
      [GameTextures.BlueStaff, 20],
      [GameTextures.Bow, 20],
      [GameTextures.Bow3Arrow, 10],
      [GameTextures.Bow5Arrow, 5],
      [GameTextures.Cape, 10],
      [GameTextures.FireRod, 10],
      [GameTextures.GreenPotion, 10],
      [GameTextures.Hammer, 10],
      [GameTextures.IceRod, 10],
      [GameTextures.LightRod, 10],
      [GameTextures.MagicBow, 15],
      [GameTextures.MagicBow3Arrow, 5],
      [GameTextures.MagicBow5Arrow, 1],
      [GameTextures.RedPotion, 3],
      [GameTextures.Staff, 10],
      [GameTextures.Sword1, 200],
      [GameTextures.Sword2, 15],
      [GameTextures.Sword3, 10],
      [GameTextures.Sword4, 5],
      [GameTextures.Staff, 10],
      [GameTextures.YellowStaff, 10],
    ]

    this.floorDropRate = [
      [GameTextures.GreenRupee, 10],
      [GameTextures.BlueRupee, 5],
      [GameTextures.MagicBottle, 5],
      [GameTextures.MagicJar, 5],
      [GameTextures.OneArrow, 10],
      [GameTextures.OneBomb, 5],
      [GameTextures.RedRupee, 5],
      [GameTextures.SmallHeart, 10],
      [GameTextures.Nothing, 75]
    ]

    //dynamically load and cache map input game input map
    const mapJson = await require(mapFiles.get(options.mapName)!);
    gameInputCache.set('mapJson', mapJson);

    // start the simulation when server begins
    
    const FPS = 20
    global.phaserOnNodeFPS = FPS // default is 60

    const simulation = new Phaser.Game({
      type: Phaser.HEADLESS,
      width: 1,
      height: 1,
      banner: false,
      scene: [ServerSimulationScene],
      fps: {
        target: FPS
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 }
        }
      }
    });
   
    this.simulation = simulation;
    this.state.gameState = GameState.WaitingForPlayers;

    this.on('onsimulationready', (event) => {
      this.state.spawnx = event.spawnArea.x;
      this.state.spawny = event.spawnArea.y;
      this.state.spawnw = event.spawnArea.w;
      this.state.spawnh = event.spawnArea.h;
    });

    this.emit('onstatecreated', this.state);

    //when players update their state
    this.onMessage(ClientMessages.PlayerStateUpdated, (client, data) => {

      this.dispatcher.dispatch(new OnPlayerStateChangeCommand(), {
        payloadId: client.id,
        ...data
      });
    });

    //event listener when a client tries to open a chest
    this.onMessage(ClientMessages.ItemCollected, (client, data) => {
      
      this.dispatcher.dispatch(new OnItemCollectedCommand(), {
        client: client,
        ...data
      });
    });

    //event listener when a client tries to open a chest
    this.onMessage(ClientMessages.ChestOpened, (client, data) => {
      
      this.dispatcher.dispatch(new OnChestOpenedCommand(), {
        id: data.id,
        who: data.who,
        client: client,
        room: this
      });
    });

    //event listener whe a client chops a bush
    this.onMessage(ClientMessages.BreakTile, (client, data) => {
      this.dispatcher.dispatch(new BreakTileCommand(), data);
    });

    //event listener when a player hits another player
    this.onMessage(ClientMessages.HitTarget, (client, data) => {
      this.dispatcher.dispatch(new HitTargetsCommand(), {
        client: client,
        dispatcher: this.dispatcher,
        ...data
      });
    });

    //listen for someone shooting arrow
    this.onMessage(ClientMessages.ShootArrow, (client, data) => {
      this.dispatcher.dispatch(new FireBowCommand(), {
        client,
        ...data
      });
    });

    //listen for bullet collision
    this.onMessage(ClientMessages.BulletCollision, (client, data) => {
      this.dispatcher.dispatch(new BulletCollisionCommand(), {
        client: client,
        dispatcher: this.dispatcher,
        ...data
      });
    });

    //list for open chest events
    this.onMessage(ClientMessages.OpenDynamicChest, (client, data) => {
      this.dispatcher.dispatch(new OpenDynamicChestCommand(), {
        client,
        ...data
      });
    });

    //list for bomb to be placed
    this.onMessage(ClientMessages.PlaceBomb, (client, data) => {
      this.dispatcher.dispatch(new PlaceBombCommand(), {
        client,
        ...data
      });
    });

    //list for bomb to be detonated
    this.onMessage(ClientMessages.DetonateBomb, (client, data) => {
      this.dispatcher.dispatch(new DetonateBombCommand(), {
        client,
        dispatcher: this.dispatcher,
        ...data
      });
    });

    //list for bomb to be detonated
    this.onMessage(ClientMessages.UseCape, (client, data) => {
      this.dispatcher.dispatch(new UseCapeCommand(), {
        client,
        ...data
      });
    });

    //listen for magic shield to be created
    this.onMessage(ClientMessages.CreateShield, (client, data) => {
      this.dispatcher.dispatch(new CreateShieldCommand(), {
        client,
        ...data
      });
    });

    //handler for ping requests
    this.onMessage(ClientMessages.PING, (client) => {
      client.send(ServerMessages.PONG);
    });

    //handler for placing block
    this.onMessage(ClientMessages.PlaceBlock, (client, data) => {
      this.dispatcher.dispatch(new PlaceBlockCommand(), {
        client,
        ...data
      });
    });

    this.onMessage(ClientMessages.ShootLightening, (client, data) => {
      this.dispatcher.dispatch(new ShootLighteningCommand(), {
        client,
        dispatcher: this.dispatcher,
        ...data
      });
    });

    this.onMessage(ClientMessages.ShootFireball, (client, data) => {
      this.dispatcher.dispatch(new ShootFireballCommand(), {
        client,
        dispatcher: this.dispatcher,
        ...data
      });
    });

    this.onMessage(ClientMessages.ShootIceblast, (client, data) => {
      this.dispatcher.dispatch(new ShootIceblastCommand(), {
        client,
        dispatcher: this.dispatcher,
        ...data
      });
    });

    this.onMessage(ClientMessages.ShootLightBall, (client, data) => {
      this.dispatcher.dispatch(new ShootLightBallCommand(), {
        client,
        dispatcher: this.dispatcher,
        ...data
      });
    });

    this.onMessage(ClientMessages.Talk, (client, data) => {
      this.dispatcher.dispatch(new TalkCommand(), {
        ...data,
        client: client
      });
    });

    this.onMessage(ClientMessages.ItemStored, (client, data) => {
      this.dispatcher.dispatch(new StoreItemCommand(), {
        ...data,
        client: client
      });
    });

    this.onMessage(ClientMessages.SwitchWeaponFromBag, (client, data) => {
      this.dispatcher.dispatch(new SwitchWeaponCommand(), {
        ...data,
        client: client
      });
    });

    this.onMessage(ClientMessages.UseGreenPotion, (client, data) => {
      this.dispatcher.dispatch(new UsePotionCommand(), {
        ...data,
        client: client,
        texture: GameTextures.GreenPotion
      });
    });

    this.onMessage(ClientMessages.UseBluePotion, (client, data) => {
      this.dispatcher.dispatch(new UsePotionCommand(), {
        ...data,
        client: client,
        texture: GameTextures.BluePotion
      });
    });

    this.onMessage(ClientMessages.UseRedPotion, (client, data) => {
      this.dispatcher.dispatch(new UsePotionCommand(), {
        ...data,
        client: client,
        texture: GameTextures.RedPotion
      });
    });

    this.onMessage(ClientMessages.Disconnect, (client, data) => {
      this.dispatcher.dispatch(new DisconnectCommand(), {
        ...data,
        client: client
      });
    });

    this.onMessage(ClientMessages.OpenLockedDoor, (client, data) => {
      this.dispatcher.dispatch(new OpenLockedDoorCommand(), {
        ...data,
        client: client
      });
    });

    this.onMessage(ClientMessages.SwordAttack, (client, data) => {
      this.dispatcher.dispatch(new SwordAttackCommand(), {
        ...data,
        client: client
      });
    });

    //listen for simulation events
    SimulationEvents.on('onplayerremoved', (event) => {
      this.dispatcher.dispatch(new DestroyPlayerCommand(), event);
    });

    SimulationEvents.on('onemenyremoved', (event) => {
      this.dispatcher.dispatch(new DestroyEnemyCommand(), event);
    });

    SimulationEvents.on('onenemycollision', (event) => {
      this.dispatcher.dispatch(new HurtPlayerCommand(), {
        enemyState: event.enemyState,
        playerState: event.playerState,
        x: event.enemyState.x,
        y: event.enemyState.y
      });
    });

    
    //start auditing of player actions
    const playerAuditData = new Map<number, {x:number, y:number}>();
    this.dispatcher.dispatch(new AuditPlayerMovementCommand(), { playerAuditData });
    this.dispatcher.dispatch(new NPCAICommand(), { });
  }


  /**
   * Life cycle event when a client connects
   * 
   * @param client
   * @param options 
   */
  onJoin (client: Client, options: any) {

    this.dispatcher.dispatch(new this.joinCommand(), { 
      sessionId: client.id,
      dispatcher: this.dispatcher,
      startCommand: this.startCommand,
      minClients: this.minClients,
      ...options
    });
  }

  // onAuth(client: Client, options: any) {
  //   console.log(options)
  // }


  /**
   * Life cycle event when a client disconnects
   * 
   * @param client
   * @param consented 
   */
  onLeave (client: Client, consented: boolean) {

    this.dispatcher.dispatch(new OnLeaveCommand(), {
      sessionId: client.id
    });
  }


  /**
   * Life cycle event when the room is destroyed.
   */
  onDispose() {
    SimulationEvents.removeAllListeners();
    console.log("room", this.roomId, "disposing...");

    window.cancelAnimationFrame = () => {
      console.log('cancel next frame')
    }

    this.simulation.scene.destroy();
    this.simulation.destroy(false);
  }

  emit(eventName: string, args: any) {
    SimulationEvents.emit(eventName, args)
  }

  on(eventName: string, cb: (data: any) => void, context?: any) {
    SimulationEvents.on(eventName, cb, context);
  }
}