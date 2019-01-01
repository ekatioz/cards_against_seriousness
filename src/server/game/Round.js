function Round(players,chooser) {
    this.players = players;
    this.chooser = chooser;
  }

  Round.prototype.setCloze = function(cloze) {
    this.cloze = cloze;
  };

  Round.prototype.getPlayers = function() {
    return this.players.filter(p => p !== this.chooser);
  };

  Round.prototype.getChooser = function() {
    return this.chooser;
  };

  module.exports = Round;