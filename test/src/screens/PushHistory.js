import React, {useContext, useEffect, useState} from 'react';
import {ThemeContext} from 'styled-components/native';
import styled from 'styled-components/native';
import {UserContext} from '@contexts';
import Spinner from 'react-native-loading-spinner-overlay';
import {USE_QUERY, USE_MUTATION} from '@apolloClient/queries';
import {FlatList} from 'react-native-gesture-handler';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import {ErrorAlert} from '@components';

const checkDateDiff = ts => {
  // Convert Korea Time
  const now = moment().startOf('day');
  const target = moment(ts).startOf('day');

  return now.diff(target, 'day');
};

const checkTime = ts => {
  return moment(ts).format('hh:mm');
};

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.fullWhite};
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

// Spinner
const SpinnerContainer = styled.Text`
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-family: ${({theme}) => theme.fontRegular};
`;

const PushItemContainer = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  height: 100;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.light020};
  padding-right: 7%;
  padding-left: 7%;
`;

const PushItemTop = styled.View`
  justify-content: center;
  flex: 3;
`;

const PushItemBottom = styled.View`
  flex: 1;
  margin-bottom: 2%;
`;

const PushItemTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({theme}) => theme.dark010};
  font-family: ${({theme}) => theme.fontRegular};
`;

const PushItemDate = styled.Text`
  font-size: 13px;
  font-weight: 500;
  color: ${({theme}) => theme.dark010};
  font-family: ${({theme}) => theme.fontRegular};
`;

const NewIcon = styled.View`
  background-color: #fc2f2f;
  width: 14px;
  height: 14px;
  border-radius: 50px;
`;

const NewIconReaded = styled.View`
  flex: 1;
`;

const NewIconTxt = styled.Text`
  font-size: 10px;
  font-weight: 500;
  color: ${({theme}) => theme.fullWhite};
  font-family: ${({theme}) => theme.fontRegular};
  text-align: center;
`;

const IntervalPushItem = styled.View`
  margin-top: 2%;
`;

const PushHistory = ({navigation}) => {
  const theme = useContext(ThemeContext);
  const {user} = useContext(UserContext);
  const [pushHistory, setPushHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {loading, error, data, refetch} = USE_QUERY(
    'LOOK_UP_PUSH_HISTORY',
    user.accessToken,
  );
  const [
    readAlarmHistory,
    {loading: loadingRAH, error: errorRAH, data: dataRAH},
  ] = USE_MUTATION('READ_PUSH_HISTORY', user.accessToken);
  const focus = useIsFocused();

  const getData = () => {
    if (error != undefined) {
      console.log('ERROR: ', JSON.stringify(error));
      setIsLoading(false);
      ErrorAlert();
    } else {
      if (loading || data == undefined) {
        console.log('Data Fecting & Data Empty');
        return;
      }
      let readData = [];
      data['alarmHistories'].map(item => {
        //console.log(item.id, item.isRead);
        readData.push({
          id: item.id,
          body: item.body,
          isRead: item.isRead,
          createdAt: item.createdAt,
        });
      });
      setPushHistory(readData);

      let unReadData = [];
      data['alarmHistories'].map(item => {
        if (item.isRead == false) {
          unReadData.push(item.id);
        }
      });

      if (unReadData.length == 0) {
        setIsLoading(false);
      } else {
        readAlarmHistory({
          variables: {
            alarmHistoryIds: unReadData,
          },
        });
      }
    }
  };

  // [USE EFFECT] -----------------------------------------------
  useEffect(() => {
    if (focus) {
      setIsLoading(true);
      refetch();
      getData();
    }
  }, [focus, loading]);

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
      setIsLoading(false);
    }
  }, [loadingRAH]);

  const Item = ({item}) => (
    <PushItemContainer
      style={item.body.length > 56 ? {height: 130} : {height: 100}}>
      <PushItemTop>
        <PushItemTitle>
          {item.isRead == false ? (
            <NewIcon>
              <NewIconTxt>N</NewIconTxt>
            </NewIcon>
          ) : (
            <NewIconReaded />
          )}
          &nbsp;&nbsp;
          {item.body}
        </PushItemTitle>
      </PushItemTop>
      <PushItemBottom>
        <PushItemDate>
          {checkDateDiff(item.createdAt) == 0
            ? checkTime(item.createdAt)
            : checkDateDiff(item.createdAt) + '일 전'}
        </PushItemDate>
      </PushItemBottom>
    </PushItemContainer>
  );

  const renderItem = ({item}) => {
    return <Item item={item} />;
  };

  return isLoading ? (
    <SpinnerContainer>
      <Spinner visible={isLoading} textContent={'푸시 히스토리 조회 중...'} />
    </SpinnerContainer>
  ) : (
    <Container>
      <FlatList
        data={pushHistory}
        renderItem={renderItem}
        numColumns={1}
        initialNumToRender={pushHistory.length}
      />
    </Container>
  );
};

export default PushHistory;
