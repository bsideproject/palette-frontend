import React, {useContext, useState, useEffect, useRef} from 'react';
import styled from 'styled-components/native';
import {
  View,
  TouchableOpacity,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import {ThemeContext} from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import {UserContext} from '@contexts';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {USE_QUERY, USE_MUTATION} from '@apolloClient/queries';

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({theme}) => theme.fullWhite};
  flex-direction: column;
`;

const InnerContainer = styled.View`
  padding: 17px 16px 50px 16px;
`;

const DiaryTitle = styled.Text`
  height: 40px;
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-family: ${({theme}) => theme.fontBold};
`;

const DiaryContent = styled.Text`
  text-align-vertical: top;
  padding: 0 19px 0 28px;
  margin-bottom: 30px;
  font-size: 14px;
  font-family: ${({theme}) => theme.fontRegular};
`;

const WrittenInfo = styled.Text`
  width: 100%;
  font-size: 14px;
  font-family: ${({theme}) => theme.fontBold};
  text-align: right;
`;

const SubUploadImageContainer = styled.View`
  flex-direction: row;
  margin-bottom: 11px;
  position: absolute;
  z-index: 10;
  top: 15;
  left: 15;
`;

const SubUploadImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 6px;
  margin-right: 9px;
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
  justify-content: center;
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

const ExitModalTxt3 = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${({theme}) => theme.white};
  font-family: ${({theme}) => theme.fontRegular};
`;

const StyledModalContainer = styled.View`
  flex-direction: column;
  align-items: center;
  width: 190px;
  height: 100px;
  border-radius: 6px;
  border: 1px solid
  border-color: ${({theme}) => theme.light020};
  background-color: ${({theme}) => theme.white};
  shadow-offset: 0px 4px;
  shadow-radius: 20px;
  shadow-color: rgba(0, 0, 0, 0.08);
  justify-content: flex-end;
  align-items: flex-end;
`;

const StyledModalButton = styled.TouchableOpacity`
  /* Modal Button들의 모달창 내의 높이를 균일하게 하기 위하여 flex를 줌 */
  flex: 1;
  align-items: center;
  flex-direction: row;
  padding: 0 10px;
`;

const StyledModalText = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: ${({theme}) => theme.dark010};
  font-family: ${({theme}) => theme.fontRegular};
`;

const HorizentalLine = styled.View`
  background-color: ${({theme}) => theme.light020};
  width: 100%;
  height: 1px;
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

const CarouselContainer = styled.View`
  ${({isHidden}) => isHidden && `opacity:0`}
`;

