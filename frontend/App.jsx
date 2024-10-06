import React from 'react';
import { ClerkProvider } from '@clerk/clerk-expo';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { tokenCache } from '../backend/services/clerk';

import Home from './pages/home';
import SignInScreen from './pages/SignInScreen';
import SignUpScreen from './pages/SignUpScreen';
import CheckIn from './pages/CheckIn';
import CustomDrawerContent from './components/CustomDrawerContent';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error('Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
}
function HomeDrawer() {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="CheckIn" component={CheckIn} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomeDrawer" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="HomeDrawer" component={HomeDrawer} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ClerkProvider>
  );
}