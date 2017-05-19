var PIXI = require('pixi.js');

class AcceptAction {


  constructor(game) {
    var _this = this;

    this.game = game;
    this.dialogues = this.game.dialogues;
    this.activePlayer = this.game.activePlayer;

    this.container = new PIXI.Container();
    var box = new PIXI.Graphics();
    box.lineStyle(2, 0x0000FF, 1);
    box.beginFill(0xFF700B, 1);
    box.drawRect(100, 100, 300, 200);

    var noBtn = new PIXI.Graphics();
    noBtn.lineStyle(2, 0x0000FF, 1);
    noBtn.beginFill(0xFF0000, 1);
    noBtn.drawRect(100, 100, 50, 50);
    noBtn.interactive = true;
    noBtn.buttonMode = true;
    noBtn.on('click', function() {
      // [TODO] Pass in card here, also discard it from user.
      _this.game.network.playedNo();
      // This player might now be waiting from the server
      _this.dialogues.spawnAwaitingResponseDialogue();
      // Remove this dialogue box
      _this.game.stage.removeChild(_this.container);
    })

    var acceptBtn = new PIXI.Graphics();
    acceptBtn.lineStyle(2, 0x0000FF, 1);
    acceptBtn.beginFill(0x00FF00, 1);
    acceptBtn.drawRect(250, 100, 50, 50);
    acceptBtn.interactive = true;
    acceptBtn.buttonMode = true;
    acceptBtn.on('click', function() {
      // [TODO] Pass in card here, also discard it from user.
      _this.game.network.acceptedAction();
      // This player might now be waiting from the server
      _this.dialogues.spawnAwaitingResponseDialogue();
      _this.game.stage.removeChild(_this.container);
    })

    this.container.addChild(box);
    this.container.addChild(noBtn);
    this.container.addChild(acceptBtn);
    this.game.stage.addChild(this.container);
  }

}

module.exports = AcceptAction;