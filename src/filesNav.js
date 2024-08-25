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
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { array } from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';

const {width, height} = Dimensions.get('window'); 

export default class FilesNav extends Component {

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
            AdminAccess: 0
          }
          props.navigation.setOptions({  tabBarVisible: false });
    }

    async componentDidMount() {
        this.checkPassword();
        this.props.navigation.setOptions({ tabBarVisible: false });
    }

    checkPassword = async() => {
        var device_id = await AsyncStorage.getItem('device_id');
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('device_push', '1230NEJOUM1230');
        formData.append('customer_id', AuthContext.id);
        formData.append('Device_push_regid', device_id);
        var Url  = AuthContext.server_url + "/Nejoum_App/checkCustomerLoggedin";
        fetch(Url, {
            method: 'POST',
            credentials: 'same-origin',
            body:formData,
        })
        .then((response) => {
            if(response.ok){
              return response;
            }
            throw Error(response.success);
        })
        .then(res => res.json())
        .then((response) => {
            if(response.success == 'success') {
                if(response.data == 1){
                    this.forgetUser();
                }
                if(response.AdminAccess == '1'){
                    AuthContext.AdminAccess  = response.AdminAccess;
                }
                else{
                    AuthContext.AdminAccess  = 0;
                }
                this.setState({
                    AdminAccess    : 1
                });
            }
            else {
                return;
            }
        })
        .catch((error) => {
            this.setState({
                loader      : false,
                error_message    : error
            });
            Alert.alert('Error', 'Connection Error', [
                {text: 'Okay'}
            ]);
        });
    }

    render(){
        return (
                <SafeAreaView style={{ flex:1 }}>
                    <View style={{flexDirection:'column',flex:0.5, margin:'2%'}}>
                        {
                            (AuthContext.AdminAccess)?
                            <View style={{flex:0.5,flexDirection:"row",justifyContent:'space-between',margin:'2%',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                            elevation: 5,}}>
                                <TouchableOpacity
                                  style={{borderRadius: 4, margin:'1%', borderWidth:0.5, borderColor:'#000000',
                                    flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor:'#fff', flexDirection:'row',
                                justifyContent: 'space-around'}}
                                    onPress={() => this.props.navigation.navigate('priceFiles')}>
                                    <View>
                                        <FontAwesomeIcon
                                            icon={ faFile } 
                                            color="#33539E"
                                            size={width*0.08}
                                        />
                                    </View>
                                    <View

                                      style={{width:'70%'}}
                                    >

                                        <Text style={{color: '#113083', fontSize: width*0.06, textAlign:'left'}}>{strings('main.prices_list')}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>:<View style={{flex:1}}><Text></Text></View>
                        }
                        {
                            (AuthContext.PermittedtoBLFiles)?
                            <View style={{flex:0.5,flexDirection:"row",justifyContent:'space-between',margin:'2%',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.8,
                                shadowRadius: 2,
                                elevation: 5}}>
                                <TouchableOpacity
                                    style={{borderRadius: 4, margin:'1%', borderWidth:0.5, borderColor:'#000000',
                                    flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor:'#fff', flexDirection:'row',
                                    justifyContent: 'space-around'}}
                                onPress={() => this.props.navigation.navigate('billFiles')}>
                                <View>
                                    <FontAwesomeIcon
                                        icon={ faFile } 
                                        color="#33539E"
                                        size={width*0.08}
                                    />
                                </View>
                                <View
                                  style = {{width:'70%'}}>
                                    <Text style={{color: '#113083',width:'100%', fontSize: width*0.06, textAlign:'left'}}>
                                        {strings('main.BLfull')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>:<View></View>
                        }
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