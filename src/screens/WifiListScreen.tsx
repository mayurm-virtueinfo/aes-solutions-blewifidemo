import React, { FC, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  type ESPWifiList,
  ESPWifiAuthMode,
} from '@orbital-systems/react-native-esp-idf-provisioning';
import type { StackParamList } from './types';
import { styles } from './theme';
import LoaderWithMessage from '../component/LoaderWithMessage';
import WifiProvisionModal from '../component/WifiProvisionModal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const WifiListScreen: FC<NativeStackScreenProps<StackParamList, 'WifiList'>> = (
  props
) => {
  const [wifiList, setWifiList] = useState<ESPWifiList[] | undefined>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [loaderText, setLoaderText] = useState<string>('');
  const [ssid, setSsid] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [response, setResponse] = React.useState<string>('');

  const onRefresh = useCallback(async () => {
    try {
      const device = props.route.params.device;

      setLoading(true);
      setLoaderText(`Scanning Wi-Fi networks on ${device.name}...`);
      const espWifiList = await device.scanWifiList();
      setLoading(false);
      setWifiList(espWifiList);
    } catch (error) {
      setLoading(false);
      setLoaderText('');
      setWifiList(undefined);
      Alert.alert(
        'Error scanWifiList',
        `Failed to scan Wi-Fi networks on ${props.route.params.device.name}. Please try again. ${JSON.stringify(error, null, 2)}`
      );
    }
  }, [props.route.params.device]);

  useEffect(() => {
    onRefresh();
  }, []);

  const espWifiAuthToString = {
    [ESPWifiAuthMode.open]: 'Open',
    [ESPWifiAuthMode.wep]: 'WEP',
    [ESPWifiAuthMode.wpa2Enterprise]: 'WPA2 Enterprise',
    [ESPWifiAuthMode.wpaPsk]: 'WPA-PSK',
    [ESPWifiAuthMode.wpa2Psk]: 'WPA2-PSK',
    [ESPWifiAuthMode.wpaWpa2Psk]: 'WPA-WPA2-PSK',
    [ESPWifiAuthMode.wpa3Psk]: 'WPA3-PSK',
    [ESPWifiAuthMode.wpa2Wpa3Psk]: 'WPA2-WPA3-PSK',
  };

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: 'Select Wi-Fi Network',
    });
  }, [props.navigation]);

  const onPressWifiItem = useCallback(
    (ssid: string) => {
      setSsid(ssid);
      setShowModal(true);
    },
    [wifiList]
  );

  const onProvision = async (passphrase: string) => {
    try {
      setLoading(true);
      setLoaderText(`Provisioning ${ssid}...`);
      const espResponse = await props.route.params.device.provision(
        ssid,
        passphrase
      );
      setResponse(JSON.stringify(espResponse));
      setLoading(false);
    } catch (error) {
      setResponse((error as Error).toString());
      setLoading(false);
      Alert.alert(
        'Provisioning Error',
        `Failed to provision ${ssid} with the provided password. Please try again. ${JSON.stringify(error, null, 2)}`
      );
    }
  };

  return (
    <View style={styles.container}>
      <LoaderWithMessage loading={isLoading} loaderText={loaderText} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.text}>
          {`To continue setup of your device ${props.route.params.device.name}, please provide your Home Network's credentials.`}
        </Text>
        {wifiList &&
          (wifiList.length ? (
            wifiList
              .sort((a, b) => b.rssi - a.rssi)
              .map((item) => {
                let icon = 'wifi-strength-1';
                if (item.rssi > -50) {
                  icon = 'wifi-strength-4';
                } else if (item.rssi > -60) {
                  icon = 'wifi-strength-3';
                } else if (item.rssi > -67) {
                  icon = 'wifi-strength-2';
                }

                return (
                  <TouchableOpacity
                    key={item.ssid}
                    style={{
                      borderBottomColor: 'gray',
                      borderBottomWidth: 1,
                      flexDirection: 'row',
                      padding: 10,
                      alignItems: 'center',
                    }}
                    onPress={() => onPressWifiItem(item.ssid)}
                  >
                    <MaterialCommunityIcons name={icon} size={24} />
                    <View style={{ flex: 1, marginLeft: 15, marginRight: 15 }}>
                      <Text>{item.ssid}</Text>
                      <Text>{espWifiAuthToString[item.auth]}</Text>
                    </View>
                    <MaterialCommunityIcons
                      name="arrow-right"
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                );
              })
          ) : (
            <View style={{ opacity: 0.5, alignItems: 'center' }}>
              <MaterialCommunityIcons name="alert-circle" size={32} color="gray" />
              <Text>No devices found</Text>
            </View>
          ))}
        {response !== '' && (
          <View>
            <Text style={styles.text}>Response</Text>
            <Text style={styles.text}>{response}</Text>
          </View>
        )}
        <WifiProvisionModal
          visible={showModal}
          wifiName={ssid}
          onCancel={() => setShowModal(false)}
          onProvision={(password) => {
            setShowModal(false);
            onProvision(password);
          }}
        />
      </ScrollView>
    </View>
  );
};

export default WifiListScreen;
