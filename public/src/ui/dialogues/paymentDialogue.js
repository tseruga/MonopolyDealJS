var PIXI = require('pixi.js');
var Utils = require('../../utils.js');

const dialogueHeight = 230;
// Used for finding available cards from properties object
const colorNames = ["Brown", "LightBlue", "Magenta", "Orange", "Red",
                    "Yellow", "Green", "Blue", "Black", "LightGreen"];

class PaymentDialogue {

  // payToId - socketId of the player we are paying to

  constructor(game, payToId) {
    var _this = this;

    this.game = game;
    this.dialogues = this.game.dialogues;
    this.payToId = payToId;
    this.activePlayer = this.game.activePlayer;
    this.hasPaid = false;

    // [TODO] Replace with actual number from server
    this.amountOwed = 10;

    // A copy of the card sprites, to be filled when we retrieve available cards
    this.availableCardSprites = []

    this.container = new PIXI.Container();

    this.messageContainer = new PIXI.Container();
    this.messageContainer.x = 160;
    this.messageContainer.y = this.game.renderer.height - dialogueHeight - 5;
    this.container.addChild(this.messageContainer);

    this.game.stage.addChild(this.container);

    this.spawnInitialAcceptOrNo();
  }

  spawnInitialAcceptOrNo() {
    var _this = this;

    this.drawBoundingAndTitle();

    this.noBtn = new PIXI.Sprite.fromImage(Utils.buildImagePath('justsayno.jpg'));
    this.noBtn.x = 300;
    this.noBtn.y = 50;
    this.noBtn.scale.set(0.4);
    if (this.playerHasJustSayNo()) {
      this.noBtn.interactive = true;
      this.noBtn.buttonMode = true;
    } else {
      this.noBtn.alpha = 0.4;
    }

    this.noBtn.on('click', function() {
      // [TODO] Pass in card here, also discard it from user.
      _this.game.network.playedNo();
      // This player might now be waiting from the server
      _this.dialogues.spawnAwaitingResponseDialogue();
      _this.hide();
    });

    this.payFeeBtn = new PIXI.Sprite.fromImage(Utils.buildImagePath('paythefee.jpg'));
    this.payFeeBtn.x = 520;
    this.payFeeBtn.y = 50;
    this.payFeeBtn.scale.set(0.4);
    this.payFeeBtn.interactive = true;
    this.payFeeBtn.buttonMode = true;
    this.payFeeBtn.on('click', function() {
      var availableCards = _this.getListOfAvailableCards()
      _this.spawnPaymentCardSelection(availableCards);
    });

    this.messageContainer.addChild(this.noBtn);
    this.messageContainer.addChild(this.payFeeBtn);
  }

  spawnPaymentCardSelection(availableCards) {
    var selectedCards = [];

    // Clear the content currently on screen
    this.clearContainer(this.messageContainer);

    // Redraw the bounding box and title
    this.drawBoundingAndTitle();

    this.cardContainer = new PIXI.Container();
    this.cardContainer.x = 115;
    this.cardContainer.y = 40;
    this.messageContainer.addChild(this.cardContainer);

    var _this = this;

    // Make new copies of all the sprites, but link them back to their parent card

    availableCards.map(function(card) {
      // Make a copy of this card's sprite so we can scale it and move it easily
      var cardSprite = new PIXI.Sprite.from(card.sprite.texture);
      cardSprite.scale.set(0.45);
      cardSprite.interactive = true;
      cardSprite.buttonMode = true;

      // Make note of which card this new sprite came from so we know more info
      cardSprite.parentCard = card;

      // Make this card selected/unselected when clicked
      cardSprite.selected = false;
      cardSprite.on('click', function() {
        cardSprite.selected = !cardSprite.selected;
        if (cardSprite.selected) {
          cardSprite.alpha = 0.4;
        } else {
          cardSprite.alpha = 1;
        }
        _this.updatePaymentAmount(_this.calculatePaymentAmount());
      });

      _this.availableCardSprites.push(cardSprite);
    });


    // Information to display to the user about this payment
    this.paymentText = new PIXI.Text();
    this.paymentText.x = 415;
    this.messageContainer.addChild(this.paymentText);

    this.showCards(0);
  }

  calculatePaymentAmount() {
    // Iterate through all available cards and determine the cummulative
    // total of all selected cards
    var paymentAmount = 0;
    this.availableCardSprites.map(function(card) {
      if (card.selected) {
        paymentAmount += card.parentCard.value;
      }
    });
    return paymentAmount;
  }

  updatePaymentAmount(paymentAmount) {
    this.paymentText.text = paymentAmount + "M / " + this.amountOwed + "M";

    // Here we also do a check to determine whether or not the submit button
    // should be active. Bad code design, blah blah blah
    if ( paymentAmount >= this.amountOwed || this.allCardsSelected() ) {
      this.submitBtn.interactive = true;
      this.submitBtn.buttonMode = true;
      this.submitBtn.alpha = 1;
    } else {
      this.submitBtn.interactive = false;
      this.submitBtn.buttonMode = false;
      this.submitBtn.alpha = 0.4;
    }

  }

  allCardsSelected() {
    var allSelected = true;
    this.availableCardSprites.map(function(card) {
      if (card.selected == false) {
        allSelected = false;
      }
    });
    return allSelected;
  }

  getNextBatch(pageNum) {
    return this.availableCardSprites.slice(pageNum * 5, pageNum * 5 + 5);
  }

