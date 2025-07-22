import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Status'>;

const StatusScreen: React.FC<Props> = ({ navigation }) => {
  const handleViewSystem = () => {
    navigation.navigate('ViewSystem1');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>System Status</Text>

      <View style={styles.statusCard}>
        <Text style={styles.label}>Connected:</Text>
        <Text style={styles.value}>Yes</Text>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.label}>Wi-Fi SSID:</Text>
        <Text style={styles.value}>HomeNetwork</Text>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.label}>Device ID:</Text>
        <Text style={styles.value}>12345-ABCDE</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleViewSystem}>
        <Text style={styles.buttonText}>View System</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default StatusScreen;

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
  statusCard: {
    backgroundColor: '#f5f5f5',
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
