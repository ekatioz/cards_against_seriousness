import { LitElement, html, css } from "lit-element";
import store, { observeStore } from "../store/store";

export class WinningCard extends LitElement {
  static get properties() {
    return { cards: { type: String } };
  }
  static get styles() {
    return css`
      :host {
        margin: 0;
        padding: 0;
        border: 0;
        box-sizing: border-box;
        display: block;
        text-align: center;
      }

      .winningCard {
        margin: 1vmin;
        border: none;
        background: #ccc;
        width: 27vmin;
        min-width: 11em;
        height: 27vmin;
        min-height: 11em;
        color: #222;
        border-radius: 1em;
        padding: 1rem;
        word-break: break-word;
        font-family: permanentMarker;
        vertical-align: middle;
        font-size: 0.9em;
      }
    `;
  }

  constructor() {
    super();
    observeStore(
      state => state.winningCards,
      () => {
        this.cards = store.getState().winningCards;
      }
    );
  }

  render() {
    if (this.cards.length > 0) {
      return html`
        ${this.cards.map(toCard)}
      `;
    } else {
      return html``;
    }
  }
}

customElements.define("winning-card", WinningCard);

function toCard(card) {
  return html`
    <button class="winningCard">${card}</button>
  `;
}
