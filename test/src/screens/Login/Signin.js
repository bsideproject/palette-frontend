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
import {Permission, PushCheck} from '@screens';
import {responsePathAsArray} from 'graphql';
import {requestUserPermission} from '../../push/PushNotification_helper';
import {refreshApi, loginApi} from '../../api/restfulAPI';
import {ErrorAlert} from '@components';
import {setCookie, getCookie} from '../../api/Cookie';
import {useIsFocused} from '@react-navigation/native';

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
  margin-top: 25px;
  justify-content: center;
  align-items: center;
  margin-bottom: 108px;
`;

const SubTitle1 = styled.Text`
  font-family: ${({theme}) => theme.fontRegular};
  font-size: 16px;
  color: #8c8c8c;
  margin-bottom: 5px;
`;

const SubTitle2 = styled.Text`
  font-family: ${({theme}) => theme.fontBold};
  font-weight: 600;
  font-size: 19px;
  color: #222227;
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
  font-family: ${({theme}) => theme.fontRegular};
  color: ${({theme}) => theme.dark020};
  font-size: 14px;
  margin-top: 13px;
`;

const APP_LOGO = require('/assets/logos/app_logo.png');
const KAKAO_LOGO = require('/assets/logos/kakao_logo.png');
const NAVER_LOGO = require('/assets/logos/naver_logo.png');

const Signin = ({navigation}) => {
  const theme = useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  const {setUser} = useContext(UserContext);
  const [prevSignType, setPrevSignType] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [socialType, setSocialType] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const [permission, setPermission] = useState(false);
  const [pushPage, setPushPage] = useState(true);
  const {loading, error, data, refetch} = USE_QUERY('GET_PROFILE', accessToken);
  const [addFcmToken, {loading: loadingFCM, error: errorFCM, data: dataFCM}] =
    USE_MUTATION('ADD_FCM_TOKEN', accessToken);
  const [
    updateProfile,
    {loading: loadingProfile, error: errorProfile, data: dataProfile},
  ] = USE_MUTATION('UPDATE_PROFILE', accessToken);
  const [asyncIsPush, setAsyncIsPush] = useState();
  AsyncStorage.getItem('is_push', (err, result) => {
    result === 'true' ? setAsyncIsPush(true) : setAsyncIsPush(false);
  });

  const _checkPushPage = () => {
    AsyncStorage.getItem('is_push', (err, result) => {
      if (result === undefined) setPushPage(false);
      else setPushPage(result);
    });
  };
  const focus = useIsFocused();

  useEffect(() => {
    if (focus) {
      AsyncStorage.getItem('social_type', (err, result) => {
        setPrevSignType(result);
      });
      if (pushPage) {
        setPrevSignType(null);
      }
    }
  }, [focus]);

  useEffect(() => {
    _checkPushPage();
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
                AsyncStorage.getItem('access_token', (err, result) => {
                  if (!!result) {
                    setAccessToken(result);
                  }
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
              AsyncStorage.getItem('fcmtoken', (err, result) => {
                console.log('[Auto Login]fcm token', result);
                addFcmToken({
                  variables: {
                    token: result,
                  },
                });
              });
            }
          })
          .catch(error => {
            if (error.networkError.statusCode === 401) {
              //_handleRefreshApi();
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
        if (accessToken) {
          AsyncStorage.getItem('fcmtoken', (err, result) => {
            console.log('[IsRegisterLogin]fcm token', result);
            addFcmToken({
              variables: {
                token: result,
              },
            });
          });
        }
      }
    }
  }, [isRegistered, accessToken]);

  useEffect(() => {
    if (errorFCM != undefined) {
      let jsonData = JSON.parse(JSON.stringify(errorFCM));
      console.log(jsonData);
      ErrorAlert();
    } else {
      if (loadingFCM || dataFCM == undefined) {
        console.log('Data Fecting & Data Empty');
        return;
      }
      //최종 로그인
      console.log('Login Success', dataFCM, data);
      setUser({
        accessToken: accessToken,
        email: data.myProfile.email,
        nickname: data.myProfile.nickname,
        profileImg: data.myProfile.profileImg,
        socialTypes: data.myProfile.socialTypes,
        pushEnabled: getCookie('is_push')
          ? getCookie('is_push')
          : data.myProfile.pushEnabled,
      });
    }
  }, [loadingFCM]);

  const androidKeys = {
    kConsumerKey: 'w4cSPEHXMDrXw_OcULnX',
    kConsumerSecret: '7dATQfr1oi',
    kServiceAppName: 'com.half.diary',
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
    const naverLogin = () => {
      return new Promise((resolve, reject) => {
        NaverLogin.login(props, (err, token) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(token);
        });
      });
    };
    naverLogin().then(async token => {
      const naverEmail = await getUserProfile(token);
      getAccessToken({
        email: naverEmail,
        socialType: 'NAVER',
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
    if (data.code === 'A005') {
      alert(data.message);
      return;
    }
    if (!data.isRegistered) {
      setAutoLogin(prev => !prev);
    }
    if (data.socialTypes.length === 1 && data.socialTypes[0] !== socialType) {
      navigation.navigate('AccountConnect', {
        accessToken: data.accessToken,
        socialType: data.socialTypes[0],
        email: email,
        refreshToken: response.headers['set-cookie'][0].split(' ')[0],
      });
      return;
    }

    AsyncStorage.setItem(
      'refresh_token',
      response.headers['set-cookie'][0].split(' ')[0],
      () => {
        console.log(
          'Refresh Token',
          response.headers['set-cookie'][0].split(' ')[0],
        );
        console.log('AsyncStorage refresh_token Save!');
      },
    );
    AsyncStorage.setItem('access_token', data.accessToken, () => {
      console.log('Access Token', data.accessToken);
      console.log('AsyncStorage access_token Save!');
      setAccessToken(data.accessToken);
      setCookie('access_token', data.accessToken);
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

    if (getCookie('is_push') !== undefined) {
      const isPush =
        getCookie('is_push') !== undefined ? getCookie('is_push') : asyncIsPush;
      updateProfile({
        variables: {pushEnabled: isPush},
      });
    }
    setCookie('is_push', undefined);
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
  ) : !pushPage ? (
    <PushCheck onClick={_checkPushPage} />
  ) : (
    <KeyboardAwareScrollView
      extraScrollHeight={20}
      contentContainerStyle={{flex: 1}}>
      <Container insets={insets}>
        <Image source={APP_LOGO} width={51} />
        <SubTitleContainer>
          <SubTitle1>너랑 나랑 함께 완성하는</SubTitle1>
          <SubTitle2>Welcome! 반쪽일기</SubTitle2>
        </SubTitleContainer>
        <SocialBtn
          id={'kakao'}
          onPress={_handleKakaoSignin}
          style={{marginBottom: 10}}>
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
