import { Direction, GameTextures, WeaponType } from "@natewilcox/zelda-battle-shared";
import Character from "../characters/Character";
import { IWeapon } from "./IWeapon";

export interface IBow extends IWeapon {

    fire: (idSeed: number, dir: Direction) => void;
}