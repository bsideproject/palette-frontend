import React, {useContext, useState} from 'react';
import {ThemeContext} from 'styled-components/native';
import styled from 'styled-components/native';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {Button, PushModal} from '@components';
import {Image} from 'react-native';
import {TouchableOpacity} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
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
  font-size: 20px;
  font-weight: 400;
  text-shadow-color: rgba(0, 0, 0, 0.25);
  text-shadow-offset: 0px 4px;
  text-shadow-radius: 4px;
  font-family: ${({theme}) => theme.fontRegular};
`;

const InviteContainer = styled.View`
  flex: 2;
  margin-top: 10%;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  height: 200;
  width: 100%;
  margin-bottom: 10%;
  shadow-offset: 0px 4px;
  shadow-radius: 8px;
  background-color: ${({theme}) => theme.white};
  shadow-color: rgba(0, 0, 0, 0.8);
  elevation: 15;
`;

const InviteItem1 = styled.View`
  flex: 1;
  margin-top: 5%;
  justify-content: center;
  align-items: center;
`;

const Item1Text = styled.Text`
  font-size: 18px;
  color: ${({theme}) => theme.dark020};
  font-family: ${({theme}) => theme.fontRegular};
`;

const InviteItem2 = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-bottom: 5%;
`;

const Item2Text = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${({theme}) => theme.pointColor};
  font-family: ${({theme}) => theme.fontRegular};
`;

const Item3Text = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${({theme}) => theme.dark020};
  text-decoration-line: underline;
  font-family: ${({theme}) => theme.fontRegular};
`;

const CompleteMemo = ({navigation, route}) => {
  const [name, setName] = useState('');
  const theme = useContext(ThemeContext);
  const [pushModalVisible, setPushModalVisible] = useState(false);
  const MAKE_IMG = require('/assets/icons/make.png');
  const {user} = useContext(UserContext);
  // console.log('user:', user);

  // [EVENT FUNCTION] ------------------------------------------
  const _handleMoveMainPage = () => {
    setPushModalVisible(false);
    navigation.navigate('Home');
  };

  const _handleRequestSetMemo = () => {
    // Get User_id
    let memoName = route.params.name;
    let memoColorId = route.params.colorId;
    console.log(memoName, memoColorId);

    // [TODO] If Alarm On -> MoveMain Page / Off -> SetPushModal
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
            title="다음 단계로"
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
          <Image source={MAKE_IMG} style={{marginTop: 30, marginBottom: 15}} />
        </ImgContainer>
        <TxtContainer>
          <TxtStyle>반쪽이의 반쪽일기</TxtStyle>
          <TxtStyle>일기장이 생성되었습니다!</TxtStyle>
        </TxtContainer>
        <InviteContainer>
          <InviteItem1>
            <Item1Text>초대코드를 전달하여</Item1Text>
            <Item1Text>새 일기장에 친구를 초대하세요!</Item1Text>
          </InviteItem1>
          <InviteItem2>
            <Item2Text>초대코드: {route.params.invitationCode}</Item2Text>
            <TouchableOpacity
              style={{marginTop: 15}}
              onPress={() => Clipboard.setString(route.params.invitationCode)}>
              <Item3Text>초대코드 복사하기</Item3Text>
            </TouchableOpacity>
          </InviteItem2>
        </InviteContainer>
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

export default CompleteMemo;
