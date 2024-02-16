import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChallengeScreen from '../screens/ChallengeScreen';
import MyProfileScreen from '../screens/MyProfileScreen';
import FeedScreen from '../screens/FeedScreen';
import SearchScreen from '../screens/SearchScreen';
import {useEffect, useState} from 'react';

const Tab = createBottomTabNavigator();

function NavigationBar(props) {

  const [initialRoute, setInitialRoute] = useState('Challenge');

  useEffect(() => {
    if (props.route.params && props.route.params.initialRoute) {
      setInitialRoute(props.route.params.initialRoute);
    }
  }, [props.route.params]);

  return (
    <Tab.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        activeTintColor: 'white',
        inactiveTintColor: 'white',
        labelStyle: {
          fontSize: 14,
        },
        tabBarStyle: {
          backgroundColor: 'black',
        },
      }}
    >
      <Tab.Screen name="Challenge" component={ChallengeScreen} options={{headerShown: false}}/>
      <Tab.Screen name="Feed" component={FeedScreen} options={{headerShown: false}}/>
      <Tab.Screen name="Search" component={SearchScreen} options={{headerShown: false}}/>
      <Tab.Screen name="My Profile" component={MyProfileScreen} options={{headerShown: false}}/>
    </Tab.Navigator>
  );
}

export default NavigationBar;
