import React, {useContext, useState, useEffect} from 'react';
import {Button, Input, ErrorMessage} from '@components';
import styled from 'styled-components/native';
import {TouchableOpacity, View, Text} from 'react-native';
import {ThemeContext} from 'styled-components/native';
import Icon from 'react-native-vector-icons/AntDesign';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {USE_MUTATION} from '@apolloClient/queries';
import AsyncStorage from '@react-native-community/async-storage';
import {ErrorAlert} from '@components';
import Spinner from 'react-native-loading-spinner-overlay';
import {Flow} from 'react-native-animated-spinkit';

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.fullWhite};
  flex-direction: column;
`;

const InnerContainer = styled.View`
  padding: 0 16px;
`;

const SubTitleText = styled.Text`
  font-family: ${({theme}) => theme.fontRegular};
  font-size: 20px;
  margin-top: 30.5px;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.View`
  padding: 0 16px;
  margin-bottom: 106px;
`;

const SpinnerContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-family: ${({theme}) => theme.fontRegular};
`;

const Nickname = ({navigation, route}) => {
  const {params} = route;
  const [pass, setPass] = useState(false);
  const [nickname, setNickname] = useState('');
  const theme = useContext(ThemeContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pattern_spc = /[~!@#$%^&*()_+|<>?:{}\s]/; // 특수문자
  const [accessToken, setAccessToken] = useState(null);
  const [updateProfile, {data, loading, error}] = USE_MUTATION(
    'UPDATE_PROFILE',
    accessToken,
  );

  const _handleNextButtonPress = () => {
    setIsError(true);

    if (nickname.length === 0) {
      setErrorMessage('닉네임을 입력해 주세요.');
    } else if (nickname.length < 1 || nickname.length > 8) {
      setErrorMessage('1자 ~ 8자의 닉네임을 입력해주세요.');
    } else if (pattern_spc.test(nickname)) {
      setErrorMessage('특수문자와 공백을 제외한 닉네임을 입력해주세요.');
    } else {
      setIsError(false);
      setIsLoading(true);
      updateProfile({
        variables: {nickname: nickname},
      });
    }
  };

  useEffect(() => {
    if (error != undefined) {
      let jsonData = JSON.parse(JSON.stringify(error));
      console.log(jsonData);
      setIsLoading(false);
      ErrorAlert();
    } else {
      if (loading || data == undefined) {
        console.log('Data Fecting & Data Empty');
        return;
      }
      // Not Check Data Is True..
      console.log(data);
      setIsLoading(false);
      if (params) navigation.goBack();
      else navigation.navigate('ProfileImageSet');
    }
  }, [loading]);

  useEffect(() => {
    AsyncStorage.getItem('access_token', (err, result) => {
      setAccessToken(result);
    });
  }, []);

  useEffect(() => {
    if (nickname.length >= 1 && nickname.length <= 8) {
      setPass(prevState => true);
    } else {
      setPass(prevState => false);
    }
  }, [nickname]);

  return isLoading ? (
    <SpinnerContainer>
      <Flow animating={isLoading} size={100} color={theme.pointColor} />
    </SpinnerContainer>
  ) : (
    <Container>
      <KeyboardAvoidingScrollView
        containerStyle={{
          backgroundColor: theme.fullWhite,
        }}
        stickyFooter={
          <ButtonContainer pointerEvents={pass ? 'auto' : 'none'}>
            <Button
              title={params ? '확인' : '다음 단계로'}
              onPress={_handleNextButtonPress}
              containerStyle={{
                backgroundColor: pass ? theme.pointColor : theme.dark040,
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
          </ButtonContainer>
        }>
        <InnerContainer>
          <SubTitleText>사용하실 닉네임을 알려주세요!</SubTitleText>
          <Input
            value={nickname}
            onChangeText={setNickname}
            onSubmitEditing={_handleNextButtonPress}
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
        </InnerContainer>
      </KeyboardAvoidingScrollView>
    </Container>
  );
};

export default Nickname;
