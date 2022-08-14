import React, {useContext, useState, useEffect} from 'react';
import {Button, Input, ErrorMessage} from '../components';
import styled from 'styled-components/native';
import {TouchableOpacity, View, Text} from 'react-native';
import {ThemeContext} from 'styled-components/native';
import Icon from 'react-native-vector-icons/AntDesign';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.background};
  flex-direction: column;
`;

const InnerContainer = styled.View`
  padding: 0 16px;
`;

const TitleContainer = styled.View`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  border-bottom-color: #eeeeee;
  border-bottom-width: 1px;
  width: 100%;
  height: 60px;
  padding: 0 24px;
`;

const TitleText = styled.Text`
  font-family: ${({theme}) => theme.fontBold};
  font-size: 16px;
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

const Nickname = ({navigation, route}) => {
  const [nickname, setNickname] = useState('');
  const theme = useContext(ThemeContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const pattern_spc = /[~!@#$%^&*()_+|<>?:{}]/; // 특수문자

  const _handleNextButtonPress = () => {
    navigation.navigate('ProfileImageSet', route.params);

    // Check Valid Type
    console.log('Set Memo Color Press');
    setIsError(true);

    if (nickname.length == 0) {
      setErrorMessage('아직 6자리가 아니에요.');
    } else if (nickname.length < 1 || nickname.length > 8) {
      setErrorMessage('1자~8자의 닉네임을 입력해주세요.');
    } else if (pattern_spc.test(nickname)) {
      setErrorMessage('특수문자를 제외한 제목을 입력해주세요.');
    } else {
      navigation.navigate('ProfileImageSet');
    }
  };

  return (
    <Container>
      <KeyboardAvoidingScrollView
        stickyFooter={
          <ButtonContainer>
            <Button
              title="다음 단계로"
              onPress={_handleNextButtonPress}
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
          </ButtonContainer>
        }>
        <TitleContainer>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name={'left'} size={15} color={'black'} />
          </TouchableOpacity>
          <TitleText>닉네임 설정</TitleText>
          <TouchableOpacity>
            <Icon name={'close'} size={15} color={'black'} />
          </TouchableOpacity>
        </TitleContainer>
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
              IconColor={theme.inputValidChkColor}
              IconType="exclamationcircleo"
            />
          )}
        </InnerContainer>
      </KeyboardAvoidingScrollView>
    </Container>
  );
};

export default Nickname;
