var Utils = require('../utils.js');
var Card = require('./card.js');
var HandUI =  require('../ui/objects/handUI.js');

class Hand {

  constructor(game) {
    var _this = this;

    this.game = game;
    this.cards = [];
    this.ui = new HandUI(this.game);
  }

  addCard(cardN) {
    var newCard = new Card(this.game, cardN);
    this.attachEvents(newCard);
    this.cards.push(newCard);
    this.ui.resizeHand(this.cards);
  }

  removeCard(cardN) {
    // Find this card in the hand
    for (let i = 0; i < this.cards.length; i++) {
      if (this.cards[i].uniqueName == cardN.uniqueName) {
        // Remove it from the list of cards in hand
        this.cards.splice(i, 1);

        this.ui.resizeHand(this.cards);
      }
    }
  }

  attachEvents(card) {
    card.sprite.interactive = true;
    card.sprite.buttonMode = true;

    card.sprite.on('click', this.cardOnClickEvent.bind(this, card));
  }

  /***
  Events for cards in hand
  ***/
  cardOnClickEvent(card, e) {
    // [TODO] Introduce a dialogue window to allow players to choose which action
    // they'd like to use the card for (bank it, play it)
    switch (card.type) {
      case "money":
        this.game.network.moveCardFromHandToBank(card);
        break;
      case "property":
        this.game.network.moveCardFromHandToProperties(card);
        break;
      case "action":
        this.game.network.moveCardFromHandToDiscard(card);
        break;
    }
  }

  /***
  Networking functions
  ***/

}

module.exports = Hand;