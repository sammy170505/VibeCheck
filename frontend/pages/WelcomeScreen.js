import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';

export default function WelcomeScreen({ navigation }) {
    useEffect(() => {
        // Navigate to SignIn screen after 3 seconds
        const timeout = setTimeout(() => {
            navigation.replace('SignIn');
        }, 6000); // 6 seconds delay
        return () => clearTimeout(timeout); 
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Image
                source={require('../assests/images/VibeCheckLogo.png')}
                style={styles.logo}
            />
            <ActivityIndicator size="large" color="#4A2C2A" style={styles.loader} />
            <Text style={styles.trademark}>@ 2024 VibeCheck. All Rights Reserved</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f6ede4', // Background color similar to the rest of the app
    },
    logo: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
        margainBottom: 20,
    },
    welcomeText: {
        fontSize: 65,
        fontWeight: 'bold',
        color: '#4A2C2A',
        positon: 'absolute',
        fontFamily: 'Raleway',
        top: '-1%',
    },
    loader: {
        marginTop: -20,
    },
    trademark: {
        position: 'absolute', // to position it at the bottom
        bottom: 60, // distance from the bottom of the screen
        fontSize: 12,
        color: '#888',
    },
});