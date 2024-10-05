import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Page!</Text>
      <Button 
        title="Go to Mood Calendar"
        onPress={() => navigation.navigate('MoodCalendar')}
      />
    </View>
  );
};

export default Home;