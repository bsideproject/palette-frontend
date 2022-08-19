import styled from 'styled-components/native';
import React from 'react';

function SocialBtn({children, id, onPress, style}) {
  return <SocialButton id={id} onPress={onPress} style={style}>{children}</SocialButton>;
}

export default SocialBtn;

const SocialButton = styled.TouchableOpacity`
  flex-direction: row;
  width: 283px;
  height: 56px;
  justify-content: center;
  align-items: center;
  border-radius: 14px;
  ${({id}) =>
    id === 'kakao' ? 'background-color:#FFE812' : 'background-color:#03C75A'}
`;
