/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component, useRef, createRef} from 'react';
import type {Node} from 'react';



import { 
  NavigationContainer, 
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import { createStackNavigatStyleSheetor } from '@react-navigation/stack';


import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Linking,LogBox,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  ImageBackground,
  StatusBar,
  I18nManager,
  SafeAreaView,useColorScheme,
  AppRegistry,
  TextComponent, Dimensions, Share,
  PermissionsAndroid,
  PermissionsIOS
} from 'react-native';
import "./ignoreWarnings";
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Dashboard from './src/Dashboard.js';
import { strings } from './locals/i18n';
import { DrawerContent } from './components/DrawerContent';
import SplashScreen from './components/SplashScreen';
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from "react-native-restart";
import SignInScreen   from './src/SignInScreen.js';
import I18n from 'react-native-i18n';
// import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import PushNotification  from "react-native-push-notification";
import VersionCheck from 'react-native-version-check';
import {Notifications} from 'react-native-notifications';
import commonStyle from './assets/style/styles.js';
import { AuthContext } from './components/context';
//import analytics from '@react-native-firebase/analytics';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import allCars from './src/allCars.js';
import aboutCompany from './src/AboutCompany.js';
import contactCompany from './src/ContactusCompany.js';
import BranchesCompany from './src/BranchesCompany.js';
import notification from './src/notification.js';
import bookmarksCars from './src/bookmarksCars';
import addServiceRequest from './src/addServiceRequest.js';
import carforSale from './src/carforSale.js';
import filterStatement from  './src/filterStatement.js';
import profile from './src/profile.js';
import appInitalScreen from './src/appInitalScreen.js';
import statement from './src/Statement.js';
import carforSaleSlider from './src/carforSaleSlider';
import MainTabScreen from './components/MainTabScreen';  
import RootStackScreen from './components/RootStackScreen';
import Icone from 'react-native-vector-icons/MaterialIcons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { TailwindProvider } from "tailwind-rn";
import utilities from './tailwind.json';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import AppHeader from './components/AppHeader.js';
import AppInitialNavigation from './src/AppInitialNavigation.js';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
const Drawer = createDrawerNavigator();
const {width, height} = Dimensions.get('window'); 
const DetailsStack = createStackNavigator();

const HoStack = createStackNavigator();

const RootStack = createStackNavigator();
const Stack = createStackNavigator();

const channelId = 500;
const channelName = "notifiApp";
const channelDesc = "notifiAppforeground";

