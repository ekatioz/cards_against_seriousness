import { LitElement, html, css } from "lit-element";

export class ProceedButton extends LitElement {
  static get properties() {
    return { action: { type: String } };
  }

  static get styles() {
    return css`
      .proceed-button {
        outline: none;
        font-family: permanentMarker;
        position: absolute;
        z-index: 5;
        border: none;
        right: 1em;
        bottom: 0;
        color: #eeeeee;
        background-color: transparent;
        font-size: 3em;
        cursor: pointer;
      }
    `;
  }

  onProceed() {
    this.dispatchEvent(new CustomEvent("proceed"));
  }

  render() {
    return html`
      <button class="proceed-button" @click="${this.onProceed}">
        ${this.action}
      </button>
    `;
  }
}

customElements.define("proceed-button", ProceedButton);

/* background: linear-gradient(
  160deg,
  #eeeeee 0%,
  #eeeeee 40%,
  #ff9021 50%,
  #eeeeee 60%,
  #eeeeee 100%
);
background-size: 400% 400%;
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
-webkit-animation: Shimmer 2s ease infinite;

}

@-webkit-keyframes Shimmer {
0% {
  background-position: 100% 60%;
}
100% {
  background-position: 0% 45%;
}
} */
