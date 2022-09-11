import React, {useContext, useEffect, useState} from 'react';
import {ThemeContext} from 'styled-components/native';
import styled from 'styled-components/native';
import {TouchableOpacity, Pressable, ScrollView} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import {HistoryModalContext} from '@contexts';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import {FlatList} from 'react-native-gesture-handler';
import {Dimensions} from 'react-native';
import {utcToKst} from '~/src/utils';
import {USE_QUERY, USE_MUTATION} from '@apolloClient/queries';
import {UserContext} from '@contexts';
import {useIsFocused} from '@react-navigation/native';
import AutoHeightImage from 'react-native-auto-height-image';
import Icon_Ant from 'react-native-vector-icons/AntDesign';

const DateTime = ts => {
  return moment(utcToKst(ts)).format('YYYY년 MM월 DD일');
};

// Time & Date Function
const RemainDate = ts => {
  // [TODO] UTC Time Convert
  const now = moment().utc();
  const target = moment(ts, 'YYYY-MM-DD HH:mm').utc();
  const diff = moment.duration(now.diff(target));

  if (diff > 0) {
    return false;
  }
  const day_diff = Math.floor(diff.asDays());
  const hour_diff = Math.floor(diff.asHours()) % 24;
  const min_diff = Math.floor(diff.asMinutes()) % 60;
  return -day_diff + '일 ' + -hour_diff + '시간 ' + -min_diff + '분 ';
};

const PeriodDiff = (startDate, endDate) => {
  const s_date = moment(startDate, 'YYYY-MM-DD HH:mm').utc();
  const e_date = moment(endDate, 'YYYY-MM-DD HH:mm').utc();
  const diff = moment.duration(e_date.diff(s_date));
  const day_diff = Math.floor(diff.asDays());
  return day_diff;
};

const DateConvertMMM = ts => {
  return moment(utcToKst(ts)).format('MMM');
};

const DateConvertDD = ts => {
  return moment(utcToKst(ts)).format('DD');
};

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.fullWhite};
  flex-direction: column;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

// Spinner
const SpinnerContainer = styled.Text`
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-family: ${({theme}) => theme.fontRegular};
`;

const StyledModalContainer = styled.View`
  flex-direction: column;
  align-items: center;
  width: 190px;
  height: 150px;
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

const HistoryTitleContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const HistoryTitleTxt = styled.Text`
  font-size: 22px;
  font-weight: 600;
  color: ${({theme}) => theme.dark010};
  font-family: ${({theme}) => theme.fontRegular};
`;

const HistoryDateContainer = styled.View`
  width: 100%;
  flex: 2;
  padding-right: 5%;
  padding-left: 5%;
`;

const HistoryDateBox = styled.View`
  border-radius: 6px;
  border: 1px solid;
  border-color: ${({theme}) => theme.pointColor};
  width: 100%
  height: 30%;
  justify-content: center;
  margin-bottom:5%;
`;

const HistoryDateTxt = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({theme}) => theme.pointColor};
  text-align: center;
`;

const HistoryDateItemContainer = styled.View`
  flex: 1;
`;

const HistoryDateSelBar = styled.View`
  width: 90%;
  background-color: ${({theme}) => theme.pointColor};
  height: 3px;
`;

const HistoryDateNotSelBar = styled.View``;

const HistoryDateItemTxt = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({theme, selected}) => (selected ? theme.white : theme.dark030)};
  text-align: center;
`;

const HistoryContentContainer = styled.View`
  width: 100%;
  background-color: ${({theme}) => theme.homeColor};
  flex: 7;
`;

const HistoryContentRemainTimeTxt = styled.Text`
  margin-top: 4%;
  height: 5%;
  font-size: 14px;
  font-weight: 600;
  color: ${({theme}) => theme.dark010};
  text-align: center;
  justify-content: center;
`;

const HistoryContentItemContainer = styled.View`
  flex: 1;
  margin-top: 2%;
`;

const HistoryRow = styled.TouchableOpacity`
  margin-bottom: 3%;
  flex-direction: row;
  flex: 1;
  padding-right: 5%;
  padding-left: 5%;
  justify-content: center;
`;

const HistoryPeriodBar = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-right: 5%;
`;

const HistoryPeriodBarCircle = styled.View`
  border-color: ${({theme, isAdmin}) =>
    isAdmin ? theme.pointColor : theme.subColor1};
  width: 14px;
  height: 14px;
  border-width: 3px;
  border-radius: 50px;
`;

