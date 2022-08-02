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

const SkipContainer = styled.View`
  width: 100%;
  margin-top: 3%;
  margin-left: 2%;
`;

const SkipText = styled.Text`
  font-size: 15px;
  color: ${({theme}) => theme.skipFontColor};
`;

const TitleTextContainer = styled.Text`
  font-size: 20px;
  font-weight: 600;
`;

const FooterContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const AddMemoImage = ({navigation, route}) => {
  const [name, setName] = useState('');
  const theme = useContext(ThemeContext);

  const sendedData = route.params.name;

  const _handleSetAddMemoImage = () => {
    console.log('Set Image');
  };

  return (
    <Container>
      <TitleContainer>
        <TitleTextContainer>
          <Text>[{sendedData}] 일기 표지를 삽입해주세요.</Text>
        </TitleTextContainer>

        <TouchableOpacity onPress={_handleSetAddMemoImage}>
          <SkipContainer>
            <SkipText>
              <Text>건너뛰기</Text>
            </SkipText>
          </SkipContainer>
        </TouchableOpacity>
      </TitleContainer>

      <FooterContainer>
        <Button
          title="다음"
          onPress={_handleSetAddMemoImage}
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

export default AddMemoImage;
