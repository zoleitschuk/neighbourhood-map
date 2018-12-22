let viewModel;

var data = [
    {
        name: 'Crossfit Currie Barracks',
        position: {lat: 51.017651, lng: -114.120027},
        label: 'A'
    },
    {
        name: 'The Nash',
        position: {lat: 51.041771, lng: -114.037000},
        label: 'B'
    },
    {
        name: 'Good Earth',
        position: {lat: 51.039322, lng: -114.088990},
        label: 'C'
    },
    {
        name: 'Market Collective',
        position: {lat: 51.039392, lng: -114.035213},
        label: 'D'
    },
    {
        name: 'Crossfit Sunalta',
        position: {lat: 51.044035, lng: -114.099481},
        label: 'E'
    },
    {
        name: 'Higher Ground',
        position: {lat: 51.052621, lng: -114.087765},
        label: 'F'
    },
];

var map, heatmap;

var markers = [];

var findZoom = function() {
    let zoom = 12;
    return zoom;
}

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

var initMap = function() {

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: findZoom(),
        center: findCenter()
    });

    var infoWindow = new google.maps.InfoWindow;

    for( i=0; i<data.length; i++){
        (function(){
            var marker = new google.maps.Marker({
                name: data[i].name,
                position: data[i].position,
                label: data[i].label,
                map: map
            });
            markers.push(marker);
            viewModel.points()[i].marker = marker;
            google.maps.event.addListener(marker, 'click', (function(marker) {
                return function() {
                    infoWindow.setContent(marker.label + ': ' + marker.name);
                    infoWindow.open(map, marker);
                    //TODO: marker animation.
                    toggleMarkerBounce(marker);
                }
            })(marker));

        })(i);
    }

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: getHeatMapData(),
        map: map
    });

    //heatmap.setMap(map);
    toggleHeatmap();
}

var getHeatMapData = function() {
    let heatMapData = [];

    foursquareParams = {
        mode: 'url',
        ne: '51.149633,-113.923759',
        sw: '50.901301,-114.310341',
        query: 'coffee', // Query does not seem to be working.
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
                weight: rating,
            };
    
            heatMapData.push(hotSpot);
        });
    });
    return heatMapData;
}


var toggleHeatmap = function() {
    heatmap.setMap(heatmap.getMap() ? map : map);
    //set radius of heatmap points to 30px
    heatmap.set('radius', heatmap.get('radius') ? null : 30);
  }

var toggleMarkerBounce = function(marker) {
    let currentMarker = marker;

    currentMarker.setAnimation(google.maps.Animation.BOUNCE);

    // Stop bounce animation after 1 second.
    window.setTimeout(function(){
        currentMarker.setAnimation(null);
    }, 500);
}

var PointOfInterest = function(dataPoint) {
    this.label = dataPoint.label;
    this.name = dataPoint.name;
    this.show = ko.observable(true);
    // this.marker = ko.observable(dataPoint.marker);
}

var ViewModel = function() {
    var self = this;

    this.points = ko.observableArray([]);
    this.query = ko.observable('');

    data.forEach(function(dataPoint) {
        let myPOI = new PointOfInterest(dataPoint);
        self.points.push(myPOI);
    });

    this.filteredPoints = ko.computed(function() {
        let filter = self.query().toLowerCase();
        for(i=0;i<self.points().length;i++){
            if(self.points()[i].name.toLowerCase().indexOf(filter)>-1) {
                self.points()[i].show(true);
                if(self.points()[i].marker){
                    self.points()[i].marker.setVisible(true);
                }
            }
            else {
                self.points()[i].show(false);
                if(self.points()[i].marker){
                    self.points()[i].marker.setVisible(false);
                }
            }
        }
    });

    this.setPoint = function(points) {
        google.maps.event.trigger(points.marker, "click");
    };
};

viewModel = new ViewModel();

ko.applyBindings(viewModel);
