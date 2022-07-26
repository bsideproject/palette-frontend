import React, {useContext} from 'react';
import {ThemeContext} from 'styled-components/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Signin} from '../screens';
import SocialSignin from '../screens/SocialSignin';

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
        name="SocialSignin"
        component={SocialSignin}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default Auth;
