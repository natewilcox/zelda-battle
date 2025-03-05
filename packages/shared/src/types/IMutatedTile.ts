import { Schema, type } from "@colyseus/schema";


/**
 * Interface for objects that represent what has changed on the map client side.
 */
export interface IMutatedTile extends Schema {

    x: number;
    y: number;
    type: number;
}