function Round(master, cloze) {
  this.master = master;
  this.cards = [];
  this.confirmationPromise;
  this.desiredWhitecards = 0;
  var regex = /%w/gi,
    result;
  while ((result = regex.exec(cloze))) {
    this.desiredWhitecards++;
  }
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

Round.prototype.getDesiredWhitecards = function() {
  return this.desiredWhitecards;
};

module.exports = Round;
