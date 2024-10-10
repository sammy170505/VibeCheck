import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { getUserCircle, sendMessage, getMessages } from '../utils/userUtils';

export default function CheckIn() {
  const { user } = useAuth();
  const [circle, setCircle] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    loadCircle();
  }, []);

  const loadCircle = async () => {
    const userCircle = await getUserCircle(user.id);
    setCircle(userCircle);
  };

  const handleUserSelect = async (selectedUser) => {
    setSelectedUser(selectedUser);
    const chatMessages = await getMessages(user.id, selectedUser.id);
    setMessages(chatMessages);
  };

  const handleSendMessage = async () => {
    if (message.trim() && selectedUser) {
      await sendMessage(user.id, selectedUser.id, message);
      setMessage('');
      // Reload messages
      const updatedMessages = await getMessages(user.id, selectedUser.id);
      setMessages(updatedMessages);
    }
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity 
      style={styles.userItem} 
      onPress={() => handleUserSelect(item)}
    >
      <Text>{item.username}</Text>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }) => (
    <View style={styles.messageItem}>
      <Text style={styles.messageSender}>{item.sender === user.id ? 'You' : selectedUser.username}</Text>
      <Text>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.circleList}>
        <Text style={styles.title}>Your Circle</Text>
        <FlatList
          data={circle}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
        />
      </View>
      {selectedUser && (
        <View style={styles.chatContainer}>
          <Text style={styles.title}>Chat with {selectedUser.username}</Text>
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messageList}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  circleList: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  chatContainer: {
    flex: 2,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  messageList: {
    flex: 1,
  },
  messageItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  messageSender: {
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: 'white',
  },
});