import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ESPProvisionManager,
  ESPDevice,
  ESPTransport,
  ESPSecurity,
} from '@orbital-systems/react-native-esp-idf-provisioning';
import type { StackParamList } from './types';
import { styles } from './theme';
import LoaderWithMessage from '../component/LoaderWithMessage';

const ESPIDFProvisionScreen: React.FC<
  NativeStackScreenProps<StackParamList, 'ESPIDFProvisionScreen'>
> = (props) => {
  const [devices, setDevices] = useState<ESPDevice[] | undefined>();
  const [connectedDevice, setConnectedDevice] = useState<ESPDevice | undefined>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [loaderText, setLoaderText] = useState<string>('');
  const [prefix, setPrefix] = useState<string>('');
  const [transport, setTransport] = useState<ESPTransport>(ESPTransport.ble);
  const [security, setSecurity] = useState<ESPSecurity>(ESPSecurity.secure2);
  const insets = useSafeAreaInsets();
  const [softAPPassword, setSoftAPPassword] = useState<string>();
  const [proofOfPossession, setProofOfPossession] = useState<string>('');
  const [username, setUsername] = useState<string>();

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('prefix').then((value) => {
        if (value) setPrefix(value);
      });
      AsyncStorage.getItem('transport').then((value) => {
        if (value) setTransport(value as ESPTransport);
      });
      AsyncStorage.getItem('security').then((value) => {
        if (value) setSecurity(Number(value) as ESPSecurity);
      });
    }, [])
  );

  useLayoutEffect(() => {
    if (!props.navigation) return;
    props.navigation.setOptions({
      title: `BLE Devices`,
    });
  }, [props.navigation]);

  const onSearchESPDevices = useCallback(async () => {
    try {
      setLoading(true);
      setLoaderText('Searching for BLE devices...');
      setDevices(undefined);
      setConnectedDevice(undefined);
      const espDevices = await ESPProvisionManager.searchESPDevices(
        prefix ?? '',
        transport,
        security
      );
      setLoading(false);
      setDevices(espDevices);
    } catch (error) {
      setLoading(false);
      setLoaderText('');
      setDevices([]);
      setConnectedDevice(undefined);
      Alert.alert('Error Searching for BLE devices', JSON.stringify(error, null, 2));
    }
  }, [prefix, security, transport]);

  const espSecurityToString = {
    [ESPSecurity.unsecure]: 'Insecure',
    [ESPSecurity.secure]: 'Secure',
    [ESPSecurity.secure2]: 'Secure2',
  };

  useEffect(() => {
    onSearchESPDevices();
  }, []);

  const onPressBLEDevice = useCallback(
    async (device: ESPDevice) => {
      console.log('Device pressed: new', JSON.stringify(device, null, 2));
      // props.navigation.navigate('Provision', {
      //   name: device.name,
      //   transport: device.transport,
      //   security: device.security,
      // });
      // return;
      // Uncomment if you want to auto-connect before navigating
      try {
        setLoading(true);
        setLoaderText(`Connecting to ${device.name}...`);
        setConnectedDevice(undefined);
        // await device.connect(proofOfPossession, softAPPassword, username);

        console.log('🔹 Pressed device:', device.name);
        console.log('🔹 Transport:', transport);
        console.log('🔹 Security:', security);
        console.log('🔹 PoP:', proofOfPossession);
        console.log('🔹 PoP:', typeof proofOfPossession);
        device.security = ESPSecurity.unsecure;
      // if ((security === ESPSecurity.secure || security === ESPSecurity.secure2) && !proofOfPossession) {
      //   Alert.alert("Missing PoP", "Proof of Possession is required.");
      //   setLoading(false);
      //   setLoaderText('');
      //   return;
      // }

        await new Promise((resolve) => setTimeout(resolve, 300));

        await device.connect(proofOfPossession);
        setLoading(false);
        setLoaderText('');
        setConnectedDevice(device);
        props.navigation.navigate('WifiList', { device });
      } catch (error) {
        setLoaderText('');
        setLoading(false);
        setConnectedDevice(undefined);
        console.log('Connection Error : ',JSON.stringify(error, null, 2))
        Alert.alert('Connection Error', JSON.stringify(error, null, 2));
      }
    },
    [devices, props.navigation]
  );

  return (
    <View style={styles.container}>
      <LoaderWithMessage loading={isLoading} loaderText={loaderText} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onSearchESPDevices} />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Text style={styles.text}>
                    {`To provision your new device, please make sure that your Phone's Bluetooth is turned on and within range of your new device.`}
                  </Text>
        <View style={{ flexGrow: 1, marginTop: 20 }}>
          
          {devices && devices.length ? (
            devices.map((device) => (
              <TouchableOpacity
                key={device.name}
                style={{
                  borderBottomColor: 'gray',
                  borderBottomWidth: 1,
                  flexDirection: 'row',
                  padding: 10,
                  alignItems: 'center',
                }}
                onPress={() => onPressBLEDevice(device)}
              >
                <FontAwesome
                  name="bluetooth"
                  size={24}
                  color="blue"
                  style={{ marginRight: 10 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{color:'blue'}}>{device.name}</Text>
                  <Text>{espSecurityToString[device.security]}</Text>
                </View>
                <Ionicons
                  name="arrow-forward"
                  size={24}
                  color="blue"
                />
              </TouchableOpacity>
            ))
          ) : (
            !isLoading && <View style={{  alignItems: 'center', marginTop: 50 }}>
              <Ionicons
                name="alert-circle"
                size={30}
                color="red"
              />
              <Text style={{ marginTop: 10,color:'red' }}>No devices found</Text>
            </View>
          )}
          
        </View>
      </ScrollView>
    </View>
  );
};

export default ESPIDFProvisionScreen;
