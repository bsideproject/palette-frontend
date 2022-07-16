import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Sub} from '../screens';

const Tab = createBottomTabNavigator();

const Home = ({navigation, route}) => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Sub" component={Sub} />
    </Tab.Navigator>
  );
};

export default Home;
