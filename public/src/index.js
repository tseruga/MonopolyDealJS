var ioClient = require('socket.io-client')
var Game = require("./game.js")

window.onload = function() {
  // Start the game!
  new Game( document.body );
}
