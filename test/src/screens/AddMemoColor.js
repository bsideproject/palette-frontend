import React, {useContext, useState} from 'react';
import {ThemeContext} from 'styled-components/native';
import styled from 'styled-components/native';
import {DB} from '../db_connect';
import Icon from 'react-native-vector-icons/AntDesign';
import {View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Button, Input, ErrorMessage} from '../components';

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.background};
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const TitleTextContainer = styled.Text`
  font-size: 20px;
  font-weight: 400;
  padding-left: 5%;
  margin-top: 10%;
  font-family: ${({theme}) => theme.fontRegular};
`;

const BtnContainer = styled.View`
  width: 95%;
  padding-left: 5%;
  padding-top: 110%;
  justify-content: center;
  align-items: center;
`;

const AddMemoColor = ({navigation, route}) => {
  const [name, setName] = useState('');
  const theme = useContext(ThemeContext);

  const sendedData = route.params.name;

  const _handleSetCompleteMemo = () => {
    console.log('Set Memo Complete');
  };

  return (
    <Container>
      <TitleTextContainer>
        <Text>[{sendedData}]표시 색상 선택을 해보세요.</Text>
      </TitleTextContainer>

      <BtnContainer>
        <Button
          title="다음 단계로"
          onPress={_handleSetCompleteMemo}
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
    </Container>
  );
};

export default AddMemoColor;
