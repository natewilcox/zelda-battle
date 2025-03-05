import { Schema, type } from "@colyseus/schema";
import { IPlayerState } from "@natewilcox/zelda-battle-shared";

export class GameObjectState extends Schema {

    @type('number')
    x: number;
  
    @type('number')
    y: number;

    @type('number')
    speed: number;

    @type('string')
    weapon?: string;

    @type('string')
    newItem?: string;

    constructor(id: string, name: string, health: number, x: number, y: number, speed: number) {
      super();
      
      this.x = x;
      this.y = y;
      this.speed = speed;
    }
  }