function Round(players,chooser,cloze) {
    this.players = players;
    this.chooser = chooser;
    this.cloze = cloze;
  }
  // class methods
  Round.prototype.foo = function() {
    console.log(this.cloze);
  };
  // export the class
  module.exports = Round;