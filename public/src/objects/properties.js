var Card = require('./card.js');
var PropertiesUI = require('../ui/objects/propertiesUI.js');

class Properties {
  constructor(game, propertySkeleton) {
    this.game = game;
    this.propertiesList = propertySkeleton.propertiesList;

    this.ui = new PropertiesUI(this.game, this.propertiesList);
  }

  addProperty(cardN) {
    var newCard = new Card(this.game, cardN);
    this.propertiesList[newCard.color].cards.push(newCard);
  }

  updateState(properties) {
    this.ui.updateProperties(properties);
  }
}

module.exports = Properties;