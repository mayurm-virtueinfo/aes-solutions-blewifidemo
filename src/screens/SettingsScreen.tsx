import * as React from 'react';
import {
  View,
  ScrollView,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import DefaultPreference from 'react-native-default-preference';
import {
  ESPTransport,
  ESPSecurity,
} from '@orbital-systems/react-native-esp-idf-provisioning';
import { styles } from './theme';

const CheckBox: React.FC<{
  title: string;
  checked: boolean;
  onPress: () => void;
}> = ({ title, checked, onPress }) => (
  <TouchableOpacity onPress={onPress} style={checkboxStyles.container}>
    <View style={[checkboxStyles.box, checked && checkboxStyles.checkedBox]} />
    <Text style={checkboxStyles.label}>{title}</Text>
  </TouchableOpacity>
);

const SettingsScreen: React.FC = () => {
  const [prefix, setPrefix] = React.useState<string>('');
  const [transport, setTransport] = React.useState<ESPTransport>(
    ESPTransport.ble
  );
  const [security, setSecurity] = React.useState<ESPSecurity>(
    ESPSecurity.secure2
  );

  useFocusEffect(
    React.useCallback(() => {
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

  const onPrefixBlur = React.useCallback(async () => {
    try {
      if (typeof prefix === 'string') {
        await DefaultPreference.set('prefix', prefix);
      }
    } catch (error) {
      Alert.alert('Error PrefixBlur', JSON.stringify(error, null, 2));
    }
  }, [prefix]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={localStyles.label}>Search prefix</Text>
        <TextInput
          placeholder="Search prefix"
          value={prefix}
          onChangeText={setPrefix}
          onBlur={onPrefixBlur}
          style={localStyles.input}
        />

        <Text style={localStyles.heading}>Search transport</Text>
        <View style={localStyles.checkboxGroup}>
          <CheckBox
            title="BLE"
            checked={transport === ESPTransport.ble}
            onPress={() => {
              setTransport(ESPTransport.ble);
              DefaultPreference.set('transport', ESPTransport.ble);
            }}
          />
          <CheckBox
            title="SoftAP"
            checked={transport === ESPTransport.softap}
            onPress={() => {
              setTransport(ESPTransport.softap);
              DefaultPreference.set('transport', ESPTransport.softap);
            }}
          />
        </View>

        <Text style={localStyles.heading}>Search security</Text>
        <View style={localStyles.checkboxGroup}>
          <CheckBox
            title="Insecure"
            checked={security === ESPSecurity.unsecure}
            onPress={() => {
              setSecurity(ESPSecurity.unsecure);
              DefaultPreference.set(
                'security',
                ESPSecurity.unsecure.toString()
              );
            }}
          />
          <CheckBox
            title="Secure1"
            checked={security === ESPSecurity.secure}
            onPress={() => {
              setSecurity(ESPSecurity.secure);
              DefaultPreference.set(
                'security',
                ESPSecurity.secure.toString()
              );
            }}
          />
          <CheckBox
            title="Secure2"
            checked={security === ESPSecurity.secure2}
            onPress={() => {
              setSecurity(ESPSecurity.secure2);
              DefaultPreference.set(
                'security',
                ESPSecurity.secure2.toString()
              );
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

const localStyles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  checkboxGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

const checkboxStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
  },
  box: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#555',
    marginRight: 8,
    borderRadius: 4,
  },
  checkedBox: {
    backgroundColor: '#007bff',
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
});
