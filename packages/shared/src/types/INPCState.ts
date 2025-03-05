import type { Dispatcher } from "@colyseus/command";
import { Schema } from "@colyseus/schema";
//import { BattleRoyaleRoom } from "../rooms/BattleRoyaleRoom";
import { GameTextures } from "./Animations";
import { IPlayerState } from "./IPlayerState";

export interface INPCState extends Schema {

    id: number;
    x: number;
    y: number;
    anim: string;
    texture: GameTextures;

    //processNearPlayers: (players: IPlayerState[], dispatcher: Dispatcher<BattleRoyaleRoom>) => void;
    onProcess: (cb: () => void) => void;
}