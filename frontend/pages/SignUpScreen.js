import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image, Alert, Animated, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
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
  const [reenterPassword, setReenterPassword] = useState('');
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
    if (!isLoaded) return;
    if (password !== retypePassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      await signUp.create({
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100} // Adjust this for different devices
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
SignUpScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff4e1',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60, // Adjusted margin
    marginTop: 10,
    height: 130, // Ensuring the container has a fixed height
  },
  image: {
    width: 130, // Fixed width
    height: 130, // Fixed height to ensure it doesn't collapse
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
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 10,
  },
});