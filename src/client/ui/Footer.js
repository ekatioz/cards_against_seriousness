import { UiElement } from "./UiElement";

class FooterIcon extends UiElement{
    constructor(caption, stylename, target){
        super('a');
        this.element.href = target;
        const div = document.createElement('div');
        div.classList.add('footer-link');
        div.classList.add(stylename);
        div.title = caption;
        this.addDomElement(div);
    }
}

export class Footer extends UiElement {

    constructor() {
        super();
        this.addClass('footer');

        this.addUiElement(new FooterIcon('Card-Provider','cardprovider','cardprovider'));
        this.addUiElement(new FooterIcon('Admin Panel','adminPanel','admin'));
        this.addUiElement(new FooterIcon('Cards Against Seriousness auf GitHub','github','https://github.com/ekatioz/cards_against_seriousness'));
    }
}