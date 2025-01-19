import React, { useState, useContext, initialState, useEffect, useCallback} from "react";
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
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AwesomeAlert from 'react-native-awesome-alerts';
import Colors from '../../constants/Colors';
import { useNavigation,useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { Dropdown } from 'react-native-element-dropdown';
import AppTextInput from "../../components/AppTextInput";
import { DrawerLayoutAndroid } from 'react-native';
import { Icon } from 'react-native-elements';

const data = [
  { id: '1', title: 'Medical', image: require('../../assets/medical.png') },
  { id: '2', title: 'post tunisienne', image: require('../../assets/post_tunisienne.png') },
  { id: '3', title: 'sportif', image: require('../../assets/fitness.png') },
  { id: '4', title: 'hairdressing', image: require('../../assets/hairstyle.png') },
  //{ id: '10', title: 'Item 2', image: 'https://picsum.photos/200/200' },
];

//const navigation = useNavigation();
//const route = useRoute();
const RoomListByService = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState('');
  const [errorlist, setError] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [userList, setUserList] = useState([]);
  const [RoomList, setRoomList] = useState([]);
  const [services, setServices] = useState([]);
  const [currentuser, setcurrentUser] = useState([]);


  //const { id } = useParams();
  


  useEffect(() => {
    axios.get('/api/getCurrentUser')
    .then(response => {
      setcurrentUser(response.data.user);
      console.log("current user");
      console.log(response.data.user);
    })
    .catch(error => {
      console.log(error);
    });
    axios.get('/sanctum/csrf-cookie').then(response => {
      axios.get(`/api/roomserv/${route.params.id}`).then((res) => {
        console.log("id de la service est ",route.params.id);
        //route.params.category_id
        if (res.data.status === 200) {
          console.log(res.data.rooms);
          setRoomList(res.data.rooms);
        }
      });
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
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return null;
    }
    var ServiceStatus = '';
    var colorB = '';
    if (item.active == '0') {
      ServiceStatus = 'Disabled';
      colorB = "#C0C0C0";
    }
    else if (item.active == '1') {
      ServiceStatus = 'Book now';
      colorB = '#00CC33';
    }

    return (
      <TouchableOpacity style={styles.item}       
     /* onPress={() => 
        Alert.alert(
          "Make yor reservation now !!",
          "To see more aboute this service or to make reservation you must create an account first. Thank you",
          [
            
            { text: "create now", onPress: () => navigation.navigate("RegisterSec")},
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },

          ]
        )
        //console.log('Item clicked:', item)
      }*/>
        
        <Image style={styles.image} source={{ uri: "http://localhost:8000/" + item.image }} />

        <View >
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.soustitle}>Start : {item.start}</Text>
          <Text style={styles.soustitle}>End : {item.end}</Text>
        </View>
        
          <TouchableOpacity style={{
            backgroundColor: colorB, borderRadius: 10,
            paddingVertical: 7,
            paddingHorizontal: 6,
            marginStart: 10,
            //marginRight: 20,
          }}      
          onPress={() => {
            if (item.active === 0) {
              Alert.alert(
                "Queue not available",
                "Sorry, this queue is currently not available. Please try again later.",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }]
              );
            } else if (item.active === 1) {
              navigation.navigate("AddReservation", { id: item.id ,category_id : item.category_id})
              console.log(item.id );
            }
          }}
          >
            
            <Text style={styles.status}>{ServiceStatus}</Text>
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
          color: Colors.primary,
          marginBottom: 20,
          marginTop: 45,
          textAlign: 'center',
        }}
      >
        Queue List 
      </Text>

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


      <FlatList
      
        data={RoomList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />


    </View>
    </DrawerLayoutAndroid>
  );
};

export default RoomListByService;

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
    fontSize: 13,
    //flex: 1,
    marginLeft: 20,
    //marginBottom: 20,
  },
  status: {
    color: "#fff",

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
    backgroundColor: '#00CC33',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 0,
    //marginLeft: 10,
    //marginRight: 20,
  },
  buttonicon: {
    marginStart: 20,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    //backgroundColor: '#F0FFFF',
  },
  headerd: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  imaged: {
    marginTop: 30,
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

});