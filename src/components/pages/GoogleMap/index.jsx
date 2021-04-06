import React from 'react';
import { compose, withProps } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

const MyMapComponent = compose(
	withProps({
		/**
		 * Note: create and replace your own key in the Google console.
		 * https://console.developers.google.com/apis/dashboard
		 * The key "AIzaSyBkNaAGLEVq0YLQMi-PYEMabFeREadYe1Q" can be ONLY used in this sandbox (no forked).
		 */
		googleMapURL:
			'https://maps.googleapis.com/maps/api/js?key=AIzaSyBWp-Ce86mQMVwodoLQuUqlsISiUsOrSU4&v=3.exp&libraries=geometry,drawing,places',
		loadingElement: <div style={{ height: `100%` }} />,
		containerElement: <div style={{ height: `400px` }} />,
		mapElement: <div style={{ height: `100%` }} />,
	}),
	withScriptjs,
	withGoogleMap
)((props) => (
	<GoogleMap defaultZoom={8} defaultCenter={{ lat: parseInt(props.latitude), lng: parseInt(props.longitude) }}>
		{props.isMarkerShown && <Marker position={{ lat: parseInt(props.latitude), lng: parseInt(props.longitude) }} />}
	</GoogleMap>
));

// ReactDOM.render(<MyMapComponent isMarkerShown />, document.getElementById('root'));
export default MyMapComponent;
