import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import getData from './parkingApi';
import Circle from './components/Circle';
import { LargeText, MediumText } from './components/ChangingText';
import copy from './data/texts.json';
import './App.css';

const colors = {
  blue: '#4296ae',
  green: '#309f5d',
  red: '#bf3838',
  yellow: '#d6ad4f',
  white: '#d4d4d4',
};

// const lat = 59.3411517;
// const lng = 18.092465;
// state = "LOADING" || "YES" || "NO" || "MAYBE"

const Container = styled.div`
  box-sizing: border-box;
  height: 100%;
  background-color: ${({ state }) => {
    switch (state) {
      case 'YES':
        return colors.green;
      case 'NO':
        return colors.red;
      case 'MAYBE':
        return colors.yellow;
      default:
        return colors.blue;
    }
  }};
  padding: 2rem;
  color: ${colors.white};
  font-weight: lighter;
  text-align: center;
  font-family: 'Roboto', sans-serif;
`;

const SymbolContainer = styled.div`
  transform: translateY(
    ${({ pending }) => {
      if (pending) {
        return 'calc(45vh - 50%)';
      }
      return 0;
    }}
  );
  transition: transform 0.5s ease-out 0.4s;
`;

function App() {
  // const [coords, setCoords] = useState({ latitude: lat, longitude: lng });
  const [coords, setCoords] = useState(null);
  const [state, setState] = useState('LOADING');
  const [data, setData] = useState(null);
  useEffect(() => {
    navigator.geolocation.watchPosition(
      (geo) => {
        const { longitude, latitude, accuracy, speed } = geo.coords;
        setCoords({ longitude, latitude, accuracy, speed });
      },
      (err) => {
        console.log(err);
        setState('MAYBE');
      }
    );
  }, []);

  useEffect(() => {
    if (coords) {
      getData(coords.latitude, coords.longitude).then((res) => {
        const resData = res.map(
          ({
            ADDRESS,
            COORDINATES,
            DISTANCE_TO_ORIGIN,
            PARKING_ALLOWED,
            PARKING_DISALLOWED_REASON,
          }) => ({
            address: ADDRESS,
            coordinates: COORDINATES,
            distanceToOrigins: DISTANCE_TO_ORIGIN,
            parkingAllowed: PARKING_ALLOWED,
            parkingDisallowedReason: PARKING_DISALLOWED_REASON,
          })
        );
        // .filter(({ parkingAllowed }) => !parkingAllowed);
        if (resData.length === 0) {
          setState('MAYBE');
        } else {
          if (resData[0].parkingAllowed) {
            setState('YES');
          } else {
            setState('NO');
          }
          setData(resData);
        }
      });
    }
  }, [coords]);

  const header = (str) => {
    if (state === 'YES') {
      return str.replace('{}', data && data[0]?.address);
    }
    if (state === 'NO') {
      return str.replace('{}', data && data[0]?.parkingDisallowedReason);
    }
    return str;
  };

  return (
    <Container state={state}>
      <SymbolContainer pending={state === 'LOADING'}>
        <MediumText content={copy[state][0]} />
        <LargeText content={header(copy[state][1])} />
        <Circle state={state} />
        <div style={{ minHeight: 20 }}>
          <LargeText content={copy[state][2]} />
        </div>
        {/* <LargeText content={copy[state][3]} /> */}
      </SymbolContainer>
    </Container>
  );
}

export default App;
