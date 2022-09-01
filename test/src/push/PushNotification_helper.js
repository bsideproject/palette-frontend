import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import PushNotification from 'react-native-push-notification';

export const setFcmDataInStorage = remoteMessage => {
  if (Object.keys(remoteMessage).includes('data') && remoteMessage.data != '') {
    AsyncStorage.setItem('fcmData', remoteMessage.data, () => {
      console.log('FCM DATA:', remoteMessage.data);
    });
  } else {
    AsyncStorage.removeItem('fcmData');
  }
};

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    GetFCMToken();
  }
}

async function GetFCMToken() {
  let fcmtoken = await AsyncStorage.getItem('fcmtoken');
  console.log(fcmtoken, 'old token');

  if (!fcmtoken) {
    try {
      const fcmtoken = await messaging().getToken();
      if (fcmtoken) {
        console.log(fcmtoken, 'new token');
        await AsyncStorage.setItem('fcmtoken', fcmtoken);
      }
    } catch (error) {
      console.log(error, 'error in fcmtoken');
    }
  }
}

export const NotificationListner = () => {
  // Assume a message-notification contains a "type" property in the data payload of the screen to open
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    setFcmDataInStorage(remoteMessage);
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        setFcmDataInStorage(remoteMessage);
      }
    });

  messaging().onMessage(async remoteMessage => {
    console.log('notification on foregruond state...', remoteMessage);
    setFcmDataInStorage(remoteMessage);
    PushNotification.localNotification({
      channelId: 'half-diary',
      title: remoteMessage.notification.title,
      message: remoteMessage.notification.body,
      data: remoteMessage.data,
      largeIcon: 'ic_launcher_round',
      smallIcon: 'ic_launcher_round',
    });
  });
};
