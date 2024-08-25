/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TextInput,
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
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { array } from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import StyledTextInput from "../components/molecules/StyledTextInput";
import RNRestart from 'react-native-restart'; 

const {width, height} = Dimensions.get('window'); 
const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default class PriceFiles extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loader      : false,
            fulldata    : [],
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
        this.getData();
    }


    Item = ({ title }) => (
        <View style={styles.item}>
          <Text style={styles.title}>{title}</Text>
        </View>
    );

    activateAdmin = async(code) => {
        var device_id = await AsyncStorage.getItem('device_id');
        if (this.state.code == '') {
          this.setState({
            loader: false,
          });
    
          Alert.alert('Wrong Input!', 'Code field cannot be empty.', [
            {text: 'Okay'}
          ]);
          return;
        }
    
        this.setState({
          loader: true
        });
    
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('customer_id', AuthContext.id);
        formData.append('code', this.state.code);
        formData.append('Device_push_regid', device_id);
        formData.append('client_secret', '1230NEJOUM1230');
        
        var Url  = AuthContext.server_url + "/Nejoum_App/ActivateAdminAccess";
        fetch(Url, {
          method: 'POST',
          credentials: 'same-origin',
          body:formData,
        })
          .then((response) => {
            if(response.ok){
              return response;
            }
            throw Error(response.status);
          })
          .then(res => res.json())
          .then((response) => {
            if(response.success == 'success'){
              if(response.data == true){
                this.setState({
                  loader: false,
                  code: '',
                  error_message: strings('main.signin_success'),
                });
    
                Alert.alert('Success', 'Success', [
                  {text: 'Okay'}
                ]);
                RNRestart.Restart();
              }else {
                this.setState({
                  loader: false,
                  code: '',
                  error_message: strings('main.wrong_code'),
                });
              }
              return;
            }
            else{
             
              this.setState({
                loader: false,
                code: '',
                error_message: strings('main.network_error'),
              });
              return;
            }
          })
          .catch((error) => {
            Alert.alert('Error', 'Error', [
              {text: 'Okay'}
            ]);
            this.setState({
              loader: false,
              code: '',
              error_message: strings('main.network_error')
            });
          });
      }

    textInputChange = (val) => {
        this.setState({
          code: val,
        });
    }

    getData = async() => {
        this.setState({
            loader          : true
        });
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('customer_id', AuthContext.id);
        var Url  = AuthContext.server_url + "/Nejoum_App/getPricessAttach";
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
            if(response.success == 'success'){
                this.setState({
                    loader      : false,
                    fulldata    : response.data
                });
                return;
            }
            else{
                this.setState({
                    loader      : false,
                    error_message    : 'error'   
                });
                Alert.alert('Error', 'Error Occured', [
                    {text: 'Okay'}
                ]);
                return;
            }
        })
        .catch((error) => {
            console.log(error);
            this.setState({
                loader      : false,
                error_message    : error  
            });
            Alert.alert('Error', 'Connection Error', [
                {text: 'Okay'}
            ]);
        });  
    }

    renderItem = ({ item, fileUrl }) => (
        <TouchableOpacity  
        style={{marginBottom:'2%', marginTop:'2%'}}
        onPress={() => {this.props.navigation.navigate('priceFilesViewer', 
        {'url':item.file_url, 'name': item.list_type})}}>
            <View style={{flex:1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', backgroundColor:'#fff', marginBottom:'1%',
            height: height*0.1,shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.15,
            shadowRadius: 1.84,
            elevation: 2,
            padding: '3%', borderWidth:1, borderColor:'#ccc'}} key={item.id}>
                <View style={{ width: '10%', justifyContent:'flex-start', alignItems:'flex-start'}}>
                    <FontAwesomeIcon 
                        icon = {faFolderOpen}
                        color="#005FB7"
                        size={width*0.06}
                    />
                </View>
                <View style={{flex:1}}>
                    <Text tyle={{flexDirection:"row"}}>{item.list_type}</Text> 
                    <View style={{flexDirection:"row", flex:1}}>
                        <Text style={[commonStyle.textBlack, {flex:1}] }>{item.name}</Text>
                        <Text style={[commonStyle.textBlack,{flex:1,textAlign:'right', alignItems:'flex-start'}
                                ] }>{item.date}</Text>
                    </View>
                </View>
            </View>
    </TouchableOpacity>
    )

    render() {
        if(this.state.loader){
            return(
                <Loader loader={this.state.loader}></Loader>
            )
        }
        return (
            <View style={{flex:1, backgroundColor:'#EDEDED'}}>
                {
                    (AuthContext.AdminAccess)?
                    <FlatList
                            showsHorizontalScrollIndicator={false}
                            style= {{paddingHorizontal: 10, height: height*0.8, marginTop:'4%'}}
                            data={this.state.fulldata}
                            initialNumToRender={10000}
                            windowSize={20}
                            maxToRenderPerBatch={10000}
                            getItemLayout={(data, index) => (
                                {length: width, offset: width * index, index}
                            )}
                            removeClippedSubviews={true}
                            keyExtractor={item => item.id}
                            renderItem={this.renderItem}
                    />:
                    <View style={{ justifyContent:'center', alignItems:'center',
                     backgroundColor:'#fff',flex:1}}>
                        <View style={{backgroundColor:'#EDEDED', width:width, justifyContent:'center', alignItems:'center',
                    
                    shadowColor: "#EDEDED",
        justifyContent: 'center',
        shadowOffset: {
            width: 0,
            height: 0.3,
        },
        shadowOpacity: 0.58,
        shadowRadius: 2.00,
        elevation: 18,}}>
                            <View style={styles.action}>
                                <Text style={commonStyle.textBlue}>
                                    {strings('main.adminaccessText')}
                                </Text>
                            </View>
                            <View style={styles.action}>
                                <TextInput
                                    placeholder={strings('main.admin_code')}
                                    placeholderTextColor="#666666"
                                    style={[commonStyle.textInput, {backgroundColor:'#fff',
                                        color: '#666666', borderColor:'#707070', 
                                        borderWidth:1, borderRadius:25, width:'100%', padding:'3%'
                                    }]}
                                    value = {this.state.username}
                                    autoCapitalize="none"
                                    onChangeText={(val) => this.textInputChange(val)}
                                />
                            </View>
                            <TouchableOpacity  style={commonStyle.submitbutton}
                                onPress={() => this.activateAdmin(this.state.code)}>
                                <Text style={commonStyle.buttonText}>
                                    {strings('main.activate')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </View>
        );
  }
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    },
    action: {
        flexDirection: I18n.locale === 'ar' ? 'row-reverse' : 'row',
        padding:'6%'
      },
});