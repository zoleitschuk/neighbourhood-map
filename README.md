# neighbourhood-map

The Neighbourhood Map is a fully responsive web application that displays a list of locations in google maps, and overlays a heatmap on top of the map to allow the user to identify potentially unexplored locations of interest. The heatmap displays locations with high densisties of coffee shops, climbing gyms, dog parks, rooftop patios, book stores, and yoga studios.

Depending if users are viewing enabled to filter points on the map through a sidebar text filter or through dropdown. Clicking on a location, either on the map or in the sidebar will bring up the address for that location.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

* none

### Installing

Below is a step by step series of instructions that guide you through getting a development env running.

1. Clone or download this project from [Github](https://github.com/zoleitschuk/neighbourhood-map)
2. Open index.html using your favorite web browser.

### Instructions

To bring up address informaiton on a particular point click on the marker on the map; or if viewing on a tablet, laptop, or desktop computer you can also click on the name of the location in the sidebar.

The content of the map and the sidebar can be filtered by entering text into the filter text box in the top of the sidebar. In mobile, the map points are filtered by selecting the location name in the dropdown selector underneath the map.

Lastly, the heap map displays concentrations of coffee shops, climbing gyms, dog parks, rooftop patios, book stores, and yoga studios with highest concentrations displayed in red, and lowest concentrations displayed in green. Users can use locations of high concentration to highlight locations in the city that are worthwhile oportunities for exploration.

## Built With

* [knockout.js](http://flask.pocoo.org/) - JavaScript Framework
* [Google Maps](https://developers.google.com/maps/documentation/) - Googl Maps API
* [FourSquare](https://developer.foursquare.com/docs/api) - 3rd Party API for providing additional location data
* [Bootstrap](https://getbootstrap.com/docs/4.0/getting-started/introduction/) - Styling Framework
* [jQuery] (http://api.jquery.com/jQuery/) - JavaScript Framework

## Authors

* **Zachary Oleitschuk** - [zoleitschuk](https://github.com/zoleitschuk/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgements

This project was created as part of the required course work for the [Udacity Full-Stack Nanodegree](https://www.udacity.com/course/full-stack-web-developer-nanodegree--nd004).