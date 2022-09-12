import React, {useContext, useState} from 'react';
import {ThemeContext} from 'styled-components/native';
import styled from 'styled-components/native';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {Button, PushModal} from '@components';
import {Image} from 'react-native';
import {UserContext} from '@contexts';
import Modal from 'react-native-modal';

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.fullWhite};
  flex-direction: column;
  padding-right: 5%;
  padding-left: 5%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const BtnContainer = styled.View`
  padding-right: 5%;
  padding-left: 5%;
  justify-content: center;
  align-items: center;
  text-align: 'center',
  margin-bottom: 20%;
`;

const ImgContainer = styled.View`
  flex: 1;
`;

const TxtContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const TxtStyle = styled.Text`
  width: 100%;
  font-size: 18px;
  font-weight: 400;
  color: ${({theme}) => theme.dark030};
  font-family: ${({theme}) => theme.fontRegular};
`;

const InviteTxtStyle = styled.Text`
  width: 100%;
  font-size: 18px;
  font-weight: 700;
  color: ${({theme}) => theme.pointColor};
  font-family: ${({theme}) => theme.fontRegular};
`;

const CompleteInviteCode = ({navigation, route}) => {
  const theme = useContext(ThemeContext);
  const INVITE_IMG = require('/assets/icons/invite.png');
  const [pushModalVisible, setPushModalVisible] = useState(false);
  const {user} = useContext(UserContext);

  // [EVENT FUNCTION] ------------------------------------------
  const _handleMoveMainPage = () => {
    setPushModalVisible(false);
    navigation.navigate('Home');
  };

  const _handleRequestSetMemo = () => {
    console.log('USER PushEnabled: ', user.pushEnabled);
    if (user.pushEnabled == true) {
      _handleMoveMainPage();
    } else {
      // Set Push Modal
      setPushModalVisible(true);
    }
  };

  return (
    <KeyboardAvoidingScrollView
      containerStyle={{
        backgroundColor: theme.fullWhite,
      }}
      stickyFooter={
        <BtnContainer>
          <Button
            title="확인"
            onPress={_handleRequestSetMemo}
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
        </BtnContainer>
      }>
      <Container>
        <ImgContainer>
          <Image
            source={INVITE_IMG}
            style={{marginTop: 100, marginBottom: 30}}
          />
        </ImgContainer>
        <TxtContainer>
          <InviteTxtStyle>
            {route.params.userName}의 {route.params.memoName}
          </InviteTxtStyle>
          <TxtStyle>일기장에 초대하셨습니다.</TxtStyle>
        </TxtContainer>
      </Container>

      <Modal
        isVisible={pushModalVisible}
        useNativeDriver={true}
        onRequestClose={() => setPushModalVisible(false)}
        hideModalContentWhileAnimating={true}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <PushModal onPressEnd={_handleMoveMainPage} />
      </Modal>
    </KeyboardAvoidingScrollView>
  );
};

export default CompleteInviteCode;
