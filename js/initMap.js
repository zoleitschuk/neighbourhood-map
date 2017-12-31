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
    let zoom = 10;
    return zoom;
}

var initMap = function() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: findZoom(),
        center: findCenter()
    });

    var infoWindow = new google.maps.InfoWindow;

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
            }
        })(marker));

        return marker;
    });
}