import Cookies from "js-cookie";
import html from "./login.html";

export class LoginPage extends HTMLElement {
  static get tagName() {
    return "login-page";
  }

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = html;
  }

  connectedCallback() {
    const nameInput: HTMLInputElement = this.shadowRoot.querySelector(".name");
    const loginButton = this.shadowRoot.querySelector(".login");

    loginButton.addEventListener("click", () => {
      Cookies.set("name", nameInput.value);
      this.dispatchEvent(new CustomEvent("login-success", { bubbles: true }));
    });
  }
}

if (!customElements.get(LoginPage.tagName)) {
  customElements.define(LoginPage.tagName, LoginPage);
}
