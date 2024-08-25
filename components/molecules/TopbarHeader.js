import {View, Image, Dimensions, TouchableOpacity} from 'react-native';
import {useTailwind} from 'tailwind-rn';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyle from '../../assets/style/styles';
import Feather from 'react-native-vector-icons/Feather';
const {width} = Dimensions.get('window');

const TopbarHeader = ({backHandler}) => {
  const tailwind = useTailwind();
  return (
    <SafeAreaView>
      <View style={commonStyle.header}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity activeOpacity={1} onPress={backHandler}>
              <View
                style={{
                  margin: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View>
                  <Feather name="arrow-left" color="#fff" size={width * 0.06} />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={tailwind(
              'row flex-1 text-center w-full flex  items-center  justify-center  ',
            )}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={{
                width: Math.floor(width * 0.13),
                height: Math.floor(width * 0.13),
                marginLeft: width * 0.3,
                resizeMode: 'contain',
                alignContent: 'flex-start',
                alignSelf: 'flex-start',
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default TopbarHeader;
