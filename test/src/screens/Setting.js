import React, {useContext, useEffect, useState} from 'react';
import {ThemeContext} from 'styled-components/native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/AntDesign';
import FIcon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-community/async-storage';
import {UserContext} from '@contexts';
import {USE_MUTATION} from '@apolloClient/queries';
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

const ProfileRow = styled.View`
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

const PROFILE_DEFAULT = require('/assets/icons/default_profile.png');
const NOTION_LOGO = require('/assets/logos/notion_logo.png');
const {width, height} = Dimensions.get('window');

const Setting = ({navigation}) => {
  const theme = useContext(ThemeContext);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const {setUser, user} = useContext(UserContext);
  const [pushToggle, setPushToggle] = useState(user.pushEnabled);
  const focus = useIsFocused();

  const [deleteFcmToken, deleteFcmTokenResult] = USE_MUTATION(
    'DELETE_FCM_TOKEN',
    user.accessToken,
  );
  const [updateProfile, updateResult] = USE_MUTATION(
    'UPDATE_PROFILE',
    user.accessToken,
  );

  const _handleDeleteFcmToken = () => {
    AsyncStorage.getItem('fcmtoken', (err, result) => {
      deleteFcmToken({
        variables: {
          token: result,
        },
      });
    });
  };

  const _handleLogout = async () => {
    const response = await logoutApi();
    console.log('로그아웃', response);
    _handleDeleteFcmToken();
    AsyncStorage.removeItem('refresh_token');
    AsyncStorage.removeItem('access_token');
    AsyncStorage.removeItem('email');
    AsyncStorage.removeItem('fcmtoken');
    setUser({
      accessToken: null,
      email: null,
      nickname: null,
      profileImg: null,
      socialTypes: null,
      pushEnabled: null,
    });
  };

  const _handlePushEnabled = () => {
    let toggle = !pushToggle;
    console.log('Toggle : ', toggle);
    setPushToggle(toggle);
    updateProfile({
      variables: {pushEnabled: toggle},
    });
    setUser({
      accessToken: user.accessToken,
      email: user.email,
      socialType: user.socialType,
      nickname: user.nickname,
      profileImg: user.profileImg,
      socialTypes: user.socialType,
      pushEnabled: toggle,
    });
  };

  useEffect(() => {
    setPushToggle(user.pushEnabled);
  }, [focus]);

  const _handleSetNickname = () => {
    setEditModalVisible(false);
    navigation.navigate('Nickname', {setting: true});
  };

  const _handleSetProfileImage = () => {
    setEditModalVisible(false);
    navigation.navigate('ProfileImageSet', {setting: true});
  };

  return (
    <Container>
      <InnerContainer>
        <ProfileContainer>
          {user.profileImg ? (
            <ProfileImage source={{uri: user.profileImg}} />
          ) : (
            <ProfileImage source={PROFILE_DEFAULT} />
          )}
          <ProfileRow>
            <FIcon
              name={'edit-2'}
              size={16}
              color={theme.dark010}
              style={{justifyContent: 'center', marginRight: 3}}
              onPress={() => setEditModalVisible(true)}
            />
            <ProfileNickname>{user.nickname}</ProfileNickname>
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
        <ClickContainer onPress={() => {}}>
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
        isVisible={editModalVisible}
        useNativeDriver={true}
        onRequestClose={() => {
          setEditModalVisible(false);
        }}
        backdropOpacity={0}
        hideModalContentWhileAnimating={true}>
        <Pressable
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            alignItems: 'center',
          }}
          onPress={() => {
            setEditModalVisible(false);
          }}>
          <StyledModalContainer
            style={{marginTop: height * 0.28, marginLeft: width * 0.2}}>
            <StyledModalButton onPress={_handleSetNickname}>
              <ModalTxt>
                <StyledModalText>닉네임</StyledModalText>
              </ModalTxt>
            </StyledModalButton>

            <HorizentalLine />

            <StyledModalButton onPress={_handleSetProfileImage}>
              <ModalTxt>
                <StyledModalText>프로필 사진</StyledModalText>
              </ModalTxt>
            </StyledModalButton>
          </StyledModalContainer>
        </Pressable>
      </Modal>

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
