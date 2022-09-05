import React, {useContext, useEffect, useState} from 'react';
import {ThemeContext} from 'styled-components/native';
import styled from 'styled-components/native';
import {Button} from '@components';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';
import {UserContext} from '@contexts';
import {USE_MUTATION} from '@apolloClient/queries';
import {View} from 'react-native';
import {logoutApi} from '../api/restfulAPI';
import SwitchToggle from 'react-native-switch-toggle';
import {useIsFocused} from '@react-navigation/native';

const Container = styled.View`
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

const SettingContainer = styled.TouchableOpacity`
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

const PROFILE_DEFAULT = require('/assets/icons/default_profile.png');

const Setting = ({navigation}) => {
  const theme = useContext(ThemeContext);
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
      socialType: null,
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

  return (
    <Container>
      <InnerContainer>
        <ProfileContainer>
          {user.profileImg !== null ? (
            <ProfileImage source={{uri: user.profileImg}} />
          ) : (
            <ProfileImage source={PROFILE_DEFAULT} />
          )}
          <ProfileNickname>{user.nickname}</ProfileNickname>
        </ProfileContainer>
        <SettingContainer>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <SettingText>계정</SettingText>
          </View>
          <Icon name={'right'} size={15} color={theme.dark010} />
        </SettingContainer>
        <BoundaryContainer />
        <SettingContainer>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <SettingText>푸시 알림</SettingText>
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
        </SettingContainer>
        <BoundaryContainer />
        <SettingContainer>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <SettingText>버전</SettingText>
          </View>
          <VersionText>v.1.0.1</VersionText>
        </SettingContainer>
        <BoundaryContainer />
        <SettingContainer onPress={() => navigation.navigate('FirstExplain')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <SettingText>서비스 이용약관</SettingText>
          </View>
          <Icon name={'right'} size={15} color={theme.dark010} />
        </SettingContainer>
        <BoundaryContainer />
        <SettingContainer onPress={() => navigation.navigate('SecondExplain')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <SettingText>개인정보처리방침</SettingText>
          </View>
          <Icon name={'right'} size={15} color={theme.dark010} />
        </SettingContainer>
        <BoundaryContainer />
        <Button
          title="로그아웃"
          onPress={_handleLogout}
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
      </InnerContainer>
    </Container>
  );
};

export default Setting;
