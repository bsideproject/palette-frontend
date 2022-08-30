import React, {useContext, useState, useEffect, useRef} from 'react';
import styled from 'styled-components/native';
import {View, TouchableOpacity, Text} from 'react-native';
import {ThemeContext} from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import Modal from 'react-native-modal';
import axios from 'axios';
import {UserContext} from '@contexts';

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
  const {user} = useContext(UserContext);
  const theme = useContext(ThemeContext);
  const [uploadImage, setUploadImage] = useState(null);
  const [imageArr, setImageArr] = useState([]);
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

  // const usePrevState = state => {
  //   const ref = useRef(state);
  //   useEffect(() => {
  //     ref.current = state;
  //   }, [state]);
  //   return ref.current;
  // };
  // const prev = usePrevState(imageArr);
  // useEffect(() => {
  //   console.log('1', imageArr.length);
  //   console.log('2', prev.length);
  //   if (imageArr.length < prev.length) {
  //     const photo = new FormData();
  //     imageArr.map((res, i) => {
  //       let file = {
  //         uri: res,
  //         type: 'image/jpeg',
  //         name: `remainImage${i}.jpg`,
  //       };
  //       photo.append('file', file);
  //       if (i + 1 === imageArr.length) {
  //         console.log('3', i);
  //         console.log('4', imageArr.length);
  //         setUploadImage(prev => photo);
  //         return;
  //       }
  //     });
  //   }
  // }, [imageArr]);

  useEffect(() => {
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
  }, [titleText, contentText, imageArr]);

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

  const _handlerExit = () => {
    setExitModalVisible(false);
    setIsExit(true);
  };

  const openPicker = async () => {
    try {
      const response = await MultipleImagePicker.openPicker({
        usedCameraButton: false,
        mediaType: 'image',
        maxSelectedAssets: 3,
        isExportThumbnail: true,
      });

      console.log('response: ', response);
      const photo = new FormData();
      response.map((res, i) => {
        const file = {
          uri: res.path,
          type: 'image/jpeg',
          name: res.fileName,
        };
        photo.append('file', file);
        if (i + 1 === response.length) {
          setUploadImage(photo);
        }
        setImageArr(prevState => [...prevState, res.path]);
      });
    } catch (e) {
      console.log(e.code, e.message);
    }
  };

  const _handleDeleteImage = url => {
    const photo = new FormData();
    imageArr.map((arrUrl, i) => {
      if (arrUrl !== url) {
        const file = {
          uri: arrUrl,
          type: 'image/jpeg',
          name: `remain${i}.jpg`,
        };
        photo.append('file', file);
      }
    });
    setUploadImage(prev => photo);
    setImageArr(prevState => prevState.filter(state => state !== url));
    //uploadimage formdata 삭제 기능 예정
  };

  const SelectedImage = () => {
    return imageArr.map((image, i) => (
      <View style={{position: 'relative'}} key={i}>
        <SubUploadImage source={{uri: image}} />
        <TouchableOpacity onPress={() => _handleDeleteImage(image, i)}>
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

  const _handleSave = async () => {
    if (titleText.length === 0) {
      setTitleError(true);
    } else if (contentText.length === 0) {
      setContentError(true);
    } else {
      //저장 기능 작성;
      if (imageArr.length > 0) {
        console.log('이미지 업로드', JSON.stringify(uploadImage));
        //사진 업로드 한 경우
        await axios
          .post('http://61.97.190.252:8080/api/v1/upload', uploadImage, {
            headers: {
              authorization: `Bearer ${user.accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(response => {
            //일기 이미지 저장 완료
            console.log('result=======>', response.data.urls);

            //일기 저장 api연동 예정
          })
          .catch(error => {
            const errorData = JSON.parse(JSON.stringify(error));
            console.log('diary image upload api error', errorData.status);
          })
          .then(() => {
            console.log('dariay image upload api 실행 완료');
          });
      } else {
        //사진 업로드 하지 않은 경우
        //일기 저장 api연동 예정
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
        {imageArr.length === 0 && (
          <UploadImageContainer onPress={openPicker}>
            <UploadImageDefault source={IMG_DEFAULT} />
            <UploadImageText>사진 업로드</UploadImageText>
            <PlusIconContainer>
              <PlusIcon source={PLUS_ICON} />
            </PlusIconContainer>
          </UploadImageContainer>
        )}
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
