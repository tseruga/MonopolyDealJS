var PIXI = require('pixi.js');
var Utils = require('../utils.js');

class DiscardPile {

  constructor(game) {
    this.game = game;
    this.cards = [];

    this.sprite = new PIXI.Sprite.fromImage(
      Utils.buildImagePath('cardback.jpg')
    );

    this.sprite.x = 700;
    this.sprite.y = 100;
    this.sprite.scale.set(0.5);
    this.game.stage.addChild(this.sprite);

  }

  updateTopCardSprite() {
    // Only update if there are cards in the discard pile
    if (this.cards.length > 0) {
      var texture = PIXI.Texture.fromImage(
        Utils.buildImagePath(this.cards[this.cards.length - 1].imageName)
      );
      this.sprite.texture = texture;
    }
  }

  // Given the state of the discard pile from the server, update client
  updateState(parsedDiscard) {
    this.cards = parsedDiscard.cards;
    this.updateTopCardSprite();
  }

}

module.exports = DiscardPile;