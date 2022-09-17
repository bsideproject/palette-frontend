import React, {useContext, useState, useEffect} from 'react';
import {Button} from '@components';
import styled from 'styled-components/native';
import {Image, View, Text, Pressable, TouchableOpacity} from 'react-native';
import {ThemeContext} from 'styled-components/native';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {launchImageLibrary} from 'react-native-image-picker';
import {USE_MUTATION} from '@apolloClient/queries';
import AsyncStorage from '@react-native-community/async-storage';
import {imageUploadApi} from '../../api/restfulAPI';
import {ErrorAlert} from '@components';
import Spinner from 'react-native-loading-spinner-overlay';
import ImageResizer from 'react-native-image-resizer';
import Modal from 'react-native-modal';

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

const SpinnerContainer = styled.Text`
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-family: ${({theme}) => theme.fontRegular};
`;

const ModalContainer = styled.View`
  width: 90%;
  border-radius: 6px;
  height: 157px;
  background: ${({theme}) => theme.fullWhite};
  padding: 15px 0 0 23px;
`;

const ModalTitle = styled.Text`
  font-family: ${({theme}) => theme.fontBold};
  font-weight: 600;
  font-size: 16px;
  color: ${({theme}) => theme.dark010};
  margin-bottom: 20px;
`;

const ModalContents = styled.Text`
  font-size: 16px;
  font-family: ${({theme}) => theme.fontRegular};
  color: ${({theme}) => theme.dark010};
  margin-bottom: 20px;
`;

const DEFAULT_PROFILE = require('/assets/icons/default_profile.png');
const UPLOAD = require('/assets/icons/upload.png');

const ProfileImageSet = ({navigation, route}) => {
  const MB = 1000 * 1000;
  const {params} = route;
  const theme = useContext(ThemeContext);
  const [profileImage, setProfileImage] = useState('');
  const [accessToken, setAccessToken] = useState(null);
  const [uploadImage, setUploadImage] = useState(null);
  const [pass, setPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updateProfile, {data, loading, error}] = USE_MUTATION(
    'UPDATE_PROFILE',
    accessToken,
  );
  const [isSelect, setIsSelect] = useState(false);

  const _handleNextButtonPress = async () => {
    setIsLoading(true);
    if (!!uploadImage) {
      const response = await imageUploadApi(uploadImage, accessToken);
      if (response == 'Error') {
        setIsLoading(false);
        return;
      }
      const {data} = response;
      updateProfile({
        variables: {profileImg: data.urls[0]},
      });
    } else {
      updateProfile({
        variables: {profileImg: ''},
      });
    }
  };

  const _handleDefaultImg = () => {
    setIsSelect(false);
    setIsLoading(true);
    setProfileImage('');
    updateProfile({
      variables: {profileImg: ''},
    });
  };

  const _handleLaunchImageLibrary = () => {
    setIsSelect(false);
    // 사진첩 사진 등록 기능
    const library_options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    };

    launchImageLibrary(library_options, async response => {
      if (response.didCancel) {
        console.log('취소');
      } else if (response.error) {
        alert('에러 발생');
      } else {
        const resize = () => {
          return new Promise((resolve, reject) => {
            ImageResizer.createResizedImage(
              response.assets[0].uri,
              700,
              700,
              'JPEG',
              100,
              0,
            )
              .then(response => {
                resolve(response);
              })
              .catch(err => {
                reject(err);
              });
          });
        };
        if (response.assets[0].fileSize > 3 * MB) {
          await resize().then(
            response => {
              setProfileImage(() => response.uri);
              const photo = new FormData();
              let file = {
                uri: response.uri,
                type: 'image/jpeg',
                name: response.name,
              };
              photo.append('file', file);
              setUploadImage(prevState => photo);
            },
            error => {
              // Handle error
            },
          );
        } else {
          setProfileImage(() => response.assets[0].uri);
          const photo = new FormData();
          let file = {
            uri: response.assets[0].uri,
            type: 'image/jpeg',
            name: response.assets[0].fileName,
          };
          photo.append('file', file);
          setUploadImage(prevState => photo);
        }
      }
    });
  };

  useEffect(() => {
    AsyncStorage.getItem('access_token', (err, result) => {
      setAccessToken(result);
    });
    if (!params) {
      setPass(true);
    }
  }, []);

  useEffect(() => {
    if (uploadImage !== null) {
      setPass(true);
    }
  }, [uploadImage]);

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
      // Not Check Data Is True..
      console.log(data);
      setIsLoading(false);
      if (params) navigation.goBack();
      else navigation.navigate('Joined');
    }
  }, [loading]);

  const ConditionProfileImage = () => {
    return profileImage !== '' ? (
      <ProfileImage source={{uri: profileImage}} />
    ) : params ? (
      <ProfileImage
        source={
          params.profileImg !== '' ? {uri: params.profileImg} : DEFAULT_PROFILE
        }
      />
    ) : (
      <ProfileImage source={DEFAULT_PROFILE} />
    );
  };

  return isLoading ? (
    <SpinnerContainer>
      <Spinner visible={isLoading} textContent={'프로필 설정 중...'} />
    </SpinnerContainer>
  ) : (
    <Container>
      <KeyboardAvoidingScrollView
        containerStyle={{
          backgroundColor: theme.fullWhite,
        }}
        stickyFooter={
          <ButtonContainer pointerEvents={pass ? 'auto' : 'none'}>
            <Button
              title={params ? '확인' : '다음 단계로'}
              onPress={_handleNextButtonPress}
              containerStyle={{
                backgroundColor: pass ? theme.pointColor : theme.dark040,
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
            <UploadProfileImgContainer onPress={() => setIsSelect(true)}>
              <UploadBtnContainer>
                <Image source={UPLOAD} style={{marginRight: 10}} />
                <UploadBtnText>
                  {!!profileImage ? '사진 다시 올리기' : '사진 올리기'}
                </UploadBtnText>
              </UploadBtnContainer>
            </UploadProfileImgContainer>
          </ProfileImageContainer>
        </InnerContainer>
        <Modal
          isVisible={isSelect}
          useNativeDriver={true}
          onRequestClose={() => {
            setIsSelect(false);
          }}
          hideModalContentWhileAnimating={true}>
          <Pressable
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              setIsSelect(false);
            }}>
            <ModalContainer>
              <ModalTitle>프로필 사진</ModalTitle>
              <TouchableOpacity onPress={_handleLaunchImageLibrary}>
                <ModalContents>앨범에서 사진 선택</ModalContents>
              </TouchableOpacity>
              <TouchableOpacity onPress={_handleDefaultImg}>
                <ModalContents>기본 이미지로 설정</ModalContents>
              </TouchableOpacity>
            </ModalContainer>
          </Pressable>
        </Modal>
      </KeyboardAvoidingScrollView>
    </Container>
  );
};

export default ProfileImageSet;
