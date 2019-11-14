import { LitElement, html, css } from "lit-element";
import github from "../../resources/GitHub.png";
import cardprovider from "../../resources/cardprovider.png";
import adminPanel from "../../resources/adminPanel.png";
class FooterIcon extends LitElement {
  static get properties() {
    return {
      caption: { type: String },
      image: { type: String },
      target: { type: String }
    };
  }

  static get styles() {
    return css`
      :host {
        height: 64px;
        width: 64px;
        margin-left: 16px;
        margin-right: 16px;
      }
    `;
  }

  render() {
    return html`
      <a href="${this.target}" target="_blank">
        <img src="${this.image}" title="${this.caption}" />
      </a>
    `;
  }
}

customElements.define("footer-icon", FooterIcon);

class Footer extends LitElement {
  static get styles() {
    return css`
      :host {
        position: fixed;
        left: 0;
        bottom: 1em;
        width: 100%;
        display: flex;
        justify-content: center;
        box-sizing: border-box;
        border-top: 1px solid #eee;
        padding-top: 1em;
      }
    `;
  }

  render() {
    return html`
      <footer-icon
        caption="Card-Provider"
        image="${cardprovider}"
        target="cardprovider"
      ></footer-icon>
      <footer-icon
        caption="Admin Panel"
        image="${adminPanel}"
        target="admin"
      ></footer-icon>
      <footer-icon
        caption="Cards Against Seriousness auf GitHub"
        image="${github}"
        target="https://github.com/ekatioz/cards_against_seriousness"
      ></footer-icon>
    `;
  }
}

customElements.define("cards-footer", Footer);
