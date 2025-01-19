import React, { useState, useContext ,useEffect} from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRoute } from '@react-navigation/native';
import Home from './screen/Home';
import Second from './screen/Second';
import Welcome from './components/Welcome';
import Login from './screen/auth/Login';
import Register from './screen/auth/Register';
import CategoryList from './screen/service/CategoryList';
import ForgetPassword from './screen/auth/ForgetPassword';
import Master from './screen/master/Master';
import AddService from './screen/master/AddService';
import Test from './screen/master/Test';
import RegisterSec from './screen/auth/RegisterSec';
import CategoryListClient from './screen/client/CategoryListClient';
import ServiceCategory from './screen/client/ServiceCategory';
import ServiceListByCategory from './screen/service/ServiceListByCategory';
import RoomListByService from './screen/client/RoomListByService';
import AddReservation from './screen/client/reservation/AddReservation';
import { DrawerLayoutAndroid } from 'react-native';
import ListReservation from './screen/client/reservation/ListReservation';
import ProfilClient from './screen/client/reservation/ProfilClient';




const Stack = createNativeStackNavigator();


const StackNavigator = () => {
  

  return (

    <Stack.Navigator screenOptions={{headerShown:false}}>
         <Stack.Group>
         <Stack.Screen name="Welcome" component={Welcome} />
         </Stack.Group>

         <Stack.Group>
         <Stack.Screen name="Login" component={Login}  />
         <Stack.Screen name="Register" component={Register}  />
         <Stack.Screen name="RegisterSec" component={RegisterSec}  />

         <Stack.Screen name="CategoryList" component={CategoryList}  />
         <Stack.Screen name="ServiceListByCategory" component={ServiceListByCategory}  />
         <Stack.Screen name="CategoryListClient" component={CategoryListClient}  />
         <Stack.Screen name="RoomListByService" component={RoomListByService}  />
         <Stack.Screen name="ServiceCategory" component={ServiceCategory}  />
         <Stack.Screen name="AddReservation" component={AddReservation}  />
         <Stack.Screen name="ListReservation" component={ListReservation}  />
         <Stack.Screen name="ForgetPassword" component={ForgetPassword}  />
         <Stack.Screen name="Master" component={Master}  />
         <Stack.Screen name="AddService" component={AddService}  />
         <Stack.Screen name="Test" component={Test}  />
         <Stack.Screen name="ProfilClient" component={ProfilClient}  />
         </Stack.Group>

    </Stack.Navigator>


    
  )
}

export default StackNavigator

const styles = StyleSheet.create({
  drawerContainer: {
    marginTop:20,
    flex: 1,
  },
  drawerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
