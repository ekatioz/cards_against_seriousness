import { Room } from "colyseus.js";
import Cookies from "js-cookie";
import { State } from "../../schema/State";
import html from "./play-cards.html";

export class PlayCardsPage extends HTMLElement {
  private gameRoom: Room;

  static get tagName() {
    return "play-cards-page";
  }

  get game() {
    return this.gameRoom;
  }

  set game(game: Room<State>) {
    this.gameRoom = game;
    const chooser: HTMLElement = this.shadowRoot.querySelector(".chooser");
    chooser.innerText = `${game.state.chooser.name} wählt aus!`;

    game.state.whitecards.onAdd = this.renderCards.bind(this);
    game.state.whitecards.onRemove = this.renderCards.bind(this);
    game.state.listen("blackcard", this.renderBlackcard.bind(this));
    this.renderBlackcard(game.state.blackcard);
    this.renderCards();
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

  renderBlackcard(card: string) {
    (this.shadowRoot.querySelector(".blackcard") as HTMLElement).innerText = card;
  }

  renderCards() {
    const cards = this.shadowRoot.querySelector(".cards");
    cards.innerHTML = this.game.state.whitecards
      .map((card: {text:string, id:string}) => `<label>
      <input type=checkbox name="cards" value="${card.id}">
      ${card.text}</label>`).join("");
  }

  async connectedCallback() {
    const name: HTMLElement = this.shadowRoot.querySelector(".name");
    name.innerText = Cookies.get("name");
    const startButton = this.shadowRoot.querySelector(".confirm");
    startButton.addEventListener("click", this.startGame.bind(this));
  }
}

if (!customElements.get(PlayCardsPage.tagName)) {
  customElements.define(PlayCardsPage.tagName, PlayCardsPage);
}
