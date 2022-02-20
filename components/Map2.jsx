/*
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
 
const MapContainer = ({ google }) => (
    
    <Map google={google} zoom={14} containerStyle={{
        width: '100%',
        height: '100%',
        position: 'relative',
    }}>
        <Marker onClick={this.onMarkerClick}
                name={'Current location'} />
 
        <InfoWindow onClose={this.onInfoWindowClose}>
            <div>
              <h1>{this.state.selectedPlace.name}</h1>
            </div>
        </InfoWindow>
      </Map>
)
 
export default GoogleApiWrapper({
  apiKey: ("AIzaSyA-2hrkZS4W_t37X-iYVB4XmeDwwmZC1Dk")
})(MapContainer)
*/
import React from "react";
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function SimpleMap({ startingLocation }){
  const defaultProps = {
    center: startingLocation,
    zoom: 11
  };

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '100%', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyA-2hrkZS4W_t37X-iYVB4XmeDwwmZC1Dk" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <AnyReactComponent
          lat={10.99835602}
          lng={77.01502627}
          text="My Marker"
        />
      </GoogleMapReact>
    </div>
  );
}
