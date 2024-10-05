<<<<<<< HEAD
// bring in external files or components into the current file
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './pages/home';  
import MoodCalendar from './pages/moodCalendar';  
import Login from './pages/login';  // Import the Login page

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginPage">  
        <Stack.Screen name="Login" component={Login} />  
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="MoodCalendar" component={MoodCalendar} />
      </Stack.Navigator>
    </NavigationContainer>
=======
import React from 'react';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './pages/home';  
import MoodCalendar from './pages/moodCalender';  
import LoginPage from './pages/login';  // Import the Login page
import { tokenCache } from '../clerk';
import SignInScreen from './pages/SignInScreen';
import SignUpScreen from './pages/SignUpScreen';
import Home from './pages/home';
import MoodCalendar from './pages/moodCalendar';

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
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="MoodCalendar" component={MoodCalendar} />
          </Stack.Navigator>
        </NavigationContainer>
      </ClerkLoaded>
    </ClerkProvider>
>>>>>>> 2165e5a67d0fb087c9b92ae48c84717d84c938f4
  );
}