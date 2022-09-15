import React, {useContext, useState} from 'react';
import {Button} from '@components';
import styled from 'styled-components/native';
import {ThemeContext} from 'styled-components/native';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import SwitchToggle from 'react-native-switch-toggle';
import AsyncStorage from '@react-native-community/async-storage';
import {setCookie} from '../../api/Cookie';

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.fullWhite};
  flex-direction: column;
`;

const InnerContainer = styled.View`
  padding: 0 16px;
`;

const SubTitleText = styled.Text`
  font-family: ${({theme}) => theme.fontBold};
  font-size: 18px;
  margin-top: 30.5px;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.View`
  padding: 0 16px;
  margin-bottom: 106px;
`;

const Header = styled.View`
  height: 60px;
  justify-content: center;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.light020};
`;

const Title = styled.Text`
  font-family: ${({theme}) => theme.fontBold};
  font-size: 16px;
  color: ${({theme}) => theme.dark010};
`;

const BodyContent = styled.Text`
  font-size: 16px;
  font-family: ${({theme}) => theme.fontRegular};
  margin-top: 18px;
`;

const ToggleContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 42px;
  height: 50px;
`;

const ToggleText = styled.Text`
  font-family: ${({theme}) => theme.fontRegular};
  font-size: 16px;
  color: ${({theme}) => theme.dark030};
`;

const PushCheck = props => {
  const theme = useContext(ThemeContext);
  const [pushToggle, setPushToggle] = useState(true);

  const _handlePushEnabled = () => {
    setPushToggle(prevState => !prevState);
  };

  const _handleNextButton = () => {
    setCookie('is_push', pushToggle);
    AsyncStorage.setItem('is_push', 'true', () => {
      console.log('저장');
      props.onClick();
    });
  };

  return (
    <Container>
      <KeyboardAvoidingScrollView
        containerStyle={{
          backgroundColor: theme.fullWhite,
        }}
        stickyFooter={
          <ButtonContainer>
            <Button
              title="확인"
              onPress={_handleNextButton}
              containerStyle={{
                backgroundColor: theme.pointColor,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              textStyle={{
                color: theme.white,
                fontSize: 18,
                fontWeight: '700',
                fontFamily: theme.fontRegular,
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          </ButtonContainer>
        }>
        <Header>
          <Title>수신 알림</Title>
        </Header>
        <InnerContainer>
          <SubTitleText>반쪽일기 알림</SubTitleText>
          <BodyContent>
            서비스 변경 내용, 이벤트 등 알림 메시지 수신을 위해 알림을 허용해
            주시기 바랍니다.
          </BodyContent>
          <ToggleContainer>
            <ToggleText>푸시 설정 및 수신에 동의 합니다.</ToggleText>
            <SwitchToggle
              switchOn={pushToggle}
              circleColorOn={theme.pointColor}
              backgroundColorOn={theme.homeColor}
              circleColorOff={theme.dark030}
              onPress={_handlePushEnabled}
              containerStyle={{
                width: 40,
                height: 15,
                borderRadius: 25,
                alignItems: 'center',
                marginTop: 5,
              }}
              circleStyle={{
                width: 20,
                height: 20,
                borderRadius: 25,
              }}
            />
          </ToggleContainer>
        </InnerContainer>
      </KeyboardAvoidingScrollView>
    </Container>
  );
};

export default PushCheck;
