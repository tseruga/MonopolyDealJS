var Card = require('./card.js');
var Utils = require('../utils.js');
var Hand = require('./hand.js');
var Bank = require('./bank.js');
var Properties = require('./properties.js');

class ActivePlayer {

  constructor(game, playerNs) {

    this.game = game;

    var playerN = this.extractThisPlayer(playerNs);
    this.hand = new Hand(this.game);
    this.properties = new Properties(this.game, playerN.properties);
    this.bank = new Bank(this.game);
  }

  beginTurn() {
    console.log("Beginning turn...")
    this.game.dialogues.spawnEndTurnButton();
  }

  dealTo(cardN) {
    this.hand.addCard(cardN);
  }

  bankCard(cardN) {
    this.hand.removeCard(cardN);
    this.bank.addCard(cardN);
  }

  addProperty(cardN) {
    this.hand.removeCard(cardN);
    this.properties.addProperty(cardN);
  }

  discard(cardN) {
    this.hand.removeCard(cardN);
  }

  makePayment(message) {
    this.game.dialogues.spawnPaymentDialogue("asdf", 100);
    console.log(message);
  }

  hidePayment() {
    this.game.dialogues.hidePaymentDialogue();
  }

  continuePayment() {
    this.game.dialogues.unhidePaymentDialogue();
  }

  acceptActionResult(message) {
    this.game.dialogues.spawnAcceptActionDialogue();
  }

  selectSlyDealProperty() {
    this.game.dialogues.spawnSlyDealSelection();
  }

  awaitingResponse() {
    this.game.dialogues.spawnAwaitingResponseDialogue();
  }

  stopAwaitingResponse() {
    this.game.dialogues.closeAwaitingResponseDialogue();
  }

  // Given a list of all players, find the one you actually are
  extractThisPlayer(playerNs) {
    for (let i = 0; i < playerNs.length; i++) {
      if (this.game.network.socket.id == playerNs[i].socketId) {
        return playerNs[i];
      }
    }
  }

  updatePlayerState(playerNs) {
    var playerN = this.extractThisPlayer(playerNs);
    this.properties.updateState(playerN.properties.propertiesList);
  }

}

module.exports = ActivePlayer;