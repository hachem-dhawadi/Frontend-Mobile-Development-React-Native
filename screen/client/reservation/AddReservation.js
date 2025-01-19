import React, { useState, useContext, initialState, useEffect, useCallback } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Alert,
    TextInput,
    Button,
} from 'react-native';

import Font from "../../../constants/Font";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AwesomeAlert from 'react-native-awesome-alerts';
import Spacing from "../../../constants/Spacing";
import FontSize from "../../../constants/FontSize";
import Colors from "../../../constants/Colors";
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { Dropdown } from 'react-native-element-dropdown';
import AppTextInput from "../../../components/AppTextInput";
import { DrawerLayoutAndroid } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Icon } from 'react-native-elements';


//const { id } = this.props.route.params;
const data = [
    /* { id: '1', title: 'Medical', image: require('../../assets/medical.png') },
     { id: '2', title: 'post tunisienne', image: require('../../assets/post_tunisienne.png') },
     { id: '3', title: 'sportif', image: require('../../assets/fitness.png') },
     { id: '4', title: 'hairdressing', image: require('../../assets/hairstyle.png') },*/
    //{ id: '10', title: 'Item 2', image: 'https://picsum.photos/200/200' },
];

const AddReservation = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [errorlist, setError] = useState([]);
    const [isFocus, setIsFocus] = useState(false);
    const [reservationId, setreservationId] = useState([]);
    const [categoryId, setCategoryId] = useState([]);
    const [serviceId, setserviceId] = useState([]);
    const [roomId, setroomId] = useState([]);
    const [workerId, setworkerId] = useState([]);
    const [dateId, setdateId] = useState([]);
    const [CategoryList, setCategoryList] = useState([]);
    const [timeN, setTimeN] = useState(new Date());
    const [showN, setShowN] = useState(false);
    const [Nbclient, SetNbClient] = useState();

    const handleNConfirm = (selectedTime) => {
        const newTimeN = new Date(selectedTime);
        newTimeN.setSeconds(0); // set seconds to 0
        setTimeN(newTimeN);
        console.log("newtimeN");
        console.log(newTimeN);
        hideNPicker();
        //console.log("timeN after");
        //console.log(timeN.toLocaleTimeString());
        //handleInput('notification', newTimeN); // pass the selected time to handleInput function
        console.log("timeN");
        console.log(timeN);
    };



    const showNPicker = () => {

        setShowN(true);
    }
    const hideNPicker = () => {
        setShowN(false);
    }





    const [currentuser, setcurrentUser] = useState([]);

    useEffect(() => {
        axios.get('/api/getCurrentUser')
            .then(response => {
                setcurrentUser(response.data.user);
                //console.log("current user");
                //console.log(response.data.user.id);
            })
            .catch(error => {
                console.log(error);
            });
        axios.get(`/api/getReservationsByRoomId/${route.params.id}`).then((res) => {
            if (res.data.status === 200) {
                setCategoryList(res.data.reservations);
            }
        });
        axios.get(`/api/countReservationsByRoomId/${route.params.id}`).then((res) => {
            if (res.data.status === 200) {
                console.log(res.data.count);
                SetNbClient(res.data.count);
            }
        });

    }, []);

    const logoutSubmit = async () => {
        try {
          const token = await AsyncStorage.getItem('auth_token');
    
          await axios.get('/sanctum/csrf-cookie');
    
          const response = await axios.post('/api/logout', null, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          if (response.data.status === 200) {
            await AsyncStorage.removeItem('auth_token');
            await AsyncStorage.removeItem('auth_name');
            navigation.navigate("Login")
            console.log('logged out');
            Alert.alert(
              "Logged Out",
              "You are Logged Out Successfully",
              [
                {
                  text: "ok",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
    
              ]
            )
          }
        } catch (error) {
          console.error(error);
        }
      };

    const submitService = (ii,cc,ss,rr,ww,dd) => {
        //e.preventDefault();
        const not = timeN.toLocaleTimeString();

        const formData = new FormData();
        formData.append('category_id', cc);
        formData.append('service_id', ss);
        formData.append('room_id', rr);
        formData.append('worker_id', ww);
        formData.append('user_id', currentuser.id);
        formData.append('date', dd);
        console.log("not");
        console.log(not);
        //formData.append('notification', timeN.toLocaleTimeString());
        formData.append('notification', not);




        axios.post(`/api/update-reservation/${ii}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).then(res => {
            //console.log(timeN);
            if (res.data.status === 200) {
                console.log("ok");
                navigation.navigate("CategoryListClient")
                Alert.alert(
                    "Succes",
                    "Thank you for picking a reservation stay tuned to get a notification",
                    [
                        {
                            text: "ok",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },

                    ]
                )
            }
            /*else if (res.data.status === 400) {
                console.log("problme");
                //swal("Warning", res.data.errors, "warning");
                //setError(res.data.errors);
                //navigate(`/AddReservation/${categoryId}/${serviceId}/${roomId}`);
            }
            else if (res.data.status === 422) {
                console.log("obligation");
                //swal("Date Field is mendentory", "", "error");
                //setError(res.data.errors);
                //navigate(`/AddReservation/${categoryId}/${serviceId}/${roomId}`);
            }*/

        });
    }







    const DrawerContent = () => {
        return (
            <ScrollView>
                <View style={styles.drawerContent}>
                    <View style={styles.headerd}>
                        <Image source={{ uri: "http://localhost:8000/" + currentuser.image }} style={styles.imaged} />
                    </View>
                    <View style={styles.buttonSection}>
                        <Text style={styles.titled}>{currentuser.name}</Text>
                        <View style={styles.buttonContainer}>
                            <Icon name="book-online" size={24} color="blue" style={styles.icon} />
                            <TouchableOpacity style={styles.buttond}>
                                <Text>Booking </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.line} />
                        <View style={styles.buttonContainer}>
                            <Icon name="list" size={24} color="blue" style={styles.icon} />
                            <TouchableOpacity style={styles.buttond} onPress={() => navigation.navigate("ListReservation")}>
                                <Text>List of booking</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.line} />
                        <View style={styles.buttonContainer}>
                            <Icon name="notifications" size={24} color="blue" style={styles.icon} />
                            <TouchableOpacity style={styles.buttond}>
                                <Text>Notifications</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.line} />
                        <View style={styles.buttonContainer}>
                            <Icon name="account-box" size={24} color="blue" style={styles.icon} />
                            <TouchableOpacity style={styles.buttond}>
                                <Text>Profil</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.line} />
                        <View style={styles.buttonContainer}>
                            <Icon name="settings" size={24} color="blue" style={styles.icon} />
                            <TouchableOpacity style={styles.buttond}>
                                <Text>Settings</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.line} />
                        <View style={styles.buttonContainer}>
                            <Icon name="help" size={24} color="blue" style={styles.icon} />
                            <TouchableOpacity style={styles.buttond}>
                                <Text>Help</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.line} />
                        <View style={styles.buttonContainer}>
                            <Icon name="logout" size={24} color="blue" style={styles.icon} />
                            <TouchableOpacity style={styles.buttond} onPress={() => Alert.alert(
                                "Reservation disabled",
                                "You cant use this service, please create a account first.Thank you",
                                [
                                    { text: "Yes", onPress: () => logoutSubmit() },
                                    {
                                        text: "Cancel",
                                        onPress: () => console.log("Cancel Pressed"),
                                        style: "cancel"
                                    },

                                ]
                            )}>
                                <Text>Logout</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Icon name="" size={24} color="blue" style={styles.icon} />
                            <TouchableOpacity style={styles.buttond}>
                                <Text></Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Icon name="" size={24} color="blue" style={styles.icon} />
                            <TouchableOpacity style={styles.buttond}>
                                <Text></Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </ScrollView>
        );
    };

    const renderItem = ({ item }) => {
        if (searchQuery && !item.date.toLowerCase().includes(searchQuery.toLowerCase())) {
            return null;
        }
        // setreservationId(item.id)
        // setCategoryId(item.category_id)
        // setserviceId(item.service_id)
        // setroomId(item.room_id)
        // setworkerId(item.worker_id)
        // setdateId(item.date)


        return (
            <TouchableOpacity style={styles.item}
            //onPress={() => navigation.navigate("ServiceCategory", { id: item.id })}
            >
                <DateTimePickerModal
                    isVisible={showN}
                    mode="time"
                    minuteInterval={1} // set minute interval to 1
                    onConfirm={handleNConfirm}
                    onCancel={hideNPicker}
                />


                <View >
                    <Text style={styles.soustitle}>Date : {item.date}</Text>

                    <TouchableOpacity style={styles.buttonicon} onPress={showNPicker}>
                        <FontAwesome name='history' size={20} color="#1E90FF" />
                        <Text style={styles.buttonText}>Notification {timeN.toLocaleTimeString()}</Text>
                    </TouchableOpacity>

                </View>

                <TouchableOpacity style={{
                    backgroundColor: '#00CC33', borderRadius: 10,
                    //paddingVertical: 7,
                    //paddingHorizontal: 6,
                    //marginStart: 40,
                    //marginRight: 20,
                }}
                    onPress={() => {
                        // setreservationId(item.id)
                        // setCategoryId(item.category_id)
                        // setserviceId(item.service_id)
                        // setroomId(item.room_id)
                        // setworkerId(item.worker_id)
                        // setdateId(item.date)
                        Alert.alert(
                            "Confirmation",
                            "Are you sure, you wanna pick this reservation.",
                            [{
                                text: "OK", onPress: () => submitService(item.id,item.category_id,item.service_id,item.room_id,item.worker_id,item.date)

                            },
                            {
                                text: "Cancel",
                                onPress: () => console.log(timeN),
                                style: "cancel"
                            },]
                        );

                    }}
                >

                    <Text style={styles.status}>Pick Ticket</Text>
                </TouchableOpacity>


            </TouchableOpacity>
        );
    };

    return (
        <DrawerLayoutAndroid
            drawerWidth={200}
            drawerPosition="left"
            renderNavigationView={() => <DrawerContent />}
            style={styles.drawerContent}
        >

            <View style={styles.container}>
                <Text
                    style={{
                        fontSize: 25,
                        marginTop: 42,
                        color: Colors.primary,
                        marginBottom: 20,
                        textAlign: 'center',
                    }}
                >
                    List of booking
                </Text>
                <ImageBackground
                    style={{
                        height: 400 / 2.5,
                        marginBottom: 20,
                    }}
                    resizeMode="contain"
                    source={require('../../../assets/booking.png')}
                />
                <View style={{ marginRight: 10, marginLeft: 20 }}>
                    <AppTextInput
                        //style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search by service name"
                    />
                    {/*<TouchableOpacity >
          <Text >Search</Text>
        </TouchableOpacity>*/}
                </View>


                {/*<Dropdown
        name="user_id"
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        data={ServiceList}
        maxHeight={300}
        labelField="category"
        valueField="id"
        placeholder={'Select category'}
        //value={serviceInput.userList} // Use selectedValue instead of value
        //onChange={(value) => handleInput('user_id', value)}
        //value={serviceInput.user_id}//constant
        //onChange={value => handleInput('user_id', value.id)}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      />*/}

                <Text style={{
                    fontSize: 15,
                    //color: Colors.primary,
                    //marginBottom: 20,
                    marginTop: 5,
                    textAlign: 'center',
                }}>Total user that picked a reservation : {Nbclient}</Text>

                <FlatList

                    data={CategoryList}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />


            </View>
        </DrawerLayoutAndroid>
    );
};

export default AddReservation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
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
    item: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 18,
        //flex: 1,
        marginLeft: 20,
        marginTop: 0,
        //marginBottom: -20,
    },
    soustitle: {
        fontSize: 15,
        //flex: 1,
        marginLeft: 20,
        //marginBottom: 20,
    },
    status: {
        color: "#fff",
        marginVertical: 5,
        marginHorizontal: 9,
        fontSize: 15,
        fontWeight: 'bold',

    },
    drawerContent: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
        //backgroundColor: '#F0FFFF',
    },
    headerd: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    imaged: {
        width: 150,
        height: 150,
        marginRight: 10,
        borderRadius: 75,
    },
    titled: {
        marginLeft: 20,
        marginBottom: 20,
        fontSize: 17,
        fontWeight: 'bold',
        color: '#2243B6'
    },
    buttonSection: {
        flex: 1,
    },
    buttond: {
        paddingVertical: 10,
    },
    line: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
    },

    buttonicon: {
        marginTop: 5,
        marginLeft: 20,
        marginRight: 65,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#1E90FF',
    },
    buttonText: {
        marginLeft: 5,
        color: '#1E90FF',
        fontSize: 15,
        fontWeight: 'bold',
    },
    notification: {
        fontSize: 15,
        //flex: 1,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        //marginBottom: 20,
    },

});