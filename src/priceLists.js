/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React , {Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Icon } from 'react-native-elements';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import  Loader  from '../components/Loader.js';
import  ModalMsg  from '../components/ModalMsg.js';
import I18n from 'react-native-i18n';
import * as Animatable from 'react-native-animatable';
import PhoneInput from "react-native-phone-number-input";
import commonStyle from '../assets/style/styles.js';
import { array } from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';

const {width, height} = Dimensions.get('window'); 
const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default class PriceLists extends Component {

    constructor(props){
        super(props);
        this.state = {
            loader      : false,
            fulldata    : [1],
            post_page   : 0,
            load_more   : false,
            arrays      :[],
            modalmsg    : false,
            msg         : '',
            name        : '',
            email       : '',
            phone       : '',
            pageload    : '',
            check_emailInputChange: true,
          }
          props.navigation.setOptions({  tabBarVisible: false });
    }

    componentDidMount() {
        this.props.navigation.setOptions({ tabBarVisible: false });
    }
//{
  //  (AuthContext.AdminAccess)?

    render(){
        return (
            
                <SafeAreaView style={commonStyle.marginGlobaleless}>
                    <View style={{flexDirection:'column',flex:6, margin:'2%'}}>
                        <View style={{flex:2,flexDirection:"row",justifyContent:'space-between',margin:'2%'}}>
                            <TouchableOpacity
                                style={{borderRadius: 15, margin:'1%', borderWidth:1, borderColor:'#33539E',
                                flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor:'#fff'}}
                                onPress={() => this.props.navigation.navigate('priceFiles')}>
                                <View>
                                    <Text style={{color: '#33539E', fontSize: width*0.05, textAlign:'center'}}>{strings('main.towing_prices')}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{borderRadius: 15, margin:'1%', borderWidth:1, borderColor:'#758EB7',
                                flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor:'#fff'}}
                                onPress={() => this.props.navigation.navigate('priceFiles')}>
                                <View>
                                    <Text style={{color: '#758EB7', fontSize: width*0.05, textAlign:'center'}}>{strings('main.loading_prices')}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={{flex:2,flexDirection:"row",justifyContent:'space-between',margin:'2%'}}>
                            <TouchableOpacity
                                style={{borderRadius: 15, margin:'1%', borderWidth:1, borderColor:'#6F5F90',
                                flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor:'#fff'}}
                                onPress={() => this.props.navigation.navigate('priceFiles')}>
                                <View>
                                    <Text style={{color: '#6F5F90', fontSize: width*0.05, textAlign:'center'}}>{strings('main.shipping_prices')}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{borderRadius: 15, margin:'1%', borderWidth:1, borderColor:'#8A5082',
                                flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor:'#fff'}}
                                onPress={() => this.props.navigation.navigate('priceFiles')}>
                                <View>
                                    <Text style={{color: '#8A5082', fontSize: width*0.05, textAlign:'center'}}>{strings('main.clearance_prices')}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={{flex:2,flexDirection:"row",justifyContent:'space-between',margin:'2%'}}>
                            <TouchableOpacity
                                style={{borderRadius: 15, margin:'1%', borderWidth:1, borderColor:'#FF7B89',
                                flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor:'#fff'}}
                                onPress={() => this.props.navigation.navigate('priceFiles')}>
                                <View>
                                    <Text style={{color: '#FF7B89', fontSize: width*0.05, textAlign:'center'}}>{strings('main.transportation_prices')}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{borderRadius: 15, margin:'1%', borderWidth:1, borderColor:'#A5678E',
                                flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor:'#fff'}}
                                onPress={() => this.props.navigation.navigate('priceFiles')}>
                                <View>
                                    <Text style={{color: '#A5678E', fontSize: width*0.05, textAlign:'center'}}>{strings('main.bike_prices')}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
        )
    }
}

//export default Dashboard



const styles = StyleSheet.create({
    container: {
       flexGrow: 1
    },
    action: {
        flexDirection: I18n.locale=='ar'?'row-reverse':'row',
        marginTop: 10,
        paddingBottom: 5,
    },
    actionButton: {
        alignItems: 'center', 
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    }
});