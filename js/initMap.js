var initMap = function() {
    var uluru = { lat: -25.363, lng: 131.044 };

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: uluru
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