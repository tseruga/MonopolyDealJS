var CardN = require('./cardN.js');

class DeckN {

  constructor() {
    this.cards = [];
    this.loadCards();
  }

  loadCards() {
    var cardList = require('./config/card_list.json');

    var _this = this;
    cardList.map( function(card) {
      for (var i = 0; i < card.quantity; ++i) {
        _this.cards.push(new CardN(
          card.name,
          card.name + i,
          card.value,
          card.color || "NoColor",
          card.type,
          card.imageName
        ));
      }
    });
  }

  dealCard() {
    return this.cards.pop();
  }

}

module.exports = DeckN;