import { Schema, type } from "@colyseus/schema";
import { IChestState } from "@natewilcox/zelda-battle-shared";

export class ChestState extends Schema implements IChestState {

    @type('number')
    id: number;

    @type('number')
    mapid: number;

    @type('boolean')
    opened: boolean;

    @type('number')
    contents: number;


    constructor(id: number, mapid: number, opened: boolean, contents: number) {
      super();
      
      this.id = id;
      this.mapid = mapid;
      this.opened = opened;
      this.contents = contents;
    }
  }