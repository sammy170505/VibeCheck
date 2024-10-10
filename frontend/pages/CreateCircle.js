import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { getAllUsers, addToCircle, removeFromCircle } from '../utils/userUtils';

export default function CreateCircle() {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const allUsers = await getAllUsers();
    setUsers(allUsers.filter(u => u.id !== user.id));
  };

  const handleAddRemove = async (targetUserId, action) => {
    try {
      if (action === 'add') {
        await addToCircle(user.id, targetUserId);
      } else {
        await removeFromCircle(user.id, targetUserId);
      }
      // Refresh the user list
      loadUsers();
    } catch (error) {
      console.error(`Error ${action === 'add' ? 'adding' : 'removing'} user:`, error);
    }
  };

  const renderUser = ({ item }) => (
    <View style={styles.userItem}>
      <Text>{item.username}</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => handleAddRemove(item.id, 'add')}>
          <Text style={styles.addButton}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleAddRemove(item.id, 'remove')}>
          <Text style={styles.removeButton}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Circle</Text>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  addButton: {
    color: 'green',
    marginRight: 10,
  },
  removeButton: {
    color: 'red',
  },
});