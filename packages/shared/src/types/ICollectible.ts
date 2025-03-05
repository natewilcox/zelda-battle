import { GameTextures } from "./Animations";
import { IGameObject } from "./IGameObject";

export interface ICollectible extends IGameObject {

    itemType: GameTextures;
    disabled: boolean;
}