const firebaseConfig = {
  apiKey: "AAAAwz37kZ4:APA91bHRzzdlYhrXybSozKRX8WV6Wwxu36MgEsDDN7MTXBDqEPd4Ep1AVri5CLOigV-xEyYvGM8ztK_5hTBJHTs57wyROJVPKvf_cBciv_8cm6ziQbxOKcJv3qZpT5a9hxNctBcgJSEd",
  authDomain: "nejoum-aljazeera-2e42e.firebaseapp.com",
  databaseURL: "https://nejoum-aljazeera-2e42e.firebaseio.com",
  projectId: "nejoum-aljazeera-2e42e",
  storageBucket: "nejoum-aljazeera-2e42e.appspot.com",
  messagingSenderId: "838558519710",
  appId: "1:838558519710:ios:2f18beb59af4152871c68f",
  measurementId: "G-251703393",
};
const isDarkMode = 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  export default class App extends Component {
  
    constructor(props){
      super(props);
      this.routeNameRef = React.createRef();
      this.navigationRef = React.createRef();
  
      this.state = {
          timePassed: false,
          showRealApp: false,
          force_update: false,
          store_url: ''
      };
  
      this.requestStoragePermission();
      this.requestStorageReadPermission();
      this.requestPhotoLibraryPermission();
      this.requestExternalStoragePermission();
  
      Notifications.registerRemoteNotifications();
      Notifications.setNotificationChannel({
        channelId: '500',
        name: 'MainChannel',
        importance: 5,
        description: 'My Description',
        enableLights: true,
        enableVibration: true,
        // groupId: 'your-group',
        showBadge: true,
        soundFile: 'custom_sound.mp3',  // place this in <project_root>/android/app/src/main/res/raw/custom_sound.mp3
        vibrationPattern: [200, 1000, 500, 1000, 500],
    })
  }

  
  async componentDidMount () {
    //firebase.initializeApp(firebaseConfig);
    //console.log(app);
    await this.checkPermission();
    VersionCheck.needUpdate()
    .then(async res => {
      if (res.isNeeded) {
        this.setState({force_update: true, store_url: res.storeUrl});
        //Linking.openURL(res.storeUrl);  // open store if update is needed.
      }
    });
    var local_Token = await AsyncStorage.getItem('device_id'); 
   
    this.createNotificationListeners();
    this.set_language();
        
    this.setState({loading: true})
    const username = await AsyncStorage.getItem('loggedin');
    const name = await AsyncStorage.getItem('name');
    const type = await AsyncStorage.getItem('type');
    const device_id = await AsyncStorage.getItem('device_id');
    const customer_id = await AsyncStorage.getItem('logged_id');
    const server_url = await AsyncStorage.getItem('server_url');
    const api_server_url = await AsyncStorage.getItem('api_server_url');
    const phone = await AsyncStorage.getItem('phone');
  
    AuthContext.userName = username;
    AuthContext.name = name;
    AuthContext.id       = customer_id;
    AuthContext.device_id = device_id;
    AuthContext.server_url       = server_url;
    AuthContext.api_server_url       = api_server_url;
    AuthContext.phone       = phone;
    AuthContext.type       = type;
  
    if(username){
      this.setState({loading: false, logged_in: true, type: type})
    }else {
      this.setState({loading: false, logged_in: false})
    }
   
    
    //console.warn(username);
      setTimeout( () => {
          this.setTimePassed();
      },3700);
  }
  
  setTimePassed () {
    this.setState({timePassed: true});
  }

  refreshAccessToken = async() => {
    try {
      let refreshedTokens;
  
      await axios
        .post(`${AuthContext.api_server_url}refresh`, {
          client_id: process.env.API_CLIENT_ID,
          client_secret: process.env.API_CLIENT_SECRET,
          grant_type: "refresh_token",
          refresh_token: token.refresh_token,
        })
        .then((response) => {
          refreshedTokens = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
  
      return {
        ...token,
        access_token: refreshedTokens.access_token,
        expires_in: Date.now() + refreshedTokens.expires_in,
        refresh_token: refreshedTokens.refresh_token
          ? refreshedTokens.refresh_token
          : "",
      };
    } catch (error) {
      console.log(error);
  
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }
  }

  checkPermission = async() => {
    var local_Token = await AsyncStorage.getItem('device_id');
    //var local_Token = '';
    //await messaging().registerDeviceForRemoteMessages();
    firebase.messaging().hasPermission()
        .then(enabled => {
          if (enabled) {
            // user has permissions
            //console.log('User has fcm permission');
            firebase.messaging().getToken()
              .then(fcmToken => {
                if (fcmToken) {
                  if (local_Token != fcmToken) {
                    //messaging().registerDeviceForRemoteMessages();
                    AsyncStorage.setItem("device_id",fcmToken);
                }
                  // user has a device token
                } else {
                  //console.log('not have a device token yet');
                  // user doesn't have a device token yet -- **my problem is here**
                } 
              });
          } else {
            // user doesn't have permission
            firebase.messaging().requestPermission()
              .then(() => {
                // User has authorised
                firebase.messaging().getToken()
                .then(fcmToken => {
                  if (fcmToken) {
                    if (local_Token != fcmToken) {
                      AsyncStorage.setItem("device_id",fcmToken);
                  }
                    // user has a device token
                  } else {
                    // user doesn't have a device token yet -- **my problem is here**
                  } 
                });
              })
              .catch(error => {
                // User has rejected permissions
              })
          }
        })
  
  }

  requestExternalStoragePermission = async () => {
    try {
      const granted = await PermissionsIOS.request(
        PermissionsIOS.PERMISSIONS.PHOTO_LIBRARY,
        {
          title: 'Permission Required',
          message: 'This app needs permission to access your photo gallery.',
        }
      );
      if (granted === PermissionsIOS.RESULTS.GRANTED) {
        // Permission granted, proceed with opening the gallery
        openGallery();
      } else {
        // Permission denied
        console.log('Permission denied.');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  
  
  
  

  requestStoragePermission = async () => {
    check(PermissionsIOS.LOCATION_ALWAYS)
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log('This feature is not available (on this device / in this context)');
          break;
        case RESULTS.DENIED:
          console.log('The permission has not been requested / is denied but requestable');
          break;
        case RESULTS.LIMITED:
          console.log('The permission is limited: some actions are possible');
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');
          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          break;
      }
    })
    .catch((error) => {
      // …
    });
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Access Permission",
          message:
            "Nejoum App needs access to your Storage " +
            "",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //console.error("You can use the camera");
      } else {
        //console.error("Camera permission denied");
      }
    } catch (err) {
      //console.warn(err);
    }
  };
  
  
  
  requestStorageReadPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Access Permission",
          message:
            "Nejoum App needs access to your Storage " +
            "",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //console.error("You can use the camerfsafdsfa");
      } else {
        //console.error("Camera permission denied");
      }
    } catch (err) {
      //console.warn(err);
    }
  };

  requestPhotoLibraryPermission = async () => {
    try {
      const granted = await request(PermissionsIOS.PHOTO_LIBRARY);
      if (granted === 'granted') {
        console.log('Photo library permission granted');
        // Proceed with accessing the photo library
      } else {
        console.log('Photo library permission denied');
        // Handle the case when permission is not granted
      }
    } catch (error) {
      console.log('Error requesting permission:', error);
    }
  };
  
  getToken = async() => {
    var local_Token = await AsyncStorage.getItem('device_id');
    firebase.messaging().getToken()
    .then(fcmToken => {
      if (fcmToken) {
        if (local_Token != fcmToken) {
          messaging().registerDeviceForRemoteMessages();
          AsyncStorage.setItem("device_id",fcmToken);
      }
        // user has a device token
      } else {
        // user doesn't have a device token yet -- **my problem is here**
      } 
    });
  }
  
  requestPermission = async() => {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        await firebase.analytics().setAnalyticsCollectionEnabled(true);
        this.getToken();
    } catch (error) {
        // User has rejected permissions
        AsyncStorage.setItem("device_id",'no permission');
    }
  }
  
  
  set_language = async() => {
    var lang = await AsyncStorage.getItem("lang");
    if(lang)
        I18n.locale = lang;
    else
        AsyncStorage.setItem("lang",I18n.locale);
  }
  
  async createNotificationListeners() {
  
  
  messaging().setBackgroundMessageHandler(async remoteMessage => {
  });
  
  this.messageListener = firebase.messaging().onMessage((message) => {
    //process data message
    //console.warn(message);
    PushNotification.configure({
      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
      },
      senderID: '838558519710',
      popInitialNotification: true,
      requestPermissions: true
    })
    PushNotification.localNotification({
      channelId:"MainChannel",
      //... You can use all the options from localNotifications
      message: message.notification.body, // (required)
      date: new Date(Date.now() + 60 * 1000), // in 60 secs
      actions: '["open"]',
      allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
    });
  });
  
  }
  
  
  displayNotification(title, body) {
    // we display notification in alert box with title and body
    Alert.alert(
      title, body,
      [
        { text: 'Ok', onPress: () => console.log('ok pressed') },
      ],
      { cancelable: false },
    );
  }


