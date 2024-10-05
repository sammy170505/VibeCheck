import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // Import navigation hook

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    // Simple validation (in a real app, you'd validate more robustly)
    if (username && password) {
      // Navigate to the Home screen if login is successful
      navigation.navigate('Home');
    } else {
      alert('Please enter both username and password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login Screen</Text>

      {/* Username Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Username"
        value={username}
        onChangeText={setUsername}  // Update the username state
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        secureTextEntry={true}  // Hide the password input
        value={password}
        onChangeText={setPassword}  // Update the password state
      />

      {/* Login Button */}
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

// Simple styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});

export default LoginPage;