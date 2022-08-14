import React, {useContext, useState, useEffect} from 'react';
import {Button, UploadModal} from '../components';
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

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.background};
  flex-direction: column;
`;

const InnerContainer = styled.View`
  padding: 0 16px;
`;

const TitleContainer = styled.View`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  border-bottom-color: #eeeeee;
  border-bottom-width: 1px;
  width: 100%;
  height: 60px;
  padding: 0 24px;
`;

const TitleText = styled.Text`
  font-family: ${({theme}) => theme.fontBold};
  font-size: 16px;
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
  background-color: #eeeeee;
  border-radius: 6px;
  padding: 0 30px;
`;

const UploadProfileImgContainer = styled.TouchableOpacity`
  border: 1px solid #0b2838;
  border-radius: 6px;
  background-color: #ffffff;
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
  background-color: ${({theme}) => theme.background};
  width: 140px;
  height: 140px;
  border-radius: 70px;
`;

const PROFILEIMG_DEFAULT = require('../../assets/icons/profileimg_default.png');
const UPLOAD = require('../../assets/icons/upload.png');

const ProfileImageSet = ({navigation, route}) => {
  const theme = useContext(ThemeContext);
  const [profileImage, setProfileImage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const _handleNextButtonPress = () => {
    navigation.navigate('Joined', route.params);
  };

  const _handleUploadProfileImg = () => {};

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

  const _handleLaunchCamera = () => {
    // 카메라 기능
    const camera_options = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
    };

    launchCamera(camera_options, response => {
      if (response.didCancel) {
        console.log('취소');
      } else if (response.error) {
        alert('에러 발생');
      } else {
        console.log('카메라 결과물 ===> ', response);
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  const modalOpen = () => {
    if (Platform.OS === 'android') {
      //android
      setModalVisible(true);
    } else {
      //ios
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['카메라로 촬영하기', '사진 선택하기', '취소'],
          cancelButtonIndex: 2,
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            _handleLaunchCamera();
          } else if (buttonIndex === 1) {
            _handleLaunchImageLibrary();
          }
        },
      );
    }
  };

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
        stickyFooter={
          <ButtonContainer>
            <Button
              title="다음 단계로"
              onPress={_handleNextButtonPress}
              containerStyle={{
                backgroundColor: theme.btnMainColorBg,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              textStyle={{
                color: theme.btnWhiteFont,
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
        <TitleContainer>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name={'left'} size={15} color={'black'} />
          </TouchableOpacity>
          <TitleText>프로필 사진 설정</TitleText>
          <TouchableOpacity>
            <Icon name={'close'} size={15} color={'black'} />
          </TouchableOpacity>
        </TitleContainer>
        <InnerContainer>
          <SubTitleText>사용하실 프로필 사진을 설정해주세요!</SubTitleText>
          <ProfileImageContainer>
            <ConditionProfileImage />
            <UploadProfileImgContainer onPress={modalOpen}>
              {/* <UploadProfileImgContainer onPress={_handleUploadProfileImg}> */}
              <UploadBtnContainer>
                <Image source={UPLOAD} style={{marginRight: 10}} />
                <UploadBtnText>사진 올리기</UploadBtnText>
              </UploadBtnContainer>
            </UploadProfileImgContainer>
          </ProfileImageContainer>
          <UploadModal
            visible={modalVisible}
            onClose={() => {
              setModalVisible(false);
            }}
            onLaunchCamera={_handleLaunchCamera}
            onLaunchImageLibrary={_handleLaunchImageLibrary}
          />
        </InnerContainer>
      </KeyboardAvoidingScrollView>
    </Container>
  );
};

export default ProfileImageSet;
