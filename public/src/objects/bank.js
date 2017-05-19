var Card = require('./card.js');

class Bank {
  constructor(game) {
      this.game = game;
      this.cards = [];
  }

  addCard(cardN) {
    var newCard = new Card(this.game, cardN);
    this.cards.push(newCard);
  }
}

module.exports = Bank;