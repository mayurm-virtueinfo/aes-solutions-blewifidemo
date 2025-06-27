import React, { FC, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button } from '@rneui/themed';
import { ESPDevice } from '@orbital-systems/react-native-esp-idf-provisioning';
import type { StackParamList } from './types';
import { styles } from './theme';

const DeviceScreen: FC<NativeStackScreenProps<StackParamList, 'Device'>> = (
  props
) => {
  const insets = useSafeAreaInsets();
  const [device, setDevice] = useState<ESPDevice | undefined>();
  const [versionInfo, setVersionInfo] = useState<Record<string, any>>();
  const [deviceCapabilities, setDeviceCapabilities] =
    useState<string[]>();

  useEffect(() => {
    async function getVersionInfo() {
      setVersionInfo(await device?.getVersionInfo());
    }

    async function getDeviceCapabilities() {
      setDeviceCapabilities(await device?.getDeviceCapabilities());
    }

    if (device) {
      getVersionInfo();
      getDeviceCapabilities();
    }
  }, [device]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (device) {
          return () => device?.disconnect();
        }

        const espDevice = new ESPDevice({
          name: props.route.params.name,
          transport: props.route.params.transport,
          security: props.route.params.security,
        });

        try {
          console.info('Connecting to device...');
          await espDevice.connect(
            props.route.params.proofOfPossession,
            props.route.params.softAPPassword,
            props.route.params.username
          );
          console.info('Connected to espDevice : ', JSON.stringify(espDevice, null, 2));
          setDevice(espDevice);
        } catch (error) {
          console.error(error);
          props.navigation.goBack();
        }

        return () => {
          console.info('Disconnecting...');
          espDevice.disconnect();
        };
      })();
    }, [
      device,
      props.navigation,
      props.route.params.name,
      props.route.params.proofOfPossession,
      props.route.params.security,
      props.route.params.softAPPassword,
      props.route.params.transport,
      props.route.params.username,
    ])
  );

  useLayoutEffect(() => {
    if (!props.navigation) {
      return;
    }

    props.navigation.setOptions({
      title: 'Device Screen',
    });
  }, [props.navigation]);
  return (
    <View style={styles.container}>
      {device ? (
        <ScrollView>
          <Text style={styles.text} h4>
            Device name
          </Text>
          <Text style={styles.text}>{device?.name}</Text>
          <Text style={styles.text} h4>
            Capabilities
          </Text>
          <Text style={styles.text}>
            {JSON.stringify(deviceCapabilities ?? [])}
          </Text>
          <Text style={styles.text} h4>
            Version info
          </Text>
          <Text style={styles.text}>{JSON.stringify(versionInfo ?? {})}</Text>
          <View style={{ marginBottom: 8 }}>
            <Button
              title="Scan Wi-Fi list"
              onPress={() => {
                props.navigation.navigate('WifiList', { device });
              }}
              disabled={!device}
              type="outline"
            />
          </View>
          <View>
            <Button
              title="Send data"
              onPress={() => {
                props.navigation.navigate('SendData', { device });
              }}
              disabled={!device}
              type="outline"
            />
          </View>
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          <ActivityIndicator style={{ height: '100%' }} />
        </View>
      )}
      <View style={{ paddingBottom: insets.bottom }}>
        <Button
          title="Disconnect"
          onPress={() => {
            console.log('Disconnecting from espDevice : ', JSON.stringify(device, null, 2));
            device?.disconnect();
            console.log('Disconnected from espDevice');
            props.navigation.goBack();
          }}
          disabled={!device}
          type="outline"
        />
      </View>
    </View>
  );
}
export default DeviceScreen;