import {Platform, View, Text, TextInput, TouchableOpacity} from 'react-native';
import I18n from 'react-native-i18n';
import {useTailwind} from 'tailwind-rn';
import React from 'react';

const StyledButton = ({text, onClick}) => {
  const tailwind = useTailwind();
  return (
   <View
     style={tailwind(
       `bg-lightblue text-white text-center text-white text-lg  rounded w-full  py-1.5 ${
         I18n.locale == 'ar' ? 'ml-2' : 'mr-2'
       } `,
     )}
   >
     <TouchableOpacity

       activeOpacity={1}
       onPress={onClick}>
       <Text style={tailwind('text-white text-center font-bold')}>{text}</Text>
     </TouchableOpacity>
   </View>
  );
};
export default StyledButton;
