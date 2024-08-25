import React, {Component} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
    Alert,
    ScrollView,
    Image,
    Dimensions,
    SafeAreaView,
    KeyboardAvoidingView,
    ImageBackground,
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { strings } from '../locals/i18n';
//import { CheckBox } from 'react-native-elements';
import {CheckBox} from "native-base";
import I18n from 'react-native-i18n';
import DeviceInfo from 'react-native-device-info';
import { AuthContext } from '../components/context';
import  Loader  from '../components/Loader.js';
import  ModalMsg  from '../components/ModalMsg.js';
import AsyncStorage from '@react-native-community/async-storage';
// import firebase from '@react-native-firebase/app';
import RNRestart from 'react-native-restart'; 
import commonStyle from '../assets/style/styles.js';
import { faUser, faEye, faEyeSlash, faLock, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import WithTailwindHook from "../components/hooks/WithTailwindHook";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const {width, height} = Dimensions.get('window');
const englishPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default class SignInScreen extends Component {
    
    //colors = useTheme();
    
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            check_textInputChange: false,
            secureTextEntry: true,
            isValidUser: true,
            isValidPassword: true,
            loader: false,
            modalmsg: false,
            archecked: false,
            enchecked: false,
            lang:'en',
            checked:true,
            background_ar: 'transparent',
            background_en: '#0d5db8',
            color_ar: '#0d5db8',
            color_en: '#fff'
        }
    }

    async componentDidMount(){
        //var device_id = await AsyncStorage.getItem('device_id');
        //if(device_id == null){
        //    RNRestart.Restart();
        //}
    }


    textInputChange = (val) => {
        if(englishPattern.test(String(val).toLowerCase())) {
            this.setState({
                username: val,
                check_textInputChange: true,
                isValidUser: true
            });
        } else {
            this.setState({
                username: val,
                check_textInputChange: false,
                isValidUser: false
            });
        }
    }

    handlePasswordChange = (val) => {
        if( val.trim().length >= 8 ) {
            this.setState({
                password: val,
                isValidPassword: true
            });
        } else {
            this.setState({
                password: val,
                isValidPassword: false
            });
        }
    }

    updateSecureTextEntry = () => {
        this.setState({
            secureTextEntry: !this.state.secureTextEntry
        });
    }

    handleValidUser = (val) => {
        if(englishPattern.test(String(val).toLowerCase())) {
            this.setState({
                username: val,
                isValidUser: true
            });
        } else {
            this.setState({
                username: '',
                isValidUser: false
            });
        }
    }


    loginHandle = async(userName, password) => {

        if ( this.state.username.length == 0 || this.state.password.length == 0 ) {
            this.setState({
                loader: false,
                error_message: strings('main.username_pass_empty'),
                modalmsg: true,
                pageload: 'SignInScreen'
            });

            Alert.alert('Wrong Input!', 'Username or password field cannot be empty.', [
                {text: 'Okay'}
            ]);
            return;
        }
        this.setState({
            loader: true
        });
        var device_id = await AsyncStorage.getItem('device_id');
        if(device_id != null){
            const formData = new FormData();
            formData.append('client_id', '1230');
            formData.append('client_secret', '1230NEJOUM1230');
            formData.append('email', userName);
            formData.append('password', password);
            formData.append('Device_push_regid', device_id);
            formData.append('Device_brand', DeviceInfo.getBrand());
            formData.append('Device_model', DeviceInfo.getModel());
            formData.append('Device_id', DeviceInfo.getDeviceId());
            formData.append('Device_os', DeviceInfo.getSystemName()+" "+DeviceInfo.getSystemVersion());
            formData.append('Device_appversion', DeviceInfo.getVersion());
            formData.append('Device_platform', Platform.OS);
            formData.append('Device_lang', this.state.lang);
            var Url  = "https://nejoumaljazeera.co/Nejoum_App/login";
            const foundUser = '';
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
                const MyContext = React.createContext();
                //console.warn('dsd');
                //console.warn(response.form_response);
                if(response.form_response == 'success'){
                    I18n.locale = this.state.lang;
                    this.rememberUser(response.customer_id, response.full_name,response.phone, response.type);
                    this.setState({
                        loader: false,
                        error_message: strings('main.signin_success'),
                        modalmsg: true,
                        pageload: 'HomeDrawer',
                    });
                    AuthContext.userName = userName;
                    AuthContext.password = password;
                    AuthContext.type     = response.type;
                    AuthContext.phone    = response.phone;
					AuthContext.device_id = device_id;							  
                    AuthContext.id       = response.customer_id;
                    AuthContext.name       = response.full_name;
                    AuthContext.server_url       = "https://nejoumaljazeera.co/";
                    AuthContext.api_server_url       = "https://api.nejoumaljazeera.co/";
                    return;
                }
                else{
                    this.setState({
                        loader: false,
                        error_message: strings('main.network_error'),
                        userName: userName,
                        password: password
                    });
                    Alert.alert(strings('main.error'), strings('main.accountnotexist'), [
                        {text: strings('main.ok')}
                    ]);
                    return;
                }
            })
            .catch((error) => {
                console.warn(error);
                Alert.alert('Error', 'Error', [
                    {text: 'Okay'}
                ]);
                this.setState({
                    loader: false,
                    error_message: strings('main.network_error'),
                    //modalmsg: true,
                    //pageload: 'SignInScreen'
                });
            });  
        }else {
            var local_Token = await AsyncStorage.getItem('device_id');
            firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                // user has permissions
                console.log('second User has fcm permission');
                /**Alert.alert('Error', 'second not token', [
                    {text: 'Okay'}
                ]);**/
                firebase.messaging().getToken()
                    .then(fcmToken => {
                    if (fcmToken) {
                        if (local_Token != fcmToken) {
                        AsyncStorage.setItem("device_id",fcmToken);
                        /**Alert.alert('second', fcmToken, [
                            {text: 'Okay'}
                        ]);**/
                    }
                        // user has a device token
                    } else {
                        /**Alert.alert('second error', 'second not have a device token yet', [
                            {text: 'Okay'}
                        ]);**/
                        console.log('second not have a device token yet');
                        // user doesn't have a device token yet -- **my problem is here**
                    } 
                    });
                } else {
                // user doesn't have permission
                console.log('second User doesn\'t have fcm permission')
                firebase.messaging().requestPermission()
                    .then(() => {
                    // User has authorised
                    console.log('second User has authorised fcm')
                    firebase.messaging().getToken()
                    .then(fcmToken => {
                        if (fcmToken) {
                        if (local_Token != fcmToken) {
                            //messaging().registerDeviceForRemoteMessages();
                            AsyncStorage.setItem("device_id",fcmToken);
                        }
                        // user has a device token
                        } else {
                        console.log('second not have a device token yet');
                        // user doesn't have a device token yet -- **my problem is here**
                        } 
                    });
                    })
                    .catch(error => {
                    // User has rejected permissions
                    console.log('second User has rejected fcm permissions, error = ', error)
                    })
                }
            })
            var device_id = await AsyncStorage.getItem('device_id');
            const formData = new FormData();
            formData.append('client_id', '1230');
            formData.append('client_secret', '1230NEJOUM1230');
            formData.append('email', userName);
            formData.append('password', password);
            formData.append('Device_push_regid', device_id);
            formData.append('Device_brand', DeviceInfo.getBrand());
            formData.append('Device_model', DeviceInfo.getModel());
            formData.append('Device_id', DeviceInfo.getDeviceId());
            formData.append('Device_os', DeviceInfo.getSystemName()+" "+DeviceInfo.getSystemVersion());
            formData.append('Device_appversion', DeviceInfo.getVersion());
            formData.append('Device_platform', Platform.OS);
            formData.append('Device_lang', this.state.lang);
            var Url  = "https://nejoumaljazeera.co/Nejoum_App/login";
            const foundUser = '';
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
                const MyContext = React.createContext();
                if(response.form_response == 'success'){
                    I18n.locale = this.state.lang;
                    this.rememberUser(response.customer_id, response.full_name, response.phone, response.type);
                    this.setState({
                        loader: false,
                        error_message: strings('main.signin_success'),
                        modalmsg: true,
                        pageload: 'HomeDrawer',
                    });
                    AuthContext.userName = userName;
                    AuthContext.password = password;
                    AuthContext.device_id = device_id;	
                    AuthContext.phone    = response.phone;
                    AuthContext.type     = response.type;
                    AuthContext.id       = response.customer_id;
                    AuthContext.name       = response.full_name;
                    AuthContext.server_url       = "https://nejoumaljazeera.co/";
                    AuthContext.api_server_url       = "https://api.nejoumaljazeera.co/";
                    return;
                }
                else{
                    this.setState({
                        loader: false,
                        error_message: strings('main.network_error'),
                        userName: userName,
                        password: password
                    });
                    Alert.alert(strings('main.error'), strings('main.accountnotexist'), [
                        {text: strings('main.ok')}
                    ]);
                    return;
                }
            })
            .catch((error) => {
                console.warn(error);
                Alert.alert('Error', 'Error', [
                    {text: 'Okay'}
                ]);
                this.setState({
                    loader: false,
                    error_message: strings('main.network_error'),
                    //modalmsg: true,
                    //pageload: 'SignInScreen'
                });
            });  
            /**this.setState({
                loader: false,
                error_message: strings('main.network_error'),
                userName: userName,
                password: password
            });
            Alert.alert(strings('main.error'), strings('main.network_error'), [
                {text: strings('main.ok')}
            ],
            { cancelable: false }
            );**/
            //onPress: () => {RNRestart.Restart()}
            //return;
        }
        
    }


    async componentDidMount() {
        const username = await this.getRememberedUser();
        this.setState({ 
        username: username || "", 
        rememberMe: username ? true : false });
    }

    rememberUser = async (customer_id, full_name, phone, type) => 
    {
        try
        {
          await AsyncStorage.setItem('loggedin', this.state.username);
          await AsyncStorage.setItem('username', this.state.username);
          await AsyncStorage.setItem('name', full_name);
          await AsyncStorage.setItem('phone', phone);
          await AsyncStorage.setItem('type', type);
          await AsyncStorage.setItem('logged_id', customer_id);
          await AsyncStorage.setItem('lang', this.state.lang);
          await AsyncStorage.setItem('server_url', 'https://nejoumaljazeera.co/');
          await AsyncStorage.setItem('api_server_url', 'https://api.nejoumaljazeera.co/');
        } 
        catch (error) {  // Error saving data
        }
        RNRestart.Restart();
        if(type == 2){
            //this.props.navigation.navigate("carforSale");
        }else {
            //this.props.navigation.navigate("HomeDrawer");
        }
        
    };

    getRememberedUser = async () => 
    {
        try {
            const username = await AsyncStorage.getItem('loggedin'); 
            if (username !== null) {    // We have username!!
                return username;
                }
        } catch (error) {  // Error retrieving data
        }
    };

    forgetUser = async () => {
        try { 
            await AsyncStorage.removeItem('loggedin');
            } catch (error) {   // Error removing  
        }
    };

    toggleRememberMe(value) {
        this.setState({checked: !this.state.checked, rememberMe: value }) 
    }

    togglelang(value){
        if(value == 'ar'){
            this.setState({lang: value, background_ar:'#0d5db8', background_en:'transparent',
             color_ar: '#fff', color_en: '#0d5db8'});
        }else {
            this.setState({lang: value, background_en:'#0d5db8', background_ar:'transparent', color_en: '#fff', color_ar: '#0d5db8'});
        }
        I18n.locale = value;
    }
    
    gotoGuest = async () => {
        var type = '2';
        await AsyncStorage.setItem('type', type);
        await AsyncStorage.setItem('lang', this.state.lang);
        await AsyncStorage.setItem('server_url', 'https://nejoumaljazeera.co/');
        await AsyncStorage.setItem('api_server_url', 'https://api.nejoumaljazeera.co/');
        AuthContext.type     = type;
        AuthContext.server_url       = "https://nejoumaljazeera.co/";
        AuthContext.api_server_url       = "https://api.nejoumaljazeera.co/";
        this.props.navigation.navigate('carforSale2');
    }
    

    render(){
        if(this.state.loader){
            return(
                <Loader loader={this.state.loader}></Loader>
            )
        }
        return (
            <KeyboardAwareScrollView  keyboardShouldPersistTaps={'always'}
                style={{flex:1}}
                showsVerticalScrollIndicator={false}>

            <ScrollView contentContainerStyle = {styles.container}>
            
    <StatusBar hidden />
                    <View style={{}}>
                        <Image
                            resizeMode = "cover"
                            style = {styles.headerImage}
                            source = {require('../assets/img.png')}
                        />
                        <View style={{flexDirection: 'row', flex:1, height:height*0.09}}> 
                            <Image
                                resizeMode="cover"
                                style={styles.image}
                                source={require('../assets/images/logoSignin.png')}
                            />
                        </View>
                    </View>
                    <View style={{justifyContent: 'center', flexDirection:'column', alignItems:'center',flex:1,}}>
                        <Text style={styles.text_signin}>{strings('main.signin')}</Text>
                        <Text style={[styles.text_footer, { margin:'3%',
                                color: '#343D40', borderColor: '#0d5db8', fontSize:width*0.04,
                        }]}>{I18n.t('main.signinDesc')}</Text>
                    </View>
                    <View style={{flexDirection:'row',
                    justifyContent: 'flex-end', alignItems:'flex-end', flex:1}}>
                        <TouchableOpacity
                            onPress={() => {this.gotoGuest()}}>
                        <Text style={[styles.text_footer, {
                                color: '#0d5db8', borderColor: '#0d5db8', paddingHorizontal: height*0.02,
                        }]}>{I18n.t('main.guest')}</Text>
                        </TouchableOpacity>
                    </View>
                    <Animatable.View 
                        animation="fadeIn"
                        duration={2500}
                        style={[styles.footer, {  flex:1,
                            backgroundColor: '#EDEDED'}]}>
                        <View style={styles.action}>
                            <TextInput
                                placeholder={strings('main.username')}
                                placeholderTextColor="#666666"
                                style={[commonStyle.textInput, {
                                    color: '#666666'
                                }]}
                                value = {this.state.username}
                                autoCapitalize="none"
                                onChangeText={(val) => this.textInputChange(val)}
                            />
                            {this.state.check_textInputChange ? 
                            <Animatable.View
                                animation="bounceIn">
                                <FontAwesomeIcon
                                    icon={ faCircleCheck }
                                    name="check-circle"
                                    color="green"
                                    size={20}
                                />
                            </Animatable.View>
                            : null}
                        </View>
                        { this.state.isValidUser ? null : 
                        <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Username must be email and have english characters</Text>
                        </Animatable.View>
                        }
                        <View style={styles.action}>
                            <TextInput 
                                placeholder="Password"
                                placeholderTextColor="#666666"
                                value = {this.state.password}
                                secureTextEntry={this.state.secureTextEntry ? true : false}
                                style={[commonStyle.textInput, {
                                    color: '#666666'
                                }]}
                                autoCapitalize="none"
                                onChangeText={(val) => this.handlePasswordChange(val)}
                            />
                            <TouchableOpacity
                                onPress={this.updateSecureTextEntry}>
                                {this.state.secureTextEntry ? 
                                <FontAwesomeIcon 
                                    name="eye-off"
                                    color="grey"
                                    icon={ faEyeSlash }
                                    size={20}
                                />
                                :
                                <FontAwesomeIcon
                                    icon={ faEye }
                                    name="eye"
                                    color="grey"
                                    size={20}
                                />
                                }
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity style={{
                                flexDirection: 'row',
                                }} activeOpacity={1} delayPressIn={0}
                                                onPress={() => I18n.locale == 'ar'?this.togglelang('en'): this.togglelang('ar')}>
                                <Text  style={{
                                    color: '#0093FF',
                                    textDecorationLine:'underline',
                                    fontSize: width*0.04,
                                    textAlign: 'center',
                                    borderRadius: 6,
                                    padding: '2%',
                                    fontWeight:'bold',

                                }} >
                                    {I18n.locale == 'en' ? strings('main.lang_ar'):strings('main.lang_en')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.button}>
                            <TouchableOpacity
                                style={commonStyle.submitbuttonBlue}
                                onPress={() => {this.loginHandle( this.state.username, this.state.password )}}>
                                <Text style={commonStyle.buttonTextBlue}>{strings('main.login')}</Text>
                            </TouchableOpacity>
                        </View>
                    </Animatable.View>
                    <View style={{ flexDirection:'row', borderTopWidth:1, borderTopColor: '#707070', 
                        padding: '5%', width:width*0.9, marginLeft:'5%',  justifyContent:'center'}}>
                        <Text style={{color:'#343D40',}}>
                        {strings('dashboard.comName')}</Text>
                    </View></ScrollView></KeyboardAwareScrollView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
      flexGrow: 1
    },
    header: {
        top:0,
    },
    footer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 30,
        borderWidth:3, borderColor: '#EDEDED'
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#013188',
        fontSize: 18
    },
    text_signin: {
        color: '#013188',
        fontSize: width*0.1,
        fontWeight:'bold',
        justifyContent:'center',
        alignItems:'center'
    },
    action: {
        flexDirection: I18n.locale=='ar'?'row-reverse':'row',
        padding : height*0.014,
        margin:'2%',
        borderWidth: 1, borderColor: '#707070', borderRadius:10, 
        backgroundColor:'#fff'
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: '5%'
    },
    signIn: {
        width: '50%',
        flexDirection:'row',
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
        height: height*0.24,
    },
    image: {
        flex: 1,
        top:-height*0.0999999,
        resizeMode: "contain",
        width: '100%',
        justifyContent: "center",
        borderTopRightRadius: 40,
        borderBottomLeftRadius: 40,
    }
  });
