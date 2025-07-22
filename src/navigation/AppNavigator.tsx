import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// import SplashScreen from '../screens/SplashScreen';
// import SigninScreen from '../screens/SigninScreen';
// import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import StatusScreen from '../screens/StatusScreen';
// import ViewSystem1Screen from '../screens/ViewSystem1Screen';
// import ViewSystem2Screen from '../screens/ViewSystem2Screen';
import ActionsScreen from '../screens/ActionsScreen';
import AlertsScreen from '../screens/AlertsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SigninScreen from '../screens/SigninScreen';
import ViewSystemScreen1 from '../screens/ViewSystemScreen1';
import ViewSystemScreen2 from '../screens/ViewSystemScreen2';
import HomeTabNavigator from './HomeTabNavigator';
import { RootStackParamList } from '../types/navigation';



const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Signin" screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="Splash" component={Spla} /> */}
        <Stack.Screen name="Signin" component={SigninScreen} />
        {/* <Stack.Screen name="Signup" component={SigninScreen} /> */}
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Status" component={StatusScreen} />
        <Stack.Screen name="ViewSystem1" component={ViewSystemScreen1} />
        <Stack.Screen name="ViewSystem2" component={ViewSystemScreen2} />
        <Stack.Screen name="Actions" component={ActionsScreen} />
        <Stack.Screen name="Alerts" component={AlertsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="HomeTabs" component={HomeTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
