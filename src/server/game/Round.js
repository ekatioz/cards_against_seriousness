function Round(master) {
  this.master = master;
  this.cards = [];
  this.confirmationPromise;
}

Round.prototype.getMaster = function() {
  return this.master;
};

Round.prototype.confirmCards = function(player, cards) {
  this.cards.push({ player: player, cards });
};

Round.prototype.getConfirmedCards = function() {
  return this.cards;
};

module.exports = Round;
