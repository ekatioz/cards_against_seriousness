import { Client, Room } from "colyseus.js";
import Cookies from "js-cookie";
import html from "./lobby.html";

const getClient = () => ((window as any).client as Client);

export class LobbyPage extends HTMLElement {
  static get tagName() {
    return "lobby-page";
  }

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = html;
  }

  async startGame() {
    const game = await getClient().create("chat");
    this.dispatchEvent(new CustomEvent("start-game", { detail: game, bubbles: true }));
  }

  async joinGame(id: string) {
    const game = await getClient().joinById(id);
    this.dispatchEvent(new CustomEvent("start-game", { detail: game, bubbles: true }));
  }

  async updateGames() {
    const games = this.shadowRoot.querySelector(".games");
    const rooms = await getClient().getAvailableRooms("chat");
    const text = rooms.map((room) => `<b>${room.roomId}</b> <i>(${room.clients}/${room.maxClients})</i> <button class="join" data-id="${room.roomId}">Mitspielen</button>`);
    if (text.length === 0) {
      text.push("keine Spiele");
    }
    games.innerHTML = text.join("<br>");
    const joinButtons = Array.from(games.querySelectorAll(".join"));
    joinButtons.forEach((button) => button.addEventListener("click", ({ target }) => this.joinGame((target as HTMLButtonElement).dataset.id)));
  }

  async connectedCallback() {
    const name: HTMLElement = this.shadowRoot.querySelector(".name");
    name.innerText = Cookies.get("name");
    const startButton = this.shadowRoot.querySelector(".start");
    startButton.addEventListener("click", this.startGame.bind(this));
    setInterval(this.updateGames.bind(this), 1000);
  }
}

if (!customElements.get(LobbyPage.tagName)) {
  customElements.define(LobbyPage.tagName, LobbyPage);
}
