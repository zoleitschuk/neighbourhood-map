var locations = [
    {
        position: {lat: -31.563910, lng: 147.154312},
        label: 'A'
    },
    {
        position: {lat: -33.718234, lng: 150.363181},
        label: 'B'
    },
    {
        position: {lat: -33.727111, lng: 150.371124},
        label: 'C'
    },
    {
        position: {lat: -33.848588, lng: 151.209834},
        label: 'D'
    },
    {
        position: {lat: -33.851702, lng: 151.216968},
        label: 'E'
    },
];
/*
var Cat = function(data) {
    this.clickCount = ko.observable(data.clickCount);
    this.name = ko.observable(data.name);
    this.imgSrc = ko.observable(data.imgSrc);
    this.imgAttribution = ko.observable(data.imgAttribution);
    this.nicknames = ko.observableArray(data.nicknames);

    this.level = ko.computed(function() {
        var level;
        switch(true) {
            case this.clickCount() < 10:
                return 'Level 1';
                break;
            case this.clickCount() < 20:
                return 'Level 2';
                break;
            case this.clickCount() < 30:
                return 'Level 3';
                break;
        }
    }, this);
}

var ViewModel = function() {
    var self = this;

    this.catList = ko.observableArray([]);

    initialCats.forEach(function(catItem) {
        self.catList.push(new Cat(catItem));
    });
    
    this.currentCat = ko.observable(this.catList()[0]);
    
    this.incrementCounter = function() {
        this.clickCount(this.clickCount() + 1);
    };

    this.setCat = function(clickedCat) {
        self.currentCat(clickedCat);
    };
}

ko.applyBindings(new ViewModel());

*/