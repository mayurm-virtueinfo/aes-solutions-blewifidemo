import React, { useEffect } from 'react';
import {
  ImageBackground,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import {
  requestMultiple,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

import type { StackParamList } from './types';
import { Images } from '../theme/Images';

type ScreenNavigationProp = NativeStackNavigationProp<StackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const hasDeniedKey = 'hasDeniedIOSPermissions';

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
      navigateAfterDelay();
    } else {
      Alert.alert('Permissions Denied', 'Please allow Bluetooth and Location permissions to continue.');
    }

  } else if (Platform.OS === 'ios') {
    const permissions = [
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    ];

    const statuses = await requestMultiple(permissions);

    const locationGranted = statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === RESULTS.GRANTED;

    if (locationGranted) {
      await AsyncStorage.removeItem(hasDeniedKey); // clear block flag
      navigateAfterDelay();
    } else if (statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === RESULTS.BLOCKED) {
      await AsyncStorage.setItem(hasDeniedKey, 'true');
      showSettingsAlert();
    } else {
      // denied but not blocked
      showRetryAlert();
    }
  } else {
    navigateAfterDelay();
  }
}

  function showRetryAlert() {
    Alert.alert(
      'Permissions Required',
      'Bluetooth and Location permissions are needed to continue.',
      [
        {
          text: 'Try Again',
          onPress: () => checkAndNavigate(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  }

  function showSettingsAlert() {
    navigateAfterDelay();
    return;
    Alert.alert(
      'Permissions Blocked',
      'You previously denied permissions. Please enable them manually in Settings to continue.',
      [
        {
          text: 'Open Settings',
          onPress: () =>
            openSettings().catch(() =>
              Alert.alert('Error', 'Unable to open settings')
            ),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }

  function navigateAfterDelay() {
    setTimeout(() => {
      navigation.replace('ESPIDFProvisionScreen');
    }, 3000);
  }

  return (
    <ImageBackground source={Images.ic_splash_background} style={{ flex: 1 }}>
      {/* Optional: UI for manual navigation */}
    </ImageBackground>
  );
};

export default HomeScreen;
