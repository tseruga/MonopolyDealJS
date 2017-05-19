var PIXI = require('pixi.js');
var Utils = require('../utils.js');

class Card {

  constructor(game, cardN) {
    // Attach to game object
    this.game = game;

    // Load properties from the network instance of this card
    this.name = cardN.name;
    this.uniqueName = cardN.uniqueName;
    this.value = cardN.value;
    this.color = cardN.color;
    this.type = cardN.type;
    this.imageName = cardN.imageName;

    // Create sprite for this card
    this.sprite = new PIXI.Sprite.fromImage(
      Utils.buildImagePath(this.imageName)
    );
    this.sprite.scale.set(0.5);
  }

}

module.exports = Card;