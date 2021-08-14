import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
`;

const LargeText = styled.p`
  margin: 0;
  font-size: 16px;
  text-transform: uppercase;
`;
const MediumText = styled.p`
  margin: 0;
  font-size: 12px;
`;

const ContainerContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto auto;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const distanceToReadable = (d) => Math.floor(d / 10) * 10;

const Suggestion = ({ name, distance }) => (
  <Container>
    <LargeText>{name}</LargeText>
    <MediumText>(ca {distanceToReadable(distance)}m)</MediumText>
  </Container>
);

const Suggestions = ({ suggestions }) => (
  <ContainerContainer>
    {suggestions.slice(0, 3).map((s) => (
      <Suggestion name={s.address} distance={s.distanceToOrigin} />
    ))}
  </ContainerContainer>
);

export default Suggestions;
