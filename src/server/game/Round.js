function Round(cloze, chooser) {
  this.cloze = cloze;
  this.chooser = chooser;
  this.cards = [];
}

Round.prototype.getChooser = function () {
  return this.chooser;
};

Round.prototype.confirmCard = function (player, card) {
  this.cards.push({ player: player, card: card });
};

Round.prototype.getUsedCards = function () {
  return this.cards;
};

Round.prototype.getUsedCloze = function () {
  return this.cloze;
};

module.exports = Round;