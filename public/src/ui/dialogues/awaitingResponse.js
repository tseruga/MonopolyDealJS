var PIXI = require('pixi.js');

class AwaitingResponse {
  constructor(game) {
    var _this = this;
    this.game = game;
    this.dialogues = this.game.dialogues;

    this.container = new PIXI.Container();
    this.container.x = 200;
    this.container.y = 150;
    var box = new PIXI.Graphics();
    box.lineStyle(2, 0x000000, 1);
    box.beginFill(0xFFFFFF, 1);
    box.drawRect(0, 0, 300, 70);

    var text = new PIXI.Text("Awaiting for response from\nother players...",
                            {fontSize: 24, align: 'center'});
    text.x = 10;

    this.container.addChild(box);
    this.container.addChild(text);
    this.game.stage.addChild(this.container);
  }

  close() {
    this.game.stage.removeChild(this.container);
  }
}

module.exports = AwaitingResponse;