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
import axios from 'axios';
import {USE_QUERY, USE_MUTATION} from '@apolloClient/queries';
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
import {Permission} from '@screens';
import {responsePathAsArray} from 'graphql';
import {requestUserPermission} from '../../push/PushNotification_helper';

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
        console.log('camera permission', response);
        if (!response) {
          setPermission(true);
        } else {
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          )
            .then(response => {
              console.log('storage permission', response);
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
                  console.log('이전 로그인 했던 플랫폼 --> ', result);
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
            console.log('refetch data', data);
            setUser({
              accessToken: accessToken,
              email: data.data.myProfile.email,
              socialType: socialType,
              nickname: data.data.myProfile.nickname,
              profileImg: data.data.myProfile.profileImg,
              socialTypes: data.data.myProfile.socialTypes,
            });
          })
          .catch(error => {
            console.log('refetch error', error.networkError.statusCode);
            if (error.networkError.statusCode === 401) {
              refreshFunc();
            }
          })
          .then(() => console.log('refetch success'));
      }, 10);
    }
  }, [accessToken, autoLogin]);

  useEffect(() => {
    if (!loading) {
      // Get From DataBase
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
    }
  }, [loading]);

  useEffect(() => {
    if (addFcmTokenResult.data?.addFcmToken) {
      //최종 로그인
      console.log('Login Success');
      setUser({
        accessToken: accessToken,
        email: data.myProfile.email,
        socialType: socialType,
        nickname: data.myProfile.nickname,
        profileImg: data.myProfile.profileImg,
        socialTypes: data.myProfile.socialTypes,
      });
    }
  }, [addFcmTokenResult]);

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
    kServiceAppName: 'com.diary',
  };

  const initials = Platform.OS === 'ios' ? iosKeys : androidKeys;

  const getUserProfile = async props => {
    // const profileResult = await getProfile(naverToken.accessToken);
    const profileResult = await getNaverProfile(props.accessToken);
    if (profileResult.resultcode === '024') {
      Alert.alert('로그인 실패', profileResult.message);
      return;
    }
    console.log('profileResult email--> ', profileResult.response.email);
    console.log('profileResult birthday--> ', profileResult.response.birthday);
    console.log(
      'profileResult birthyear--> ',
      profileResult.response.birthyear,
    );
    console.log('profileResult gender--> ', profileResult.response.gender);
    return profileResult.response.email;
  };

  const _handleNaverSignin = props => {
    return new Promise((resolve, reject) => {
      NaverLogin.login(props, async (err, token) => {
        console.log(`\n\n  Token is fetched  :: ${JSON.stringify(token)} \n\n`);
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
      const token = await login();

      console.log('카카오 로그인 결과 -> ', JSON.stringify(token));

      const profile = await getKakaoProfile();

      console.log('getProfile email--> ', profile.email);
      console.log('getProfile birthday--> ', profile.birthday);
      console.log('getProfile birthyear--> ', profile.birthyear);
      console.log('getProfile gender--> ', profile.gender);
      getAccessToken({email: profile.email, socialType: 'KAKAO'});
      // setResult(JSON.stringify(token));
    } catch (error) {
      console.log(error);
    }
  };

  const getAccessToken = async ({email, socialType}) => {
    await axios
      .post('http://61.97.190.252:8080/api/v1/login', {
        email: email,
        socialType: socialType,
      })
      .then(response => {
        console.log('login data => socialTypes...', response.data.socialTypes);
        if (!response.data.isRegistered) {
          //데이터베이스에 회원이 존재 하지 않는 경우
          setAutoLogin(prev => !prev);
        }
        if (
          response.data.socialTypes.length === 1 &&
          response.data.socialTypes[0] !== socialType
        ) {
          navigation.navigate('AccountConnect', {
            accessToken: response.data.accessToken,
            socialType: response.data.socialTypes[0],
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
        AsyncStorage.setItem('access_token', response.data.accessToken, () => {
          console.log('AsyncStorage access_token Save!');
          setAccessToken(response.data.accessToken);
        });
        AsyncStorage.setItem('social_type', socialType, () => {
          console.log('AsyncStorage social_type Save!');
          setSocialType(socialType);
        });
        AsyncStorage.setItem('email', email, () => {
          console.log('AsyncStorage email Save!');
        });
        setIsRegistered(response.data.isRegistered);
        if (!response.data.isRegistered) {
          //데이터베이스에 회원이 존재 하지 않는 경우
          navigation.navigate('Agree');
        }
      })
      .catch(error => {
        console.log('login api error', JSON.stringify(error));
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

  const refreshFunc = () => {
    //토큰 갱신 함수
    AsyncStorage.getItem('refresh_token', async (err, result) => {
      if (!!result) {
        await axios
          .post('http://61.97.190.252:8080/api/v1/token', {
            headers: {
              Cookie: result,
            },
          })
          .then(response => {
            console.log('토큰 갱신', response.data);
            setAccessToken(response.data.accessToken);
            AsyncStorage.setItem(
              'access_token',
              response.data.accessToken,
              () => {
                console.log('refresh and save access_token');
              },
            );
            AsyncStorage.setItem(
              'refresh_token',
              response.headers['set-cookie'][0].split(' ')[0],
              () => {
                console.log('refresh and refresh_token save');
              },
            );
          })
          .catch(error => {
            console.log('refresh token api error', error);
          })
          .then(() => {
            console.log('refresh token api 실행 완료');
          });
      }
    });
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
