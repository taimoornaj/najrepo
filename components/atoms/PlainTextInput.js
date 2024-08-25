import {Platform, TextInput} from 'react-native';
import I18n from 'react-native-i18n';
import {useTailwind} from 'tailwind-rn';
import React from 'react';

const PlainTextInput = ({placeholder, onChange}) => {
  const tailwind = useTailwind();
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#707070"
      style={tailwind(
        `flex-1 text-xs  text-lightblack rounded-xl px-2 py-3 ${
          I18n.locale == 'ar' ? 'text-right ' : 'text-right text-left'
        } ${Platform.OS === 'ios' ? 'mt-0' : ''}    `,
      )}
      autoCapitalize="none"
      onChangeText={onChange}
    />
  );
};
export default PlainTextInput;
