// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.6
// 

import { Schema, type, ArraySchema, MapSchema, DataChange } from "@colyseus/schema";


export class WhiteCard extends Schema {
    @type("string") public id!: string;
    @type("string") public text!: string;
    @type("string") public owner!: string;
    @type("boolean") public played!: boolean;
}
