import "./Cloze";
import "./ProceedButton";
import "./Scoreboard";
import "./Winner";
import "./WinningCard";
import { LitElement, html, css } from "lit-element";
import store from "../store/store";
import { finishRound } from "../store/actions";
import { role } from "../../commonStrings";
import fullscreen from "../../resources/fullscreen.comp.css";

export class RoundEnd extends LitElement {
  static get properties() {
    return { varib: "" };
  }
  static get styles() {
    return css([fullscreen]);
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
      <score-board></score-board>
      <br />
      <winner-player></winner-player>
      <br />
      ${this.proceedWhenMaster()}
    `;
  }
}

customElements.define("round-end", RoundEnd);
