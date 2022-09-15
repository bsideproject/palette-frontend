import React, {useContext, useEffect, useState} from 'react';
import {ThemeContext} from 'styled-components/native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/AntDesign';
import FIcon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-community/async-storage';
import {UserContext} from '@contexts';
import {USE_MUTATION, USE_QUERY} from '@apolloClient/queries';
import {
  View,
  Image,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from 'react-native';
import {logoutApi} from '../api/restfulAPI';
import SwitchToggle from 'react-native-switch-toggle';
import {useIsFocused} from '@react-navigation/native';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';
import {ErrorAlert} from '@components';
import {setCookie} from '../api/Cookie';

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({theme}) => theme.fullWhite};
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const InnerContainer = styled.View`
  padding-top: 52px;
`;

const ProfileContainer = styled.View`
  justify-content: center;
  align-items: center;
  margin-bottom: 60px;
`;

const ProfileRow = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ProfileImage = styled.Image`
  width: 84px;
  height: 84px;
  margin-bottom: 12px;
  border-radius: 50px;
`;

const ProfileNickname = styled.Text`
  font-family: ${({theme}) => theme.fontBold};
  font-size: 16px;
`;

const ClickContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  padding: 0 22.5px 0 16px;
`;

const NoneClickContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 0 22.5px 0 16px;
`;

const SettingText = styled.Text`
  font-family: ${({theme}) => theme.fontRegular};
  font-size: 16px;
`;

const BoundaryContainer = styled.View`
  height:1px;
  background:${({theme}) => theme.light010}};
  margin: 20px 0;
`;

const VersionText = styled.Text`
  font-size:14px;
  font-family: ${({theme}) => theme.fontRegular};
  color:${({theme}) => theme.dark030}};
`;

const ExitModalContainer = styled.View`
  flex-direction: column;
  background-color: ${({theme}) => theme.white};
  shadow-offset: 0px 2px;
  shadow-radius: 8px;
  shadow-color: rgba(0, 0, 0, 0.16);
  border-radius: 16px;
  width: 100%;
  height: 25%;
`;

const ExitModalTop = styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: flex-end;
`;

const ExitModalMid = styled.View`
  flex: 3;
  align-items: center;
  justify-content: center;
`;

const ExitModalBottom = styled.TouchableOpacity`
  flex: 2;
  background-color: ${({theme}) => theme.pointColor};
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  justify-content: center;
  align-items: center;
`;

const ExitModalTxt1 = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${({theme}) => theme.dark010};
  font-family: ${({theme}) => theme.fontRegular};
`;

const ExitModalTxt3 = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${({theme}) => theme.white};
  font-family: ${({theme}) => theme.fontRegular};
`;

const StyledModalContainer = styled.View`
  flex-direction: column;
  align-items: center;
  width: 150px;
  height: 100px;
  border-radius: 6px;
  border: 1px solid
  border-color: ${({theme}) => theme.light020};
  background-color: ${({theme}) => theme.white};
  shadow-offset: 0px 4px;
  shadow-radius: 20px;
  shadow-color: rgba(0, 0, 0, 0.08);
  justify-content: flex-end;
  align-items: flex-end;
`;

const StyledModalButton = styled.TouchableOpacity`
  /* Modal Button들의 모달창 내의 높이를 균일하게 하기 위하여 flex를 줌 */
  flex: 1;
  align-items: center;
  flex-direction: row;
  padding: 0 10px;
`;

const StyledModalText = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: ${({theme}) => theme.dark010};
  font-family: ${({theme}) => theme.fontRegular};
`;

const HorizentalLine = styled.View`
  background-color: ${({theme}) => theme.light020};
  width: 100%;
  height: 1px;
`;

const ModalTxt = styled.View`
  flex: 3;
  margin-left: 5%;
`;

// Spinner
const SpinnerContainer = styled.Text`
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-family: ${({theme}) => theme.fontRegular};
`;

const PROFILE_DEFAULT = require('/assets/icons/default_profile.png');
const NOTION_LOGO = require('/assets/logos/notion_logo.png');
const {width, height} = Dimensions.get('window');

