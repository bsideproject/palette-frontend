import React, {useContext, useEffect, useState} from 'react';
import {ThemeContext} from 'styled-components/native';
import styled from 'styled-components/native';
import {Button} from '@components';
import {UserContext} from '@contexts';
import {USE_MUTATION} from '@apolloClient/queries';
import Spinner from 'react-native-loading-spinner-overlay';
import {ErrorAlert} from '@components';

const SetMemoFlexTop = styled.View`
  justify-content: center;
  align-items: center;
  flex: 2;
`;

const SetMemoFlexBottom = styled.View`
  flex: 3;
`;

const SetMemoTxt_1 = styled.Text`
  text-align: center;
  font-size: 20px;
  font-family: ${({theme}) => theme.fontRegular};
  font-weight: 400;
  color: ${({theme}) => theme.dark010};
`;

const SetMemoTxt_2 = styled.Text`
  text-align: center;
  font-size: 14px;
  font-family: ${({theme}) => theme.fontRegular};
  font-weight: 400;
  color: ${({theme}) => theme.error};
`;

const SetMemmoMargin = styled.View`
  margin-top: 5%;
`;

const BtnContainer = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 5%;
`;

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.fullWhite};
  flex-direction: column;
  padding-right: 5%;
  padding-left: 5%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const SpinnerContainer = styled.Text`
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-family: ${({theme}) => theme.fontRegular};
`;

const SetMemoPeriod = ({navigation, route}) => {
  const theme = useContext(ThemeContext);
  const {user} = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [updateDiaryPeriod, {data, loading, error}] = USE_MUTATION(
    'REGISTER_DIARY_PERIOD',
    user.accessToken,
  );

  // [QUERY EVENT FUNCTION] --------------------------------------
  const _handleSetMemoPeriod = period => {
    setIsLoading(true);
    console.log(route.params.id);
    console.log(period);
    // [TODO] Read Diary Id
    updateDiaryPeriod({
      variables: {
        diaryId: route.params.id,
        period: period,
      },
    });
  };

  // [USE EFFECT] -----------------------------------------------
  useEffect(() => {
    if (error != undefined) {
      console.log('ERROR: ', JSON.stringify(error));
      setIsLoading(false);
      ErrorAlert();
    } else {
      if (loading || data == undefined) {
        console.log('Data Fecting & Data Empty');
        return;
      }
      console.log('DATA', data);
      if (data?.createHistory.historyId) {
        setIsLoading(false);
        navigation.navigate('Home');
      } else {
        console.log('Loading or Error', data);
        setIsLoading(false);
        ErrorAlert();
      }
    }
  }, [loading]);

  const periodBtnContainer = period => {
    return (
      <Button
        title={`${period}일`}
        onPress={() => _handleSetMemoPeriod(period)}
        containerStyle={{
          backgroundColor: theme.fullWhite,
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        textStyle={{
          color: theme.dark010,
          fontSize: 18,
          fontWeight: '700',
          fontFamily: theme.fontRegular,
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    );
  };

  return isLoading ? (
    <SpinnerContainer>
      <Spinner visible={isLoading} textContent={'기간 설정 중...'} />
    </SpinnerContainer>
  ) : (
    <Container>
      <SetMemoFlexTop>
        <SetMemoTxt_1>일기장을 교환하기까지</SetMemoTxt_1>
        <SetMemoTxt_1>일기작성 기간을 선택해주세요</SetMemoTxt_1>
        <SetMemmoMargin />
        <SetMemoTxt_2>※선택된 기간 동안은</SetMemoTxt_2>
        <SetMemoTxt_2>상대방의 일기를 볼 수 없습니다</SetMemoTxt_2>
      </SetMemoFlexTop>
      <SetMemoFlexBottom>
        <BtnContainer>{periodBtnContainer(3)}</BtnContainer>
        <BtnContainer>{periodBtnContainer(7)}</BtnContainer>
        <BtnContainer>{periodBtnContainer(15)}</BtnContainer>
        <BtnContainer>{periodBtnContainer(30)}</BtnContainer>
      </SetMemoFlexBottom>
    </Container>
  );
};

export default SetMemoPeriod;
