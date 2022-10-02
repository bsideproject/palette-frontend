import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Auth from './Auth';
import Main from './Main';
import SplashScreen from 'react-native-splash-screen';
import {UserContext} from '@contexts';
import {useNetInfo} from '@react-native-community/netinfo';
import {NetworkContainer} from '@screens';
import {navigationRef} from '../RootNavigation';
import {getCookie} from '../api/Cookie';
import Spinner from 'react-native-loading-spinner-overlay';
import {USE_LAZY_QUERY} from '@apolloClient/queries';
import styled from 'styled-components/native';
import {Flow} from 'react-native-animated-spinkit';
import {ThemeContext} from 'styled-components/native';

// Spinner
const SpinnerContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-family: ${({theme}) => theme.fontRegular};
`;

const Navigation = () => {
  const {setUser, user} = useContext(UserContext);
  const [netConnected, setNetConnected] = useState(true);
  const netinfo = useNetInfo();
  const theme = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(true);
  const [get_profile, {loading, error, data}] = USE_LAZY_QUERY(
    'GET_PROFILE',
    getCookie('access_token'),
  );

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
      console.log('Access Token From Cookie', getCookie('access_token'));
      if (
        getCookie('access_token') == null ||
        getCookie('access_token') == undefined
      ) {
        console.log('LogOut Status');
        setIsLoading(false);
      } else {
        console.log('LogIn Status');
        get_profile();
      }
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

  const getInitialData = () => {
    if (error != undefined) {
      let jsonData = JSON.parse(JSON.stringify(error));
      console.log(jsonData);
    } else {
      if (loading || data == undefined) {
        console.log('Data Fecting & Data Empty');
        return;
      }
      console.log('Success', data);
      setIsLoading(false);
      if (data.myProfile.nickname !== null) {
        // If Success
        setUser({
          accessToken: getCookie('access_token'),
          email: data.myProfile.email,
          nickname: data.myProfile.nickname,
          profileImg: data.myProfile.profileImg,
          socialTypes: data.myProfile.socialTypes,
          pushEnabled: data.myProfile.pushEnabled,
        });
      }
    }
  };

  useEffect(() => {
    getInitialData();
  }, [loading]);

  return netConnected ? (
    <NavigationContainer ref={navigationRef}>
      {isLoading ? (
        <SpinnerContainer>
          <Flow animating={isLoading} size={100} color={theme.pointColor} />
        </SpinnerContainer>
      ) : user.accessToken ? (
        <Main />
      ) : (
        <Auth />
      )}
    </NavigationContainer>
  ) : (
    <NetworkContainer handleNetwork={_handleNetwork} />
  );
};

export default Navigation;
