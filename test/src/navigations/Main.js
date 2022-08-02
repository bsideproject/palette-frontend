import React, {useContext, useEffect} from 'react';
import {ThemeContext} from 'styled-components/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Sub, AddMemo, AddMemoImage, AddInviteCode} from '../screens';
import {LogBox} from 'react-native';

const Stack = createStackNavigator();

const Main = () => {
  const theme = useContext(ThemeContext);

  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerTintColor: theme.text,
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: '#45413C',
          borderBottomWidth: 1,
          borderBottomColor: '#99154E',
        },
        title: '반쪽일기',
        headerTitleStyle: {color: '#FFFFFF', fontsize: 24},
        cardStyle: {backgroundColor: theme.background},
      }}>
      <Stack.Screen name="Sub" component={Sub} />
      <Stack.Screen name="AddMemo" component={AddMemo} />
      <Stack.Screen name="AddMemoImage" component={AddMemoImage} />
      <Stack.Screen name="AddInviteCode" component={AddInviteCode} />
    </Stack.Navigator>
  );
};

export default Main;
