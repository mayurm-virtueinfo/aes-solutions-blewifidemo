import * as React from 'react';
import {
  View,
  ScrollView,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StackParamList } from './types';
import { styles as themeStyles } from './theme';

const SendDataScreen: React.FC<NativeStackScreenProps<StackParamList, 'SendData'>> = (
  props
) => {
  const insets = useSafeAreaInsets();
  const [path, setPath] = React.useState<string>('');
  const [data, setData] = React.useState<string>('');
  const [response, setResponse] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  const onSend = React.useCallback(async () => {
    try {
      setLoading(true);
      const espResponse = await props.route.params.device.sendData(path, data);
      setResponse(espResponse);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error sendData', JSON.stringify(error, null, 2));
    }
  }, [data, path, props.route.params.device]);

  return (
    <View style={themeStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>Path</Text>
        <TextInput
          style={styles.input}
          placeholder="Path"
          value={path}
          onChangeText={(value) => setPath(value)}
        />

        <Text style={styles.label}>Data</Text>
        <TextInput
          style={styles.input}
          placeholder="Data"
          value={data}
          onChangeText={(value) => setData(value)}
        />

        <Text style={styles.responseTitle}>Response</Text>
        <Text style={styles.responseText}>{response}</Text>
      </ScrollView>

      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity
          onPress={onSend}
          disabled={loading}
          style={[styles.button, loading && styles.buttonDisabled]}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    fontSize: 16,
    marginBottom: 16,
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
  },
  responseText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SendDataScreen;
