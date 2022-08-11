import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {signin} from '../db_connect';
import {Alert, Text, View, Image, TouchableOpacity} from 'react-native';
import {UserContext, ProgressContext} from '../contexts';
import SocialBtn from '../components/SocialBtn';
import AsyncStorage from '@react-native-community/async-storage';
import {ThemeContext} from 'styled-components/native';
import axios from 'axios';
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

const LastLoginBox = styled.View`
  background-color: white;
`;
const LastLoginText = styled.Text`
  color: black;
  font-size: 12px;
`;

const APP_LOGO = require('../../assets/logos/app_logo.png');
const KAKAO_LOGO = require('../../assets/logos/kakao_logo.png');
const NAVER_LOGO = require('../../assets/logos/naver_logo.png');

const Signin = ({navigation}) => {
  const theme = useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  const {setUser} = useContext(UserContext);
  const {spinner} = useContext(ProgressContext);
  const [prevSignType, setPrevSignType] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('social_type', (err, result) => {
      console.log('이전 로그인 했던 플랫폼 --> ', result);
      setPrevSignType(result);
    });
  }, []);

  //naver-login-ios settings
  // const iosKeys = {
  //   kConsumerKey: "w4cSPEHXMDrXw_OcULnX",
  //   kConsumerSecret: "7dATQfr1oi",
  //   kServiceAppName: "테스트앱(iOS)",
  //   kServiceAppUrlScheme: "testapp" // only for iOS
  // };

  //naver-login-android settings
  const androidKeys = {
    kConsumerKey: 'w4cSPEHXMDrXw_OcULnX',
    kConsumerSecret: '7dATQfr1oi',
    kServiceAppName: 'com.test',
  };

  const initials = Platform.OS === 'ios' ? iosKeys : androidKeys;

  const getUserProfile = async props => {
    // const profileResult = await getProfile(naverToken.accessToken);
    const profileResult = await getNaverProfile(props.accessToken);
    if (profileResult.resultcode === '024') {
      Alert.alert('로그인 실패', profileResult.message);
      return;
    }
    console.log('profileResult', profileResult);
    getAcessToken({email: profileResult.response.email, socialType: 'naver'});
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
    try {
      const token = await login();

      console.log('카카오 로그인 결과 -> ', JSON.stringify(token));

      const profile = await getKakaoProfile();

      console.log('getProfile --> ', profile);
      getAcessToken({email: profile.email, socialType: 'kakao'});
      AsyncStorage.setItem('social_type', 'kakao', () => {
        console.log('AsyncStorage Save!');
        // main페이지로 가는 변수관리
        // setUser({uid:123});
      });
      navigation.navigate('Agree');
      // setResult(JSON.stringify(token));
    } catch (error) {
      console.log(error);
    }
  };

  const getAcessToken = ({email, socialType}) => {
    axios
      .post('http://61.97.190.252:8082/api/v1/login', {
        email: email,
        socialType: socialType,
      })
      .then(response => {
        console.log('소셜로그인 타입 --> ', socialType);
        console.log('api 결과 --> ', response.data.accessToken);
      })
      .catch(error => {
        console.log('login api error', error);
      })
      .then(() => {
        console.log('login api 실행 완료');
      });
  };

  const _handleNavFirstExplain = () => {
    navigation.navigate('FirstExplain');
  };

  const _handleNavSecondExplain = () => {
    navigation.navigate('SecondExplain');
  };

  const LastLogin = () => {
    if (prevSignType !== null) {
      return (
        <LastLoginBox>
          <LastLoginText>
            마지막 로그인 수단 :{' '}
            {prevSignType === 'kakao' ? '카카오' : '네이버'}
          </LastLoginText>
        </LastLoginBox>
      );
    } else {
      return <></>;
    }
  };

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
        <LastLogin />
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
          <View
            style={{
              height: 16,
              borderRightColor: '#777777',
              borderRightWidth: 1,
              marginHorizontal: 12,
            }}
          />
          <TouchableOpacity onPress={() => navigation.navigate('Agree')}>
            <LinkText>임시 Login Skip</LinkText>
          </TouchableOpacity>
        </LinkContainer>
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default Signin;
