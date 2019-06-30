import "./Cloze";
import "./Hand";
import { LitElement, html, css } from "lit-element";
import fullscreen from "../../resources/fullscreen.comp.css";

export class SlaveView extends LitElement {
  static get properties() {
    return { coveredCards: [] };
  }

  static get styles() {
    return css([fullscreen]);
  }

  render() {
    return html`
      <cloze-text></cloze-text>
      <user-hand></user-hand>
    `;
  }
}

customElements.define("slave-view", SlaveView);
