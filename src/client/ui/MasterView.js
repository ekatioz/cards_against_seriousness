import "./Cloze";
import "./CoveredHand";
import { LitElement, html, css } from "lit-element";
import fullscreen from "../../resources/fullscreen.comp.css";

class MasterView extends LitElement {
  static get properties() {
    return { coveredCards: [] };
  }

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

customElements.define("master-view", MasterView);
