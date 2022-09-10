import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  Alert,
  Text,
  View,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import {UserContext} from '@contexts';
import SocialBtn from '@components/SocialBtn';
import AsyncStorage from '@react-native-community/async-storage';
import {ThemeContext} from 'styled-components/native';
import {USE_QUERY, USE_MUTATION} from '@apolloClient/queries';
import {
  login,
  getProfile as getKakaoProfile,
} from '@react-native-seoul/kakao-login';
import {
  NaverLogin,
  getProfile as getNaverProfile,
} from '@react-native-seoul/naver-login';
import {Permission} from '@screens';
import {responsePathAsArray} from 'graphql';
import {requestUserPermission} from '../../push/PushNotification_helper';
import {refreshApi, loginApi} from '../../api/restfulAPI';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({theme}) => theme.fullWhite};
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
  color: ${({theme}) => theme.dark020};
`;

const LastLoginBox = styled.View`
  background-color: ${({theme}) => theme.white};
`;
const LastLoginText = styled.Text`
  font-family: ${({theme}) => theme.fontLight};
  color: ${({theme}) => theme.dark020};
  font-size: 14px;
  margin-top: 16px;
`;

const APP_LOGO = require('/assets/logos/app_logo.png');
const KAKAO_LOGO = require('/assets/logos/kakao_logo.png');
const NAVER_LOGO = require('/assets/logos/naver_logo.png');

const Signin = ({navigation}) => {
  const theme = useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  const {setUser} = useContext(UserContext);
  const [prevSignType, setPrevSignType] = useState('');
  const [accessToken, setAccessToken] = useState(null);
  const [socialType, setSocialType] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const [permission, setPermission] = useState(false);
  const {loading, error, data, refetch} = USE_QUERY('GET_PROFILE', accessToken);
  const [addFcmToken, addFcmTokenResult] = USE_MUTATION(
    'ADD_FCM_TOKEN',
    accessToken,
  );

  useEffect(() => {
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
      .then(response => {
        if (!response) {
          setPermission(true);
        } else {
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          )
            .then(response => {
              if (!response) {
                setPermission(true);
              } else {
                //모든 권한 있음 할시
                AsyncStorage.getItem('access_token', (err, result) => {
                  if (!!result) {
                    setAccessToken(result);
                  }
                });
                AsyncStorage.getItem('social_type', (err, result) => {
                  setPrevSignType(result);
                });
                // FCM Token
                requestUserPermission();
              }
            })
            .catch(error => {
              console.log('storage permission error', error);
            })
            .then(() => {
              console.log('storage permission check');
            });
        }
      })
      .catch(error => {
        console.log('camera permission error', error);
      })
      .then(() => {
        console.log('camera permission check');
      });
  }, []);

  useEffect(() => {
    if (!!accessToken && !autoLogin) {
      setTimeout(async () => {
        await refetch()
          .then(data => {
            if (data.data.myProfile.nickname !== '') {
              setUser({
                accessToken: accessToken,
                email: data.data.myProfile.email,
                nickname: data.data.myProfile.nickname,
                profileImg: data.data.myProfile.profileImg,
                socialTypes: data.data.myProfile.socialTypes,
                pushEnabled: data.data.myProfile.pushEnabled,
              });
            }
          })
          .catch(error => {
            if (error.networkError.statusCode === 401) {
              _handleRefreshApi();
            }
          })
          .then(() => console.log('refetch success'));
      }, 10);
    }
  }, [accessToken, autoLogin]);

  useEffect(() => {
    // Get From DataBase
    console.log('회원인지 아닌지', isRegistered);
    if (!!data && isRegistered) {
      if (data.myProfile.nickname === '') {
        //닉네임 설정을 안한 회원
        navigation.navigate('Nickname');
      } else {
        AsyncStorage.getItem('fcmtoken', (err, result) => {
          console.log('fcm token: ', result);
          addFcmToken({
            variables: {
              token: result,
            },
          });
        });
      }
    }
  }, [isRegistered]);

  useEffect(() => {
    if (addFcmTokenResult.data?.addFcmToken) {
      //최종 로그인
      console.log('Login Success');
      setUser({
        accessToken: accessToken,
        email: data.myProfile.email,
        nickname: data.myProfile.nickname,
        profileImg: data.myProfile.profileImg,
        socialTypes: data.myProfile.socialTypes,
        pushEnabled: data.myProfile.pushEnabled,
      });
    }
  }, [addFcmTokenResult]);

  const androidKeys = {
    kConsumerKey: 'w4cSPEHXMDrXw_OcULnX',
    kConsumerSecret: '7dATQfr1oi',
    kServiceAppName: 'com.diary',
  };

  const initials = androidKeys;

  const getUserProfile = async props => {
    const profileResult = await getNaverProfile(props.accessToken);
    if (profileResult.resultcode === '024') {
      Alert.alert('로그인 실패', profileResult.message);
      return;
    }
    console.log('profileResult birthday--> ', profileResult.response.birthday);
    console.log(
      'profileResult birthyear--> ',
      profileResult.response.birthyear,
    );
    console.log('profileResult gender--> ', profileResult.response.gender);
    return profileResult.response.email;
  };

  const _handleNaverSignin = props => {
    setIsRegistered(false);
    return new Promise((resolve, reject) => {
      NaverLogin.login(props, async (err, token) => {
        if (err) {
          reject(err);
          return;
        }
        const naverEmail = await getUserProfile(token);
        resolve(token);
        getAccessToken({
          email: naverEmail,
          socialType: 'NAVER',
        });
      });
    });
  };

  const _handleKakaoSignin = async () => {
    try {
      setIsRegistered(false);
      await login();
      const profile = await getKakaoProfile();
      console.log('getProfile birthday--> ', profile.birthday);
      console.log('getProfile birthyear--> ', profile.birthyear);
      console.log('getProfile gender--> ', profile.gender);
      getAccessToken({email: profile.email, socialType: 'KAKAO'});
    } catch (error) {
      console.log(error);
    }
  };

  const getAccessToken = async ({email, socialType}) => {
    const response = await loginApi(email, socialType);
    const {data} = response;
    if (!data.isRegistered) {
      //데이터베이스에 회원이 존재 하지 않는 경우
      setAutoLogin(prev => !prev);
    }
    if (data.socialTypes.length === 1 && data.socialTypes[0] !== socialType) {
      navigation.navigate('AccountConnect', {
        accessToken: data.accessToken,
        socialType: data.socialTypes[0],
        email: email,
      });
      return;
    }

    AsyncStorage.setItem(
      'refresh_token',
      response.headers['set-cookie'][0].split(' ')[0],
      () => {
        console.log('AsyncStorage refresh_token Save!');
      },
    );
    AsyncStorage.setItem('access_token', data.accessToken, () => {
      console.log('AsyncStorage access_token Save!');
      setAccessToken(data.accessToken);
    });
    AsyncStorage.setItem('social_type', socialType, () => {
      console.log('AsyncStorage social_type Save!');
      setSocialType(socialType);
    });
    AsyncStorage.setItem('email', email, () => {
      console.log('AsyncStorage email Save!');
    });
    setIsRegistered(data.isRegistered);

    if (!data.isRegistered) {
      navigation.navigate('Agree');
    }
  };

  const _handleNavFirstExplain = () => {
    navigation.navigate('FirstExplain');
  };

  const _handleNavSecondExplain = () => {
    navigation.navigate('SecondExplain');
  };

  const _handleRefreshApi = async () => {
    const response = await refreshApi();
    if (response === 'A001') {
      return;
    }
    const {data} = response;
    setAccessToken(data.accessToken);
    AsyncStorage.setItem('access_token', data.accessToken, () => {
      console.log('refresh and save access_token');
    });
    AsyncStorage.setItem(
      'refresh_token',
      response.headers['set-cookie'][0].split(' ')[0],
      () => {
        console.log('refresh and refresh_token save');
      },
    );
  };

  const LastLogin = () => {
    if (prevSignType !== null) {
      return (
        <LastLoginBox>
          <LastLoginText>
            마지막 로그인 수단 :{' '}
            {prevSignType === 'KAKAO' ? '카카오' : '네이버'}
          </LastLoginText>
        </LastLoginBox>
      );
    } else {
      return <></>;
    }
  };

  return permission ? (
    <Permission onChange={() => setPermission(false)} />
  ) : (
    <KeyboardAwareScrollView
      extraScrollHeight={20}
      contentContainerStyle={{flex: 1}}>
      <Container insets={insets}>
        <SubTitleContainer>
          <SubTitle>너랑 나랑</SubTitle>
          <SubTitle>함께 완성하는</SubTitle>
        </SubTitleContainer>
        <Image source={APP_LOGO} style={{marginBottom: 58}} />
        <SocialBtn
          id={'kakao'}
          onPress={_handleKakaoSignin}
          style={{marginBottom: 20}}>
          <Image source={KAKAO_LOGO} style={{marginRight: 15}} />
          <Text
            style={{
              color: theme.dark010,
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
              color: theme.white,
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
              borderRightColor: theme.dark020,
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
