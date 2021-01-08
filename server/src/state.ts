/* eslint-disable prefer-arrow-callback */
import {
  ArraySchema, filterChildren, MapSchema, Schema, type,
} from "@colyseus/schema";
import { Client } from "@colyseus/schema/lib/annotations";
import { Player } from "./player";
import { WhiteCard } from "./whitecard";

export class State extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  @type(Player)
  chooser: Player;

  @type("string")
  blackcard: string;

  /**
   * DO NOT USE ARROW FUNCTION INSIDE `@filter`
   * (IT WILL FORCE A DIFFERENT `this` SCOPE)
   */
  @filterChildren(function filter(
    client: Client, // the Room's `client` instance which this data is going to be filtered to
    key: number,
    value: WhiteCard,
  ) { return !value.played && value.owner === client.sessionId; })
  @type([WhiteCard])
  whitecards = new ArraySchema<WhiteCard>();
}
