import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';

export const configurePushNotify = () => {
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token) {
      console.log('TOKEN:', token);
    },
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
    },
    requestPermissions: Platform.OS === 'ios',
  });
};

export const createChannel = () => {
  PushNotification.createChannel({
    channelId: 'half-diary', // (required)
    channelName: 'half-diary', // (required)
  });
};

// PushNotification.configure({
//   // (optional) Called when Token is generated (iOS and Android)
//   onRegister: async function  (token)  {
//       //토큰은 필요에 따라 AsyncStorage에 저장하거나 필요에 따라 서버에 저장한다.
//       pushConfig.setPushToken(token)
//   },
//   // (required) Called when a remote is received or opened, or local notification is opened
//   onNotification: function (notification) {
//     if(notification.userInteraction){
//       navigationRef.current.navigate("Home")
//     }
//     notification.finish(PushNotificationIOS.FetchResult.NoData);
//   },
//   // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
//   onRegistrationError: function(err) {
//     console.error(err.message, err);
//   },
//   requestPermissions: Platform.OS === 'ios' ? false : true,
// });
