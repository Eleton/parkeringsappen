import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import Circle from "./components/Circle";
import { LargeText, MediumText, SmallText } from './components/ChangingText';
import copy from "./data/texts.json";
import './App.css';

const colors = {
  blue: "#4296ae",
  green: "#309f5d",
  red: "#bf3838",
  yellow: "#d6ad4f",
  white: "#d4d4d4"
}

// state = "LOADING" || "YES" || "NO" || "MAYBE"

const Container = styled.div`
  box-sizing: border-box;
  height: 100%;
  background-color: ${({ state }) => {
    switch (state) {
      case "YES":
        return colors.green;
      case "NO":
        return colors.red;
      case "MAYBE":
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
  transform: translateY(${({ pending }) => {
    if (pending) {
      return "calc(45vh - 50%)"
    }
    return 0
  }});
  transition: transform 0.5s ease-out 0.4s;
`;

function App() {
  const [coords, setCoords] = useState(null);
  const [state, setState] = useState("LOADING");
  useEffect(() => {
    navigator.geolocation.watchPosition((geo) => {
      const { longitude, latitude, accuracy, speed } = geo.coords;
      setCoords({ longitude, latitude, accuracy, speed });
      setState("YES");
    }, console.log);
  }, []);

  return (
    <Container
      state={state}
      // onClick={() => setState("YES")}
      tabIndex="0"
      onKeyDown={e => {
        if (e.key === "ArrowUp") setState("LOADING");
        if (e.key === "ArrowRight") setState("YES");
        if (e.key === "ArrowDown") setState("NO");
        if (e.key === "ArrowLeft") setState("MAYBE");
      }}
    >
      <SymbolContainer pending={state === "LOADING"}>
        <MediumText content={copy[state][0]} />
        <LargeText content={copy[state][1]} />
        <Circle state={state} />
        <div style={{ minHeight: 20}}><MediumText content={copy[state][2]} /></div>
        <LargeText content={copy[state][3]} />
      </SymbolContainer>
    </Container>
  );
};

export default App;
