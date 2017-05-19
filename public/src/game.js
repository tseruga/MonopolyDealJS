var PIXI = require('pixi.js');
var Socket = require('socket.io-client');
var EventEmitter = require('events').EventEmitter;

var Networking    = require('./networking.js'),
    Card          = require('./objects/card.js'),
    ActivePlayer  = require('./objects/activePlayer.js'),
    DiscardPile   = require('./objects/discardPile.js'),
    StartGame     = require('./ui/dialogues/startGame.js'),
    OtherPlayers  = require('./objects/otherPlayers.js'),
    Dialogues     = require('./ui/dialogues/dialogues.js');


class Game extends EventEmitter {

  constructor(element) {
    super();

    // Attach to the document body and add our PIXI display to the page
    this._element = element;
    this.stage = new PIXI.Container();
    this.renderer = PIXI.autoDetectRenderer( 1280, 768, null, false, true );
    this.renderer.backgroundColor = 0x3ba064;
    this._element.appendChild( this.renderer.view );

    this._lastFrameTime = 0;
    this.gameStarted = false;

    // Is this client currently waiting for the server/other players to make
    // a move?
    this.awaitingServerResponse = false;

    // Load the appropriate image files
    this._load();

    // Spawn client connection manager
    this.network = new Networking(this); // Networking manager

    // Spawn start game button
    this.startGameUI = new StartGame(this);

    // Spawn dialogue box manager
    this.dialogues = new Dialogues(this);

    requestAnimationFrame( this._tick.bind( this ) );
  }

  gameStart(serializedState) {
    var _this = this;

    // We have started the game
    this.gameStarted = true;

    // Parse the state message
    var parsedPlayers = JSON.parse(serializedState.players);

    // Spawn instances of game objects for this client
    this.activePlayer = new ActivePlayer(this, parsedPlayers); // The client's player object
    this.discardPile = new DiscardPile(this); // Discard pile
    this.otherPlayers = new OtherPlayers(this, parsedPlayers); // The other players who aren't the client
    console.log(this.otherPlayers);
  }

  updateState(serializedState) {
    console.log(serializedState);
    // Parse the state message
    var parsedPlayers = JSON.parse(serializedState.players);
    var parsedDiscard = JSON.parse(serializedState.discardPile);

    if (this.gameStarted) {
      this.activePlayer.updatePlayerState(parsedPlayers);
      this.discardPile.updateState(parsedDiscard);
      this.otherPlayers.updateState(parsedPlayers);
    }
  }

  _load( ) {
    PIXI.loader
      .add( require( "../config/image_paths.json" ) );
  }

  _tick( currentTime ) {
    this.emit( 'update', currentTime - this._lastFrameTime, currentTime );

    this._lastFrameTime = currentTime;

    this.renderer.render( this.stage );

    requestAnimationFrame( this._tick.bind (this) )
  }

}

module.exports = Game;