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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DefaultPreference from 'react-native-default-preference';
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
  const [proofOfPossession, setProofOfPossession] = useState<string>();
  const [username, setUsername] = useState<string>();

  useFocusEffect(
    useCallback(() => {
      DefaultPreference.get('prefix').then((value) => {
        if (typeof value === 'string') {
          setPrefix(value);
        }
      });
      DefaultPreference.get('transport').then((value) => {
        if (typeof value === 'string') {
          setTransport(value as ESPTransport);
        }
      });
      DefaultPreference.get('security').then((value) => {
        if (typeof value === 'string') {
          setSecurity(Number(value) as ESPSecurity);
        }
      });
    }, [])
  );

  useLayoutEffect(() => {
    if (!props.navigation) {
      return;
    }

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

      props.navigation.navigate('Provision', {
        name: device.name,
        transport: device.transport,
        security: device.security,
      });

      // Uncomment if you want to auto-connect before navigating
      /*
      try {
        setLoading(true);
        setLoaderText(`Connecting to ${device.name}...`);
        setConnectedDevice(undefined);
        await device.connect(proofOfPossession, softAPPassword, username);
        setLoading(false);
        setLoaderText('');
        setConnectedDevice(device);
        props.navigation.navigate('WifiList', { device });
      } catch (error) {
        setLoaderText('');
        setLoading(false);
        setConnectedDevice(undefined);
        Alert.alert('Connection Error', JSON.stringify(error, null, 2));
      }
      */
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
                <MaterialCommunityIcons
                  name="chip"
                  size={24}
                  color="black"
                  style={{ marginRight: 10 }}
                />
                <View style={{ flex: 1 }}>
                  <Text>{device.name}</Text>
                  <Text>{espSecurityToString[device.security]}</Text>
                </View>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            ))
          ) : (
            <View style={{ opacity: 0.5, alignItems: 'center', marginTop: 50 }}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={30}
                color="gray"
              />
              <Text style={{ marginTop: 10 }}>No devices found</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Optional Button Example */}
      {/* 
      <View style={{ paddingBottom: insets.bottom }}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Provision')}
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: '#007AFF',
            borderRadius: 8,
            alignItems: 'center',
            margin: 10,
          }}
        >
          <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Provision</Text>
        </TouchableOpacity>
      </View>
      */}
    </View>
  );
};

export default ESPIDFProvisionScreen;
