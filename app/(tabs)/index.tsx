import { Ionicons } from '@expo/vector-icons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InstantScreen from './main';
import LogsScreen from './logs';
import ContextScreen from './context';

const Tab = createBottomTabNavigator();

export default function MainScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',
        tabBarActiveTintColor: '#2F80ED',
        tabBarInactiveTintColor: '#8A8A8A',

        tabBarStyle: {
          backgroundColor: '#161616',
          height: 90,
          paddingBottom: 20,
          paddingTop: 12,
          borderTopWidth: 0,
          elevation: 0,
        },

        tabBarItemStyle: {
          borderRadius: 15,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={InstantScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'flash' : 'flash-outline'}
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Logs"
        component={LogsScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'list' : 'list-outline'}
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Context"
        component={ContextScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'layers' : 'layers-outline'}
              size={26}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
