import React, {useContext, useEffect, useState, useRef} from 'react';
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
import AsyncStorage from '@react-native-community/async-storage';
import {ErrorAlert} from '@components';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon_Ionicons from 'react-native-vector-icons/Ionicons';
import {Button} from '@components';
import useInterval from 'use-interval';
import {setCookie, getCookie} from '../../api/Cookie';

const DateTime = ts => {
  return moment(ts).format('YYYY년 MM월 DD일');
};

// Time & Date Function
const RemainDate = ts => {
  // [TODO] UTC Time Convert
  const now = moment().add(-9, 'hour').utc();
  const target = moment(ts, 'YYYY-MM-DD HH:mm:ss').utc();
  const diff = moment.duration(target.diff(now));

  if (diff < 0) {
    return false;
  }
  const day_diff = Math.floor(diff.asDays());
  const hour_diff = Math.floor(diff.asHours()) % 24;
  const min_diff = Math.floor(diff.asMinutes()) % 60;
  const second_diff = Math.floor(diff.asSeconds()) % 60;

  if (day_diff == 0 && hour_diff == 0 && min_diff == 0 && second_diff == 0) {
    return 'END';
  }

  return (
    day_diff +
    '일 ' +
    hour_diff +
    '시간 ' +
    min_diff +
    '분 ' +
    second_diff +
    '초 '
  );
};

const PeriodDiff = (startDate, endDate) => {
  const s_date = moment(startDate, 'YYYY-MM-DD HH:mm').utc();
  const e_date = moment(endDate, 'YYYY-MM-DD HH:mm').utc();
  const diff = moment.duration(e_date.diff(s_date));
  const day_diff = Math.floor(diff.asDays());
  return day_diff;
};

const DateConvertMMM = ts => {
  return moment(ts).format('MMM');
};

