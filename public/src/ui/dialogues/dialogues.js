var PaymentDialogue = require('./paymentDialogue.js'),
    AcceptAction = require('./acceptAction.js'),
    AwaitingResponse = require('./awaitingResponse.js'),
    EndTurn = require('./endTurn.js'),
    SlyDealSelection = require('./slyDeal.js');

class Dialogues {

  constructor(game) {
    this.game = game;
    this.paymentDialogue = null;
    this.awaitingResponse = null;
    this.endTurn = null;
  }

  spawnEndTurnButton() {
    this.endTurn = new EndTurn(this.game);
  }

  spawnSlyDealSelection() {
    this.closeAwaitingResponseDialogue();
    this.slyDealSelection = new SlyDealSelection(this.game);
  }

  spawnPaymentDialogue(payToId, amountOwed) {
    this.closeAwaitingResponseDialogue();
    this.paymentDialogue = new PaymentDialogue(this.game, payToId, amountOwed)
  }

  hidePaymentDialogue() {
    this.spawnAwaitingResponseDialogue();
    if (this.paymentDialogue) {
      this.paymentDialogue.hide();
    }
  }

  unhidePaymentDialogue() {
    if (!this.paymentDialogue.hasPaid) {
      this.closeAwaitingResponseDialogue();
      this.paymentDialogue.unhide();
    }
  }

  spawnAcceptActionDialogue() {
    this.closeAwaitingResponseDialogue();
    var acceptAction = new AcceptAction(this.game);
  }

  spawnAwaitingResponseDialogue() {
    // Close one if it already exists (since we're responding to an event here,
    // it's possible some people have it open while others don't)
    this.closeAwaitingResponseDialogue();
    this.awaitingResponse = new AwaitingResponse(this.game);
  }

  closeAwaitingResponseDialogue() {
    if (this.awaitingResponse) {
      this.awaitingResponse.close();
    }
  }

}

module.exports = Dialogues;