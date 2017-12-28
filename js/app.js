var initialCats = [
    {
        clickCount: 0,
        name: 'Tabby',
        imgSrc: 'https://i.pinimg.com/736x/6c/58/09/6c5809e816c53b3f0dc02dd1e2009a7e--tabby-kittens-for-sale-kitten-for-sale.jpg',
        imgAttribution: 'https://www.pinterest.ca/explore/tabby-kittens-for-sale/',
        nicknames: ['Hob', 'Boss', 'Mimsy', 'Power Town']
    },
    {
        clickCount: 0,
        name: 'Happy',
        imgSrc: 'https://i.pinimg.com/736x/6c/58/09/6c5809e816c53b3f0dc02dd1e2009a7e--tabby-kittens-for-sale-kitten-for-sale.jpg',
        imgAttribution: 'https://www.pinterest.ca/explore/tabby-kittens-for-sale/',
        nicknames: ['Hob', 'Boss', 'Mimsy', 'Power Town']
    },
    {
        clickCount: 0,
        name: 'Piggy',
        imgSrc: 'https://i.pinimg.com/736x/6c/58/09/6c5809e816c53b3f0dc02dd1e2009a7e--tabby-kittens-for-sale-kitten-for-sale.jpg',
        imgAttribution: 'https://www.pinterest.ca/explore/tabby-kittens-for-sale/',
        nicknames: ['Hob', 'Boss', 'Mimsy', 'Power Town']
    },
    {
        clickCount: 0,
        name: 'Flabby',
        imgSrc: 'https://i.pinimg.com/736x/6c/58/09/6c5809e816c53b3f0dc02dd1e2009a7e--tabby-kittens-for-sale-kitten-for-sale.jpg',
        imgAttribution: 'https://www.pinterest.ca/explore/tabby-kittens-for-sale/',
        nicknames: ['Hob', 'Boss', 'Mimsy', 'Power Town']
    },
    {
        clickCount: 0,
        name: 'Sappy',
        imgSrc: 'https://i.pinimg.com/736x/6c/58/09/6c5809e816c53b3f0dc02dd1e2009a7e--tabby-kittens-for-sale-kitten-for-sale.jpg',
        imgAttribution: 'https://www.pinterest.ca/explore/tabby-kittens-for-sale/',
        nicknames: ['Hob', 'Boss', 'Mimsy', 'Power Town']
    },
    

];

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