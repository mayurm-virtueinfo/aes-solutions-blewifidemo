import * as React from 'react';
import { View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '@rneui/themed';

import type { StackParamList } from './types';
import { useNavigation } from '@react-navigation/native';

type ScreenNavigationProp = NativeStackNavigationProp<StackParamList>;
const MainSelectionScreen: React.FC = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Button
        title="Home Screen"
        type="outline"
        onPress={() => navigation.navigate('HomeScreen')}
      />
      <View style={{ marginTop: 20 }} />
      <Button
        title="BLEProvisionScreen"
        type="outline"
        onPress={() => navigation.navigate('BLEProvisionScreen')}
      />

    </View>
  );
}

export default MainSelectionScreen;

