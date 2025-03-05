import type { Dispatcher } from "@colyseus/command";
import { Schema } from "@colyseus/schema";
import { GameTextures } from "./Animations";
import { IPlayerState } from "./IPlayerState";

export interface INPCState extends Schema {

    id: number;
    x: number;
    y: number;
    anim: string;
    texture: GameTextures;

    processNearPlayers: (players: IPlayerState[], dispatcher: any) => void;
    onProcess: (cb: () => void) => void;
}