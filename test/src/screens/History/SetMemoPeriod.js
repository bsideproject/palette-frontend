import React, {useContext, useEffect} from 'react';
import {ThemeContext} from 'styled-components/native';
import styled from 'styled-components/native';
import {Button} from '@components';
import {UserContext} from '@contexts';
import {USE_MUTATION} from '@apolloClient/queries';

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

const SetMemoPeriod = ({navigation, route}) => {
  const theme = useContext(ThemeContext);
  const {user} = useContext(UserContext);
  const [updateDiaryPeriod, {data, loading, error}] = USE_MUTATION(
    'REGISTER_DIARY_PERIOD',
    user.accessToken,
  );

  const _handleSetMemoPeriod = period => {
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

  useEffect(() => {
    if (error != undefined) {
      console.log('ERROR: ', JSON.stringify(error));
      // [TODO] Go to Error Page
    } else {
      if (loading || data == undefined) {
        console.log('Data Fecting & Data Empty');
        return;
      }
      console.log('DATA', data);
      if (data?.createHistory.historyId) {
        navigation.navigate('Home');
      } else {
        console.log('Loading or Error', data);
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

  return (
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
