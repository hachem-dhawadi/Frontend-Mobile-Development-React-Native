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
    Image,
    Alert
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Spacing from "../../../constants/Spacing";
import FontSize from "../../../constants/FontSize";
import Colors from "../../../constants/Colors";
import Font from "../../../constants/Font";
import AppTextInput from "../../../components/AppTextInput";
import { useNavigation,useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { DrawerLayoutAndroid } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

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


const ProfilClient = () => {



    const navigation = useNavigation();
    const route = useRoute();
    const [picture, setPicture] = useState([]);
    const [fileName, setFileName] = useState('');
    const [errorlist, setError] = useState([]);
    const [currentuser, setcurrentUser] = useState([]);
    const [refresh, forceUpdate] = useState();
    const [loginInput, setLogin] = useState({
        email: '',
        password: '',
        error_list: [],
    });

    const handleInput = (name, value) => {
        setLogin({ ...loginInput, [name]: value });
    };

    const [userUpdate, setUserUpdate] = useState({
        name: '',
        email: '',
        cin: '',
        phone: '',
    });

    const handleInputUpdate = (name, value) => {
        //e.persist();
        setUserUpdate({ ...userUpdate, [name]: value });
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

    useEffect(() => {

        axios.get('/api/getCurrentUser')
            .then(response => {
                setcurrentUser(response.data.user);
                //console.log("current user Id");

            })
            .catch(error => {
                console.log(error);
            });

        axios.get('/sanctum/csrf-cookie').then(response => {
            //const service_id = props.match.params.id
            axios.get(`/api/edit-user/${route.params.id}`).then(res => {
                if (res.data.status === 200) {
                    setUserUpdate(res.data.user);
                }
                else if (res.data.status === 404) {
                    //swal("Error", res.data.message, "error");
                    //navigate('/servicenotfound');
                }
                //setLoading(false);
            });
        });
    }, []);

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
                        Alert.alert("Success", res.data.message, [{ text: "OK" }], {
                            cancelable: false,
                            containerStyle: { borderRadius: 10 },
                        });
                    }
                    else if (res.data.role === 'client') {
                        navigation.navigate("CategoryListClient");
                        Alert.alert("Success", res.data.message, [{ text: "OK" }], {
                            cancelable: false,
                            containerStyle: { borderRadius: 10 },
                        });
                    }
                    else {
                        navigation.navigate("Master");
                        Alert.alert("Success", res.data.message, [{ text: "OK" }], {
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
                    Alert.alert("Warning", res.data.message, [{ text: "OK" }], {
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

    const UpdateInformation = () => {
        //e.preventDefault();

        const formData = new FormData();
        formData.append('name', userUpdate.name);
        formData.append('email', userUpdate.email);
        formData.append('cin', userUpdate.cin);
        formData.append('phone', userUpdate.phone);
        formData.append('status', currentuser.status);
        formData.append('role', currentuser.role);
        if (picture.uri) {
            formData.append('image', {
                uri: picture.uri,
                type: 'image/jpeg', // Or the mime type of the image you are uploading
                name: 'image.jpg', // Or the name you want to give to the image file
            });
        }

        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post(`/api/update-user/${currentuser.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }).then(res => {
                if (res.data.status === 200) {
                    console.log("good");
                    //swal("Succes", res.data.message, "success");
                    setError([]);
                    //navigate('/ViewUser');
                }
                else if (res.data.status === 422) {
                    //swal("All Fields are mendentory", "", "error");
                    setError(res.data.errors);
                }
                else if (res.data.status === 404) {
                    //swal("Error", res.data.message, "error");
                }
            });
        });
    }

    return (


        <ScrollView>
            <SafeAreaView>
                <View>

                    <Text
                        style={{
                            fontSize: FontSize.xLarge,
                            color: Colors.primary,
                            marginTop: 50,
                            //fontFamily: Font["poppins-bold"],
                            textAlign: "center",
                        }}
                    >
                        Update Profil
                    </Text>
                    {/* <ImageBackground
                        style={{
                            marginTop: 20,
                            height: 800 / 2.5,
                            borderRadius: 75,
                        }}
                        resizeMode="contain"
                        source={require("../../../assets/login-page-img.png")}
                    /> */}
                    <View style={styles.headerd}>
                        <Image source={{ uri: "http://localhost:8000/" + currentuser.image }} style={styles.imaged} />
                    </View>


                    <View
                        style={{
                            marginVertical: Spacing * 3,
                            paddingHorizontal: Spacing * 3,
                        }}
                    >

                        <AppTextInput placeholder="Name" value={userUpdate.name} onChangeText={value => handleInputUpdate('name', value)} />
                        <Text style={{ color: 'red',marginLeft:15 }}></Text>

                        <AppTextInput placeholder="Email" value={userUpdate.email} onChangeText={value => handleInputUpdate('email', value)} />
                        <Text style={{ color: 'red',marginLeft:15 }}></Text>

                        <AppTextInput placeholder="Cin" value={userUpdate.cin} onChangeText={value => handleInputUpdate('cin', value)} />
                        <Text style={{ color: 'red',marginLeft:15 }}></Text>

                        <AppTextInput placeholder="Phone number" value={userUpdate.phone} onChangeText={value => handleInputUpdate('phone', value)} />
                        <Text style={{ color: 'red',marginLeft:15 }}></Text>
                        <View style={{ flex: 1, marginTop:5}} >
                            {picture.uri ? (
                                
                                <Image
                                    source={{ uri: picture.uri }}
                                    style={{ width: 100, height: 100, marginRight: 10,marginBottom:7 }}
                                />
                                //source={{ uri: "http://localhost:8000/" + currentuser.image }}
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
                            <Text style={{ color: '#555', fontSize: 16, paddingLeft: 13, paddingVertical:5 }} > Click to pick another image from gallery </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View
                    style={{
                        paddingHorizontal: Spacing * 2,
                        // paddingTop: Spacing * 3,
                        flexDirection: "row",
                    }}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => UpdateInformation()}
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
                                Save & Update
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>



            </SafeAreaView>
        </ScrollView>

    );
};

export default ProfilClient;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imaged: {
        marginLeft:124,
        marginTop: 20,
        width: 170,
        height: 170,
        marginRight: 10,
        borderRadius: 100,
      },
});