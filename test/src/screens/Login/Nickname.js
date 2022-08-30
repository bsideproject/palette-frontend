import React, {useContext, useState, useEffect} from 'react';
import {Button, Input, ErrorMessage} from '@components';
import styled from 'styled-components/native';
import {TouchableOpacity, View, Text} from 'react-native';
import {ThemeContext} from 'styled-components/native';
import Icon from 'react-native-vector-icons/AntDesign';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {USE_MUTATION} from '@apolloClient/queries';
import AsyncStorage from '@react-native-community/async-storage';

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

const Nickname = ({navigation}) => {
  const [pass, setPass] = useState(false);
  const [socialType, setSocialType] = useState('');
  const [nickname, setNickname] = useState('');
  const theme = useContext(ThemeContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const pattern_spc = /[~!@#$%^&*()_+|<>?:{}\s]/; // 특수문자
  const [accessToken, setAccessToken] = useState(null);
  const [updateProfile, updateResult] = USE_MUTATION(
    'UPDATE_PROFILE',
    accessToken,
  );

  const _handleNextButtonPress = () => {
    // Check Valid Type
    console.log('Set Memo Color Press');
    setIsError(true);

    if (nickname.length === 0) {
      setErrorMessage('닉네임을 입력해 주세요.');
    } else if (nickname.length < 1 || nickname.length > 8) {
      setErrorMessage('1자 ~ 8자의 닉네임을 입력해주세요.');
    } else if (pattern_spc.test(nickname)) {
      setErrorMessage('특수문자와 공백을 제외한 닉네임을 입력해주세요.');
    } else {
      setIsError(false);
      updateProfile({
        variables: {nickname: nickname, socialTypes: [socialType]},
      });
      navigation.navigate('ProfileImageSet');
    }
  };

  useEffect(() => {
    AsyncStorage.getItem('access_token', (err, result) => {
      setAccessToken(result);
    });
    AsyncStorage.getItem('social_type', (err, result) => {
      console.log(result);
      setSocialType(result);
    });
  }, []);

  useEffect(() => {
    if (nickname.length >= 1 && nickname.length <= 8) {
      setPass(prevState => true);
    } else {
      setPass(prevState => false);
    }
  }, [nickname]);

  useEffect(() => {
    if (!!updateResult.data) {
      console.log(
        'UPDATE_PROFILE GRAPHQL RESULT DATA 닉네임설정',
        updateResult.data,
      );
    }
  }, [updateResult]);

  return (
    <Container>
      <KeyboardAvoidingScrollView
        containerStyle={{
          backgroundColor: theme.fullWhite,
        }}
        stickyFooter={
          <ButtonContainer pointerEvents={pass ? 'auto' : 'none'}>
            <Button
              title="다음 단계로"
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
