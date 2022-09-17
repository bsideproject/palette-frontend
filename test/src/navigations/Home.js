import React, {useContext, useEffect, useState} from 'react';
import {ThemeContext} from 'styled-components/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainPage, Setting} from '@screens';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native';
import {UserContext} from '../contexts';
import styled from 'styled-components/native';
import AutoHeightImage from 'react-native-auto-height-image';

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

const ProfileContainer = styled.View`
  flex: 1;
`;

const ProfileRow = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ProfileImage = styled.Image`
  flex: 2;
  width: 37px;
  height: 37px;
  border-radius: 50px;
`;

const ProfileNickname = styled.Text`
  flex: 1;
  font-family: ${({theme}) => theme.fontBold};
  font-size: 16px;
  border-radius: 50px;
  margin-left: 10px;
`;

const Tab = createBottomTabNavigator();

const PROFILE_DEFAULT = require('/assets/icons/default_profile.png');

const Home = ({navigation, route}) => {
  const theme = useContext(ThemeContext);
  const [curScreenName, SetScreenName] = useState('Home');
  const {user} = useContext(UserContext);

  useEffect(() => {
    const screenName = getFocusedRouteNameFromRoute(route) || 'Home';
    if (screenName == 'Home') {
      SetScreenName(`${user.nickname}님의 반쪽 일기장`);
    } else if (screenName == 'Setting') {
      SetScreenName('더 보기');
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
        headerTitleStyle: {
          color: theme.dark010,
          fontSize: 16,
          fontFamily: theme.fontBold,
        },
        headerStyle: {
          backgroundColor: theme.fullWhite,
          borderBottomWidth: 1,
          borderBottomColor: theme.light020,
          height: 60,
        },
        title:
          curScreenName != '더 보기' ? (
            <ProfileContainer>
              {user.profileImg ? (
                <ProfileRow>
                  <ProfileImage
                    source={{uri: user.profileImg}}
                    resizeMethod={'resize'}
                  />
                  <ProfileNickname>{curScreenName}</ProfileNickname>
                </ProfileRow>
              ) : (
                <ProfileRow>
                  <ProfileImage source={PROFILE_DEFAULT} />
                  <ProfileNickname>{curScreenName}</ProfileNickname>
                </ProfileRow>
              )}
            </ProfileContainer>
          ) : (
            '더 보기'
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
          headerTitleAlign: 'flex-start',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('PushHistory')}>
              <Icon name="notifications" size={26} style={{marginRight: 20}} />
            </TouchableOpacity>
          ),
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
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon
                name={'arrow-back'}
                size={24}
                color={'black'}
                style={{marginLeft: 14}}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Home;
