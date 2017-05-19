var PropertiesList = require('./propertiesN.js');

// Network Player Class
class PlayerN {

  constructor(socketId) {
    this.socketId = socketId;
    this.cards = [];
    this.bank = [];
    this.properties = new PropertiesList();
  }

  dealTo(cardN) {
    this.cards.push(cardN);
  }

  addToBank(cardN) {
    this.bank.push(cardN);
  }

  addToProperties(cardN) {
    this.properties.addProperty(cardN);
  }

  removeCard(cardUniqueName) {
    for (let i = 0; i < this.cards.length; i++) {
      if (this.cards[i].uniqueName == cardUniqueName) {
        var cardToBeRemoved = this.cards[i];
        this.cards.splice(i, 1);
        return cardToBeRemoved;
      }
    }
  }

  serialize() {
    return {
      socketId: this.socketId,
      properties: this.properties,
      bank: this.bank,
      cardsInHand: this.cards.length
    };
  }

}

module.exports = PlayerN;