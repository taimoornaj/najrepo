import React from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Image,
  Text,
  SafeAreaView,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import WithTailwindHook from './hooks/WithTailwindHook';
import utilities from '../tailwind.json';
import {useTailwind, TailwindProvider} from 'tailwind-rn';
import commonStyle from '../assets/style/styles';
import { strings } from '../locals/i18n';
const {width} = Dimensions.get('window'); 

const SplashScreen = ({navigation}) => {
  const {colors} = useTheme();
  let tailwind = useTailwind();
  const currentYear = new Date().getFullYear();
  return (
    <TailwindProvider utilities={utilities}>
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Image
                        source={require('../assets/images/logo-blue.png')}
                        style={{width:100, height:100}}
                        resizeMode="contain"
                    />
                </View>
            </View>
       
            <View style={styles.footer2}>
                <View style={{marginBottom:'2%'}}>
                    <Text style={tailwind('text-darkblue')}> Provided by </Text>
                </View>
                  <View style={{flexDirection:'row'}}>
                      <Text style={{color: '#013188', fontWeight: 'bold', textTransform:'uppercase'}}>NEJOUM </Text>
                      <Text style={{color: '#013188'}}> ALJAZEERA</Text>
                  </View>
                <View style={{flexDirection:'column', marginTop:height*0.05,justifyContent:'center', alignItems:'center'}}>
                  <Image
                      source={require('../assets/images/footer-uri.png')}
                      style={{width:width*0.2, height:25}}
                      resizeMode="contain"
                  />
                  <Text style={tailwind('text-xxxs text-darkblue')}>
                      {strings('main.copy_right')} {currentYear}
                  </Text>
                </View>
            </View>
        </View>
    </TailwindProvider>
  );
};

export default SplashScreen;

const {height} = Dimensions.get('screen');
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    right: 0,
    left: 0,
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent:'center',
    alignItems:'center'
  },
  header: {
    right: 0,
    left: 0,
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer1: {
    right: 0,
    left: 0,
    flex: 1,
    width:width,
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer2: {
    bottom:0,
    right: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width:width
  },
});
