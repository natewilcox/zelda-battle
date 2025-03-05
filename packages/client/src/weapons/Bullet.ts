import { GameTextures } from "@natewilcox/zelda-battle-shared";
import { IBullet } from "./IBullet";


export class Bullet extends Phaser.Physics.Arcade.Sprite implements IBullet {
    id!: number;
    textId!: GameTextures
}