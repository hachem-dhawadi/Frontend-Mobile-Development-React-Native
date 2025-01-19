import React, { useState, useContext, initialState, useEffect, useCallback } from "react";
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

} from "react-native";
import Spacing from "../../constants/Spacing";
import FontSize from "../../constants/FontSize";
import Colors from "../../constants/Colors";
import AppTextInput from "../../components/AppTextInput";
import { useNavigation } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { Dropdown } from 'react-native-element-dropdown';
//import * as DocumentPicker from 'expo-document-picker';
import DocumentPicker from 'react-native-document-picker';






const AddService = () => {


    const data = [
        { label: 'Item 1', value: '1' },
        { label: 'Item 2', value: '2' },
        { label: 'Item 3', value: '3' },
        { label: 'Item 4', value: '4' },
        { label: 'Item 5', value: '5' },
    ];
    const [errorlist, setError] = useState([]);
    const [isFocus, setIsFocus] = useState(false);
    const navigation = useNavigation();
    const [image, setImage] = useState(null);
    //const [image, setImage] = useState([]);
    const [picture, setPicture] = useState([]);
    const [pickedImagePath, setPickedImagePath] = useState('');
    const [allcheckbox, setCheckboxes] = useState([]);
    //const [selectedValue, setSelectedValue] = useState(null); contante
    //const [userList, setUserList] = useState([]); constante
    const [userList, setUserList] = useState([]);
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.get('/api/allusers').then(res => {
                if (res.data.status === 200) {
                    setUserList(res.data.users);
                }
            });
        });
    }, []);



    const [serviceInput, setService] = useState({
        user_id: '',
        name: '',
    });

    const handleImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync();
        if (!result.canceled) {
            // Check if the selected asset is an image
            //if (result.assets[0].mediaType === 'photo') {
                const image = {
                    uri: result.assets[0].uri,
                    type: result.assets[0].type,
                    name: result.assets[0].filename,
                //};
                }
                setPicture(image);
                setFileName(result.assets[0].filename);/* else {
                const image = {
                    uri: result.assets[0].uri,
                    type: result.assets[0].type,
                    name: result.assets[0].filename,
                };
                setPicture(image);
                setFileName(result.assets[0].filename);
                //Alert.alert('Succes', 'You can change the image by clicking again', [{ text: 'OK' }]);
            }*/
        }
    }




    const handleCheckbox = (name, value) => {
        console.log('name:', name);
        console.log('value:', value);
        setCheckboxes({ ...allcheckbox, [name]: value });
    };

    const handleInput = (name, value) => {
        //console.log('name:', name);
        //console.log('value:', value);
        setService({ ...serviceInput, [name]: value });
    };




    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("You've refused to allow this appp to access your photos!");
            return;
        }
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.assets[0].uri);
            //setImage(result.assets);
        }

    };

    const selectDoc = async () => {
        try {
            // const doc = await DocumentPicker.pick({
            //   type: [DocumentPicker.types.pdf],
            //   allowMultiSelection: true
            // });
            // const doc = await DocumentPicker.pickSingle()
            const doc = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.images]
            })
            console.log(doc)
        } catch (err) {
            if (DocumentPicker.isCancel(err))
                console.log("User cancelled the upload", err);
            else
                console.log(err)
        }
    }

    const submitService = () => {
        const formData = new FormData();
        formData.append('user_id', serviceInput.user_id);
        formData.append('name', serviceInput.name);
        formData.append('active', allcheckbox.active ? '1' : '0');

        if (picture.uri) {
            formData.append('image', {
                uri: picture.uri,
                type: 'image/jpeg', // Or the mime type of the image you are uploading
                name: 'image.jpg', // Or the name you want to give to the image file
            });
        }

        /*if (file) {
            formData.append('file', {
                uri: file.uri,
                type: file.type,
                name: file.name,
            });
        }*/
        /*if (selectedValue) {
            formData.append('user_id', selectedValue); constant
          }*/

        /*if (selectedValue) { // Use selectedValue instead of value
            formData.append('user_id', selectedValue);
        }*/

        console.log(formData);

        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios
                .post(`/api/store-service`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((res) => {
                    if (res.data.status === 200) {
                        setCheckboxes(res.data.service);
                        Alert.alert(
                            'Success',
                            res.data.message,
                            [{ text: 'OK' }],
                            {
                                cancelable: false,
                                containerStyle: { borderRadius: 10 },
                            }
                        );
                        //setError([]);
                    } else if (res.data.status === 422) {
                        Alert.alert(
                            'Warning',
                            'All Fields are mandatory',
                            [{ text: 'OK' }],
                            {
                                cancelable: false,
                                containerStyle: { borderRadius: 10 },
                            }
                        );
                        setError(res.data.errors);
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
                            height: 470 / 2.5,
                            marginTop: 60,
                            marginBottom: Spacing * 3,
                        }}
                        resizeMode="contain"
                        source={require("../../assets/banner-img.png")}
                    />

                    <Text
                        style={{
                            fontSize: 25,
                            color: Colors.primary,
                            marginBottom: -5,
                            //fontFamily: Font["poppins-bold"],
                            textAlign: "center",
                        }}
                    >
                        Add new service
                    </Text>
                    <View
                        style={{
                            marginVertical: Spacing * 3,
                            paddingHorizontal: Spacing * 3,
                        }}
                    >
                        <View style={{ flex: 1 }} >
                            <Text style={{ marginLeft: 15, marginBottom: 10 }}>Select User to this service</Text>
                            {/*<Dropdown
                                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
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
                                placeholder={'Select user'}
                                //searchPlaceholder="Search..."
                                value={selectedValue}//constant
                                onChange={(item) => setSelectedValue(item.value)}//constant
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}

                    />*/}

                            <Dropdown
                                name="user_id"
                                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                iconStyle={styles.iconStyle}
                                data={userList}
                                maxHeight={300}
                                labelField="name"
                                valueField="id"
                                placeholder={'Select user'}
                                //value={serviceInput.userList} // Use selectedValue instead of value
                                //onChange={(value) => handleInput('user_id', value)}
                                value={serviceInput.user_id}//constant
                                onChange={value => handleInput('user_id', value.id)}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}

                            /*onChange={item => {
                                setSelectedValue(item.value); // Use setSelectedValue instead of setValue
                                setIsFocus(false);
                            }}*/
                            />
                        <Text style={{ color: 'red',marginLeft:15 }}>{errorlist.user_id}</Text>
                        </View>
                        <View style={{ flex: 1 }} >
                            <Text style={{ marginLeft: 15, marginBottom: 10, marginTop: 10 }}>Service name</Text>
                            <AppTextInput placeholder="Service medical,Sportif......" value={serviceInput.name} onChangeText={value => handleInput('name', value)} />
                            <Text style={{ color: 'red',marginLeft:15 }}>{errorlist.name}</Text>
                        </View>
                        <View style={{ flex: 1 }} >
                            <Text style={{ marginLeft: 15, marginBottom: 10, marginTop: 10 }}>Service adresse</Text>
                            <AppTextInput placeholder="Avenue de Paris Tunis Tunisai......" />
                            
                        </View>
                        <View style={{ flex: 1 }} >
                            <Text style={{ marginLeft: 15, marginBottom: 10, marginTop: 10 }}>Service description</Text>
                            <AppTextInput placeholder="Details" multiline={true} numberOfLines={4} />
                        </View>
                        <View style={{ flex: 1 }} >
                            <Text style={{ marginLeft: 15, marginBottom: 10, marginTop: 10 }}>Service Image</Text>
                            {picture.uri ? (
                                <Image
                                    source={{ uri: picture.uri }}
                                    style={{ width: 100, height: 100, marginRight: 10 }}
                                />
                            ) : null}
                        </View>
                        <TouchableOpacity
                            //onPress={pickImage}
                            onPress={handleImage}
                            style={{
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
                            <Text style={{ color: '#555', fontSize: 16, paddingLeft: 13,  }} > Click to pick an image from Gallery </Text>
                        </TouchableOpacity>
                        <Text style={{ color: 'red',marginLeft:15 }}>{errorlist.image}</Text>
                        <View style={{ flex: 1 }} >
                            <Text style={{ marginLeft: 15, marginBottom: 10, marginTop: 10 }}>Service Status</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }} >


                            <Text style={{ marginLeft: 15, marginBottom: 10 }}>Activate Service</Text>
                        </View>
                        <Checkbox
                            style={{ marginLeft: 15 }}
                            value={allcheckbox?.active}

                            //value={allcheckbox.active ? '#4630EB' : undefined}
                            onValueChange={() => handleCheckbox('active', !allcheckbox?.active)}
                            color={allcheckbox?.active ? '#4630EB' : undefined}
                        //color={allcheckbox ? '#4630EB' : undefined}
                        />
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        </View>

                    </View>
                </View>
                <View
                    style={{
                        paddingHorizontal: Spacing * 2,
                        marginTop: -20,
                        marginBottom: Spacing * 3,
                        flexDirection: "row",
                    }}
                >


                    {/*<Button title="Select 📑" onPress={handleDocumentSelection} />*/}
                    <Button title="Select Document" onPress={selectDoc} />


                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            //onPress={() => submitService()}
                            onPress={() => navigation.navigate("ServiceCategory")}
                            style={{
                                backgroundColor: Colors.primary,
                                paddingVertical: 15,
                                //paddingHorizontal: Spacing * 2,
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
                                Submit
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};

export default AddService;

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
        height: 50,
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