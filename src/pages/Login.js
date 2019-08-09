import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-community/async-storage"
import { KeyboardAvoidingView, Platform, StyleSheet, Image, TextInput, TouchableOpacity, Text } from "react-native";
import api from "../services/api";

import logo from "../assets/logo.png";

export default function Login({ navigation }) {

    const [username, setUsername] = useState('');

    useEffect(() => {
        AsyncStorage.getItem("user")
            .then(user => {
                if (user) {
                    navigation.navigate("Main", { user });
                }
            })
    }, []);

    async function handleLogin() {
        const response = await api.post('devs', {
            username
        });

        const { _id } = response.data;

        await AsyncStorage.setItem("user", _id);

        navigation.navigate("Main", { user: _id });
    }

    return (
        <KeyboardAvoidingView
            behavior="padding"
            enabled={Platform.OS == 'ios'}
            style={styles.container}>
            <Image source={logo} />
            <TextInput
                placeholder="Digite seu usuário do Github"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#999"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
            />
            <TouchableOpacity onPress={handleLogin} style={styles.botton}>
                <Text style={styles.bottonText}>Entrar</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
        alignItems: "center",
        padding: 30
    },
    input: {
        height: 46,
        alignSelf: "stretch",
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15
    },
    botton: {
        height: 43,
        alignSelf: "stretch",
        backgroundColor: "#df4723",
        borderRadius: 4,
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    bottonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16
    }
});
