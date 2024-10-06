import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image, Alert } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import * as ImagePicker from 'expo-image-picker';
import { uploadToPinata } from '../utils/pinataService';

export default function SignUpScreen({ navigation }) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [username, setUsername] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePhoto(result.uri);
    }
  };

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    if (password !== retypePassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      // Create the user in Clerk
      await signUp.create({
        username,
        emailAddress,
        password,
      });

      // Upload profile photo to Pinata if provided
      let profilePhotoUrl = '';
      if (profilePhoto) {
        profilePhotoUrl = await uploadToPinata(profilePhoto, `${username}_profile.jpg`);
      } else {
        profilePhotoUrl = 'assets/images/blank_profile_icon.png';
      }

      // Save user data to Pinata
      const userData = {
        username,
        email: emailAddress,
        profilePhotoUrl,
      };
      await uploadToPinata(JSON.stringify(userData), `${username}_data.json`);

      // Prepare for email verification
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('Error', err.message);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
      navigation.replace('HomeDrawer');
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/VibeCheckLogo.png')}
        style={styles.image}
      />
      {!pendingVerification && (
        <>
          <Text style={styles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Choose a unique username"
            style={styles.input}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            onChangeText={setEmailAddress}
            placeholder="email@example.com"
            style={styles.input}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholder="Password"
            style={styles.input}
          />
          <Text style={styles.label}>Retype Password</Text>
          <TextInput
            value={retypePassword}
            onChangeText={setRetypePassword}
            secureTextEntry={true}
            placeholder="Retype Password"
            style={styles.input}
          />
          <Button title="Upload Profile Photo" onPress={pickImage} />
          {profilePhoto && <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />}
          <Button title="Sign Up" onPress={onSignUpPress} />
        </>
      )}
      {pendingVerification && (
        <>
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="Verification Code"
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
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 10,
  },
});