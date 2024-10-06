import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Flat} from 'react-native';

export default function ChatRoom({ route }) {
    const { userName } = route.params; // Get user name from navigation params
    const [messages, setMessages] = useState([
      { id: '1', text: 'Hey, how are you?', sender: userName },
      { id: '2', text: 'I am good, how about you?', sender: 'You' },
    ]);
    const [newMessage, setNewMessage] = useState('');
  
    const handleSendMessage = () => {
      if (newMessage.trim()) {
        setMessages([...messages, { id: (messages.length + 1).toString(), text: newMessage, sender: 'You' }]);
        setNewMessage('');
      }
    };
  
    const renderMessage = ({ item }) => (
      <View style={[styles.message, item.sender === 'You' ? styles.sentMessage : styles.receivedMessage]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Chat with {userName}</Text>
  
        {/* Messages List */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          style={styles.messageList}
        />
  
        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message"
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    headerText: {
      fontSize: 20,
      color: '#4A2C2A',
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    messageList: {
      flex: 1,
      marginBottom: 10,
    },
    message: {
      padding: 10,
      marginVertical: 5,
      borderRadius: 10,
      maxWidth: '75%',
    },
    sentMessage: {
      alignSelf: 'flex-end',
      backgroundColor: '#FFC107',
    },
    receivedMessage: {
      alignSelf: 'flex-start',
      backgroundColor: '#FF6F31',
    },
    messageText: {
      fontSize: 16,
      color: '#4A2C2A',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderTopWidth: 1,
      borderColor: '#00796B',
      paddingTop: 10,
    },
    textInput: {
      flex: 1,
      backgroundColor: '#f0f0f0',
      padding: 10,
      borderRadius: 20,
      marginRight: 10,
    },
    sendButton: {
      backgroundColor: '#007BFF',
      padding: 10,
      borderRadius: 20,
    },
    sendButtonText: {
      color: '#fff',
      fontSize: 16,
    },
  });