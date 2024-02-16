import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RegistrationScreen from './screens/RegistrationScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import StyleSelectorScreen from './screens/StyleSelectorScreen';
import LoginScreen from './screens/LoginScreen';
import NavigationBar from './components/NavigationBar';
import MyProfileScreen from './screens/MyProfileScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
    <Stack.Screen name="LoginScreen" 
    options={{ headerShown: false, title: 'Home', headerLeft: () => null }}>
      {(props) => <LoginScreen {...props} />}
    </Stack.Screen>
    <Stack.Screen name="Registration">
      {(props) => <RegistrationScreen {...props} />}
    </Stack.Screen>
    <Stack.Screen name="StyleSelector" 
      options={{ headerShown: false, title: 'Home', headerLeft: () => null }}>
      {(props) => <StyleSelectorScreen {...props} />}
    </Stack.Screen>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} 
    options={{ headerShown: false, title: 'Home', headerLeft: () => null }}/>
    <Stack.Screen 
    name="Home" 
    component={NavigationBar}
    options={{ headerShown: false, title: 'Home', headerLeft: () => null }}
    />
    <Stack.Screen name="Profile" component={MyProfileScreen} />
  </Stack.Navigator>
  );
}

export default AppNavigator;