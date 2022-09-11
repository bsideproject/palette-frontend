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
  const [addFcmToken, {loading: loadingFCM, error: errorFCM, data: dataFCM}] =
    USE_MUTATION('ADD_FCM_TOKEN', accessToken);

  const _handleNextButtonPress = async () => {
    const response = await loginApi(email, socialType);
    const {data} = response;
    AsyncStorage.setItem('access_token', data.accessToken, () => {
      console.log('Joined AsyncStorage access_token Save!', data.accessToken);
      setAccessToken(data.accessToken);

      setIsLoading(true);
      // Save FCM Token
      AsyncStorage.getItem('fcmtoken', (err, result) => {
        console.log('fcm token: ', result);
        addFcmToken({
          variables: {
            token: result,
          },
        });
      });
    });
  };

  console.log('User', user);

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
      // [TODO] Go to Error Page
    } else {
      if (loading || data == undefined) {
        console.log('Data Fecting & Data Empty');
        return;
      }
      // If Success
      console.log('Joined Get Data From GraphQL', data);
    }
  }, [loading, accessToken]);

  useEffect(() => {
    console.log('FCMccc', loadingFCM, errorFCM, data);
    if (errorFCM != undefined) {
      let jsonData = JSON.parse(JSON.stringify(errorFCM));
      console.log(jsonData);
      // [TODO] Go to Error Page
    } else {
      if (loadingFCM || dataFCM == undefined) {
        console.log('Data Fecting & Data Empty');
        return;
      }
      console.log('FCM DAt', dataFCM);

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
      setTimeout(() => {
        setIsLoading(false);
        navigation.reset({index: 0, routes: [{name: 'Home'}]});
      }, 1000);
    }
  }, [loadingFCM]);

  return isLoading ? (
    <SpinnerContainer>
      <Spinner visible={isLoading} textContent={'데이터 로딩 중...'} />
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
