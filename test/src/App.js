import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
import {ApolloProvider} from '@apollo/client';
import {createApolloClient} from '@apolloClient/ApolloClient';
import {theme} from './theme';
import Navigation from '@navigations';
import {UserProvider} from '@contexts';
import {HistoryModalProvider} from './contexts';
import {
  requestUserPermission,
  NotificationListner,
} from './push/PushNotification_helper';
import {createChannel} from './push/LocalNotification';

const apolloClient = createApolloClient();

const App = () => {
  useEffect(() => {
    requestUserPermission();
    NotificationListner();
    createChannel();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={apolloClient}>
        <UserProvider>
          <HistoryModalProvider>
            <StatusBar
              backgroundColor={theme.fullWhite}
              barStyle="dark-content"
            />
            <Navigation />
          </HistoryModalProvider>
        </UserProvider>
      </ApolloProvider>
    </ThemeProvider>
  );
};

export default App;
