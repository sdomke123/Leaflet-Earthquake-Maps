// Data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"

function createMap(quakeSpot) {

    // Create tile layer to act as map background
    var light = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });


    // Create a base layer to hold the light map layer
    var baseMaps = {
        Light: light,
    };

    // Create an overlay layer to hold the quakeSpots layer
    var overlayMaps = {
        "Earthquakes": quakeSpot
    };

    // Create the map object
    var myMap = L.map("mapid", {
        center: [37.09, -95.71],
        zoom: 3,
        layers: [light, quakeSpot]
    });

    // Create a layer control and pass in the layers
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

    // Create the legend
    var legend = L.control({ position: 'bottomright' });
        legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        var limits = ["0-10", "10.1-30", "30.1-50", "50.1-70", "70.1-90", "90+"];
        var colors = ["#3aeb34", "#b9eb17", "#f7f72f", "#f7b12f", "#f7822f", "#f72f2f"];
        var labels = [];

        var legendInfo = "<h1>Earthquake Depth</h1>" +
            "<div class=\"labels\">" +
                "<div class=\"level1\">" + limits[0] + "</div>" +
                "<div class=\"level2\">" + limits[1] + "</div>" +
                "<div class=\"level3\">" + limits[2] + "</div>" +
                "<div class=\"level4\">" + limits[3] + "</div>" +
                "<div class=\"level5\">" + limits[4] + "</div>" +
                "<div class=\"level6\">" + limits[5] + "</div>" +
            "</div>";

            div.innerHTML = legendInfo;

            limits.forEach(function(limit, index) {
                labels.push("<li style=\"background-color: " + colors[index] + "\"></li>"); 
            });

            div.innerHTML += "<ul>" + labels.join("") + "</ul>";
            return div;
    };
        legend.addTo(myMap);
};

function createMarkers(response) {
    // Assign features to variable for easier access
    var earthquakes = response.features;

    // Initialize an empty array to hold the marker-bound earthquakes
    var quakeMarkers = [];

    // Loop through all earthquakes and bind circle markers to their coordinates
    for(var i=0; i < earthquakes.length; i++) {
        var quakeProperties = earthquakes[i].properties;
        var quakeLocation = earthquakes[i].geometry;
        // Assign different circle colors depending on the depth of the earthquake
        if(quakeLocation.coordinates[2] >= 0 && quakeLocation.coordinates[2] <= 10) {
            var setColor = "#3aeb34"
        } else if(quakeLocation.coordinates[2] > 10 && quakeLocation.coordinates[2] <= 30) {
            var setColor = "#b9eb17"
        } else if(quakeLocation.coordinates[2] > 30 && quakeLocation.coordinates[2] <= 50) {
            var setColor = "#f7f72f"
        } else if(quakeLocation.coordinates[2] > 50 && quakeLocation.coordinates[2] <= 70) { 
            var setColor = "#f7b12f"
        } else if(quakeLocation.coordinates[2] > 70 && quakeLocation.coordinates[2] <= 90) { 
            var setColor = "#f7822f"
        } else {
            var setColor = "#f72f2f"
        }
        // Assign different circle sizes depending on the magnitude of the earthquake
        if(quakeProperties.mag >= 4.5 && quakeProperties.mag <= 5) {
            var setRadius = 10
        } else if(quakeProperties.mag >= 5 && quakeProperties.mag <= 5.5) {
            var setRadius = 15
        } else if(quakeProperties.mag >= 5.5 && quakeProperties.mag <= 6) {
            var setRadius = 20
        } else if(quakeProperties.mag >= 6 && quakeProperties.mag <= 6.5) {
            var setRadius = 25
        } else {
            var setRadius = 30
        }
        // Create circle markers
        var circles = L.circleMarker([quakeLocation.coordinates[1], quakeLocation.coordinates[0]], {
            color: "black",
            weight: 0.5,
            fillColor: setColor,
            fillOpacity: 0.75,
            radius: setRadius
          }).bindPopup(quakeProperties.title)
        quakeMarkers.push(circles);
        }
        // Initiate the createMap function and pass into it a layer of the circle markers just made
        createMap(L.layerGroup(quakeMarkers));
    };
// Start by reading in the data then initiate the createMarkers function
d3.json(url, createMarkers);