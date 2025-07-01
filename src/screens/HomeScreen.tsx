import React, { useEffect } from 'react';
import { ImageBackground, PermissionsAndroid, Platform, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { StackParamList } from './types';
import { useNavigation } from '@react-navigation/native';
import { Images } from '../theme/Images';

type ScreenNavigationProp = NativeStackNavigationProp<StackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<ScreenNavigationProp>();

  useEffect(() => {
    checkAndNavigate();
  }, []);

  async function checkAndNavigate() {
    if (Platform.OS === 'android') {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ];

      const result = await PermissionsAndroid.requestMultiple(permissions);

      const allGranted = permissions.every(
        (perm) => result[perm] === PermissionsAndroid.RESULTS.GRANTED
      );

      if (allGranted) {
        setTimeout(() => {
          navigation.replace('ESPIDFProvisionScreen');
        }, 3000);
      } else {
        console.warn('Some permissions were not granted.');
      }
    } else {
      // iOS or other platforms - skip permission check and navigate
      setTimeout(() => {
        navigation.replace('ESPIDFProvisionScreen');
      }, 3000);
    }
  }

  return (
    <ImageBackground source={Images.ic_splash_background} style={{ flex: 1 }}>
      {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Button
          title="ESP IDF Provisioning Demo"
          type="outline"
          onPress={() => navigation.navigate('ESPIDFProvisionScreen')}
        />
        <View style={{ marginTop: 20 }} />
        <Button
          title="BLE Provisioning Demo"
          type="outline"
          onPress={() => navigation.navigate('BLEProvisionScreen')}
        />
      </View> */}
    </ImageBackground>
  );
};

export default HomeScreen;
