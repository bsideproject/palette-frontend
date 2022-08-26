import React, {useContext, useState, useEffect, useReducer} from 'react';
import {UploadModal} from '@components';
import styled from 'styled-components/native';
import {
  View,
  Platform,
  ActionSheetIOS,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import {ThemeContext} from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather';
// import Icon from 'react-native-vector-icons/AntDesign';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import Modal from 'react-native-modal';

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.fullWhite};
  flex-direction: column;
`;

const InnerContainer = styled.View`
  padding: 17px 16px 0 16px;
`;

const DiaryTitle = styled.TextInput.attrs(({theme, isError}) => ({
  placeholderTextColor: isError ? theme.dark030 : theme.error,
}))`
  height: 40px;
  border: 1px solid
    ${props =>
      props.isError ? ({theme}) => theme.light020 : ({theme}) => theme.error};
  border-radius: 6px;
  margin-bottom: 15px;
  margin-top: 44px;
  text-align: center;
  font-weight: bold;
`;

const DiaryContent = styled.TextInput.attrs(({theme, isError}) => ({
  placeholderTextColor: isError ? theme.dark030 : theme.error,
}))`
  height: ${props => (props.isImage > 0 ? '400px' : '170px')};
  border: 1px solid
    ${props =>
      props.isError ? ({theme}) => theme.light020 : ({theme}) => theme.error};
  border-radius: 6px;
  text-align-vertical: top;
  padding-left: 12px;
`;

const PlusIcon = styled.Image`
  width: 20px;
  height: 20px;
`;

const CloseIcon = styled.Image`
  width: 17px;
  height: 17px;
  position: absolute;
  right: 5px;
  bottom: -5px;
`;

const SubUploadImageContainer = styled.View`
  flex-direction: row;
  margin-bottom: 11px;
`;

const SubUploadImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 6px;
  margin-right: 9px;
`;

const UploadImageContainer = styled.TouchableOpacity`
  align-items: center;
  width: 100%;
  height: 310px;
  background-color: ${({theme}) => theme.light010};
  border-radius: 6px;
  padding: 0 30px;
`;

const UploadImageText = styled.Text`
  font-family: ${({theme}) => theme.fontRegular};
  font-size: 18px;
  color: #777777;
`;

const UploadImageDefault = styled.Image`
  margin-top: 80px;
  margin-bottom: 11px;
  width: 50px;
  height: 50px;
`;

const PlusIconContainer = styled.View`
  border: 2px solid #c7c7c7;
  border-radius: 50px;
  padding: 11px;
  margin-top: 30px;
`;

const ModalTxt = styled.View`
  flex: 3;
  margin-left: 5%;
`;

