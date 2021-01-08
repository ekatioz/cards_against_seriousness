import { Client, Room } from "colyseus";
import { Card, getCards } from "./db";
import { Phase } from "./phase";
import { Player } from "./player";
import { State } from "./state";
import { Topic } from "./Topic";
import { countOccurrences } from "./utils";
import { WhiteCard } from "./whitecard";

export class ChatRoom extends Room<State> {
  // this room supports only 4 clients connected
  maxClients = 4;

  blackcards: Card[];

  whitecards: Card[];

  startingCardsCount = 1;

  phase: Phase = Phase.READY;

  onCreate(options: any) {
    console.log("ChatRoom created!", options);
    this.setState(new State());
    this.onMessage("name", (client, name) => {
      console.log(client.sessionId, "is", name);
      this.state.players.get(client.sessionId).name = name;
    });
    this.onMessage("start", () => {
      const chooser = Array.from(this.state.players.keys())[0];
      console.log("chooser", chooser);
      this.state.chooser = this.state.players.get(chooser);
      Promise.all([
        getCards(Topic.BLACKCARD),
        getCards(Topic.WHITECARD),
      ]).then(([blackcards, whitecards]) => {
        this.blackcards = blackcards;
        this.state.blackcard = this.blackcards.splice(0, 1)[0].text;
        this.whitecards = whitecards;
        this.distributeWhitecards(this.clients, this.startingCardsCount);
        this.newRound();
      });
    });
  }

  onJoin(client: Client) {
    console.log(`${client.sessionId} joined.`);
    this.state.players.set(client.sessionId, new Player(client.sessionId));
    if (this.phase !== Phase.READY) {
      this.distributeWhitecards([client], this.startingCardsCount);
    }
  }

  onLeave(client: Client) {
    console.log(`${client.sessionId} left.`);
    this.state.whitecards
      .filter((card) => card.owner === client.sessionId)
      .forEach((card: WhiteCard) => {
        const index = this.state.whitecards.findIndex((whitecard) => whitecard.id === card.id);
        const removedCard = this.state.whitecards.splice(index, 1)[0];
        this.whitecards.push(removedCard);
      });
    if (this.state.players.has(client.sessionId)) {
      this.state.players.delete(client.sessionId);
    }
  }

  newRound() {
    this.phase = Phase.PLAY_CARDS;
    this.distributeWhitecards(
      this.clients.filter((client) => client.sessionId !== this.state.chooser.id),
      countOccurrences(this.state.blackcard, /%w/gi),
    );
  }

  distributeWhitecards(clients: Client[], count: number) {
    clients.forEach((client) => {
      const cards = this.whitecards.splice(0, count);
      cards.forEach((card) => {
        console.log(typeof card.id, card.id);
      });
      cards
        .map((card) => new WhiteCard(card.id, card.text, client.sessionId))
        .forEach((card) => this.state.whitecards.push(card));
    });
  }

  onDispose() {
    console.log("Dispose ChatRoom");
  }
}
