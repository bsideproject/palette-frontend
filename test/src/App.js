import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
import {ApolloProvider} from '@apollo/client';
import {createApolloClient} from '@apolloClient/ApolloClient';
import {theme} from './theme';
import Navigation from '@navigations';
import {UserProvider, HistoryModalProvider} from '@contexts';
import {
  requestUserPermission,
  NotificationListner,
} from './push/PushNotification_helper';
import {createChannel} from './push/LocalNotification';
import {fcmService} from './push/FCMService';
import {
  localNotificationService,
  onPushDataToNavigate,
} from './push/LocalNotificationService';
import {navigate} from './RootNavigation';

const apolloClient = createApolloClient();

const App = () => {
  useEffect(() => {
    createChannel();
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);
  }, []);

  const onRegister = token => {
    console.log('[App] FCM Token', token);
    AsyncStorage.setItem('fcmtoken', token, () => {
      console.log('AsyncStorage fcm token Save!');
    });
  };

  const onNotification = notify => {
    const options = {
      soundName: 'default',
      playSound: true,
      largeIcon: 'ic_launcher_round',
      smallIcon: 'ic_launcher_round',
    };
    console.log('Show notify');
    localNotificationService.showNotification(
      0,
      notify.notification.title,
      notify.notification.body,
      notify,
      options,
    );
  };

  const onOpenNotification = async (notify, idx) => {
    onPushDataToNavigate(notify, idx);
  };

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
