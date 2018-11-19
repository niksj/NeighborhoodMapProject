import React from 'react';

class LocationsNavItem extends React.Component {
    /** Renders every Locations-NavBar Item: Side Vertical nav */
    render() {
        return (
            <li
                role="button"
                className="box"
                tabIndex="0"
                onKeyPress={this.props.openInfoWindow.bind(this, this.props.data.marker)}
                onClick={this.props.openInfoWindow.bind(this, this.props.data.marker)}>{this.props.data.locationName}
            </li>
        );
    }
}

export default LocationsNavItem;