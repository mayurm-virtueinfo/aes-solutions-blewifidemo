import React, { useLayoutEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ESPTransport,
  ESPSecurity,
} from '@orbital-systems/react-native-esp-idf-provisioning';
import type { StackParamList } from './types';
import { styles } from './theme';

const CustomCheckBox = ({
  title,
  checked,
  onPress,
}: {
  title: string;
  checked: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={localStyles.checkboxContainer}>
      <View style={[localStyles.checkbox, checked && localStyles.checkboxChecked]} />
      <Text style={localStyles.checkboxLabel}>{title}</Text>
    </TouchableOpacity>
  );
};

const ProvisionScreen: React.FC<NativeStackScreenProps<StackParamList, 'Provision'>> = (
  props
) => {
  const insets = useSafeAreaInsets();
  const [name, setName] = React.useState<string>(
    props?.route?.params?.name ?? ''
  );
  const [transport, setTransport] = React.useState<ESPTransport>(
    props?.route?.params?.transport ?? ESPTransport.ble
  );
  const [security, setSecurity] = React.useState<ESPSecurity>(
    props?.route?.params?.security ?? ESPSecurity.secure2
  );
  const [softAPPassword, setSoftAPPassword] = React.useState<string>();
  const [proofOfPossession, setProofOfPossession] = React.useState<string>();
  const [username, setUsername] = React.useState<string>();

  useLayoutEffect(() => {
    if (!props.navigation) return;
    props.navigation.setOptions({ title: 'Provision ESP IDF Device' });
  }, [props.navigation]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={localStyles.label}>Device name</Text>
        <TextInput
          placeholder="Device name"
          value={name}
          onChangeText={setName}
          style={localStyles.input}
        />

        <Text style={styles.text}>Transport</Text>
        <View style={localStyles.row}>
          <CustomCheckBox
            title="BLE"
            checked={transport === ESPTransport.ble}
            onPress={() => setTransport(ESPTransport.ble)}
          />
          <CustomCheckBox
            title="SoftAP"
            checked={transport === ESPTransport.softap}
            onPress={() => setTransport(ESPTransport.softap)}
          />
        </View>

        <Text style={styles.text}>Security</Text>
        <View style={localStyles.row}>
          <CustomCheckBox
            title="Insecure"
            checked={security === ESPSecurity.unsecure}
            onPress={() => setSecurity(ESPSecurity.unsecure)}
          />
          <CustomCheckBox
            title="Secure1"
            checked={security === ESPSecurity.secure}
            onPress={() => setSecurity(ESPSecurity.secure)}
          />
          <CustomCheckBox
            title="Secure2"
            checked={security === ESPSecurity.secure2}
            onPress={() => setSecurity(ESPSecurity.secure2)}
          />
        </View>

        {transport === ESPTransport.softap && (
          <>
            <Text style={localStyles.label}>SoftAP password</Text>
            <TextInput
              placeholder="SoftAP password"
              value={softAPPassword}
              onChangeText={setSoftAPPassword}
              style={localStyles.input}
            />
          </>
        )}

        {security === ESPSecurity.secure2 && (
          <>
            <Text style={localStyles.label}>Username</Text>
            <TextInput
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              style={localStyles.input}
            />
          </>
        )}

        {(security === ESPSecurity.secure || security === ESPSecurity.secure2) && (
          <>
            <Text style={localStyles.label}>Proof of possession</Text>
            <TextInput
              placeholder="Proof of possession"
              value={proofOfPossession}
              onChangeText={setProofOfPossession}
              style={localStyles.input}
            />
          </>
        )}
      </ScrollView>

      <View style={{ padding: 16, paddingBottom: insets.bottom }}>
        <TouchableOpacity
          onPress={() => {
            const params = {
              name,
              transport,
              security,
              softAPPassword,
              username,
              proofOfPossession,
            };
            console.log('onPress : Connect : params : ', params);
            props.navigation.navigate('Device', params);
          }}
          style={localStyles.button}
        >
          <Text style={localStyles.buttonText}>Connect</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#007BFF',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ProvisionScreen;
