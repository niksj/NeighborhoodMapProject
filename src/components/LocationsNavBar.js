import React, {Component} from 'react';
import LocationsNavItem from './LocationsNavItem';

class LocationsNavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'locations': '',
            'query': '',
            'suggestions': true,
        };

        //Bindings filterLocations and toggleSuggestions
        this.filterLocations = this.filterLocations.bind(this);
        this.toggleSuggestions = this.toggleSuggestions.bind(this);
    }

    /**
     * Function to filter locations as per the query passed by the user in filter input box.
     */
    filterLocations(event) {
        this.props.closeInfoWindow();
        const {value} = event.target;
        var locations = [];
        this.props.locations.forEach(function (location) {
            if (location.locationName.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                location.marker.setVisible(true);
                locations.push(location);
            } else {
                location.marker.setVisible(false);
            }
        });

        this.setState({
            'locations': locations,
            'query': value
        });
    }

    componentWillMount() {
        this.setState({
            'locations': this.props.locations
        });
    }

    /**
     * Function to toggle the view of suggestions by Show/hide suggestions button
     */
    toggleSuggestions() {
        this.setState({
            'suggestions': !this.state.suggestions
        });
    }

    render() {
        var LocationsNavBar = this.state.locations.map(function (listItem, index) {
            return (
                <LocationsNavItem key={index} openInfoWindow={this.props.openInfoWindow.bind(this)} data={listItem}/>
            );
            
        }, this);

        return (
            <div className="search">
                <input role="search" aria-labelledby="search" id="search-field" className="search-field" type="text" placeholder="Filter"
                       value={this.state.query} onChange={this.filterLocations}/>
                <ul>
                    {this.state.suggestions && LocationsNavBar}
                </ul>
                <button className="button" onClick={this.toggleSuggestions}>Show/Hide Suggestions</button>
            </div>
        );
    }
}

export default LocationsNavBar;