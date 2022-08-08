import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Button, ErrorMessage} from '../components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {signin} from '../db_connect';
import {Alert, Text, View, Image, TouchableOpacity} from 'react-native';
import {UserContext, ProgressContext} from '../contexts';
import RNKakaoTest from 'react-native-kakao-connect';
import SocialBtn from '../components/SocialBtn';
import AsyncStorage from '@react-native-community/async-storage';
import {ThemeContext} from 'styled-components/native';
import {
  login,
  getProfile as getKakaoProfile,
  logout,
  unlink,
} from '@react-native-seoul/kakao-login';
import {
  NaverLogin,
  getProfile as getNaverProfile,
} from '@react-native-seoul/naver-login';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({theme}) => theme.background};
  padding: 0 20px;
  padding-top: ${({insets: {top}}) => top}px;
  padding-bottom: ${({insets: {bottom}}) => bottom}px;
`;

const SubTitleContainer = styled.View`
  justify-content: center;
  align-items: center;
  margin-bottom: 27px;
`;

const SubTitle = styled.Text`
  font-family: ${({theme}) => theme.fontBold};
  font-size: 24px;
`;

const LinkContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin-top: 64px;
`;

const LinkText = styled.Text`
  font-family: ${({theme}) => theme.fontRegular};
  font-size: 16px;
  text-decoration-line: underline;
  color: #777777;
`;

const APP_LOGO = require('../../assets/logos/app_logo.png');
const KAKAO_LOGO = require('../../assets/logos/kakao_logo.png');
const NAVER_LOGO = require('../../assets/logos/naver_logo.png');

const Signin = ({navigation}) => {
  const theme = useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  const {setUser} = useContext(UserContext);
  const {spinner} = useContext(ProgressContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [prevSignType, setPrevSignType] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('social_type', (err, result) => {
      console.log('이전 로그인 했던 플랫폼 --> ', result);
      setPrevSignType(result);
    });
  }, []);

  //naver-login-ios settings
  // const iosKeys = {
  //   kConsumerKey: "VC5CPfjRigclJV_TFACU",
  //   kConsumerSecret: "f7tLFw0AHn",
  //   kServiceAppName: "테스트앱(iOS)",
  //   kServiceAppUrlScheme: "testapp" // only for iOS
  // };

  //naver-login-android settings
  const androidKeys = {
    kConsumerKey: 'w4cSPEHXMDrXw_OcULnX',
    kConsumerSecret: '7dATQfr1oi',
    kServiceAppName: 'com.test',
  };

  const initials = androidKeys;
  // const initials = Platform.OS === "ios" ? iosKeys : androidKeys;

  const getUserProfile = async props => {
    // const profileResult = await getProfile(naverToken.accessToken);
    const profileResult = await getNaverProfile(props.accessToken);
    if (profileResult.resultcode === '024') {
      Alert.alert('로그인 실패', profileResult.message);
      return;
    }
    console.log('profileResult', profileResult);
  };

  const _handleNaverSignin = props => {
    return new Promise((resolve, reject) => {
      NaverLogin.login(props, (err, token) => {
        console.log(`\n\n  Token is fetched  :: ${JSON.stringify(token)} \n\n`);
        if (err) {
          reject(err);
          return;
        }
        getUserProfile(token);
        resolve(token);
        AsyncStorage.setItem('social_type', 'naver', () => {
          console.log('AsyncStorage Save!');
        });
        navigation.navigate('Agree');
      });
    });
  };

  const _handleKakaoSignin = async () => {
    const token = await login();

    console.log('카카오 로그인 결과 -> ', JSON.stringify(token));

    const profile = await getKakaoProfile();

    console.log('getProfile --> ', profile);
    AsyncStorage.setItem('social_type', 'kakao', () => {
      console.log('AsyncStorage Save!');
      // main페이지로 가는 변수관리
      // setUser({uid:123});
    });
    navigation.navigate('Agree');
    // setResult(JSON.stringify(token));
  };

  const _handleNavFirstExplain = () => {
    navigation.navigate('FirstExplain');
  };

  const _handleNavSecondExplain = () => {
    navigation.navigate('SecondExplain');
  };

  const TooltipBox = styled.View`
    background-color: black;
    padding: 6px;
    border-radius: 3px;
  `;
  const TooltipText = styled.Text`
    color: white;
    font-size: 12px;
  `;

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={20}
      contentContainerStyle={{flex: 1}}>
      <Container insets={insets}>
        <SubTitleContainer>
          <SubTitle>너랑 나랑</SubTitle>
          <SubTitle>함께 완성하는</SubTitle>
        </SubTitleContainer>
        <Image source={APP_LOGO} style={{marginBottom: 58}} />
        <SocialBtn id={'kakao'} onPress={_handleKakaoSignin}>
          <Image source={KAKAO_LOGO} style={{marginRight: 15}} />
          <Text
            style={{
              color: 'black',
              fontFamily: theme.fontBold,
              fontSize: 18,
            }}>
            Kakao로 로그인
          </Text>
        </SocialBtn>
        {prevSignType === 'kakao' && (
          <TooltipBox>
            <TooltipText>마지막 로그인 계정</TooltipText>
          </TooltipBox>
        )}
        <SocialBtn id={'naver'} onPress={() => _handleNaverSignin(initials)}>
          <Image source={NAVER_LOGO} style={{marginRight: 17}} />
          <Text
            style={{
              color: 'white',
              fontFamily: theme.fontBold,
              fontSize: 18,
            }}>
            네이버로 로그인
          </Text>
        </SocialBtn>
        {prevSignType === 'naver' && (
          <TooltipBox>
            <TooltipText>마지막 로그인 계정</TooltipText>
          </TooltipBox>
        )}
        <LinkContainer>
          <TouchableOpacity onPress={_handleNavFirstExplain}> 
            <LinkText>이용약관</LinkText>
          </TouchableOpacity>
          <View
            style={{
              height: 16,
              borderRightColor: '#777777',
              borderRightWidth: 1,
              marginHorizontal: 12,
            }}
          />
          <TouchableOpacity onPress={_handleNavSecondExplain}>
            <LinkText>개인정보 처리방침</LinkText>
          </TouchableOpacity>
        </LinkContainer>
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default Signin;
