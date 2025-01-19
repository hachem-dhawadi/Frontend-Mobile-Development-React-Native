import React, { useState } from 'react';
import axios from 'axios';
import { View, Button,Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const Test = () => {
    const handleImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync();
        if (!result.cancelled) {
          // do something with the selected image
        }
      }

  return (
    <View>
        <Text style={{ color: 'red' }}></Text>
        <Text style={{ color: 'red' }}></Text>
        <Text style={{ color: 'red' }}></Text>
        <Text style={{ color: 'red' }}></Text>
        <Text style={{ color: 'red' }}></Text>
        <Text style={{ color: 'red' }}></Text>
        <Text style={{ color: 'red' }}></Text>
        <Text style={{ color: 'red' }}></Text>
        <Button title="Choose Image" onPress={handleImage} />
    </View>
  )
};

export default Test;
