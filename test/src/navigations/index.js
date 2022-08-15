import React, {useContext, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Auth from './Auth';
import Main from './Main';
import SplashScreen from 'react-native-splash-screen';
import {UserContext} from '@contexts';

const Navigation = () => {
  const {user} = useContext(UserContext);

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  });

  return (
    <NavigationContainer>
      {user.accessToken ? <Main /> : <Auth />}
      {/* <Main /> */}
    </NavigationContainer>
  );
};

export default Navigation;
