/***
Action cards can be split into the following categories:

Make players pay:
  - Make all players pay:
    (These are the only actions that affect EVERYONE at the same time)
      It's My Birthday [X]
      Rent
  - Make one player pay:
      Multi-colored Rent
      Debt Collector

Take properties from player:
  - No swapping
      Deal Breaker
      Sly Deal [X]
  - Swapping
      Forced Deal

Property Modifiers (these won't go here as they are their own class of actions):
  - Go into property bucket
      House
      Hotel
  - Go into modifiers bucket
      Property Wild Card (2)
      Property Wild Card (All)

Comboing Required:
  - Against any action directed towards you
      Just Say No (Built into all other interactions)
  - With a rent card
      Double the Rent ([TODO] Built into Renting action)

Other:
  Pass Go [X]

***/

class ActionManager {

  constructor(gsc) {
    this.gsc = gsc;
    this.reset();
  }

  reset() {
    this.actionType = null;
    // Who played the action? (their socket)
    this.actionPlayer = null;
    // In the case of action cards requiring payment,
    // which players are paying? (Their sockets)
    this.playersPaying = [];
    // Who played the Just Say No? (their socket)
    this.noPlayer = null;
    // Who is the Just Say No played in response to?
    this.noPlayedToPlayer = null;
    // Is the server currently looping, waiting for players?
    this.actionResolved = true;
    // How many makePayment events have we gotten from clients?
    this.paymentsMade = 0;
    // Store payment information
    this.paymentLeger = [];
    // Is the action still valid (no users nullified action with Just Say No)
    this.actionValid = true;
  }

  connectToSocketManager(sm) {
    this.sm = sm;
  }

  // Determine which steps need to be done in order to handle this action card
  // Then do them!
  handleAction(socket, cardN) {

    this.actionPlayer = socket;

    switch(cardN.name) {
      case "ItsMyBirthday":
        this.actionType = "payment";
        this.makeAllButActionPay(this.actionPlayer.id);
        this.requestPayment(2);
        break;
      case "SlyDeal":
        console.log("SlyDeal Played");
        this.actionType = "stealing";
        this.stealProperty("SlyDeal");
        break;
      case "DealBreaker":
        console.log("DealBreaker played");
        this.actionType = "stealing";
        this.stealProperty("DealBreaker");
        break;
      case "ForcedDeal":
        console.log("ForcedDeal played");
        this.actionType = "stealing";
        this.stealProperty("ForcedDeal");
        break;
      case "PassGo":
        console.log("PassGo played");
        this.actionType = "other";
        this.passGo();
        break;
      default:
        console.log("Unknown action card played");
        break;
    }
  }

  passGo() {
    // Deal 2 cards to the action card player
    this.gsc.dealCardTo(this.actionPlayer.id);
    this.gsc.dealCardTo(this.actionPlayer.id);
  }

  stealProperty(actionName) {
    var _this = this;
    this.actionResolved = false;

    // Tell everyone that the server is about to start waiting for things to be
    // done by other players
    this.sm.emit("actionNotResolved");

    // Tell the action player to go ahead and select the property to steal
    if (actionName == "DealBreaker") {
      // [TODO] Finish this on client side
      this.sm.emitTo(this.actionPlayer.id,
                     "selectDealBreakerProperties");
    } else if (actionName == "SlyDeal") {
      this.sm.emitTo(this.actionPlayer.id,
                     "selectSlyDealProperty");
    } else if (actionName == "ForcedDeal") {
      // [TODO] Finish this on client side
      this.sm.emitTo(this.actionPlayer.id,
                      "selectForcedDealProperty");
    }

    // Now wait for this action to be resolved before continuing
    this.pollForResolution(function() {
      console.log("Action resolved");
      console.log("Is the property stolen?")
      console.log(_this.actionValid);

      // Tell everyone that the server is no longer waiting for people to respond
      _this.sm.emit("actionResolved");

      // Update the game state to all users
      _this.sm.updateState();

      // Reset the state of this class to prep it for future actions
      _this.reset();
    });
  }

  selectedPropertyToSteal(card, targetId) {

    // [TODO] Actually have the action card player send a target
    targetId = this.gsc.game.players[1].socketId;

    // Just refresh everyone's notice that they are still waiting
    this.sm.emit("actionNotResolved");

    // Tell this player that they've been targeted by an action
    this.sm.emitTo(targetId, "targetedByAction");

  }

