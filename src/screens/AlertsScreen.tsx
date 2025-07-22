import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Alerts'>;

type AlertItem = {
  id: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
};

const mockAlerts: AlertItem[] = [
  {
    id: '1',
    type: 'warning',
    message: 'Low tank level detected.',
    timestamp: '2025-07-22 08:32'
  },
  {
    id: '2',
    type: 'error',
    message: 'Pump disconnected.',
    timestamp: '2025-07-21 18:15'
  },
  {
    id: '3',
    type: 'info',
    message: 'System synced successfully.',
    timestamp: '2025-07-21 12:00'
  }
];

const AlertsScreen: React.FC<Props> = () => {
  const renderItem = ({ item }: { item: AlertItem }) => (
    <View style={[styles.alertCard, styles[item.type]]}>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>System Alerts</Text>
      <FlatList
        data={mockAlerts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

export default AlertsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    margin: 20,
    textAlign: 'center',
    color: '#333'
  },
  list: {
    paddingHorizontal: 16
  },
  alertCard: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 16
  },
  message: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8
  },
  timestamp: {
    fontSize: 12,
    color: '#eee'
  },
  info: {
    backgroundColor: '#17a2b8'
  },
  warning: {
    backgroundColor: '#ffc107'
  },
  error: {
    backgroundColor: '#dc3545'
  }
});
