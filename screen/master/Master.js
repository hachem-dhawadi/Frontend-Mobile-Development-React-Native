import {
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Button,
    ScrollView,
    Alert,
    FlatList,
    Image,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import React, { useState, useContext, useEffect } from "react";
import Spacing from "../../constants/Spacing";
import FontSize from "../../constants/FontSize";
import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import AppTextInput from "../../components/AppTextInput";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

const data = [
    { id: '1', title: 'Medical', image: require('../../assets/medical.png') },
];



const Master = () => {

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Image style={styles.image} source={item.image} />

            <View style={{ flex: 1 }} >
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.soustitle}>belongs to doctor hachem</Text>
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.status}>Active </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonicon}>
                    <FontAwesome name='trash' size={25} color="#990000" />
                </TouchableOpacity>
            </View>
        </View>
    );



    const navigation = useNavigation();

    // e.preventDefault();
    const logoutSubmit = () => {
        axios.get('/sanctum/csrf-cookie')
            .then(response => {
                axios.post(`/api/logout`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '
                    },
                })
                    .then(res => {
                        if (res.data.status === 200) {
                            AsyncStorage.removeItem('auth_token');
                            AsyncStorage.removeItem('auth_name');
                            Alert.alert("Success", res.data.message, [{ text: "OK" }], {
                                cancelable: false,
                                containerStyle: { borderRadius: 10 },
                            });
                            navigation.navigate("Login");
                        }
                    });
            });
    };


    return (

        <View style={styles.container}>
            <ImageBackground
                style={{
                    height: 470 / 2.5,
                    marginTop: 0,
                    marginBottom: Spacing * 3,
                }}
                resizeMode="contain"
                source={require("../../assets/banner-img.png")}
            />
            <Text
                style={{
                    fontSize: 25,
                    color: Colors.primary,
                    marginBottom: 20,
                    //fontFamily: Font["poppins-bold"],
                    textAlign: "center",
                }}
            >
                List of Services
            </Text>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />

            <TouchableOpacity
                onPress={() => navigation.navigate("AddService")}
                style={{
                    backgroundColor: Colors.primary,
                    paddingVertical: 10,
                    marginLeft:20,
                    //paddingHorizontal: 20,
                    width: "90%",
                    borderRadius: Spacing,
                    shadowColor: Colors.primary,
                    shadowOffset: {
                        width: 0,
                        height: Spacing,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: Spacing,
                    borderColor: Colors.primary,
                    borderWidth: 1
                }}
            >
                <Text
                    style={{
                        //fontFamily: Font["poppins-bold"],
                        color: Colors.onPrimary,
                        fontSize: FontSize.small,
                        textAlign: "center",
                    }}
                >
                    Add new service
                </Text>
            </TouchableOpacity>

        </View>


    );
};

export default Master;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        marginBottom: 22,
    },
    item: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
    },
    title: {
        fontSize: 18,
        flex: 1,
        marginLeft: 10,
        marginTop: 15,
        marginBottom: -20,
    },
    soustitle: {
        fontSize: 13,
        flex: 1,
        marginLeft: 10,
    },
    status: {
        color: "#fff",
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 50,
    },
    buttonsContainer: {
        flexDirection: 'row',
    },
    button: {
        backgroundColor: '#00CC33',
        borderRadius: 10,
        paddingVertical: 2,
        paddingHorizontal: 4,
        marginLeft: 10,
        marginRight: 20,
    },
    buttonicon: {
        marginRight: 10,
    },
});