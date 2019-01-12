function Round(cloze, master) {
  this.cloze = cloze;
  this.master = master;
  this.cards = [];
  this.confirmationPromise;
}

Round.prototype.getMaster = function () {
  return this.master;
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