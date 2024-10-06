import React from 'react';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { tokenCache } from '../backend/services/clerk';
// import SignInScreen from './pages/SignInScreen';
// import SignUpScreen from './pages/SignUpScreen';
import Home from '../frontend/pages/home';
//import MoodCalendar from '../frontend/pages/moodCalendar';

const Stack = createStackNavigator();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
}
export default function App() {
  return (
    <ClerkProvider 
      publishableKey={publishableKey}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="SignIn">
            {/* <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} /> */}
            <Stack.Screen name="Home" component={Home} />
            {/* <Stack.Screen name="MoodCalendar" component={MoodCalendar} /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </ClerkLoaded>
    </ClerkProvider>
  );
}