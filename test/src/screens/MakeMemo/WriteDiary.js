import React, {useContext, useState, useEffect} from 'react';
import styled from 'styled-components/native';
import {View, TouchableOpacity, Text} from 'react-native';
import {ThemeContext} from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import Modal from 'react-native-modal';
import {UserContext} from '@contexts';
import {launchCamera} from 'react-native-image-picker';
import {UploadModal} from '@components';
import {imageUploadApi, imageDeleteApi} from '../../api/restfulAPI';
import {USE_MUTATION} from '@apolloClient/queries';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ErrorAlert} from '@components';
import Spinner from 'react-native-loading-spinner-overlay';
import ImageResizer from 'react-native-image-resizer';
import {Flow} from 'react-native-animated-spinkit';

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
  color: ${({theme}) => theme.dark010};
`;

const DiaryContent = styled.TextInput.attrs(({theme, isError}) => ({
  placeholderTextColor: isError ? theme.dark030 : theme.error,
}))`
  height: ${props => (props.isImage === 0 ? '170px' : '400px')};
  border: 1px solid
    ${props =>
      props.isError ? ({theme}) => theme.light020 : ({theme}) => theme.error};
  border-radius: 6px;
  text-align-vertical: top;
  padding-left: 12px;
  color: ${({theme}) => theme.dark010};
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
  flex: 4;
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

const SpinnerContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-family: ${({theme}) => theme.fontRegular};
`;

const IMG_DEFAULT = require('/assets/icons/set_diaryImg.png');
const PLUS_ICON = require('/assets/icons/plus.png');
const CLOSE_ICON = require('/assets/icons/close_circle.png');

let params;
const WriteDiary = ({navigation, route}) => {
  const MB = 1000 * 1000;
  const {user} = useContext(UserContext);
  const theme = useContext(ThemeContext);
  const [uploadImage, setUploadImage] = useState(null);
  const [imageArr, setImageArr] = useState([]);
  const [delImageArr, setDelImageArr] = useState([]);
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [titlePlaceholder, setTitlePlaceholder] =
    useState('제목을 써보세요! (최대 12자)');
  const [titleError, setTitleError] = useState(false);
  const [contentPlaceholder, setContentPlaceholder] = useState(
    '일기 내용을 써보세요! (최대 500자)',
  );
  const [contentError, setContentError] = useState(false);
  const [titleText, setTitleText] = useState('');
  const [contentText, setContentText] = useState('');
  const [selectModal, setSelectModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [
    createPage,
    {loading: loadingCreate, error: errorCreate, data: dataCreate},
  ] = USE_MUTATION('CREATE_PAGE', user.accessToken);
  const [editPage, {loading: loadingEdit, error: errorEdit, data: dataEdit}] =
    USE_MUTATION('EDIT_PAGE', user.accessToken);

  // [USE EFFECT] -----------------------------------------------
  useEffect(() => {
    if (route.params) {
      params = route.params;
      if (params.mode === 'edit') {
        setTitleText(params.title);
        setContentText(params.contents);
        setImageArr(params.imgUrl);
      }
    } else {
      params = null;
    }
  }, []);

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
        <TouchableOpacity onPress={!isLoading ? _handleSave : null} on>
          <Text style={{marginRight: 18, color: theme.success}}>저장</Text>
        </TouchableOpacity>
      ),
    });
  }, [titleText, contentText, imageArr, isLoading]);

  useEffect(() => {
    if (errorCreate != undefined) {
      let jsonData = JSON.parse(JSON.stringify(errorCreate));
      console.log(jsonData);
      setIsLoading(false);
      ErrorAlert();
    } else {
      if (loadingCreate || dataCreate == undefined) {
        console.log('Data Fecting & Data Empty');
        return;
      }
      // If Success
      setIsLoading(false);
      console.log(dataCreate);
      navigation.goBack();
    }
  }, [loadingCreate]);

  useEffect(() => {
    if (errorEdit != undefined) {
      let jsonData = JSON.parse(JSON.stringify(errorEdit));
      console.log(jsonData);
      setIsLoading(false);
      ErrorAlert();
    } else {
      if (loadingEdit || dataEdit == undefined) {
        console.log('Data Fecting & Data Empty');
        return;
      }
      // If Success
      setIsLoading(false);
      console.log(dataEdit);
      navigation.pop(2);
    }
  }, [loadingEdit]);

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
    navigation.goBack();
  };

  const openPicker = async () => {
    try {
      const response = await MultipleImagePicker.openPicker({
        usedCameraButton: false,
        mediaType: 'image',
        maxSelectedAssets: 3,
        isExportThumbnail: true,
      });
      const resize = uri => {
        return new Promise((resolve, reject) => {
          ImageResizer.createResizedImage(uri, 500, 500, 'JPEG', 90, 0)
            .then(response => {
              resolve(response);
            })
            .catch(err => {
              reject(err);
            });
        });
      };
      const photo = new FormData();
      response.map(async (res, i) => {
        if (res.size > 3 * MB) {
          await resize(res.path).then(resize_response => {
            const file = {
              uri: resize_response.uri,
              type: 'image/jpeg',
              name: resize_response.name,
            };
            photo.append('file', file);
            if (i + 1 === response.length) {
              setUploadImage(photo);
            }
            setImageArr(prevState => [...prevState, resize_response.uri]);
          });
        } else {
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
        }
      });
    } catch (e) {
      console.log(e.code, e.message);
    }
  };

  const _handleLaunchCamera = () => {
    // 카메라 기능
    const camera_options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: true,
      cameraType: 'back',
    };

    launchCamera(camera_options, async response => {
      if (response.didCancel) {
        console.log('취소');
      } else if (response.error) {
        alert('에러 발생');
        ImageResizer;
      } else {
        const resize = () => {
          return new Promise((resolve, reject) => {
            ImageResizer.createResizedImage(
              response.assets[0].uri,
              500,
              500,
              'JPEG',
              90,
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
              const photo = new FormData();
              let file = {
                uri: response.uri,
                type: 'image/jpeg',
                name: response.name,
              };
              photo.append('file', file);
              setUploadImage(prevState => photo);
              setImageArr(prevState => [...prevState, response.uri]);
            },
            error => {
              // Handle error
            },
          );
        } else {
          const photo = new FormData();
          let file = {
            uri: response.assets[0].uri,
            type: 'image/jpeg',
            name: response.assets[0].fileName,
          };
          photo.append('file', file);
          setUploadImage(prevState => photo);
          setImageArr(prevState => [...prevState, response.assets[0].uri]);
        }
      }
    });
  };

  const _handleDeleteImage = async url => {
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

    if (url.includes('palette') === true) {
      setDelImageArr(prev => [...prev, url]);
    }
    if (imageArr.length === 1) {
      console.log('uploadImage null');
      setUploadImage(null);
    } else {
      console.log('uploadImage not null');
      setUploadImage(prev => photo);
    }
    setImageArr(prevState => prevState.filter(state => state !== url));
  };

  const SelectedImage = () => {
    return imageArr.map((image, i) => (
      <View style={{position: 'relative'}} key={i}>
        <SubUploadImage source={{uri: image}} resizeMethod={'resize'} />
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
      setIsLoading(true);
      if (uploadImage !== null) {
        const response = await imageUploadApi(uploadImage, user.accessToken);
        if (response == 'Error') {
          setIsLoading(false);
          return;
        }
        if (params.mode === 'edit') {
          setLoadingMessage('일기장 수정 중...');
          if (delImageArr.length > 0) {
            const response = await imageDeleteApi(delImageArr);
            if (response == 'Error') {
              setIsLoading(false);
              return;
            }
          }
          editPage({
            variables: {
              pageId: params.pageId,
              title: titleText,
              body: contentText,
              imageUrls: response.data.urls,
            },
          });
        } else {
          setLoadingMessage('일기장 생성 중...');
          createPage({
            variables: {
              title: titleText,
              body: contentText,
              historyId: params.historyId,
              imageUrls: response.data.urls,
            },
          });
        }
      } else {
        if (params.mode === 'edit') {
          setLoadingMessage('일기장 수정 중...');
          if (delImageArr.length > 0) {
            const response = await imageDeleteApi(delImageArr);
            if (response == 'Error') {
              setIsLoading(false);
              return;
            }
            editPage({
              variables: {
                pageId: params.pageId,
                title: titleText,
                body: contentText,
                imageUrls: [],
              },
            });
          } else {
            editPage({
              variables: {
                pageId: params.pageId,
                title: titleText,
                body: contentText,
              },
            });
          }
        } else {
          setLoadingMessage('일기장 생성 중...');
          createPage({
            variables: {
              title: titleText,
              body: contentText,
              historyId: params.historyId,
              imageUrls: [],
            },
          });
        }
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

  return isLoading ? (
    <SpinnerContainer>
      <Flow animating={isLoading} size={100} color={theme.pointColor} />
    </SpinnerContainer>
  ) : (
    <KeyboardAwareScrollView>
      <Container>
        <InnerContainer>
          {imageArr.length > 0 && (
            <SubUploadImageContainer>
              <SelectedImage />
            </SubUploadImageContainer>
          )}
          {imageArr.length === 0 && (
            <UploadImageContainer onPress={() => setSelectModal(true)}>
              <UploadImageDefault source={IMG_DEFAULT} />
              <UploadImageText>사진 업로드</UploadImageText>
              <PlusIconContainer>
                <PlusIcon source={PLUS_ICON} />
              </PlusIconContainer>
            </UploadImageContainer>
          )}
          {selectModal && (
            <UploadModal
              onClose={() => setSelectModal(false)}
              visible={selectModal}
              onLaunchImageLibrary={openPicker}
              onLaunchCamera={_handleLaunchCamera}
            />
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
            multiline={true}
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
              <ExitModalTxt1>이 페이지에서 나가시겠습니까?</ExitModalTxt1>
              <ExitModalMargin />
              <ExitModalTxt2>
                이 페이지를 벗어나면 작성된 내용은{'\n'}저장되지 않습니다.
              </ExitModalTxt2>
            </ExitModalMid>
            <ExitModalBottom onPress={() => _handlerExit()}>
              <ExitModalTxt3>페이지 나가기</ExitModalTxt3>
            </ExitModalBottom>
          </ExitModalContainer>
        </Modal>
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default WriteDiary;
