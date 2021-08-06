import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Text = styled.p`
  margin: 0;
  transition: opacity 0.4s;
  opacity: ${({ fading }) => (fading ? 0 : 1)};
`;

const ChangingText = ({ className, content }) => {
  const [text, setText] = useState(null);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (text === null) {
      setText(content);
    } else {
      setFading(true);
      setTimeout(() => setText(content), 500);
      setTimeout(() => setFading(false), 600);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  return (
    <Text className={className} fading={fading}>
      {text}
    </Text>
  );
};

export const LargeText = styled(ChangingText)`
  font-size: 30px;
  text-transform: uppercase;
`;
export const MediumText = styled(ChangingText)`
  font-size: 16px;
  text-transform: uppercase;
`;
export const SmallText = styled(ChangingText)`
  font-size: 12px;
`;
