import React, { useState, useEffect } from 'react';
import './App.css';
import TestStreetInput from './TestStreetInput.jsx';

function App() {
  const [coords, setCoords] = useState(null);
  const [updates, setUpdates] = useState(0);
  useEffect(() => {
    navigator.geolocation.watchPosition((geo) => {
      const { longitude, latitude, accuracy, speed } = geo.coords;
      setCoords({ longitude, latitude, accuracy, speed });
      setUpdates((u) => u + 1);
    }, console.log);
  }, []);
  if (!coords) {
    return <div className="App">Loading...</div>;
  }
  return (
    <div className="App">
      <p>Longitude: {coords.longitude}</p>
      <p>Latitude: {coords.latitude}</p>
      <p>Accuracy: {coords.accuracy}</p>
      <p>Speed: {coords.speed}</p>
      <p>Updates: {updates}</p>
      <TestStreetInput />
    </div>
  );
}

export default App;
