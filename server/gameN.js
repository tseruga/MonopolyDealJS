var PlayerN =      require('./playerN.js'),
    CardN =        require('./cardN.js'),
    DeckN =        require('./deckN.js'),
    DiscardPileN = require('./discardPileN.js');

class GameN {

  constructor() {
    this.players = [];
    this.deck = new DeckN();
    this.discardPile = new DiscardPileN();
  }

  removePlayer(socket) {
    for ( let i = 0; i < this.players.length; i++ ) {
      if ( this.players[i].sessionID == socket.id ) {
        this.players.splice(i, 1);
        return;
      }
    }
  }

}

module.exports = GameN;