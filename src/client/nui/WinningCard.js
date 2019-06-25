import { LitElement, html, css } from "lit-element";
import store, { observeStore } from "../store/store";

export class WinningCard extends LitElement {
  static get properties() {
    return { card: { type: String } };
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
      state => state.winningCard,
      () => {
        this.card = store.getState().winningCard;
      }
    );
  }

  render() {
    return html([
      this.card ? '<button class="winningCard">' + this.card + "</button>" : ""
    ]);
  }
}

customElements.define("winning-card", WinningCard);
