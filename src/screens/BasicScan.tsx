
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, PermissionsAndroid, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { StackParamList } from './types';

type ScreenNavigationProp = NativeStackNavigationProp<StackParamList>;

const manager = new BleManager();


const BasicScan : React.FC = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const [devices, setDevices] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
    }
  }, []);

  const startScan = () => {
    setDevices([]);
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Scan error:', error);
        return;
      }
      if (device && !devices.find(d => d.id === device.id)) {
        setDevices(prev => [...prev, device]);
      }
    });

    setTimeout(() => manager.stopDeviceScan(), 5000);
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Start Scan" onPress={startScan} />
      <View style={{padding:10,borderWidth:1,borderColor:'red', borderRadius:10,margin:10}}>
        <Text style={{ fontWeight: 'bold' }}>Selected Device:</Text>
        <Text>{JSON.stringify(selectedDevice)}</Text>
      </View>
      <Button title="Connect to selected device" onPress={()=>{
        // navigation.navigate('ConnectDevice', { selectedDevice });
        navigation.navigate('ConnectDevice', { selectedDevice,} );
      }} />
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          // console.log('Device found:', item);
          return <Text onPress={()=>{
            setSelectedDevice(item)
          }}>{item.name || 'Unnamed'} - {item.id}</Text>
        }}
      />
    </View>
  );
}
export default BasicScan;