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
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";




const ForgetPassword = () => {

    const navigation = useNavigation();

    return (
        <ScrollView>
            <SafeAreaView>
                <View>
                    <ImageBackground
                        style={{
                            height: 900 / 2.5,
                        }}
                        resizeMode="contain"
                        source={require("../../assets/forgot-password.png")}
                    />

                    <Text
                        style={{
                            fontSize:25,
                            color: Colors.primary,
                            //fontFamily: Font["poppins-bold"],
                            textAlign: "center",
                        }}
                    >
                        Reset your password 
                    </Text>


                    <View
                        style={{
                            marginVertical: Spacing * 3,
                            paddingHorizontal: Spacing * 3,
                        }}
                    >

                        <AppTextInput placeholder="Password" secureTextEntry={true}/>
                        <Text style={{ color: 'red',marginLeft:15 }}></Text>
                    </View>
                </View>
                <View
                    style={{
                        paddingHorizontal: Spacing * 2,
                        //paddingTop: Spacing * 3,
                        flexDirection: "row",
                    }}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            //onPress={() => loginSubmit()}
                            style={{
                                backgroundColor: Colors.primary,
                                paddingVertical: Spacing * 1.5,
                                paddingHorizontal: Spacing * 2,
                                width: "95%",
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



                <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                </View>

            </SafeAreaView>
        </ScrollView>
    );
};

export default ForgetPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});