carforSaleStackScreen = ({navigation}) => (
  <DetailsStack.Navigator screenOptions={{
          headerStyle: {
          backgroundColor: '#0d5db8',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
          fontWeight: 'bold'
          },
      }}>
          <DetailsStack.Screen name="carforSale" component={carforSale} options={{
          headerLeft: () => (
              <Icon.Button name="ios-menu" size={25} backgroundColor="#0d5db8" onPress={() => navigation.openDrawer()}></Icon.Button>
          )
          }} />

        <DetailsStack.Screen name="aboutCompany" component = {aboutCompany} options = {{
            header: () => (


<View style = {commonStyle.header}>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                      marginTop: height*0.05, flex:1}}>
                          <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                        ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                              <TouchableOpacity activeOpacity={1}  onPress={() => this.props.navigation.goBack()}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center', flex:1, flexDirection:'row'}}>
                                        <View>
                                            <FontAwesomeIcon
                                                icon={ faChevronLeft }
                                                color="#fff"
                                                size={width*0.06}
                                            />
                                        </View>
                                        <Text style={commonStyle.headerText}>{strings('main.back')}</Text>
                                    </View>
                              </TouchableOpacity>
                          </View>
                          <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.9}}>
                            <Text style={commonStyle.headerText}>{strings('main.about')}</Text>
                          </View>
                          <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                            <Text style={commonStyle.headerText}></Text>
                          </View>
                        </View>       
                    </View>

            )
        }} />
       
          <DetailsStack.Screen name="contactCompany" component = {contactCompany} options = {{
                  header: () => (


<View style = {commonStyle.header}>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                      marginTop: height*0.05, flex:1}}>
                          <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                        ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                              <TouchableOpacity activeOpacity={1}  onPress={() => this.props.navigation.goBack()}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center', flex:1, flexDirection:'row'}}>
                                        <View>
                                            <FontAwesomeIcon
                                                icon={ faChevronLeft }
                                                color="#fff"
                                                size={width*0.06}
                                            />
                                        </View>
                                        <Text style={commonStyle.headerText}>{strings('main.back')}</Text>
                                    </View>
                              </TouchableOpacity>
                          </View>
                          <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.9}}>
                            <Text style={commonStyle.headerText}>{strings('main.contact')}</Text>
                          </View>
                          <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                            <Text style={commonStyle.headerText}></Text>
                          </View>
                        </View>       
                    </View>

                  )
          }} />

        <DetailsStack.Screen name="bookmarksCars" component = {bookmarksCars} options = {{
                  header: () => (
                    <View style = {commonStyle.header}>
                          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center'}}>
                            <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', flex: 1}}>
                                  <TouchableOpacity activeOpacity={1} onPress={() => navigation.goBack()}>
                                    <View style={{margin: 16, alignItems: 'center', justifyContent: 'center'}}>
                                        <View>
                                          <FontAwesomeIcon
                                              icon={ faArrowLeft }
                                              color="#fff"
                                              size={width*0.06}
                                          />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                              <Text style={commonStyle.headerText}>{strings('main.favoriteCars')}</Text>
                            </View>
                            <View style={{justifyContent: 'flex-end', alignItems: 'flex-end', flex: 1}}>
                                
                            </View>
                          </View>       
                    </View>
                  )
          }} />

