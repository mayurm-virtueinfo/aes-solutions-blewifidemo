import * as React from 'react';
import {
  View,
  ScrollView,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StackParamList } from './types';
import { styles } from './theme';
import Loader from '../component/Loader';
import { NetworkInfo } from 'react-native-network-info';
import axios from 'axios';

const WifiPasswordScreen: React.FC<NativeStackScreenProps<StackParamList, 'WifiPassword'>> = (
  props
) => {
  const PORT = 80;
  const ENDPOINT = '/status';
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [ssid, setSsid] = React.useState<string>(props.route.params.ssid);
  const [passphrase, setPassphrase] = React.useState<string>('jaybholenath');
  const [response, setResponse] = React.useState<string>('');
  const [devices, setDevices] = React.useState<any>([]);
  const [scanning, setScanning] = React.useState(false);

  const onProvision = React.useCallback(async () => {
    try {
      setLoading(true);
      const espResponse = await props.route.params.device.provision(ssid, passphrase);
      setResponse(JSON.stringify(espResponse));
    } catch (error) {
      setResponse((error as Error).toString());
      Alert.alert(
        'Error provisioning',
        `Failed to provision ${ssid} with the provided password. Please try again. ${JSON.stringify(error, null, 2)}`
      );
    } finally {
      setLoading(false);
    }
  }, [passphrase, props.route.params.device, ssid]);

  const scanIPRange = async (baseIP: any, onFound: any, onComplete: any) => {
    const ips = Array.from({ length: 254 }, (_, i) => `${baseIP}.${i + 1}`);
    for (const ip of ips) {
      try {
        const response = await axios.get(`http://${ip}:${PORT}${ENDPOINT}`, {
          timeout: 1000,
        });
        if (response && response.status === 200) {
          onFound(ip, response.data);
        }
      } catch (_) {
        // Silent fail
      }
    }
    onComplete();
  };

  const startScan = async () => {
    setScanning(true);
    setDevices([]);
    const localIP = await NetworkInfo.getIPV4Address();
    const baseIP = localIP?.split('.').slice(0, 3).join('.');
    scanIPRange(
      baseIP,
      (ip: any, data: any) => {
        setDevices((prev: any) => [...prev, { ip, data }]);
      },
      () => setScanning(false)
    );
  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={localStyles.inputContainer}>
          <Text style={localStyles.label}>SSID</Text>
          <TextInput
            style={localStyles.input}
            placeholder="SSID"
            value={ssid}
            onChangeText={(value) => setSsid(value)}
          />
        </View>

        <View style={localStyles.inputContainer}>
          <Text style={localStyles.label}>Passphrase</Text>
          <TextInput
            style={localStyles.input}
            placeholder="Passphrase"
            value={passphrase}
            onChangeText={(value) => setPassphrase(value)}
          />
        </View>

        <Text style={localStyles.heading}>Response</Text>
        <Text style={localStyles.text}>{response}</Text>

        {response !== '' && (
          <View>
            <Text style={localStyles.heading}>Devices Found</Text>
            {devices.map((device: any, index: number) => (
              <Text key={index} style={localStyles.text}>
                IP: {device.ip}, Data: {JSON.stringify(device.data)}
              </Text>
            ))}

            <TouchableOpacity style={localStyles.button} onPress={startScan} disabled={scanning}>
              {scanning ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={localStyles.buttonText}>Scan Network</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={{ paddingBottom: insets.bottom, paddingHorizontal: 16 }}>
        <TouchableOpacity
          style={[localStyles.button, { backgroundColor: '#007AFF' }]}
          onPress={onProvision}
          disabled={loading}
        >
          <Text style={localStyles.buttonText}>Connect</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    marginBottom: 6,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default WifiPasswordScreen;