const ModalIcon = styled.View`
  flex: 1;
  align-items: flex-end;
  margin-right: 5%;
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

const IMG_DEFAULT = require('/assets/icons/set_diaryImg.png');
const PLUS_ICON = require('/assets/icons/plus.png');
const CLOSE_ICON = require('/assets/icons/close_circle.png');

const WriteDiary = ({navigation, route}) => {
  const theme = useContext(ThemeContext);
  const [imageArr, setImageArr] = useState([]);
  const [uploadImage, setUploadImage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [isExit, setIsExit] = useState(false);
  const [titlePlaceholder, setTitlePlaceholder] =
    useState('제목을 써보세요! (최대 12자)');
  const [titleError, setTitleError] = useState(false);
  const [contentPlaceholder, setContentPlaceholder] = useState(
    '일기 내용을 써보세요! (최대 500자)',
  );
  const [contentError, setContentError] = useState(false);
  const [titleText, setTitleText] = useState('');
  const [contentText, setContentText] = useState('');

  navigation.setOptions({
    headerLeft: () => (
      <TouchableOpacity onPress={_handleBackPage}>
        <Icon
          name={'arrow-left'}
          size={24}
          color={'black'}
          style={{marginLeft: 14}}
        />
      </TouchableOpacity>
    ),
    headerRight: () => (
      <TouchableOpacity onPress={_handleSave}>
        <Text style={{marginRight: 18, color: theme.success}}>저장</Text>
      </TouchableOpacity>
    ),
  });

  useEffect(() => {
    if (isExit) {
      navigation.goBack();
    }
  }, [isExit]);

  useEffect(() => {
    if (titleError) {
      setTitlePlaceholder('제목을 작성해 주세요!');
    }
  }, [titleError]);

  useEffect(() => {
    if (contentError) {
      setContentPlaceholder('내용을 작성해 주세요!');
    }
  }, [contentError]);

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
        setUploadImage(response.assets[0].uri);
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
        setUploadImage(response.assets[0].uri);
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

  const _handlerExit = () => {
    setExitModalVisible(false);
    setIsExit(true);
  };

  const openPicker = async () => {
    try {
      const response = await MultipleImagePicker.openPicker({
        mediaType: 'image',
        usedCameraButton: true,
        maxSelectedAssets: 3,
        isExportThumbnail: true,
      });

      console.log('response: ', response);
      setUploadImage(response[0].path);
      response.map((res, i) => {
        setImageArr(prevState => [...prevState, res.path]);
      });
    } catch (e) {
      console.log(e.code, e.message);
    }
  };

  const _handleDeleteImage = url => {
    setImageArr(prevState => prevState.filter(state => state !== url));
  };

  const SelectedImage = () => {
    return imageArr.map((image, i) => (
      <View style={{position: 'relative'}} key={i}>
        <SubUploadImage source={{uri: image}} />
        <TouchableOpacity onPress={() => _handleDeleteImage(image)}>
          <CloseIcon source={CLOSE_ICON} />
        </TouchableOpacity>
      </View>
    ));
  };

  const _handleBackPage = () => {
    if (imageArr.length > 0 || titleText.length > 0 || contentText.length > 0) {
      setExitModalVisible(true);
    } else {
      navigation.goBack();
    }
  };

  const _handleSave = () => {
    if (titleText.length === 0) {
      alert('제목입력해주세요');
      setTitleError(true);
    } else if (contentText.length === 0) {
      alert('내용 입력해주세요.');
      setContentError(true);
    } else {
      alert('저장 완료');
      if (imageArr.length > 0) {
        //사진 업로드 한 경우
      } else {
        //사진 업로드 하지 않은 경우
      }
    }
  };

  const _blurTitle = () => {
    if (titleText.length === 0) {
      setTitleError(true);
    } else {
      setTitleError(false);
    }
  };

  const _blurContent = () => {
    if (contentText.length === 0) {
      setContentError(true);
    } else {
      setContentError(false);
    }
  };

  return (
    <Container>
      <InnerContainer>
        {imageArr.length > 0 && (
          <SubUploadImageContainer>
            <SelectedImage />
          </SubUploadImageContainer>
        )}
        {
          imageArr.length === 0 && (
            <UploadImageContainer onPress={openPicker}>
              <UploadImageDefault source={IMG_DEFAULT} />
              <UploadImageText>사진 업로드</UploadImageText>
              <PlusIconContainer>
                <PlusIcon source={PLUS_ICON} />
              </PlusIconContainer>
            </UploadImageContainer>
          )
          //  <UploadImageContainer onPress={modalOpen}>
        }
        {/* <UploadModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onLaunchCamera={_handleLaunchCamera}
          onLaunchImageLibrary={_handleLaunchImageLibrary}
        /> */}
        <DiaryTitle
          maxLength={12}
          placeholder={titlePlaceholder}
          isError={!titleError}
          onBlur={_blurTitle}
          onChangeText={newText => setTitleText(newText)}
          defaultValue={titleText}
        />
        <DiaryContent
          maxLength={500}
          placeholder={contentPlaceholder}
          isError={!contentError}
          isImage={imageArr.length}
          onBlur={_blurContent}
          onChangeText={newText => setContentText(newText)}
          defaultValue={contentText}
        />
      </InnerContainer>

      {/* Exit Modal */}
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
              style={{marginRight: '5%'}}>
              <Icon
                name={'x'}
                size={20}
                color={theme.dark010}
                style={{justifyContent: 'center'}}
              />
            </TouchableOpacity>
          </ExitModalTop>
          <ExitModalMid>
            <ExitModalTxt1>정말로 나가시겠습니까?</ExitModalTxt1>
            <ExitModalMargin />
            <ExitModalTxt2>
              나간 일기장은 다시 들어올 수 없습니다!
            </ExitModalTxt2>
          </ExitModalMid>
          <ExitModalBottom onPress={_handlerExit}>
            <ExitModalTxt3>네, 일기장을 나갑니다.</ExitModalTxt3>
          </ExitModalBottom>
        </ExitModalContainer>
      </Modal>
    </Container>
  );
};

export default WriteDiary;
