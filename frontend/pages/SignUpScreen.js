import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image, Animated, TouchableOpacity } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';

export default function SignUpScreen({ navigation }) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [username, setUsername] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

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

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        username,
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
      navigation.replace('Home');
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Animated.View style={{ transform: [{ scale: bounceValue}] }}>
          <Image
            source={require('../assests/images/VibeCheck_New_Logo.jpg')}
            style={styles.image}
          />
        </Animated.View>
      </View>
      {!pendingVerification && (
        <>
          <Text style={styles.label}>Username</Text>
          <TextInput
            autoCapitalize="none"
            value={username}
            placeholder="cap.america"
            onChangeText={setUsername}
            style={styles.input}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="steverogers@gmail.com" // Example placeholder
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
          <Text style={styles.label}>Re-enter Password</Text>
          <TextInput
            value={reenterPassword}
            placeholder="Re-enter Password..."
            secureTextEntry={true}
            onChangeText={setReenterPassword}
            style={styles.input}
          />
          <TouchableOpacity style={styles.signUpButton} onPress={onSignUpPress}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </>
      )}
      {pendingVerification && (
        <>
          <TextInput
            value={code}
            placeholder="Verification Code..."
            onChangeText={setCode}
            style={styles.input}
          />
          <Button title="Verify Email" onPress={onPressVerify} />
        </>
      )}
      <Text style={styles.text} onPress={() => navigation.navigate('SignIn')}>
        Already have an account? Sign in
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff4e1',
  },
  logoContainer: {
    alightItems: 'center',
    marginBottom: 82,
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: 130,
    marginBottom: 20,
    resizeMode: 'contain',
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
  signUpButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  signUpButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  text: {
    marginTop: 40,
    textAlign: 'center',
    color: 'blue',
  },
});