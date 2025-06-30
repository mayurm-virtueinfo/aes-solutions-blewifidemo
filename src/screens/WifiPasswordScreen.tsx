import * as React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, Input } from '@rneui/themed';
import type { StackParamList } from './types';
import { styles } from './theme';
import Loader from '../component/Loader';
import { NetworkInfo } from 'react-native-network-info';
import axios from 'axios';

const WifiPasswordScreen: React.FC< NativeStackScreenProps<StackParamList, 'WifiPassword'>> = (
  props
) => {
  const PORT = 80;
  const ENDPOINT = '/status';
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [ssid, setSsid] = React.useState<string>(props.route.params.ssid);
  const [passphrase, setPassphrase] = React.useState<string>('jaybholenath');
  const [response, setResponse] = React.useState<string>('');

  const onProvision = React.useCallback(async () => {
    try {
      setLoading(true);
      const espResponse = await props.route.params.device.provision(
        ssid,
        passphrase
      );
      setResponse(JSON.stringify(espResponse));
      setLoading(false);
    } catch (error) {
      setResponse((error as Error).toString());
      setLoading(false);
      // console.error(error);
      Alert.alert(
        'Error provisioning',
        `Failed to provision ${ssid} with the provided password. Please try again. ${JSON.stringify(error, null, 2) }`
      );
    }
  }, [passphrase, props.route.params.device, ssid]);
  const scanIPRange = async (baseIP: any, onFound: any, onComplete: any) => {
    console.log('Starting network scan...  4');
    const ips = Array.from({ length: 254 }, (_, i) => `${baseIP}.${i + 1}`);
    console.log('Starting network scan...  5 : ',ips);
    for (const ip of ips) {
      console.log('Starting network scan...  6');
      try {
        const response = await axios.get(`http://${ip}:${PORT}${ENDPOINT}`, {
          timeout: 1000,
        });
        console.log('Starting network scan...  7');
        if (response && response.status === 200) {
          onFound(ip, response.data);
        }
      } catch (err) {
        console.log('Starting network scan...  8 : ', err);
        // Silent fail
      }
    }
    onComplete();
  };
  const [devices, setDevices] = React.useState<any>([]);
  const [scanning, setScanning] = React.useState(false);
  const startScan = async () => {
    console.log('Starting network scan...');
    setScanning(true);
    setDevices([]);
    console.log('Starting network scan...  1');
    const localIP = await NetworkInfo.getIPV4Address();
    console.log('Starting network scan...  2');
    const baseIP = localIP?.split('.').slice(0, 3).join('.'); // e.g. 192.168.1
    console.log('Starting network scan...  3');

    scanIPRange(
      baseIP,
      (ip:any, data:any) => {
        setDevices((prev:any) => [...prev, { ip, data }]);
      },
      () => setScanning(false)
    );
  };
  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <ScrollView>
        <Input
          label="SSID"
          placeholder="SSID"
          value={ssid}
          onChangeText={(value) => setSsid(value)}
        />
        <Input
          label="Passphrase"
          placeholder="Passphrase"
          value={passphrase}
          onChangeText={(value) => setPassphrase(value)}
        // secureTextEntry
        />
        <Text style={styles.text} h4>
          Response
        </Text>
        <Text style={styles.text}>{response}</Text>
        {
          response != '' && (
            <View>
              <Text style={styles.text} h4>
                Devices Found
              </Text>
              {devices.map((device: any, index: number) => (
                <Text key={index} style={styles.text}>
                  IP: {device.ip}, Data: {JSON.stringify(device.data)}
                </Text>
              ))}
              
              <Button
                title="Scan Network"
                onPress={startScan}
                loading={scanning}
              />    </View>)
        }
      </ScrollView>
      <View style={{ paddingBottom: insets.bottom }}>
        <Button
          title="Connect"
          onPress={() => onProvision()}
          disabled={loading}
          type="outline"
        />
      </View>
    </View>
  );
}
export default WifiPasswordScreen;