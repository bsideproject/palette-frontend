import styled from 'styled-components/native';
import React from 'react';

const SocialButton = styled.TouchableOpacity`
  flex-direction: row;
  width: 90%;
  height: 45px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background-color: ${({id, theme}) =>
    id === 'kakao' ? theme.kakao : theme.naver};
`;

function SocialBtn({children, id, onPress, style}) {
  return (
    <SocialButton id={id} onPress={onPress} style={style}>
      {children}
    </SocialButton>
  );
}

export default SocialBtn;
