// bring in external files or components into the current file
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './pages/home';  
import MoodCalendar from './pages/moodCalender';  
import LoginPage from './pages/login';  // Import the Login page

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginPage">  
        <Stack.Screen name="Login" component={LoginPage} />  
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="MoodCalendar" component={MoodCalendar} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}