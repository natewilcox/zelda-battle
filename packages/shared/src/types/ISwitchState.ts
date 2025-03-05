import { Schema } from "@colyseus/schema";
import { GameTextures } from "./Animations";

export interface ISwitchState extends Schema {

    id: number;
    x: number;
    y: number;
    texture: GameTextures;
}