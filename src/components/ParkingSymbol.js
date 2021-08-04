import styled from "styled-components";

const Circle = styled.div`
  border-radius: 50%;
  border: 20px solid rgba(0,0,0,0.5);
  font-size: 4rem;
  height: 80px;
  width: 80px;
`;

const ParkingSymbol = ({ children, type }) => {
  if (type === "loading") {
  }
  return <Circle>P</Circle>
}

export default ParkingSymbol;
