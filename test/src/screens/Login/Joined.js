import React, {useContext, useState, useEffect} from 'react';
import {Button} from '@components';
import styled from 'styled-components/native';
import {ThemeContext} from 'styled-components/native';
import {Image} from 'react-native';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {UserContext} from '@contexts';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {useQuery} from '@apollo/client';
import {GET_PROFILE} from '@apolloClient/queries';

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.fullWhite};
  flex-direction: column;
`;

const InnerContainer = styled.View`
  padding: 0 16px;
  justify-content: center;
  align-items: center;
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
  const [email, setEmail] = useState('');
  const [socialType, setSocialType] = useState('');
  const [accessToken, setAccessToken] = useState(null);
  const {setUser, user} = useContext(UserContext);
  const {loading, error, data} = useQuery(GET_PROFILE, {
    context: {
      headers: {
        authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  });

  const JOIN_IMG = require('/assets/icons/join.png');

  const _handleNextButtonPress = () => {
    axios
      .post('http://61.97.190.252:8080/api/v1/login', {
        email: email,
        socialType: socialType,
      })
      .then(response => {
        AsyncStorage.setItem('access_token', response.data.accessToken, () => {
          console.log('Joined AsyncStorage access_token Save!');
          setAccessToken(prevState => response.data.accessToken);
        });
      })
      .catch(error => {
        console.log('login api error', error);
      });
  };

  useEffect(() => {
    AsyncStorage.getItem('email', (err, result) => {
      setEmail(result);
    });
    AsyncStorage.getItem('social_type', (err, result) => {
      setSocialType(result);
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!!data) {
        console.log('Joined Get Data From GraphQL');
        setUser({
          accessToken: accessToken,
          email: data.myProfile.email,
          socialType: socialType,
          nickname: data.myProfile.nickname,
        });
      }
    }
  }, [loading, accessToken]);

  return (
    <Container>
      <KeyboardAvoidingScrollView
        containerStyle={{
          backgroundColor: theme.fullWhite,
        }}
        stickyFooter={
          <ButtonContainer>
            <Button
              title="가입 완료"
              onPress={_handleNextButtonPress}
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
          </ButtonContainer>
        }>
        <InnerContainer>
          <Image source={JOIN_IMG} style={{marginTop: 150, marginBottom: 40}} />
          <SubTitleText>회원가입을 축하합니다 :)</SubTitleText>
        </InnerContainer>
      </KeyboardAvoidingScrollView>
    </Container>
  );
};

export default Joined;
