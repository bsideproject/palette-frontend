import React, {useContext, useState, useEffect} from 'react';
import {Button} from '@components';
import styled from 'styled-components/native';
import {TouchableOpacity, View, Text} from 'react-native';
import {ThemeContext} from 'styled-components/native';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {USE_MUTATION} from '@apolloClient/queries';
import AsyncStorage from '@react-native-community/async-storage';
import {ErrorAlert} from '@components';
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

const SpinnerContainer = styled.Text`
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-family: ${({theme}) => theme.fontRegular};
`;

const AccountConnect = ({navigation, route}) => {
  const theme = useContext(ThemeContext);
  const socialType = route.params.socialType;
  const userEmail = route.params.email;
  const accessToken = route.params.accessToken;
  const refreshToken = route.params.refreshToken;
  const [isLoading, setIsLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [updateProfile, {data, loading, error}] = USE_MUTATION(
    'UPDATE_PROFILE',
    accessToken,
  );

  const _handleNextButtonPress = () => {
    if (!connected) {
      setIsLoading(true);
      setTimeout(() => {
        updateProfile({
          variables: {socialTypes: ['KAKAO', 'NAVER']},
        });
      }, 1300);
    } else {
      navigation.goBack();
    }
  };

  useEffect(() => {
    AsyncStorage.setItem('refresh_token', refreshToken, () => {});
  }, []);

  useEffect(() => {
    if (error != undefined) {
      let jsonData = JSON.parse(JSON.stringify(error));
      console.log(jsonData);
      setIsLoading(false);
      ErrorAlert();
    } else {
      if (loading || data == undefined) {
        console.log('Data Fecting & Data Empty');
        return;
      }
      console.log(data);
      // Not Check Data Is True..
      setIsLoading(false);
      setConnected(true);
    }
  }, [loading]);

  return isLoading ? (
    <SpinnerContainer>
      <Spinner visible={isLoading} textContent={'계정 연동 중...'} />
    </SpinnerContainer>
  ) : (
    <Container>
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
