import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { NavigationContainer } from '@react-navigation/native';
import Welcome from './components/Welcome';
import RegistrationScreen from './components/RegistrationScreen';
import StackNavigator from './StackNavigator';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {
  return ( 

    <NavigationContainer>
      <StackNavigator />
      <StatusBar style="dark"/>
    </NavigationContainer>
    

  );
}

