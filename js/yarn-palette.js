/**
 * Calculates the square of the Euclidean distance between 2 points.
 */
function distance(p1, p2) {
  return p1.reduce(function(acc, val, idx) {
    return acc + Math.pow(val - p2[idx], 2);
  }, 0);
}

/**
 * Determines the index of the closest point in an array of points that is
 * closest to some query point.
 */
function nearestNeighbour(points, queryPoint) {
  // Get the distance from the query_point to each of the points.
  var distances = points.map(function(x) {
    return distance(x, queryPoint)
  });

  // The accumulator is the index of the smallest item.
  return distances.reduce(function(acc, val, idx, arr) {
    return val < arr[acc] ? idx : acc;
  }, 0);
}


$(document).ready(function() {

  /*
   * Example rendering taken from color-thief. Copyright (c) 2015 Lokesh Dhakar
   */
  var imageArray = {images: [
    {'file': 'img/examples/photo1.jpg'},
    {'file': 'img/examples/photo2.jpg'},
    {'file': 'img/examples/photo3.jpg'}
  ]};
  var examplesHTML = Mustache.to_html($('#image-section-template').html(), imageArray);
  $('#example-images').append(examplesHTML);

  // Event handlers for buttons
  function addButtonHandlers() {
    $('.pick-colours-button').unbind().click(function(event) {
      var $imageSection = $(this).closest('.image-section');
      pickYarns($imageSection);
    });
  }

  addButtonHandlers();

  // When a yarn type is selected show the hidden elements.
  $('#yarnType').change(function() {
    if ($(this).val() != '') {
      $('.hidden').show()
    }
  });

  // Display the image when the user selects it
  function displayImage(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var imageArray = {images: [
          {'file': e.target.result}
        ]};
        var imageInputHtml = Mustache.to_html($('#image-section-template').html(), imageArray);
        $('#selected-image').prepend(imageInputHtml);
        addButtonHandlers(); // Lazy... only need to add handler for new button
      }
      reader.readAsDataURL(input.files[0]);
    }
  }

  $("#image-input").change(function(){
      displayImage(this);
  });

  var colorThief = new ColorThief();

  var pickYarns = function($imageSection ) {
    var image = $imageSection.find('img')[0];
    var palette = colorThief.getPalette(image, parseInt($('#numColours').val()));
    var yarnRange = window[$('#yarnType').val()];
    var colours = yarnRange.map(x => x[2]);
    var yarns = palette.map(x => yarnRange[nearestNeighbour(colours, x)])

    var context = {
      palette: palette,
      yarns: yarns
    };
    var outputHtml = Mustache.to_html($('#yarn-palette-template').html(), context);
    $imageSection.find('.yarn-palette').prepend(outputHtml);
    $imageSection.find('.pick-colours-button').hide();
  }
});