const HistoryPeriodBarLine = styled.View`
  background-color: ${({theme, isAdmin}) =>
    isAdmin ? theme.pointColor : theme.subColor1};
  width: 3px;
  height: 80%;
`;

const HistoryItemBox = styled.View`
  flex: 15;
  flex-direction: row;
  background-color: ${({theme}) => theme.fullWhite};
  border-radius: 10px;
  padding-top: 3%;
  padding-bottom: 3%;
`;

const HistoryItemBoxDate = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const HistoryItemBoxDateInMMM = styled.View`
  justify-content: center;
  align-items: center;
  flex: 2;
`;

const HistoryItemBoxDateInMMMTxt = styled.Text`
  font-size: 12px;
  font-weight: 400;
  color: ${({theme}) => theme.dark020};
  text-align: center;
`;

const HistoryItemBoxDateInDD = styled.View`
  justify-content: center;
  align-items: center;
  flex: 3;
`;

const HistoryItemBoxDateInDDTxt = styled.Text`
  font-size: 22px;
  font-weight: 300;
  color: ${({theme}) => theme.dark010};
  text-align: center;
`;

const HistoryItemBoxContent = styled.View`
  flex: 3;
  margin-left: 5%;
`;

const HistoryItemBoxInTitle = styled.View`
  flex: 1;
  justify-content: center;
`;

const HistoryItemBoxInTitleTxt = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${({theme}) => theme.dark030};
  text-align: left;
`;

const HistoryItemBoxInContent = styled.View`
  flex: 1;
  margin-top: 2%;
`;

const HistoryItemBoxInContentTxt = styled.Text`
  font-size: 14px;
  font-weight: 400;
  color: ${({theme}) => theme.dark030};
  text-align: left;
`;

const HistoryItemBoxInImg = styled.View`
  flex: 1;
  flex-direction: row;
  shadow-offset: 0px 2px;
  shadow-radius: 2px;
  shadow-color: rgba(0, 0, 0, 0.15);
  margin-top: 2%;