<DetailsStack.Screen name="carforSaleSlider" component = {carforSaleSlider} options={{}} />


          <DetailsStack.Screen name="BranchesCompany" component = {BranchesCompany} options = {{
                  header: () => (


<View style = {commonStyle.header}>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                      marginTop: height*0.05, flex:1}}>
                          <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                        ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                              <TouchableOpacity activeOpacity={1}  onPress={() => this.props.navigation.goBack()}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center', flex:1, flexDirection:'row'}}>
                                        <View>
                                            <FontAwesomeIcon
                                                icon={ faChevronLeft }
                                                color="#fff"
                                                size={width*0.06}
                                            />
                                        </View>
                                        <Text style={commonStyle.headerText}>{strings('main.back')}</Text>
                                    </View>
                              </TouchableOpacity>
                          </View>
                          <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.9}}>
                            <Text style={commonStyle.headerText}>{strings('main.branches')}</Text>
                          </View>
                          <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                            <Text style={commonStyle.headerText}></Text>
                          </View>
                        </View>       
                    </View>

                  )
                  }} />

<DetailsStack.Screen name="profile" component = {profile} options = {{
                  header: () => (

                    
<View style = {commonStyle.header}>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                      marginTop: height*0.05, flex:1}}>
                          <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                        ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                              <TouchableOpacity activeOpacity={1}  onPress={() => this.props.navigation.goBack()}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center', flex:1, flexDirection:'row'}}>
                                        <View>
                                            <FontAwesomeIcon
                                                icon={ faChevronLeft }
                                                color="#fff"
                                                size={width*0.06}
                                            />
                                        </View>
                                        <Text style={commonStyle.headerText}>{strings('main.back')}</Text>
                                    </View>
                              </TouchableOpacity>
                          </View>
                          <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.9}}>
                            <Text style={commonStyle.headerText}>{strings('main.profile')}</Text>
                          </View>
                          <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                            <Text style={commonStyle.headerText}></Text>
                          </View>
                        </View>       
                    </View>

                  )
                  }} />
  </DetailsStack.Navigator>
);


