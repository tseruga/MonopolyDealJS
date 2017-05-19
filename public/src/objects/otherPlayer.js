var PIXI = require('pixi.js');
var Utils = require('../utils.js');
var OtherPlayerHandUI = require('../ui/objects/otherPlayerHandUI.js');

class OtherPlayer {
  constructor(game, playerN, boardPosition) {
    this.game = game;

    this.socketId = playerN.socketId;
    this.bank = playerN.bank;
    this.cardsInHand = playerN.cardsInHand;
    this.properties = playerN.properties;

    this.boardPosition = boardPosition;

    this.handUI = new OtherPlayerHandUI(this.game, this.boardPosition);
  }

  updateState(playerN) {
    this.bank = playerN.bank;
    this.cardsInHand = playerN.cardsInHand;
    this.properties = playerN.properties;
    this.handUI.updateState(this.cardsInHand);
  }

}

module.exports = OtherPlayer;