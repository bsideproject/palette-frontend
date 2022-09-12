import PushNotification from 'react-native-push-notification';
import {navigate} from '../RootNavigation';
import AsyncStorage from '@react-native-community/async-storage';

export const onPushDataToNavigate = notify => {
  console.log('notify data', notify.data);

  // * Make Diary => Page Main
  // * Make History, Make Page, Complete History => Page History
  if (notify && notify.data && notify.data.page == 'home') {
    if (notify.data.diaryId) {
      const obj = {
        alarmHistoryId: notify.data.alarmHistoryId,
        diaryId: notify.data.diaryId,
      };
      AsyncStorage.setItem('PushParams', JSON.stringify(obj), () => {
        navigate('Home', obj);
      });
    } else {
      navigate('Home');
    }
  } else if (notify && notify.data && notify.data.page == 'history') {
    if (notify.data.diaryId) {
      if (notify.data.isOut && notify.data.isOut == '1') {
        console.log('Exit Diary', notify.data.isOut);
      } else {
        let historyId = notify.data.historyId ? notify.data.historyId : 0;
        console.log('[Push]History Id', historyId);
        const obj = {
          alarmHistoryId: notify.data.alarmHistoryId,
          diaryId: notify.data.diaryId,
          historyId: historyId,
        };
        AsyncStorage.setItem('PushParams', JSON.stringify(obj), () => {
          navigate('History', {diaryId: notify.data.diaryId});
        });
      }
    } else {
      navigate('History');
    }
  }
};

class LocalNotificationService {
  configure = onOpenNotification => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('[LocalNotificationService] onRegister:', token);
      },
      onNotification: function (notification) {
        console.log('[LocalNotificationService] onNotification:', notification);
        if (!notification?.data) {
          return;
        }
        notification.userInteraction = true;
        if (notification?.channelId == 'half-diary') {
          onPushDataToNavigate(notification.data);
        }
      },
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  };

  unregister = () => {
    PushNotification.unregister();
  };

  showNotification = (id, title, message, data = {}, options = {}) => {
    PushNotification.localNotification({
      /* Android Only Properties */
      ...this.buildAndroidNotification(id, title, message, data, options),
      title: title || '',
      message: message || '',
      playSound: options.playSound || false,
      soundName: options.soundName || 'default',
      userInteraction: false, // BOOLEAN : If notification was opened by the user from notification
      channelId: 'half-diary',
      badge: true,
    });
  };

  buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
    return {
      id: id,
      autoCancel: true,
      largeIcon: options.largeIcon || 'ic_launcher',
      smallIcon: options.smallIcon || 'ic_notification',
      bigText: message || '',
      subText: title || '',
      vibrate: options.vibrate || true,
      vibration: options.vibration || 300,
      priority: options.priority || 'high',
      importance: options.importance || 'high',
      data: data,
    };
  };

  cancelAllLocalNotifications = () => {
    PushNotification.cancelAllLocalNotifications();
  };

  removeDeliveredNotificationByID = notificationId => {
    console.log(
      '[LocalNotificationService] removeDeliveredNotificationByID:',
      notificationId,
    );
    PushNotification.cancelLocalNotifications({
      id: `${notificationId}`,
    });
  };

  // applicationBadge = () => {
  //     // PushNotification.setApplicationIconBadgeNumber(2);
  //     // const ShortcutBadger = NativeModules.ShortcutBadger;
  //     // let count = 1;
  //     // ShortcutBadger.applyCount(count);
  // }
}

export const localNotificationService = new LocalNotificationService();
