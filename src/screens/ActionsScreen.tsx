import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Actions'>;

const ActionsScreen: React.FC<Props> = () => {
  const handleAction = (label: string) => {
    Alert.alert('Action Triggered', `${label} executed.`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Available Actions</Text>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => handleAction('Restart System')}
      >
        <Text style={styles.actionText}>Restart System</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => handleAction('Reset Configuration')}
      >
        <Text style={styles.actionText}>Reset Configuration</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => handleAction('Sync with Server')}
      >
        <Text style={styles.actionText}>Sync with Server</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => handleAction('Reboot Device')}
      >
        <Text style={styles.actionText}>Reboot Device</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ActionsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#fff'
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333'
  },
  actionButton: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 16
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500'
  }
});
