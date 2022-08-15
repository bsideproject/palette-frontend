import React, {useContext, useState, useEffect} from 'react';
import {ThemeContext} from 'styled-components/native';
import styled from 'styled-components/native';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import Carousel from 'react-native-snap-carousel';
import {Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {FlatList} from 'react-native-gesture-handler';

const checkDate = ts => {
  const now = moment().startOf('day');
  const target = moment(ts).startOf('day');

  // Today Check
  if (now.diff(target, 'day') > 0) {
    return moment(ts).format('MM/DD');
  } else {
    return 'Today';
  }
};

const checkTime = ts => {
  return moment(ts).format('hh:mm A');
};

const Container = styled.View`
  flex: 1;
  flex-direction: row;
  padding-left: 5%;
  padding-right: 5%;
  background-color: ${({theme}) => theme.background};
`;

const MemoContainer = styled.View`
  flex: 1;
  flex-direction: column;
  margin-top: 10%;
  border-radius: 6px;
  background-color: ${({theme}) => theme.btnMainColorBg};
`;

const Memo_Item1 = styled.View`
  margin-top: 2%;
  flex: 1;
`;

const Item1_Text = styled.Text`
  font-size: 16px;
  margin-top: 10;
  margin-left: 20;
  color: ${({theme}) => theme.btnWhiteFont};
  font-family: ${({theme}) => theme.fontRegular};
`;

const Memo_Item2 = styled.View`
  justify-content: center;
  align-items: center;
  flex: 3;
`;

const Item2_Text = styled.Text`
  font-size: 25px;
  font-weight: 700;
  color: ${({theme}) => theme.btnWhiteFont};
  font-family: ${({theme}) => theme.fontRegular};
`;

const Memo_Item3 = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-bottom: 3%;
`;

const Item3_Text = styled.Text`
  font-size: 14px;
  font-weight: 400;
  color: ${({theme}) => theme.btnWhiteFont};
  font-family: ${({theme}) => theme.fontRegular};
`;

const SpinnerContainer = styled.Text`
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-family: ${({theme}) => theme.fontRegular};
`;

const MemoDataContainer = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: ${({theme}) => theme.memobackground};
`;

const MemoItemContainer = styled.View`
  flex: 1;
  padding-left: 8%;
  padding-right: 8%;
  margin-top: 8%;
`;

const MemoFlexTop = styled.View`
  flex: 2;
`;

const MemoFlexBottom = styled.View`
  flex: 3;
  margin-left: 8%;
  margin-right: 8%;
`;

const MemoFlexFooter = styled.View`
  flex: 1;
  margin-left: 8%;
  margin-right: 8%;
`;

const MemoDataItem = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
`;

const MemoBtnItem = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  background-color: ${({theme}) => theme.background};
  margin-bottom: 3%;
  margin-top: 20%;
  margin-left: 10%;
  margin-right: 10%;
`;

const MemoData_Text1 = styled.Text`
  font-size: 16px;
  font-weight: 400;
  margin-top: 7%;
  color: ${({theme}) => theme.btnWhiteFont};
  font-family: ${({theme}) => theme.fontRegular};
`;

const MemoData_Text2 = styled.Text`
  font-size: 25px;
  font-weight: 700;
  margin-top: 5%;
  color: ${({theme}) => theme.btnWhiteFont};
  font-family: ${({theme}) => theme.fontRegular};
`;

const MemoData_Text3 = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: ${({theme}) => theme.text};
  font-family: ${({theme}) => theme.fontRegular};
`;

const MemoRecentItemContainer = styled.View`
  border-radius: 10px;
  flex: 1;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 60;
  margin-bottom: 5%;
  background-color: ${({theme}) => theme.background};
`;

const MemoRecentItemLeft = styled.View`
  flex: 2;
  justify-content: center;
  align-items: flex-start;
  margin-left: 3%;
`;

const MemoRecentItemRight = styled.View`
  flex: 1;
  justify-content: center;
  align-items: flex-end;
  margin-right: 5%;
`;

const MemoRecent_Title = styled.Text`
  font-size: 16px;
  font-weight: 700;
  margin-top: 7%;
  margin-bottom: 5%;
  color: ${({theme}) => theme.text};
  font-family: ${({theme}) => theme.fontRegular};
`;

const MemoRecent_Icon = styled.View`
  margin-left: 3%;
  background-color: ${({color}) => color};
  border-radius: 50;
  width: 10%;
  height: 55%;
  shadow-offset: 0px 4px;
  shadow-radius: 20px;
  shadow-color: rgba(0, 0, 0, 0.7);
  elevation: 15;
`;

const MemoRecent_Text1 = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${({theme}) => theme.text};
  font-family: ${({theme}) => theme.fontRegular};
`;

const MemoRecent_Text2 = styled.Text`
  font-size: 14px;
  font-weight: 400;
  color: ${({theme}) => theme.grayFont};
  font-family: ${({theme}) => theme.fontRegular};
`;

const MemoRecent_Text3 = styled.Text`
  font-size: 12px;
  font-weight: 400;
  color: ${({theme}) => theme.grayFont};
  font-family: ${({theme}) => theme.fontRegular};
`;

const MemoRecent_Text4 = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${({theme}) => theme.text};
  font-family: ${({theme}) => theme.fontRegular};
`;

const MainPage = ({navigation}) => {
  const theme = useContext(ThemeContext);

  const [memos, setMemos] = useState([]);
  const [recentDatas, setRecentDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmptyMemo, setIsEmptyMemo] = useState(true);
  const {width, height} = Dimensions.get('screen');

  const testMemoData = [
    {
      user1: '김반쪽',
      user2: '정은채',
      memoName: '짜증나는 하루',
      colorCode: '#00FF00',
    },
    {
      user1: '김반쪽',
      user2: null,
      memoName: '괌 여행 일기',
      colorCode: '#0000FF',
    },
    {
      user1: '김반쪽',
      user2: '김은지',
      memoName: '우정 일기',
      colorCode: '#FF0000',
    },
  ];

  const testRecentlyData = [
    {
      title: '괌 여행 첫 날',
      content: '드디어 출발이다',
      time: '2022-08-15 12:00',
      colorCode: '#0000FF',
    },
    {
      title: '우정 일기',
      content: '왜 잠굼?',
      time: '2022-06-15 05:30',
      colorCode: '#FF0000',
    },
    {
      title: '여행 계획을 세우자',
      content: '오늘 김반쪽과 만나기로 했다',
      time: '2022-03-18 19:00',
      colorCode: '#00FF00',
    },
    {
      title: '스크롤 테스트',
      content: '내려가니??',
      time: '2022-02-18 13:00',
      colorCode: '#0000FF',
    },
  ];

  const getData = () => {
    // Get From DataBase, Start Spinner
    // console.log('Get Data From QraphQL');
    // console.log(checkDate('2021-12-24 12:00:01'));
    // console.log(checkTime('2021-12-24 12:00:01'));
    // console.log(checkDate('2022-08-15 12:00:01'));
    // readData = [];
    // data['color'].map(item => {
    //   readData.push({id: item.order, color: item.hexCode});
    // });

    setMemos(testMemoData);
    setRecentDatas(testRecentlyData);
    // setColors(readData);
  };

  // Get Query from QraphQL
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (memos.length > 0) {
      setIsEmptyMemo(false);
    } else {
      setIsEmptyMemo(true);
    }
    setIsLoading(false);
    console.log(recentDatas);
  }, [memos, recentDatas]);

  const Item1 = ({item, onPress}) => (
    <MemoItemContainer>
      <LinearGradient
        colors={[item.colorCode, '#EEEEEE']}
        style={{width: '100%', height: '100%', borderRadius: 6}}>
        <MemoDataItem>
          <MemoData_Text1>
            {item.user2 == null
              ? `${item.user1} 님의`
              : `${item.user1} 님과 ${item.user2}님의`}
          </MemoData_Text1>
          <MemoData_Text2>{item.memoName}</MemoData_Text2>
        </MemoDataItem>
        <MemoBtnItem>
          <TouchableOpacity
            onPress={onPress}
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <MemoData_Text3>교환일기 시작</MemoData_Text3>
          </TouchableOpacity>
        </MemoBtnItem>
      </LinearGradient>
    </MemoItemContainer>
  );

  const Item2 = ({item, onPress}) => (
    <MemoRecentItemContainer>
      <MemoRecent_Icon color={item.colorCode}></MemoRecent_Icon>
      <MemoRecentItemLeft>
        <MemoRecent_Text1>{item.title}</MemoRecent_Text1>
        <MemoRecent_Text2>{item.content}</MemoRecent_Text2>
      </MemoRecentItemLeft>
      <MemoRecentItemRight>
        <MemoRecent_Text3>{checkDate(item.time)}</MemoRecent_Text3>
        <MemoRecent_Text3>{checkTime(item.time)}</MemoRecent_Text3>
      </MemoRecentItemRight>
    </MemoRecentItemContainer>
  );

  const renderItem1 = ({item}) => {
    return <Item1 item={item} onPress={() => {}} />;
  };

  const renderItem2 = ({item}) => {
    return <Item2 item={item} onPress={() => {}} />;
  };

  return isLoading ? (
    <SpinnerContainer>
      <Spinner visible={isLoading} textContent={'유저 데이터 로딩 중...'} />
    </SpinnerContainer>
  ) : isEmptyMemo ? (
    <Container>
      <TouchableOpacity
        onPress={() => navigation.navigate('MemoMain')}
        style={{width: '100%', height: '35%'}}>
        <MemoContainer>
          <Memo_Item1>
            <Item1_Text>
              김 반쪽님의 일기&nbsp;
              <Icon name="star" size={18} color={'#F3B949'} />
            </Item1_Text>
          </Memo_Item1>
          <Memo_Item2>
            <Item2_Text>일기를 시작해 보세요!</Item2_Text>
          </Memo_Item2>
          <Memo_Item3>
            <Item3_Text>새 일기장 만들기 또는 초대 코드 입력</Item3_Text>
          </Memo_Item3>
        </MemoContainer>
      </TouchableOpacity>
    </Container>
  ) : (
    <MemoDataContainer>
      <MemoFlexTop>
        <Carousel
          data={memos}
          renderItem={renderItem1}
          sliderWidth={width}
          itemWidth={width}
        />
      </MemoFlexTop>
      <MemoFlexBottom>
        <MemoRecent_Title>Recently</MemoRecent_Title>
        <FlatList
          data={testRecentlyData}
          renderItem={renderItem2}
          numColumns={1}
        />
      </MemoFlexBottom>
      <MemoFlexFooter>
        <TouchableOpacity
          onPress={() => {}}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '5%',
          }}>
          <MemoData_Text3>더 보기 ∨</MemoData_Text3>
        </TouchableOpacity>
      </MemoFlexFooter>
    </MemoDataContainer>
  );
};

export default MainPage;
