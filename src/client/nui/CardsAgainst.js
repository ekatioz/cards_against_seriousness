import { LitElement, html, css } from "lit-element";
import store, { observeStore } from "../store/store";
import "./Login";
import "./Lobby";
import "./MasterView";
import "./SlaveView";
import "./RoundEndView";

class CardsAgains extends LitElement {
  static get properties() {
    return { view: { type: String } };
  }
  
  constructor() {
    super();
    observeStore(
      state => state.activeView,
      () => {
        this.view = store.getState().activeView;
      }
    );
  }

  getView() {
    const elm = document.createElement(this.view).outerHTML;
    return html([elm]);
  }

  render() {
    console.log("render", this.view);
    return html`
      <div></div>
      ${this.getView()}
      <footer></footer>
    `;
  }
}

customElements.define("cards-against-seriousness", CardsAgains);
