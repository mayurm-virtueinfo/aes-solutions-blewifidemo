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

type Props = NativeStackScreenProps<RootStackParamList, 'ViewSystem1'>;

const HistoryScreen: React.FC<Props> = ({ navigation }) => {
  const handleNext = () => {
    navigation.navigate('ViewSystem2');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>System Overview</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Mode:</Text>
        <Text style={styles.value}>Automatic</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Water Flow Rate:</Text>
        <Text style={styles.value}>12 L/min</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Tank Level:</Text>
        <Text style={styles.value}>65%</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Battery Health:</Text>
        <Text style={styles.value}>Good</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HistoryScreen;

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
