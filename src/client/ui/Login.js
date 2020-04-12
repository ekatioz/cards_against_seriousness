import getName from "../../resources/names";

import { LitElement, html, css, unsafeCSS } from "lit-element";

import { getCookie, setCookie } from "../utils";

import store from "../store/store";

import fullscreen from "../../resources/fullscreen.comp.css";

import { updateUsername, login } from "../store/actions";

import "./ProceedButton";

import "./Footer";



const userCookie = "username";

class Login extends LitElement {

  static get styles() {

    return css`

      ${unsafeCSS(fullscreen)}

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

      store.dispatch(login());

    }

  }



  onUsernameChanged(e) {

    const username = e.target.value;

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

      <cards-footer></cards-footer>

    `;

  }

}



customElements.define("user-login", Login);

function LoadUsername() {

  const username = getCookie(userCookie) || getName();

  store.dispatch(updateUsername(username));

  return username;

}

