import { IPlayerState } from "./IPlayerState";
import { Schema, ArraySchema, MapSchema } from "@colyseus/schema";
import { IChestState } from "./IChestState";
import { IItemState } from "./IItemState";
import { IMutatedTile } from "./IMutatedTile";
import { INPCState } from "./INPCState";
import { GameState } from "./GameState";
import { IEnemyState } from "./IEnemyState";
import { ISwitchState } from "./ISwitchState";


/**
 * Interface for main room type.
 */
export interface IBattleRoyaleRoomState extends Schema {

    maxPlayers: number;
    mapName: string;
    gameState: GameState;
    playerStates: ArraySchema<IPlayerState>;
    chestStates: ArraySchema<IChestState>;
    itemStates: ArraySchema<IItemState>;
    npcs: ArraySchema<INPCState>;
    enemies: ArraySchema<IEnemyState>;
    switches: ArraySchema<ISwitchState>;
    mutatedTiles: ArraySchema<IMutatedTile>
    
    bulletCounter: number;
    bombCounter: number;
    chests: string[];

    timer: number;
    
    zoneWidth: number;
    zoneX: number;
    zoneY: number;

    spawnx: number;
    spawny: number;
    spawnw: number;
    spawnh: number;
}