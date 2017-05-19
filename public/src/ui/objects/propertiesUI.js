var PIXI = require('pixi.js');

const colorNames = ["Brown", "LightBlue", "Magenta", "Orange", "Red",
                    "Yellow", "Green", "Blue", "Black", "LightGreen"];
const tileWidth = 85;
const tileHeight = 30;
const tileGapBetween = 15;

class PropertiesUI {
  constructor(game, propertiesList) {
    this.game = game;

    this.propertiesList = propertiesList;

    this.container = new PIXI.Container();
    this.game.stage.addChild(this.container);

    this.propertyContainer = new PIXI.Container();
    this.propertyContainer.x = 375;
    this.propertyContainer.y = 450;
    this.container.addChild(this.propertyContainer);

    // A dictionary by color that points to a container holding the property tile
    this.propertyTiles = {};
    this.spawnPropertyTiles();

  }

  spawnPropertyTiles() {
    // Brown Tile
    this.propertyTiles["Brown"] = this.generatePropertyTile({
                                    'colorName': "Brown",
                                    'colorCode': 0x8b481b,
                                    'xPos': 0,
                                    'yPos': 0
                                  });
    this.propertyContainer.addChild(this.propertyTiles["Brown"]);

    // LightBlue Tile
    this.propertyTiles["LightBlue"] = this.generatePropertyTile({
                                    'colorName': "LightBlue",
                                    'colorCode': 0xb7daed,
                                    'xPos': 1,
                                    'yPos': 0
                                  });
    this.propertyContainer.addChild(this.propertyTiles["LightBlue"]);

    // Magenta Tile
    this.propertyTiles["Magenta"] = this.generatePropertyTile({
                                    'colorName': "Magenta",
                                    'colorCode': 0xc12681,
                                    'xPos': 2,
                                    'yPos': 0
                                  });
    this.propertyContainer.addChild(this.propertyTiles["Magenta"]);

    // Orange Tile
    this.propertyTiles["Orange"] = this.generatePropertyTile({
                                    'colorName': "Orange",
                                    'colorCode': 0xe68407,
                                    'xPos': 3,
                                    'yPos': 0
                                  });
    this.propertyContainer.addChild(this.propertyTiles["Orange"]);

    // Red Tile
    this.propertyTiles["Red"] = this.generatePropertyTile({
                                    'colorName': "Red",
                                    'colorCode': 0xc9161c,
                                    'xPos': 4,
                                    'yPos': 0
                                  });
    this.propertyContainer.addChild(this.propertyTiles["Red"]);

    // Yellow Tile
    this.propertyTiles["Yellow"] = this.generatePropertyTile({
                                    'colorName': "Yellow",
                                    'colorCode': 0xfbf200,
                                    'xPos': 0,
                                    'yPos': 1
                                  });
    this.propertyContainer.addChild(this.propertyTiles["Yellow"]);

    // Green Tile
    this.propertyTiles["Green"] = this.generatePropertyTile({
                                    'colorName': "Green",
                                    'colorCode': 0x66be33,
                                    'xPos': 1,
                                    'yPos': 1
                                  });
    this.propertyContainer.addChild(this.propertyTiles["Green"]);

    // Blue Tile
    this.propertyTiles["Blue"] = this.generatePropertyTile({
                                    'colorName': "Blue",
                                    'colorCode': 0x5867a8,
                                    'xPos': 2,
                                    'yPos': 1
                                  });
    this.propertyContainer.addChild(this.propertyTiles["Blue"]);

    // Black Tile
    this.propertyTiles["Black"] = this.generatePropertyTile({
                                    'colorName': "Black",
                                    'colorCode': 0x4d4d4d,
                                    'xPos': 3,
                                    'yPos': 1
                                  });
    this.propertyContainer.addChild(this.propertyTiles["Black"]);

    // LightGreen Tile
    this.propertyTiles["LightGreen"] = this.generatePropertyTile({
                                    'colorName': "LightGreen",
                                    'colorCode': 0xcde4ba,
                                    'xPos': 4,
                                    'yPos': 1
                                  });
    this.propertyContainer.addChild(this.propertyTiles["LightGreen"]);

    // Now that the containers are constructed, add text to the tiles
    this.addCountsToTiles();

  }

  generatePropertyTile(propSettings) {
    var tileX = propSettings.xPos * (tileWidth + tileGapBetween);
    var tileY = propSettings.yPos * (tileHeight + tileGapBetween);

    var tileContainer = new PIXI.Container();
    tileContainer.x = tileX;
    tileContainer.y = tileY;

    var tile = new PIXI.Graphics();
    tile.lineStyle(2, 0x000000, 1);
    tile.beginFill(propSettings.colorCode, 1);
    tile.drawRoundedRect(0, 0, tileWidth, tileHeight, 10);
    tile.colorName = propSettings.colorName;
    tile.interactive = true;
    tile.buttonMode = true;

    tileContainer.addChild(tile);

    return tileContainer;
  }

  addCountsToTiles() {
    var _this = this;
    colorNames.map(function(colorName) {
      var tile = _this.propertyTiles[colorName];
      var propertyCountText = new PIXI.Text();
      propertyCountText.text = _this.propertiesList[colorName].cards.length
                                + "/" + _this.propertiesList[colorName].maxCards;
      propertyCountText.x += 25;
      propertyCountText.style = {
        align: "center"
      };
      tile.addChild(propertyCountText);
    });
  }

  updateProperties(properties) {
    this.propertiesList = properties;
    this.spawnPropertyTiles();
  }

}

module.exports = PropertiesUI;