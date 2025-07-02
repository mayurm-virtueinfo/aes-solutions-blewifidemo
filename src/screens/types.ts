import {
  ESPDevice,
  ESPTransport,
  ESPSecurity,
} from '@orbital-systems/react-native-esp-idf-provisioning';

export type StackParamList = {
  HomeScreen:undefined;
  BLEProvisionScreen: undefined;
  BasicScan: undefined;
  ConnectDevice: {selectedDevice:any};
  ReadWrite: undefined;
  Notifications: undefined;
  Disconnect: undefined;
  ESPIDFProvisionScreen: undefined;
  Settings: undefined;
  Provision:
    | { name: string; transport: ESPTransport; security: ESPSecurity }
    | undefined;
  WifiList: { device: ESPDevice };
  ProvisioningScreen: { device: ESPDevice; ssid: string,passphrase: string };
  WifiPassword: { device: ESPDevice; ssid: string };
  Device: {
    name: string;
    transport: ESPTransport;
    security: ESPSecurity;
    softAPPassword?: string;
    proofOfPossession?: string;
    username?: string;
  };
  SendData: {
    device: ESPDevice;
  };
};
