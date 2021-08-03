import { useLottie } from "lottie-react";
import styled, { keyframes } from "styled-components";
import YesAnimation from "../data/AnimatedYes_Icon_V03.json";
import NoAnimation from "../data/AnimatedNo_Icon_V02.json";
import HoppsanAnimation from "../data/AnimatedHoppsan_Icon_V02.json";
import ParkingIcon from "../data/P_Icon_V02.png";
import Wheel from "../data/Wheel.png";
 
const stateToIcon = (state) => {
  switch (state) {
    case "YES":
      return YesAnimation;
    case "NO":
      return NoAnimation;
    case "MAYBE":
      return HoppsanAnimation;
    default:
      return "";
  }
}

const LoadingContainer = styled.div`
  position: relative;
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(-360deg);
  }
`;

const Spinner = styled(Image)`
  position: absolute;
  left: 0;
  animation: ${rotate} 3s linear infinite;
`;

const Circle = ({ state }) => {
  const options = {
    animationData: stateToIcon(state),
    loop: false,
    autoplay: true,
    // style: { width: "80%" }
  };
 
  const { View } = useLottie(options);

  if (state === "LOADING") {
    return <LoadingContainer>
      <Image src={ParkingIcon} alt="" />
      <Spinner src={Wheel} alt="" />
    </LoadingContainer>
  }
 
  return View;
};
 
export default Circle;