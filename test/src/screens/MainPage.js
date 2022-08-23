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
import Clipboard from '@react-native-clipboard/clipboard';
import AutoHeightImage from 'react-native-auto-height-image';
import Icon_Ionicons from 'react-native-vector-icons/Ionicons';
import {Button} from '@components';
import {utcToKst} from '~/src/utils';

// Time & Date Function
const checkDate = ts => {
  // [TODO] UTC Time Convert
  const now = moment().startOf('day');
  const target = moment(ts).startOf('day');

  // Today Check
  if (now.diff(target, 'day') > 0) {
    return moment(utcToKst(ts)).format('MM/DD');
  } else {
    return 'Today';
  }
};

const checkTime = ts => {
  return moment(utcToKst(ts)).format('hh:mm A');
};

// Spinner
const SpinnerContainer = styled.Text`
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-family: ${({theme}) => theme.fontRegular};
`;

// Memo Data Container
const MemoDataContainer = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: ${({theme}) => theme.homeColor};
  padding-left: 5%;
  padding-right: 5%;
`;

// Memo Flex 2 : 3 : 1
const MemoFlexTop = styled.View`
  flex: 4;
`;

const MemoFlexBottom = styled.View`
  flex: 6;
`;

const MemoFlexFooter = styled.View`
  flex: 1;
  margin-bottom: 5%;
`;

// Memo Empty Container
const MemoEmpty_Text1 = styled.Text`
  font-size: 16px;
  font-weight: 400;
  margin-top: 15%;
  text-align: center;
  color: ${({theme}) => theme.dark010};
  font-family: ${({theme}) => theme.fontRegular};
`;

// Memo Add Container
const MemoAdd_Text1 = styled.Text`
  font-size: 50px;
  font-weight: 400;
  text-align: center;
  color: ${({theme}) => theme.dark010};
  font-family: ${({theme}) => theme.fontRegular};
`;

// Memo Item Container
const MemoDataItem = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
`;

const MemoBtnItem = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-bottom: 5%;
  margin-top: 5%;
  width: 70%;
`;

const MemoData_Text1 = styled.Text`
  font-size: 16px;
  font-weight: 400;
  margin-top: 5%;
  color: ${({theme}) => theme.white};
  font-family: ${({theme}) => theme.fontRegular};
`;

const MemoData_Text2 = styled.Text`
  font-size: 25px;
  font-weight: 700;
  margin-top: 3%;
  color: ${({theme}) => theme.white};
  font-family: ${({theme}) => theme.fontRegular};
`;

const MemoData_Text3 = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${({theme}) => theme.white};
  font-family: ${({theme}) => theme.fontRegular};
`;

// Memo Recently
const MemoRecentItemContainer = styled.View`
  border-radius: 10px;
  flex: 1;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 60;
  margin-bottom: 5%;
  background-color: ${({color}) => color};
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
  margin-top: 3%;
  margin-bottom: 5%;
  color: ${({theme}) => theme.dark010};
  font-family: ${({theme}) => theme.fontRegular};
`;

const MemoRecent_Icon = styled.View`
  margin-left: 3%;
  width: 40;
`;

const MemoRecent_Text1 = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${({theme}) => theme.dark010};
  font-family: ${({theme}) => theme.fontRegular};
`;

const MemoRecent_Text2 = styled.Text`
  font-size: 14px;
  font-weight: 400;
  color: ${({theme}) => theme.dark030};
  font-family: ${({theme}) => theme.fontRegular};
`;

const MemoRecent_Text3 = styled.Text`
  font-size: 12px;
  font-weight: 400;
  color: ${({theme}) => theme.dark030};
  font-family: ${({theme}) => theme.fontRegular};
`;

const MemoRecent_Text4 = styled.Text`
  font-size: 25px;
  font-weight: 700;
  color: ${({theme}) => theme.dark020};
  font-family: ${({theme}) => theme.fontRegular};
`;

const BtnContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const Text_underline = styled.Text`
  text-decoration-line: underline;
