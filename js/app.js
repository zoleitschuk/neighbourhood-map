let viewModel;

var DATA = [
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

// Define global params for foursquare API authentication.
let FOURSQUAREAUTH = {
    client_id: '53YSEWRJUR3R0MVJ4AB1Y54Y1UEBQLYVWIVMVQC1PN2G2M3A',
    client_secret: 'BT2FCLFH0QBC1S20UU3L1NI1SFL04RJ1SWQ4WBXJFLWG432I',
    version: '20180113',
}

// Set map zoom level.
// Future improvement: use points lat-lng to determine appropriate zoom level.
var setZoom = function() {
    let zoom = 13;
    return zoom;
}

// Find center lat-lng based off of points locations.
var findCenter = function() {
    let self = this;

    this.sumLat = 0;
    this.sumLng = 0;

    // Handle case where DATA is an empty array (i.e. DATA.length = 0).
    this.pointsCount = DATA.length || 1;

    DATA.forEach(function(dataPoint) {
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
        zoom: setZoom(),
        center: findCenter()
    });

    var infoWindow = new google.maps.InfoWindow;

    // Iterate through all points in array, DATA, and create marker on map for each.
    for( i=0; i<DATA.length; i++){
        (function(){
            var marker = new google.maps.Marker({
                name: DATA[i].name,
                position: DATA[i].position,
                label: DATA[i].label,
                map: map
            });
            markers.push(marker);
            viewModel.points()[i].marker = marker;
            google.maps.event.addListener(marker, 'click', (function(marker) {
                return function() {
                    populateInfoWindow(marker, infoWindow);
                    toggleMarkerBounce(marker);
                }
            })(marker));

        })(i);
    }
    // Apply heatmap to outline areas of interest to the map.
    getHeatMap();
}

// Error handler for google maps.
var mapErrorHandler = function() { 
    alert("Google Maps is currently unavailable. Please try again later.");
};

// Handle key errors for google maps
function gm_authFailure() { 
    alert("Something went wrong with your Google Maps authentication. Please check that your API key is correct, and contact the sites administrator.");
};

// Use FourSquare API to populate name and address information of provided google maps marker.
// https://developer.foursquare.com/docs/api/venues/search
var populateInfoWindow = function(marker, infoWindow) {
    foursquareDetailParam = {
        intent: 'match',
        ll: marker.getPosition().lat() + ',' + marker.getPosition().lng(),
        name: marker.name,
        client_id: FOURSQUAREAUTH.client_id,
        client_secret: FOURSQUAREAUTH.client_secret,
        v: FOURSQUAREAUTH.version,
    };

    $.ajax({
        url: 'https://api.foursquare.com/v2/venues/search?',
        dataType: 'json',
        data: foursquareDetailParam,
    })
    .done(function(data){
        locationDetails = getVenueInfoContent(data.response.venues[0]);
        infoWindow.setContent(locationDetails);
        infoWindow.open(map, marker);
    })
    .fail(function() {
        locationDetails = '<div>Connection to Foursquare API failed. Please try again later.</div>';
        infoWindow.setContent(locationDetails);
        infoWindow.open(map, marker);
    });
}

// Helper function to build content string for marker infoWindow given a FourSquare venue.
var getVenueInfoContent = function(venue){
    var name = venue.name ? '<div>' + venue.name + '</div>' : '<div>Name of Location not available</div>';
    var addressLine1 = venue.location.formattedAddress[0] ? '<div>' + venue.location.formattedAddress[0] + '</div>' : '';
    var addressLine2 = venue.location.formattedAddress[1] ? '<div>' + venue.location.formattedAddress[1] + '</div>' : '';
    var addressLine3 = venue.location.formattedAddress[2] ? '<div>' + venue.location.formattedAddress[2] + '</div>' : '';
    var content = name + addressLine1 + addressLine2 + addressLine3;

    return content;
}

// Use FourSquare API to retreive a list of locations of interest and use those points
// to build a heatmap to represent areas of interest .
// https://developer.foursquare.com/docs/api/venues/search
// https://developers.google.com/maps/documentation/javascript/examples/layer-heatmap
var getHeatMap = function() {
    let heatMapData = [];

    foursquareCategoryParam = {
        mode: 'url',
        intent: 'browse',
        ll: findCenter().lat + ',' + findCenter().lng,
        radius: '3500',
        categoryId: '',
        limit: '50',
        client_id: FOURSQUAREAUTH.client_id,
        client_secret: FOURSQUAREAUTH.client_secret,
        v: FOURSQUAREAUTH.version,
    };

    // Foursquare categories:
    DATAFOURSQUARECATEGORIES = [
        {name: 'coffee shop', id: '4bf58dd8d48988d1e0931735'},
        {name: 'climbing gym', id: '4bf58dd8d48988d1e0931735'},
        {name: 'yoga studio', id: '4bf58dd8d48988d102941735'},
        {name: 'dog run', id: '4bf58dd8d48988d1e5941735'},
        {name: 'roof deck', id: '4bf58dd8d48988d133951735'},
        {name: 'book store', id: '4bf58dd8d48988d114951735'},
    ];

    // Loop through all DATAFOURSQUARECATEGORIES to make API call on each.
    // This is a work around to the 50 venue limit set by FourSquare on each API call.
    for(i=0; i<DATAFOURSQUARECATEGORIES.length;i++){
        foursquareCategoryParam.categoryId = DATAFOURSQUARECATEGORIES[i].id;
        
        $.ajax({
            url: 'https://api.foursquare.com/v2/venues/search?',
            dataType: 'json',
            data: foursquareCategoryParam,
        })
        .done(function(data) {
            data.response.venues.forEach(venue => {
                let hotSpotLat = venue.location.lat;
                let hotSpotLng = venue.location.lng;
                let weight = venue.rating || 1;
                let hotSpot = {
                    location: new google.maps.LatLng(hotSpotLat, hotSpotLng),
                    weight: weight,
                };
                heatMapData.push(hotSpot);
            });
            var heatmap = new google.maps.visualization.HeatmapLayer({
                data: heatMapData,
                map: map
            });
            heatmap.setMap(heatmap.getMap() ? map : map);
            //set radius of heatmap points to 15px
            heatmap.set('radius', heatmap.get('radius') ? null : 15);
        })
        .fail(function(){
            // Log alert if heatmap errro occurs.
            alert('Heatmap is currently unavailable. Please try again later.');
        });
    }   // end api query loop
}

// Animate marker to bounce for specified amount of time.
var toggleMarkerBounce = function(marker) {
    let currentMarker = marker;
    currentMarker.setAnimation(google.maps.Animation.BOUNCE);
    window.setTimeout(function(){
        currentMarker.setAnimation(null);
    }, 1000);
}

// Define model for Point of Interest.
var PointOfInterest = function(dataPoint) {
    this.label = dataPoint.label;
    this.name = dataPoint.name;
    this.show = ko.observable(true);
}


// Define View Model.
var ViewModel = function() {
    var self = this;

    this.points = ko.observableArray([]);
    this.query = ko.observable('');
    this.dropdown = ko.observable('');

    DATA.forEach(function(dataPoint) {
        let myPOI = new PointOfInterest(dataPoint);
        self.points.push(myPOI);
    });

    this.filteredPoints = ko.computed(function() {
        // If dropdown has value, use its value as the filter, otherwise use the value query.
        let filter = self.dropdown() ? self.dropdown().name.toLowerCase() : self.query().toLowerCase();
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

    // Trigger marker click event when corresponding sidebar element is clicked.
    this.setPoint = function(points) {
        google.maps.event.trigger(points.marker, "click");
    };

    // In edge case where use switches window size back and forth between 600px,
    // provide functionality for user to reset the filter values.
    this.resetFilters = function() {
        self.query('');
        self.dropdown(null);
    };
};

viewModel = new ViewModel();

ko.applyBindings(viewModel);
