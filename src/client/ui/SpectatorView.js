import "./Cloze";
import "./CoveredHand";
import { LitElement, html, css } from "lit-element";
import fullscreen from "../../resources/fullscreen.comp.css";

class SpectatorView extends LitElement {
  static get styles() {
    return css([fullscreen]);
  }

  render() {
    return html`
      <cloze-text></cloze-text>
      <covered-hand></covered-hand>
    `;
  }
}

customElements.define("spectator-view", SpectatorView);
