import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth, Clerk } from '@clerk/clerk-expo'; // Updated Clerk import

const Home = ({ navigation }) => {
  const { isLoaded, userId } = useAuth();

  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [message, setMessage] = useState('');

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
    await Clerk.signOut(); // Use Clerk.signOut() directly as a fallback
    navigation.replace('SignIn');
  };

  if (!isLoaded) {
    return null;
  }

  if (!userId) {
    navigation.replace('SignIn');
    return null;
  }

  return (
    <View style={styles.container}>
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
    backgroundColor: '#FFF8E1',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    color: '#6A5D5D',
    textAlign: 'center',
  },
  emojiCircle: {
    width: 300,
    height: 300,
    borderRadius: 150,
    position: 'relative',
    marginBottom: 20,
  },
  emojiButton: {
    position: 'absolute',
    alignItems: 'center',
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#FFE0B2',
    width: 70,
    height: 70,
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 30,
  },
  selectedEmoji: {
    backgroundColor: '#FFB74D',
  },
  selectedLabel: {
    fontSize: 18,
    color: '#6A5D5D',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1C4E9',
    borderRadius: 5,
    padding: 10,
    width: '80%',
    marginBottom: 20,
    backgroundColor: '#FFF',
  },
});

export default Home;