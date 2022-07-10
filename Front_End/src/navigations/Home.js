import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Sub, Profile} from '../screens';

const Tab = createBottomTabNavigator();

const Home = ({navigation, route}) => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Sub" component={Sub} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default Home;
