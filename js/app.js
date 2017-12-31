var data = [
    {
        name: 'Crossfit Currie Barracks',
        position: {lat: -31.563910, lng: 147.154312},
        label: 'A'
    },
    {
        name: 'The Nash',
        position: {lat: -33.718234, lng: 150.363181},
        label: 'B'
    },
    {
        name: 'Good Earth',
        position: {lat: -33.727111, lng: 150.371124},
        label: 'C'
    },
    {
        name: 'Market Collective',
        position: {lat: -33.848588, lng: 151.209834},
        label: 'D'
    },
    {
        name: 'Crossfit Sunalta',
        position: {lat: -33.851702, lng: 151.216968},
        label: 'E'
    },
];

var PointOfInterest = function(dataPoint) {
    this.label = ko.observable(dataPoint.label);
    this.name = ko.observable(dataPoint.name);
}

var ViewModel = function() {
    var self = this;

    self.points = ko.observableArray([]);

    data.forEach(function(dataPoint) {
        self.points.push(new PointOfInterest(dataPoint));
    });
}

ko.applyBindings(new ViewModel());
