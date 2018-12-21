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

var PointOfInterest = function(dataPoint) {
    this.label = ko.observable(dataPoint.label);
    this.name = ko.observable(dataPoint.name);
    this.marker = ko.observable(dataPoint.marker);
}

var ViewModel = function() {
    var self = this;

    this.points = ko.observableArray([]);
    this.query = ko.observable('');
    this.filteredPoints = ko.computed(function() {
        let filter = self.query().toLowerCase();
        if(!filter) {
            return self.points();
        } else {
            return ko.utils.arrayFilter(self.points(), function(item) {
                return item.name().toLowerCase().indexOf(filter) !== -1;
            });
        }
    });

    data.forEach(function(dataPoint) {
        self.points.push(new PointOfInterest(dataPoint));
    });

    this.setPoint = function() {
        console.log(this.name());
    };
}

my = {viewModel: new ViewModel()};

ko.applyBindings(my.viewModel);
