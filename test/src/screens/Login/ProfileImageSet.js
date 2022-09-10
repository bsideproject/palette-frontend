import React, {useContext, useState, useEffect} from 'react';
import {Button} from '@components';
import styled from 'styled-components/native';
import {Image} from 'react-native';
import {ThemeContext} from 'styled-components/native';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {USE_MUTATION} from '@apolloClient/queries';
import AsyncStorage from '@react-native-community/async-storage';
import {imageUploadApi} from '../../api/restfulAPI';

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

const PROFILEIMG_DEFAULT = require('/assets/icons/set_profileImg.png');
const UPLOAD = require('/assets/icons/upload.png');

const ProfileImageSet = ({navigation, route}) => {
  const {params} = route;
  const theme = useContext(ThemeContext);
  const [profileImage, setProfileImage] = useState('');
  const [accessToken, setAccessToken] = useState(null);
  const [uploadImage, setUploadImage] = useState(null);
  const [updateProfile, updateResult] = USE_MUTATION(
    'UPDATE_PROFILE',
    accessToken,
  );

  const _handleNextButtonPress = async () => {
    if (!!uploadImage) {
      const response = await imageUploadApi(uploadImage, accessToken);
      const {data} = response;
      //유저 프로필 이미지 업로드
      updateProfile({
        variables: {profileImg: data.urls[0]},
      });

      if (params) navigation.goBack();
      else navigation.navigate('Joined');
    } else {
      //등록 프로필 이미지 없는 경우
      if (params) navigation.goBack();
      else navigation.navigate('Joined');
    }
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
        setProfileImage(() => response.assets[0].uri);
        const photo = new FormData();
        let file = {
          uri: response.assets[0].uri,
          type: response.assets[0].type,
          name: response.assets[0].fileName,
        };
        photo.append('file', file);
        setUploadImage(prevState => photo);
      }
    });
  };

  useEffect(() => {
    AsyncStorage.getItem('access_token', (err, result) => {
      setAccessToken(result);
    });
  }, []);

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
              title={params ? '확인' : '다음 단계로'}
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
