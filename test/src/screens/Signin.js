import React, {useContext, useState} from 'react';
import styled from 'styled-components/native';
import {Button, Image, ErrorMessage} from '../components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {signin} from '../db_connect';
import {Alert} from 'react-native';
import {UserContext, ProgressContext} from '../contexts';
import RNKakaoTest from 'react-native-kakao-connect';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({theme}) => theme.background};
  padding: 0 20px;
  padding-top: ${({insets: {top}}) => top}px;
  padding-bottom: ${({insets: {bottom}}) => bottom}px;
`;

const LOGO =
  'https://firebasestorage.googleapis.com/v0/b/rn-chat-5357a.appspot.com/o/palette_main.png?alt=media';

const Signin = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {setUser} = useContext(UserContext);
  const {spinner} = useContext(ProgressContext);
  const [errorMessage, setErrorMessage] = useState('');

  const _handleSigninBtnPress = async () => {
    try {
      spinner.start();
      const user = await signin({});
      setUser(user);
    } catch (e) {
      Alert.alert('Signin Error', e.message);
      setErrorMessage('Fail..');
    } finally {
      spinner.stop();
    }
    console.log('signin');
  };

  const _handleKaKaoShareBtnPress = () => {
    RNKakaoTest.link(result => console.log(result));
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={20}
      contentContainerStyle={{flex: 1}}>
      <Container insets={insets}>
        <Image url={LOGO} />
        <ErrorMessage message={errorMessage} />
        <Button title="Sign in" onPress={_handleSigninBtnPress} />
        <Button title="Kakao Share" onPress={_handleKaKaoShareBtnPress} />
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default Signin;
