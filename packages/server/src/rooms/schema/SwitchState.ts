import { Schema, type } from "@colyseus/schema";
import { ISwitchState } from "@natewilcox/zelda-battle-shared";
import { GameTextures } from "@natewilcox/zelda-battle-shared";

export class SwitchState extends Schema implements ISwitchState {

  @type('number')
  id: number;

  @type('number')
  x: number;

  @type('number')
  y: number;

  @type('number')
  texture: GameTextures;

  constructor(id: number, x: number, y: number, texture: GameTextures) {
    super();
    
    this.id = id;
    this.x = x;
    this.y = y;
    this.texture = texture;
  }
}