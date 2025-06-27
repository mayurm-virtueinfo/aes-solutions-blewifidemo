// BLEProvisionScreen.tsx - React Native BLE UI
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, PermissionsAndroid, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import base64 from 'react-native-base64';
import BLEScanner from '../component/BLEScanner';
import manager from '../utility/bleManager';

const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
const SSID_CHAR_UUID = '12345678-1234-1234-1234-1234567890ac';
const PASS_CHAR_UUID = '12345678-1234-1234-1234-1234567890ad';


const BLEProvisionScreen : React.FC = () => {
    const [ssid, setSsid] = useState('TestWiFi');
    const [password, setPassword] = useState('12345678');
    // const [deviceId, setDeviceId] = useState<string | null>(null);
    const [selectedDevice, setSelectedDevice] = useState<any>(null);
    const [connecting, setConnecting] = useState(false);

    useEffect(() => {
        requestPermissions();
        // scanAndConnect();
        // return () => {
        //     manager.destroy();
        // };
    }, []);
    async function requestPermissions() {
        if (Platform.OS === 'android') {
            await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            ]);
        }
    }

    function scanAndConnect() {
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) return console.error(error);
            if (device?.name?.includes('ESP32')) {
                manager.stopDeviceScan();
                setSelectedDevice(device);
                Alert.alert('Device found', `Connected to ${device.name}`);
            }

            
        });
    }

    async function sendCredentials() {
        console.log('sendCredentials called with deviceId:', selectedDevice?.id);
        if (!selectedDevice?.id) return;
        try {
            console.log("-----test----1")
            setConnecting(true);
            const device = await manager.connectToDevice(selectedDevice?.id);
            console.log("-----test----2 : device : ",JSON.stringify(device,null,2));
            await device.discoverAllServicesAndCharacteristics();
            console.log("-----test----3")
            const service = await device.services().then(s => s.find(x => x.uuid.includes(SERVICE_UUID.slice(0, 8))));
            console.log("-----test----4 : service : ",JSON.stringify(service,null,2));  
            if (!service) throw new Error('Service not found');
            console.log("-----test----5")
            const chars = await device.characteristicsForService(service.uuid);
            console.log("-----test----6 : chars : ",JSON.stringify(chars, null, 2));
            const ssidChar = chars.find(c => c.uuid.includes(SSID_CHAR_UUID.slice(0, 8)));
            console.log("-----test----7 : ssidChar : ",JSON.stringify(ssidChar, null, 2));
            const passChar = chars.find(c => c.uuid.includes(PASS_CHAR_UUID.slice(0, 8)));
            console.log("-----test----8 : passChar : ",JSON.stringify(passChar, null, 2));
            if (!ssidChar || !passChar) throw new Error('Chars not found');
            console.log("-----test----9")
            await device.writeCharacteristicWithResponseForService(service.uuid, ssidChar.uuid, base64.encode(ssid));
            console.log("-----test----10")
            await device.writeCharacteristicWithResponseForService(service.uuid, passChar.uuid, base64.encode(password));
            console.log("-----test----11")

            Alert.alert('✅ Success', 'Credentials sent');
        } catch (err: any) {
            Alert.alert('Error', err.message);
        } finally {
            setConnecting(false);
        }
    }

    return (
        <View style={{ padding: 20 }}>
            {!selectedDevice?.id ? (
                <View>
                    
                    <BLEScanner onSelectDevice={setSelectedDevice} />
                </View>
            ) : (
                <View>
                    <Button title={'Scan again'} onPress={() => setSelectedDevice(null)} />
                    <View style={{ padding: 10, marginTop:10,borderWidth: 1, borderColor: 'red', borderRadius: 10, marginBottom: 20 }}>
                        <Text style={{ fontWeight: 'bold' }}>Selected Device:</Text>
                        <Text>{JSON.stringify(selectedDevice,null,2)}</Text>
                        <Text>Wi-Fi SSID</Text>
                        <TextInput value={ssid} onChangeText={setSsid} style={{ borderWidth: 1, marginBottom: 10 }} />
                        <Text>Password</Text>
                        <TextInput value={password} onChangeText={setPassword} style={{ borderWidth: 1, marginBottom: 10 }} />
                        <Button title={connecting ? 'Sending...' : 'Send to ESP32'} onPress={sendCredentials} />
                    </View>
                </View>
            )}

        </View>
    );
}
export default BLEProvisionScreen;