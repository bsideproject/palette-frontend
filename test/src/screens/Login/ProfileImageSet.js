import React, {useContext, useState, useEffect} from 'react';
import {Button} from '@components';
import styled from 'styled-components/native';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  Alert,
  Platform,
  ActionSheetIOS,
} from 'react-native';
import {ThemeContext} from 'styled-components/native';
import Icon from 'react-native-vector-icons/AntDesign';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useMutation} from '@apollo/client';
import {UPDATE_PROFILE} from '@apolloClient/queries';
import AsyncStorage from '@react-native-community/async-storage';

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.fullWhite};
  flex-direction: column;
`;

const InnerContainer = styled.View`
  padding: 0 16px;
`;

const SubTitleText = styled.Text`
  font-family: ${({theme}) => theme.fontRegular};
  font-size: 20px;
  margin-top: 32px;
  margin-bottom: 30px;
`;

const ButtonContainer = styled.View`
  padding: 0 16px;
  margin-bottom: 106px;
`;

const ProfileImageContainer = styled.View`
  align-items: center;
  width: 100%;
  height: 310px;
  background-color: ${({theme}) => theme.light010};
  border-radius: 6px;
  padding: 0 30px;
`;

const UploadProfileImgContainer = styled.TouchableOpacity`
  border: 1px solid #0b2838;
  border-radius: 6px;
  background-color: ${({theme}) => theme.fullWhite};
  width: 100%;
  height: 50px;
  margin-top: 36px;
`;

const UploadBtnContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
`;

const UploadBtnText = styled.Text`
  font-family: ${({theme}) => theme.fontBold};
  font-size: 15px;
`;

const ProfileImage = styled.Image`
  margin-top: 44px;
  background-color: ${({theme}) => theme.fullWhite};
  width: 140px;
  height: 140px;
  border-radius: 70px;
`;

const PROFILEIMG_DEFAULT = require('/assets/icons/profileimg_default.png');
const UPLOAD = require('/assets/icons/upload.png');

const ProfileImageSet = ({navigation}) => {
  const theme = useContext(ThemeContext);
  const [profileImage, setProfileImage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [updateProfile, updateResult] = useMutation(UPDATE_PROFILE, {
    context: {
      headers: {
        authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  });

  const _handleNextButtonPress = () => {
    // 추후 예정작업 이미지 업로드api response 값 = url
    // updateProfile({
    //   variables: {profileImg: "url"},
    // });
    navigation.navigate('Joined');
  };

  const _handleLaunchImageLibrary = () => {
    // 사진첩 사진 등록 기능
    const library_options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    };

    launchImageLibrary(library_options, response => {
      if (response.didCancel) {
        console.log('취소');
      } else if (response.error) {
        alert('에러 발생');
      } else {
        console.log('사진첩 결과물 ===> ', response);
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  useEffect(() => {
    AsyncStorage.getItem('access_token', (err, result) => {
      setAccessToken(result);
    });
  }, []);

  useEffect(() => {
    if (!!updateResult.data) {
      console.log(
        'UPDATE_PROFILE GRAPHQL RESULT DATA 프로필설정',
        updateResult.data,
      );
    }
  }, [updateResult]);

  const ConditionProfileImage = () => {
    return profileImage !== '' ? (
      <ProfileImage source={{uri: profileImage}} />
    ) : (
      <ProfileImage source={PROFILEIMG_DEFAULT} />
    );
  };

  return (
    <Container>
      <KeyboardAvoidingScrollView
        containerStyle={{
          backgroundColor: theme.fullWhite,
        }}
        stickyFooter={
          <ButtonContainer>
            <Button
              title="다음 단계로"
              onPress={_handleNextButtonPress}
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
          </ButtonContainer>
        }>
        <InnerContainer>
          <SubTitleText>사용하실 프로필 사진을 설정해주세요!</SubTitleText>
          <ProfileImageContainer>
            <ConditionProfileImage />
            <UploadProfileImgContainer
              onPress={() => _handleLaunchImageLibrary()}>
              <UploadBtnContainer>
                <Image source={UPLOAD} style={{marginRight: 10}} />
                <UploadBtnText>
                  {!!profileImage ? '사진 다시 올리기' : '사진 올리기'}
                </UploadBtnText>
              </UploadBtnContainer>
            </UploadProfileImgContainer>
          </ProfileImageContainer>
        </InnerContainer>
      </KeyboardAvoidingScrollView>
    </Container>
  );
};

export default ProfileImageSet;
