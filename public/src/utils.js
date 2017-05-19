module.exports =  {

  cardArraysSame: function(x, y) {

    // Have different number of cards
    if ( x.length != y.length ) {
      return false;
    }

    // Have different cards
    for ( let i = 0; i < x.length; i++ ) {
      if ( x[i].uniqueName != y[i].uniqueName) {
        return false;
      }
    }

    return true;
  },

  buildImagePath: function(imgName) {
    return '../images/' + imgName;
  }

}

