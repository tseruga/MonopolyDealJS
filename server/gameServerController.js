var GameN = require('./gameN.js'),
    PlayerN = require('./playerN.js'),
    ActionManager = require('./actionManager.js');

const MAX_ACTIONS = 3;
/***
Class that handles the core game logic (in the sense of an authoritative server)
All actions pass through this class (GSC) before any lasting game state changes
are made (and therefore reflected to the other clients)
***/
class GameServerController {

  constructor() {
    this.actionManager = new ActionManager(this);
    this.gameStarted = false;
    this.turnIdx = 0;
    this.actionsUsed = 0;
  }

  connectToSocketManager(sm) {
    this.sm = sm;
    this.actionManager.connectToSocketManager(sm);
  }

  // Initialize this game, set the state to an empty state
  start() {
    this.game = new GameN();
  }

  // Actually start the game
  startGame() {
    this.gameStarted = true;

    // Tell clients that the game is starting and that they can make
    // assumptions about the game state from its current state
    // (how many players, etc.)
    this.sm.emit("gameStart", this.serialize());

    var _this = this;
    this.sm.clients.map(function(socket) {
      for (let i = 0; i < 5; i++) {
        // Give the card to the player in the server state
        _this.dealCardTo(socket.id);
      }
    });

    this.beginTurn();

    // Since cards were dealt, state has changed
    this.sm.updateState();
  }

  // Add a player to the game
  addPlayer(socket) {
    var newPlayer = new PlayerN(socket.id);
    this.game.players.push( newPlayer );
    return newPlayer;
  }

  dealCardTo(socketId) {
    // Get the card to deal
    var cardN = this.game.deck.dealCard();

    var playerIdx = this.findPlayerIndex(socketId);
    this.game.players[playerIdx].dealTo(cardN);

    this.sm.emitTo(socketId, 'cardDealt', cardN);

    this.sm.updateState();
  }

  // Reverse lookup player's index in gameN player array using socket id
  findPlayerIndex(socketId) {
    for (let i = 0; i < this.game.players.length; i++) {
      if (this.game.players[i].socketId == socketId) {
        return i;
      }
    }
  }

  isPlayersTurn(pIdx) {
    return (pIdx == this.turnIdx)
  }

  // Remove a player from the game
  removePlayer(socket) {
    this.game.removePlayer(socket);
  }

  incrementActionCounter(socket) {
    this.actionsUsed += 1;
    //[TODO] User isn't currently listening for this
    this.sm.emitTo(socket.id,
                  'incrementActionCounter',
                  this.actionsUsed,
                  MAX_ACTIONS);
  }

  beginTurn() {
    // Reset the number of actions used so far
    this.actionsUsed = 0;

    // Tell the current player that it's their turn
    var currentPlayerId = this.game.players[this.turnIdx].socketId;
    this.sm.emitTo(currentPlayerId, 'itsYourTurn');

    // Deal cards to the current player
    // [TODO] Check how many cards the player is supposed to get
    var numCardsToDeal = 2;
    for (let i = 0; i < numCardsToDeal; i++) {
      this.dealCardTo(currentPlayerId);
    }

    //[TODO] Emit to all other players whose turn it is
  }

  endTurn() {
    this.turnIdx += 1;
    this.turnIdx = this.turnIdx % this.game.players.length;
    this.beginTurn()
  }

  moveCardFromHandToDiscard(socket, cardUniqueName) {
    var pIdx = this.findPlayerIndex(socket.id);

    if (this.isPlayersTurn(pIdx) && this.actionsUsed < MAX_ACTIONS) {
      // This counts as an action
      this.incrementActionCounter(socket);

      // Remove the card from the player's hand
      var cardN = this.game.players[pIdx].removeCard(cardUniqueName)

      // Move the card to the discard pile
      this.game.discardPile.addCard(cardN);

      // Tell this user that their request was valid and that they actually
      // discarded the card
      socket.emit("moveCardFromHandToDiscard", cardN);

      // Game state changed, so emit it
      // This first emission will show the card going to the discard pile and
      // leaving the player's handle. The action hasn't been handled yet.
      this.sm.updateState();

      // Now we handle the action that the card is meant to do
      if (cardN.type === "action") {
        this.actionManager.handleAction(socket, cardN);
      } else {
        console.log("[Illegal action just occured]");
        console.log("[" + cardN.name + "] attempted to be played as action"
          + " with type [" + cardN.type + "]");
      }
    }

  }

  moveCardFromHandToBank(socket, cardUniqueName) {
    var pIdx = this.findPlayerIndex(socket.id);

    if (this.isPlayersTurn(pIdx) && this.actionsUsed < MAX_ACTIONS) {
      // This counts as an action
      this.incrementActionCounter(socket);

      // Remove the card from the player's hand
      var cardN = this.game.players[pIdx].removeCard(cardUniqueName);

      // Add it to their bank
      this.game.players[pIdx].addToBank(cardN);

      // Tell the user that their request was valid and that they added
      // their card to their bank
      socket.emit("moveCardFromHandToBank", cardN);

      // Game state changed, so emit it
      this.sm.updateState();
    }

  }

  moveCardFromHandToProperties(socket, cardUniqueName) {
    var pIdx = this.findPlayerIndex(socket.id);

    if (this.isPlayersTurn(pIdx) && this.actionsUsed < MAX_ACTIONS) {
      // This counts as an action
      this.incrementActionCounter(socket);

      // Remove card from player's hand
      var cardN = this.game.players[pIdx].removeCard(cardUniqueName);

      // Add it to their properties
      this.game.players[pIdx].addToProperties(cardN);

      // Tell the user their request was valid and that their card is now
      // in their properties
      socket.emit("moveCardFromHandToProperties", cardN);

      // Game state changed, so emit it
      this.sm.updateState();
    }
  }

  // Serialize the game state so we can send it to the connected clients and
  // they can update their game state.
  // Manual serialization to keep only required data (minimizing packets sent)
  serialize() {
    var players = [];
    this.game.players.map(function(player) {
      players.push(player.serialize())
    });

    return {
      players: JSON.stringify(players),
      discardPile: JSON.stringify(this.game.discardPile)
    };
  }

}

module.exports = GameServerController;