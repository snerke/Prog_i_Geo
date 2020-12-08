import React from "react";
import mapboxgl from "mapbox-gl/dist/mapbox-gl";

const Map2 = () => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic3ZlcnIiLCJhIjoiY2s2amd3cjI2MDdqMTNnbGFib2hkNjFudCJ9.2HRXzfU4p3vcPZ1AznoF2g';
    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.5, 40], // starting position
        zoom: 9 // starting zoom
    });

    map.addControl(new mapboxgl.NavigationControl());

    return (
        <div>
            <div id="map"></div>
        </div>
    )
}

export default Map2;