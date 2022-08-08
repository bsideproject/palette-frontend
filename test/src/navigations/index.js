import React, {useContext, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Auth from './Auth';
import {UserContext, ProgressContext} from '../contexts';
import Main from './Main';
import SplashScreen from 'react-native-splash-screen';
import {Spinner} from '../components';

const Navigation = () => {
  const {user} = useContext(UserContext);
  const {inProgress} = useContext(ProgressContext);

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  });

  return (
    <NavigationContainer>
      {user.uid ? <Main /> : <Auth />}
      {/* <Main /> */}
      {inProgress && <Spinner />}
    </NavigationContainer>
  );
};

export default Navigation;
