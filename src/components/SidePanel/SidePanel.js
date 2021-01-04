import React from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import "./SidePanel.css";
//import SidePanel from "../SidePanel/SidePanel";
//import testdata from "../../sample_data/befolkning_5km.json";


const SidePanel = (props) => {

  //const [testMapLayers, setTestMapLayers] = useState([]);
  let mapLayerArray = [];
  for (let i = 0; i < props.mapLayers.length; i++) {
    if(props.mapLayers[i] !== "composite" && props.mapLayers[i] !== "mapbox") {
      mapLayerArray.push(props.mapLayers[i]);
    }
  }
  //reverses the order so that the top-most layer appears at the start of the array
  mapLayerArray.reverse();

  
  
  return (
      <div id="sidepanel">
        <div>
          <div className="logo">
            sGIS
          </div>
           
          <div id="functionality" className="functionalitylist">
          <div>
              <ul id="layerList" className="layerlist">
                {mapLayerArray.map((item) => (
                  <li draggable="true" id={item} className="dragdrop">
                    {item.substring(0, 20) + ((item.length > 20) ? "...": "")}
                    <div className="colorpickerwrapper" src="https://www.flaticon.com/svg/static/icons/svg/565/565789.svg">
                      <input type="color" id={item} className="colorpicker"></input>
                    </div>
                    <div className="layerbuttons">
                      <button id={item} className="layerbutton">
                        Hide
                      </button>
                      <button id={item} className="layerbutton">
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <button id="addBaseLayersButton">Add base layers</button>
            <button id="removeAllLayersButton">Remove all layers</button>
            <div id="loadingspinner" className="spinner" style={{display: "block"}}></div>
            <div className="buffer">
              <div>Buffer</div>
              <select id="bufferSelectLayer">
                <option>Choose layer</option>
                {mapLayerArray.map((item) => (
                <option id={item}>{item}</option>
                ))}
              </select>
              <input id="bufferInputField" type="number" placeholder="Buffer size (m)" min="0"></input>
              <button id="bufferButton">Buffer</button>
            </div>
            <div className="union">
              <div>Union</div>
              <select id="unionSelectLayer1">
                <option>Choose layer</option>
                {mapLayerArray.map((item) => (
                <option id={item}>{item}</option>
                ))}
              </select>
              <select id="unionSelectLayer2">
                <option>Choose layer</option>
                {mapLayerArray.map((item) => (
                <option id={item}>{item}</option>
                ))}
              </select>
              <button id="unionButton">Union</button>
            </div>
            <div className="intersect">
              <div>Intersect</div>
              <select id="intersectSelectLayer1">
                <option>Choose layer</option>
                {mapLayerArray.map((item) => (
                <option id={item}>{item}</option>
                ))}
              </select>
              <select id="intersectSelectLayer2">
                <option>Choose layer</option>
                {mapLayerArray.map((item) => (
                <option id={item}>{item}</option>
                ))}
              </select>
              <button id="intersectButton">Intersect</button>
            </div>
            <div className="difference">
              <div>Difference</div>
              <select id="differenceSelectLayer1">
                <option>Choose layer</option>
                {mapLayerArray.map((item) => (
                <option id={item}>{item}</option>
                ))}
              </select>
              <select id="differenceSelectLayer2">
                <option>Choose layer</option>
                {mapLayerArray.map((item) => (
                <option id={item}>{item}</option>
                ))}
              </select>
              <button id="differenceButton">Difference</button>
            </div>
            <div className="newpoint">
              <div>Create point</div>
              <input id="createPointLong" type="number" placeholder="Longitude" min="-180" max="180"></input>
              <input id="createPointLat" type="number" placeholder="Latitude" min="-85" max="85"></input>
              <button id="createPointButton">
                Create Point
              </button>
            </div>
            
          </div>
        </div>
      </div>
  );
};





export default SidePanel;