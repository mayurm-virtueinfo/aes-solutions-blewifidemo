import * as React from 'react';
import { View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '@rneui/themed';

import type { StackParamList } from './types';
import { useNavigation } from '@react-navigation/native';

type ScreenNavigationProp = NativeStackNavigationProp<StackParamList>;
const HomeScreen: React.FC = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
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

    </View>
  );
}

export default HomeScreen;

