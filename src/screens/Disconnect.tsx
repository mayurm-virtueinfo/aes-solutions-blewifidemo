
import React from 'react';
import { View, Button } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager();

export default function Disconnect() {
  const disconnect = async () => {
    const device = await manager.devices(['your-device-id']);
    await device[0].cancelConnection();
    alert('Disconnected');
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Disconnect" onPress={disconnect} />
    </View>
  );
}
