import { FullscreenElement } from "./FullscreenElement";
import { ProceedButton } from "./ProceedButton";
import getName from "../../resources/names";

const userCookie = 'username';
export class Login extends FullscreenElement {

    constructor(loginCallback) {
        super();
        this.addClass('login');
        const username = document.createElement('input');
        username.className = 'username-input';
        username.value = getCookie(userCookie) || getName();
        this.addDomElement(username);
        this.addUiElement(new ProceedButton('Login', () => {
            if (username.value && username.value !== '') {
                setCookie(userCookie, username.value, 60);
                loginCallback(username.value);
            }
        }));
    }
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return;
}