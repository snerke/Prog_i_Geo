import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import SidePanel from "../SidePanel/SidePanel";
import "./Map.css";
import gloshaugen from "../../sample_data/gloshaugen.json";
import trondheim_vann from "../../sample_data/trondheim_vann4.json";
import trondheim_bygg from "../../sample_data/trondheim_bygg31.json";
import trondheim_veg from "../../sample_data/trondheim_veg7.json";
import * as turf from '@turf/turf';
import buffer from "@turf/buffer";

const Map = () => {
  const [map, setMap] = useState(null);
  const [mapLayers, setMapLayers] = useState([]);
  const [currentDate, setCurrentDate] = useState("-")
  const mapContainer = useRef(null);
  //let currentDate = useRef(null)

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/satellite-v9", // stylesheet location
        center: [-25, 45],
        zoom: 3,
      });

    let halifax = [-63.582687, 44.651070];
    let belfast_lough = [-5.785, 54.691];
    let avonmouth = [-2.6987, 51.5034];
    let milford_haven = [-5.0341, 51.7128];
    let st_john_nb = [-66.0628, 45.2796];
    let swansea = [-3.943646, 51.621441];
    let sydney_cb = [-60.195556, 46.136389];
    let liverpool = [-2.983333, 53.400002];
    let father_point = [-68.461111, 48.513889];
    let clyde = [-4.629179, 55.458565];


    let totalRouteNames = [["Halifax", halifax], ["Belfast Lough", belfast_lough], ["Avonmouth", avonmouth], ["Milford Haven", milford_haven]]
    let totalroute = [st_john_nb, halifax, belfast_lough, avonmouth, milford_haven, st_john_nb, halifax, belfast_lough, swansea, milford_haven,
    halifax, belfast_lough, avonmouth, milford_haven, halifax];
    
    let dates = ["-", "Jan. 7, 1942 - Jan. 9, 1942", "Jan. 13, 1942 - Jan. 28, 1942", "Jan. 29, 1942 - Jan. 30, 1942", "Feb. 11, 1942 - Feb. 12, 1942", "Feb. 13, 1942 - Mar. 2, 1942", "Mar. 12, 1942 - Mar. 13, 1942", "Mar. 15, 1942 - Mar. 26, 1942", "Mar. 28, 1942 - Mar. 29, 1942", "Apr. 8, 1942 - Apr. 8, 1942", "Apr. 9, 1942 - Apr. 22, 1942", "Mai 10, 1942 - Mai 21, 1942", "Mai 23, 1942 - Mai 25, 1942", "14", "15"];
    //setCurrentDate(dates[0]);

    for (let i = 0; i < totalRouteNames.length; i++) {
      console.log("ÆÆÆ", totalRouteNames[i])
    }
    
    // A simple line from origin to destination.
    let route = {
    'type': 'FeatureCollection',
    'features': [
    {
    'type': 'Feature',
    'geometry': {
    'type': 'LineString',
    'coordinates': totalroute
    }
    }
    ]
    };

    
    // A single point that animates along the route.
    // Coordinates are initially set to origin.
    let point = {
    'type': 'FeatureCollection',
    'features': [
    {
    'type': 'Feature',
    'properties': {},
    'geometry': {
    'type': 'Point',
    'coordinates': halifax
    }
    }
    ]
    };


    map.loadImage(
      'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
      function (error, image) {
      if (error) throw error;
      map.addImage('custom-marker', image);
      // Add a GeoJSON source with 2 points
      map.addSource('points', {
      'type': 'geojson',
      'data': {
      'type': 'FeatureCollection',
      'features': [
      /*
      let halifax = [-63.582687, 44.651070];
      let belfast_lough = [-5.785, 54.691];
      let avonmouth = [-2.6987, 51.5034];
      let milford_haven = [-5.0341, 51.7128];
      let st_john_nb = [-66.0628, 45.2796];
      let swansea = [-3.943646, 51.621441];
      let sydney_cb = [-60.195556, 46.136389];
      let liverpool = [-2.983333, 53.400002];
      let father_point = [-68.461111, 48.513889];
      let clyde = [-4.629179, 55.458565];
      */
      {
        'type': 'Feature',
        'geometry': {
        'type': 'Point',
        'coordinates': clyde
        },
        'properties': {
        'title': 'Clyde,\nSkottland'
        }
        },
     {
      'type': 'Feature',
      'geometry': {
      'type': 'Point',
      'coordinates': liverpool
      },
      'properties': {
      'title': 'Liverpool,\nEngland',
      }
      },
      {
        'type': 'Feature',
        'geometry': {
        'type': 'Point',
        'coordinates': sydney_cb
        },
        'properties': {
        'title': 'Sydney, C.B.,\nCanada'
        }
        },
     {
      'type': 'Feature',
      'geometry': {
      'type': 'Point',
      'coordinates': swansea
      },
      'properties': {
      'title': 'Swansea,\nWales'
      }
      },
     {
      'type': 'Feature',
      'geometry': {
      'type': 'Point',
      'coordinates': st_john_nb
      },
      'properties': {
      'title': 'St. John, N.B.,\nCanada'
      }
      },
     {
      'type': 'Feature',
      'geometry': {
      'type': 'Point',
      'coordinates': milford_haven
      },
      'properties': {
      'title': 'Milford Haven,\nWales'
      }
      },
      {
      'type': 'Feature',
      'geometry': {
      'type': 'Point',
      'coordinates': avonmouth
      },
      'properties': {
      'title': 'Avonmouth,\nEngland'
      }
      },
      {
      'type': 'Feature',
      'geometry': {
      'type': 'Point',
      'coordinates': halifax
      },
      'properties': {
      'title': 'Halifax,\nCanada'
      }
      },
      {
      'type': 'Feature',
      'geometry': {
      'type': 'Point',
      'coordinates': belfast_lough
      },
      'properties': {
      'title': 'Belfast Lough,\nNorthern Ireland'
      }
      }
      ]
      }
      });
       
      // Add a symbol layer
      /*map.addLayer({
        'id': 'points',
        'type': 'symbol',
        'source': 'points',
        'layout': {
          'icon-image': 'custom-marker',
          // get the title name from the source's "title" property
          'text-field': ['get', 'title'],
          'text-font': [
            'Open Sans Semibold',
            'Arial Unicode MS Bold'
          ],
          'text-offset': [0, 1.25],
          'text-anchor': 'top'
        },
        paint: {
          "text-color": "white"
        }
      });*/
      }
      );




    let currentRoute = 0;

    let lines = []
    console.log("b", route.features[0].geometry.coordinates)
    for(let i = 0; i<route.features[0].geometry.coordinates.length-1; i++) {
      let line = {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Line",
          "coordinates": [route.features[0].geometry.coordinates[i], route.features[0].geometry.coordinates[i+1]]
        }
      }
      //console.log(line)
      lines.push(line);
      //console.log("lines", lines)
    }

    //console.log("HER", lines[0])

    let routes = {
      "type": "FeatureCollection",
      "features": lines
    }
    console.log("routes", routes);
    
    // Calculate the distance in kilometers between route start/end point.
    let lineDistance = turf.length(route.features[0]);
    console.log("lineDistance", lineDistance)

    /*let steps2 = 500;
    let arc2;

    for (let i = 0; i < routes.features.length - 1; i++) {
      let pointA;
      let pointB;

      let currLine = {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'geometry': {
              'type': 'LineString',
              'coordinates': [pointA, pointB]
            }
          }
        ]
      };
      route.features[0].geometry.coordinates = arc2;

      
    }*/

    //blir ikke brukt..
    function animateLine(currentRoute) {
      console.log("animateLine");
      
      let pointA = routes.features[currentRoute];
      let pointB = routes.features[currentRoute + 1];

      let arc = []
      
      for (let i = 0; i < lineDistance; i += lineDistance / steps) {
        let segment = turf.along(route.features[0], i);
        arc.push(segment.geometry.coordinates);
      }

      currentRoute += 1;
      if (currentRoute > routes.features) {
        currentRoute = 0;
      }
    }


    let arc = [];
    // Number of steps to use in the arc and animation, more steps means
    // a smoother arc and animation, but too many steps will result in a
    // low frame rate
    let steps = 500 * (totalroute.length - 1);
    
    // Draw an arc between the `origin` & `destination` of the two points
    for (let i = 0; i < lineDistance; i += lineDistance / steps) {
      let segment = turf.along(route.features[0], i);
      arc.push(segment.geometry.coordinates);
    }



    
    // Update the route with calculated arc coordinates
    route.features[0].geometry.coordinates = arc;
    
    // Used to increment the value of the point measurement against the route.
    let counter = 0;
    
    map.on('load', function () {
    // Add a source and layer displaying a point which will be animated in a circle.
    map.addSource('route', {
    'type': 'geojson',
    'data': route
    });
    
    map.addSource('point', {
    'type': 'geojson',
    'data': point
    });
    
    map.addLayer({
    'id': 'route',
    'source': 'route',
    'type': 'line',
    'paint': {
    'line-width': 2,
    'line-color': '#007cbf'
    }
    });

    map.addLayer({
      'id': 'points',
      'type': 'symbol',
      'source': 'points',
      'layout': {
        'icon-image': 'custom-marker',
        // get the title name from the source's "title" property
        'text-field': ['get', 'title'],
        'text-font': [
          'Open Sans Semibold',
          'Arial Unicode MS Bold'
        ],
        'text-offset': [0, 1.25],
        'text-anchor': 'top'
      },
      paint: {
        "text-color": "white"
      }
    });
    
    map.addLayer({
    'id': 'point',
    'source': 'point',
    'type': 'symbol',
    'layout': {
    'icon-image': 'ferry-15',
    'icon-rotate': ['get', 'bearing'],
    'icon-rotation-alignment': 'map',
    'icon-allow-overlap': true,
    'icon-ignore-placement': true
    }
    });

    let point_a;
    let point_b;


    //Prøve å få denne til å kjøre for hver strekning
    /*for (let i = 0; i < totalroute.length - 1; i++ ) {
      console.log("DUM FOR-LOOP");
      //console.log("RUTE", i)
      let arc = [];
      point_a = totalroute[i];
      point_b = totalroute[i+1];
      let route = {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'geometry': {
              'type': 'LineString',
              'coordinates': [point_a, point_b]
            }
          }
          ]
        };
      let lineDistance = turf.length(route.features[0]);
      //console.log("lineDistance", lineDistance)
      counter = 0;
      // Number of steps to use in the arc and animation, more steps means
      // a smoother arc and animation, but too many steps will result in a
      // low frame rate
      // Draw an arc between the `origin` & `destination` of the two points
      for (let i = 0; i < lineDistance; i += lineDistance / steps) {
        let segment = turf.along(route.features[0], i);
        arc.push(segment.geometry.coordinates);
      }
      // Update the route with calculated arc coordinates
      route.features[0].geometry.coordinates = arc;
      animate(counter, point_a);

    }*/
    let route_animate;
    //animere en del per klikk
    let route_counter = 0;
    map.flyTo({
      center: halifax,
      zoom: 5.8,
    })
    document.getElementById('replay')
    document.addEventListener('click', function () {
      console.log("KUL KLIKK-RUTE", route_counter);
      console.log("RUTE", route_counter)
      let arc = [];
      point_a = totalroute[route_counter];
      point_b = totalroute[route_counter+1];
      route_animate = {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'geometry': {
              'type': 'LineString',
              'coordinates': [point_a, point_b]
            }
          }
          ]
        };
      let lineDistance = turf.length(route_animate.features[0]);
      //console.log("lineDistance", lineDistance)
      counter = 0;
      // Number of steps to use in the arc and animation, more steps means
      // a smoother arc and animation, but too many steps will result in a
      // low frame rate
      let steps = 150;      
      // Draw an arc between the `origin` & `destination` of the two points
      for (let i = 0; i < lineDistance * 1.10; i += (lineDistance) / (steps) ) {
        let segment = turf.along(route_animate.features[0], i);
        arc.push(segment.geometry.coordinates);
      }
      // Update the route with calculated arc coordinates
      route_animate.features[0].geometry.coordinates = arc;
      animate(counter, point_a, point_b);
      map.flyTo({
        center: point_b,
        zoom: 5.95,
        speed: 0.8,
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
      });
      console.log("currentDate: ", currentDate)
      /*if (route_counter >= totalroute.length) {
        route_counter = 0;
      }
      // Set the coordinates of the original point back to origin
      //point.features[0].geometry.coordinates = origin;
      
      point.features[0].geometry.coordinates = totalroute[route_counter]

      // Update the source layer
      map.getSource('point').setData(point);
      
      // Reset the counter
      counter = 0;
      
      //  Restart the animation
      animate(counter);*/
      route_counter += 1;
      changeDate(route_counter)
    });

    function changeDate(route_counter) {
      console.log(currentDate)
      console.log("trying to set current date");
      setCurrentDate(dates[route_counter]);
      console.log(currentDate)
      console.log("current date hopefully set")
    }
    
    //faktiske animasjonsfunksjonen
    function animate() {
      //console.log(route_counter)
      //console.log("a", point_a, "b", point_b);
      //console.log("POINT", point_a)
      //console.log("animate @201")
      let start =
      route_animate.features[0].geometry.coordinates[
      counter >= steps ? counter - 1 : counter
      ];
      let end =
      route_animate.features[0].geometry.coordinates[
      counter >= steps ? counter : counter + 1
      ];
      if (!start || !end) return;
      
      // Update point geometry to a new position based on counter denoting
      // the index to access the arc
      point.features[0].geometry.coordinates = route_animate.features[0].geometry.coordinates[counter];
      
      // Calculate the bearing to ensure the icon is rotated to match the route arc
      // The bearing is calculated between the current point and the next point, except
      // at the end of the arc, which uses the previous point and the current point
      point.features[0].properties.bearing = turf.bearing(
      turf.point(start),
      turf.point(end)
      );
      
      // Update the source with this new data
      map.getSource('point').setData(point);
      
      // Request the next frame of animation as long as the end has not been reached
      if (counter < steps) {
        requestAnimationFrame(animate);
      }
      
      counter = counter + 1;
    }
    

    
    
      // Start the animation
      //animate(counter);
    });

      //add base layers to the map and sets mapLayers
      function addLayers() {
        let mapLayers = map.getStyle().sources;
        if(!("gloshaugen" in mapLayers)) {
          addNewLayer("gloshaugen", gloshaugen);
        }
        if(!("trondheim_vann" in mapLayers)) {
          addNewLayer("trondheim_vann", trondheim_vann);
        }
        if(!("trondheim_veg" in mapLayers)) {
          addNewLayer("trondheim_veg", trondheim_veg);
        }
        if(!("trondheim_bygg" in mapLayers)) {
          addNewLayer("trondheim_bygg", trondheim_bygg);
        }
        let mapSourceLength = Object.keys(map.getStyle().sources).length - 1;
        if(mapSourceLength === 0) {
          //in case the last layer was removed from the map, mapLayers is set to an empty array
          setMapLayers([]);
        } else {
          //updates mapLayers if there are still layers left
          let mapLayersInOrder = map.getStyle().layers.slice(-1 * mapSourceLength).map(function (obj) { return obj.id; });
          setMapLayers(mapLayersInOrder);
        }
        updateButtons();
      }

      //pops a prompt for the user to pick a name for the new layer, if no name is chosen, no layer is added
      function addNewLayer(layerName, data) {
        try{
          setTimeout(() => {
            let mapSourceLength = Object.keys(map.getStyle().sources).length - 1;
            if(mapSourceLength === 0) {
              //in case the last layer was removed from the map, mapLayers is set to an empty array
              setMapLayers([]);
            } else {
              //updates mapLayers if there are still layers left
              let mapLayersInOrder = map.getStyle().layers.slice(-1 * mapSourceLength).map(function (obj) { return obj.id; });
              setMapLayers(mapLayersInOrder);
            }
            updateButtons();
          }, 350);
          let mapSourceLength = Object.keys(map.getStyle().sources).length - 1;
          if(mapSourceLength > 0) {
            let mapLayersInOrder = map.getStyle().layers.slice(-1 * mapSourceLength).map(function (obj) { return obj.id; });
            setMapLayers(mapLayersInOrder);
          }
          if(layerName === null) {
            layerName = prompt("Enter a name for your layer");
          }
          if (layerName === null || layerName === "") {
            //nothing happens if the prompt is cancelled or if no name is typed into the prompt
          } else {
            let layerType;
            if(data.type === "Feature") {
              layerType = data.geometry.type;
              
            } else if(data.type === "FeatureCollection") {
              layerType = data.features[0].geometry.type;
            } else {
              console.log("we have something else");
            }
            //checks what kind of layer the data is referring to and adds the corresponding type of layer
            if(layerType === "Polygon" || layerType === "MultiPolygon") {
              //checks if layerType is polygon or multipolygon and adds the data as a polygon layer
              map.addSource(layerName, {
                type: "geojson",
                data: data,
              })
              map.addLayer({
                "id": layerName,
                "type": "fill",
                "source": layerName,
                "paint": {
                  "fill-color": randomizeColor(),
                  "fill-opacity": 1,
                }
              })
            } else if (layerType === "Line" || layerType === "MultiLineString") {
              //checks if layerType is line or multilinestring and adds the data as a line layer
              map.addSource(layerName, {
                type: "geojson",
                data: data,
              })
              map.addLayer({
                "id": layerName,
                "type": "line",
                "source": layerName,
                "layout": {
                  "line-join": "round",
                  "line-cap": "round"
                },
                "paint": {
                  "line-color": randomizeColor(),
                  "fill-opacity": 1,
                  "line-width": 4,
                }
              })
            } else if(layerType === "Point" || layerType === "MultiPoint") {
              //checks if layerType a point or multipoint and adds the data as a point layer
              map.addSource(layerName, {
                type: "geojson",
                data: data,
              })
              map.addLayer({
                "id": layerName,
                "type": "circle",
                "source": layerName,
                "paint": {
                  "circle-radius": {
                    'base': 2,
                    'stops': [[12, 2], [16, 5]]
                  },
                  "circle-color": randomizeColor(),
                }
              })
            }
          }
        }
        catch(err) {
          alert("Could not add layer");
        }
      }

      //removes all layers added to the map
      function removeAllLayers() {
        try{
          let layerSources = map.getStyle().sources;
          setTimeout(() => {
            for (let layerSource in layerSources) {
              if(layerSource !== "composite") {
                try{
                  map.removeLayer(layerSource);
                  map.removeSource(layerSource);
                }
                catch(err) {
                  alert(err);
                }
              }
            }}, 350);
        }
        catch(err) {
          alert(err);
        }
        setTimeout(() => {
          setMapLayers([]);
          updateButtons();
        }, 350);
      }

      //removes a single layer from the map
      function removeSingleLayer() {
        try{
          let selectedLayer = this.id;
          try {
            map.removeLayer(selectedLayer);
            map.removeSource(selectedLayer);
          }
          catch(err) {
            alert(err);
          }
          //updates mapLayers
          setTimeout(() => {
            let mapSourceLength = Object.keys(map.getStyle().sources).length - 1;
            if(mapSourceLength === 0) {
              //in case the last layer was removed from the map, mapLayers is set to an empty array
              setMapLayers([]);
            } else {
              //updates mapLayers if there are still layers left
              let mapLayersInOrder = map.getStyle().layers.slice(-1 * mapSourceLength).map(function (obj) { return obj.id; });
              setMapLayers(mapLayersInOrder);
            }
            updateButtons();
          }, 350);
        }
        catch(err) {
          alert(err);
        }
      }

      //creates a buffer around the selected layer
      function createBuffer() {
        toggleSpinner();
        setTimeout(() => {
          try{
            let selectedLayer = document.getElementById("bufferSelectLayer").value;
            let bufferSize = document.getElementById("bufferInputField").value/1000;
            if(bufferSize > 0) {
              let turfed;
              if (map.getSource(selectedLayer)._data.type === "FeatureCollection") {
                turfed = map.getSource(selectedLayer)._data;
              } else {
                let features = map.getSource(selectedLayer)._data.features;
                turfed = turf.featureCollection(features);
              }
              
              let bufferData = buffer(turfed, bufferSize);
              addNewLayer(null, bufferData);
              setTimeout(() => {
                let mapSourceLength = Object.keys(map.getStyle().sources).length - 1;
                if(mapSourceLength === 0) {
                  setMapLayers([]);
                } else {
                  let mapLayersInOrder = map.getStyle().layers.slice(-1 * mapSourceLength).map(function (obj) { return obj.id; });
                  setMapLayers(mapLayersInOrder);
                }
                updateButtons();
                toggleSpinner();
              }, 350);
            } else {
              toggleSpinner();
              alert("Please choose a buffer size greater than 0");
            }
          }
          catch(err) {
            toggleSpinner();
            alert("Please pick a layer and a buffer size");
          }
        }, 100);
      }

      //creates a union between two layers of the same type
      function createUnion() {
        toggleSpinner();
        setTimeout(() => {
          try{
            //finds which layers the user wants to create a union from
            let selectedLayer1 = document.getElementById("unionSelectLayer1").value;
            let selectedLayer2 = document.getElementById("unionSelectLayer2").value;
            //finds the types of the layers to check that they are of the same type
            let layerType1 = map.getSource(selectedLayer1)._data.features[0].geometry.type.replace("Multi", "");
            let layerType2 = map.getSource(selectedLayer2)._data.features[0].geometry.type.replace("Multi", "");
            if(layerType1 === layerType2) {
              //union does not support multifeatures, so each feature must be individually added to the union 
              let currUnion = turf.union(map.getSource(selectedLayer1)._data.features[0], map.getSource(selectedLayer2)._data.features[0]);
              for(let i = 1; i < map.getSource(selectedLayer1)._data.features.length; i++) {
                currUnion = turf.union(currUnion, map.getSource(selectedLayer1)._data.features[i]);
              }
              for(let i = 1; i < map.getSource(selectedLayer2)._data.features.length; i++) {
                currUnion = turf.union(currUnion, map.getSource(selectedLayer2)._data.features[i]);
              }
              //changes the type of the union result to feature collection if needed
              if(currUnion.type === "Feature") {
                currUnion = turf.featureCollection([currUnion]);
              }
              //adds the new layer to the map and updates mapLayers and buttons
              addNewLayer(null, currUnion);
              setTimeout(() => {
                let mapSourceLength = Object.keys(map.getStyle().sources).length - 1;
                if(mapSourceLength === 0) {
                  setMapLayers([]);
                } else {
                  let mapLayersInOrder = map.getStyle().layers.slice(-1 * mapSourceLength).map(function (obj) { return obj.id; });
                  setMapLayers(mapLayersInOrder);
                }
                updateButtons();
                toggleSpinner();
              }, 350);
            } else {
              toggleSpinner();
              alert("Choose two layers of the same type");
            }
          }
          catch(err) {
            toggleSpinner();
            alert("Pick two layers that are of the same type");
          }
        }, 100);
      }

      //creates intersection between two layers
      function createIntersect() {
        toggleSpinner();
        setTimeout(() => {
          try {
            let selectedLayer1 = document.getElementById("intersectSelectLayer1").value;
            let selectedLayer2 = document.getElementById("intersectSelectLayer2").value;
            let layerType1 = map.getSource(selectedLayer1)._data.features[0].geometry.type.replace("Multi", "");
            let layerType2 = map.getSource(selectedLayer2)._data.features[0].geometry.type.replace("Multi", "");
            if(layerType1 === "Polygon" && layerType2 === "Polygon") {
              //turf.intersect accepts single features, so it is needed to iterate through the features and combining them into a single feature
              let unioned =  map.getSource(selectedLayer1)._data.features[0];
              if(map.getSource(selectedLayer1)._data.features.length > 1) {
                for(let i = 1; i < map.getSource(selectedLayer1)._data.features.length; i++) {
                  unioned = turf.union(unioned, map.getSource(selectedLayer1)._data.features[i]);
                }
              }
              //instead of finding the intersection, we find first find the difference between the two layers
              let currDiff = turf.difference(unioned, map.getSource(selectedLayer2)._data.features[0]);
              for(let i = 1; i < map.getSource(selectedLayer2)._data.features.length; i++) {
                currDiff = turf.difference(currDiff, map.getSource(selectedLayer2)._data.features[i]);
              }
              //then we find the difference between the first layer and the difference from earlier to get the intersection
              let intersected = turf.difference(unioned, currDiff);
              for(let i = 1; i < map.getSource(selectedLayer2)._data.features.length; i++) {
                intersected = turf.difference(intersected, map.getSource(selectedLayer2)._data.features[i]);
              }
              if(intersected.type === "Feature") {
                intersected = turf.featureCollection([intersected]);
              }
              //doing difference twice instead of doing intersection once will probably affect run time, but it was easier working with difference as it accepts multipolygons
              addNewLayer(null, intersected)
              setTimeout(() => {
                let mapSourceLength = Object.keys(map.getStyle().sources).length - 1;
                if(mapSourceLength === 0) {
                  setMapLayers([]);
                } else {
                  let mapLayersInOrder = map.getStyle().layers.slice(-1 * mapSourceLength).map(function (obj) { return obj.id; });
                  setMapLayers(mapLayersInOrder);
                }
                updateButtons();
                toggleSpinner();
              }, 350);
            } else {
              toggleSpinner();
              alert("Pick two polygon layers");
            }
          }
          catch(err) {
            toggleSpinner();
            alert("Please pick two polygon layers");
          }
        }, 100);
      }

      //finds the difference between two layers, with focus being on the first layer
      function createDifference() {
        toggleSpinner();
        setTimeout(() => {
          try {
            //does the same as intersect except for the second difference operation
            let selectedLayer1 = document.getElementById("differenceSelectLayer1").value;
            let selectedLayer2 = document.getElementById("differenceSelectLayer2").value;
            let layerType1 = map.getSource(selectedLayer1)._data.features[0].geometry.type.replace("Multi", "");
            let layerType2 = map.getSource(selectedLayer2)._data.features[0].geometry.type.replace("Multi", "");
            if(layerType1 === "Polygon" && layerType2 === "Polygon") {
              let unioned =  map.getSource(selectedLayer1)._data.features[0];
              if(map.getSource(selectedLayer1)._data.features.length > 1) {
                for(let i = 1; i < map.getSource(selectedLayer1)._data.features.length; i++) {
                  unioned = turf.union(unioned, map.getSource(selectedLayer1)._data.features[i]);
                }
              } else {
                unioned = map.getSource(selectedLayer1)._data.features[0];
              }
              let currDiff = turf.difference(unioned, map.getSource(selectedLayer2)._data.features[0]);
              for(let i = 1; i < map.getSource(selectedLayer2)._data.features.length; i++) {
                currDiff = turf.difference(currDiff, map.getSource(selectedLayer2)._data.features[i]);
              }
              if(currDiff === null) {
                //as order matters when doing difference, it is possible for the user to use the wrong order and get no result
                //this happens if the entirity of layer 1 is covered by layer 2
                alert("Make sure you have selected two different layers and in the correct order");
              } else {
                if(currDiff.type === "Feature") {
                  currDiff = turf.featureCollection([currDiff]);
                }
                addNewLayer(null, currDiff)
                setTimeout(() => {
                  let mapSourceLength = Object.keys(map.getStyle().sources).length - 1;
                  if(mapSourceLength === 0) {
                    setMapLayers([]);
                  } else {
                    let mapLayersInOrder = map.getStyle().layers.slice(-1 * mapSourceLength).map(function (obj) { return obj.id; });
                    setMapLayers(mapLayersInOrder);
                  }
                  updateButtons();
                  toggleSpinner();
                }, 350);
              }
            } else {
              toggleSpinner();
              alert("Pick two polygon layers");
            }
          }
          catch(err) {
            toggleSpinner();
            alert("Please pick two polygon layers");
          }
        }, 100);
      }

      //creates a single point from given coordinates
      function createPoint() {
        //changes the coordinate values from strings to floats
        let longCoord = parseFloat(document.getElementById("createPointLong").value);
        let latCoord = parseFloat(document.getElementById("createPointLat").value);
        //creates a feature collection from the point
        if((!isNaN(longCoord) && !isNaN(latCoord)) && (longCoord <= 180 && longCoord >= -180) && (latCoord <= 85 && latCoord >= -85) ) {
          let data = {"type": "FeatureCollection", 
            "features": [
              {
                "type": "Feature",
                "geometry": {
                "type": "Point",
                "coordinates": [
                  longCoord,
                  latCoord
                ]
              }
            }]
          }
          addNewLayer(null, data);
          setTimeout(() => {
            let mapSourceLength = Object.keys(map.getStyle().sources).length - 1;
              if(mapSourceLength === 0) {
                setMapLayers([]);
              } else {
                let mapLayersInOrder = map.getStyle().layers.slice(-1 * mapSourceLength).map(function (obj) { return obj.id; });
                setMapLayers(mapLayersInOrder);
              }
            updateButtons();
          }, 350);
        } else {
          alert("Please provide coordinates for the point you want to make")
        }
      }

      //changes the visibility of a single layer depends on if it is visible or not
      function showOrHide() {
        let selectedLayer = this.id;
        let visibility = map.getLayoutProperty(selectedLayer, "visibility");
        if(visibility === "visible" || visibility === undefined) {
          map.setLayoutProperty(selectedLayer, "visibility", "none");
          this.textContent = "Show";
        } else {
          map.setLayoutProperty(selectedLayer, "visibility", "visible");
          this.textContent = "Hide";
        }
      }

      //creates a random color to be used for new layers
      function randomizeColor() {
        let colorLetters = "0123456789ABCDEF";
        let randomColor = "#";
        for (let i = 0; i < 6; i++) {
          randomColor += colorLetters[Math.floor(Math.random() * colorLetters.length)];
        }
        return randomColor;
      }

      //listener that listens to input and if the input type is color changes the color of a layer
      document.addEventListener("input", function(event) {
        if(event.target.type === "color") {
          map.setPaintProperty(event.target.id, "fill-color", event.target.value);
        }
      })



      let dragging = null;
      //listener that detects if an object gets dragged
      document.addEventListener('dragstart', function(event) {
        let target = getLI( event.target );
        dragging = target;
        event.dataTransfer.setData('text/plain', null);
      });

      //listener that detects if a draggable object is dragged over another draggable object and then shows where the dragged object will be dropped when dropped
      document.addEventListener('dragover', function(event) {
        try {
          event.preventDefault();
          let target = getLI( event.target );
          let bounding = target.getBoundingClientRect()
          let offset = bounding.y + (bounding.height/2);
          if ( event.clientY - offset > 0 ) {
            target.style['border-bottom'] = 'solid 75px white';
            target.style['border-top'] = '';
          } else {
            target.style['border-top'] = 'solid 75px white';
            target.style['border-bottom'] = '';
          }
        }
        catch(err) {
        }
      });

      //listener that detects if a draggable object is dragged out of a element
      document.addEventListener('dragleave', function(event) {
        try {
          let target = getLI( event.target );
          target.style['border-bottom'] = '';
          target.style['border-top'] = '';
        }
        catch(err) {
        }
      });

      //listener that detects if a draggable object is dropped and moves the corresponding layer to the wanted position with regards to the z-axis
      document.addEventListener('drop', function(event) {
        try {
          event.preventDefault();
          let target = getLI( event.target );
          if ( target.style['border-bottom'] !== '' ) {
            target.style['border-bottom'] = '';
            target.parentNode.insertBefore(dragging, event.target.nextSibling);
          } else {
            target.style['border-top'] = '';
            target.parentNode.insertBefore(dragging, event.target);
          }
          if(dragging.previousSibling) {
            map.moveLayer(dragging.id, dragging.previousSibling.id);
          } else {
            map.moveLayer(dragging.id);
          }
          setMapLayers([]);
          setTimeout(() => {
            let mapSourceLength = Object.keys(map.getStyle().sources).length - 1;
              if(mapSourceLength === 0) {
                setMapLayers([]);
              } else {
                let mapLayersInOrder = map.getStyle().layers.slice(-1 * mapSourceLength).map(function (obj) { return obj.id; });
                setMapLayers(mapLayersInOrder);
              }
            updateButtons();
          }, 25);
        }
        catch(err) {
        }
      });

      function getLI( target ) {
          while ( target.nodeName.toLowerCase() !== 'li' && target.nodeName.toLowerCase() !== 'body' ) {
              target = target.parentNode;
          }
          if ( target.nodeName.toLowerCase() === 'body' ) {
              return false;
          } else {
              return target;
          }
      }

      //switches between showing and hiding the spinner indicating that the application is working
      function toggleSpinner() {
        let spinner = document.getElementById("loadingspinner");
        if(spinner.style.display === "block") {
          spinner.style.display = "none";
        } else if(spinner.style.display === "none") {
          spinner.style.display = "block"
        }
      }

      //updates the buttons to ensure that the buttons to new layers works
      function updateButtons() {
        let functionality = document.getElementById('functionality');
        let buttons = functionality.getElementsByTagName('button');
        for(let i = 0; i < buttons.length; i++) {
          if(buttons[i].id === "addBaseLayersButton") {
            buttons[i].onclick = addLayers;
          }
          else if(buttons[i].id === "removeAllLayersButton") {
            buttons[i].onclick = removeAllLayers;
          }
          else if(buttons[i].id === "bufferButton") {
            buttons[i].onclick = createBuffer;
          }
          else if(buttons[i].id === "unionButton") {
            buttons[i].onclick = createUnion;
          }
          else if(buttons[i].id === "intersectButton") {
            buttons[i].onclick = createIntersect;
          }
          else if(buttons[i].id === "differenceButton") {
            buttons[i].onclick = createDifference;
          }
          else if(buttons[i].textContent === "Hide" || buttons[i].textContent === "Show") {
            buttons[i].onclick = showOrHide;
          }
          else if(buttons[i].textContent === "Delete") {
            buttons[i].onclick = removeSingleLayer;
          }
          else if(buttons[i].id === "createPointButton") {
            buttons[i].onclick = createPoint;
          }
        }
      }
    };
    if (!map) initializeMap({ setMap, mapContainer });
  }, [map, mapLayers]);

  return (
    <div>
      <div className="container">
        
        <div className="mapcontainer">
          <div ref={el => (mapContainer.current = el)} className="map" />
          <div class="map-overlay top">
            <div class="map-overlay-inner">
              <fieldset>
                <label>Avreise - Ankomst:</label>
                <label>{currentDate}</label>
                <div id="swatches"></div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Map;