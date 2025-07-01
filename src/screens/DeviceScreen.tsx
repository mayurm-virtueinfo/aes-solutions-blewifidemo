import React, { FC, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ESPDevice } from '@orbital-systems/react-native-esp-idf-provisioning';
import type { StackParamList } from './types';

const DeviceScreen: FC<NativeStackScreenProps<StackParamList, 'Device'>> = (props) => {
  const insets = useSafeAreaInsets();
  const [device, setDevice] = useState<ESPDevice | undefined>();
  const [versionInfo, setVersionInfo] = useState<Record<string, any>>();
  const [deviceCapabilities, setDeviceCapabilities] = useState<string[]>();

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
          Alert.alert(
            'Error connecting to espDevice:',
            JSON.stringify(error, null, 2)
          );
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
          <Text style={styles.header}>Device name</Text>
          <Text style={styles.text}>{device?.name}</Text>

          <Text style={styles.header}>Capabilities</Text>
          <Text style={styles.text}>
            {JSON.stringify(deviceCapabilities ?? [])}
          </Text>

          <Text style={styles.header}>Version info</Text>
          <Text style={styles.text}>
            {JSON.stringify(versionInfo ?? {})}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => props.navigation.navigate('WifiList', { device })}
            disabled={!device}
          >
            <Text style={styles.buttonText}>Scan Wi-Fi list</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => props.navigation.navigate('SendData', { device })}
            disabled={!device}
          >
            <Text style={styles.buttonText}>Send data</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          <ActivityIndicator style={{ height: '100%' }} />
        </View>
      )}

      <View style={{ paddingBottom: insets.bottom }}>
        <TouchableOpacity
          style={[styles.button, { marginTop: 12 }]}
          onPress={() => {
            console.log('Disconnecting from espDevice : ', JSON.stringify(device, null, 2));
            device?.disconnect();
            console.log('Disconnected from espDevice');
            props.navigation.goBack();
          }}
          disabled={!device}
        >
          <Text style={styles.buttonText}>Disconnect</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DeviceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
  },
  button: {
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
