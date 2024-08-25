/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  ImageBackground,
  TextComponent,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import {Icon} from 'react-native-elements';
import {strings} from '../locals/i18n';
import {AuthContext} from '../components/context';
import I18n from 'react-native-i18n';
import commonStyle from '../assets/style/styles.js';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import withTailwindHook from '../components/hooks/WithTailwindHook';
import WithTailwindHook from '../components/hooks/WithTailwindHook';
import ScreenTitle from "../components/atoms/ScreenTitle";
import AsyncStorage from '@react-native-community/async-storage';

const {width, height} = Dimensions.get('window');
const aboutCompany = class AboutCompany extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      fulldata: [],
      post_page: 0,
      load_more: false,
      arrays: [],
      lang:''
    };
  }

  async componentDidMount() {
    var lang = await AsyncStorage.getItem("lang");
    this.setState({
      lang: lang
    });
  }

  render() {
    const tailwind = this.props.tailwind;
    return (
      <ScrollView contentContainerStyle={tailwind('flex flex-grow bg-transparent')}>
        <View
          style={{
            margin: '1%',
            justifyContent: 'space-between',
            flex: 1,
            alignItems: 'center',
            justifyContent:this.state.lang === 'en' ? 'flex-start': 'flex-end', 
          }}>
          <View style={styles(this.state.lang).viewStyle}>
            <Text style={styles(this.state.lang).ViewHeader}>
              {strings('main.who_we_are')}
            </Text>
              <Text style={styles(this.state.lang).ViewBody}>
                <Text style={tailwind(
                  'text-darkblue text-xxs font-bold uppercase')}>
                      {strings('dashboard.nejoum')} 
                </Text>  <Text style={tailwind(
                  'text-darkblue text-xxs uppercase')}>
                      {strings('dashboard.aljazeera')} 
                  </Text>  {strings('main.who_we_are_text')}
              </Text>
          </View>
          <View style={styles(this.state.lang).viewStyle}>
            <Text style={styles(this.state.lang).ViewHeader}>
              {strings('main.stepping_stone')}
            </Text>
            <Text style={styles(this.state.lang).ViewBodyWithPadding}>
              {strings('main.stepping_stone_text1')}
            </Text>
            <Text style={styles(this.state.lang).ViewBodyWithPadding}>
              {strings('main.stepping_stone_text2')}
            </Text>
            <Text style={styles(this.state.lang).ViewBodyWithPadding}>
              {strings('main.stepping_stone_text3')}
            </Text>
            <Text style={styles(this.state.lang).ViewBodyWithPadding}>
              {strings('main.stepping_stone_text4')}
            </Text>
            <Text style={styles(this.state.lang).ViewBodyWithPadding}>
              {strings('main.stepping_stone_text5')}
            </Text>
            <Text style={styles(this.state.lang).ViewBodyWithPadding}>
              {strings('main.stepping_stone_text6')}
            </Text>
            <Text style={styles(this.state.lang).ViewBodyWithPadding}>
              {strings('main.stepping_stone_text7')}
            </Text>
            <Text style={styles(this.state.lang).ViewBodyWithPadding}>
              {strings('main.stepping_stone_text8')}
            </Text>
            <Text style={styles(this.state.lang).ViewBodyWithPadding}>
              {strings('main.stepping_stone_text9')}
            </Text>
            <Text style={styles(this.state.lang).ViewBodyWithPadding}>
              {strings('main.stepping_stone_text10')}
            </Text>
          </View>
          <View style={styles(this.state.lang).viewStyle}>
            <Text style={styles(this.state.lang).ViewHeader}>
              {strings('main.comp_serviceand_activities')}
            </Text>
            <Text style={styles(this.state.lang).ViewBody}>
              {strings('main.comp_serviceand_activities_text1')}
            </Text>
            <Text style={{flexDirection:'row'}}></Text>
            <Text style={styles(this.state.lang).ViewBody}>
              {strings('main.comp_serviceand_activities_text2')}
            </Text>
            <Text style={{flexDirection:'row'}}></Text>
            <Text style={styles(this.state.lang).ViewBody}>
              {strings('main.comp_serviceand_activities_text4')}
            </Text>
            <Text style={{flexDirection:'row'}}></Text>
            <Text style={styles(this.state.lang).ViewBody}>
              {strings('main.comp_serviceand_activities_text5')}
            </Text>
            <Text style={{flexDirection:'row'}}></Text>
            <Text style={styles(this.state.lang).ViewBody}>
              {strings('main.comp_serviceand_activities_text6')}
            </Text>
          </View>
          <View style={styles(this.state.lang).viewStyle}>
            <Text style={styles(this.state.lang).ViewHeader}>
              {strings('main.our_vision')}
            </Text>
            <Text style={styles(this.state.lang).ViewBody}>
              {strings('main.our_vision_text')}
            </Text>
          </View>
          <View style={styles(this.state.lang).viewStyle}>
            <Text style={styles(this.state.lang).ViewHeader}>
              {strings('main.our_mission')}
            </Text>
            <Text style={styles(this.state.lang).ViewBody}>
              {strings('main.our_mission_text')}
            </Text>
          </View>
          <View style={styles(this.state.lang).viewStyle}>
            <Text style={styles(this.state.lang).ViewHeader}>
              {strings('main.our_values')}
            </Text>
            <Text style={styles(this.state.lang).ViewBody}>
              {strings('main.our_values_text1')}
            </Text>
            <Text style={styles(this.state.lang).ViewBody}>
              {strings('main.our_values_text2')}
            </Text>
            <Text style={styles(this.state.lang).ViewBody}>
              {strings('main.our_values_text3')}
            </Text>
            <Text style={styles(this.state.lang).ViewBody}>
              {strings('main.our_values_text4')}
            </Text>
          </View>
        </View>
        <View
          style={tailwind(
            'h-12 w-full mt-8 justify-center  align-center items-center bg-gray',
          )}>
          <Text
            style={tailwind(
              'text-center  justify-center  items-center  text-darkblue text-xxs uppercase ',
            )}>
              {strings('dashboard.comName')}
          </Text>
        </View>
      </ScrollView>
    );
  }
};
export default WithTailwindHook(aboutCompany);

const styles = (lang) => StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  viewStyle: {
    width: '100%',
    flex: 1,
    textAlign: lang === 'en' ? 'left' : 'right',
    marginTop: '4%',
  },
  ViewHeader: {
    fontWeight: 'bold',
    flexDirection: 'row',
    textAlign: lang === 'en' ? 'left' : 'right',
    color: '#113083',
    fontSize: 14,
    textTransform: 'capitalize',
    paddingLeft: width * 0.05,
    paddingRight: width * 0.05,
    paddingTop: width * 0.01,
    paddingBottom: width * 0.01,
  },
  ViewBodyWithPadding: {
    paddingLeft: width * 0.05,
    paddingRight: width * 0.05,
    paddingTop: width * 0.01,
    paddingBottom: width * 0.01,
    fontSize: 12,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    color: '#113083',
    textAlign: lang === 'en' ? 'left' : 'right',
    justifyContent: 'flex-start',
  },
  ViewBody: {
    paddingLeft: width * 0.05,
    paddingRight: width * 0.05,
    // paddingTop: width*0.01,
    // paddingBottom: width*0.01,
    fontSize: 12,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    color: '#113083',
    textAlign: lang === 'en' ? 'left' : 'right',
    justifyContent: 'flex-start',
  },
});
