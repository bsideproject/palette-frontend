import React, {useContext, useEffect} from 'react';
import {ThemeContext} from 'styled-components/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  MemoMain,
  AddMemo,
  AddMemoColor,
  AddInviteCode,
  CompleteMemo,
} from '../screens';
import Home from './Home';
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
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#EEEEEE',
          height: 60,
        },
        title: '일기장 만들기',
        headerTitleStyle: {
          color: '#111111',
          fontSize: 16,
          fontWeight: '700',
          fontFamily: theme.fontRegular,
        },
        cardStyle: {backgroundColor: theme.background},
      }}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen name="MemoMain" component={MemoMain} />
      <Stack.Screen name="AddMemo" component={AddMemo} />
      <Stack.Screen name="AddMemoColor" component={AddMemoColor} />
      <Stack.Screen
        name="CompleteMemo"
        component={CompleteMemo}
        options={{
          headerLeft: false,
        }}
      />
      <Stack.Screen name="AddInviteCode" component={AddInviteCode} />
    </Stack.Navigator>
  );
};

export default Main;
