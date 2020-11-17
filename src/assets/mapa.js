var map;
var marker;

function initialize() {
  geocoder = new google.maps.Geocoder();
  var mapOptions = {
    center: { lat: 28.638692, lng: -106.077344 },
    streetViewControl: true,
    zoom: 14
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);

  loc = { lat: 28.638692, lng: -106.077344 }
  addMarker(loc);
  map.setCenter(loc);

  map.setZoom(16);

}

// Add a marker to the map and push to the array.
function addMarker(location) {

  marker = new google.maps.Marker({
    position: location,
    animation: google.maps.Animation.DROP,

    draggable: false,
    map: map
  });
}




google.maps.event.addDomListener(window, 'load', initialize);