`;

const VerticalLine = styled.View`
  background-color: ${({theme}) => theme.light020};
  width: 1px;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const History = ({navigation, route}) => {
  const theme = useContext(ThemeContext);
  const {modalVisible, setHistoryModalVisible} =
    useContext(HistoryModalContext);
  const [History, setHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [exitModalVisible, setExitModalVisible] = useState(false);
  // History
  const [selDiary, setSelDiary] = useState(null);
  const {user} = useContext(UserContext);
  const [diaryId, setDiaryId] = useState(route.params.id);

  const {loading, error, data, refetch} = USE_QUERY(
    'LOOK_UP_HISTORY_PAGE',
    user.accessToken,
    {diaryId: diaryId},
  );
  console.log(diaryId);
  const [
    exitDiary,
    {data: exitDiaryData, loading: exitDiaryLoading, error: exitDiaryError},
  ] = USE_MUTATION('EXIT_DIARY', user.accessToken);
  const [
    readAlarmHistory,
    {loading: loadingRAH, error: errorRAH, data: dataRAH},
  ] = USE_MUTATION('READ_PUSH_HISTORY', user.accessToken);
  const focus = useIsFocused();

  const findIdxfromHistoryId = (HistoryId, data) => {
    let findIdx = -1;
    for (let i = 0; i < data.length; ++i) {
      if (data[i].id == HistoryId) {
        findIdx = i;
        break;
      }
    }
    return findIdx;
  };

  // [QUERY EVENT FUNCTION] --------------------------------------
  const getData = isPushEvent => {
    console.log(error, loading, data);
    if (error != undefined) {
      console.log('ERROR: ', JSON.stringify(error));
      // [TODO] Go to Error Page
    } else {
      if (loading || data == undefined) {
        console.log('Data Fecting & Data Empty');
        return;
      }
      // console.log('Read Data', data['histories']);
      // console.log('Read Pages', data['histories'][0]);

      // Cur Select Diary
      setHistory(data['histories']);

      if (isPushEvent) {
        let historyIdx = findIdxfromHistoryId(
          route.params.historyId,
          data['histories'],
        );
        if (historyIdx == -1) {
          setSelDiary(data['histories'][0]);
        } else {
          setSelDiary(data['histories'][historyIdx]);
        }
      } else {
        setSelDiary(data['histories'][0]);
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  };

  const _handleExitMemo = () => {
    console.log('Exit Memo');
    exitDiary({
      variables: {
        diaryId: route.params.id,
      },
    });
    setExitModalVisible(false);
  };

  // [USE EFFECT] -----------------------------------------------
  useEffect(() => {
    if (focus) {
      let isPushEvent = false;
      setIsLoading(true);
      if (route.params.hasOwnProperty('id')) {
        setDiaryId(route.params.id);
      } else if (route.params.hasOwnProperty('diaryId')) {
        setDiaryId(route.params.diaryId);
        if (route.params.hasOwnProperty('historyId')) {
          isPushEvent = true;
        }
        // Process Alarm Read Flag
        if (route.params.hasOwnProperty('alarmHistoryId')) {
          let alarmHistoryArray = [route.params.alarmHistoryId];
          console.log('Send Alarm History Id:!!!!!', alarmHistoryArray);
          readAlarmHistory({
            variables: {
              alarmHistoryIds: alarmHistoryArray,
            },
          });
        }
      }
      refetch();
      getData(isPushEvent);
    }
  }, [focus, loading, data, route.params]);

  useEffect(() => {
    if (exitDiaryError != undefined) {
      let jsonData = JSON.parse(JSON.stringify(exitDiaryError));
      console.log(jsonData);
      // [TODO] Go to Error Page
    } else {
      if (exitDiaryLoading || exitDiaryData == undefined) {
        console.log('Data Fecting & Data Empty');
        return;
      }
      // Not Check Data Is True..
      console.log('Success Data', exitDiaryData);
      // If Success
      navigation.navigate('Home');
    }
  }, [exitDiaryLoading]);

  useEffect(() => {
    if (errorRAH != undefined) {
      let jsonData = JSON.parse(JSON.stringify(errorRAH));
      console.log(jsonData);
      // [TODO] Go to Error Page
    } else {
      if (loadingRAH || dataRAH == undefined) {
        console.log('Data Fecting & Data Empty');
        return;
      }
      // If Success
      console.log('PUSH READ SUCCESS: ', dataRAH);
    }
  }, [loadingRAH]);

  useEffect(() => {
    // console.log(modalVisible);
    if (!(modalVisible == true || modalVisible == false)) {
      setHistoryModalVisible(false);
    }
  }, []);

  // [RENDER FUNCTION] ------------------------------------------
  const _handleMemoData = status => {
    console.log(status);
    // [TODO]
    switch (status) {
      case 'EXIT':
        setExitModalVisible(true);
        break;
      case 'MODIFY':
        navigation.navigate('EditDiaryTitle', route.params.id);
        break;
      case 'COLOR':
        navigation.navigate('EditDiaryColor', route.params.id);
        break;
    }
    setHistoryModalVisible(false);
  };

  const historyDateSwipeBox = item => {
    return (
      <HistoryDateItemContainer>
        <TouchableOpacity
          onPress={() => setSelDiary(item)}
          style={{
            backgroundColor:
              item == selDiary ? theme.pointColor : theme.light020,
            borderRadius: 10,
            width: 86,
            height: 56,
            marginRight: 12,
            marginBottom: 10,
            justifyContent: 'center',
            borderColor:
              item == selDiary && RemainDate(selDiary.endDate) != false
                ? '#F3B948'
                : '#FFFFFF',
            borderWidth:
              item == selDiary && RemainDate(selDiary.endDate) != false ? 3 : 0,
          }}>
          <HistoryDateItemTxt selected={item == selDiary ? true : false}>
            {PeriodDiff(item.startDate, item.endDate)}&nbsp;Days
          </HistoryDateItemTxt>
        </TouchableOpacity>

        {item == selDiary ? <HistoryDateSelBar /> : <HistoryDateNotSelBar />}
      </HistoryDateItemContainer>
    );
  };

  const histotyImageRender = item => {
    return (
      <AutoHeightImage
        width={39}
        height={39}
        maxHeight={39}
        source={{uri: item.domain + item.path}}
        style={{
          borderRadius: 5,
          marginRight: '3%',
        }}
      />
    );
  };

  const historyContentItemBox = ({item}) => {
    return (
      <HistoryRow
        onPress={() =>
          item.isSelf && navigation.navigate('ShowDiary', {diary: item})
        }>
        <HistoryPeriodBar>
          <HistoryPeriodBarCircle isAdmin={item.isSelf} />
          <HistoryPeriodBarLine isAdmin={item.isSelf} />
        </HistoryPeriodBar>

        <HistoryItemBox>
          {RemainDate(selDiary.endDate) == false ||
          (RemainDate(selDiary.endDate) != false && item.isSelf == true) ? (
            <HistoryItemBoxDate>
              <HistoryItemBoxDateInMMM>
                <HistoryItemBoxDateInMMMTxt>
                  {DateConvertMMM(item.createdAt)}
                </HistoryItemBoxDateInMMMTxt>
              </HistoryItemBoxDateInMMM>
              <HistoryItemBoxDateInDD>
                <HistoryItemBoxDateInDDTxt>
                  {DateConvertDD(item.createdAt)}
                </HistoryItemBoxDateInDDTxt>
              </HistoryItemBoxDateInDD>
            </HistoryItemBoxDate>
          ) : (
            <HistoryItemBoxDate style={{height: 50}}>
              <Icon_Ant
                name="lock"
                size={30}
                color={theme.dark020}
                style={{marginRight: 3}}
              />
            </HistoryItemBoxDate>
          )}

          <VerticalLine />

          {RemainDate(selDiary.endDate) == false ||
          (RemainDate(selDiary.endDate) != false && item.isSelf == true) ? (
            <HistoryItemBoxContent>
              <HistoryItemBoxInTitle>
                <HistoryItemBoxInTitleTxt>
                  {item.author.nickname}님의 일기
                </HistoryItemBoxInTitleTxt>
              </HistoryItemBoxInTitle>

              <HistoryItemBoxInContent>
                <HistoryItemBoxInContentTxt>
                  {item.title}
                </HistoryItemBoxInContentTxt>
              </HistoryItemBoxInContent>

              <HistoryItemBoxInImg>
                {item.images.map(item => {
                  return histotyImageRender(item);
                })}
              </HistoryItemBoxInImg>
            </HistoryItemBoxContent>
          ) : (
            <HistoryItemBoxContent>
              <HistoryItemBoxInTitle>
                <HistoryItemBoxInTitleTxt>
                  {item.author.nickname}님의 일기
                </HistoryItemBoxInTitleTxt>
              </HistoryItemBoxInTitle>
            </HistoryItemBoxContent>
          )}
        </HistoryItemBox>
      </HistoryRow>
    );
  };

  return isLoading ? (
    <SpinnerContainer>
      <Spinner visible={isLoading} textContent={'히스토리 데이터 로딩 중...'} />
    </SpinnerContainer>
  ) : (
    <Container>
      <HistoryTitleContainer>
        <HistoryTitleTxt>{selDiary.diary.title}</HistoryTitleTxt>
      </HistoryTitleContainer>

      <HistoryDateContainer>
        <HistoryDateBox>
          <HistoryDateTxt>
            {DateTime(selDiary.startDate)} ~ {DateTime(selDiary.endDate)}
          </HistoryDateTxt>
        </HistoryDateBox>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}>
          {History.map(item => {
            return historyDateSwipeBox(item);
          })}
        </ScrollView>
      </HistoryDateContainer>

      <HistoryContentContainer>
        <HistoryContentRemainTimeTxt>
          {RemainDate(selDiary.endDate) == false
            ? ''
            : RemainDate(selDiary.endDate) + '후 교환'}
        </HistoryContentRemainTimeTxt>
        <HistoryContentItemContainer>
          <FlatList
            data={selDiary.pages}
            renderItem={historyContentItemBox}
            numColumns={1}
          />
        </HistoryContentItemContainer>
      </HistoryContentContainer>

      {/* top tab Modal */}
      <Modal
        isVisible={modalVisible}
        useNativeDriver={true}
        onRequestClose={() => setHistoryModalVisible(false)}
        hideModalContentWhileAnimating={true}>
        <Pressable
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            alignItems: 'flex-end',
          }}
          onPress={() => setHistoryModalVisible(false)}>
          <StyledModalContainer>
            <StyledModalButton
              onPress={() => {
                _handleMemoData('EXIT');
              }}>
              <ModalTxt>
                <StyledModalText>일기장 나가기</StyledModalText>
              </ModalTxt>
              <ModalIcon>
                <Icon
                  name={'exit-outline'}
                  size={20}
                  color={theme.dark010}
                  style={{justifyContent: 'center'}}
                />
              </ModalIcon>
            </StyledModalButton>

            <HorizentalLine />

            <StyledModalButton
              onPress={() => {
                _handleMemoData('MODIFY');
              }}>
              <ModalTxt>
                <StyledModalText>일기장 이름 수정</StyledModalText>
              </ModalTxt>
              <ModalIcon>
                <Icon
                  name={'pencil-outline'}
                  size={20}
                  color={theme.dark010}
                  style={{justifyContent: 'center'}}
                />
              </ModalIcon>
            </StyledModalButton>

            <HorizentalLine />

            <StyledModalButton
              onPress={() => {
                _handleMemoData('COLOR');
              }}>
              <ModalTxt>
                <StyledModalText>커버 색상 변경</StyledModalText>
              </ModalTxt>
              <ModalIcon>
                <Icon
                  name={'color-palette-outline'}
                  size={20}
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
                name={'close'}
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
          <ExitModalBottom onPress={() => _handleExitMemo()}>
            <ExitModalTxt3>네, 일기장을 나갑니다.</ExitModalTxt3>
          </ExitModalBottom>
        </ExitModalContainer>
      </Modal>
    </Container>
  );
};

