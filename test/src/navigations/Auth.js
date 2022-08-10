import React, {useContext} from 'react';
import {ThemeContext} from 'styled-components/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Signin, Agree, FirstExplain, SecondExplain, Nickname, ProfileImageSet, Joined} from '../screens';


const Stack = createStackNavigator();

const Auth = () => {
  const theme = useContext(ThemeContext);

  return (
    <Stack.Navigator
      screenOptions={{
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
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FirstExplain"
        component={FirstExplain}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SecondExplain"
        component={SecondExplain}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Nickname"
        component={Nickname}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProfileImageSet"
        component={ProfileImageSet}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Joined"
        component={Joined}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
    
  );
};

export default Auth;
