import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-community/async-storage"
import { SafeAreaView, Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";

import logo from "../assets/logo.png";
import like from "../assets/like.png";
import dislike from "../assets/dislike.png";

import api from "../services/api";

export default function Main({ navigation }) {

    const id = navigation.getParam('user');

    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('\devs', {
                headers: {
                    user: id
                }
            })

            setUsers(response.data);
        }

        loadUsers();
    }, [id]);

    async function handleLike() {
        const [user, ...rest] = users;

        const response = await api.post(`/devs/${user._id}/likes`, null, {
            headers: {
                userid: id
            }
        });

        setUsers(rest);
    }

    async function handleDislike() {
        const [user, ...rest] = users;

        const response = await api.post(`/devs/${user._id}/dislikes`, null, {
            headers: {
                userid: id
            }
        });

        setUsers(rest);
    }

    async function handleLogout() {
        await AsyncStorage.clear();

        navigation.navigate("Login");
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                onPress={handleLogout}>
                <Image source={logo} style={styles.logo} />
            </TouchableOpacity>
            <View style={styles.cardsContainer}>
                {users.length == 0 ?
                    <Text style={styles.empty}>Acabou</Text> :
                    (users.map((user, index) => (
                        <View key={user._id} style={[styles.card, { zIndex: users.length - index }]}>
                            <Image style={styles.avatar} source={{ uri: user.avatar }} />
                            <View style={styles.footer}>
                                <Text style={styles.name}>{user.name}</Text>
                                <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                            </View>
                        </View>
                    )))}
            </View>
            {users.length > 0 && (
                <View style={styles.bottonContainer}>
                    <TouchableOpacity onPress={handleLike} style={styles.botton}>
                        <Image source={like} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDislike} style={styles.botton}>
                        <Image source={dislike} />
                    </TouchableOpacity>
                </View>
            )}

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        alignItems: "center",
        justifyContent: "space-between"
    },
    logo: {
        marginTop: 30
    },
    cardsContainer: {
        flex: 1,
        alignSelf: "stretch",
        justifyContent: "center",
        maxHeight: 500
    },
    card: {
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    avatar: {
        flex: 1,
        height: 300
    },
    empty: {
        alignSelf: "center",
        color: "#999",
        fontSize: 24,
        fontWeight: "bold"
    },
    footer: {
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333"
    },
    bio: {
        fontSize: 14,
        color: "#999",
        marginTop: 2,
        lineHeight: 18
    },
    bottonContainer: {
        flexDirection: 'row',
        marginBottom: 30
    },
    botton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: {
            width: 0,
            height: 2
        }
    }
});