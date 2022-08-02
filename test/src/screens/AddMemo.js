import React, {useContext, useState} from 'react';
import {ThemeContext} from 'styled-components/native';
import styled from 'styled-components/native';
import {DB} from '../db_connect';
import Icon from 'react-native-vector-icons/AntDesign';
import {View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import Modal from 'react-native-simple-modal';
import {Button, Input, ErrorMessage} from '../components';

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.background};
  flex-direction: column;
`;

const TitleContainer = styled.View`
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

const AddMemo = ({navigation}) => {
  const [name, setName] = useState('');
  const theme = useContext(ThemeContext);

  const _handleSetNamePress = () => {
    console.log('Set Name');
    navigation.navigate('AddMemoImage', {name: name});
  };

  return (
    <Container>
      <TitleContainer>
        <TitleTextContainer>
          <Text>일기 이름을 입력해주세요.</Text>
        </TitleTextContainer>

        <Input
          label="이름"
          value={name}
          onChangeText={setName}
          onSubmitEditing={_handleSetNamePress}
          onBlur={() => setName(name.trim())}
          placeholder="그룹 이름 입력"
          returnKeyType="next"
          maxLength={20}
        />
      </TitleContainer>
      <FooterContainer>
        <Button
          title="다음"
          onPress={_handleSetNamePress}
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

export default AddMemo;
