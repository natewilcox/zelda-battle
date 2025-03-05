import { IBomb } from "./IBomb";

export class RemoteBomb extends Phaser.Physics.Arcade.Sprite implements IBomb {
    id!: number;
}