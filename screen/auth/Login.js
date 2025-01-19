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
import React, { useState, useContext ,useEffect} from "react";
import Spacing from "../../constants/Spacing";
import FontSize from "../../constants/FontSize";
import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import AppTextInput from "../../components/AppTextInput";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { DrawerLayoutAndroid } from 'react-native';

const DrawerContent = () => {
    return (
      <View style={styles.drawerContent}>
        <Text>Drawer content goes here</Text>
        <Button
            title="Press me"
            onPress={() => Alert.alert('Simple Button pressed')}
          />
      </View>
    );
  };


const Login = () => {

    const navigation = useNavigation();
    const [loginInput, setLogin] = useState({
      email: '',
      password: '',
      error_list: [],
    });
  
    const handleInput = (name, value) => {
      setLogin({ ...loginInput, [name]: value });
    };
  
    const loginSubmit = async () => {
      const data = {
        email: loginInput.email,
        password: loginInput.password,
      };
  
      axios.get('/sanctum/csrf-cookie').then(response => {
        axios.post(`/api/login`, data).then(res => {
          if (res.data.status === 200) {
            AsyncStorage.setItem('auth_token', res.data.token);
            AsyncStorage.setItem('auth_name', res.data.username);
  
            if (res.data.role === 'admin') {
                navigation.navigate("Welcome");
                Alert.alert("Success", res.data.message, [{ text: "OK" }] , {
                    cancelable: false,
                    containerStyle: { borderRadius: 10 }, 
                });
            }
            else if(res.data.role === 'client'){
                navigation.navigate("CategoryListClient");
                Alert.alert("Success", res.data.message, [{ text: "OK" }] , {
                    cancelable: false,
                    containerStyle: { borderRadius: 10 }, 
                });
            } 
            else{
                navigation.navigate("Master");
                Alert.alert("Success", res.data.message, [{ text: "OK" }] , {
                    cancelable: false,
                    containerStyle: { borderRadius: 10 }, 
                });
            }
            /*else if(res.data.role === "admin"){
                  navigate('/register');
                } else if(res.data.role === "clerk"){
                  navigate('/register');
                }*/
                setLogin({
                    email: '',
                    password: '',
                    error_list: []
                  });
          }
          else if (res.data.status === 401) {
            Alert.alert("Warning", res.data.message, [{ text: "OK" }] , {
                cancelable: false,
                containerStyle: { borderRadius: 10 }, 
            });
          }
          else {
            setLogin({ ...loginInput, error_list: res.data.validation_errors });
          }
        });
      });
    };

    return (
     
    
        <ScrollView>
            <SafeAreaView>
                <View>
                    <ImageBackground
                        style={{
                            marginTop:20,
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
                        Log in To E-Saff
                    </Text>


                    <View
                        style={{
                            marginVertical: Spacing * 3,
                            paddingHorizontal: Spacing * 3,
                        }}
                    >

                        <AppTextInput placeholder="Email" value={loginInput.email} onChangeText={value => handleInput('email', value)}/>
                        <Text style={{ color: 'red',marginLeft:15 }}>{loginInput.error_list.email}</Text>
                        <AppTextInput placeholder="Password" secureTextEntry={true} value={loginInput.password} onChangeText={value => handleInput('password', value)}/>
                        <Text style={{ color: 'red',marginLeft:15 }}>{loginInput.error_list.password}</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("ForgetPassword")}
                        >
                            <Text
                                style={{
                                    //fontFamily: Font["poppins-semiBold"],
                                    fontSize: FontSize.small,
                                    color: Colors.gray,
                                    alignSelf: "flex-end",
                                }}
                            >
                                Forget Password
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View
                    style={{
                        paddingHorizontal: Spacing * 2,
                        paddingTop: Spacing * 3,
                        flexDirection: "row",
                    }}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => loginSubmit()}
                            //onPress={() => navigation.navigate("CategoryListClient")}
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
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>



                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                    <View>
                        <Text style={{ width: 50, textAlign: 'center' }}>OR</Text>
                    </View>
                    <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("RegisterSec")}
                        style={{
                            backgroundColor: Colors.onPrimary,
                            paddingVertical: Spacing * 1.5,
                            paddingHorizontal: Spacing * 2,
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
                                color: Colors.primary,
                                fontSize: FontSize.large,
                                textAlign: "center",
                            }}
                        >
                            Register to Create Account
                        </Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </ScrollView>
        
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});