const ShowDiary = ({navigation, route}) => {
  const {params} = route;
  const {user} = useContext(UserContext);
  const theme = useContext(ThemeContext);
  const [changeImage, setChangeImage] = useState(false);
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [isExit, setIsExit] = useState(false);
  const [tabModalVisible, setTabModalVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const isCarousel = useRef(null);
  const [imageArr, setImageArr] = useState([]);
  const {loading, error, data, refetch} = USE_QUERY(
    'GET_PAGE',
    user.accessToken,
    {id: params.diary.id},
  );
  const [deletePage, deleteResult] = USE_MUTATION(
    'DELETE_PAGE',
    user.accessToken,
  );
  const [diaryData, setDiaryData] = useState(null);

  useEffect(() => {
    if (!loading) {
      data.page.images.map(image => {
        setImageArr(prev => [...prev, image.domain + image.path]);
      });
      setDiaryData({...data.page});
    }
  }, [loading]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setTabModalVisible(true)}>
          <Icon
            name={'more-vertical'}
            size={18}
            color={'black'}
            style={{marginRight: 20}}
          />
        </TouchableOpacity>
      ),
    });
  }, []);

  const SelectedImage = () => {
    return imageArr.map((arr, i) => (
      <View style={{position: 'relative'}} key={i}>
        <SubUploadImage source={{uri: arr.imgUrl}} />
      </View>
    ));
  };

  useEffect(() => {
    if (isExit) {
      navigation.goBack();
    }
  }, [isExit]);

  const _handlerExit = async () => {
    await deletePage({
      variables: {
        pageId: params.diary.id,
      },
    });
    setExitModalVisible(false);
    setIsExit(true);
  };
  const SLIDER_WIDTH = Dimensions.get('window').width - 30;

  const CarouselCardItem = ({item, index}) => {
    return (
      <View key={index} style={{width: SLIDER_WIDTH, height: SLIDER_WIDTH}}>
        <Image
          source={{uri: item}}
          style={{width: SLIDER_WIDTH, height: SLIDER_WIDTH}}
        />
      </View>
    );
  };

  const _handleScroll = e => {
    const scrollValue = e.nativeEvent.contentOffset.y;
    if (scrollValue > 250) {
      setChangeImage(true);
    } else {
      setChangeImage(false);
    }
  };

  const _handleEditDiary = () => {
    setTabModalVisible(false);
    const sendData={
      mode:'edit',
      title: diaryData.title,
      contents: diaryData.body,
      imgUrl: imageArr,
      pageId: params.diary.id
    }
    navigation.navigate('WriteDiary', sendData);
  };

  return (
    <>
      {changeImage && (
        <SubUploadImageContainer>
          <SelectedImage />
        </SubUploadImageContainer>
      )}
      {diaryData !== null && (
        <Container onScroll={_handleScroll}>
          <InnerContainer>
            {imageArr.length > 0 && (
              <CarouselContainer isHidden={changeImage}>
                <Carousel
                  data={imageArr}
                  ref={isCarousel}
                  renderItem={CarouselCardItem}
                  sliderWidth={SLIDER_WIDTH}
                  itemWidth={SLIDER_WIDTH}
                  onSnapToItem={index => setIndex(index)}
                  useScrollView={true}
                />
                <Pagination
                  dotsLength={imageArr.length}
                  activeDotIndex={index}
                  carouselRef={isCarousel}
                  dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 0,
                    backgroundColor: theme.pointColor,
                  }}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                />
              </CarouselContainer>
            )}
            <DiaryTitle>{diaryData.title}</DiaryTitle>
            <DiaryContent>{diaryData.body}</DiaryContent>
            {/* <WrittenInfo>{params.date}</WrittenInfo>
          <WrittenInfo>by.{params.written}</WrittenInfo> */}
          </InnerContainer>

          {/* top tab Modal */}
          <Modal
            isVisible={tabModalVisible}
            useNativeDriver={true}
            onRequestClose={() => {
              setTabModalVisible(false);
            }}
            hideModalContentWhileAnimating={true}>
            <Pressable
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
                alignItems: 'flex-end',
              }}
              onPress={() => {
                setTabModalVisible(false);
              }}>
              <StyledModalContainer>
                <StyledModalButton onPress={_handleEditDiary}>
                  <ModalTxt>
                    <StyledModalText>일기 수정</StyledModalText>
                  </ModalTxt>
                  <ModalIcon>
                    <Icon
                      name={'edit-2'}
                      size={16}
                      color={theme.dark010}
                      style={{justifyContent: 'center'}}
                    />
                  </ModalIcon>
                </StyledModalButton>

                <HorizentalLine />

                <StyledModalButton
                  onPress={() => {
                    setExitModalVisible(true);
                  }}>
                  <ModalTxt>
                    <StyledModalText>일기 삭제</StyledModalText>
                  </ModalTxt>
                  <ModalIcon>
                    <Icon
                      name={'log-out'}
                      size={16}
                      color={theme.dark010}
                      style={{justifyContent: 'center'}}
                    />
                  </ModalIcon>
                </StyledModalButton>
              </StyledModalContainer>
            </Pressable>
          </Modal>

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
                <ExitModalTxt1>정말 삭제하시겠습니까?</ExitModalTxt1>
              </ExitModalMid>
              <ExitModalBottom onPress={_handlerExit}>
                <ExitModalTxt3>삭제하기</ExitModalTxt3>
              </ExitModalBottom>
            </ExitModalContainer>
          </Modal>
        </Container>
      )}
    </>
  );
};

export default ShowDiary;
