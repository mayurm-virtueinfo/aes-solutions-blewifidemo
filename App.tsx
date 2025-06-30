
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BasicScan from './src/screens/BasicScan';
import ConnectDevice from './src/screens/ConnectDevice';
import ReadWrite from './src/screens/ReadWrite';
import Notifications from './src/screens/Notifications';
import Disconnect from './src/screens/Disconnect';
import BLEProvisionScreen from './src/screens/BLEProvisionScreen';
import { StackParamList } from './src/screens/types';
import HomeScreen from './src/screens/HomeScreen';
import ESPIDFProvisionScreen from './src/screens/ESPIDFProvisionScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProvisionScreen from './src/screens/ProvisionScreen';
import DeviceScreen from './src/screens/DeviceScreen';
import WifiListScreen from './src/screens/WifiListScreen';
import WifiPasswordScreen from './src/screens/WifiPasswordScreen';
import SendDataScreen from './src/screens/SendDataScreen';
const Stack = createNativeStackNavigator<StackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      {/* <Stack.Navigator initialRouteName="BLEProvisionScreen"> */}
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{
          headerShown:false
        }}/>
        <Stack.Screen name="BLEProvisionScreen" component={BLEProvisionScreen}/>
        <Stack.Screen name="BasicScan" component={BasicScan} />
        <Stack.Screen name="ConnectDevice" component={ConnectDevice} />
        <Stack.Screen name="ReadWrite" component={ReadWrite} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Disconnect" component={Disconnect} />
        <Stack.Screen name="ESPIDFProvisionScreen" component={ESPIDFProvisionScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Provision" component={ProvisionScreen} />
        <Stack.Screen name="Device" component={DeviceScreen} />
        <Stack.Screen name="WifiList" component={WifiListScreen} />
        <Stack.Screen name="WifiPassword" component={WifiPasswordScreen} />
        <Stack.Screen name="SendData" component={SendDataScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