const DateConvertDD = ts => {
  return moment(ts).format('DD');
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

const HistoryItemNoContainer = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
`;

const HistoryItemNoTitle = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const HistoryItemNoBtn = styled.View`
  flex: 1;
`;

const HistoryItemNo = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: ${({theme}) => theme.dark010};
  text-align: center;
  margin-bottom: 30%;
`;

const MemoBtnItem = styled.View`
  align-items: center;
  justify-content: center;
  padding-left: 5%;
`;

const MemoData_Text3 = styled.Text`
  font-size: 18px;
  font-weight: 400;
  color: ${({theme}) => theme.dark010};
  font-family: ${({theme}) => theme.fontRegular};
`;

const Text_underline = styled.Text`
  text-decoration-line: underline;
`;

const BtnContainer = styled.View`
  justify-content: center;
  align-items: center;
  padding-right: 5%;
  padding-left: 5%;
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
  const [diaryTitle, setDiaryTitle] = useState('');
  const {user} = useContext(UserContext);
  const [diaryId, setDiaryId] = useState(-1);
  const [diaryStatus, setDiaryStatus] = useState(null);
  const [isDiscard, setIsDiscard] = useState(false);
  const [loadingMessage, setLoadingMessage] =
    useState('히스토리 데이터 로딩 중...');
  const {loading, error, data, refetch} = USE_QUERY(
    'LOOK_UP_HISTORY_PAGE',
    user.accessToken,
    {diaryId: diaryId},
  );
  const [
    exitDiary,
    {data: exitDiaryData, loading: exitDiaryLoading, error: exitDiaryError},
  ] = USE_MUTATION('EXIT_DIARY', user.accessToken);
  const [
    readAlarmHistory,
    {loading: loadingRAH, error: errorRAH, data: dataRAH},
  ] = USE_MUTATION('READ_PUSH_HISTORY', user.accessToken);
  const focus = useIsFocused();
  const [selDiaryRemainTime, setSelDiaryRemainTime] = useState('');
  const scrollViewRef = useRef();

  //console.log('DI', diaryId);

  // useInterval
  useInterval(() => {
    if (selDiary) {
      let remainTime = RemainDate(selDiary.endDate);
      setSelDiaryRemainTime(remainTime);
      // Diary End
      if (remainTime == 'END') {
        setIsLoading(true);
        refetch();
        getData(false, null);
      }
    }
  }, 1000);

  const findIdxfromHistoryId = (HistoryId, data) => {
    let findIdx = -1;
    for (let i = 0; i < data.length; ++i) {
      if (data[i].id == HistoryId) {
        findIdx = i;
        break;
      }
    }
    return findIdx == -1 ? 0 : findIdx;
  };

  const setHistoryDataInCookie = historyIdx => {
    let Json = new Object();
    Json.diaryId = diaryId;
    Json.historyIdx = historyIdx;

    if (Array.isArray(getCookie('HistoyData'))) {
      let origin = getCookie('HistoyData');
      let isDuplicate = false;

      for (let i = 0; i < origin.length; ++i) {
        if (origin[i].diaryId == diaryId) {
          origin[i].historyIdx = historyIdx;
          isDuplicate = true;
          break;
        }
      }
      if (!isDuplicate) {
        origin.push(Json);
      }
      setCookie('HistoyData', JSON.stringify(origin));
    } else {
      let JsonArray = new Array();
      JsonArray.push(Json);
      setCookie('HistoyData', JSON.stringify(JsonArray));
    }
  };

  const getHistoryDataInCookie = () => {
    let cookie = getCookie('HistoyData');

    if (Array.isArray(cookie)) {
      for (let i = 0; i < cookie.length; ++i) {
        if (cookie[i].diaryId == diaryId) {
          return cookie[i].historyIdx;
        }
      }
      return 0;
    } else {
      return 0;
    }
  };

  // [QUERY EVENT FUNCTION] --------------------------------------
  const getData = (isHistoryId, pushObj) => {
    //console.log(error, loading, data);
    if (error != undefined) {
      if (diaryId != -1) {
        console.log('ERROR: ', JSON.stringify(error));
        setIsLoading(false);
        ErrorAlert();
      } else {
        console.log('Not Init Diary Id');
      }
    } else {
      if (loading || data == undefined) {
        console.log('Data Fecting & Data Empty');
        return;
      }
      // console.log('Read Data', data['histories']);
      // console.log('Read Pages', data['histories'].histories);

      // Set Diary Title
      setDiaryTitle(data['histories'].diaryTitle);
      // Cur Select Diary
      setHistory(data['histories'].histories);

      if (
        diaryStatus == 'WAIT' ||
        (diaryStatus == 'READY' && data['histories'].histories.length == 0)
      ) {
        setIsLoading(false);
        return;
      }
      if (isHistoryId) {
        let historyIdx = findIdxfromHistoryId(
          pushObj.historyId,
          data['histories'].histories,
        );
        //console.log('Push Sel', data['histories'][historyIdx]);
        setSelDiary(data['histories'].histories[historyIdx]);
        _pushDataHandle(pushObj);
      } else {
        let historyIdx = getHistoryDataInCookie();
        setSelDiary(data['histories'].histories[historyIdx]);
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    }
  };

  const _handleExitMemo = () => {
    //console.log('Exit Memo');
    setIsLoading(true);
    setLoadingMessage('일기장 나가는 중...');
    exitDiary({
      variables: {
        diaryId: route.params.id,
      },
    });
    setExitModalVisible(false);
  };

  const _pushDataHandle = obj => {
    // Process Alarm Read Flag
    if (obj.alarmHistoryId) {
      let alarmHistoryArray = [obj.alarmHistoryId];
      console.log('Send Alarm History Id:!!!!!', alarmHistoryArray);
      readAlarmHistory({
        variables: {
          alarmHistoryIds: alarmHistoryArray,
        },
      });
    } else {
      AsyncStorage.removeItem('PushParams');
      setIsLoading(false);
    }
  };

  // [USE EFFECT] -----------------------------------------------
  useEffect(() => {
    if (focus) {
      setIsLoading(true);

      AsyncStorage.getItem('PushParams', (err, result) => {
        // Push Data Handled
        let isHistoryId = false;
        let pushObj = null;
        if (result) {
          console.log('1.Push Event');
          let obj = JSON.parse(result);
          if (obj.diaryId) {
            console.log('[History Push] Diary Id: ', obj.diaryId);
            setDiaryId(Number(obj.diaryId));
          }
          if (obj.historyId) {
            isHistoryId = true;
            pushObj = obj;
          }
        } else {
          console.log('2.Normal/Change Event');
          setDiaryId(route.params.id);
        }
        refetch();
        getData(isHistoryId, pushObj);
      });
    }
  }, [focus, loading, data, route.params]);

  useEffect(() => {
    if (exitDiaryError != undefined) {
      let jsonData = JSON.parse(JSON.stringify(exitDiaryError));
      console.log(jsonData);
      setIsLoading(false);
      ErrorAlert();
    } else {
      if (exitDiaryLoading || exitDiaryData == undefined) {
        console.log('Data Fecting & Data Empty');
        return;
      }
      // Not Check Data Is True..
      setIsLoading(false);
      console.log('Success Data', exitDiaryData);
      // If Success
      navigation.navigate('Home');
    }
  }, [exitDiaryLoading]);

  useEffect(() => {
    if (errorRAH != undefined) {
      let jsonData = JSON.parse(JSON.stringify(errorRAH));
      console.log(jsonData);
      // Only Print Console Log
      setIsLoading(false);
    } else {
      if (loadingRAH || dataRAH == undefined) {
        console.log('Data Fecting & Data Empty');
        return;
      }
      // If Success
      console.log('PUSH READ SUCCESS: ', dataRAH);
      AsyncStorage.removeItem('PushParams');
      setIsLoading(false);
    }
  }, [loadingRAH]);

  useEffect(() => {
    // console.log(modalVisible);
    if (!(modalVisible == true || modalVisible == false)) {
      setHistoryModalVisible(false);
    }
    // Set Initial Diary Id
    console.log('Initial', route);
    if (route.params.diaryStatus) {
      setDiaryStatus(route.params.diaryStatus);
    }
    if (route.params.id) {
      setDiaryId(route.params.id);
    } else if (route.params.diaryId) {
      setDiaryId(route.params.diaryId);
    }
    if (route.params.isDiscard) {
      setIsDiscard(true);
    } else {
      setIsDiscard(false);
    }
  }, []);

  // [RENDER FUNCTION] ------------------------------------------
  const _handleMemoData = status => {
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

  const historyDateSwipeBox = (item, index) => {
    return (
      <HistoryDateItemContainer>
        <TouchableOpacity
          onPress={() => {
            setSelDiary(item);
            setHistoryDataInCookie(index);
          }}
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
              item == selDiary &&
              RemainDate(selDiary.endDate) != false &&
              !isDiscard
                ? '#F3B948'
                : '#FFFFFF',
            borderWidth:
              item == selDiary &&
              RemainDate(selDiary.endDate) != false &&
              !isDiscard
                ? 3
                : 0,
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
          (RemainDate(selDiary.endDate) == false || item.isSelf) &&
          navigation.navigate('ShowDiary', {
            diary: item,
            historyTitle: diaryTitle,
            isModifyDisable:
              RemainDate(selDiary.endDate) == false || isDiscard == true,
          })
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
                {item.images.map((item, index) => {
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
      <Spinner visible={isLoading} textContent={loadingMessage} />
    </SpinnerContainer>
  ) : (
    <Container>
      {diaryStatus == 'WAIT' ||
      (diaryStatus == 'READY' && History.length == 0) ? (
        <HistoryItemNoContainer
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <HistoryItemNoTitle>
            <HistoryTitleTxt>{diaryTitle}</HistoryTitleTxt>
          </HistoryItemNoTitle>

          {diaryStatus == 'WAIT' ? (
            <HistoryItemNoBtn>
              <MemoBtnItem>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    console.log(route.params.invitationCode);
                    Clipboard.setString(route.params.invitationCode);
                  }}>
                  <MemoData_Text3>
                    <Text_underline>초대코드 복사하기</Text_underline>
                    &nbsp;&nbsp;
                    <Icon_Ionicons
                      name={'copy-outline'}
                      size={18}
                      color={theme.white}
                    />
                  </MemoData_Text3>
                </TouchableOpacity>
              </MemoBtnItem>
            </HistoryItemNoBtn>
          ) : (
            <HistoryItemNoBtn
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <BtnContainer
                style={{justifyContent: 'center', alignItems: 'center'}}>
                <Button
                  title="새 교환 일기 시작"
                  IconType="plus"
                  IconColor={theme.pointColor}
                  onPress={() =>
                    navigation.navigate('SetMemoPeriod', route.params)
                  }
                  containerStyle={{
                    backgroundColor: theme.white,
                    borderWidth: 1,
                    borderColor: theme.pointColor,
                    borderStyle: 'dashed',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  textStyle={{
                    color: theme.pointColor,
                    fontSize: 18,
                    fontWeight: '700',
                    fontFamily: theme.fontRegular,
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                />
              </BtnContainer>
            </HistoryItemNoBtn>
          )}
        </HistoryItemNoContainer>
      ) : (
        <HistoryTitleContainer>
          <HistoryTitleTxt>{diaryTitle}</HistoryTitleTxt>
        </HistoryTitleContainer>
      )}

      {!(
        diaryStatus == 'WAIT' ||
        (diaryStatus == 'READY' && History.length == 0)
      ) && (
        <HistoryDateContainer>
          <HistoryDateBox>
            <HistoryDateTxt>
              {selDiary != null &&
                DateTime(selDiary.startDate) +
                  ' ~ ' +
                  DateTime(selDiary.endDate)}
            </HistoryDateTxt>
          </HistoryDateBox>

          <ScrollView
            horizontal={true}
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollTo({
                x: 98 * getHistoryDataInCookie(),
              })
            }
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}>
            {History.map((item, index) => {
              return historyDateSwipeBox(item, index);
            })}
          </ScrollView>
        </HistoryDateContainer>
      )}

      {diaryStatus == 'WAIT' ||
      (diaryStatus == 'READY' && History.length == 0) ? (
        <HistoryContentContainer
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <HistoryItemNo>작성된 일기가 없습니다</HistoryItemNo>
        </HistoryContentContainer>
      ) : (
        <HistoryContentContainer>
          <HistoryContentRemainTimeTxt>
            {RemainDate(selDiary.endDate) == false || isDiscard == true
              ? ''
              : selDiaryRemainTime + '후 교환'}
          </HistoryContentRemainTimeTxt>
          <HistoryContentItemContainer>
            <FlatList
              data={selDiary.pages}
              renderItem={historyContentItemBox}
              numColumns={1}
              keyExtractor={item => item.id}
              initialNumToRender={selDiary.pages.length}
            />
          </HistoryContentItemContainer>
        </HistoryContentContainer>
      )}

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
          {isDiscard == true ? (
            <StyledModalContainer style={{height: 50}}>
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
            </StyledModalContainer>
          ) : (
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
          )}
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
