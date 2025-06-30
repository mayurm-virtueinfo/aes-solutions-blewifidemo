import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, ListItem, Icon } from '@rneui/themed';
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
import { ListItemContent } from '@rneui/base/dist/ListItem/ListItem.Content';
import { ListItemTitle } from '@rneui/base/dist/ListItem/ListItem.Title';
import { ListItemSubtitle } from '@rneui/base/dist/ListItem/ListItem.Subtitle';
import Loader from '../component/Loader';
import LoaderWithMessage from '../component/LoaderWithMessage';

const ESPIDFProvisionScreen: React.FC<NativeStackScreenProps<StackParamList, 'ESPIDFProvisionScreen'>> = (
  props: NativeStackScreenProps<StackParamList, 'ESPIDFProvisionScreen'>,
) => {

  const [devices, setDevices] = useState<ESPDevice[] | undefined>();
  const [connectedDevice, setConnectedDevice] = useState<ESPDevice | undefined>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [loaderText, setLoaderText] = useState<string>('');
  const [prefix, setPrefix] = useState<string>('');
  const [transport, setTransport] = useState<ESPTransport>(
    ESPTransport.ble
  );
  const [security, setSecurity] = useState<ESPSecurity>(
    ESPSecurity.secure2
  );
  const insets = useSafeAreaInsets();
  const [softAPPassword, setSoftAPPassword] = React.useState<string>();
  const [proofOfPossession, setProofOfPossession] = React.useState<string>();
  const [username, setUsername] = React.useState<string>();
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
      // headerRight: () => (
      //   <Button
      //     icon={{ type: 'material-community', name: 'cog' }}
      //     onPress={() => props.navigation.navigate('Settings')}
      //     type="clear"
      //     buttonStyle={{ padding: 0 }}
      //   />
      // ),
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
      console.error(error);
    }
  }, [prefix, security, transport]);

  const espSecurityToString = {
    [ESPSecurity.unsecure]: 'Insecure',
    [ESPSecurity.secure]: 'Secure',
    [ESPSecurity.secure2]: 'Secure2',
  };

  useEffect(() => {
    onSearchESPDevices();
  }, [])

  const onPressBLEDevice = useCallback(async (device: ESPDevice) => {
    console.log('Device pressed: new', JSON.stringify(device, null, 2));

    // props.navigation.navigate('Provision', {
    //   name: device.name,
    //   transport: device.transport,
    //   security: device.security,
    // });
    try {

      setLoading(true);
      setLoaderText(`Connecting to ${device.name}...`);
      setConnectedDevice(undefined);
      await device.connect(
        proofOfPossession,
        softAPPassword,
        username
      );
      setLoading(false);
      setLoaderText('');
      setConnectedDevice(device);
      props.navigation.navigate('WifiList', { device });
      // console.info('Connected to espDevice : ', JSON.stringify(device, null, 2));

    } catch (error) {
      console.error(error);
      setLoaderText('');
      setLoading(false);
      setConnectedDevice(undefined);
    }
  },
    [devices, props.navigation]
  );
  return (
    <View style={styles.container}>
      <LoaderWithMessage loading={isLoading} loaderText={loaderText} />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={onSearchESPDevices}
          />
        }
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        {/* <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <Text>
            Pull to search for devices{' '}
            {prefix ? `starting with "${prefix}"` : ''}
          </Text>
        </View> */}
        <View style={{ flexGrow: 1 }}>
          {devices &&
            (devices.length ? (
              devices.map((device) => (
                <ListItem
                  key={device.name}
                  bottomDivider
                  onPress={onPressBLEDevice.bind(null, device)}
                >
                  <Icon name="chip" type="material-community" />

                  <ListItemContent>
                    <ListItemTitle>{device.name}</ListItemTitle>
                    <ListItemSubtitle>
                      {espSecurityToString[device.security]}
                    </ListItemSubtitle>
                  </ListItemContent>
                  <ListItem.Chevron />
                </ListItem>
              ))
            ) : (
              <ListItem style={{ opacity: 0.5 }}>
                <Icon name="alert-circle" type="material-community" />
                <ListItem.Content>
                  <ListItemTitle>No devices found</ListItemTitle>
                </ListItem.Content>
              </ListItem>
            ))}
        </View>
      </ScrollView>
      {/* <View style={{ paddingBottom: insets.bottom }}>
        <Button
          title="Provision"
          type="outline"
          onPress={() => props.navigation.navigate('Provision')}
        />
      </View> */}
    </View>
  );
}
export default ESPIDFProvisionScreen;