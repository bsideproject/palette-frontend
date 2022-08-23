import React, {useContext, useEffect, useState} from 'react';
import {ThemeContext} from 'styled-components/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainPage, Setting} from '@screens';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native';
import {UserContext} from '../contexts';

const TabIcon = ({name, focused}) => {
  const theme = useContext(ThemeContext);
  return (
    <Icon
      name={name}
      size={26}
      color={focused ? theme.tabBtnActive : theme.tabBtnInActive}
    />
  );
};
const Tab = createBottomTabNavigator();

const Home = ({navigation, route}) => {
  const theme = useContext(ThemeContext);
  const [curScreenName, SetScreenName] = useState('Home');
  const {user} = useContext(UserContext);

  useEffect(() => {
    const screenName = getFocusedRouteNameFromRoute(route) || 'Home';
    if (screenName == 'Home') {
      SetScreenName(`${user.nickname}님의 반쪽 일기장`);
    } else if (screenName == 'Setting') {
      SetScreenName('환경 설정');
    }
    console.log(curScreenName);
  });

  return (
    <Tab.Navigator
      tabBarOptions={
        ({
          tabStyle: {borderTopWidth: 1},
          style: {borderTopColor: theme.light020},
        },
        {showLabel: false})
      }
      screenOptions={{
        headerTitleAlign: 'flex-start',
        tabBarStyle: {
          height: 60,
        },
        headerTitleStyle: {
          color: theme.dark010,
          fontSize: 16,
          fontWeight: '700',
          fontFamily: theme.fontRegular,
        },
        headerStyle: {
          backgroundColor: theme.fullWhite,
          borderBottomWidth: 1,
          borderBottomColor: theme.light020,
          height: 60,
        },
        title: curScreenName,
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate(Home)}>
            <Icon name="notifications" size={26} style={{marginRight: 20}} />
          </TouchableOpacity>
        ),
      }}>
      <Tab.Screen
        headerTitle="Home"
        name="Home"
        component={MainPage}
        options={{
          tabBarIcon: ({focused}) =>
            TabIcon({
              name: focused ? 'ios-home' : 'ios-home-outline',
              focused,
            }),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          tabBarIcon: ({focused}) =>
            TabIcon({
              name: focused ? 'ios-settings' : 'ios-settings-outline',
              focused,
            }),
        }}
      />
    </Tab.Navigator>
  );
};

export default Home;
