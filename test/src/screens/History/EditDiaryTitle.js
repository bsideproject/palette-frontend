import React, {useContext, useState, useEffect} from 'react';
import {ThemeContext} from 'styled-components/native';
import styled from 'styled-components/native';
import {Text} from 'react-native';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {Button, Input, ErrorMessage} from '@components';
import {USE_QUERY, USE_MUTATION} from '@apolloClient/queries';
import {UserContext} from '@contexts';

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.fullWhite};
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

const EditDiaryTitle = ({navigation, route}) => {
  const [name, setName] = useState('');
  const theme = useContext(ThemeContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const pattern_spc = /[~!@#$%^&*()_+|<>?:{}]/; // 특수문자
  const {user} = useContext(UserContext);
  const [updateDiaryTitle, {data, loading, error}] = USE_MUTATION(
    'UPDATE_DIARY_TITLE',
    user.accessToken,
  );

  const _handleSetMemoColorPress = () => {
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
      console.log('Receive Data: ', route.params, name);
      updateDiaryTitle({
        variables: {
          diaryId: route.params,
          title: name,
        },
      });
    }
  };

  // [USE EFFECT] -----------------------------------------------
  useEffect(() => {
    if (error != undefined) {
      let jsonData = JSON.parse(JSON.stringify(error));
      console.log(jsonData);
      // [TODO] Go to Error Page
    } else {
      if (loading || data == undefined) {
        console.log('Data Fecting & Data Empty');
        return;
      }
      // Not Check Data Is True..
      console.log('Success Data', data);
      // If Success
      navigation.goBack();
    }
  }, [loading]);

  return (
    <KeyboardAvoidingScrollView
      containerStyle={{
        backgroundColor: theme.fullWhite,
      }}
      stickyFooter={
        <BtnContainer>
          <Button
            title="이름 수정하기"
            onPress={_handleSetMemoColorPress}
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
          <Text>일기장 이름을 입력해보세요.</Text>
        </TitleTextContainer>
        <Input
          value={name}
          onChangeText={setName}
          onSubmitEditing={_handleSetMemoColorPress}
          onBlur={() => setName(name.trim())}
          placeholder="최대 12자의 일기장 이름을 입력하세요"
          returnKeyType="next"
          maxLength={12}
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

export default EditDiaryTitle;
