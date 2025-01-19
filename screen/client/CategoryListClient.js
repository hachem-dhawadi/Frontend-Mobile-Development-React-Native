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
import Spacing from "../../constants/Spacing";
import FontSize from "../../constants/FontSize";
import Font from "../../constants/Font";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AwesomeAlert from 'react-native-awesome-alerts';
import Colors from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { Dropdown } from 'react-native-element-dropdown';
import AppTextInput from "../../components/AppTextInput";
import { DrawerLayoutAndroid } from 'react-native';

import { Icon } from 'react-native-elements';


//const { id } = this.props.route.params;
const data = [
  { id: '1', title: 'Medical', image: require('../../assets/medical.png') },
  { id: '2', title: 'post tunisienne', image: require('../../assets/post_tunisienne.png') },
  { id: '3', title: 'sportif', image: require('../../assets/fitness.png') },
  { id: '4', title: 'hairdressing', image: require('../../assets/hairstyle.png') },
  //{ id: '10', title: 'Item 2', image: 'https://picsum.photos/200/200' },
];

const CategoryListClient = () => {

  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [errorlist, setError] = useState([]);
  const [Empty, SetEmpty] = useState([]);
  const [userList, setUserList] = useState([]);
  const [CategoryList, setCategoryList] = useState([]);
  const [refresh, forceUpdate] = useState();



  const [currentuser, setcurrentUser] = useState([]);

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
      axios.get('/api/allcategories').then(res => {
        if (res.data.status === 200) {
          setCategoryList(res.data.categories);
          //console.log(res.data.services);
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
              <TouchableOpacity style={styles.buttond} onPress={() => navigation.navigate("ProfilClient", { id: currentuser.id })}>
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
      colorB = "#FF0000";
    }
    else if (item.active == '1') {
      ServiceStatus = 'Active';
      colorB = '#00CC33';
    }

    return (
      <TouchableOpacity style={styles.item}
        //onPress={() => }
        onPress={() => {
          if (item.active === 0) {
            Alert.alert(
              "Category not available",
              "Sorry, this category is currently not available. Please try again later.",
              [{ text: "OK", onPress: () => console.log("OK Pressed") }]
            );
          } else if (item.active === 1) {
            navigation.navigate("ServiceCategory", { id: item.id })
            console.log(item.id );
          }
        }}  
        
        >

        <Image style={styles.image} source={{ uri: "http://localhost:8000/" + item.image }} />

        <View >
          <Text style={styles.title}>{item.name}</Text>
        </View>

        <TouchableOpacity style={{
          backgroundColor: colorB, borderRadius: 10,
          paddingVertical: 2,
          paddingHorizontal: 4,
          marginLeft: 120,
          marginStart: 55,
          //marginRight: 20,
        }}>
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
            marginTop:42,
            color: Colors.primary,
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          List of categories
        </Text>
        <ImageBackground
          style={{
            height: 400 / 2.5,
            marginBottom: 20,
          }}
          resizeMode="contain"
          source={require('../../assets/Service-women.png')}
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



        <FlatList

          data={CategoryList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />


      </View>
    </DrawerLayoutAndroid>
  );
};

export default CategoryListClient;

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
    marginLeft: 10,
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