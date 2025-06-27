
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager();

const ConnectDevice : React.FC = ({route}: any) => {
  const { selectedDevice } = route.params;
  const [deviceInfo, setDeviceInfo] = useState<any>(null);


  const connectToDevice = async () => {
    console.log('onPress : connectToDevice : device.id : 2 : ', );
    const devices = await manager.devices([selectedDevice.id]);
    console.log('onPress : connectToDevice : device.id : 3 : ');
    const device :any = devices[0];
    console.log('onPress : connectToDevice : device.id : 4 : ');
    if (!device) {
      console.error('Device not found');
      return;
    }
    console.log('onPress : connectToDevice : device.id : 5 : ');
    console.log('Connecting to device:', device.name || device.id);
    if (device) {
      try{

      
      console.log('onPress : connectToDevice : device.id : 6 : ');
      await device.connect();
      console.log('onPress : connectToDevice : device.id : 7 : ');
      await device.discoverAllServicesAndCharacteristics();
      console.log('onPress : connectToDevice : device.id : 8 : ');
      const services = await device.services();
      console.log('onPress : connectToDevice : device.id : 9 : ');
      setDeviceInfo({ name: device.name, services: services.length });
      console.log('onPress : connectToDevice : device.id : 10 : ',JSON.stringify(services,null,2  ));
      }catch(e){
        console.error('Error connecting to device:', JSON.stringify(e));
      }
    }
  };

  return (
    <View style={{ padding: 20,flex:1 }}>
      <Button title="Connect" onPress={()=>{
        connectToDevice();
      }} />
      <View style={{ padding: 10, borderWidth: 1, borderColor: 'red', borderRadius: 10, margin: 10 }}>
        <Text style={{ fontWeight: 'bold' }}>Selected Device:</Text>
        <Text>{JSON.stringify(selectedDevice)}</Text>
      </View>
      {deviceInfo && (
        <View>
          <Text>
          Connected to {deviceInfo.name} with {deviceInfo.services} services
        </Text>

        <Text>
          {JSON.stringify(deviceInfo, null, 2)}
        </Text>
        </View>
      )}
    </View>
  );
}
export default ConnectDevice;