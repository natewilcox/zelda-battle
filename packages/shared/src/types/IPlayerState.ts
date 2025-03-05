import { Schema } from "@colyseus/schema";
import { Direction, GameTextures, LinkColor, LinkState } from "./Animations";
import { LandType } from "./LandType";

export interface IPlayerState extends Schema {

    handle: string;
    uid: string;
    clientId: string;
    id: number;
    linkColor: LinkColor;
    health: number;
    maxHealth: number;
    magic: number;
    maxMagic: number;
    rupees: number;
    maxRupees: number;
    bombs: number;
    maxBombs: number;
    arrows: number;
    maxArrows: number;
    keys: number;
    maxKeys: number;
    wearingCape: boolean;
    hasMagicShield: boolean;
    hasControl: boolean;
    visible: boolean;
    visibleLocal:boolean;
    hasOra: boolean;
    hasShadow: boolean;
    isHiding: boolean;
    curLandType: LandType;
    x: number;
    y: number;
    dir: Direction;
    state: LinkState;
    speed: number;
    alpha: number;
    teleport_x?: number;
    teleport_y?: number;
    weaponSlot1?: GameTextures;
    weaponSlot2?: GameTextures;
    bag: GameTextures[];

    //game stats
    placement: number;
    eliminations: number;
    damageGiven: number;
    damageTaken: number;
    magicUsed: number;
    dataSynced: boolean;
    
    //audit data
    resetAudit: boolean;
    greviances: number;
}