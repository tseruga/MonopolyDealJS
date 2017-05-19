var PIXI = require('pixi.js');

const cardVerticalOffset = 20;
const cardHorizontalOffset = 10;
const cardBufferSize = 10;
const handZoneWidth = 920;
const handZoneHeight = 230;

class HandUI {
  constructor(game) {
    this.game = game;

    this.container = new PIXI.Container();

    this.container.x = (this.game.renderer.width - handZoneWidth) / 2;
    this.container.y = this.game.renderer.height - handZoneHeight;

    // The container that actually contains the cards
    this.cardContainer = new PIXI.Container();
    this.cardContainer.y = cardVerticalOffset;
    this.cardContainer.x = cardHorizontalOffset;
    this.container.addChild(this.cardContainer);

    this.game.stage.addChild(this.container);
  }

  clearContainer(container) {
    while(container.children[0]) {
      console.log("Killing children");
      container.removeChild(container.children[0]);
    }
  }

  resizeHand(cards) {
    // Destroy the cards currently being shown
    this.clearContainer(this.cardContainer);

    // Go through and re-add all of the cards
    var _this = this;

    var totalAvailArea = handZoneWidth - (2 * cardHorizontalOffset);
    var areaPerCard = (totalAvailArea / cards.length) - 4; // Magic numbers!

    var distanceBetweenCards = 0
    // In this case, cards will never overlap just display them left to right
    // spaced close together
    if (cards.length <= 7) {
      distanceBetweenCards = 129;
    // In this case, cards begin to overlap so dynamically change the space
    // between them
    } else {
      distanceBetweenCards = areaPerCard;
    }

    var xOffset = 0;
    cards.map(function(card) {
      card.sprite.x = xOffset;
      xOffset += distanceBetweenCards;
      _this.cardContainer.addChild(card.sprite);
    });
  }
}

module.exports = HandUI;