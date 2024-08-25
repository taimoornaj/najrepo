import React from 'react';
import { View, TextInput, Platform, StyleSheet} from 'react-native';

const StyledInput2 = ({ val, setVal, setErrorVal, placeholder,I18n, borderColor,width, keyboardType  }) => {
  return (
    <View style={styles.container}>
      <TextInput
  placeholder={placeholder}
  keyboardType={keyboardType}
  autoCapitalize="words"
  style={[
    {
      flex: 1,
      height: 45,
      borderWidth: 1,
      textAlign: I18n.locale === 'ar' ? 'right' : 'left',
      direction: I18n.locale === 'ar' ? 'rtl' : 'ltr',
      marginTop: Platform.OS === 'ios' ? 0 : -12,
      color: '#05375a', // This sets the text color
      fontSize: width * 0.035,
      paddingLeft: '5%',
    },
    styles.inputStyle,
    styles.mainShadow,
  ]}
  placeholderTextColor="gray" // This sets the placeholder text color
/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputStyle: {
    paddingLeft: '6%',
    backgroundColor: '#fdfdfd',
    borderWidth: 0,
    borderColor: '#7a7a7a',
    marginBottom:'4.5%',

  },
  mainShadow: {
    borderRadius: 5,
      shadowColor: 'rgba(0,0,0,0.4)',
      shadowOpacity: 0.35,
      shadowRadius: 3,
      elevation: 4,
  },
});

export default StyledInput2;
