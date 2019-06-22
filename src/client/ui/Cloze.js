import { UiElement } from "./UiElement";

const gapSeperator = "💣";
export class Cloze extends UiElement {
  constructor() {
    super();
    this.addClass("cloze");
  }

  setTextParts(parts) {
    let text = parts.replaceAll("%w", gapSeperator);
    this.element.innerText = text;
  }
}
