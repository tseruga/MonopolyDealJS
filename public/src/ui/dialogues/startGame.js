var PIXI = require('pixi.js');

class StartGame {

  constructor(game) {
    var _this = this;
    this.game = game;

    var button = new PIXI.Graphics();
    button.interactive = true;
    button.buttonMode = true;
    button.lineStyle(2, 0x0000FF, 1);
    button.beginFill(0xFF700B, 1);
    button.drawRect(0, 0, 30, 30);
    button.on('click', function() {
      _this.game.network.startGameButtonPressed();
    });

    this.game.stage.addChild(button);
  }

}

module.exports = StartGame;