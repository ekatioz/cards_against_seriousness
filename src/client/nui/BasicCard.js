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
      .card {
        margin: 1vw;
        background: #eee;
        width: 27vw;
        height: 27vw;
        border: 1px solid #666;
        color: #222;
        border-radius: 1em;
        padding: 1em;
        word-break: break-word;
        cursor: pointer;
        font-family: permanentMarker;
        vertical-align: middle;
        font-size: 0.9em;
        margin-bottom: 2vw;
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
