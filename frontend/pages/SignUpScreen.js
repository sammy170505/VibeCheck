import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image, Alert } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import * as ImagePicker from 'expo-image-picker';
import { uploadToPinata, uploadJSONToPinata } from '../../backend/services/pinataService';
//import { VibeCheckLogo} from '../assests/images/VibeCheckLogo.png';
// import { CLERK_API_KEY } from '@env';
// import { saveUserData } from '../utils/userUtils';
import PropTypes from 'prop-types';

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

    if (!result.canceled) {
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
      const clerkUser = await signUp.create({
        username,
        emailAddress,
        password,
      });
  
      // Upload profile photo to Pinata if provided
      let profilePhotoCid = '';
      if (profilePhoto) {
        profilePhotoCid = await uploadToPinata(profilePhoto, `${username}_profile.jpg`);
      }
  
      // Save user data to Pinata
      const userData = {
        username,
        email: emailAddress,
        userId: clerkUser.id,
        profilePhotoCid, // Include the profile photo CID
      };
      const userDataCid = await uploadJSONToPinata(userData, `${username}_data.json`);
  
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
      navigation.replace('Home');
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('Error', err.message);
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
          <Text style={styles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Choose an unique username"
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

SignUpScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

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