import {Text} from 'react-native';
import I18n from 'react-native-i18n';
import {useTailwind} from 'tailwind-rn';
import React from 'react';

const ScreenTitle = ({title}) => {
  const tailwind = useTailwind();
  return (
    <Text
      style={tailwind(
        `row text-darkblue  ${
          I18n.locale == 'ar' ? 'text-right' : 'text-left'
        }  text-xl text-3xl font-bold pt-4 pl-4`,
      )}>
      {title}
    </Text>
  );
};
export default ScreenTitle;
