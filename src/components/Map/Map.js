import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import SidePanel from "../SidePanel/SidePanel";
import "./Map.css";
import gloshaugen from "../../sample_data/gloshaugen.json";
import test_points from "../../sample_data/test_points.json";
import trondheim_vann from "../../sample_data/trondheim_vann3.json";
import trondheim_bygg from "../../sample_data/trondheim_bygg31.json";
import trondheim_veg from "../../sample_data/trondheim_veg7.json";
import * as turf from '@turf/turf';
import buffer from "@turf/buffer";


const Map = () => {
  const [map, setMap] = useState(null);
  const [mapLayers, setMapLayers] = useState([]);
  const mapContainer = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
        center: [10.4, 63.42],
        zoom: 13.25,
      });

      map.addControl(new mapboxgl.NavigationControl());

      map.on("load", () => {
        setMap(map);
        setMapLayers([]);
        map.resize();
        updateButtons();
        toggleSpinner();
      });

      //when the map is clicked a point will be made with those coordinates (can be cancelled)
      map.on("click", function(e) {
        let coords = e.lngLat;
          let data = {"type": "FeatureCollection", 
          "features": [
            {
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": [
                  coords.lng,
                  coords.lat
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
          }, 500);
      });

      //add base layers to the map and sets mapLayers
      function addLayers() {
        let mapLayers = map.getStyle().sources;
        if(!("gloshaugen" in mapLayers)) {
          addNewLayer("gloshaugen", gloshaugen);
        }
        if(!("test_points" in mapLayers)) {
          addNewLayer("test_points", test_points);
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
          console.log(layerSources);
          setTimeout(() => {let i = 0;
            for (let layerSource in layerSources) {
              if(layerSource !== "composite") {
                try{
                  console.log(layerSource);
                  map.removeLayer(layerSource);
                  map.removeSource(layerSource);
                }
                catch(err) {
                  alert(err);
                }
              }
              i++;
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
            console.log(bufferSize);
            if(bufferSize > 0) {
              console.log(map.getSource(selectedLayer));
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
            console.log(err);
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
        if(!isNaN(longCoord) && !isNaN(latCoord)) {
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
          console.log(map.getStyle().layers.slice(-1 * (Object.keys(map.getStyle().sources).length - 1)).map(function (obj) { return obj.id; }));
          event.preventDefault();
          let target = getLI( event.target );
          if ( target.style['border-bottom'] !== '' ) {
            target.style['border-bottom'] = '';
            target.parentNode.insertBefore(dragging, event.target.nextSibling);
            console.log("a", dragging, event.target.nextSibling);
          } else {
            target.style['border-top'] = '';
            target.parentNode.insertBefore(dragging, event.target);
            console.log("b", dragging, event.target);
          }
          if(dragging.previousSibling) {
            map.moveLayer(dragging.id, dragging.previousSibling.id);
            console.log("c", dragging.id, dragging.previousSibling.id)
          } else {
            map.moveLayer(dragging.id);
            console.log("d", dragging.id);
          }
          console.log(map.getStyle().layers.slice(-1 * (Object.keys(map.getStyle().sources).length - 1)).map(function (obj) { return obj.id; }));
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

      function toggleSpinner() {
        let spinner = document.getElementById("loadingspinner");
        if(spinner.style.display === "block") {
          spinner.style.display = "none";
        } else if(spinner.style.display === "none") {
          spinner.style.display = "block"
        }
      }

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
        <SidePanel mapLayers={mapLayers}/>
        <div className="mapcontainer">
          <div ref={el => (mapContainer.current = el)} className="map" />
        </div>
      </div>
    </div>
  );
};


export default Map;