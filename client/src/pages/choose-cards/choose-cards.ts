import { Room } from "colyseus.js";
import Cookies from "js-cookie";
import html from "./choose-cards.html";

export class ChooseCardsPage extends HTMLElement {
  private gameRoom: Room;

  static get tagName() {
    return "choose-cards-page";
  }

  get game() {
    return this.gameRoom;
  }

  set game(game: Room) {
    this.gameRoom = game;
  }

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = html;
  }

  startGame() {
    const cardId = 0;
    this.dispatchEvent(new CustomEvent("confirm-card", { detail: cardId, bubbles: true }));
  }

  async connectedCallback() {
    const name: HTMLElement = this.shadowRoot.querySelector(".name");
    name.innerText = Cookies.get("name");
    const startButton = this.shadowRoot.querySelector(".confirm");
    startButton.addEventListener("click", this.startGame.bind(this));
  }
}

if (!customElements.get(ChooseCardsPage.tagName)) {
  customElements.define(ChooseCardsPage.tagName, ChooseCardsPage);
}
