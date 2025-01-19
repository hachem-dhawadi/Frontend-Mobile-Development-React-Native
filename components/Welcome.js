import { StatusBar } from 'expo-status-bar';
import {
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView
} from "react-native";
import FontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import Spacing from "../constants/Spacing";
import { useNavigation } from '@react-navigation/native';
import ButtonSubmit from "../components/ButtonSubmit";
import RegistrationScreen from './RegistrationScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Login from '../screen/auth/Login';
import AddReservation from '../screen/client/reservation/AddReservation';
import RegisterSec from '../screen/auth/RegisterSec';

const SettingsScreen = () => (
    <View style={styles.container}>
      <Text style={styles.text}>Settings Screen</Text>
    </View>
  );


const  Welcome = () => {

    const navigation = useNavigation();
    
const Tab = createBottomTabNavigator();

    return (
        <ScrollView>
        <SafeAreaView>
            <View>
                
                <ImageBackground
                    style={{
                        height: 1000 / 2.5,
                        marginTop:22,
                    }}
                    resizeMode="contain"
                    source={require("../assets/register-page-img.png")}
                />

                <Text
                    style={{
                        fontSize: FontSize.xLarge,
                        color: Colors.primary,
                        //fontFamily: Font["poppins-bold"],
                        textAlign: "center",
                    }}
                >
                    Start With E-Saff
                </Text>

                <Text
                    style={{
                        fontSize: FontSize.small,
                        color: Colors.text,
                        //fontFamily: Font["poppins-regular"],
                        textAlign: "center",
                        marginTop: Spacing * 2,
                        paddingLeft: 20,
                        paddingRight: 20,
                    }}
                >
                    E-Saff app is a web mobile application designed for queue management. It allows users to
                    join queues and wait in line for their turn. The app uses a simple and intuitive interface
                    that enables users to easily find and join queues,
                    view their position in the queue, and receive notifications when it's their turn.
                </Text>
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
                        onPress={() => navigation.navigate("CategoryList")}
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
                            Check Services
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
                    onPress={() => navigation.navigate("Login")}
                    style={{
                        backgroundColor: Colors.primary,
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
                       Start Queue Managment
                    </Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
        </ScrollView>

        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
export default Welcome;