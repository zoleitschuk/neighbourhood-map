var findCenter = function() {
    let self = this;

    this.sumLat = 0;
    this.sumLng = 0;

    // Handle case where data is an empty array (i.e. data.length = 0).
    this.pointsCount = data.length || 1;

    data.forEach(function(dataPoint) {
        self.sumLat = self.sumLat + dataPoint.position.lat;
        self.sumLng = self.sumLng + dataPoint.position.lng;
    });

    // Center point will be the average value of the latitudes and longitudes.
    return {
        lat: this.sumLat / this.pointsCount,
        lng: this.sumLng / this.pointsCount
    };
}

var findZoom = function() {
    let zoom = 12;
    return zoom;
}

var getHeatMapData = function() {
    let heatMapData = [];

    foursquareParams = {
        mode: 'url',
        ne: '51.149633,-113.923759',
        sw: '50.901301,-114.310341',
        query: 'sushi', // Query does not seem to be working.
        client_id: '53YSEWRJUR3R0MVJ4AB1Y54Y1UEBQLYVWIVMVQC1PN2G2M3A',
        client_secret: 'BT2FCLFH0QBC1S20UU3L1NI1SFL04RJ1SWQ4WBXJFLWG432I',
        version: '20180113',
    }
    
    let endPoint = 'https://api.foursquare.com/v2/venues/explore?' +
        'mode=' + foursquareParams.mode +
        '&ne=' + foursquareParams.ne +
        '&sw=' + foursquareParams.sw +
        '&q=' + foursquareParams.query +
        '&client_id=' + foursquareParams.client_id +
        '&client_secret=' + foursquareParams.client_secret +
        '&v=' + foursquareParams.version;
    
    $.getJSON(endPoint, function(data) {
        data.response.groups[0].items.forEach(item => {
            let hotSpotLat = item.venue.location.lat;
            let hotSpotLng = item.venue.location.lng;
            let rating = item.venue.rating || 1;
            let hotSpot = {
                location: new google.maps.LatLng(hotSpotLat, hotSpotLng),
                weight: rating / 5,
            };
    
            heatMapData.push(hotSpot);
        });
    });
    return heatMapData;
}

var map, heatmap;

var initMap = function() {

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: findZoom(),
        center: findCenter()
    });
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: getHeatMapData(),
        map: map
    });

    heatmap.setMap(map);

    var infoWindow = new google.maps.InfoWindow;

    console.log(my.viewModel.points());

    my.viewModel.points().forEach(function(dataPoint){
        var marker = new google.maps.Marker({
            name: dataPoint.name(),
            position: dataPoint.position,
            label: dataPoint.label(),
            map: map
        });
        google.maps.event.addListener(marker, 'click', (function(marker) {
            return function() {
                infoWindow.setContent(marker.label + ': ' + marker.name);
                infoWindow.open(map, marker);
                //TODO: marker animation.
                toggleMarkerBounce(marker);
            }
        })(marker));
        dataPoint.marker = marker;
    });

    var markers = data.map(function(dataPoint) {

        var marker = new google.maps.Marker({
            name: dataPoint.name,
            position: dataPoint.position,
            label: dataPoint.label,
            map: map
        });

        google.maps.event.addListener(marker, 'click', (function(marker) {
            return function() {
                infoWindow.setContent(marker.label + ': ' + marker.name);
                infoWindow.open(map, marker);
                //TODO: marker animation.
                toggleMarkerBounce(marker);
            }
        })(marker));

        return marker;
    });
}

var toggleHeatmap = function() {
    heatmap.setMap(heatmap.getMap() ? map : map);
  }

var toggleMarkerBounce = function(marker) {
    let currentMarker = marker;

    currentMarker.setAnimation(google.maps.Animation.BOUNCE);

    // Stop bounce animation after 1 second.
    window.setTimeout(function(){
        currentMarker.setAnimation(null);
    }, 500);
}