  showCards(pageNum) {
    var _this = this;

    // Clear the container containing the cards
    this.clearContainer(this.cardContainer);

    // Redraw the cards in this batch
    var cardsToDraw = this.getNextBatch(pageNum);
    var cardOffset = 150;
    for (let i = 0; i < cardsToDraw.length; i++) {
      cardsToDraw[i].x = i * cardOffset;
      this.cardContainer.addChild(cardsToDraw[i]);
    }

    // Draw the submit button
    this.submitBtn = new PIXI.Sprite.fromImage(Utils.buildImagePath("submit.png"));
    this.submitBtn.x = 850;
    this.submitBtn.y = 150;

    this.submitBtn.on('click', function() {
      var selectedCards = _this.getSelectedCards();
      _this.game.network.makePayment(selectedCards);

      // This player might now be waiting from the server
      _this.dialogues.spawnAwaitingResponseDialogue();

      // Mark this player has having paid already (so we don't try to reopen this window)
      _this.hasPaid = true;

      _this.game.stage.removeChild(_this.container);
    });

    // Refresh the payment amount selected
    this.updatePaymentAmount(this.calculatePaymentAmount());

    // Draw the next/previous batch buttons
    var prevBtn = new PIXI.Sprite.fromImage(Utils.buildImagePath("prev.png"));
    prevBtn.x = 12;
    prevBtn.y = 40;
    // If we're on the first page, there is no previous page
    if (pageNum == 0) {
      prevBtn.alpha = 0.4;
    } else {
      prevBtn.interactive = true;
      prevBtn.buttonMode = true;
      prevBtn.on('click', function() {
        _this.messageContainer.removeChild(_this.submitBtn);
        _this.messageContainer.removeChild(prevBtn);
        _this.messageContainer.removeChild(nextBtn);
        _this.showCards(pageNum - 1);
      });
    }

    var nextBtn = new PIXI.Sprite.fromImage(Utils.buildImagePath("next.png"));
    nextBtn.x = 850;
    nextBtn.y = 40;

    // The maximium number of pages to show to the user
    var maxPages = Math.floor(this.availableCardSprites.length / 5); // Floor because we count from 0

    // If we're on the last page, there is no next page
    if (pageNum == maxPages) {
      nextBtn.alpha = 0.4;
    } else {
      nextBtn.interactive = true;
      nextBtn.buttonMode = true;
      nextBtn.on('click', function() {
        _this.messageContainer.removeChild(_this.submitBtn);
        _this.messageContainer.removeChild(prevBtn);
        _this.messageContainer.removeChild(nextBtn);
        _this.showCards(pageNum + 1);
      });
    }

    this.messageContainer.addChild(prevBtn);
    this.messageContainer.addChild(nextBtn);
    this.messageContainer.addChild(this.submitBtn);
  }

  drawBoundingAndTitle() {
    this.boundingBox = new PIXI.Graphics();
    this.boundingBox.lineStyle(2, 0x000000, 1);
    this.boundingBox.beginFill(0xf9f7b0, 1);
    this.boundingBox.drawRect(0, 0, 940, dialogueHeight);
    this.boundingBox.interactive = true;

    this.titleBox = new PIXI.Graphics();
    this.titleBox.interactive = true; // Prevents click-through to cards below
    this.titleBox.lineStyle(2, 0x000000, 1);
    this.titleBox.beginFill(0xf9f7b0, 1);
    this.titleBox.drawRect(0, 0, 940, 30);

    this.messageContainer.addChild(this.boundingBox);
    this.messageContainer.addChild(this.titleBox);
  }

  // Returns a list of cards selected by the player to pay the fee
  getSelectedCards() {
    var selected = [];
    this.availableCardSprites.map(function(card) {
      if (card.selected) {
        selected.push(card.parentCard)
      }
    });
    return selected;
  }

  // Checks if a player has a just say no card
  // Returns the card if one exists, null otherwise
  playerHasJustSayNo() {
    this.activePlayer.hand.cards.map(function(card){
      if (card.name == "JustSayNo") {
        return card;
      }
    });
    return null;
  }

  // Return a list of cards that the player could use to pay the debt
  // Both cards in bank and properties work here
  getListOfAvailableCards() {
    // The list of bank cards is first since players will choose these most often
    var bankCards = this.activePlayer.bank.cards;

    // Iterate through and find all valid cards that a player can pay with from
    // their properties (includes property cards and modifiers)
    var propertyCards = [];
    for (let i = 0; i < colorNames.length; i++) {
      var thisColor = this.game.activePlayer.properties.propertiesList[colorNames[i]];
      thisColor.cards.map(function(card) {
        propertyCards.push(card);
      });
      thisColor.modifiers.map(function(card) {
        propertyCards.push(card);
      });
    }

    // Return the concatentation of the two arrays
    return [...bankCards, ...propertyCards];
  }

  minimize() {
    this.boundingBox.visible = false;
    this.noBtn.visible = false;
  }

  maximize() {
    this.boundingBox.visible = true;
    this.noBtn.visible = true;
  }

  hide() {
    this.container.visible = false;
  }

  unhide() {
    this.container.visible = true;
  }

  clearContainer(container) {
    while(container.children[0]) {
      console.log("Killing children");
      container.removeChild(container.children[0]);
    }
  }

}

module.exports = PaymentDialogue;