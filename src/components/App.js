import React, { Component } from 'react';
import LocationsNavBar from './LocationsNavBar';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'locations': [
                {
                    'name': "Lalbagh Botnical Garden",
                    'latitude': 12.9507,
                    'longitude': 77.5848
                },
                {
                    'name': "Cubbon Park",
                    'latitude': 12.9763,
                    'longitude': 77.5929
                },
                {
                    'name': "Bangalore Fort",
                    'latitude': 12.9629,
                    'longitude': 77.5760
                },
                {
                    'name': "Tipu Sultan's Summer Palace",
                    'latitude': 12.9593,
                    'longitude': 77.5737
                },
                {
                    'name': "ISKCON Temple",
                    'latitude': 13.0098,
                    'longitude': 77.5511
                },
                {
                    'name': "National Gallery of Modern Art",
                    'latitude': 12.9897,
                    'longitude': 77.5881
                },
                {
                    'name': "Shree Dodda Ganapathi Temple",
                    'latitude': 12.9429,
                    'longitude': 77.5682
                },
                {
                    'name': "Turahalli Forest",
                    'latitude': 12.8818,
                    'longitude': 77.5272
                },
                {
                    'name': "Bangalore Palace",
                    'latitude': 12.9988,
                    'longitude': 77.592
                }
            ],
            'map': '',
            'infowindow': '',
            'prevmarker': ''
        };

        // Bindings
        this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
    }

    componentDidMount() {
        window.initMap = this.initMap;
        // Loads Google Maps Script asynchronously.
        loadMap('https://maps.googleapis.com/maps/api/js?key=AIzaSyAg1zHsjgjRxh8rUak1oaikq_DDu7zqHyE&callback=initMap')
    }

    /**
     * Initialise the map after loading google map script 
     */
    initMap() {
        var self = this;

        //Map Style
        var mapview = document.getElementById('map');
        mapview.style.height = window.innerHeight + "px";
        var map = new window.google.maps.Map(mapview, {
            center: { lat: 12.9897, lng: 77.5881 },
            zoom: 13,
            mapTypeControl: false
        });

        var InfoWindow = new window.google.maps.InfoWindow({});

        window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
            self.closeInfoWindow();
        });

        this.setState({
            'map': map,
            'infowindow': InfoWindow
        });

        window.google.maps.event.addDomListener(window, "resize", function () {
            var center = map.getCenter();
            window.google.maps.event.trigger(map, "resize");
            self.state.map.setCenter(center);
        });

        window.google.maps.event.addListener(map, 'click', function () {
            self.closeInfoWindow();
        });

        var locations = [];
        //Custom Marker
        var icon = {
            url: "markerOrange.png",
            scaledSize: new window.google.maps.Size(35, 50), // scaled size
        };
        //Marker Style
        this.state.locations.forEach(function (location) {
            var locationName = location.name;
            var marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(location.latitude, location.longitude),
                icon: icon,
                animation: window.google.maps.Animation.DROP,
                map: map
            });

            marker.addListener('click', function () {
                self.openInfoWindow(marker);
            });

            location.locationName = locationName;
            location.marker = marker;
            location.display = true;
            locations.push(location);
        });
        this.setState({
            'locations': locations
        });
    }

    /**
     * Opens InfoWindow and shows relevant content by calling getMarkerInfo.
     */
    openInfoWindow(marker) {
        var icon = {
            url: "markerGreen.png", 
            scaledSize: new window.google.maps.Size(35, 50), // scaled size
        };
        this.closeInfoWindow();
        this.state.infowindow.open(this.state.map, marker);
        marker.setIcon(icon);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
            'prevmarker': marker
        });
        this.state.infowindow.setContent('Loading Information Content...');
        this.state.map.setCenter(marker.getPosition());
        this.state.map.panBy(0, -200);
        this.getMarkerInfo(marker);
    }

    /**
     * Shows the content of the marked location using FourSquare Api.
     */
    getMarkerInfo(marker) {
        var self = this;
        var clientId = "L1P2MQSSOFSROG5NLFGT1JWFW5J23XZSENK4ZDKFFPJPNWXN";
        var clientSecret = "OKE2U3YDZRT4ZW44T5UZKHWIUHQTQDQDR2XK25DD5JIIWUYN";
        var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
        fetch(url)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        self.state.infowindow.setContent("Sorry data can't be loaded");
                        return;
                    }
                    //Fetching response data
                    response.json().then(function (data) {
                        var location_data = data.response.venues[0];
                        var name = '<h3>' + location_data.name + '</h3>';
                        var address = '<b>Address: </b>' + location_data.location.formattedAddress + '<br>';
                        var verified = '<b>Verified Location: </b>' + location_data.verified + '<br>';
                        var readMore = '<a href="https://foursquare.com/v/' + location_data.id + '" target="_blank">Read More on Foursquare Website</a>'
                        //console.log(data.response.venues);
                        self.state.infowindow.setContent(name + address + verified + readMore);
                    });
                }
            )
            .catch(function (err) {
                self.state.infowindow.setContent("Sorry data can't be loaded");
            });
    }


    /**
     * Closes infowindow 
     */
    closeInfoWindow() {
        if (this.state.prevmarker) {
            this.state.prevmarker.setAnimation(null);
        }
        this.setState({
            'prevmarker': ''
        });
        this.state.infowindow.close();
    }

    render() {
        return (
            <div>
                <header>Bangalore Tourism</header>
                <LocationsNavBar key="100" locations={this.state.locations} openInfoWindow={this.openInfoWindow}
                    closeInfoWindow={this.closeInfoWindow} />
                <div id="map" role="application" aria-labelledby="map"></div>
                <footer>Copyright: Nikita Jibhkate, 2018</footer>
            </div>
        );
    }
}

export default App;

/**
 * Loads the google maps script
 */
function loadMap(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = function () {
        document.write("Unable to load Google Maps.");
    };
    ref.parentNode.insertBefore(script, ref);
}