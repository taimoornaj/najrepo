import {Platform, View, Text, TextInput} from 'react-native';
import I18n from 'react-native-i18n';
import {useTailwind} from 'tailwind-rn';
import React from 'react';
import PlainTextInput from '../atoms/PlainTextInput';

const StyledTextInput = ({placeholder, onChange}) => {
  const tailwind = useTailwind();
  return (
    <View
      style={tailwind(
        `border rounded-md my-3  w-full  p-4   ${
          I18n.locale == 'ar' ? 'flex-row' : 'flex-row-reversed'
        } `,
      )}>
      <PlainTextInput placeholder={placeholder} onChange={onChange} />
    </View>
  );
};
export default StyledTextInput;
