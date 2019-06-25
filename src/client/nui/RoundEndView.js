import "./Cloze";
import "./ProceedButton";
import "./Scoreboard";
import "./Winner";
import "./WinningCard";
import { LitElement, html, css } from "lit-element";
import store, { observeStore } from "../store/store";
import { finishRound } from "../store/actions";
import { role } from "../../commonStrings";

export class RoundEnd extends LitElement {
  static get properties() {
    return { varib: "" };
  }
  static get styles() {
    return css`
      :host {
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        position: absolute;
        padding: 1em;
      }
    `;
  }

  onNewRound(e) {
    store.dispatch(finishRound());
  }

  proceedWhenMaster() {
    if (store.getState().role === role.master) {
      return html`
        <proceed-button
          action="Nächste Runde"
          @proceed="${this.onNewRound}"
        ></proceed-button>
      `;
    } else {
      return html``;
    }
  }

  render() {
    return html`
      <cloze-text></cloze-text>
      <winning-card></winning-card>
      <br />
      <score-board></score-board>
      <br />
      <winner-player></winner-player>
      <br />
      ${this.proceedWhenMaster()}
    `;
  }
}

customElements.define("round-end", RoundEnd);
