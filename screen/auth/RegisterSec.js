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
    Image,
    RefreshControl,
} from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import React, { useState, useContext, initialState, useEffect, useCallback  } from "react";
import Spacing from "../../constants/Spacing";
import FontSize from "../../constants/FontSize";
import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import AppTextInput from "../../components/AppTextInput";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';





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



const RegisterSec = () => {

   
        const [refreshing, setRefreshing] = useState(false);
      
        const onRefresh = useCallback(() => {
          setRefreshing(true);
          // Add your refreshing logic here
          setTimeout(() => {
            setRefreshing(false);
          }, 2000); // Simulating a delay of 2 seconds
        }, []);


    const data = [
        { label: 'Client', value: 'client' },
        { label: 'Admin', value: 'admin' },
        { label: 'Counter clerk', value: 'counter_clerk' },
    ];

    const navigation = useNavigation();
    const [isFocus, setIsFocus] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null); 
    const [errorlist, setError] = useState([]);
    const [picture, setPicture] = useState([]);
    const [fileName, setFileName] = useState('');
    const [registerInput, setRegister] = useState({
        name: '',
        email: '',
        password: '',
        cin: '',
        phone: '',
        error_list: [],
    });

    const handleInput = (name, value) => {
        setRegister({ ...registerInput, [name]: value });
    }

    const handleImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync();
        if (!result.canceled) {
                const image = {
                    uri: result.assets[0].uri,
                    type: result.assets[0].type,
                    name: result.assets[0].filename,
                }
                setPicture(image);
                setFileName(result.assets[0].filename);
        }
    }

    const registerSubmit = () => {
        const formData = new FormData();
        formData.append('name', registerInput.name);
        formData.append('email', registerInput.email);
        formData.append('password', registerInput.password);
        formData.append('cin', registerInput.cin);
        formData.append('phone', registerInput.phone);
        if (picture.uri) {
            formData.append('image', {
                uri: picture.uri,
                type: 'image/jpeg', // Or the mime type of the image you are uploading
                name: 'image.jpg', // Or the name you want to give to the image file
            });
        }
           if (selectedValue) {
            formData.append('role', selectedValue); 
          }

        console.log(formData);
        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.post(`/api/register`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then(res => {
                    if (res.data.status === 200) {
                        AsyncStorage.setItem('auth_token', res.data.token);
                        AsyncStorage.setItem('auth_name', res.data.username);
                        Alert.alert("Success", res.data.message, [{ text: "OK", onPress: () => navigation.navigate("Login") }], {
                            cancelable: false,
                            containerStyle: { borderRadius: 10 },
                        });
                        //setError([]);
                        setRegister({
                            name: '',
                            email: '',
                            password: '',
                            cin: '',
                            phone: '',
                            error_list: []
                          });
                    } else {
                        //console.log("error");
                        //setError(res.data.errors);
                        setRegister({ ...registerInput, error_list: res.data.validation_errors });
                        //setError(res.data.errors);
                    }
                   
                    //setError(res.data.errors);
                });
        });
    };


    return (
        <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
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
                        Register To E-Saff
                    </Text>


                    <View
                        style={{
                            marginVertical: Spacing * 3,
                            paddingHorizontal: Spacing * 3,
                        }}
                    >

                        <AppTextInput placeholder="UserName"  value={registerInput.name} onChangeText={value => handleInput('name', value)} />
                        <Text style={{ color: 'red',marginLeft:15 }}>{registerInput.error_list.name}</Text>
                        <AppTextInput placeholder="Cin" value={registerInput.cin} onChangeText={value => handleInput('cin', value)} />
                        <Text style={{ color: 'red',marginLeft:15 }}>{registerInput.error_list.cin}</Text>
                        <AppTextInput placeholder="Email" value={registerInput.email} onChangeText={value => handleInput('email', value)} />
                        <Text style={{ color: 'red',marginLeft:15 }}>{registerInput.error_list.email}</Text>
                        <AppTextInput placeholder="Phone number" value={registerInput.phone} onChangeText={value => handleInput('phone', value)} />
                        <Text style={{ color: 'red',marginLeft:15 }}>{registerInput.error_list.phone}</Text>
                        <AppTextInput placeholder="Password" secureTextEntry={true} value={registerInput.password} onChangeText={value => handleInput('password', value)} />
                        <Text style={{ color: 'red',marginLeft:15 }}>{registerInput.error_list.password}</Text>
                       
                        <Dropdown
                                style={[styles.dropdown, isFocus && { borderColor: 'blue',borderWidth:1.5 }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                //inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={data}
                                //search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                //placeholder={!isFocus ? 'Select service' : '...'}
                                placeholder={'Select role'}
                                //searchPlaceholder="Search..."
                                value={selectedValue}//constant
                                onChange={(item) => setSelectedValue(item.value)}//constant
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                    />
                     <Text style={{ color: 'red',marginLeft:15 }}>{registerInput.error_list.role}</Text>
                       
                        <View style={{ flex: 1, marginTop:5}} >
                            {picture.uri ? (
                                <Image
                                    source={{ uri: picture.uri }}
                                    style={{ width: 100, height: 100, marginRight: 10,marginBottom:7 }}
                                />
                            ) : null}
                        </View>
                        <TouchableOpacity
                            //onPress={pickImage}
                            onPress={handleImage}
                            style={{
                               // [isFocus && { borderColor: 'blue',borderWidth:1.5 }];
                                backgroundColor: Colors.onPrimary,
                                paddingVertical: 15,
                                marginLeft: 3,
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
                            <Text style={{ color: '#555', fontSize: 16, paddingLeft: 13, paddingVertical:5 }} > Click to pick an image from Gallery </Text>
                        </TouchableOpacity>
                        <Text style={{ color: 'red',marginLeft:15 }}>{registerInput.error_list.image}</Text>
                    </View>

                </View>
                <View
                    style={{
                        paddingHorizontal: Spacing * 2,
                        paddingTop: 0,
                        flexDirection: "row",
                        marginTop: -20,
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

export default RegisterSec;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonsContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
    },
    buttonsContainerspace: {
        borderColor: 'white',
        flexDirection: 'row',
        marginLeft: 20
    },
    dropdown: {
        backgroundColor: 'white',
        borderColor: 'white',
        height: 66,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 22,
        marginLeft: 3,

    },
    icon: {
        borderColor: 'white',
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        borderColor: 'white',
        fontSize: 16,
    },
    selectedTextStyle: {
        borderColor: 'white',
        fontSize: 16,
    },
    iconStyle: {
        borderColor: 'white',
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        borderColor: 'white',
        height: 40,
        fontSize: 16,
    },
});