import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const users = [{id: 1, name: Luis}, {id: 2, name: Sammi}];

export default function Messages() {
    return (
        <View style={styles.container}>
            <View style={style.header}>
                <Text style={styles.title}>Check-Ins</Text>
                {users.map((user) => {
                    <TouchableOpacity
                    key={user.id}
                    style={styles.chatbox}
                    >
                        <Text style={styles.username}>{user.name}</Text>
                    </TouchableOpacity>
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: center,
        paddingHorizontal: 20,
    },
    header: {
        backgroundColor: '#FFF4E1',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    chatbox: {
        width: 200,
        height: 100,
        backgroundColor: '#FF6F31',
        padding: 20,
        borderRadius: 10,
    },
    username: {
        fontSize: 18,
    }
});