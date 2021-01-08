// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.6
// 

import { Schema, type, ArraySchema, MapSchema, DataChange } from "@colyseus/schema";
import { Player } from "./Player"
import { WhiteCard } from "./WhiteCard"

export class State extends Schema {
    @type({ map: Player }) public players!: MapSchema<Player> = new MapSchema<Player>();
    @type(Player) public chooser!: Player = new Player();
    @type("string") public blackcard!: string;
    @type([ WhiteCard ]) public whitecards!: ArraySchema<WhiteCard> = new ArraySchema<WhiteCard>();
}
