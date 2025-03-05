import { Schema } from "@colyseus/schema";

export interface IChestState extends Schema {

    id: number;
    mapid: number;
    opened: boolean;
    contents: number;
}