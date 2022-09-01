import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Auth from './Auth';
import Main from './Main';
import SplashScreen from 'react-native-splash-screen';
import {UserContext} from '@contexts';
import {useNetInfo} from '@react-native-community/netinfo';
import {NetworkContainer} from '@screens';
import {navigationRef} from '../RootNavigation';

const Navigation = () => {
  const {user} = useContext(UserContext);
  const [netConnected, setNetConnected] = useState(true);
  const netinfo = useNetInfo();

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);

  useEffect(() => {
    if (netinfo.isConnected === false) {
      setNetConnected(false);
    }
  }, [netinfo]);

  const _handleNetwork = () => {
    if (netinfo.isConnected === true) {
      setNetConnected(true);
    }
  };

  return netConnected ? (
    <NavigationContainer ref={navigationRef}>
      {user.accessToken ? <Main /> : <Auth />}
      {/* <Main /> */}
    </NavigationContainer>
  ) : (
    <NetworkContainer handleNetwork={_handleNetwork} />
  );
};

export default Navigation;
