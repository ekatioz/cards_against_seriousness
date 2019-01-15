import { UiElement } from "./UiElement";

const gapSeperator = ' 💣 ';
export class Cloze extends UiElement{

    constructor() {
        super();
        this.addClass('cloze');
    }

    setTextParts(...parts) {
        let text = '';
        parts.forEach((part, idx) => {

            text = text + part + (idx === parts.length - 1 ? '' : gapSeperator);
        });
        this.element.innerText = text;
    }
}