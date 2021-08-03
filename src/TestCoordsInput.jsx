import React, { useState, useEffect } from 'react';
import { getParkingInfoByCoords } from './parkingApi.js';

export default function TestStreetInput({ latitude, longitude, radius = 50 }) {
  const [parkingInfo, setParkingInfo] = useState([]);

  useEffect(() => {
    getParkingInfoByCoords(latitude, longitude, radius).then((response) => {
      const vehicleSpaces = (response?.features || []).filter(
        (el) => el.properties.VEHICLE === 'fordon'
      );
      setParkingInfo(vehicleSpaces);
    });
  }, [latitude, longitude, radius]);

  if (!parkingInfo || !parkingInfo.length)
    return (
      <div>
        <label>
          No parking spaces within {radius} m from ({latitude},{longitude})
        </label>
      </div>
    );

  return (
    <div>
      <label>
        Showing all parking spaces within {radius} m from ({latitude},{longitude})
      </label>
      {parkingInfo.map((el) => (
        <p key={el.properties.FEATURE_OBJECT_ID}>{el.properties.ADDRESS}</p>
      ))}
    </div>
  );
}
