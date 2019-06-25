import getName from "../../resources/names";
import { LitElement, html, css } from "lit-element";
import { getCookie, setCookie } from "../utils";
import store from "../store/store";
import { updateUsername, login } from "../store/actions";
import "./ProceedButton";

const userCookie = "username";
class Login extends LitElement {
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
      .username-input {
        background-color: #222;
        color: #eee;
        font-family: permanentMarker;
        font-size: 2em;
        border: 0;
        border-bottom: 2px solid #eee;
        outline: none;
        width: 100%;
        margin-bottom: 10vh;
      }

      .username-input:focus {
        box-shadow: 0px 2px 0px 0px #ff9021;
      }
    `;
  }

  onLogin() {
    const username = store.getState().username;
    if (username && username !== "") {
      setCookie(userCookie, username, 60);
      store.dispatch(login())
    }
  }

  onUsernameChanged(e) {
    const username = e.path[0].value;
    store.dispatch(updateUsername(username));
  }

  render() {
    return html`
      <input
        class="username-input"
        @change="${this.onUsernameChanged}"
        value="${LoadUsername()}"
      />
      <proceed-button
        action="Login"
        @proceed="${this.onLogin}"
      ></proceed-button>
    `;
  }
}

customElements.define("user-login", Login);
function LoadUsername() {
  const username = getCookie(userCookie) || getName();
  store.dispatch(updateUsername(username));
  return username;
}
