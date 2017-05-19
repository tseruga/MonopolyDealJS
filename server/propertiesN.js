
class PropertiesN {

  constructor() {
    this.propertiesList = this.getNewPropertyList()
  }

  addProperty(card) {
    this.propertiesList[card.color].cards.push(card);
  }

  // This used to be in a json file, but require is weird and I don't care...
  getNewPropertyList() {
    return {
      "Yellow": {
        "cards": [],
        "maxCards": 3,
        "rentPrice": {
          "1": 2,
          "2": 4,
          "3": 7
        },
        "modifiers": []
      },
      "Brown": {
        "cards": [],
        "maxCards": 2,
        "rentPrice": {
          "1": 1,
          "2": 2
        },
        "modifiers": []
      },
      "Black": {
        "cards": [],
        "maxCards": 4,
        "rentPrice": {
          "1": 1,
          "2": 2,
          "3": 3,
          "4": 4
        },
        "modifiers": []
      },
      "Blue": {
        "cards": [],
        "maxCards": 2,
        "rentPrice": {
          "1": 3,
          "2": 8
        },
        "modifiers": []
      },
      "LightBlue": {
        "cards": [],
        "maxCards": 3,
        "rentPrice": {
          "1": 1,
          "2": 2,
          "3": 3
        },
        "modifiers": []
      },
      "LightGreen": {
        "cards": [],
        "maxCards": 2,
        "rentPrice": {
          "1": 1,
          "2": 2
        },
        "modifiers": []
      },
      "Red": {
        "cards": [],
        "maxCards": 3,
        "rentPrice": {
          "1": 2,
          "2": 3,
          "3": 6
        },
        "modifiers": []
      },
      "Orange": {
        "cards": [],
        "maxCards": 3,
        "rentPrice": {
          "1": 1,
          "2": 3,
          "3": 5
        },
        "modifiers": []
      },
      "Green": {
        "cards": [],
        "maxCards": 3,
        "rentPrice": {
          "1": 2,
          "2": 4,
          "3": 7
        },
        "modifiers": []
      },
      "Magenta": {
        "cards": [],
        "maxCards": 3,
        "rentPrice": {
          "1": 1,
          "2": 2,
          "3": 4
        },
        "modifiers": []
      }
    }
  }

}

module.exports = PropertiesN;