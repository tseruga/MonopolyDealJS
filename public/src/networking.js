var Socket = require('socket.io-client');

class Networking {
  constructor(game) {
    this.game = game;

    this.attachListenerEvents();
  }

  attachListenerEvents() {

    this.socket = io();
    var _this = this;

    /***
    Client is listening for these events and acts accordingly when it hears them
    ***/
    this.socket.on("gameStart", function(serializedState) {
      _this.game.gameStart(serializedState);
    });

    this.socket.on("updateState", function(serializedState) {
      _this.game.updateState(serializedState);
    });

    this.socket.on("cardDealt", function(cardN) {
      console.log("Got card");
      _this.game.activePlayer.dealTo(cardN);
    });

    this.socket.on("moveCardFromHandToDiscard", function(cardN) {
      console.log("Discarded card");
      _this.game.activePlayer.discard(cardN);
      // The moving to the actual discard pile will occur for everyone at the
      // same time through the updateState() function
    });

    this.socket.on("moveCardFromHandToBank", function(cardN) {
      console.log("Moved card to bank");
      _this.game.activePlayer.bankCard(cardN);
    });

    this.socket.on("moveCardFromHandToProperties", function(cardN) {
      console.log("Moved card to properties");
      _this.game.activePlayer.addProperty(cardN);
    });

    this.socket.on("actionNotResolved", function() {
      console.log("Server is now waiting for something to be resolved...");
      _this.game.awaitingServerResponse = true;
      _this.game.activePlayer.awaitingResponse();
    });

    this.socket.on("actionResolved", function() {
      console.log("Server is no longer waiting for something to be resolved...");
      _this.game.awaitingServerResponse = false;
      _this.game.activePlayer.stopAwaitingResponse();
    });

    this.socket.on("makePayment", function(message) {
      console.log("Being told to make a payment...");
      _this.game.activePlayer.makePayment(message);
    });

    this.socket.on("actionNoed", function(socketId) {
      console.log("Being asked if they'd like to accept the no");
      _this.game.activePlayer.acceptActionResult(socketId);
    });

    this.socket.on("targetedByAction", function() {
      console.log("Selected for a sly deal steal...")
      _this.game.activePlayer.acceptActionResult();
    })

    this.socket.on("justSayNoPlayed", function() {
      console.log("Someone played a just say no card");
      // [TODO] Add a check if the client has a dialogue open before minimizing
      _this.game.activePlayer.hidePayment();
    });

    this.socket.on("continuePayment", function() {
      console.log("Continuing payment...");
      _this.game.activePlayer.continuePayment();
    });

    this.socket.on("itsYourTurn", function() {
      console.log("It's my turn!");
      _this.game.activePlayer.beginTurn();
    });

    this.socket.on('selectSlyDealProperty', function() {
      console.log("Being told to select a property to steal (Sly Deal)");
      _this.game.activePlayer.selectSlyDealProperty();
    })

  }

  /***
  Messages the client is allowed to send to the server
  ***/
  moveCardFromHandToDiscard(card) {
    this.socket.emit("moveCardFromHandToDiscard", card.uniqueName);
  }

  moveCardFromHandToBank(card) {
    this.socket.emit("moveCardFromHandToBank", card.uniqueName);
  }

  moveCardFromHandToProperties(card) {
    this.socket.emit("moveCardFromHandToProperties", card.uniqueName);
  }

  startGameButtonPressed() {
    this.socket.emit("startGameButtonPressed");
  }

  makePayment(cards) {
    var cardList = [];
    cards.map(function(card) {
      cardList.push(card.uniqueName);
    });
    this.socket.emit("makePayment", cardList);
  }

  playedNo(card) {
    console.log("Player said NO!");
    this.socket.emit("playedNo", card);
  }

  acceptedAction() {
    console.log("Player accepted result of action");
    this.socket.emit("acceptActionResult");
  }

  endTurn() {
    console.log("Player is ending their turn");
    this.socket.emit("endTurn");
  }

  selectedPropertyToSteal(cards) {
    console.log("Player selected their properties")
    this.socket.emit("selectedPropertyToSteal");
  }

}

module.exports = Networking;