import React, {useContext, useState, useEffect} from 'react';
import styled from 'styled-components/native';
import {Text} from 'react-native';
import {UserContext} from '@contexts';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {ThemeContext} from 'styled-components/native';
import {USE_MUTATION} from '@apolloClient/queries';
import {Button, Input, ErrorMessage, ErrorAlert} from '@components';
import Spinner from 'react-native-loading-spinner-overlay';

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.fullWhite};
  flex-direction: column;
  padding-right: 5%;
  padding-left: 5%;
`;

const SpinnerContainer = styled.Text`
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-family: ${({theme}) => theme.fontRegular};
`;

const TitleTextContainer = styled.Text`
  font-size: 20px;
  font-weight: 400;
  margin-top: 10%;
  font-family: ${({theme}) => theme.fontRegular};
`;

const BtnContainer = styled.View`
  padding-right: 5%;
  padding-left: 5%;
  justify-content: center;
  align-items: center;
  margin-bottom: 20%;
`;

const AddInviteCode = ({navigation}) => {
  const [code, setCode] = useState('');
  const theme = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('유효하지 않은 코드입니다.');
  const [isError, setIsError] = useState(false);
  const {user} = useContext(UserContext);
  const [setInviteCode, {data, loading, error}] = USE_MUTATION(
    'SET_INVITE_CODE',
    user.accessToken,
  );

  // [QUERY EVENT FUNCTION] --------------------------------------
  const _handleSetInviteComplete = () => {
    // Set Invite Code
    setIsLoading(true);
    setInviteCode({
      variables: {
        InviteCode: code,
      },
    });
  };

  // [USE EFFECT] -----------------------------------------------
  useEffect(() => {
    if (error != undefined) {
      setIsError(true);
      let jsonData = JSON.parse(JSON.stringify(error));
      if (jsonData.networkError) {
        ErrorAlert();
        setErrorMessage('네트워크 에러');
      } else {
        setErrorMessage(jsonData.message);
      }
      setIsLoading(false);
    } else {
      if (loading || data == undefined) {
        console.log('Data Fecting & Data Empty');
        return;
      }
      // If Success
      if (data?.inviteDiary.adminUser) {
        setIsLoading(false);
        // [TODO] Invite Code Status
        console.log('DATA', data.inviteDiary);
        // If Success
        navigation.navigate('CompleteInviteCode', {
          userName: data.inviteDiary.adminUser.nickname,
          memoName: data.inviteDiary.diary.title,
        });
      } else {
        console.log(data);
        setIsLoading(false);
        ErrorAlert();
      }
    }
  }, [loading]);

  return isLoading ? (
    <SpinnerContainer>
      <Spinner visible={isLoading} textContent={'초대 코드 확인 중...'} />
    </SpinnerContainer>
  ) : (
    <KeyboardAvoidingScrollView
      containerStyle={{
        backgroundColor: theme.fullWhite,
      }}
      stickyFooter={
        <BtnContainer>
          <Button
            title="다음 단계로"
            onPress={_handleSetInviteComplete}
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
      }>
      <Container>
        <TitleTextContainer>
          <Text>전달받은 초대 코드를 입력하세요</Text>
        </TitleTextContainer>
        <Input
          value={code}
          onChangeText={setCode}
          onSubmitEditing={_handleSetInviteComplete}
          onBlur={() => setCode(code.trim())}
          placeholder="8자 이내 한글 or 영문"
          returnKeyType="next"
          maxLength={8}
          isError={isError}
        />
        {isError && (
          <ErrorMessage
            message={errorMessage}
            IconColor={theme.error}
            IconType="exclamationcircleo"
          />
        )}
      </Container>
    </KeyboardAvoidingScrollView>
  );
};

export default AddInviteCode;
