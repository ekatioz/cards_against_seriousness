import { LitElement, html, css } from "lit-element";

class BasicCard extends LitElement {
  static get properties() {
    return {
      text: {
        type: String
      }
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
      }

      .card:hover {
        box-shadow: 0 0 7px 3px rgba(238, 238, 238, 0.5);
      }
    `;
  }

  constructor(text) {
    super();
    this.text = text;
  }

  onClick(e) {
    this.dispatchEvent(
      new CustomEvent("choose", { detail: { card: this.text } })
    );
  }

  render() {
    return html`
      <button class="card" @click="${this.onClick}">${this.text}</button>
    `;
  }
}

customElements.define("basic-card", BasicCard);
