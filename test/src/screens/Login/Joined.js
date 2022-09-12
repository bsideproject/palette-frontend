import React, {useContext, useState, useEffect} from 'react';
import {Button} from '@components';
import styled from 'styled-components/native';
import {ThemeContext} from 'styled-components/native';
import {Image} from 'react-native';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {UserContext} from '@contexts';
import AsyncStorage from '@react-native-community/async-storage';
import {USE_QUERY, USE_MUTATION} from '@apolloClient/queries';
import {loginApi} from '../../api/restfulAPI';
import Spinner from 'react-native-loading-spinner-overlay';
import {ErrorAlert} from '@components';

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.fullWhite};
  flex-direction: column;
`;

const InnerContainer = styled.View`
  padding: 0 16px;
  justify-content: center;
  align-items: center;
`;

const SubTitleText = styled.Text`
  font-family: ${({theme}) => theme.fontRegular};
  font-size: 20px;
  margin: 0 auto;
`;

const ButtonContainer = styled.View`
  padding: 0 16px;
  margin-bottom: 106px;
`;

// Spinner
const SpinnerContainer = styled.Text`
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-family: ${({theme}) => theme.fontRegular};
`;

const Joined = ({navigation}) => {
  const theme = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [socialType, setSocialType] = useState('');
  const [accessToken, setAccessToken] = useState(null);
  const {setUser, user} = useContext(UserContext);
  const {loading, error, data} = USE_QUERY('GET_PROFILE', accessToken);
  const JOIN_IMG = require('/assets/icons/join.png');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('데이터 로딩 중...');
  const [addFcmToken, {loading: loadingFCM, error: errorFCM, data: dataFCM}] =
    USE_MUTATION('ADD_FCM_TOKEN', accessToken);
  const [
    updateProfile,
    {loading: loadingProfile, error: errorProfile, data: dataProfile},
  ] = USE_MUTATION('UPDATE_PROFILE', accessToken);

  const _handleNextButtonPress = async () => {
    setLoadingMessage('가입 진행 중...');
    setIsLoading(true);
    const response = await loginApi(email, socialType);
    const {data} = response;
    AsyncStorage.setItem('access_token', data.accessToken, () => {
      console.log('Joined AsyncStorage access_token Save!', data.accessToken);
      setAccessToken(data.accessToken);

      // Save FCM Token
      AsyncStorage.getItem('fcmtoken', (err, result) => {
        console.log('fcm_token: ', result);
        addFcmToken({
          variables: {
            token: result,
          },
        });
      });
    });
  };

  useEffect(() => {
    setIsLoading(true);
    AsyncStorage.getItem('email', (err, result) => {
      setEmail(result);
      AsyncStorage.getItem('social_type', (err, result) => {
        setSocialType(result);
        setIsLoading(false);
      });
    });
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
      // If Success
      setIsLoading(false);
      console.log('Joined Get Data From GraphQL', data);
    }
  }, [loading]);

  useEffect(() => {
    if (errorFCM != undefined) {
      let jsonData = JSON.parse(JSON.stringify(errorFCM));
      console.log(jsonData);
      setIsLoading(false);
      ErrorAlert();
    } else {
      if (loadingFCM || dataFCM == undefined) {
        console.log('Data Fecting & Data Empty');
        return;
      }
      console.log('FCM Data', dataFCM);
      AsyncStorage.getItem('is_push', (err, result) => {
        updateProfile({
          variables: {pushEnabled: result},
        });
      });
    }
  }, [loadingFCM]);

  useEffect(() => {
    if (errorProfile != undefined) {
      let jsonData = JSON.parse(JSON.stringify(errorProfile));
      console.log(jsonData);
      setIsLoading(false);
      ErrorAlert();
    } else {
      if (loadingProfile || dataProfile == undefined) {
        console.log('Data Fecting & Data Empty');
        return;
      }
      console.log('Login Success Data', dataProfile);
      setIsLoading(false);
      //최종 로그인
      console.log(
        'Login Success',
        accessToken,
        email,
        data.myProfile.nickname,
        data.myProfile.profileImg,
        data.myProfile.socialTypes,
        data.myProfile.pushEnabled,
      );
      setUser({
        accessToken: accessToken,
        email: data.myProfile.email,
        nickname: data.myProfile.nickname,
        profileImg: data.myProfile.profileImg,
        socialTypes: data.myProfile.socialTypes,
        pushEnabled: data.myProfile.pushEnabled,
      });
    }
  }, [loadingProfile]);

  return isLoading ? (
    <SpinnerContainer>
      <Spinner visible={isLoading} textContent={loadingMessage} />
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
              title="가입 완료"
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
          <Image source={JOIN_IMG} style={{marginTop: 150, marginBottom: 40}} />
          <SubTitleText>회원가입을 축하합니다 :)</SubTitleText>
        </InnerContainer>
      </KeyboardAvoidingScrollView>
    </Container>
  );
};

export default Joined;
