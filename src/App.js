import React from "react";
import Header from "./components/Header";
import Map from "./components/Map/Map";
//import Map2 from "./components/Map2/Map2";

const styles = {
  overflow:'hidden'
}

function App() {


  return (
    <div style={styles}>
      <div id="map"></div>
      <Header/>
      <Map />

    </div>
  );
}

export default App;
