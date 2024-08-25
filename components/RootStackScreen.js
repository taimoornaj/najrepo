import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './SplashScreen';
import Dashboard from '../src/Dashboard.js';
import SignInScreen from '../src/SignInScreen';
import MainTabScreen from './MainTabScreen';
const RootStack = createStackNavigator();

const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator headerMode='none'>
        <RootStack.Screen name="SignInScreen" component={SignInScreen}/>
        <RootStack.Screen name="MainTabScreen" component={MainTabScreen}/>
    </RootStack.Navigator>
);

export default RootStackScreen;