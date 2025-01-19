import { SafeAreaView, StyleSheet, Text, View , Button , TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React from 'react';



const Home = () => {

  const navigation = useNavigation();
  
  return (
    <View>
      <Text>this is Home</Text>
      <Button onPress={() => navigation.navigate("Welcome")} title="go to second" />
      <TouchableOpacity
                        onPress={() => navigation.navigate("Second")}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                            }}
                        >
                            Start Queue Managment
                        </Text>
                    </TouchableOpacity>
    </View>
  )
}

export default Home