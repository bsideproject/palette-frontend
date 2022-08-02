import React, {useContext, useState} from 'react';
import styled from 'styled-components/native';
import {DB} from '../db_connect';
import Icon from 'react-native-vector-icons/AntDesign';
import {View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import Modal from 'react-native-simple-modal';
import {ThemeContext} from 'styled-components/native';
import {Button, Input, ErrorMessage} from '../components';

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.background};
`;

const TitleContainer = styled.View`
  flex-direction: column;
  width: 100%;
  height: 70%;
  margin-top: 10%;
  margin-left: 7%;
`;

const TitleTextContainer = styled.Text`
  font-size: 20px;
  font-weight: 600;
`;

const FooterContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const AddInviteCode = ({navigation}) => {
  const [code, setCode] = useState('');
  const theme = useContext(ThemeContext);
  const [errorMessage, setErrorMessage] = useState('');

  const _handleCheckValidCode = () => {
    // Check Code <-> DB Connect
    console.log('Set Came');

    // IF Error Case
    setErrorMessage('유효하지 않은 코드입니다.');
  };

  return (
    <Container>
      <TitleContainer>
        <TitleTextContainer>
          <Text>초대 코드를 입력해주세요.</Text>
        </TitleTextContainer>

        <Input
          label="초대 코드"
          value={code}
          onChangeText={setCode}
          onSubmitEditing={_handleCheckValidCode}
          onBlur={() => setCode(code.trim())}
          placeholder="초대 코드 입력"
          returnKeyType="next"
          maxLength={20}
        />
        <ErrorMessage message={errorMessage} />
      </TitleContainer>

      <FooterContainer>
        <Button
          title="확인"
          onPress={_handleCheckValidCode}
          containerStyle={{
            backgroundColor: theme.btnFooterBackground,
            borderRadius: 0,
            height: '66%',
            padding: 0,
            margin: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          textStyle={{
            color: theme.btnFooterText,
            fontSize: 18,
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      </FooterContainer>
    </Container>
  );
};

export default AddInviteCode;
