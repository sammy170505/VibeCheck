import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Modal } from 'react-native';
import { useAuth/*, Clerk */} from '@clerk/clerk-expo'; // Updated Clerk import
import { get } from 'stack-trace';
const trace = get();

expect(trace[0].getFileName()).toBe(Home);

const Home = ({ navigation }) => {
  const { isLoaded, userId, signOut } = useAuth();
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

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
    setModalVisible(true); // Show the modal
  };

  const handleSignOut = async () => {
    await signOut(); // Use Clerk.signOut() directly as a fallback
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100} // Adjust if needed
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>How are you feeling today?</Text>

        <View style={styles.emojiCircle}>
          {emojis.map((emoji) => (
            <TouchableOpacity
              key={emoji.label}
              style={[
                styles.emojiButton,
                selectedEmoji === emoji.symbol && styles.selectedEmoji,
                emoji.position,
              ]}
              onPress={() => handleEmojiPress(emoji)}
            >
              <Text style={styles.emoji}>{emoji.symbol}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedLabel ? <Text style={styles.selectedLabel}>{selectedLabel}</Text> : null}

        {/* Conditionally render the TextInput and Vibe Out button only if an emoji is selected */}
        {selectedEmoji && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Optional: Why do you feel this way?"
              value={message}
              onChangeText={setMessage}
            />

            <TouchableOpacity style={styles.vibeOutButton} onPress={handleSubmit}>
              <Text style={styles.vibeOutButtonText}>Vibe Out</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Custom modal for Vibe Check */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Vibe Check</Text>
              <Text style={styles.modalEmoji}>{selectedEmoji}</Text>
              {message ? <Text style={styles.modalMessage}>Message: {message}</Text> : null}
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseButton}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    width: 350, // Increased the size of the circle
    height: 350,
    borderRadius: 175,
    position: 'relative',
    marginBottom: 20,
  },
  emojiButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15, // Increased padding for a larger button
    borderRadius: 70, // Larger radius for the button
    backgroundColor: '#FFE0B2',
    width: 90, // Larger button size
    height: 90,
    shadowColor: '#000', // Added shadow for depth
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  emoji: {
    fontSize: 40, // Larger emoji size
  },
  selectedEmoji: {
    backgroundColor: '#FFB74D', // Highlight selected emoji
    borderWidth: 2, // Add border to selected emoji
    borderColor: '#FF9800',
  },
  selectedLabel: {
    fontSize: 20,
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
  // Custom vibe out button
  vibeOutButton: {
    backgroundColor: '#FF6F31', // Bright orange color for standout effect
    paddingVertical: 15,
    paddingHorizontal: 50, // Larger button width
    borderRadius: 30, // Rounded corners for button
    marginVertical: 20, // Increased margin for more space around the button
    shadowColor: '#000', // Add shadow for depth
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5, // More shadow opacity for prominence
    shadowRadius: 10,
    elevation: 12, // Increased elevation for more 3D effect
  },
  vibeOutButtonText: {
    color: '#FFFFFF', // White text for contrast
    fontSize: 20, // Increased font size
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Sign out button (less standout compared to Vibe Out)
  signOutButton: {
    backgroundColor: '#B0BEC5', // Subtle gray color for the sign-out button
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginVertical: 10,
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darken the background
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FF6F31', // Changed modal background to the requested color
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text for contrast
    marginBottom: 20,
  },
  modalEmoji: {
    fontSize: 50, // Larger emoji size for modal
    color: '#FFFFFF', // White text for emoji
  },
  modalMessage: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFFFFF', // White text for contrast
  },
  modalCloseButton: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
  },
});

export default Home;