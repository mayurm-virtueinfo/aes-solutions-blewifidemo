
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager();

const Notifications: React.FC = () => {
  const [notifiedValue, setNotifiedValue] = useState('');

  useEffect(() => {
    const listen = async () => {
      const device = await manager.connectToDevice('your-device-id');
      await device.discoverAllServicesAndCharacteristics();

      device.monitorCharacteristicForService(
        'your-service-uuid',
        'your-char-uuid',
        (error, characteristic) => {
          if (error) return console.error(error);
          const value = Buffer.from(characteristic?.value ?? '', 'base64').toString('utf8');
          setNotifiedValue(value);
        }
      );
    };

    listen();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>Real-time Value: {notifiedValue}</Text>
    </View>
  );
}
export default Notifications;