  // Request payment from other players for paymentAmount
  // REQUIRES: this.playersPaying to be set beforehand
  requestPayment(paymentAmount) {

    var _this = this;
    this.actionResolved = false;

    // Tell everyone that the server is about to start waiting for things to be
    // done by other players
    this.sm.emit("actionNotResolved");

    // Tell all players expected to pay that they are expected to pay
    this.playersPaying.map(function(player) {
      _this.sm.emitTo(player.socketId, 'makePayment', 'paymentInfo...');
    });

    // Now sit and wait until this action has been resolved
    var pollingForPayments = this.pollForResolution(function() {
      // Execute this code once all payments have been made

      // If a No was played to nullify this action
      if (!_this.actionValid) {
        // Resolve action
        _this.sm.emit("actionResolved");

        // Update state
        _this.sm.updateState();

        // Reset this class
        _this.reset();

        return;
      }

      // If we got here, payment is valid so handle it as such

      // Go through the payment leger and process each entry
      for (let i = 0; i < _this.paymentLeger.length; i++) {
        var thisEntry = _this.paymentLeger[i];
        if (thisEntry.action === 'lose') {
          _this.loseCardsLegerAction(thisEntry);
        }
        if (thisEntry.action === 'get') {
          _this.getCardsLegerAction(thisEntry);
        }
      }

      // Reset the state of this class to prep it for future actions
      _this.reset();
    });

  }

  // Function to process a payment leger entry that states a player is losing
  // cards. Goes through all available cards from a player and removes cards
  loseCardsLegerAction(legerEntry) {
    var    id = legerEntry.id,
        cards = legerEntry.cards;

    // Find the player associated with this ID
    var playerIdx = this.gsc.findPlayerIndex(id);
    var player = this.gsc.game.players[playerIdx];

    // Now iterate through each card and remove it from where it is
    cards.map(function(card) {
      THIS IS WHERE I LEFT OFF 
    })
  }

  // Function to process a payment leger entry that states a player is getting
  // cards. Automatically adds cards to the appropriate places.
  getCardsLegerAction(legerEntry) {
    var    id = legerEntry.id,
        cards = legerEntry.cards;
  }

  // A player has made a payment
  paymentMade(socket, cards) {
    console.log("Payment made...")
    console.log(cards);

    // We know of an additional payment
    this.paymentsMade += 1

    // Let the players know so then can update their UI
    this.sm.emit("paymentKnown");

    // User who made payment is going to lose the cards, so add an item to the
    // payment leger
    var loseCards = {
      'id': socket.id,
      'action': 'lose',
      'cards': cards
    };

    this.paymentLeger.push(loseCards);

    // Action player gets these cards, so add another item to the payment leger
    var getCards = {
      'id': this.actionPlayer.id,
      'action': 'get',
      'cards': cards
    };

    this.paymentLeger.push(getCards);

    // Was this the last response needed?
    if ( this.paymentsMade == this.playersPaying.length ) {
      this.actionResolved = true;
    }
  }

  // Check every 500ms if the action has been resolved
  pollForResolution(callback) {
    var _this = this;
    var timer = setInterval(function() {
      if ( _this.actionResolved ) {
        callback();
        clearTimeout(timer);
      }
    }, 500);
  }



  playedNo(socket, card) {
    console.log("Player played a Just Say No!");

    // If there hasn't been a Just Say No played before this one, then the
    // Just Say No is played against the action card player (normal case)
    if ( this.noPlayer == null ) {
      this.noPlayedToPlayer = this.actionPlayer;
    }
    // If there has already been a Just Say No played, then the last person
    // to play one is the recipient of the new Just Say No (No'ing No's forver...)
    else {
      this.noPlayedToPlayer = this.noPlayer;
    }

    // The new player of Just Say No is obviously the person who
    // just sent this request
    this.noPlayer = socket;

    // Flip the value of whether or not payments are valid
    // (They are valid on even number of playings of Just Say Nos)
    this.actionValid = !this.actionValid;

    // Let the players know about it
    this.sm.emit("justSayNoPlayed");

    // Tell the player who played the Just Say No was played against that
    // action was no'd
    this.sm.emitTo(this.noPlayedToPlayer.id, 'actionNoed', socket.id);
  }

  // Player has accepted the outcome of the action card
  // (This might occur after a chain of Just Say No cards being played)
  acceptActionResult(socket) {

    // Is this an action dealing with paying?
    if (this.actionType == "payment") {
      // If payments aren't valid, it doesn't really matter if we collected all
      // of the payments, just end the action early.
      if (!this.actionValid) {
        this.actionResolved = true;
      } else {
      // If payments are valid, emit to all players who are expected to be paying
      // that they still need to pay.
        var _this = this;
        this.playersPaying.map(function(player) {
          _this.sm.emitTo(player.socketId, 'continuePayment');
        });
      }
    } else {
      this.actionResolved = true;
    }

  }

  // Set the players paying to everyone except for the action card player
  makeAllButActionPay(actionPlayerId) {
    for (let i = 0; i < this.gsc.game.players.length; i++) {
      if (actionPlayerId != this.gsc.game.players[i].socketId) {
        this.playersPaying.push(this.gsc.game.players[i]);
      }
    }
  }

}

module.exports = ActionManager;