export default History;

/*
const testHistoryData = {
  title: route.params.title,
  content: [
    {
      startDate: '2022-07-01 07:11:36.045248',
      endDate: '2022-07-08 07:11:36.045248',
      period: 7,
      content: [
        {
          title: '김지은님의 일기',
          content: '일기 test',
          createdAt: '2022-08-16 22:41:56.045248',
          contentImg: ['https://...', 'https://...'],
          isAdmin: true,
        },
        {
          title: '김반쪽의 일기',
          content: '일기 test다..',
          createdAt: '2022-08-18 22:41:56.045248',
          contentImg: ['https://...', 'https://...'],
          isAdmin: false,
        },
        {
          title: '여행 계획을 세우자',
          content: '오늘 김반쪽과 만나기로 했다..',
          createdAt: '2022-08-03 07:11:36.045248',
          contentImg: ['https://...', 'https://...'],
          isAdmin: true,
        },
      ],
    },
    {
      startDate: '2022-06-01 07:11:36.045248',
      endDate: '2022-06-30 07:11:36.045248',
      period: 30,
      content: [
        {
          title: '김지은님의 일기',
          content: '일기 test',
          createdAt: '2022-08-16 22:41:56.045248',
          contentImg: ['https://...', 'https://...'],
          isAdmin: true,
        },
        {
          title: '김반쪽의 일기',
          content: '일기 test다..',
          createdAt: '2022-08-18 22:41:56.045248',
          contentImg: ['https://...', 'https://...'],
          isAdmin: false,
        },
        {
          title: '여행 계획을 세우자',
          content: '오늘 김반쪽과 만나기로 했다..',
          createdAt: '2022-08-03 07:11:36.045248',
          contentImg: ['https://...', 'https://...'],
          isAdmin: true,
        },
      ],
    },
    {
      startDate: '2022-05-15 07:11:36.045248',
      endDate: '2022-05-30 07:11:36.045248',
      period: 15,
      content: [
        {
          title: '김지은님의 일기',
          content: '일기 test',
          createdAt: '2022-08-16 22:41:56.045248',
          contentImg: ['https://...', 'https://...'],
          isAdmin: true,
        },
        {
          title: '김반쪽의 일기',
          content: '일기 test다..',
          createdAt: '2022-08-18 22:41:56.045248',
          contentImg: ['https://...', 'https://...'],
          isAdmin: false,
        },
        {
          title: '여행 계획을 세우자',
          content: '오늘 김반쪽과 만나기로 했다..',
          createdAt: '2022-08-03 07:11:36.045248',
          contentImg: ['https://...', 'https://...'],
          isAdmin: true,
        },
      ],
    },
    {
      startDate: '2022-05-15 07:11:36.045248',
      endDate: '2022-05-30 07:11:36.045248',
      period: 15,
      content: [
        {
          title: '김지은님의 일기',
          content: '일기 test',
          createdAt: '2022-08-16 22:41:56.045248',
          contentImg: ['https://...', 'https://...'],
          isAdmin: true,
        },
        {
          title: '김반쪽의 일기',
          content: '일기 test다..',
          createdAt: '2022-08-18 22:41:56.045248',
          contentImg: ['https://...', 'https://...'],
          isAdmin: false,
        },
        {
          title: '여행 계획을 세우자',
          content: '오늘 김반쪽과 만나기로 했다..',
          createdAt: '2022-08-03 07:11:36.045248',
          contentImg: ['https://...', 'https://...'],
          isAdmin: true,
        },
      ],
    },
  ],
};
*/
