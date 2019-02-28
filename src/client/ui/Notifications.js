import { UiElement } from "./UiElement";

export class Notifications extends UiElement {

    constructor() {
        super();
        this.addClass('notifications');
    }
/**
 * 
 * @param {String} notifiaction 
 * @param {number} duration 
 */
    publish(notifiaction, duration = 5) {
        const notify = document.createElement('div');
        notify.innerText = notifiaction;
        notify.className = 'notification';
        const removeNotification = () => {
            this.removeDomElement(notify);
            if (this.element.childElementCount == 0 ){
                this.element.hidden = true;
            }
        };
        notify.addEventListener('click', removeNotification);
        this.addDomElement(notify);
        this.element.removeAttribute('hidden');
        setTimeout(removeNotification, duration * 1000);
    }
}