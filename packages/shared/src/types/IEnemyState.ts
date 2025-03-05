import { Schema } from "@colyseus/schema";
import { Direction, GameTextures } from "./Animations";

export interface IEnemyState extends Schema {

    id: number;
    health: number
    x: number;
    y: number;
    dir?: Direction;
    speed: number;
    state: number;
    texture: GameTextures;
    alpha: number;

    drops?: GameTextures;
}