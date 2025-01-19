import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
  } from "react-native";
  import React, { useState } from "react";
  import Colors from "../constants/Colors";
  import FontSize from "../constants/FontSize";
  import Spacing from "../constants/Spacing";
  
  
  const AppTextInput: React.FC<TextInputProps> = ({ ...otherProps }) => {
    const [focused, setFocused] = useState<boolean>(false);
    return (
      <TextInput
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor={Colors.darkText}
        style={[
          {
            borderWidth: 2,
            borderColor: Colors.secondly,
            fontSize: FontSize.small,
            padding: Spacing * 2,
            backgroundColor: Colors.onPrimary,
            borderRadius: 20,
            marginVertical: 0,
          },
          focused && {
            borderWidth: 2,
            borderColor: Colors.primary,
            shadowOffset: { width: 4, height: Spacing },
            shadowColor: Colors.primary,
            shadowOpacity: 0.2,
            shadowRadius: Spacing,
          },
        ]}
        {...otherProps}
      />
    );
  };
  
  export default AppTextInput;
  
  const styles = StyleSheet.create({});