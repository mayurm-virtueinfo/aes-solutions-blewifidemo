import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC<Props> = ({navigation}) => {
  const [email, setEmail] = useState('');

  const handleSendResetLink = () => {
    // TODO: Implement email validation + API call
    console.log('Reset link sent to:', email);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerHeader}>
        <TouchableOpacity style={styles.containerBack} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.containerTitle}> 
            <Text style={styles.headerTitle}>Forgot Password</Text>
        </View>
        <View style={styles.containerEmpty}/>
        {/* <View style={{ width: 24 }} /> */}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          Enter Your Email Address To{"\n"}Reset Your Password.
        </Text>

        <View style={styles.inputWrapper}>
          <FontAwesome name="user" size={20} style={styles.icon} />
          <TextInput
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSendResetLink}>
          <Text style={styles.buttonText}>Send Reset Link</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8ff',
  },
  containerEmpty:{
    height:40,
    width:40,
    alignItems:'center',
    justifyContent:'center',
},
  containerTitle:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
},
  containerBack:{
    height:40,
    width:40,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:100,
    backgroundColor:'white'
},
  containerHeader: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height:55,
    paddingLeft:10,
    paddingRight:10
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    // position:'absolute',
    // alignSelf:'center'
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 32,
    color: '#000',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 52,
  },
  icon: {
    marginRight: 10,
    color: '#000',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
