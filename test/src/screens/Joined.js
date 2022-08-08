import React, {useContext} from 'react';
import {Button} from '../components';
import styled from 'styled-components/native';
import {ThemeContext} from 'styled-components/native';
import {Image} from 'react-native';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {UserContext} from '../contexts';

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.background};
  flex-direction: column;
`;

const InnerContainer = styled.View`
  padding: 0 16px;
  justify-content: center;
  align-items: center;
`;

const TitleContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  border-bottom-color: #eeeeee;
  border-bottom-width: 1px;
  width: 100%;
  height: 60px;
`;

const TitleText = styled.Text`
  font-family: ${({theme}) => theme.fontBold};
  font-size: 16px;
`;

const SubTitleText = styled.Text`
  font-family: ${({theme}) => theme.fontRegular};
  font-size: 20px;
  margin: 0 auto;
`;

const ButtonContainer = styled.View`
  padding: 0 16px;
  margin-bottom: 106px;
`;

const Joined = ({navigation}) => {
  const theme = useContext(ThemeContext);
  const {setUser} = useContext(UserContext);

  const JOIN_IMG = require('../../assets/icons/join.png');

  const _handleNextButtonPress = () => {
    setUser({uid: 123});
  };

  return (
    <Container>
      <KeyboardAvoidingScrollView
        stickyFooter={
          <ButtonContainer>
            <Button
              title="가입 완료"
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
          <TitleText>회원가입 완료</TitleText>
        </TitleContainer>
        <InnerContainer>
          <Image source={JOIN_IMG} style={{marginTop: 150, marginBottom: 40}} />
          <SubTitleText>회원가입을 축하합니다 :)</SubTitleText>
        </InnerContainer>
      </KeyboardAvoidingScrollView>
    </Container>
  );
};

export default Joined;
