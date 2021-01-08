import { Client, Room } from "colyseus.js";
import Cookies from "js-cookie";
import html from "./ready-room.html";

const getClient = () => ((window as any).client as Client);

export class ReadyRoomPage extends HTMLElement {
  private gameRoom: Room;

  static get tagName() {
    return "ready-room-page";
  }

  get game() {
    return this.gameRoom;
  }

  set game(game: Room) {
    this.gameRoom = game;
    game.onStateChange((state: any) => {
      this.updatePlayers(state.players);
    });
  }

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = html;
  }

  startGame() {
    this.dispatchEvent(new CustomEvent("start-game", { bubbles: true }));
  }

  async updatePlayers(players: any) {
    const playerList = this.shadowRoot.querySelector(".players");
    const ids = Array.from(players.keys());
    const text = ids.map((id) => `<b>${players.get(id).name}</b>`);
    playerList.innerHTML = text.join("<br>");
  }

  async connectedCallback() {
    const name: HTMLElement = this.shadowRoot.querySelector(".name");
    name.innerText = Cookies.get("name");
    const startButton = this.shadowRoot.querySelector(".start");
    startButton.addEventListener("click", this.startGame.bind(this));
  }
}

if (!customElements.get(ReadyRoomPage.tagName)) {
  customElements.define(ReadyRoomPage.tagName, ReadyRoomPage);
}
