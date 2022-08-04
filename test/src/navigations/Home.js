import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MemoMain} from '../screens';

const Tab = createBottomTabNavigator();

const Home = ({navigation, route}) => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="MemoMain" component={MemoMain} />
    </Tab.Navigator>
  );
};

export default Home;
