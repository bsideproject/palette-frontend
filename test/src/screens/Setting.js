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

const Setting = ({navigation}) => {
  const theme = useContext(ThemeContext);

  return (
    <Container>
      <TitleTextContainer>Setting Page</TitleTextContainer>
    </Container>
  );
};

export default Setting;
