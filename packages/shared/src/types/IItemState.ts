import { Schema } from "@colyseus/schema";
import { GameTextures } from "./Animations";


/**
 * enum of all item types
 */
export enum ItemType {
    MagicJar,
    MagicBottle,
    Heart,
    GreenRupee,
    RedRupee,
    BlueRupee,
    Bomb,
    BombFourPack,
    BombEightPack,
    BombTenPack,
    Arrow,
    ArrowFivePack,
    ArrowTenPack,
    SmallKey
}


/**
 * Interface for items on the server
 */
export interface IItemState extends Schema {

    id: number;
    x: number;
    y: number;
    itemType: GameTextures;
    dx?: number;
    dy?: number;
    delay?: number;
}