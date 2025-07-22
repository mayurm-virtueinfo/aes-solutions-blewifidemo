import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ViewSystem2'>;

const ViewSystemScreen2: React.FC<Props> = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>System Details</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Pump Status:</Text>
        <Text style={styles.value}>Active</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Last Sync:</Text>
        <Text style={styles.value}>10:45 AM, Jul 22</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Firmware Version:</Text>
        <Text style={styles.value}>v1.3.0</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>IP Address:</Text>
        <Text style={styles.value}>192.168.1.42</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ViewSystemScreen2;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333'
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444'
  },
  value: {
    fontSize: 16,
    color: '#007bff',
    marginTop: 4
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 32
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center'
  }
});
