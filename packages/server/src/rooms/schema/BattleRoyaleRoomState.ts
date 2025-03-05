import generateUniqueId  from 'generate-unique-id';
import '@geckos.io/phaser-on-nodejs'
import { Schema, ArraySchema, type, MapSchema } from '@colyseus/schema';
import { IPlayerState } from '@natewilcox/zelda-battle-shared';
import { PlayerState } from './PlayerState';
import { ChestState } from './ChestState';
import { IChestState } from '@natewilcox/zelda-battle-shared';
import { ItemState } from './ItemState';
import { IItemState } from '@natewilcox/zelda-battle-shared';
import { MutatedTile } from './MutatedTile';
import { IMutatedTile } from '@natewilcox/zelda-battle-shared';
import { INPCState } from '@natewilcox/zelda-battle-shared';
import { NPCState } from './NPCState';
import { SwitchState } from './SwitchState';
import { ISwitchState } from '@natewilcox/zelda-battle-shared';
import { IBattleRoyaleRoomState } from '@natewilcox/zelda-battle-shared';
import { GameState } from '@natewilcox/zelda-battle-shared';
import { IEnemyState } from '@natewilcox/zelda-battle-shared';
import { EnemyState } from './EnemyState';

/**
 * Class representing running state of game on server.
 * Contains collections of players and sprites to render on every client.
 */
export class BattleRoyaleRoomState extends Schema implements IBattleRoyaleRoomState {
  
  @type('number') 
  maxPlayers: number;

  @type('string')
  mapName: string;

  @type('number') 
  gameState: GameState = GameState.New;

  @type({ map: PlayerState }) 
  playerStates: MapSchema<IPlayerState> = new MapSchema<IPlayerState>();

  @type([ChestState])
  chestStates: ArraySchema<IChestState> = new ArraySchema<IChestState>();

  @type([ItemState])
  itemStates: ArraySchema<IItemState> = new ArraySchema<IItemState>();

  @type([NPCState])
  npcs: ArraySchema<INPCState> = new ArraySchema<INPCState>();

  @type([EnemyState])
  enemies: ArraySchema<IEnemyState> = new ArraySchema<IEnemyState>();

  @type([SwitchState])
  switches: ArraySchema<SwitchState> = new ArraySchema<ISwitchState>();

  @type([MutatedTile])
  mutatedTiles: ArraySchema<IMutatedTile> = new ArraySchema<IMutatedTile>();
  
  @type('number')
  timer: number;

  @type('number')
  zoneWidth: number;

  @type('number')
  zoneX: number;

  @type('number')
  zoneY: number;

  //server varibles not streamed to client
  bulletCounter: number;
  bombCounter: number;
  chests: string[];

  // simulation!: Phaser.Game;
  spawnx: number = 0;
  spawny: number = 0;
  spawnw: number = 0;
  spawnh: number = 0;

  /**
   * Creates the game and any static resources for game, such as chests and items.
   */
  constructor(maxPlayers: number, mapName: string, mapJson: any) {
    super();

    this.mapName = mapName;
    this.maxPlayers = maxPlayers;

    this.bulletCounter = 0;
    this.bombCounter = 0;
    this.chests = [];
    
    this.timer = 0;
    this.zoneWidth = 1700;
    this.zoneX = 1200;
    this.zoneY = 1200;
  }
}