////end
allCarsStackScreen = ({navigation}) => (
    <DetailsStack.Navigator screenOptions={{
            headerStyle: {
            backgroundColor: '#0d5db8',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
            fontWeight: 'bold'
            }
        }}>
            <DetailsStack.Screen name="allCars" component={allCars} options={{
            headerLeft: () => (
                <Icon.Button name="ios-menu" size={25} backgroundColor="#0d5db8" onPress={() => navigation.openDrawer()}></Icon.Button>
            )
            }} />
    </DetailsStack.Navigator>
);

carstatementStackScreen = ({navigation}) => (
    <DetailsStack.Navigator screenOptions={{
            headerStyle: {
            backgroundColor: '#0d5db8',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
            fontWeight: 'bold'
            }
        }}>
            <DetailsStack.Screen name="statement" component={statement} options={{
            headerLeft: () => (
                <Icon.Button name="ios-menu" size={25} backgroundColor="#0d5db8" onPress={() => navigation.openDrawer()}></Icon.Button>
            )
            }} />
    </DetailsStack.Navigator>
  );

  filterStatementStackScreen = ({navigation}) => (
    <DetailsStack.Navigator screenOptions={{
            headerStyle: {
            backgroundColor: '#0d5db8',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
            fontWeight: 'bold'
            }
        }}>
            <DetailsStack.Screen name="filterStatement" component={filterStatement} options={{
            headerLeft: () => (
                <Icon.Button name="ios-menu" size={25} backgroundColor="#0d5db8" onPress={() => navigation.openDrawer()}></Icon.Button>
            )
            }} />
    </DetailsStack.Navigator>
  );
  
  
  forgetUser () {
    console.warn('yes');
  }


  render(){
    <StatusBar hidden />

    if(this.state.force_update){
      return (
        <View style={{
          flex: 1,
          justifyContent: "center"
        }}>
          <View style={{flexGrow:1, justifyContent:'center', alignItems:'center'}}>
            <TouchableOpacity style={{flexDirection: "row", backgroundColor:'#013188', justifyContent: 'center', alignItems:'center',
                                    borderColor: '#fff', borderRadius: 25, borderWidth: 2, padding: 20}}
                              onPress={() => Linking.openURL(this.state.store_url)}>
                <Text style={{color:'#fff', fontSize: 20}}>{strings('main.update')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if(!this.state.timePassed){
      if(this.state.type == 2){
        return (
          <TailwindProvider utilities={utilities}>
          <NavigationContainer 
          theme={NavigationDefaultTheme}>
            {!this.state.logged_in ? (
              <HoStack.Navigator
                >
                  <HoStack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
<HoStack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false }} />
<HoStack.Screen name="appInitalScreen" component={appInitalScreen} options={({ navigation }) => ({
    header: () => (
      <AppHeader navigation={navigation} strings={strings} commonStyle={commonStyle} height={height} width={width} text="App Initial Screen" />
    )
  })}/>

              </HoStack.Navigator>
            ) : (
              // User is signed in
              <Drawer.Navigator drawerPosition="left" drawerContent={props => <DrawerContent {...props} />}>
                <Drawer.Screen name="SplashScreen" component={SplashScreen} />
                <Drawer.Screen name="carforSale2" component={this.carforSaleStackScreen} />
            </Drawer.Navigator>
            )}
          </NavigationContainer>
          </TailwindProvider>
        );
      }else {
        return (
          <TailwindProvider utilities={utilities}>
          <NavigationContainer 
          ref={this.navigationRef}
          onReady={() => this.routeNameRef.current = this.navigationRef.current.getCurrentRoute().name}
          
          onStateChange={
            async () =>  {
            const previousRouteName = this.routeNameRef.current;
            const currentRouteName = this.navigationRef.current.getCurrentRoute().name;
            if (previousRouteName !== currentRouteName){
              /**await analytics().logScreenView({
                screen_name: currentRouteName,
                screen_class: currentRouteName,
              })**/
            }
            this.routeNameRef.current = currentRouteName;
          }} 
          theme={NavigationDefaultTheme}>
            {!this.state.logged_in ? (
              // No token found, user isn't signed in
              <HoStack.Navigator
                >
                  <HoStack.Screen name="SplashScreen" component={SplashScreen}  options={{ headerShown: false }} />
                  <HoStack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false }}  />
                  <HoStack.Screen name="appInitalScreen" component={appInitalScreen} options={({ navigation }) => ({
    header: () => (
      <AppHeader navigation={navigation} strings={strings} commonStyle={commonStyle} height={height} width={width} text="App Initial Screen" />
    )
  })} />
              </HoStack.Navigator>
            ) : (
              // User is signed in
              <Drawer.Navigator screenOptions={{
                headerShown: false,
              }} drawerPosition="left" drawerContent={props => <DrawerContent {...props} />}>
                <Drawer.Screen name="SplashScreen" component={SplashScreen} />
                <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
                <Drawer.Screen name="Dashboard" component={Dashboard} />
                <Drawer.Screen name="carforSale2" component={this.carforSaleStackScreen} />
                <Drawer.Screen name="statement2" component={this.carstatementStackScreen} />
                <Drawer.Screen name="filterStatement" component={this.filterStatementStackScreen} />
                <Drawer.Screen name="SignInScreen" component={SignInScreen} />
            </Drawer.Navigator>
            )}
          </NavigationContainer></TailwindProvider>
        );
      }
      
    }else {
      if(this.state.type == 2){
        return (
          <TailwindProvider utilities={utilities}>
          <NavigationContainer
          ref={this.navigationRef}
          onReady={() => this.routeNameRef.current = this.navigationRef.current.getCurrentRoute().name}
          
          onStateChange={
            async () =>  {
            const previousRouteName = this.routeNameRef.current;
            const currentRouteName = this.navigationRef.current.getCurrentRoute().name;
            if (previousRouteName !== currentRouteName){
              /**await analytics().logScreenView({
                screen_name: currentRouteName,
                screen_class: currentRouteName,
              })**/
            }
            this.routeNameRef.current = currentRouteName;
          }} 
          theme={NavigationDefaultTheme}>
            {!this.state.logged_in ? (
              // No token found, user isn't signed in
              <HoStack.Navigator
                  >
                  <HoStack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
                  <HoStack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false }} />
                  <HoStack.Screen name="appInitalScreen" component={appInitalScreen} options={({ navigation }) => ({
    header: () => (
      <AppHeader navigation={navigation} strings={strings} commonStyle={commonStyle} height={height} width={width} text="App Initial Screen" />
    )
  })}  />
              </HoStack.Navigator>
            ) : (
              // User is signed in
              <Drawer.Navigator drawerPosition="left" drawerContent={props => <DrawerContent {...props} />}>
                <Drawer.Screen name="carforSale2" component={this.carforSaleStackScreen} />
                <Drawer.Screen drawerLockMode= 'locked-closed' name="splash" component={SplashScreen} />
            </Drawer.Navigator>
            )}
          </NavigationContainer></TailwindProvider>
        );
      }else {
        return (
          <TailwindProvider utilities={utilities}>
          <NavigationContainer 
          ref={this.navigationRef}
          onReady={() => this.routeNameRef.current = this.navigationRef.current.getCurrentRoute().name}
          
          onStateChange={
            async () =>  {
            const previousRouteName = this.routeNameRef.current;
            const currentRouteName = this.navigationRef.current.getCurrentRoute().name;
            if (previousRouteName !== currentRouteName){
              /**await analytics().logScreenView({
                screen_name: currentRouteName,
                screen_class: currentRouteName,
              })**/
            }
            this.routeNameRef.current = currentRouteName;
          }}
          theme={NavigationDefaultTheme}>
            {!this.state.logged_in ? (
              // No token found, user isn't signed in
              <HoStack.Navigator
                screenOptions={{
                
              }}>
                  <HoStack.Screen name="SignInScreen" component={SignInScreen} options={{headerShown:false}} />
                  <HoStack.Screen 
  name="appInitalScreen" 
  component={appInitalScreen} 
  options={({ navigation }) => ({
    header: () => (
      <AppHeader navigation={navigation} strings={strings} commonStyle={commonStyle} height={height} width={width} text="App Initial Screen" />
    )
  })}
/>
                  <HoStack.Screen 
  name="addServiceRequest" 
  component={addServiceRequest} 
  options={({ navigation }) => ({
    header: () => (
      <AppHeader navigation={navigation} strings={strings} commonStyle={commonStyle} height={height} width={width} text="Add Service Request" />
    )
  })}
/>

                  <HoStack.Screen name="HomeDrawer" component={MainTabScreen}   options={{headerShown:false}}/>
                  <HoStack.Screen name="Dashboard" component={Dashboard} options={{headerShown:false}} />
                  <HoStack.Screen name="carforSale2" component={this.carforSaleStackScreen} options={{headerShown:false}} />
              </HoStack.Navigator>
            ) : (
              // User is signed in
              <Drawer.Navigator  drawerPosition="left" drawerContent={props => <DrawerContent {...props} />}>
                <Drawer.Screen name="HomeDrawer" component={MainTabScreen} options={{ headerShown: false }}  />
                <Drawer.Screen name="Dashboard" component={Dashboard}  options={{ headerShown: false }} />
                <Drawer.Screen name="carforSale2" component={this.carforSaleStackScreen} options={{ headerShown: false }}  />
                <Drawer.Screen name="filterStatement" component={this.filterStatementStackScreen}  options={{ headerShown: false }} />
                <Drawer.Screen name="statement2" component={this.carstatementStackScreen}  options={{ headerShown: false }} />
                <Drawer.Screen drawerLockMode= 'locked-closed' name="splash" component={SplashScreen} options={{ headerShown: false }}  />
                <Drawer.Screen name="SignInScreen" component={SignInScreen}  options={{ headerShown: false }} />
                <Drawer.Screen name="appInitalScreen" component={appInitalScreen} options={({ navigation }) => ({
    header: () => (
      <AppHeader navigation={navigation} strings={strings} commonStyle={commonStyle} height={height} width={width} text="App Initial Screen" />
    )
  })}  />

            </Drawer.Navigator>
            )}
          </NavigationContainer></TailwindProvider>
        );
      }
      
    }
  }
  
};
Icone.loadFont();
AppRegistry.registerComponent('nejoumapp', () => App);

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});


//export default App;
