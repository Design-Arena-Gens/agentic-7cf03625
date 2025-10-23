import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, Text } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext.js';
import LoginScreen from './src/screens/LoginScreen.js';
import RegisterScreen from './src/screens/RegisterScreen.js';
import DashboardScreen from './src/screens/DashboardScreen.js';
import ProductCatalogScreen from './src/screens/ProductCatalogScreen.js';
import OrdersScreen from './src/screens/OrdersScreen.js';
import NotificationsScreen from './src/screens/NotificationsScreen.js';
import ProfileScreen from './src/screens/ProfileScreen.js';
import PayoutsScreen from './src/screens/PayoutsScreen.js';
import AdminScreen from './src/screens/AdminScreen.js';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f3f4f6',
  },
};

function DashboardTabs() {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes('admin');

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarStyle: { paddingTop: 8, height: 60 },
      }}
    >
      <Tab.Screen name="Overview" component={DashboardScreen} />
      <Tab.Screen name="Products" component={ProductCatalogScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Payouts" component={PayoutsScreen} />
      <Tab.Screen name="Alerts" component={NotificationsScreen} />
      {isAdmin ? <Tab.Screen name="Admin" component={AdminScreen} /> : null}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 12, color: '#6b7280' }}>Loading account...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="App" component={DashboardTabs} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer theme={theme}>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
