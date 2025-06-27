
import React, { useState } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager();
const DEVICE_ID = 'your-device-id';
const SERVICE_UUID = 'your-service-uuid';
const CHARACTERISTIC_UUID = 'your-char-uuid';

const ReadWrite: React.FC = () => {
  const [value, setValue] = useState('');

  const readChar = async () => {
    const device = await manager.connectToDevice(DEVICE_ID);
    await device.discoverAllServicesAndCharacteristics();
    const characteristic = await device.readCharacteristicForService(SERVICE_UUID, CHARACTERISTIC_UUID);
    const decoded = Buffer.from(characteristic?.value ?? '', 'base64').toString('utf8');
    setValue(decoded);
  };

  const writeChar = async () => {
    const data = Buffer.from('Hello BLE', 'utf8').toString('base64');
    const device = await manager.connectToDevice(DEVICE_ID);
    await device.discoverAllServicesAndCharacteristics();
    await device.writeCharacteristicWithResponseForService(SERVICE_UUID, CHARACTERISTIC_UUID, data);
    Alert.alert('Written!');
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Read" onPress={readChar} />
      <Button title="Write" onPress={writeChar} />
      <Text>Value: {value}</Text>
    </View>
  );
}
export default ReadWrite;