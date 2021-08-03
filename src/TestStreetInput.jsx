import React, { useState } from 'react';
import { getParkingInfo } from './parkingApi.js';

export default function TestStreetInput() {
  const [streetName, setStreetName] = useState('');
  const [parkingInfo, setParkingInfo] = useState([]);

  const callParkingAPI = async () => {
    setParkingInfo(await getParkingInfo(streetName));
  };

  return (
    <div>
      <input type="text" placeholder="Gatunamn" onChange={(e) => setStreetName(e.target.value)} value="Celsiusgatan" />
      <button onClick={callParkingAPI}>Click me!</button>
      {parkingInfo.map((el) => (
        <p>{el.properties.ADDRESS}</p>
      ))}
    </div>
  );
}
