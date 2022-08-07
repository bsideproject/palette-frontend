import React, {useContext, useState} from 'react';
import styled from 'styled-components/native';
import {DB} from '../db_connect';
import {Text} from 'react-native';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {ThemeContext} from 'styled-components/native';
import {Button, Input, ErrorMessage} from '../components';

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.background};
  flex-direction: column;
  padding-right: 5%;
  padding-left: 5%;
`;

const TitleTextContainer = styled.Text`
  font-size: 20px;
  font-weight: 400;
  margin-top: 10%;
  font-family: ${({theme}) => theme.fontRegular};
`;

const BtnContainer = styled.View`
  width: 95%;
  padding-left: 5%;
  justify-content: center;
  align-items: center;
  margin-bottom: 30%;
`;

const AddInviteCode = ({navigation}) => {
  const [code, setCode] = useState('');
  const theme = useContext(ThemeContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const _handleSetInviteComplete = () => {
    // Check Valid Type
    console.log('Set Code Invite Check');
    setIsError(true);

    // check Invite Code
    setErrorMessage('유효하지 않은 코드입니다.');

    // navigation.navigate('AddMemoColor', {name: name});
  };

  return (
    <KeyboardAvoidingScrollView
      stickyFooter={
        <BtnContainer>
          <Button
            title="다음 단계로"
            onPress={_handleSetInviteComplete}
            containerStyle={{
              backgroundColor: theme.btnMainColorBg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            textStyle={{
              color: theme.btnWhiteFont,
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
            IconColor={theme.inputValidChkColor}
            IconType="exclamationcircleo"
          />
        )}
      </Container>
    </KeyboardAvoidingScrollView>
  );
};

export default AddInviteCode;
