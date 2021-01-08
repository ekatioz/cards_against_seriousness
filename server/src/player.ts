import { Schema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("string")
  name: string = "unbekannt";

  @type("string")
  id: string;

  constructor(id: string) {
    super();
    this.id = id;
  }
}
