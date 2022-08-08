import styled from 'styled-components/native';
import React from 'react';

function SocialBtn({children, id, onPress}) {
  return <SocialButton id={id} onPress={onPress}>{children}</SocialButton>;
}

export default SocialBtn;

const SocialButton = styled.TouchableOpacity`
  flex-direction: row;
  width: 283px;
  height: 56px;
  margin-bottom: 20px;
  justify-content: center;
  align-items: center;
  border-radius: 14px;
  ${({id}) =>
    id === 'kakao' ? 'background-color:#FFE812' : 'background-color:#03C75A'}
`;