const Setting = ({navigation}) => {
  const theme = useContext(ThemeContext);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const {setUser, user} = useContext(UserContext);
  const [pushToggle, setPushToggle] = useState(user.pushEnabled);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('프로필 불러오는 중...');
  const [
    deleteFcmToken,
    {loading: loadingFCM, error: errorFCM, data: dataFCM},
  ] = USE_MUTATION('DELETE_FCM_TOKEN', user.accessToken);
  const [
    updateProfile,
    {loading: loadingProfile, error: errorProfile, data: dataProfile},
  ] = USE_MUTATION('UPDATE_PROFILE', user.accessToken);
  const {loading, error, data, refetch} = USE_QUERY(
    'GET_PROFILE',
    user.accessToken,
  );
  const focus = useIsFocused();

  const _handleDeleteFcmToken = () => {
    AsyncStorage.getItem('fcmtoken', (err, result) => {
      deleteFcmToken({
        variables: {
          token: result,
        },
      });
    });
  };

  const _handleAwaitLogout = async () => {
    const response = await logoutApi();
    console.log('로그아웃', response);
  };

  const _handleLogout = () => {
    setIsLoading(true);
    setLoadingMessage('로그아웃 중...');
    _handleDeleteFcmToken();
  };

  const _handlePushEnabled = () => {
    let toggle = !pushToggle;
    console.log('Toggle : ', toggle);
    setPushToggle(toggle);
    // setIsLoading(true);
    // setLoadingMessage('푸시 알림 설정 중...');
    updateProfile({
      variables: {pushEnabled: toggle},
    });
  };

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
      // Not Check Data Is True..
      console.log('Data', dataProfile);
      setUser({
        accessToken: user.accessToken,
        email: user.email,
        nickname: user.nickname,
        profileImg: user.profileImg,
        socialTypes: user.socialTypes,
        pushEnabled: pushToggle,
      });
      setIsLoading(false);
    }
  }, [loadingProfile]);

  useEffect(() => {
    if (errorFCM != undefined) {
      let jsonData = JSON.parse(JSON.stringify(errorFCM));
      console.log(jsonData);
      setIsLoading(false);
      setLogoutModalVisible(false);
      ErrorAlert();
    } else {
      if (loadingFCM || dataFCM == undefined) {
        console.log('Data Fecting & Data Empty');
        return;
      }
      // Logout.
      console.log('DataFCM', dataFCM);
      _handleAwaitLogout();
      AsyncStorage.removeItem('refresh_token');
      AsyncStorage.removeItem('access_token');
      AsyncStorage.removeItem('email');
      AsyncStorage.removeItem('fcmtoken');
      AsyncStorage.removeItem('disableDiscard');
      // Logout Set Access token -> Null Value
      setCookie('access_token', null);
      setUser({
        accessToken: null,
        email: null,
        nickname: null,
        profileImg: null,
        socialTypes: null,
        pushEnabled: null,
      });
      setIsLoading(false);
      setLogoutModalVisible(false);
    }
  }, [loadingFCM]);

  const getData = () => {
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
      // Not Check Data Is True..
      console.log('Data', data);
      setPushToggle(data.myProfile.pushEnabled);
      setUser({
        accessToken: user.accessToken,
        email: data.myProfile.email,
        nickname: data.myProfile.nickname,
        profileImg: data.myProfile.profileImg,
        socialTypes: data.myProfile.socialTypes,
        pushEnabled: data.myProfile.pushEnabled,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (focus) {
      setIsLoading(true);
      refetch();
      getData();
    }
  }, [focus, loading]);

  const _handleSetNickname = () => {
    navigation.navigate('Nickname2', {setting: true});
  };

  const _handleSetProfileImage = () => {
    navigation.navigate('ProfileImageSet2', {setting: true});
  };

  return isLoading ? (
    <SpinnerContainer>
      <Spinner visible={isLoading} textContent={loadingMessage} />
    </SpinnerContainer>
  ) : (
    <Container>
      <InnerContainer>
        <ProfileContainer>
          <TouchableOpacity onPress={_handleSetProfileImage}>
            {user.profileImg ? (
              <ProfileImage
                source={{uri: user.profileImg}}
                resizeMethod={'resize'}
              />
            ) : (
              <ProfileImage source={PROFILE_DEFAULT} />
            )}
          </TouchableOpacity>
          <ProfileRow onPress={_handleSetNickname}>
            <ProfileNickname>{user.nickname}</ProfileNickname>
            <FIcon
              name={'edit-2'}
              size={16}
              color={theme.dark010}
              style={{justifyContent: 'center', marginLeft: 3}}
            />
          </ProfileRow>
        </ProfileContainer>
        <NoneClickContainer>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <SettingText style={{fontWeight: '700'}}>설정</SettingText>
          </View>
        </NoneClickContainer>
        <BoundaryContainer />
        <ClickContainer onPress={() => navigation.navigate('UserInfo')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <SettingText>계정</SettingText>
          </View>
          <Icon name={'right'} size={15} color={theme.dark010} />
        </ClickContainer>
        <BoundaryContainer />
        <NoneClickContainer>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <SettingText>푸시알림</SettingText>
          </View>
          <SwitchToggle
            switchOn={pushToggle}
            circleColorOn={theme.pointColor}
            backgroundColorOn={theme.homeColor}
            circleColorOff={theme.dark030}
            onPress={_handlePushEnabled}
            containerStyle={{
              width: 40,
              height: 15,
              borderRadius: 25,
              alignItems: 'center',
              marginTop: 5,
            }}
            circleStyle={{
              width: 20,
              height: 20,
              borderRadius: 25,
            }}
          />
        </NoneClickContainer>
        <BoundaryContainer />
        <NoneClickContainer style={{marginTop: 40}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <SettingText style={{fontWeight: '700'}}>앱정보</SettingText>
          </View>
          <VersionText>v.1.0.1</VersionText>
        </NoneClickContainer>
        <BoundaryContainer />
        <ClickContainer onPress={() => navigation.navigate('Introduce')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <SettingText>'반쪽일기' 소개</SettingText>
          </View>
          <Image source={NOTION_LOGO} />
        </ClickContainer>
        <BoundaryContainer />
        <ClickContainer
          onPress={() => navigation.navigate('FirstExplain', {notion: true})}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <SettingText>서비스 이용약관</SettingText>
          </View>
          <Image source={NOTION_LOGO} />
        </ClickContainer>
        <BoundaryContainer />
        <ClickContainer
          onPress={() => navigation.navigate('SecondExplain', {notion: true})}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <SettingText>개인정보처리방침</SettingText>
          </View>
          <Image source={NOTION_LOGO} />
        </ClickContainer>
        <BoundaryContainer />
        <ClickContainer
          style={{marginVertical: 20}}
          onPress={() => setLogoutModalVisible(true)}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <SettingText style={{fontWeight: '700'}}>로그아웃</SettingText>
          </View>
          <FIcon
            name={'log-out'}
            size={16}
            color={theme.dark010}
            style={{justifyContent: 'center'}}
          />
        </ClickContainer>
      </InnerContainer>

      <Modal
        isVisible={logoutModalVisible}
        useNativeDriver={true}
        onRequestClose={() => setLogoutModalVisible(false)}
        hideModalContentWhileAnimating={true}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <ExitModalContainer>
          <ExitModalTop>
            <TouchableOpacity
              onPress={() => setLogoutModalVisible(false)}
              style={{marginRight: '5%'}}>
              <FIcon
                name={'x'}
                size={20}
                color={theme.dark010}
                style={{justifyContent: 'center'}}
              />
            </TouchableOpacity>
          </ExitModalTop>
          <ExitModalMid>
            <ExitModalTxt1>로그아웃 하시겠습니까?</ExitModalTxt1>
          </ExitModalMid>
          <ExitModalBottom onPress={_handleLogout}>
            <ExitModalTxt3>예, 로그아웃 합니다.</ExitModalTxt3>
          </ExitModalBottom>
        </ExitModalContainer>
      </Modal>
    </Container>
  );
};

export default Setting;
