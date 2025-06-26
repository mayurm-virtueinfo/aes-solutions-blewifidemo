import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import manager from '../utility/bleManager';
// import { requestBluetoothPermissions } from './permissions'; // from step 2


const BLEScanner = ({ onSelectDevice }: { onSelectDevice: any }) => {
    const [devices, setDevices] = useState<any[]>([]);
    const [scanning, setScanning] = useState(false);

    //   useEffect(() => {
    //     // requestBluetoothPermissions();
    //     return () => {
    //       manager.destroy();
    //     };
    //   }, []);
    const refDevices = useRef<any[]>([]);
    const startScan = () => {
        setDevices([]);
        refDevices.current = [];
        setScanning(true);

        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.warn('Scan error:', error);
                setScanning(false);
                return;
            }

            // Only show named devices and avoid duplicates
            // if (device?.name && !devices.find(d => d.id === device.id)) {
            //     console.log('Found device:', device.name, device.id);
            //     setDevices(prev => [...prev, device]);
            // }
            console.log('Found device:', device?.name, device?.id);
            console.log('includes :', device?.name?.toUpperCase().includes('EPS32'));
            const mDevices = refDevices.current;
            mDevices.filter(d => d.id === device?.id).length === 0 && mDevices.push(device);
            refDevices.current = mDevices;
            setDevices(mDevices)

            // if(devices.filter(d => d.id === device?.id).length === 0){
            //     setDevices(prev => [...prev, device]);
            // }

            // if (device?.name?.toUpperCase().includes('EPS32')) {
                console.log('Entered:');
                
                // manager.stopDeviceScan();
                // Alert.alert('Device found', `Connected to ${device.name}`);
            // }
        });

        // Stop scan after 10 sec
        setTimeout(() => {
            manager.stopDeviceScan();
            setScanning(false);
        }, 10000);
    };

    const handleSelectDevice = (device: any) => {
        manager.stopDeviceScan();
        onSelectDevice(device); // <-- set deviceId in parent
    };

    return (
        <View style={{ padding: 20 }}>
            <Button title="Scan for Devices" onPress={startScan} />
            {scanning && <ActivityIndicator style={{ margin: 10 }} />}
            <FlatList
                data={devices}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleSelectDevice(item)}
                        style={{ padding: 10, borderBottomWidth: 1 }}
                    >
                        <Text>{item.name || 'Unnamed device'}</Text>
                        <Text>{item.id}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default BLEScanner;
