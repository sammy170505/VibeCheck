import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useAuth } from '@clerk/clerk-expo';
import { deleteUserData } from '../utils/userUtils'; // Create this utility function

export default function CustomDrawerContent(props) {
  const { signOut, user } = useAuth();

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
        { 
          text: "Delete", 
          onPress: async () => {
            try {
              await deleteUserData(user.id);
              await user.delete();
              signOut();
            } catch (error) {
              console.error("Error deleting account:", error);
              Alert.alert("Error", "Failed to delete account. Please try again.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <TouchableOpacity onPress={() => props.navigation.navigate('CheckIn')}>
          <Text style={styles.drawerItem}>Check-in</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('CreateCircle')}>
          <Text style={styles.drawerItem}>Create Circle</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={styles.drawerItem}>Sign Out</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDeleteAccount}>
          <Text style={styles.drawerItem}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

// Keep the existing styles
  const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
      paddingTop: 20,
    },
    drawerItem: {
      fontSize: 18,
      padding: 15,
    },
  });