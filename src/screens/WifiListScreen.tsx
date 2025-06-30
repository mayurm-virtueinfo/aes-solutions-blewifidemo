import React, { FC, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { View, ScrollView, RefreshControl, Button } from 'react-native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, ListItem, Icon } from '@rneui/themed';
import {
  type ESPWifiList,
  ESPWifiAuthMode,
} from '@orbital-systems/react-native-esp-idf-provisioning';
import type { StackParamList } from './types';
import { styles } from './theme';
import { ListItemContent } from '@rneui/base/dist/ListItem/ListItem.Content';
import { ListItemTitle } from '@rneui/base/dist/ListItem/ListItem.Title';
import { ListItemSubtitle } from '@rneui/base/dist/ListItem/ListItem.Subtitle';
import LoaderWithMessage from '../component/LoaderWithMessage';
import WifiProvisionModal from '../component/WifiProvisionModal';

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
      console.error(error);
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
      if (!props.navigation) {
        return;
      }
  
      props.navigation.setOptions({
        title: 'Select Wi-Fi Network',
      });
    }, [props.navigation]);

  const onPressWifiItem = useCallback(
    (ssid: string) => {
      setSsid(ssid);
      setShowModal(true);
    },
    [props.navigation, wifiList, props.route.params.device]
  );

  const onProvision = useCallback(async (passphrase: string) => {
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
      console.error(error);
    }
  }, [props.route.params.device, ssid]);

  return (
    <View style={styles.container}>
      <LoaderWithMessage loading={isLoading} loaderText={loaderText} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.text} >
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
                  <ListItem
                    key={item.ssid}
                    bottomDivider
                    onPress={onPressWifiItem.bind(null, item.ssid)}
                  >
                    <Icon name={icon} type="material-community" />
                    <ListItemContent>
                      <ListItemTitle>{item.ssid}</ListItemTitle>
                      <ListItemSubtitle>
                        {espWifiAuthToString[item.auth]}
                      </ListItemSubtitle>
                    </ListItemContent>
                    <ListItem.Chevron />
                  </ListItem>
                );
              })
          ) : (
            <ListItem style={{ opacity: 0.5 }}>
              <Icon name="alert-circle" type="material-community" />
              <ListItemContent>
                <ListItemTitle>No devices found</ListItemTitle>
              </ListItemContent>
            </ListItem>
          ))}
        {
          response != '' && (
            <View>
              <Text style={styles.text} h4>
                Response
              </Text>
              <Text style={styles.text}>{response}</Text>
            </View>
          )
        }
        <WifiProvisionModal
          visible={showModal}
          wifiName={ssid}
          onCancel={() => setShowModal(false)}
          onProvision={(password) => {
            console.log('Provisioning with password:', password);
            setShowModal(false);
            onProvision(password);
          }}
        />
      </ScrollView>
    </View>
  );
}
export default WifiListScreen;