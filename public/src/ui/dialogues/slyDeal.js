var PIXI = require('pixi.js');

/***
UI element that spawns when a user goes to use a Sly Deal card
***/
class SlyDeal {
  constructor(game) {
    var _this = this;
    this.game = game;

    this.container = new PIXI.Container();

    var box = new PIXI.Graphics();
    box.lineStyle(2, 0x000000, 1);
    box.beginFill(0xAAAAAA, 1);
    box.drawRect(100, 100, 300, 200);
    box.interactive = true;
    box.buttonMode = true;
    box.on('click', function() {
      _this.game.network.selectedPropertyToSteal();
      _this.game.stage.removeChild(_this.container);
    });

    this.container.addChild(box);
    this.game.stage.addChild(this.container);
  }
}

module.exports = SlyDeal;