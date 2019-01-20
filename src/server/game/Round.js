function Round(master) {
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

Round.prototype.getConfirmedCards = function () {
  return this.cards;
};

module.exports = Round;