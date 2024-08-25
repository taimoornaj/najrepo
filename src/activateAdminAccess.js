/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React , {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  ImageBackground,
  BackHandler,
  TextComponent,
  Dimensions
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import  Loader  from '../components/Loader.js';
import AsyncStorage from '@react-native-community/async-storage';
import I18n from 'react-native-i18n';
import RNRestart from 'react-native-restart'; 
import withTailwindHook from "../components/hooks/WithTailwindHook";
import StyledTextInput from "../components/molecules/StyledTextInput";

const {width, height} = Dimensions.get('window'); 

let ActivateAdminAccess = class activateAdminAccess extends Component {

    constructor(props){
      super(props);
      this.state = {
        loader      : false,
        notification    : [],
        post_page   : 0,
        load_more   : false,
        arrays      :[],
        isValidpass: true,
        check_textInputChange: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
        code: '',
        confirmed: '',
        oldpass:'',
        secureTextoldPassEntry: true
      }
    }
  
    componentDidMount() {
    }
  
    textInputChange = (val) => {
      this.setState({
        code: val,
      });
    }
  
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
      //var Url  = AuthContext.server_url + "/Nejoum_App/ActivateAdminAccess";
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
  
  
    render(){
      if(this.state.loader){
        return(
          <Loader loader={this.state.loader}></Loader>
        );
      }
  
      return (
        <ScrollView
          keyboardShouldPersistTaps='handled'
          contentContainerStyle = {styles.container}>
          <Animatable.View
            animation="fadeInUpBig"
            style={[styles.footer, {
              backgroundColor: 'transparent', justifyContent:'center'}]}>
  
            {
              (AuthContext.AdminAccess)?
                <TouchableOpacity activeOpacity={1}>
                  <Text style={{lineHeight: 25,fontSize:I18n.locale=='ar'?20:18, padding: 10,
                    flex: 1, flexWrap: 'wrap', color: '#ffff',
                    textAlign: 'center',  backgroundColor:'green',
                    justifyContent: 'center'}}>
                    {strings('main.activated')}
                  </Text>
  
                </TouchableOpacity>:<View>
                  <View style={styles.action}>
  
                    <StyledTextInput placeholder={strings('main.admin_code')} onChange={(val) => this.textInputChange(val)} />
                  </View>
  
  
                  <TouchableOpacity  style={{
                    flex:1, justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                    margin: '10%',
                    backgroundColor: '#4091F7'
                  }}
                                     activeOpacity={1}
                                     colors = {['#4091F7', '#4091F7']} activeOpacity={1}
                                     onPress={() => this.activateAdmin(this.state.code)}>
  
                    <Text style={{lineHeight: 25,fontSize:I18n.locale=='ar'?20:18, padding: 10,
                      flex: 1, flexWrap: 'wrap', color: '#ffff',
                      textAlign: 'center',
                      justifyContent: 'center'}}>
                      {strings('main.activate')}
                    </Text>
  
  
                  </TouchableOpacity>
  
                </View>
            }
  
  
          </Animatable.View>
        </ScrollView>
      )
    }
  };
  export default withTailwindHook(ActivateAdminAccess);
  
  
  
  
  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
    },
    header: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    footer: {
      flex: 3,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: 20,
      paddingVertical: 30
    },
    text_header: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 30
    },
    text_footer: {
      color: '#05375a',
      fontSize: 18
    },
    action: {
      flexDirection: I18n.locale === 'ar' ? 'row-reverse' : 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f2f2f2',
      paddingBottom: 5
    },
    actionError: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#FF0000',
      paddingBottom: 5
    },
    textInput: {
      flex: 1,
      textAlign: I18n.locale === 'ar' ? 'right':'left',
      direction: I18n.locale === 'ar' ? 'rtl' : 'ltr',
      marginTop: Platform.OS === 'ios' ? 0 : -12,
      paddingLeft: 10,
      color: '#05375a',
    },
    errorMsg: {
      color: '#FF0000',
      fontSize: 14,
    },
    button: {
      alignItems: 'center',
      marginTop: 50
    },
    signIn: {
      width: '100%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10
    },
    textSign: {
      fontSize: 18,
      fontWeight: 'bold'
    },
    headerImage: {
      width: width,
      height: height-500,
      borderRadius: 10
    },
    image: {
      flex: 1,
      resizeMode: "stretch",
      width: '100%',
            justifyContent: "center",
            borderTopRightRadius: 40,
            borderBottomLeftRadius: 40
        },
  
  });
  