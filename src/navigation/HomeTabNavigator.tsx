import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import StatusScreen from '../screens/StatusScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ActionsScreen from '../screens/ActionsScreen';

export type HomeTabParamList = {
  Status: undefined;
  History: undefined;
  Actions: undefined;
};

const Tab = createBottomTabNavigator<HomeTabParamList>();

const HomeTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabel: ({ focused }) => {
          let label = route.name;
          return (
            <Text
              style={{
                fontSize: 12,
                color: focused ? '#000' : '#999',
                fontWeight: focused ? '600' : '400',
              }}
            >
              {label}
            </Text>
          );
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'Status') iconName = 'access-point';
          else if (route.name === 'History') iconName = 'clipboard-text-outline';
          else if (route.name === 'Actions') iconName = 'cog-outline';

          return (
            <MaterialCommunityIcons
              name={iconName}
              size={24}
              color={focused ? '#000' : '#999'}
            />
          );
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 60,
          borderTopWidth: 0.5,
          borderTopColor: '#ddd',
          elevation: 0, // For Android
        },
      })}
    >
      <Tab.Screen name="Status" component={StatusScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Actions" component={ActionsScreen} />
    </Tab.Navigator>
  );
};

export default HomeTabNavigator;
