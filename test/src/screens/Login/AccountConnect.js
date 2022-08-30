import React, {useContext, useState, useEffect} from 'react';
import {Button} from '@components';
import styled from 'styled-components/native';
import {TouchableOpacity, View, Text} from 'react-native';
import {ThemeContext} from 'styled-components/native';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {USE_MUTATION} from '@apolloClient/queries';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.fullWhite};
  flex-direction: column;
`;

const InnerContainer = styled.View`
  padding: 0 16px;
`;

const SubTitleText = styled.Text`
  font-family: ${({theme}) => theme.fontRegular};
  font-size: 20px;
  margin-top: 30.5px;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.View`
  padding: 0 16px;
  margin-bottom: 106px;
`;

const SocialInfo = styled.View`
  margin-top: 20px;
  padding: 16px 0 16px 24px;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.light020};
  border-top-width: 1px;
  border-top-color: ${({theme}) => theme.light020};
`;

const SocialType = styled.Text`
  font-size: 14px;
  font-family: ${({theme}) => theme.fontBold};
`;

const SocialEmail = styled.Text`
  margin-top: 10px;
  font-size: 14px;
  font-family: ${({theme}) => theme.fontRegular};
`;

const AccountConnect = ({navigation, route}) => {
  const theme = useContext(ThemeContext);
  const socialType = route.params.socialType;
  const alreadyType = socialType === 'KAKAO' ? 'NAVER' : 'KAKAO';
  const userEmail = route.params.email;
  const accessToken = route.params.accessToken;
  const [spinner, setSpinner] = useState(false);
  const [connected, setConnected] = useState(false);
  const [updateProfile, updateResult] = USE_MUTATION(
    'UPDATE_PROFILE',
    accessToken,
  );

  const _handleNextButtonPress = () => {
    if (!connected) {
      setSpinner(true);
      setTimeout(() => {
        updateProfile({
          variables: {socialTypes: [alreadyType, socialType]},
        });
      }, 1500);
    } else {
      navigation.goBack();
    }
  };

  useEffect(() => {
    if (!!updateResult.data) {
      console.log(
        'UPDATE_PROFILE GRAPHQL RESULT DATA 계정연동',
        updateResult.data,
      );
      setConnected(true);
      setSpinner(false);
    }
  }, [updateResult]);

  return (
    <Container>
      <Spinner
        visible={spinner}
        textContent={'연동 중'}
        textStyle={{color: theme.white}}
      />
      <KeyboardAvoidingScrollView
        containerStyle={{
          backgroundColor: theme.fullWhite,
        }}
        stickyFooter={
          <ButtonContainer>
            <Button
              title={connected ? '확인' : '기존 계정과 연동하기'}
              onPress={_handleNextButtonPress}
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
        <InnerContainer>
          <SubTitleText>
            {connected
              ? '기존 계정으로 연동되었습니다.\n홈 화면으로 이동합니다.'
              : '이미 반쪽일기에 가입되어 있습니다.'}
          </SubTitleText>
          {!connected && (
            <SocialInfo>
              <SocialType>
                {socialType === 'KAKAO' ? '카카오 톡' : '네이버'}
              </SocialType>
              <SocialEmail>{userEmail}</SocialEmail>
            </SocialInfo>
          )}
        </InnerContainer>
      </KeyboardAvoidingScrollView>
    </Container>
  );
};

export default AccountConnect;
