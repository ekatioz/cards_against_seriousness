const gapSeperator = ' ... ';
export class Cloze {

    constructor() {
        const element = document.createElement('div');
        element.className = 'cloze';
        this.element = element;
        this.gaps = [];
        this._cloze = '';
    }

    get text() {
        return this.element.innerText;
    }

    setTextParts(...parts) {
        let text = '';
        parts.forEach((part, idx) => {
            this.gaps = this.gaps.concat(
                {
                    fill: card => this._cloze.replace(gapSeperator, ` ${card.text} `)
                });
            text = text + part + (idx === parts.length - 1 ? '' : gapSeperator);
        });
        this._cloze = text;
        this.element.innerText = text;
    }

    fillGap(card, gap = 0) {
        this.element.innerText = this.gaps[gap].fill(card);
    }
}