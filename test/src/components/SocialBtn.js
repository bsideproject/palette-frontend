import styled from 'styled-components/native';
import React from 'react';

function SocialBtn({children, id, onPress}) {
  return <SocialButton id={id} onPress={onPress}>{children}</SocialButton>;
}

export default SocialBtn;

const SocialButton = styled.TouchableOpacity`
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  ${({id}) =>
    id === 'kakao' ? 'background-color:orange' : 'background-color:green'}
`;
