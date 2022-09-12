import React, {useContext, useEffect, useState} from 'react';
import {ThemeContext} from 'styled-components/native';
import {UserContext} from '@contexts';
import styled from 'styled-components/native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';
import {USE_MUTATION, USE_QUERY} from '@apolloClient/queries';
import {TouchableOpacity} from 'react-native';
import {delUserApi} from '../api/restfulAPI';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';
import {ErrorAlert} from '@components';

const getCreateTime = time => {
  const date = new Date(time);
  return (
    date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate()
  );
};

// Spinner
const SpinnerContainer = styled.Text`
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-family: ${({theme}) => theme.fontRegular};
`;

let createTime;
const UserInfo = ({navigation}) => {
  const {user, setUser} = useContext(UserContext);
  const theme = useContext(ThemeContext);
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('프로필 불러오는 중...');
  const [
    deleteFcmToken,
    {loading: loadingFCM, error: errorFCM, data: dataFCM},
  ] = USE_MUTATION('DELETE_FCM_TOKEN', user.accessToken);
  const {loading, error, data, refetch} = USE_QUERY(
    'GET_PROFILE',
    user.accessToken,
  );

  useEffect(() => {
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
      console.log('DATA', data);
      // If Success
      createTime = data.myProfile.createdAt;
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
  }, [loading]);

  useEffect(() => {
    if (errorFCM != undefined) {
      let jsonData = JSON.parse(JSON.stringify(errorFCM));
      console.log(jsonData);
      setIsLoading(false);
      ErrorAlert();
    } else {
      if (loadingFCM || dataFCM == undefined) {
        console.log('Data Fecting & Data Empty');
        return;
      }
      console.log('FCM Data', dataFCM);
      AsyncStorage.removeItem('refresh_token');
      AsyncStorage.removeItem('access_token');
      AsyncStorage.removeItem('email');
      AsyncStorage.removeItem('social_type');
      AsyncStorage.removeItem('fcmtoken');
      setUser({
        accessToken: null,
        email: null,
        nickname: null,
        profileImg: null,
        socialTypes: null,
        pushEnabled: null,
      });
      setIsLoading(false);
    }
  }, [loadingFCM]);

  const _handleDeleteFcmToken = () => {
    AsyncStorage.getItem('fcmtoken', (err, result) => {
      deleteFcmToken({
        variables: {
          token: result,
        },
      });
    });
  };

  const _handleDelUser = async () => {
    setIsLoading(true);
    setLoadingMessage('탈퇴 진행 중...');
    await delUserApi(user.accessToken);
    _handleDeleteFcmToken();
  };

  return isLoading ? (
    <SpinnerContainer>
      <Spinner visible={isLoading} textContent={loadingMessage} />
    </SpinnerContainer>
  ) : (
    <Container>
      <UserInfoContainer>
        <UserInfoTitle>가입일자</UserInfoTitle>
        <UserInfoText>{createTime && getCreateTime(createTime)}</UserInfoText>
      </UserInfoContainer>
      <UserInfoContainer>
        <UserInfoTitle>이메일</UserInfoTitle>
        <UserInfoText>{user.email}</UserInfoText>
      </UserInfoContainer>
      <UserInfoContainer>
        <UserInfoTitle>가입방법</UserInfoTitle>
        <UserInfoText>
          {user.socialTypes[0] === 'KAKAO' ? '카카오' : '네이버'}
          {user.socialTypes[1] === 'KAKAO'
            ? ', 카카오'
            : user.socialTypes[1] === 'NAVER'
            ? ', 네이버'
            : ''}
        </UserInfoText>
      </UserInfoContainer>
      <DeleteUserText onPress={() => setExitModalVisible(true)}>
        탈퇴하기
      </DeleteUserText>

      <Modal
        isVisible={exitModalVisible}
        useNativeDriver={true}
        onRequestClose={() => setExitModalVisible(false)}
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
              onPress={() => setExitModalVisible(false)}
              style={{marginRight: '5%', marginTop: 10}}>
              <Icon
                name={'close'}
                size={20}
                color={theme.dark010}
                style={{justifyContent: 'center'}}
              />
            </TouchableOpacity>
          </ExitModalTop>
          <ExitModalMid>
            <ExitModalTxt1>정말로 탈퇴 하시겠습니까?</ExitModalTxt1>
            <ExitModalMargin />
            <ExitModalTxt2>탈퇴 시, 데이터가 삭제되며</ExitModalTxt2>
            <ExitModalTxt2>삭제된 데이터는 복구할 수 없습니다.</ExitModalTxt2>
            <ExitModalTxt2>
              또한, 탈퇴한 아이디로는 재 가입 할 수 없습니다.
            </ExitModalTxt2>
          </ExitModalMid>
          <ExitModalBottom onPress={_handleDelUser}>
            <ExitModalTxt3>예, 탈퇴 합니다.</ExitModalTxt3>
          </ExitModalBottom>
        </ExitModalContainer>
      </Modal>
    </Container>
  );
};

export default UserInfo;

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.fullWhite};
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const UserInfoContainer = styled.View`
  display: flex;
  flex-direction: row;
  padding: 20px 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.light020};
`;

const UserInfoTitle = styled.Text`
  font-family: ${({theme}) => theme.fontBold};
  font-size: 16px;
  flex: 1;
`;

const UserInfoText = styled.Text`
  font-family: ${({theme}) => theme.fontRegular};
  font-size: 16px;
  flex: 3;
`;

const DeleteUserText = styled.Text`
  font-size: 16px;
  text-decoration: underline;
  color: ${({theme}) => theme.dark040};
  position: absolute;
  bottom: 26px;
  left: 45%;
`;

const ExitModalContainer = styled.View`
  flex-direction: column;
  background-color: ${({theme}) => theme.white};
  shadow-offset: 0px 2px;
  shadow-radius: 8px;
  shadow-color: rgba(0, 0, 0, 0.16);
  border-radius: 16px;
  width: 100%;
  height: 30%;
`;

const ExitModalTop = styled.View`
  flex: 2;
  justify-content: flex-end;
  align-items: flex-end;
`;

const ExitModalMid = styled.View`
  flex: 7;
  align-items: center;
`;

const ExitModalBottom = styled.TouchableOpacity`
  flex: 3;
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

const ExitModalTxt2 = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: ${({theme}) => theme.dark020};
  font-family: ${({theme}) => theme.fontRegular};
`;

const ExitModalTxt3 = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${({theme}) => theme.white};
  font-family: ${({theme}) => theme.fontRegular};
`;

const ExitModalMargin = styled.View`
  margin-top: 5%;
`;
