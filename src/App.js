import React from "react";
import Map from "./components/Map/Map";
import "./App.css";
//import Map2 from "./components/Map2/Map2";

const styles = {
  overflow:'hidden',
}

function App() {


  return (
    <div style={styles}>
      <div id="map"></div>
      <Map />
    </div>
  );
}

export default App;
