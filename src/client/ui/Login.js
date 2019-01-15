import { FullscreenElement } from "./FullscreenElement";
import { ProceedButton } from "./ProceedButton";
import getName from "../../resources/names";

export class Login extends FullscreenElement {

    constructor(loginCallback) {
        super();
        this.addClass('login');
        const username = document.createElement('input');
        username.className = 'username-input';
        username.value = getName();
        this.addDomElement(username);
        this.addUiElement(new ProceedButton('Login', () =>
            username.value && username.value !== ''
                ? loginCallback(username.value)
                : {}));
    }
}