`;

const MainPage = ({navigation}) => {
  const theme = useContext(ThemeContext);
  const [memos, setMemos] = useState([{isAddContainer: true}]);
  const [recentData, setRecentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {width, height} = Dimensions.get('screen');
  const [slideIdx, setSlideIdx] = useState();
  const PROFILE_IMG_DEFAULT = require('/assets/icons/profile_default_memo.png');

  const testMemoData = [
    {
      startColorCode: '#FF0000',
      endColorCode: '#222222',
      adminUser: '김반쪽',
      title: '제주도 한달살이 일기',
      diaryStatus: 'WAIT',
      invitationCode: 'ZVABWzCe',
    },
    {
      startColorCode: '#00FF00',
      endColorCode: '#222222',
      adminUser: '김반쪽',
      partnerUser: '홍길동',
      title: '제주도 두달살이 일기',
      diaryStatus: 'READY',
    },
    {
      startColorCode: '#0000FF',
      endColorCode: '#222222',
      adminUser: '김반쪽',
      partnerUser: '홍길동',
      title: '제주도 세달살이 일기',
      diaryStatus: 'START',
      dday: 1,
    },
  ];

  const testRecentlyData = [
    {
      user: {
        profileImg: 'https://...',
      },
      title: '괌여행 첫날',
      content: '드디어 출발이다..',
      createdAt: '2022-08-09 22:41:56.045248',
    },
    {
      user: {
        profileImg: 'https://...',
      },
      dday: 3,
      createdAt: '2022-08-07 12:41:56.045248',
    },
    {
      user: {
        profileImg: 'https://...',
      },
      title: '여행 계획을 세우자',
      content: '오늘 김반쪽과 만나기로 했다..',
      createdAt: '2022-08-03 07:11:36.045248',
    },
  ];

  const getData = () => {
    // Get From DataBase, Start Spinner
    // console.log('Get Data From QraphQL');

    // Diary, Page 분리
    setMemos(memos.concat(testMemoData));
    setRecentData(testRecentlyData);

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Get Query from QraphQL
  useEffect(() => {
    getData();
  }, []);

  const AddContainer = () => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('MemoMain')}
        style={{
          backgroundColor: theme.light010,
          width: '100%',
          height: '80%',
          marginTop: '8%',
          borderRadius: 6,
          borderColor: theme.fullWhite,
          borderStyle: 'solid',
          borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: 'rgba(0, 0, 0, 0.16)',
          shadowOffset: '0px 4px',
          shadowRadius: '8px',
          elevation: 15,
        }}>
        <Icon name="plus" size={35} color={theme.dark010} />
      </TouchableOpacity>
    );
  };

  const MemoStatusContainer = item => {
    switch (item.diaryStatus) {
      case 'WAIT':
        return (
          <LinearGradient
            colors={[item.startColorCode, item.endColorCode]}
            style={{
              width: '100%',
              height: '80%',
              marginTop: '8%',
              borderRadius: 6,
            }}>
            <MemoDataItem>
              <MemoData_Text1>{item.adminUser}님의</MemoData_Text1>
              <MemoData_Text2>{item.title}</MemoData_Text2>
              <MemoBtnItem>
                <TouchableOpacity
                  onPress={() => Clipboard.setString(item.invitationCode)}>
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
            </MemoDataItem>
          </LinearGradient>
        );
      case 'READY':
        return (
          <LinearGradient
            colors={[item.startColorCode, item.endColorCode]}
            style={{
              width: '100%',
              height: '80%',
              marginTop: '8%',
              borderRadius: 6,
            }}>
            <MemoDataItem>
              <MemoData_Text1>
                {item.adminUser}님과 {item.partnerUser}님의
              </MemoData_Text1>
              <MemoData_Text2>{item.title}</MemoData_Text2>
              <MemoBtnItem>
                <MemoData_Text3>
                  <Text_underline>진행중인 교환일기가 없어요!</Text_underline>
                </MemoData_Text3>
              </MemoBtnItem>
            </MemoDataItem>
          </LinearGradient>
        );
      case 'START':
        return (
          <TouchableOpacity
            onPress={() => navigation.navigate('History', item)}
            style={{
              width: '100%',
              height: '80%',
              marginTop: '8%',
            }}>
            <LinearGradient
              colors={[item.startColorCode, item.endColorCode]}
              style={{width: '100%', height: '100%', borderRadius: 6}}>
              <MemoDataItem>
                <MemoData_Text1>
                  {item.adminUser}님과 {item.partnerUser}님의
                </MemoData_Text1>
                <MemoData_Text2>{item.title}</MemoData_Text2>
                <MemoBtnItem>
                  <MemoData_Text3 style={{fontSize: 24}}>
                    D-{item.dday}
                  </MemoData_Text3>
                </MemoBtnItem>
              </MemoDataItem>
            </LinearGradient>
          </TouchableOpacity>
        );
    }
  };

  // [TODO] Go To History Page, Gradient Color Code
  const Item1 = ({item}) =>
    item.isAddContainer ? AddContainer() : MemoStatusContainer(item);

  const RecentContent = item => {
    if (item.dday) {
      return (
        <MemoRecentItemLeft
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <Icon
            name="lock"
            size={30}
            color={theme.dark020}
            style={{marginRight: 3}}
          />
          <MemoRecent_Text4>D-{item.dday}</MemoRecent_Text4>
        </MemoRecentItemLeft>
      );
    } else {
      return (
        <MemoRecentItemLeft>
          <MemoRecent_Text1>{item.title}</MemoRecent_Text1>
          <MemoRecent_Text2>{item.content}</MemoRecent_Text2>
        </MemoRecentItemLeft>
      );
    }
  };

  const Item2 = ({item}) => (
    //[TODO] Item.user.profileImg using
    <MemoRecentItemContainer color={item.dday ? theme.homeColor : theme.white}>
      <MemoRecent_Icon>
        <AutoHeightImage
          width={40}
          maxHeight={60}
          source={PROFILE_IMG_DEFAULT}
          style={{
            borderRadius: 50,
          }}
        />
      </MemoRecent_Icon>
      {RecentContent(item)}
      <MemoRecentItemRight>
        <MemoRecent_Text3>{checkDate(item.createdAt)}</MemoRecent_Text3>
        <MemoRecent_Text3>{checkTime(item.createdAt)}</MemoRecent_Text3>
      </MemoRecentItemRight>
    </MemoRecentItemContainer>
  );

  const renderItem1 = ({item}) => {
    return <Item1 item={item} />;
  };

  const renderItem2 = ({item}) => {
    return <Item2 item={item} />;
  };

  const renderBtnFooter = sliderIdx => {
    if (sliderIdx > 0 && memos[sliderIdx].diaryStatus == 'READY') {
      return (
        <BtnContainer>
          <Button
            title="새 교환 일기 시작"
            onPress={() =>
              navigation.navigate('SetMemoPeriod', memos[sliderIdx])
            }
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
        </BtnContainer>
      );
    } else if (sliderIdx > 0 && memos[sliderIdx].diaryStatus == 'START') {
      return (
        <BtnContainer>
          <Button
            title="오늘 일기 쓰기"
            onPress={() => {}}
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
        </BtnContainer>
      );
    }
  };

  return isLoading ? (
    <SpinnerContainer>
      <Spinner visible={isLoading} textContent={'유저 데이터 로딩 중...'} />
    </SpinnerContainer>
  ) : (
    <MemoDataContainer>
      <MemoFlexTop>
        <Carousel
          data={memos}
          renderItem={renderItem1}
          sliderWidth={width * 0.9}
          itemWidth={width * 0.9}
          firstItem={1}
          onBeforeSnapToItem={slideIndex => setSlideIdx(slideIndex)}
        />
      </MemoFlexTop>
      <MemoFlexBottom>
        <MemoRecent_Title>최근 반쪽</MemoRecent_Title>
        {recentData.length == 0 ? (
          <MemoEmpty_Text1>최근 작성한 교환일기가 없어요</MemoEmpty_Text1>
        ) : (
          <FlatList data={recentData} renderItem={renderItem2} numColumns={1} />
        )}
      </MemoFlexBottom>
      <MemoFlexFooter>{renderBtnFooter(slideIdx)}</MemoFlexFooter>
    </MemoDataContainer>
  );
};

export default MainPage;
