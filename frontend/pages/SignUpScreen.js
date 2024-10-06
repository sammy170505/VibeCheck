import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';

export default function SignUpScreen({ navigation }) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
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
      <Image
        source={require('../assests/images/VibeCheckLogo.png')}
        style={styles.image}
      />
      {!pendingVerification && (
        <>
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
          <Button title="Sign Up" onPress={onSignUpPress} />
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

          <Button title="Sign Up with Google" onPress={() => onOAuthSignUp('google')} />
          <Button title="Sign Up with Github" onPress={() => onOAuthSignUp('github')} />
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
    backgroundColor: '#f6ede4',
  },
  image: {
    width: '100%',
    height: 100,
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  text: {
    marginTop: 20,
    textAlign: 'center',
    color: 'blue',
  },
});