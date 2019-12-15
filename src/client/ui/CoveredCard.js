import { LitElement, html, css } from "lit-element";
import store from "../store/store";
import { role } from "../../commonStrings";

export class CoveredCard extends LitElement {
  static get properties() {
    return {
      text: { type: String },
      covered: { type: String }
    };
  }

  static get styles() {
    return css`
      :host {
        margin: 0;
        padding: 0;
        border: 0;
        box-sizing: border-box;
      }
      .card {
        margin: 1vmin;
        border: none;
        background: #eee;
        width: 27vmin;
        min-width: 11em;
        height: 27vmin;
        min-height: 11em;
        color: #222;
        border-radius: 1em;
        padding: 1rem;
        word-break: break-word;
        cursor: pointer;
        font-family: permanentMarker;
        vertical-align: middle;
        font-size: 0.9em;
        outline: none;
      }

      .card.covered .cardText {
        font-size: 6em;
      }

      .card:not(.locked):not(.slave):hover {
        box-shadow: 0 0 7px 3px rgba(238, 238, 238, 0.5);
      }

      .slave {
        opacity: 0.6;
        filter: grayscale(1);
        cursor: unset;
      }
    `;
  }

  onClick(e) {
    if (this.text && store.getState().role === role.master) {
      this.dispatchEvent(
        new CustomEvent("choose", {
          detail: { covered: this.covered, card: this.text }
        })
      );
    }
  }

  render() {
    return html`
      <button
        class="card 
        ${this.covered ? "covered" : ""}
        ${this.text ? "" : "locked"}
        ${store.getState().role}
        "
        @click="${this.onClick}"
      >
        <span class="cardText"
          >${this.text ? (this.covered ? "🐵" : this.text) : "🙈"}</span
        >
      </button>
    `;
  }
}

customElements.define("covered-card", CoveredCard);
