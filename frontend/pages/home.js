import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth, useSignOut } from '@clerk/clerk-expo';

const Home = ({ navigation }) => {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { signOut } = useSignOut();

  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [message, setMessage] = useState('');

  // ... existing code ...

  const emojis = [
    { label: 'Sad', symbol: '😢', position: { top: '70%', left: '20%' } },
    { label: 'Happy', symbol: '😊', position: { top: '7%', left: '38%' } },
    { label: 'Angry', symbol: '😡', position: { top: '70%', left: '60%' } },
    { label: 'Anxious', symbol: '😰', position: { top: '35%', left: '2%' } },
    { label: 'Neutral', symbol: '😐', position: { top: '35%', left: '75%' } },
  ];

  const handleEmojiPress = (emoji) => {
    setSelectedEmoji(emoji.symbol);
    setSelectedLabel(emoji.label);
  };

  const handleSubmit = () => {
    alert(`Feeling: ${selectedEmoji || 'None'}\nMessage: ${message}`);
  };

  const handleSignOut = async () => {
    await signOut();
    navigation.replace('SignIn');
  };

  const handleDM = async () => {
    navigation.navigate('Messages');
  }

  if (!isLoaded) {
    return null;
  }

  if (!userId) {
    navigation.replace('SignIn');
    return null;
  }

  return (
    <View style={styles.container}>
      <Button title="Message" onPress={handleDM} />
      <Text style={styles.heading}>How are you feeling today?</Text>

      <View style={styles.emojiCircle}>
        {emojis.map((emoji) => (
          <TouchableOpacity
            key={emoji.label}
            style={[
              styles.emojiButton,
              selectedEmoji === emoji.symbol && styles.selectedEmoji,
              emoji.position
            ]}
            onPress={() => handleEmojiPress(emoji)}
          >
            <Text style={styles.emoji}>{emoji.symbol}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedLabel ? (
        <Text style={styles.selectedLabel}>
          {selectedLabel}
        </Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Optional: Why do you feel this way?"
        value={message}
        onChangeText={setMessage}
      />

      <Button title="Submit" onPress={handleSubmit} />
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',  // Soft yellow background for calmness
    padding: 16,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    color: '#6A5D5D',  // Warm, neutral text color
    textAlign: 'center',
  },
  emojiCircle: {
    width: 300,  // Size of the circle
    height: 300,
    borderRadius: 150,
    position: 'relative',  // Relative positioning for absolute children
    marginBottom: 20,
  },
  emojiButton: {
    position: 'absolute',  // Allows us to position each emoji in the circle
    alignItems: 'center',
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#FFE0B2',  // Light orange for buttons
    width: 70,
    height: 70,
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 30,
  },
  selectedEmoji: {
    backgroundColor: '#FFB74D',  // Highlight selected emoji
  },
  selectedLabel: {
    fontSize: 18,
    color: '#6A5D5D',
    marginBottom: 20,  // Margin between label and text input
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1C4E9',  // Soft purple for input border
    borderRadius: 5,
    padding: 10,
    width: '80%',
    marginBottom: 20,
    backgroundColor: '#FFF',
  },
});
export default Home;