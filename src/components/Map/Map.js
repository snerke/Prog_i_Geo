import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import SidePanel from "../SidePanel/SidePanel";
import "./Map.css";
import befolkning_5km from "../../sample_data/befolkning_5km.json";
import trondheim from "../../sample_data/trondheim.json";
import gloshaugen from "../../sample_data/gloshaugen.json";
import bygg_flate from "../../sample_data/bygg_flate.shp";
//import "../../sample_data";
import * as turf from '@turf/turf';




const Map = () => {
  const [map, setMap] = useState(null);
  const [mapLayers, setMapLayers] = useState(null);
  const mapContainer = useRef(null);

  

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
        center: [10.408773,63.422091],
        zoom: 10,
      });

      map.addControl(new mapboxgl.NavigationControl());

      map.on("load", () => {
        
        setMap(map);
        //console.log("12312313213213213132131", map.getStyle().sources)
        setMapLayers(map.getStyle().sources);
        map.resize();
        //console.log(map.getStyle().sources)
      });

      map.on("click", () => {
        console.log("something happened");
        console.log("test91wyeiuweahdgisfgi", map.getStyle().sources);
        setMap(map);
        let layers = map.getStyle().sources;
        console.log("\n_____________", layers);
        //setMapLayers(layers);
        setMapLayers(layers);
        console.log("\nlayers:", mapLayers);
      });
      

      var layerList = document.getElementById('menu');
      var inputs = layerList.getElementsByTagName('input');

      function switchLayer(layer) {
          let layerId = layer.target.id;
          let layerSources = map.getStyle().sources;
          //var checkIfLayer = map.getLayer();
          map.setStyle('mapbox://styles/mapbox/' + layerId);         
          
          setTimeout(() => {let i = 0;
            for (let layerSource in layerSources) {
              if(i > 0) {
                try{
                  map.addSource(layerSource, {
                    type: Object.values(layerSources)[i].type,
                    data: Object.values(layerSources)[i].data,
                  })
                  map.addLayer({
                    "id": layerSource,
                    "type": "fill",
                    "source": layerSource,
                    "paint": {
                      "fill-color": randomizeColor(),
                      "fill-opacity": 0.5,
                    }
                  })
                }
                catch(err) {
                  alert("could not re-add layers");
                }
              }
              i++;
            }}, 300);
            setMapLayers(map.getStyle().sources);
      }

      for (let i = 0; i < inputs.length; i++) {
          inputs[i].onclick = switchLayer;
      }


      let functionality = document.getElementById('functionality');
      let buttons = functionality.getElementsByTagName('button');

      function addLayers() {
        /*try{
          map.addSource("test-id", {
            type: "geojson",
            data: befolkning_5km,
          });
          map.addLayer({
            "id": "test-id",
            "type": "fill",
            "source": "test-id",
            "paint": {
              "fill-color": randomizeColor(),
              "fill-opacity": 0.5,
            }
          });
          console.log(map.getStyle().sources)
        }
        catch(err) {
          alert("this layer already exists");
        }*/

        try{
          map.addSource("trondheim", {
            type: "geojson",
            data: trondheim,
          })
          map.addLayer({
            "id": "trondheim",
            "type": "fill",
            "source": "trondheim",
            "paint": {
              "fill-color": randomizeColor(),
              "fill-opacity": 0.5,
            }
          })
          console.log(map.getStyle().sources)
        }
        catch(err) {
          alert("this layer already exists");
        }

        try{
          map.addSource("gloshaugen", {
            type: "geojson",
            data: gloshaugen,
          })
          map.addLayer({
            "id": "gloshaugen",
            "type": "fill",
            "source": "gloshaugen",
            "paint": {
              "fill-color": randomizeColor(),
              "fill-opacity": 0.5,
            }
          })
          console.log(map.getStyle().sources)
        }
        catch(err) {
          alert("this layer already exists");
        }

        /*
        try{
          map.addSource("bygg_flate_source", {
            type: "vector",
            data: bygg_flate,
          });
          map.addLayer({
            "id": "bygg_flate_layer",
            "type": "fill",
            "source": "composite",
            "source-layer": "bygg_flate",
            "paint": {
              "fill-color": "#000000",
              "fill-opacity": 1,
            }
          });
          console.log(map.getStyle().sources)
        }
        catch(err) {
          alert(err);
        }*/

        setMapLayers(map.getStyle().sources);
      }

      function addNewLayer(layerName, data) {
        try{
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
              "fill-opacity": 0.5,
            }
          })
          console.log(map.getStyle().sources)
        }
        catch(err) {
          alert("This layer already exists");
        }
      }

      function removeNewLayer() {
        try{
          //map.removeLayer("test-id");
          //map.removeSource("test-id");

          let layerSources = map.getStyle().sources;
          //var checkIfLayer = map.getLayer();
          
          setTimeout(() => {let i = 0;
            for (let layerSource in layerSources) {
              if(i > 0) {
                try{
                  console.log("trying to remove", layerSource);
                  map.removeLayer(layerSource);
                  map.removeSource(layerSource);
                }
                catch(err) {
                  alert("could not remove layers");
                }
              }
              i++;
            }}, 300);
        }
        catch(err) {
          alert("this layer doesn't exist");
        }
        console.log("after remove", map.getStyle().sources);
        setTimeout(() => {
          let layers = map.getStyle().sources;
          setMapLayers(layers);
        }, 100);
      }

      function createBuffer() {
        try{
          let selectedLayer = document.getElementById("bufferSelectLayer").value;
          let bufferSize = document.getElementById("bufferInputField").value/1000;
          console.log("trying to get the correct layer", map.getSource(selectedLayer)._data)
          let data2;
          if(map.getSource(selectedLayer)._data.type == "Polygon") {
            console.log("laget er et polygon");
            data2 = map.getSource(selectedLayer)._data.coordinates[0];
          } else if(map.getSource(selectedLayer)._data.type == "Feature") {
            console.log("laget er en feature");
            data2 = map.getSource(selectedLayer)._data.geometry.coordinates[0];
          }
          let poly1 = turf.polygon([data2]);
          let bufferData = turf.buffer(poly1, bufferSize, {units: "kilometers"})
          addNewLayer("buffer_"+selectedLayer+"_"+(bufferSize*1000)+"m", bufferData);
          
        }
        catch(err) {
          alert("Something went wrong, did you remember to pick a layer and buffer width?");
        }
      }

      function createUnion() {
        try{
          let selectedLayer1 = document.getElementById("unionSelectLayer1").value;
          let selectedLayer2 = document.getElementById("unionSelectLayer1").value;
          //console.log("trying to get the correct layer", map.getSource(selectedLayer)._data)
          let data1;
          let data2;
          if(map.getSource(selectedLayer1)._data.type == "Polygon") {
            console.log("laget er et polygon");
            data1 = map.getSource(selectedLayer1)._data.coordinates[0];
          } else if(map.getSource(selectedLayer1)._data.type == "Feature") {
            console.log("laget er en feature");
            data1 = map.getSource(selectedLayer1)._data.geometry.coordinates[0];
          }
          if(map.getSource(selectedLayer2)._data.type == "Polygon") {
            console.log("laget er et polygon");
            data2 = map.getSource(selectedLayer2)._data.coordinates[0];
          } else if(map.getSource(selectedLayer2)._data.type == "Feature") {
            console.log("laget er en feature");
            data2 = map.getSource(selectedLayer2)._data.geometry.coordinates[0];
          }
          let poly1 = turf.polygon([data1]);
          let poly2 = turf.polygon([data2]);
          let unionData = turf.union(poly1, poly2);
          addNewLayer("union_"+selectedLayer1+"_"+selectedLayer2, unionData);
        }
        catch(err) {
          alert("Could not create union, did you remember to pick two layers?");
        }
      }

      for(let i = 0; i < buttons.length; i++) {
        if(buttons[i].textContent === "add") {
          buttons[i].onclick = addLayers;
        }
        else if(buttons[i].textContent === "remove") {
          buttons[i].onclick = removeNewLayer;
        }
        else if(buttons[i].textContent === "buffer") {
          buttons[i].onclick = createBuffer;
        }
        else if(buttons[i].textContent === "Union") {
          buttons[i].onclick = createUnion;
        }
      }


      function randomizeColor() {
        let colorLetters = "0123456789ABCDEF";
        let randomColor = "#";
        for (let i = 0; i < 6; i++) {
          randomColor += colorLetters[Math.floor(Math.random() * colorLetters.length)];
        }
        return randomColor;
      }

    };
    

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map, mapLayers]);

  const setMapLayer = () => {
    //console.log("\n\nny test-ting");
    setMapLayers(map.getStyle().sources);
    //console.log("after\n", mapLayers);
  }

  /*useEffect(() => {
    function updateLayers(map) {
      console.log("\nMapLayers are trying to be updated", mapLayers,"\n");
      setMapLayers(map.getStyle().sources);
      console.log("\nAfter trying to update maplayers\n", mapLayers,"\n\n");
    }
    updateLayers();

  }, [mapLayers])*/

  //console.log("UUUUUUUUUUUUU", map)
  //console.log("\n\n---->", mapLayers, "\n\n")
  return (
    <div style={styles.container}>
      <div className="container">
        <div>
          <SidePanel mapLayers={mapLayers}/>
          
        </div>
        <div ref={el => (mapContainer.current = el)} style={styles.map} />
      </div>
      <div>
        <button onClick={setMapLayer}>prøve å gjøre ting</button>
      </div>
    </div>
  );
};


const styles = {
  map: {
    width: "80%",
    height: "calc(90vh - 80px)",
    padding: "50",
  },
  container: {
    height: "100%",
  }
};


export default Map;