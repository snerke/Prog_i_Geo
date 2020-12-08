import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
//import SidePanel from "../SidePanel/SidePanel";
import testdata from "../../sample_data/befolkning_5km.json";


const SidePanel = (props) => {

  //console.log("ÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆ", map)
  //console.log("\nSidePanel", props.mapLayers);
  const [testMapLayers, setTestMapLayers] = useState([]);
  let mapLayerArray = [];
  for (let layer in props.mapLayers) {
    //console.log("current layer", layer);
    if(layer != "composite") {
      mapLayerArray.push(layer);
    }
  }

  

  return (
    <div style={styles.container}>
      <div className="container">
        <div>
          <div id="menu">
            <input
                id="streets-v11"
                type="radio"
                name="rtoggle"
                value="streets"
                defaultChecked
            />
            <label htmlFor="streets-v11">streets</label>
            <input id="light-v10" type="radio" name="rtoggle" value="light" />
            <label htmlFor="light-v10">light</label>
            <input id="dark-v10" type="radio" name="rtoggle" value="dark" />
            <label htmlFor="dark-v10">dark</label>
            <input id="outdoors-v11" type="radio" name="rtoggle" value="outdoors" />
            <label htmlFor="outdoors-v11">outdoors</label>
            <input id="satellite-v9" type="radio" name="rtoggle" value="satellite" />
            <label htmlFor="satellite-v9">satellite</label>
          </div>

          <div id="functionality">
            <button>add</button>
            <button>remove</button>
            <div>
              Buffer
              <select id="bufferSelectLayer">
                <option>Choose layer</option>
                {mapLayerArray.map((item) => (
                <option id={item}>{item}</option>
                ))}
              </select>
              <input id="bufferInputField" placeholder="Buffer size (m)"></input>
              <button>buffer</button>
            </div>
          </div>
          <div>
            Layers:
            {mapLayerArray.map((item) => (
              <div>-{item}</div>
            ))}
          </div>
        </div>

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
    backgroundColor: "green",
  }
};


export default SidePanel;