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
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AwesomeAlert from 'react-native-awesome-alerts';
import Colors from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { Dropdown } from 'react-native-element-dropdown';
import AppTextInput from "../../components/AppTextInput";

//const { id } = this.props.route.params;
const data = [
  { id: '1', title: 'Medical', image: require('../../assets/medical.png') },
  { id: '2', title: 'post tunisienne', image: require('../../assets/post_tunisienne.png') },
  { id: '3', title: 'sportif', image: require('../../assets/fitness.png') },
  { id: '4', title: 'hairdressing', image: require('../../assets/hairstyle.png') },
  //{ id: '10', title: 'Item 2', image: 'https://picsum.photos/200/200' },
];

const CategoryList = () => {

  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [errorlist, setError] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [userList, setUserList] = useState([]);
  const [CategoryList, setCategoryList] = useState([]);



  useEffect(() => {
    axios.get('/sanctum/csrf-cookie').then(response => {
      axios.get('/api/allcategories').then(res => {
        if (res.data.status === 200) {
          setCategoryList(res.data.categories);
          //console.log(res.data.services);
        }
      });
    });
  }, []);


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
        // onPress={() =>navigation.navigate("ServiceListByCategory", { id: item.id })}
        onPress={() => {
          if (item.active === 0) {
            Alert.alert(
              "Category not available",
              "Sorry, this category is currently not available. Please try again later.",
              [{ text: "OK", onPress: () => console.log("OK Pressed") }]
            );
          } else if (item.active === 1) {
            navigation.navigate("ServiceListByCategory", { id: item.id })
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
    <View style={styles.container}>
      <Text
        style={{
          marginTop:45,
          fontSize: 25,
          color: Colors.primary,
          marginBottom: 20,
          textAlign: 'center',
        }}
      >
        List of categories
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

        data={CategoryList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />


    </View>
  );
};

export default CategoryList;

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
});