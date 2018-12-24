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
                    populateInfoWindow(marker, infoWindow);
                    toggleMarkerBounce(marker);
                }
            })(marker));

        })(i);
    }
    getHeatMap();
}

let foursquareAuth = {
    client_id: '53YSEWRJUR3R0MVJ4AB1Y54Y1UEBQLYVWIVMVQC1PN2G2M3A',
    client_secret: 'BT2FCLFH0QBC1S20UU3L1NI1SFL04RJ1SWQ4WBXJFLWG432I',
    version: '20180113',
}

var populateInfoWindow = function(marker, infoWindow) {
    foursquareDetailParam = {
        intent: 'match',
        ll: marker.getPosition().lat() + ',' + marker.getPosition().lng(),
        name: marker.name,
        client_id: foursquareAuth.client_id,
        client_secret: foursquareAuth.client_secret,
        v: foursquareAuth.version,
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

var getVenueInfoContent = function(venue){
    var content = '<div>' + venue.name + '</div>' +
        '<div>' + venue.location.formattedAddress[0] + '</div>' +
        '<div>' + venue.location.formattedAddress[1] + '</div>' +
        '<div>' + venue.location.formattedAddress[2] + '</div>';
    return content;
}

var getHeatMap = function() {
    let heatMapData = [];

    foursquareCategoryParam = {
        mode: 'url',
        intent: 'browse',
        ne: '51.149633,-113.923759',
        sw: '50.901301,-114.310341',
        categoryId: '',
        limit: '50',
        client_id: foursquareAuth.client_id,
        client_secret: foursquareAuth.client_secret,
        v: foursquareAuth.version,
    };

    // Foursquare categories:
    foursquareCategories = [
        {name: 'coffee shop', id: '4bf58dd8d48988d1e0931735'},
        {name: 'climbing gym', id: '4bf58dd8d48988d1e0931735'},
        {name: 'yoga studio', id: '4bf58dd8d48988d102941735'},
        {name: 'dog run', id: '4bf58dd8d48988d1e5941735'},
        {name: 'roof deck', id: '4bf58dd8d48988d133951735'},
        {name: 'book store', id: '4bf58dd8d48988d114951735'},
    ];

    // loop through all foursquareCategories to make API call on each
    for(i=0; i<foursquareCategories.length;i++){
        foursquareCategoryParam.categoryId = foursquareCategories[i].id;
        
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
            console.log('heatmap connection failed');
        });
    }   // end api query loop
}

var toggleMarkerBounce = function(marker) {
    let currentMarker = marker;

    currentMarker.setAnimation(google.maps.Animation.BOUNCE);

    // Stop bounce animation after 1 second.
    window.setTimeout(function(){
        currentMarker.setAnimation(null);
    }, 1000);
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
    this.dropdown = ko.observable('');

    data.forEach(function(dataPoint) {
        let myPOI = new PointOfInterest(dataPoint);
        self.points.push(myPOI);
    });

    this.filteredPoints = ko.computed(function() {
        // Use dropdown value as filter on points if selected, otherwise use value of query.
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

    this.setPoint = function(points) {
        google.maps.event.trigger(points.marker, "click");
    };

    this.resetFilters = function() {
        self.query('');
        self.dropdown(null);
    };
};

viewModel = new ViewModel();

ko.applyBindings(viewModel);
