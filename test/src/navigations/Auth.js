import React, {useContext} from 'react';
import {ThemeContext} from 'styled-components/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  Signin,
  Agree,
  FirstExplain,
  SecondExplain,
  Nickname,
  ProfileImageSet,
  Joined,
} from '@screens';

const Stack = createStackNavigator();

const Auth = () => {
  const theme = useContext(ThemeContext);

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
        headerTitleStyle: {
          color: '#111111',
          fontSize: 16,
          fontWeight: '700',
          fontFamily: theme.fontRegular,
        },
        cardStyle: {backgroundColor: theme.backgroundColor},
      }}>
      <Stack.Screen
        name="Signin"
        component={Signin}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Agree"
        component={Agree}
        options={{
          headerTitle: '약관동의',
        }}
      />
      <Stack.Screen
        name="FirstExplain"
        component={FirstExplain}
        options={{
          headerTitle: '이용약관',
        }}
      />
      <Stack.Screen
        name="SecondExplain"
        component={SecondExplain}
        options={{
          headerTitle: '개인정보 취급방침',
        }}
      />
      <Stack.Screen
        name="Nickname"
        component={Nickname}
        options={{
          headerTitle: '닉네임 설정',
        }}
      />
      <Stack.Screen
        name="ProfileImageSet"
        component={ProfileImageSet}
        options={{
          headerTitle: '프로필 사진 설정',
        }}
      />
      <Stack.Screen
        name="Joined"
        component={Joined}
        options={{
          headerLeft: false,
          headerTitle: '회원가입 완료',
        }}
      />
    </Stack.Navigator>
  );
};

export default Auth;
