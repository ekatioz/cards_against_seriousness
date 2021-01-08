import { Schema, type } from "@colyseus/schema";

export class WhiteCard extends Schema {
  @type("string")
  id: string;

  @type("string")
  text: string;

  @type("string")
  owner: string; // contains the sessionId of Card owner

  @type("boolean")
  played: boolean = false;

  constructor(id:string, text:string, owner:string) {
    super();
    this.id = id;
    this.text = text;
    this.owner = owner;
  }
}
