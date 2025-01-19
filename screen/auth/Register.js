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
    Alert
} from "react-native";
import React, { useState, useContext } from "react";
import Spacing from "../../constants/Spacing";
import FontSize from "../../constants/FontSize";
import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import AppTextInput from "../../components/AppTextInput";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';



axios.defaults.baseURL = "http://localhost:8000/"
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.withCredentials = true;
axios.interceptors.request.use(async function (config) {
    try {
        const token = await AsyncStorage.getItem('auth_token');
        config.headers.Authorization = token ? `Bearer ${token}` : '';
        return config;
    } catch (error) {
        console.log('Error retrieving auth token:', error);
        return config;
    }
});

const Register = () => {

    const navigation = useNavigation();
    const [registerInput, setRegister] = useState({
        name: '',
        cin: '',
        email: '',
        phone: '',
        password: '',
        error_list: [],
    });

    const handleInput = (name, value) => {
        setRegister({ ...registerInput, [name]: value });
    }

    const registerSubmit = () => {
        const data = {
            name: registerInput.name,
            cin: registerInput.cin,
            email: registerInput.email,
            phone: registerInput.phone,
            password: registerInput.password,
        }

        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post(`/api/register`, data, {

            }).then(res => {
                if (res.data.status === 200) {
                    AsyncStorage.setItem('auth_token', res.data.token);
                    AsyncStorage.setItem('auth_name', res.data.username);
                    Alert.alert("Success", res.data.message, [{ text: "OK", onPress: () => navigation.navigate("Login") }] , {
                        cancelable: false,
                        containerStyle: { borderRadius: 10 }, 
                    });
                } else {
                    //console.log(res.data.token);
                    console.log("error");
                    setRegister({ ...registerInput, error_list: res.data.validation_errors });
                }
            }).catch(error => console.log(error));
        });

    }
    return (
        <ScrollView>
            <SafeAreaView>
                <View>
                    <ImageBackground
                        style={{
                            height: 800 / 2.5,
                        }}
                        resizeMode="contain"
                        source={require("../../assets/login-page-img.png")}
                    />

                    <Text
                        style={{
                            fontSize: FontSize.xLarge,
                            color: Colors.primary,
                            //fontFamily: Font["poppins-bold"],
                            textAlign: "center",
                        }}
                    >
                        Register To Esaff
                    </Text>


                    <View
                        style={{
                            marginVertical: Spacing * 3,
                            paddingHorizontal: Spacing * 3,
                        }}
                    >

                        <AppTextInput placeholder="UserName" onChangeText={(text) => handleInput('name', text)}
                            value={registerInput.name} />
                            <Text style={{ color: 'red',marginLeft:15 }}>{registerInput.error_list.name}</Text>
                        <AppTextInput placeholder="Cin" onChangeText={(text) => handleInput('cin', text)}
                            value={registerInput.cin} />
                            <Text style={{ color: 'red',marginLeft:15 }}>{registerInput.error_list.cin}</Text>
                        <AppTextInput placeholder="Email" onChangeText={(text) => handleInput('email', text)}
                            value={registerInput.email} />
                            <Text style={{ color: 'red',marginLeft:15 }}>{registerInput.error_list.email}</Text>
                        <AppTextInput placeholder="Phone number" onChangeText={(text) => handleInput('phone', text)}
                            value={registerInput.phone} />
                            <Text style={{ color: 'red',marginLeft:15 }}>{registerInput.error_list.phone}</Text>
                        <AppTextInput placeholder="Password" secureTextEntry={true} onChangeText={(text) => handleInput('password', text)}
                            value={registerInput.password} />
                            <Text style={{ color: 'red',marginLeft:15 }}>{registerInput.error_list.password}</Text>
                    </View>
                </View>
                <View
                    style={{
                        paddingHorizontal: Spacing * 2,
                        paddingTop: 0,
                        flexDirection: "row",
                        marginTop:-20,
                    }}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => registerSubmit()}
                            style={{
                                backgroundColor: Colors.primary,
                                paddingVertical: Spacing * 1.5,
                                paddingHorizontal: Spacing * 2,
                                width: "100%",
                                borderRadius: Spacing,
                                shadowColor: Colors.primary,
                                shadowOffset: {
                                    width: 0,
                                    height: Spacing,
                                },
                                shadowOpacity: 0.3,
                                shadowRadius: Spacing,
                                marginBottom: 25,
                            }}
                        >
                            <Text
                                style={{
                                    //fontFamily: Font["poppins-bold"],
                                    color: Colors.onPrimary,
                                    fontSize: FontSize.large,
                                    textAlign: "center",
                                }}
                            >
                                Create Account
                            </Text>
                        </TouchableOpacity>
                    </View>



                </View>
            </SafeAreaView>
        </ScrollView>
    );
};

export default Register;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});