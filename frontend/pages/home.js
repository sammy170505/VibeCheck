import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth, useSignOut } from '@clerk/clerk-expo';

export default function Home({ navigation }) {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { signOut } = useSignOut();

  if (!isLoaded) {
    return null;
  }

  if (!userId) {
    navigation.replace('SignIn');
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigation.replace('SignIn');
  };

  return (
    <View>
      <Text>Welcome to the Home Screen!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}