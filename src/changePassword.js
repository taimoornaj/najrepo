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
import { Icon } from 'react-native-elements';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import  Loader  from '../components/Loader.js';
import { AsyncStorage } from '@react-native-community/async-storage';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import I18n from 'react-native-i18n';


const {width, height} = Dimensions.get('window'); 

//function Dashboard () {
export default class ChangePassword extends Component {

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
            newpass: '',
            confirmed: '',
            oldpass:'',
            secureTextoldPassEntry: true
        }
    }

    componentDidMount() {
    }

    changePassHandle = async(password, old_password) => {

        if (this.state.newpass == '' || this.state.confirmed == '' || this.state.oldpass == '') {
            this.setState({
                loader: false,
                error_message: strings('main.pass_empty'),
                modalmsg: true,
                pageload: 'SignInScreen'
            });

            Alert.alert('Wrong Input!', 'password field cannot be empty.', [
                {text: 'Okay'}
            ]);
            return;
        }

        if ( this.state.newpass != this.state.confirmed ) {
            this.setState({
                loader: false,
                error_message: strings('main.pass_empty'),
                modalmsg: true,
                pageload: 'SignInScreen'
            });

            Alert.alert('Wrong Input!', 'password not match.', [
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
        formData.append('old_password', old_password);
        formData.append('password', password);
        formData.append('client_secret', '1230NEJOUM1230');
        
        var Url  = AuthContext.server_url + "/Nejoum_App/changepass";
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
            console.warn(response);
            if(response.success == 'success'){
                this.setState({
                    loader: false,
                    error_message: strings('main.signin_success'),
                });

                Alert.alert('Success', 'Success', [
                    {text: 'Okay'}
                ]);
                this.forgetUser();
                return;
            }
            else{
                this.setState({
                    loader: false,
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
                error_message: strings('main.network_error')
            });
        });  
    }
   

    handleValidpassword = (val) => {
        if( val == this.state.newpass ) {
            this.setState({
                confirmed: val,
                isValidPassword: true
            });
        } else {
            this.setState({
                confirmed: val,
                isValidPassword: false
            });
        }
    }
    
    forgetUser = async () => {
        try { 
            await AsyncStorage.removeItem('loggedin');
            await AsyncStorage.removeItem('customer_id');
            await AsyncStorage.removeItem('server_url');
            } catch (error) {   // Error removing  
        }
        this.props.navigation.navigate('SignInScreen');
    };

    textInputChange = (val) => {
        if( val.trim().length >= 6 ) {
            this.setState({
                newpass: val,
                isValidpass: true
            });
        }else {
            this.setState({
                newpass: val,
                isValidpass: false
            });
        }
    }

    
    handleConfirmPasswordChange = (val) => {
        if( val == this.state.newpass ) {
            this.setState({
                confirmed: val,
                isValidPassword: true
            });
        }else {
            this.setState({
                confirmed: val,
                isValidPassword: false
            });
        }
        
    }

    textInputoldPassChange = (val) => {
        this.setState({
            oldpass: val
        });
    }

    updateSecureTextEntry = () => {
        this.setState({
            secureTextEntry: !this.state.secureTextEntry
        });
    }

    updateconfirmSecureTextEntry = () => {
        this.setState({
            confirm_secureTextEntry: !this.state.confirm_secureTextEntry
        });
    }

    updateSecureTextoldPassEntry = () => {
        this.setState({
            secureTextoldPassEntry: !this.state.secureTextoldPassEntry
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
             contentContainerStyle = {styles.container}>
                    <View style={styles.image}>
                            <Animatable.View 
                                animation="fadeInUpBig"
                                style={[styles.footer, {
                                    backgroundColor: 'transparent'}]}>
                                
                                <View style={styles.action}>
                                    <TextInput
                                        placeholder={strings('main.old_password')}
                                        placeholderTextColor="#666666"
                                        secureTextEntry={this.state.secureTextoldPassEntry ? true : false}
                                        style={[styles.textInput, {
                                            color: '#666666'
                                        }]}
                                        autoCapitalize="none"
                                        onChangeText={(val) => this.textInputoldPassChange(val)}
                                    />
                                    <TouchableOpacity activeOpacity={1}
                                        onPress={this.updateSecureTextoldPassEntry}>
                                        {this.state.secureTextoldPassEntry ? 
                                        <FontAwesomeIcon
                                            icon={ faEyeSlash }
                                            color="grey"
                                            size={20}
                                        />
                                        :
                                        <FontAwesomeIcon
                                            icon={ faEye }
                                            color="grey"
                                            size={20}
                                        />
                                        }
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.action}>
                                    <TextInput
                                        placeholder={strings('main.new_password')}
                                        placeholderTextColor="#666666"
                                        secureTextEntry={this.state.secureTextEntry ? true : false}
                                        style={[styles.textInput, {
                                            color: '#666666'
                                        }]}
                                        autoCapitalize="none"
                                        onChangeText={(val) => this.textInputChange(val)}
                                    />
                                    <TouchableOpacity activeOpacity={1}
                                        onPress={this.updateSecureTextEntry}>
                                        {this.state.secureTextEntry ? 
                                        <FontAwesomeIcon
                                            icon={ faEyeSlash }
                                            color="grey"
                                            size={20}
                                        />
                                        :
                                        <FontAwesomeIcon
                                            icon={ faEye }
                                            color="grey"
                                            size={20}
                                        />
                                        }
                                    </TouchableOpacity>
                                </View>
                                { this.state.isValidpass ? null : 
                                    <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={styles.errorMsg}>{strings('main.pass_validate')}</Text>
                                    </Animatable.View>
                                }

                                <View style={styles.action}>
                                    <TextInput 
                                        placeholder={strings('main.confirm_password')}
                                        placeholderTextColor="#666666"
                                        secureTextEntry={this.state.confirm_secureTextEntry ? true : false}
                                        style={[styles.textInput, {
                                            color: '#666666'
                                        }]}
                                        autoCapitalize="none"
                                        onChangeText={(val) => this.handleConfirmPasswordChange(val)}
                                    />
                                    <TouchableOpacity activeOpacity={1}
                                        onPress={this.updateconfirmSecureTextEntry}>
                                        {this.state.confirm_secureTextEntry ? 
                                        <FontAwesomeIcon
                                            icon={ faEyeSlash }
                                            color="grey"
                                            size={20}
                                        />
                                        :
                                        <FontAwesomeIcon
                                            icon={ faEye }
                                            color="grey"
                                            size={20}
                                        />
                                        }
                                    </TouchableOpacity>
                                </View>
                                
                                
                                { this.state.isValidPassword ? null : 
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                <Text style={styles.errorMsg}>{strings('main.password_not_match')}</Text>
                                </Animatable.View>
                                }
                                
                                <View style={styles.button}>
                                <LinearGradient
                                style={{
                                    flex:1, justifyContent: 'center',
                                                    alignItems: 'center',margin:50,
                                                    borderRadius: 10}}
                                                            colors = {['#0d5db8', '#0d5db8']}
                                                    >
                                <TouchableOpacity activeOpacity={1}  onPress={() => {this.changePassHandle( this.state.newpass, this.state.oldpass )}}>
                                                        
                                                        <Text style={{lineHeight: 25,fontSize:I18n.locale=='ar'?20:18, padding: 10, 
                                                        flex: 1, flexWrap: 'wrap', color: '#ffff',
                                                         textAlign: 'center', 
                                                                    justifyContent: 'center'}}>
                                                                        {strings('main.change_password')}        
                                                                </Text>
                                                       
                                    
                                </TouchableOpacity>
                                </LinearGradient>
                                </View>
                            </Animatable.View>
                    </View>              
            </ScrollView>      
        )
    }
}

//export default Dashboard



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