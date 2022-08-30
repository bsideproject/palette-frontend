import React, {useContext} from 'react';
import styled from 'styled-components/native';
import {ThemeContext} from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.fullWhite};
  flex-direction: column;
  justify-content: center;
`;

const InnerContainer = styled.View`
  align-items: center;
`;

const NetworkText = styled.Text`
  font-size: 14px;
  font-family: ${({theme}) => theme.fontRegular};
  color: ${({theme}) => theme.dark020};
`;

const ErrorImage = styled.Image`
  width: 63px;
  height: 63px;
  margin-bottom: 25px;
`;

const RefreshContainer = styled.TouchableOpacity`
  margin-top: 133px;
`;

const RefreshText = styled.Text`
  font-size: 16px;
  font-family: ${({theme}) => theme.fontRegular};
  color: ${({theme}) => theme.dark020};
  text-decoration-line: underline;
`;

const NETWORK_ERROR = require('/assets/icons/network_error.png');

const NetworkContainer = props => {
  const theme = useContext(ThemeContext);

  return (
    <Container>
      <InnerContainer>
        <ErrorImage source={NETWORK_ERROR} />
        <NetworkText>네트워크 연결이 되어있지 않습니다.</NetworkText>
        <NetworkText>확인 후 다시 시도해 주세요.</NetworkText>
        <RefreshContainer onPress={props.handleNetwork}>
          <RefreshText>새로고침</RefreshText>
        </RefreshContainer>
      </InnerContainer>
    </Container>
  );
};

export default NetworkContainer;
