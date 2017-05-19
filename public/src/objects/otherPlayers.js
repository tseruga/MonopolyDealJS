var OtherPlayer = require('./otherPlayer.js');

class OtherPlayers {

  constructor(game, parsedPlayers) {

    var _this = this;
    this.game = game;
    this.players = [];

    var boardPosition = 0;
    parsedPlayers.map(function(playerN) {
      // Only allow non-active players to be added here
      if ( _this.game.network.socket.id != playerN.socketId ) {
        console.log("!! Spawning new player !!");
        console.log(boardPosition);
        _this.players.push(new OtherPlayer(_this.game, playerN, boardPosition++))
      }
    });

  }

  updateState(parsedPlayers) {
    var _this = this;

    parsedPlayers.map(function(playerN) {
      if ( _this.game.network.socket.id != playerN.socketId ) {

        for ( let i = 0; i < _this.players.length; i++ ) {

          if ( playerN.socketId == _this.players[i].socketId ) {
            _this.players[i].updateState(playerN);
          }

        }
      }

    });
  }

}

module.exports = OtherPlayers;