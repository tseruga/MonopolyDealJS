var socketio = require("socket.io");
var gameServerController = require("./gameServerController.js")

/***
Class that handles simple client events and passes them to the appropriate
places.
***/
class SocketManager {

  // Initializes SocketManager
  constructor(gameServerController, io) {
    // Init the game server logic class
    this.gsc = gameServerController;
    this.gsc.connectToSocketManager(this);

    // Save this connection
    this.io = io;

    // Make a list of the clients that are currently connected
    this.clients = [];
  }

  // Handles the connection of a new user
  createUser(socket) {
    console.log("User " + socket.id + " connected");

    // Add this socket to our list of active clients
    this.clients.push(socket);

    // Attach events that can be instantiated by the client
    this.attachEvents(socket)

    // Add the user to the game
    var newPlayer = this.gsc.addPlayer(socket);

    // The game state has changed, let everyone know
    this.updateState();
  }

  // Attach events that the new user can activate.
  // These are mostly passed onto the GSC in order to check validity and update
  // the game state accordingly.
  attachEvents(socket) {

    var sm = this;

    // User disconnects from the server
    socket.on("disconnect", function() {
      console.log("User " + this.id + " disconnected...");
      sm.removeUser(this);
    });

    // User attempts to move card from hand to discard pile
    socket.on('moveCardFromHandToDiscard', function(cardUniqueName) {
      sm.gsc.moveCardFromHandToDiscard(this, cardUniqueName);
    });

    // User attempts to move card from hand to their bank
    socket.on('moveCardFromHandToBank', function(cardUniqueName) {
      sm.gsc.moveCardFromHandToBank(this, cardUniqueName);
    });

    // User attempts to move card from hand to their properties
    socket.on('moveCardFromHandToProperties', function(cardUniqueName) {
      sm.gsc.moveCardFromHandToProperties(this, cardUniqueName);
    });

    // User made a payment
    socket.on('makePayment', function(cards) {
      sm.gsc.actionManager.paymentMade(this, cards);
    });

    // User selected their property to steal with Sly Deal
    socket.on('selectedPropertyToSteal', function() {
      sm.gsc.actionManager.selectedPropertyToSteal();
    });

    // User played a Just Say No! card
    socket.on('playedNo', function(card) {
      sm.gsc.actionManager.playedNo(this, card);
    });

    // User accepted the outcome of their action card
    socket.on('acceptActionResult', function() {
      sm.gsc.actionManager.acceptActionResult();
    })

    socket.on('startGameButtonPressed', function() {
      sm.gsc.startGame();
    });

    socket.on('endTurn', function() {
      sm.gsc.endTurn();
    });
  }

  // Handles the disconnection of a user from the server
  removeUser(socket) {
    // Remove user from list of clients
    this.clients.splice(this.clients.indexOf(socket), 1);
    // Remove them from the game
    this.gsc.removePlayer(socket);
  }

  // To be called whenever the state of the game has been changed
  // Sends a message to all connected clients that their game needs to be
  // updated to reflect the new game state.
  updateState() {
    this.io.emit("updateState", this.gsc.serialize());
  }

  // Emit an event to a specific socketId
  emitTo(socketId, eventName, contents) {
    this.io.to(socketId).emit(eventName, contents);
  }

  // Emit an event to all connected socketIds
  emit(eventName, contents) {
    this.io.emit(eventName, contents);
  }

}

module.exports = SocketManager