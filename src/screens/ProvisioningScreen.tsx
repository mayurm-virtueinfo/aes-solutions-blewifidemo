import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Image,
  Pressable,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ESPTransport,
  ESPSecurity,
  ESPStatusResponse,
} from '@orbital-systems/react-native-esp-idf-provisioning';
import type { StackParamList } from './types';
import { Images } from '../theme/Images';
import { CommonActions, useFocusEffect } from '@react-navigation/native';


const ProvisioningScreen: React.FC<NativeStackScreenProps<StackParamList, 'ProvisioningScreen'>> = (
  props
) => {
  const insets = useSafeAreaInsets();
  const [name, setName] = React.useState<string>(
    props?.route?.params?.device?.name ?? ''
  );
  // State setter for loading indicator
  const [loading, setLoading] = React.useState<boolean>(false);
  const [response, setResponse] = React.useState<ESPStatusResponse | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true; // Returning true disables back

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );
  const refTimer = useRef<NodeJS.Timeout | null>(null);

  const TIMEOUT = 25 * 1000;
  useEffect(()=>{
    provisionDeviceToWifi()

    refTimer.current = setTimeout(() => {
      console.log('✅ 10 seconds passed. Callback triggered.');
      myCallback();
    }, TIMEOUT); // 10 milliseconds

    return () => {
      if (refTimer.current) {
        clearTimeout(refTimer.current);
      }
    }; // cleanup

  },[])
  const myCallback = () => {
    // Your custom logic here
    console.log('myCallback : loading : ',loading);
    console.log('myCallback : response : ',response);
      const status : ESPStatusResponse = {
        status : 'fail'
      }
      setLoading(false);
      setResponse(status);
    console.log('🎯 Timeout');
  };
  useLayoutEffect(() => {
    if (!props.navigation) return;

    props.navigation.setOptions({
      title: 'Provisioning',
      headerBackVisible: false, // ✅ Hides the back button in native-stack
      gestureEnabled: false,
    });
  }, [props.navigation]);

  const provisionDeviceToWifi = async () => {
    try {
      setLoading(true);
      const ssid = props.route.params.ssid;
      const passphrase = props.route.params.passphrase;
      const espResponse = await props.route.params.device.provision(
        ssid,
        passphrase
      );
      setResponse(espResponse);
      setLoading(false);
      if (refTimer.current) {
        clearTimeout(refTimer.current);
      }
    } catch (error) {
      if (refTimer.current) {
        clearTimeout(refTimer.current);
      }
      const status : ESPStatusResponse = {
        status : 'fail'
      }
      setLoading(false);
      setResponse(status);
      // Alert.alert(
      //   'Provisioning Error',
      //   `Failed to provision ${props.route.params.ssid} with the provided password. Please try again. ${JSON.stringify(error, null, 2)}`
      // );
    }
  }
  const handleOk = () => {
    // Add navigation or dismiss logic here
    console.log('Provisioning completed.');
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'ESPIDFProvisionScreen' }], // <-- Replace with your actual route name
      })
    );

  };
  const handleGoBack = () => {
    // Add navigation or dismiss logic here
    console.log('handleGoBack');
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'ESPIDFProvisionScreen' }], // <-- Replace with your actual route name
      })
    );

  };
  return (
    <SafeAreaView style={styles.container}>
      {/* <Text style={styles.title}>Provisioning</Text> */}

      <View style={styles.imageContainer}>
        <Image
          source={Images.ic_provisioning} // Replace with your actual image path
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={{ height: 100, alignItems: 'center', justifyContent: 'center' }}>
        {
          loading && <ActivityIndicator color={'#5B4DE3'} size={'large'} />
        }
        {
          (!loading && response != null && response.status == 'success') && <View>
            <View style={styles.statusRow}>
              <Ionicons name="checkmark-circle" size={24} color="#5B4DE3" />
              <Text style={styles.statusText}>Sending Wi-Fi credentials.</Text>
            </View>

            <View style={styles.statusRow}>
              <Ionicons name="checkmark-circle" size={24} color="#5B4DE3" />
              <Text style={styles.statusText}>Confirming Wi-Fi connection.</Text>
            </View>
          </View>
        }
        {
          (!loading && response != null && response.status != 'success') && <View style={{alignItems:'center',justifyContent:'center'}}>
            <View style={styles.statusRowFailed}>
              {/* <Ionicons name="checkmark-circle" size={24} color="#5B4DE3" /> */}
              <Text style={styles.statusTextFailed}>Incorrect Wi-Fi credentials</Text>
            </View>

            {/* <View style={styles.statusRow}>
              <Text style={styles.statusTextFailed}>{JSON.stringify(response)}</Text>
            </View> */}
          </View>
        }
      </View>

      {
        (!loading && response != null && response.status == 'success') && <Text style={styles.successText}>
        Device has been successfully provisioned!
      </Text>
      }

      {
        (!loading && response != null && response.status == 'success') && <Pressable style={styles.button} onPress={handleOk}>
          <Text style={styles.buttonText}>Ok</Text>
        </Pressable>
      }
      {
        (!loading && response != null && response.status != 'success') && <Pressable style={styles.button} onPress={handleGoBack}>
          <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
      }

      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  imageContainer: {
    marginTop: 40,
    marginBottom: 30,
  },
  image: {
    width: 120,
    height: 120,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  statusRowFailed: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  statusText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  statusTextFailed: {
    marginLeft: 10,
    fontSize: 16,
    color: 'red',
  },
  successText: {
    marginTop: 30,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ProvisioningScreen;


