import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, Image, Animated, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';

export default function SignInScreen({ navigation }) {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const bounceValue = new Animated.Value(1);

  const startBounce = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    startBounce(); // Start the bounce animation when the component mounts
  }, []);

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      await setActive({ session: completeSignIn.createdSessionId });
      navigation.replace('Home');
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100} // Adjust this value as needed for different devices
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.logoContainer}>
          <Animated.View style={{ transform: [{ scale: bounceValue }] }}>
            <Image
              source={require('../assests/images/VibeCheck_New_Logo.jpg')}
              style={styles.image}
            />
          </Animated.View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email..."
            onChangeText={setEmailAddress}
            style={styles.input}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            placeholder="Password..."
            secureTextEntry={true}
            onChangeText={setPassword}
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.signInButton} onPress={onSignInPress}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.text} onPress={() => navigation.navigate('SignUp')}>
          Don't have an account? Sign up
        </Text>

        <Text style={styles.trademark}>@2024 VibeCheck, All Rights Reserved</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff4e1',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40, // Adjusted margin
    marginTop: 10,
    height: 170, // Ensuring the container has a fixed height
  },
  image: {
    width: 170, // Fixed width
    height: 170, // Fixed height to ensure it doesn't collapse
    resizeMode: 'contain',
  },
  inputContainer: {
    marginBottom: 20, // Add some space between the inputs and the rest of the content
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 3,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  signInButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  signInButtonText: {
    color:'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  text: {
    marginTop: 40,
    textAlign: 'center',
    color: 'blue',
  },
});