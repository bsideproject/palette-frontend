import React, {useContext, useState} from 'react';
import {ThemeContext} from 'styled-components/native';
import styled from 'styled-components/native';
import {DB} from '../db_connect';
import {Text} from 'react-native';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
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
  padding-right: 5%;
  padding-left: 5%;
  justify-content: center;
  align-items: center;
  margin-bottom: 30%;
`;

const AddMemo = ({navigation}) => {
  const [name, setName] = useState('');
  const theme = useContext(ThemeContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const pattern_spc = /[~!@#$%^&*()_+|<>?:{}]/; // 특수문자

  const _handleSetMemoColorPress = () => {
    // Check Valid Type
    console.log('Set Memo Color Press');
    setIsError(true);

    if (name.length == 0) {
      setErrorMessage('일기장 제목을 입력해주세요.');
    } else if (name.length < 1 || name.length > 12) {
      setErrorMessage('1자~12자의 제목을 입력해주세요.');
    } else if (pattern_spc.test(name)) {
      setErrorMessage('특수문자를 제외한 제목을 입력해주세요.');
    } else {
      setIsError(false);
      navigation.navigate('AddMemoColor', {name: name});
    }
  };

  return (
    <KeyboardAvoidingScrollView
      stickyFooter={
        <BtnContainer>
          <Button
            title="다음 단계로"
            onPress={_handleSetMemoColorPress}
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
          <Text>일기장 이름을 입력해보세요.</Text>
        </TitleTextContainer>
        <Input
          value={name}
          onChangeText={setName}
          onSubmitEditing={_handleSetMemoColorPress}
          onBlur={() => setName(name.trim())}
          placeholder="최대 12자의 그룹 이름을 입력하세요"
          returnKeyType="next"
          maxLength={12}
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

export default AddMemo;
