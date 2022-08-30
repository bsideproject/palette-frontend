import React, {useContext} from 'react';
import {ThemeContext} from 'styled-components/native';
import styled from 'styled-components/native';
import {Button} from '@components';
import Icon from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {UserContext} from '@contexts';
import {View} from 'react-native';

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

const PROFILE_DEFAULT = require('/assets/icons/default_profile.png');

const Setting = ({navigation}) => {
  const theme = useContext(ThemeContext);
  const {setUser, user} = useContext(UserContext);
  const [deleteFcmToken, deleteFcmTokenResult] = USE_MUTATION(
    'DELETE_FCM_TOKEN',
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

  const _handleLogout = () => {
    //로그아웃 함수
    AsyncStorage.getItem('refresh_token', async (err, result) => {
      if (!!result) {
        await axios
          .get('http://61.97.190.252:8080/api/v1/logout', {
            headers: {
              Cookie: result,
            },
          })
          .then(response => {
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
            });
          })
          .catch(error => {
            console.log('logout api error', JSON.stringify(error));
          })
          .then(() => {
            console.log('logout api 실행 완료');
          });
      }
    });
  };

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
            <SettingText>공지사항</SettingText>
          </View>
          <Icon name={'right'} size={15} color={theme.dark010} />
        </SettingContainer>
        <BoundaryContainer />
        <SettingContainer>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <SettingText>버전</SettingText>
          </View>
          <Icon name={'right'} size={15} color={theme.dark010} />
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
