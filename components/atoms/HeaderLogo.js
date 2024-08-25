import {Dimensions, Image, View} from 'react-native';
import {useTailwind} from 'tailwind-rn';
const {width} = Dimensions.get('window');
import React from 'react';

const HeaderLogo = () => {
  const tailwind = useTailwind();
  return (
    <View
      style={tailwind(
        'row flex-1 text-center w-full    items-center  justify-center  ',
      )}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={{
          width: Math.floor(width * 0.11),
          height: Math.floor(width * 0.11),
          marginLeft: 12,
          resizeMode: 'contain',
        }}
      />
    </View>
  );
};
export default HeaderLogo;
