import { Schema, type } from "@colyseus/schema";
import { IMutatedTile } from "@natewilcox/zelda-battle-shared";


/**
 * Class to represent tile objects on the map that have been mutated due to player actions.
 * 
 */
export class MutatedTile extends Schema implements IMutatedTile {

    @type('number')
    x: number;
  
    @type('number')
    y: number;

    @type('number')
    type: number;

    /**
     * Creates an instance of a mutated tile to track the x/y cordiatnates of what has changed on the map.
     * 
     * @param x 
     * @param y 
     * @param type 
     */
    constructor(x: number, y: number, type: number) {
      super();

      this.x = x;
      this.y = y;
      this.type = type;
    }
  }