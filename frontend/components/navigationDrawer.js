import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';

const NavigationDrawer = (props) => {
  const { signOut } = useAuth();
  const navigation = useNavigation();

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => signOut() }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => {
          // Implement account deletion logic here
          console.log("Account deleted");
          signOut();
        }}
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.item}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Check-in')}>
        <Text style={styles.item}>Check-in</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignOut}>
        <Text style={styles.item}>Sign Out</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDeleteAccount}>
        <Text style={styles.item}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  item: {
    fontSize: 18,
    padding: 15,
  },
});

export default NavigationDrawer;