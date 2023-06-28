document.addEventListener("DOMContentLoaded", function() {
  // Create the createMap function.
  function createMap(bikeStations) {
    // Create the tile layer that will be the background of our map.
    var osmMap = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }
    );

    // Create a baseMaps object to hold the OSM map layer.
    var baseMaps = {
      "OpenStreetMap": osmMap,
    };

    // Create an overlayMaps object to hold the bikeStations layer.
    var overlayMaps = {
      BikeStations: bikeStations,
    };

    // Create the map object with options.
    var map = L.map("map-id", {
      center: [40.73, -74.0059],
      zoom: 12,
      layers: [osmMap, bikeStations],
    });

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps).addTo(map);
  }

  // Create the createMarkers function.
  function createMarkers(response) {
    // Pull the "stations" property from response.data.
    var stations = response.data.stations;

    // Initialize an array to hold the bike markers.
    var bikeMarkers = [];

    // Loop through the stations array.
    for (var i = 0; i < stations.length; i++) {
      var station = stations[i];

      // For each station, create a marker, and bind a popup with the station's name and capacity.
      var bikeMarker = L.marker([station.lat, station.lon]).bindPopup(
        "<h3>" + station.name + "</h3>" +
          "<p>Capacity: " + station.capacity + "</p>"
      );

      // Add the marker to the bikeMarkers array.
      bikeMarkers.push(bikeMarker);
    }

    // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
    var bikeStations = L.layerGroup(bikeMarkers);
    createMap(bikeStations);
  }

  // Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
  var apiUrl = "https://gbfs.citibikenyc.com/gbfs/en/station_information.json";
  d3.json(apiUrl).then(createMarkers);
});
