
import React from 'react';
import { View, Button, Alert } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager();

const Disconnect: React.FC = () => {
  const disconnect = async () => {
    const device = await manager.devices(['your-device-id']);
    await device[0].cancelConnection();
    Alert.alert('','Disconnected');
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Disconnect" onPress={disconnect} />
    </View>
  );
}
export default Disconnect;
