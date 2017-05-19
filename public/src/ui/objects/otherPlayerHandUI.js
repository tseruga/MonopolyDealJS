var PIXI = require('pixi.js');
var Utils = require('../../utils.js');

const pi = 3.14159265359

const cardVerticalOffset = 2;
const cardHorizontalOffset = 10;
const cardBufferSize = 10;
const handZoneSize = 500;

class OtherPlayerHandUI {
  constructor(game, position) {
    this.game = game;
    this.position = position;
    this.container = new PIXI.Container();

    // Possible positions based on opponent position
    var xPoses = [(this.game.renderer.width - 920) / 2 - 65,
                  450,
                  (this.game.renderer.width - 135)];

    var yPoses = [100,
                  110,
                  185];

    this.rotationOfCards = [pi / 2, pi, 3 * pi / 2];

    this.container.x = xPoses[this.position];
    this.container.y = yPoses[this.position];

    // The container that actually contains the cards
    this.cardContainer = new PIXI.Container();
    this.container.addChild(this.cardContainer);

    this.game.stage.addChild(this.container);
  }

  updateState(cardsInHand) {
    this.cardsInHand = cardsInHand;

    // Redraw the proper number of cards
    this.resizeHand();
  }

  resizeHand() {
    // Erase all of the cards on screen currently
    this.clearContainer(this.cardContainer);

    // Go through and draw the appropriate number of cards
    var _this = this;

    var totalAvailArea = handZoneSize;
    var areaPerCard = (totalAvailArea / this.cardsInHand) - 4;

    var distanceBetweenCards = 0;
    if (this.cardsInHand <= 5) {
      distanceBetweenCards = 92;
    } else {
      distanceBetweenCards = areaPerCard;
    }

    var offset = 0;
    for (let i = 0; i < this.cardsInHand; i++) {
      var card = new PIXI.Sprite.fromImage(Utils.buildImagePath('cardback.jpg'));
      card.rotation = this.rotationOfCards[this.position];
      card.scale.set(0.35);
      if (this.position == 0 || this.position == 2) {
        card.y = offset;
        offset += distanceBetweenCards;
      } else {
        card.x = offset;
        offset += distanceBetweenCards;
      }
      this.cardContainer.addChild(card);
    }
  }

  clearContainer(container) {
    while(container.children[0]) {
      container.removeChild(container.children[0]);
    }
  }

}

module.exports = OtherPlayerHandUI;