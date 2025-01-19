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
  Modal,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
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
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import SvgQRCode from 'react-native-qrcode-svg';
import * as Svg from 'react-native-svg';
//import QRCode from 'react-native-qrcode-svg';
//import QRCode from 'qrcode';





//const navigation = useNavigation();
//const route = useRoute();
const ListReservation = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState('');
  const [errorlist, setError] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [userList, setUserList] = useState([]);
  const [ServiceList, setServiceList] = useState([]);
  const [services, setServices] = useState([]);
  const [currentuser, setcurrentUser] = useState([]);
  const [selectedReservationId, setSelectedReservationId] = useState([]);
  const [IdRoom, SetIdRoom] = useState();
  const [IdService, SetIdService] = useState();
  const [cat, SetCat] = useState([]);
  const [refresh, forceUpdate] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [reservations, setReservations] = useState([]);
  




  const [selectedPrinter, setSelectedPrinter] = React.useState();

  /*const print = async () => {
    const qrSvg = <SvgQRCode value="https://example.com/ticket" size={50} />;
    const qrImgData = await Print.printToFileAsync({ uri: qrSvg.toDataURL() });
  
    await Print.printAsync({
      html: generateHtml(qrImgData, qrSvg),
      printerUrl: selectedPrinter?.url,
    });
  };*/

  const print = async () => {
    await Print.printAsync({
      html,
      printerUrl: selectedPrinter?.url,
    });
  };


  // const printToFile = async () => {
  //   // On iOS/android prints the given html. On web prints the HTML from the current page.
  //   const { uri } = await Print.printToFileAsync({ html });
  //   console.log('File has been saved to:', uri);
  //   await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  // };

  // function Simple() {
  //   return <SvgQRCode value="http://example.com" />;
  // }






  //const { id } = useParams();



  useEffect(() => {
    axios.get('/sanctum/csrf-cookie').then(response => {
      axios.get('/api/getCurrentUser')
        .then(response => {
          setcurrentUser(response.data.user);
          console.log("current user");
          //console.log(response.data.user);
        })
        .catch(error => {
          console.log(error);
        });
      axios.get(`/api/reservations`).then((res) => {
        if (res.data.status === 200) {
          console.log(res.data.reservations);
          //console.log(res.data.reservations[0].id);
          setServiceList(res.data.reservations);
          setReservations(res.data.reservations);
        }
      });
    });
  }, [refresh]);

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


  const deleteReservation = (id) => {
    axios.delete(`/api/reservations/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          // Remove the deleted reservation from the serviceList state
          setServiceList(ServiceList.filter((reservation) => reservation.id !== id));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const CheckUsers = (roo, rr) => {
    axios.get(`/api/getReservationsByRoomIdWithDateNewest/${roo}/${rr}`)
      .then((res) => {
        if (res.data.status === 200) {
          forceUpdate(Math.random())
          // Reset successful
          console.log(res.data.reservations);
          SetCat(res.data.reservations);
          setModalVisible(true)
          
        } else {
          // Handle error response
          console.log('res');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ResetReservation = (id) => {
    axios.post(`/api/ResetReservation/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          forceUpdate(Math.random())
          // Reset successful
          console.log(res.data.message);
          // Perform any additional actions if needed
          Alert.alert("Success", res.data.message, [{ text: "OK" }], {
            cancelable: false,
            containerStyle: { borderRadius: 10 },
          });
        } else {
          // Handle error response
          console.log(res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };





  const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        </head>
        <body style="text-align: center;">
          <h1 style="font-size: 20px; font-family: Helvetica, sans-serif; font-weight: bold;">
            E-SAFF APP
          </h1>
          <h3 style="font-size: 14px; font-family: Helvetica, sans-serif;">
            Ticket N° 5
          </h3>
          <hr style="border-top: 1px solid #000; margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between;">
            <div style="text-align: left;">
              <p style="font-size: 12px; font-family: Helvetica, sans-serif;">
                Category: Medical<br>
                Service: Cabinet ali<br>
                Room: Eyes care
              </p>
            </div>
            <div style="text-align: right;">
              <p style="font-size: 12px; font-family: Helvetica, sans-serif;">
                Name: Hachem<br>
                Cin: 11417264<br>
                Phone: 26212515
              </p>
            </div>
          </div>  
        </View>
          <img src="" style="width: 40mm; height: 40mm; margin: 10px auto; display: block;">
          <hr style="border-top: 1px solid #000; margin-top: 10px; margin-bottom: 10px;">
          <p style="font-size: 12px; font-family: Helvetica, sans-serif; font-weight: bold;">
            Notification :  16:38:26
          </p>
          <p style="font-size: 12px; font-family: Helvetica, sans-serif; font-weight: bold;">
            Date Réservation : 2023-04-25 16:38:26
          </p>
          <hr style="border-top: 1px solid #000; margin-top: 10px; margin-bottom: 10px;">
          <p style="font-size: 12px; font-family: Helvetica, sans-serif; font-weight: bold;">
            Date céation: 2023-04-25 16:38:26
          </p>
        </body>
      </html>
    `;



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
              <TouchableOpacity style={styles.buttond} onPress={() => navigation.navigate("CategoryListClient")}>
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
                "Cancel reservation",
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
    var color = "#fff";

    return (
      <TouchableOpacity style={styles.item}  >
        <View>
          <Text style={{
            marginLeft: 115,
            fontSize: 25,
            marginBottom: 5,
          }}>E-SAFF APP</Text>
          <Text style={{
            marginLeft: 122,
            fontSize: 22,
            marginBottom: 10,
          }}>Ticket N° {item.id} </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1, height: 1, backgroundColor: 'black', marginBottom: 15, }} />
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.soustitle, { flex: 1 }]}>Category: {item.room.service.category.name}</Text>
            <Text style={styles.soustitleright}>Name: {item.client.name}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.soustitle, { flex: 1 }]}>Service: {item.room.service.name}</Text>
            <Text style={styles.soustitleright}>Cin: {item.client.cin}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.soustitle, { flex: 1 }]}>Room: {item.room.name}</Text>
            <Text style={styles.soustitleright}>Phone: {item.client.phone}</Text>
          </View>

          <View
            style={{
              marginTop: 20,
              marginBottom: 25,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <View style={{ width: 140, height: 140 }}>
              <SvgQRCode value="http://example.com" size={140} />
            </View>
            {/* The logo doesn't display on Expo Web */}

          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.soustitle, { flex: 1 }]}> </Text>
            <Text style={styles.soustitleright}>Notification: {item.notification}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.soustitle, { flex: 1 }]}> </Text>
            <Text style={styles.soustitleright}>Estimated Time: {item.date}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1, height: 1, backgroundColor: 'black', marginTop: 15, }} />
          </View>

          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={{
                backgroundColor: 'gray',
                padding: 10,
                borderRadius: 10,
                marginTop: 15,
                marginRight: 10,
                flex: 1,
              }}
              onPress={print}
            >

              <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', }}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: 'gray',
                //backgroundColor: '#54626F',
                padding: 10,
                borderRadius: 10,
                marginTop: 15,
                marginRight: 10,
                flex: 1,
              }}
              //onPress={() => setModalVisible(true)}
              onPress={() => CheckUsers(item.room.id, item.id)}
            >

              <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', }}>View turn</Text>
            </TouchableOpacity>

            {/* //deleteReservation(item.id) */}
            <TouchableOpacity
              style={{
                backgroundColor: 'red',
                padding: 10,
                borderRadius: 10,
                marginTop: 15,
                marginLeft: 10,
                flex: 1,
              }}
              //onPress={() => ResetReservation(item.id)}
              onPress={() => Alert.alert(
                "Cancel rervation",
                'Are you sure you want to cancel reservation ' + item.room.service.category.name + ', ' + item.room.service.name + ', ' + item.room.name + ', at ' + item.created_at,
                [
                  { text: "Yes", onPress: () => ResetReservation(item.id) },
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },

                ]
              )}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', }}>Cancel</Text>
            </TouchableOpacity>
          </View>



          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ fontSize: 13, marginLeft: 5, fontWeight: 'bold' }}>Ticket N°</Text>
                      <Text style={{ fontSize: 13, marginLeft: 35, fontWeight: 'bold' }}>Date</Text>
                      <Text style={{ fontSize: 13, marginLeft: 120, fontWeight: 'bold' }}>Status</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ flex: 1, height: 1, backgroundColor: 'black', marginTop: 0 }} />
                    </View>

                    {cat.map((reservation, index) => (

                      <View style={{ flexDirection: 'row' }} key={index}>
                        <Text style={{ fontSize: 13, paddingLeft: 10, marginTop: 5 }}>{reservation.id}</Text>
                        <Text style={{ fontSize: 13, paddingLeft: 55, marginTop: 5 }}>{reservation.date}</Text>
                        {
                          reservation.Newrepetition === null
                            ? <Text style={{ fontSize: 13, marginLeft: 30, marginTop: 5, color: 'green' }}>Done</Text>
                            : reservation.Newrepetition === -1
                              ? <Text style={{ fontSize: 13, marginLeft: 30, marginTop: 5, color: 'gray' }}>In Progress</Text>
                              : <Text style={{ fontSize: 13, marginLeft: 30, marginTop: 5, color: 'red', borderRadius: 10, }}> Waiting</Text>
                        }

                        <TouchableOpacity style={{
                          //backgroundColor: getStatusColor(reservation.status),
                          borderRadius: 10,
                          //paddingVertical: 2,
                          paddingHorizontal: 4,
                          //marginStart: 55,
                          //marginLeft: 40,
                          //marginTop: 10
                        }}>
                          <Text style={{ fontSize: 13, color: "#fff", paddingHorizontal: 2, paddingVertical: 2 }}>{reservation.date}</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ fontSize: 13, paddingLeft: 10, marginTop: 5 }}>You</Text>
                      <Text style={{ fontSize: 13, paddingLeft: 55, marginTop: 5 }}>{item.date}</Text>
                      {
                        item.Newrepetition === null
                          ? <Text style={{ fontSize: 13, marginLeft: 30, marginTop: 5, color: 'green' }}>Done</Text>
                          : item.Newrepetition === -1
                            ? <Text style={{ fontSize: 13, marginLeft: 30, marginTop: 5, color: 'gray' }}>In Progress</Text>
                            : <Text style={{ fontSize: 13, marginLeft: 30, marginTop: 0, color: 'red' }}> Waiting</Text>
                      }
                      <TouchableOpacity style={{
                        borderRadius: 10,
                        paddingVertical: 2,
                        paddingHorizontal: 4,
                      }}>
                        <Text style={{ fontSize: 13, color: "#fff", paddingHorizontal: 2, paddingVertical: 2 }}></Text>
                      </TouchableOpacity>
                    </View>


                    <Text
                      style={{
                        fontSize: 25,
                        marginTop: 100,
                        color: "black",
                        //marginBottom: 20,
                        textAlign: 'center',
                      }}
                    >
                    </Text>

                  </View>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Text style={styles.textStyle}>Close</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>



        </View>
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
            marginTop: 45,
            color: Colors.primary,
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          My list of Booking
        </Text>

        <View style={{ marginRight: 10, marginLeft: 20 }}>
          <AppTextInput
            //style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search reservation by date"
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


        <FlatList

          data={ServiceList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />


      </View>
    </DrawerLayoutAndroid>
  );
};

export default ListReservation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
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
    //flexDirection: 'row',
    //alignItems: 'center',
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
    fontSize: 13,
    //flex: 1,
    marginLeft: 5,
    //marginBottom: 20,
  },
  soustitle1: {
    fontSize: 13,
    fontWeight: 'bold',
    //flex: 1,
    marginLeft: 15,
    //marginBottom: 20,
  },
  soustitle2: {
    fontSize: 13,
    //flex: 1,
    marginRight: 15,
    marginLeft: 15,
    //marginBottom: 20,
  },
  soustitleright: {
    fontSize: 13,
    //flex: 1,
    marginRight: 5,
    //marginBottom: 20,
  },
  status: {
    color: "#fff",
    fontSize: 16,
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  statusGreen: {
    color: "#fff",
  },
  statusRed: {
    color: "#FF0000",
  },
  image: {
    width: 80,
    height: 86,
    borderRadius: 0,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#FF0000',
    //borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 20,
    //marginRight: 20,
  },
  buttonicon: {
    marginStart: 20,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 70,
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


  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    marginHorizontal: 110,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,

  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: 'gray',
    paddingHorizontal: 40,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },



});