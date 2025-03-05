import { Schema, type } from "@colyseus/schema";
import { GameTextures } from "@natewilcox/zelda-battle-shared";
import { IItemState } from "@natewilcox/zelda-battle-shared";


/**
 * State object for tracking items on the server
 */
export class ItemState extends Schema implements IItemState {

    @type('number')
    id: number;

    @type('number')
    x: number;
  
    @type('number')
    y: number;

    @type('number')
    itemType: GameTextures;
    
    @type('number')
    dx?: number;
    
    @type('number')
    dy?: number;

    @type('number')
    delay?: number;

    /**
     * Creates a new item state object
     * 
     * @param id 
     * @param x 
     * @param y 
     * @param itemType 
     */
    constructor(id: number, x: number, y: number, itemType: GameTextures, dx: number, dy: number, delay: number) {
      super();
      
      this.id = id;
      this.x = x;
      this.y = y;
      this.itemType = itemType;
      this.dx = dx;
      this.dy = dy;
      this.delay = delay;
    }
}