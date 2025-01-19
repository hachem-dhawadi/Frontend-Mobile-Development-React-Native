import { StyleSheet, Text, View , Button} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import React from 'react'

const Second = () => {

    const navigation = useNavigation();
  return (
    <View>
      <Text>this is Second</Text>
      <Button onPress={() => navigation.navigate("Welcome")} title="go to welcome" />
    </View>
  )
}

export default Second

const styles = StyleSheet.create({})