var PIXI = require('pixi.js');

// [TODO] Need to disable end turn button while the server is waiting for responses

class EndTurn {
  constructor(game) {
    var _this = this;
    this.game = game;

    this.container = new PIXI.Container();
    this.container.x = 700;
    this.container.y = 0;

    var btn = new PIXI.Graphics();
    btn.lineStyle(2, 0x000000, 1);
    btn.beginFill(0xFFFFFF, 1);
    btn.drawRect(100, 100, 100, 100);
    btn.interactive = true;
    btn.buttonMode = true;
    btn.on('click', function() {
      _this.game.network.endTurn();
      _this.game.stage.removeChild(_this.container);
    });

    this.container.addChild(btn);
    this.game.stage.addChild(this.container);
  }
}

module.exports = EndTurn;