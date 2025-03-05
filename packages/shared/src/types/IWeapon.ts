import { GameTextures } from "./Animations"

export enum WeaponState {
    New,
    Used,
    Weak,
    Broken
}
export interface IWeapon {
    texture: GameTextures,
    state: WeaponState
}