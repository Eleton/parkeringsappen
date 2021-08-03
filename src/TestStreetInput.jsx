import React, { useState } from 'react';
import { getSpacesByStreet } from './parkingApi.js';

export default function TestStreetInput() {
  const [parkingInfo, setParkingInfo] = useState([]);

  const onEnter = async (event) => {
    if (event.key !== 'Enter') return;
    getSpacesByStreet(event.target.value).then((data) => {
      setParkingInfo(data.filter((el) => el.properties.VEHICLE === 'fordon'));
    });
  };

  return (
    <div>
      <input type="text" placeholder="Gatunamn" onKeyUp={onEnter} />
      {(parkingInfo || []).map((el) => (
        <p key={el.properties.FEATURE_OBJECT_ID}>{el.properties.ADDRESS}</p>
      ))}
    </div>
  );
}
