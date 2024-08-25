/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React , {Component} from 'react';
 import * as Keychain from 'react-native-keychain';
 import {
     StyleSheet,
   ScrollView,
   View,
   Text,
   Image,
   TouchableOpacity,
   FlatList,
   ImageBackground,
   Dimensions,
   Alert,
   StatusBar,
   SafeAreaView,
   //Modal,
   Linking,
   BackHandler,
   ToastAndroid,
   TextInput,
   TouchableWithoutFeedback
 } from 'react-native';
 import * as Animatable from 'react-native-animatable';
 import LinearGradient from 'react-native-linear-gradient';
 import { Icon, Badge, Avatar  } from 'react-native-elements';
 import { strings } from '../locals/i18n';
 import { AuthContext } from '../components/context';
 import  Loader  from '../components/Loader.js';
 import  ModalMsg  from '../components/ModalMsg.js';
 import AsyncStorage from '@react-native-community/async-storage';
 import I18n from 'react-native-i18n';
 import TextTicker from 'react-native-text-ticker';
 import { Overlay } from 'react-native-elements';
 import RemotePushController from '../components/RemotePushController.js';
 import  PushNotification from "react-native-push-notification";
 import commonStyle from '../assets/style/styles.js';
 import { SearchBar } from 'react-native-elements';
 import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
 import { faX, faBars, faPlusCircle, faComments } from '@fortawesome/free-solid-svg-icons';
//  import firebase from '@react-native-firebase/app';
 import Modal from 'react-native-modal';
 
 const {width, height} = Dimensions.get('window'); 
 const radius = height*0.35 / 2;
 const center = radius-15;
 const circlesmalsize = height*0.09;
 function Item({ id, title, img, click}) {
     return (
         <TouchableOpacity 
                 onPress = {() => click}
                 key={id}
                 >
                 <View
                     style={{
                         height: 100,
                         width: 150,
                         margin: 10,
                         
                     }}>
                     <Image
                         source= {img}
                         style={styles.ImageIconStyleup}
                     />
                     <Text style={styles.buttonTextup}>{title}</Text>
                 </View>
         </TouchableOpacity>
     );
 }
 
   
 
 //function Dashboard () {
 export default class Dashboard extends Component {
 
     state = {
         countback: 0
     };
 
     constructor(props){
         super(props);
         this.state = {
             setd: '',
             activeModalIndex: 0,
             search: '',
             allcount: 0,
             cancelledCount:0,
             searcharrayLotvin: [],
             notification: [],
             generalNotification: [],
             notificationCount: 0,
             visible: false,
             visibleCases: false,
             dataSource  : [],
             phonenumber  : '0097165440202',
             showAlertInput: false,
             idGlbal: '',
             carGlobal: '',
             valueGlobal: '',
             inputText: ''
           }
 
           this.props.navigation.setOptions({
             header: () => (
                 <Animatable.View animation="fadeInDown" 
                 duration = {1000}>
                     <View  style = {commonStyle.header}
                    /** 
                             position: 'relative',
                             left: 0,
                             right: 0,
                             bottom: 0,
                             top:0,
                             width: '100%',
                             backgroundColor: '#013188',
                             height: 55,
                             //borderBottomLeftRadius: 30,
                             //borderBottomRightRadius: 30,**/
                             >
                             <View style={{flex:1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                         marginTop: height*0.05}}>
                                 <View style={{justifyContent: 'space-between', alignItems: 'flex-start', flex:1, marginLeft:'5%'}}>
                                     <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems: 'flex-start'}}>
                                         <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.openDrawer()}> 
                                             <View style={{marginRight:16, alignItems: 'center', justifyContent: 'center'}}>
                                                 <FontAwesomeIcon
                                                     icon={ faBars }
                                                     color="#fff"
                                                     size={width*0.05}
                                                     backgroundColor="#fff" 
                                                 />
                                             </View>
                                         </TouchableOpacity>
                                         <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate("complaints")} >
                                             {/* <View style={{marginLeft:'15%'}}>
                                                 <FontAwesomeIcon
                                                     icon={ faEnvelope }
                                                     color="#fff"
                                                     size={width*0.05}
                                                 />
                                             </View> */}
                                         </TouchableOpacity>
                                     </View>
                                 </View>
                                 <View style={{flex:1, flexDirection: 'row', justifyContent: 'center'}}>
                                     <Image
                                         source={require('../assets/images/Logo-white.png')}
                                         style={{width: width*0.1, height: width*0.1, resizeMode: 'contain'}}/>
                                 </View>
                                 
                                 <View style={{flex:1, justifyContent: 'center', alignItems: 'flex-end', marginRight:'5%'}}>
                                    <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems: 'flex-start'}}>
                                        <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate('contactCompany')}>
                                            <View style={{marginRight:16, alignItems: 'center', justifyContent: 'center'}}>
                                                {/* <FontAwesomeIcon
                                                    icon={ faComments  }
                                                    color="#fff"
                                                    size={width*0.08}
                                                    backgroundColor="#eee"
                                                /> */}
                                                <View style={styles.sendButton}>
                                                  <Image source={require('../assets/chat_message_nj.png')} style={[{height: width * 0.085, padding:2, borderRadius:5, width: width * 0.085 }]} />
                                              </View>
                                            </View>
                                        </TouchableOpacity>
                                          <TouchableOpacity activeOpacity={1} onPress={() => Linking.openURL(`tel:${this.state.phonenumber}`) }>
                                                 <View style={{ alignItems: 'center', justifyContent: 'center'}}>
                                                 <Image
                                                     source={require('../assets/images/homeIcons/call.png')}
                                                     style={{width: width*0.08, height: width*0.08, resizeMode: 'contain'}}/>
                                                 </View>
                                         </TouchableOpacity>
                                     </View>
                                 </View>
                             </View>       
                     </View>
                 </Animatable.View>
               )
         });
 
     }
 
     SearchFilterFunction(text) {
         //text = 25502547;
         const newData = this.state.searcharrayLotvin.filter(function(item) {
         const itemData = item ? item :'';
         const textData = text;
         return itemData.indexOf(textData) > -1;
       });
       this.setState({ dataSource: newData, search: text,
       });
     }
     
     ListViewItemSeparator = () => {
         return (
             <View
             style={{ 
                 /**height: 0.4,
                 width: '100%',
                 backgroundColor: '#141313',**/
             }}
             />
         );
     };
 
 
     async componentDidMount() {
         //BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
         await this.checkPassword();				 
         this.set_language();
         this.getcustomerslotvin();
         await this.getData();
         await this.checkToken();
         //
     }
 
     checkToken = async() => {
         var local_Token = await AsyncStorage.getItem('device_id');
         //var local_Token = null;
         if(local_Token == null || local_Token != null){
             firebase.messaging().hasPermission()
             .then(enabled => {
                 if (enabled) {
                 // user has permissions
                 firebase.messaging().getToken()
                     .then(fcmToken => {
                         
                     if (fcmToken) {
                         if (local_Token != fcmToken) {
                             /**Alert.alert('Third', fcmToken, [
                                 {text: 'Okay'}
                             ]);**/
                         AsyncStorage.setItem("device_id",fcmToken);
                     }
                         // user has a device token
                     } else {
                         //console.log('not have a device token yet');
                         /**Alert.alert('Third Error', 'error third', [
                             {text: 'Okay'}
                         ]);**/
                         // user doesn't have a device token yet -- **my problem is here**
                     } 
                     });
                 } else {
                 // user doesn't have permission
                 //console.log('User doesn\'t have fcm permission')
                 firebase.messaging().requestPermission()
                     .then(() => {
                     // User has authorised
                     //console.log('User has authorised fcm')
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
                     })
                     .catch(error => {
                     // User has rejected permissions
                     //console.log('User has rejected fcm permissions, error = ', error)
                     })
                 }
             })
             var device_id = await AsyncStorage.getItem('device_id');
             //console.warn('fsadfasd');
             //console.warn(device_id);
             const formData = new FormData();
             formData.append('client_id', '1230');
             formData.append('client_secret', '1230NEJOUM1230');
             formData.append('customer_id', AuthContext.id);
             formData.append('Device_push_regid', device_id);
             var Url  = "https://nejoumaljazeera.co/Nejoum_App/updateToken";
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
                 if(response.form_response == 'success'){
                     return;
                 }
                 else{
                     //console.log('error Token');
                     return;
                 }
             })
             .catch((error) => {
                 console.warn(error);
                 Alert.alert('Error', strings('main.network_error'), [
                     {text: 'Okay'}
                 ]);
             });  
         }
     }
 
     getcustomerslotvin = () => {
         const formData = new FormData();
         formData.append('client_id', '1230');
         formData.append('client_secret', '1230NEJOUM1230');
         formData.append('customer_id', AuthContext.id);
         var Url  = AuthContext.server_url + "/Nejoum_App/getAllCustomersBL";
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
             //console.warn(response);
             if(response.success == 'success') {
                 this.setState({
                     searcharrayLotvin   : response.data,
                   });
                 return;
             }
             else {
                 this.setState({
                     error_message    : 'error'   
                 });
                 Alert.alert('Error', 'Error Occured', [
                     {text: 'Okay'}
                 ]);
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
 
     setModalVisible = (val) => {
         this.setState({visible:val});
     }
 
     readGeneralNotif = (id) => {
         const formData = new FormData();
         formData.append('client_id', '1230');
         formData.append('client_secret', '1230NEJOUM1230');
         formData.append('customer_id', AuthContext.id);
         formData.append('notification_id', id);
         var Url  = AuthContext.server_url + "Nejoum_App/seenGeneralNotification";
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
 
                 return;
             }
             else {
                 return;
             }
         })
         .catch((error) => {
         });
         this.setState(previousState => ({
             activeModalIndex: previousState.activeModalIndex + 1,
         }));
         this.props.navigation.navigate("notificationAnnouncements");
         
     }
 
     readTowingNotif = (car_id, id, value) => {
         const inputText = this.state.inputText;
         const formData = new FormData();
         formData.append('client_id', '1230');
         formData.append('client_secret', '1230NEJOUM1230');
         formData.append('car_id', car_id);
         formData.append('response', value);
         formData.append('reject_message', inputText);
         formData.append('id', id);
         var Url  = AuthContext.server_url + "Nejoum_App/seenTowingNotif";
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
             if (response.success == 'success') {
                 return;
             }
             else {
                 return;
             }
         })
         .catch((error) => {
         });
         this.setState(previousState => ({
             activeModalIndex: previousState.activeModalIndex + 1,
         }));
     }
 
     _spring() {
         ToastAndroid.show('press again to close the app', ToastAndroid.SHORT);
         this.setState({countback: 1});
     }
 
     set_language = async() => {
         var lang = await AsyncStorage.getItem("lang");
         if(lang)
             I18n.locale = lang;
         else
             AsyncStorage.setItem("lang",I18n.locale);
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
       
 
     forgetUser = async () => {
         try { 
             await AsyncStorage.removeItem('loggedin');
             await AsyncStorage.removeItem('customer_id');
             await AsyncStorage.removeItem('server_url');
             await AsyncStorage.removeItem('lang');
             await AsyncStorage.removeItem('logged_id');
             await AsyncStorage.removeItem('name');
             await AsyncStorage.removeItem('type');
             await AsyncStorage.removeItem('username');
             } catch (error) {   // Error removing  
         }
         
         this.props.navigation.navigate("SignInScreen");
     };
 
     notifi = (props) => {
         PushNotification.localNotification({
             channelId:"MainChannel",
             //... You can use all the options from localNotifications
             message: "message.notification.body", // (required)
             date: new Date(Date.now() + 60 * 1000), // in 60 secs
             actions: '["open"]',
             allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
           });
     }
 
     getData = async() => {
         
         this.setState({
             loader          : true
         });
         const server_url = await AsyncStorage.getItem('server_url');
         const customer_id    = await AsyncStorage.getItem('logged_id');
         const formData = new FormData();
         formData.append('client_id', '1230');
         formData.append('client_secret', '1230NEJOUM1230');
         formData.append('customer_id', customer_id);
         console.log('fadsfsd'+customer_id);
         var Url  = AuthContext.server_url + "Nejoum_App/dashboardCount";
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
                 this.props.navigation.setParams({
                     notificationCount: response.notOpenednotif,
                 });
                 AuthContext.PermittedtoBLFiles      = response.PermittedtoBLFiles;
                 AuthContext.PermittedtoPricesFiles  = response.PermittedtoPricesFiles;
                 this.setState({
                     loader      : false,
                     allcount    : response.allcount,
                     cancelledCount   : response.cancelledCount,
                     news_bar: response.slide_bar,
                     news_bar_ar: response.slide_bar_ar,
                     new_cars        : response.count_cars,
                     towingCars      : response.towingCars,
                     warehouseCars   : response.warehouseCars,
                     loadingCars     : response.loadingCars,
                     shippingCars    : response.shippingCars,
                     uaePortCars     : response.uaePortCars,
                     storeCars       : response.storeCars,
                     post_page       : response.length,
                     sumBalance      : response.sumBalance,
                     phonenumber     : response.phonenumber,
                     generalNotification: response.GeneralNotification,
                     popupAnnouncement: response.towingCases.concat(response.popupAnnouncement),
                     towingCases: response.towingCases,
                     visible:(response.popupAnnouncement)?true:false
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
             this.setState({
                 loader      : false,
                 error_message    : error  
             });
             Alert.alert('Error', 'Connection Error', [
                 {text: 'Okay'}
             ]);
         });  
     }
 
     closeModal = () => {   
         this.setState(previousState => ({
           activeModalIndex: previousState.activeModalIndex + 1,
         }))
     }
 
     degToRad = (deg) => {
         return deg * Math.PI / 180;
     }
 
     onFinish = () => {
         this.setState({is_back: false,is_begin: false});
     }
 
     render(){
         if(this.state.loader){
             return(
                 <View>
                 <Loader loader={this.state.loader}></Loader></View>
             );
         }
         if(this.state.cancelledCount > 0){
             var cancelledCount =  <LinearGradient
                                         start={{x: 0.0, y: 0}} 
                                         end={{x: 1, y: 0}} 
                                         colors = {['#340000', '#B80D0D']}
                                         style={styles.linearGradient}>
                                                 <Text style={styles.redText}>{this.state.cancelledCount}
                                                 </Text>
                                 </LinearGradient>;
         }else {
             var cancelledCount = <View></View>;
         }
 
         if(this.state.allcount > 0){
             var allcount = <LinearGradient 
                                     start={{x: 0.0, y: 0}} 
                                     end={{x: 1, y: 0}} 
                                     colors = {['#fffef6', '#fffef6']}
                                     style={styles.linearGradientCircleopposite}>
                                             <Text style={styles.blueText2}>{this.state.allcount}
                                             </Text>
                                 </LinearGradient>;
         }else {
             var allcount = <View></View>;
         }
 
 
         var flatlist = '';
         if(this.state.dataSource && this.state.search != ''){
             flatlist= 
             <View style={{flexDirection:'row',flex:1, height:height*(this.state.dataSource.length/15), top:0,right:0,left:width*0.1, 
             marginTop:height*0.11, 
               position:'absolute', width: '80%',
                  zIndex: 1000, maxHeight: height*0.7,
                     backgroundColor: '#fff', borderBottomLeftRadius: 15, borderRadius:15,
                     borderBottomRightRadius: 15,  borderColor: '#dde7f3', justifyContent:'flex-start',alignItems:'center'}}>
                     <FlatList keyboardShouldPersistTaps='handled' data={this.state.dataSource} 
                             renderItem={({ item }) => (
                             <TouchableOpacity 
                             style={{flexDirection:'row', flex:1,textAlign:'left', justifyContent:'center', padding: '2%', 
                             color: '#0d2750'
                         ,BorderSize: 24, borderRadius:25}} 
                             activeOpacity={1} onPress = {() => this.props.navigation.navigate('CarTrackSearch', {'lot_vin': item})}>
                                 <Text style={{textAlign:'left', justifyContent:'center', padding: '2%', color: '#0d2750'}}>{item}</Text>
                             </TouchableOpacity>
                     )}
                     enableEmptySections={false} style={{ marginTop: 11 }}
                     keyExtractor={(item, index) => index.toString()}
                 />
             </View> 
         }
         else {
             flatlist = <View></View>;
         }
        
         const { activeModalIndex } = this.state;
         return (
             <ScrollView contentContainerStyle={[styles.container]}>
                 <View style={{backgroundColor:'#343D40'}}>
                         <View style={{flexDirection: 'row',  justifyContent:(I18n.locale == 'en')?'flex-start':'flex-end',}}>
                             <Text style={{fontSize: width*0.06, color:'#fff', marginTop:'3%', 
                             marginLeft:(I18n.locale == 'en')?'3%':0, marginRight:(I18n.locale == 'ar'?'3%':0)}}>
                                 {strings('main.good_day')} 
                             </Text>
                         </View>
                         <View style={{flexDirection: 'row', justifyContent:'center', alignItems:'center', margin:'3%'}}>
                             <SearchBar
                                 platform="ios"
                                 placeholder={strings("main.search_by")}
                                 value={this.state.search}
                                 onChangeText={text => this.SearchFilterFunction(text)} 
                                 onClear={text => this.SearchFilterFunction('')}
                                 containerStyle = {commonStyle.containerStyledashboard}
                                 inputContainerStyle = {commonStyle.inputContainerStyledashboard}
                                 searchIcon = {
                                     <View style={{flexDirection: 'row'}}>
                                         <Image
                                             source={require('../assets/images/homeIcons/search.png')}
                                             style={commonStyle.searchIcon}/>
                                     </View>
                                 }
                                 clearIcon = {
                                     <TouchableOpacity activeOpacity={1} onPress={() => this.SearchFilterFunction('')}>
                                         <View style={{flexDirection: 'row'}} >
                                             <FontAwesomeIcon
                                                 icon={ faX }
                                                 color="#ccc"
                                                 size={width*0.05}
                                             />
                                         </View>
                                     </TouchableOpacity>
                                 }
                             />
                         </View>
                 </View>
                 {flatlist}
             
         
             <SafeAreaView style={{flex:1, backgroundColor:'transparent', alignItems:'center', 
             flexDirection:'row', justifyContent:'center'}}>
                 {
                 (this.state.popupAnnouncement) ? this.state.popupAnnouncement.map((item, i) => activeModalIndex === i &&
                 <Modal
                     key={i}
                     isVisible={this.state.visible}
                     onBackdropPress={() => this.closeModal()}
                     style={styles.contentView}>
                     {(item.photo) ?
                     <View style={[styles.content, { backgroundColor: '#fff', borderTopWidth:16, borderTopColor: '#0093FF' }]}>
                     <View style={{ justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                         <View style={{ flexDirection: 'row', marginBottom:'3%' }}>
                             <Image
                                 resizeMode={'cover'}
                                 style={{
                                     width: 300,
                                     height: 150,
                                     borderRadius: 20
                                 }}
                                 source={{uri: item.photo}}/>
                         </View>
                         <View style={{ flexDirection: 'row' }}>
                             <Text style={{ fontSize: width * 0.06, color: '#013188', fontWeight: 'bold', textAlign:'center'}}>
                                 {this.state.popupAnnouncement ? I18n.locale == 'ar' ? item.subject_ar : item.subject_en : ''}
                             </Text></View>
                         <ScrollView contentContainerStyle={[styles.container]}>
                             <View style = {{  }}>
                                 <Text style={{}}>
                                     {item.year} {(item.carModelName.substr(0,item.carModelName.indexOf(' ')) != '')?
                                     item.carModelName.substr(0,item.carModelName.indexOf(' ')):item.carModelName} {item.carMakerName}
                                 </Text>
                                 <View style={{flexDirection:'row'}}>
                                     <Text style={{fontSize:10, color: 'rgb(23 96 178)'}}>Lot # </Text>
                                     <Text style={{fontSize:10, color: 'rgb(23 96 178)'}}>
                                         {item.lotnumber}
                                     </Text>
                                 </View>
                                 <View style={{flexDirection:'row'}}>
                                     <Text style={{fontSize:10, color: 'rgb(23 96 178)'}}>VIN # </Text>
                                     <Text style={{fontSize:10, color: 'rgb(23 96 178)'}}>
                                         {item.vin}
                                     </Text>
                                 </View>
                                 <Text style={{
                                     fontSize: width * 0.03,
                                     color: '#013188',
                                     marginTop: '4%',
                                     justifyContent: 'center',
                                     alignItems: 'center',
                                     textAlign: 'center'
                                 }}>
                                     {this.state.popupAnnouncement ? I18n.locale == 'ar' ? item.message_ar : item.message : ''}
                                 </Text>
                                 <Text style = {{
                                     fontSize: width * 0.025,
                                     color: '#A30000',
                                     justifyContent: 'center',
                                     alignItems: 'center',
                                     textAlign: 'center',
                                     marginTop:'1%'
                                 }}> {strings('main.please_response')} {item.response_time} {item.response_time_unit}</Text>
                             </View>
                         </ScrollView>
                     </View>
                     {item.ableToresponse == 0?
                     <View style={{flexDirection:'column'}}>
                         <View style={{flexDirection:'row'}}>
                         <TextInput
                                 value={this.state.inputText}
                                 onChangeText={(value) => this.setState({inputText: value})}
                                 placeholder="Enter text here"
                                 style={styles.input}
                                 placeholderTextColor="#999"
                             />
                         </View>
                     <View style={{flexDirection:'row', justifyContent:'center'}}>
                     <TouchableOpacity activeOpacity={1} style={{
                         flexDirection: "row",
                         backgroundColor: '#fff',
                         justifyContent: 'center',
                         alignItems: 'center',
                         borderColor: '#0B9A21',
                         borderRadius: 5,
                         borderWidth: 2,
                         width: '40%', backgroundColor: '#0B9A21', padding:5, marginLeft:'3%', marginRight:'5%'}}
                         onPress={() => this.readTowingNotif(item.car_id, item.id, 1)}>
                         <Text style={[commonStyle.buttonText, { color: '#fff' }]}>
                             {strings('main.approve')}
                         </Text>
                     </TouchableOpacity>
                     <TouchableOpacity activeOpacity={1} style={{
                         flexDirection: "row",
                         backgroundColor: '#fff',
                         justifyContent: 'center',
                         alignItems: 'center',
                         borderColor: '#A30000',
                         borderRadius: 5,
                         borderWidth: 2,
                         width: '40%', backgroundColor: '#A30000', padding:5,marginLeft:'3%', marginRight:'5%'
                     }}
                     onPress={() => this.readTowingNotif(item.car_id, item.id, 3)}>
                         <Text style = {[commonStyle.buttonText, { color: '#fff' }]}>
                             {strings('main.reject')}
                         </Text>
                     </TouchableOpacity>
                 </View></View> :
                 <View style={{flexDirection:'column', justifyContent:'center'}}>
                     <TouchableOpacity activeOpacity={1} style={{
                         flexDirection: "row",
                         backgroundColor: '#fff',
                         justifyContent: 'center',
                         alignItems: 'center',
                         borderColor: '#0093FF',
                         borderRadius: 5,
                         borderWidth: 2,
                         width: '60%', backgroundColor: '#0093FF', padding:5
                     }}
                     onPress={() => this.readTowingNotif(item.car_id, item.id, 2)}>
                         <Text style={[commonStyle.buttonText, { color: '#fff' }]}>
                             {strings('main.car_already_towed')}
                         </Text>
                     </TouchableOpacity>
                 </View>}
                 </View>:(item.priority == '3') ?
                         <View style={[styles.content, { backgroundColor: '#fff', borderTopWidth:16, borderTopColor: '#a30000' }]}>
                             <View style={{ justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                                 <View style={{ flexDirection: 'row' }}>
                                     <Image
                                     resizeMode={'contain'}
                                     style={styles.tinyLogo}
                                     source={require('../assets/images/report_black_24dp.png')}
                                     />
                                 </View>
                                 <View style={{ flexDirection: 'row' }}>
                                     <Text style={{ fontSize: width * 0.06, color: '#013188', fontWeight: 'bold', textAlign:'center' }}>
                                         {this.state.popupAnnouncement ? I18n.locale == 'ar' ? item.subject_ar : item.subject : ''}
                                     </Text></View>
                                 <ScrollView contentContainerStyle={[styles.container]}>
                                     <View style={{ marginTop: '10%' }}>
                                         <Text style={{
                                             fontSize: width * 0.03,
                                             color: '#013188',
                                             justifyContent: 'center',
                                             alignItems: 'center',
                                             textAlign: 'center'
                                         }}>
                                             {this.state.popupAnnouncement ? I18n.locale == 'ar' ? item.notification_text_ar : item.notification_text : ''}
                                         </Text>
                                     </View>
                                 </ScrollView>
                             </View>
                             <TouchableOpacity activeOpacity={1} style={{
                                 flexDirection: "row",
                                 backgroundColor: '#fff',
                                 justifyContent: 'center',
                                 alignItems: 'center',
                                 borderColor: '#0093FF',
                                 borderRadius: 5,
                                 borderWidth: 2,
                                 width: '40%', backgroundColor: '#0093FF', padding:5
                             }}
                                             onPress={() => this.readGeneralNotif(item.id)}>
                                 <Text style={[commonStyle.buttonText, { color: '#fff' }]}>
                                     {strings('main.ok')}
                                 </Text>
                             </TouchableOpacity>
                         </View> :
                         (item.priority == '2') ?
                         <View style={[styles.content, { backgroundColor: '#fff', borderTopWidth:16, borderTopColor: '#ffb100' }]}>
                             <View
                                 style={{ justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                                 <View style={{ flexDirection: 'row' }}>
                                     <Image
                                         resizeMode={'contain'}
                                         style={styles.tinyLogo}
                                         source={require('../assets/images/Report_Yellow.png')}
                                     />
                                 </View>
                                 <View style={{ flexDirection: 'row' }}>
                                     <Text style={{ fontSize: width * 0.06, color: '#013188', fontWeight: 'bold', textAlign:'center' }}>
                                         {this.state.popupAnnouncement ? I18n.locale == 'ar' ? item.subject_ar : item.subject : ''}
                                     </Text></View>
                                 <ScrollView contentContainerStyle={styles.container}>
                                     <View style={{ marginTop: '10%' }}>
                                         <Text style={{
                                             fontSize: width * 0.03,
                                             color: '#013188',
                                             justifyContent: 'center',
                                             alignItems: 'center',
                                             textAlign: 'center'
                                         }}>
                                             {this.state.popupAnnouncement ? I18n.locale == 'ar' ? item.notification_text_ar : item.notification_text : ''}
                                         </Text>
                                     </View>
                                 </ScrollView>
                             </View>
                             <TouchableOpacity activeOpacity={1} style={{
                                 flexDirection: "row",
                                 backgroundColor: '#fff',
                                 justifyContent: 'center',
                                 alignItems: 'center',
                                 borderColor: '#0093FF',
                                 borderRadius: 5,
                                 borderWidth: 2,
                                 width: '40%', backgroundColor: '#0093FF', padding:5
                             }}
                                                 onPress={() => this.readGeneralNotif(item.id)}>
                                 <Text style={[commonStyle.buttonText, { color: '#fff' }]}>
                                     {strings('main.ok')}
                                 </Text>
                             </TouchableOpacity>
                         </View> :
                         <View style={[styles.content, { backgroundColor: '#fff', borderTopWidth:16, borderTopColor: '#0093FF' }]}>
                             <View
                                 style={{ justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                                 <View style={{ flexDirection: 'row' }}>
                                     <Image
                                         resizeMode={'contain'}
                                         style={styles.tinyLogo}
                                         source={require('../assets/images/campaign_FILL0_wght300_GRAD0_opsz48.png')}
                                     />
                                 </View>
                                 <View style={{ flexDirection: 'row' }}>
                                     <Text style={{ fontSize: width * 0.06, color: '#013188', fontWeight: 'bold', textAlign:'center' }}>
                                         {this.state.popupAnnouncement ? I18n.locale == 'ar' ? item.subject_ar : item.subject : ''}
                                     </Text></View>
                                 <ScrollView contentContainerStyle={styles.container}>
                                     <View style={{ marginTop: '10%' }}>
                                         <Text style={{
                                             fontSize: width * 0.03,
                                             color: '#013188',
                                             justifyContent: 'center',
                                             alignItems: 'center',
                                             textAlign: 'center'
                                         }}>
                                             {this.state.popupAnnouncement ? I18n.locale == 'ar' ? item.notification_text_ar : item.notification_text : ''}
                                         </Text>
                                     </View>
                                 </ScrollView>
                             </View>
                                 <TouchableOpacity activeOpacity={1} style={{
                                     flexDirection: "row",
                                     backgroundColor: '#fff',
                                     justifyContent: 'center',
                                     alignItems: 'center',
                                     borderColor: '#0093FF',
                                     borderRadius: 5,
                                     borderWidth: 2,
                                     width: '40%', backgroundColor: '#0093FF', padding:5
                                 }}
                                                 onPress={() => this.readGeneralNotif(item.id)}>
                                 <Text style={[commonStyle.buttonText, { color: '#fff' }]}>
                                     {strings('main.ok')}
                                 </Text>
                             </TouchableOpacity>
                         </View>}
 
                 </Modal>
                 ) : <View></View>}
             
                 <View style = {styles.container}>
                         
                     <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:'3%', marginBottom:'3%',backgroundColor:'#fff'}}>
                         <LinearGradient 
                             start={{x: 0.0, y: 0}} 
                             end={{x: 1, y: 0}} 
                             colors = {['#EDEDED', '#EDEDED']}>
                                 <View style = {{ flexDirection: 'row', justifyContent: 'center', alignItems:'center', 
                                             borderBottomLeftRadius:25, borderBottomRightRadius:25,}}>
                                             {I18n.locale == 'ar'?(
                                         <TextTicker
                                      style={[commonStyle.fontsizeGlobal, {fontSize:15, color: '#343D40', 
                                      padding: 15, textAlign: 'right', borderRadius:25  }]}
                                         loop
                                         scrollSpeed={100}
                                         repeatSpacer={20}
                                         bounceSpeed={10000}
                                         marqueeDelay={1000}
                                         isRTL
                                         useNativeDriver={true}
                                         >
                                         {this.state.news_bar_ar}
                                 </TextTicker>):( <TextTicker
                                                     style={[commonStyle.fontsizeGlobal, {fontSize:15, color: '#343D40', 
                                                     padding: 15, textAlign: 'left', borderRadius:25  }]}
                                                     loop
                                                     scrollSpeed={100}
                                                     repeatSpacer={20}
                                                     bounceSpeed={10000}
                                                     marqueeDelay={1000}
                                                     useNativeDriver={true}>
                                                     {this.state.news_bar}
                                             </TextTicker>)    
                                         } 
                                 </View>
                         </LinearGradient>
                     </View>
 
                         <View style={{ flexDirection:'row', justifyContent:'center', backgroundColor:'#fff'}}>
                             
                             <View style={{flex:0.24,  justifyContent:'center',  alignItems:'center'}}>
                                 <TouchableOpacity
                                             onPress = {() => this.props.navigation.navigate('allCars')}
                                             style={[{justifyContent:'center', alignItems:'center', height:height*0.09, 
                                             
                                             borderRadius:5,
                                             width:'90%',
                                              
                                             }]}>
                                     <Animatable.View
                                         animation="zoomIn" 
                                         style={[commonStyle.iconsdashboardTop,{
                                             justifyContent:'center', flex:1, width:'100%', alignItems:'center'}]}
                                         duration = {2000}>
                                             <Image
                                                 source={require('../assets/images/homeIcons/Car.png')}
                                                 resizeMode={"contain"}
                                                 style={styles.image3d}
                                             />
                                     </Animatable.View>
                                 </TouchableOpacity>
                                 <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                                     <Text style={[commonStyle.fontsizeGlobal, 
                                         { margin:5, color: '#013188', fontSize:(I18n.locale == 'en')?width*0.04:width*0.035, textAlign:'center'}]}>
                                             {strings('main.my_cars')}</Text>
                                 </View>
                             </View>
                             <View style={{flex:0.24,  justifyContent:'center',  alignItems:'center'}}>
                                 <TouchableOpacity
                                             onPress = {() => this.props.navigation.navigate('navigAccount2', {"sumBalance": this.state.sumBalance})}
                                             style={{justifyContent:'center', alignItems:'center', height:height*0.09, borderRadius:5,
                                             width:'90%', 
                                             }}>
                                     <Animatable.View 
                                         animation="zoomIn" 
                                         style={[commonStyle.iconsdashboardTop,{
                                             justifyContent:'center', flex:1, width:'100%', alignItems:'center'}]}
                                         duration = {1500}>
                                                 <Image
                                                     source={require('../assets/images/homeIcons/Statement.png')}
                                                     resizeMode={"contain"}
                                                     style={styles.image3d}
                                                 />
                                     </Animatable.View>          
                                     
                                 </TouchableOpacity>
                                 <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                                     <Text style={[commonStyle.fontsizeGlobal, 
                                         { margin:5, color: '#013188', fontSize:(I18n.locale == 'en')?width*0.04:width*0.035, textAlign:'center',
                                         
                                         }]}>
                                             {strings('main.statement')}</Text>
                                 </View>
                             </View>
                             <View style={{ flex:0.24, justifyContent:'center', alignItems:'center'}}>
                                     <TouchableOpacity
                                             onPress = {() => this.props.navigation.navigate('priceFiles')}
                                             style={{justifyContent:'center', alignItems:'center', height:height*0.09, borderRadius:5,
                                             width:'90%',
                                            }}
                                             >
                                             <Animatable.View
                                                 animation="zoomIn" 
                                                 style={[commonStyle.iconsdashboardTop,{
                                                     justifyContent:'center', flex:1, width:'100%', alignItems:'center'}]}
                                                 duration = {1000}>
                                                 <Image
                                                     source={require('../assets/images/homeIcons/Price_list.png')}
                                                     resizeMode={"contain"}
                                                     style={styles.image3d}
                                                 />
                                             </Animatable.View>
                                     </TouchableOpacity>
                                     <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                                         <Text style={[commonStyle.fontsizeGlobal, {color: '#013188',margin:5,
                                             fontSize:(I18n.locale == 'en')?width*0.04:width*0.035, textAlign:'center'}]}>{strings('main.prices_list')}</Text>
                                     </View>
                             </View>
 
                             <View style={{ flex:0.24, justifyContent:'center', alignItems:'center'}}>
                                     <TouchableOpacity
                                             onPress={() => this.props.navigation.navigate("notificationAnnouncements")}
                                             style={[{
                                                 justifyContent:'center', alignItems:'center', height:height*0.09, borderRadius:5,
                                             width:'90%',
                                            }]}
                                             >
                                             {
                                                 (this.props.route.params)?
                                             (this.props.route.params.notificationCount > 99 )?(
                                                 <View style={{position:'absolute', left:-15, top:-10,zIndex:10}}>
                                                         <Badge value="99+" 
                                                         textStyle={[commonStyle.fontsizeGlobal], {fontSize: width*0.025}}
                                                         badgeStyle={[commonStyle.badgeStyle], {backgroundColor: 'red',}} >
                                                         </Badge>
                                                     </View>):
                                                 (this.props.route.params.notificationCount > 0 )?(
                                                     <View style={{position:'absolute', left:-10, top:-1,zIndex:10}}>
                                                     <Badge value={this.props.route.params.notificationCount} 
                                                         textStyle={[commonStyle.fontsizeGlobal], {fontSize: width*0.025}}
                                                         badgeStyle={[commonStyle.badgeStyle], 
                                                         { backgroundColor: 'red',}} >
                                                     </Badge>
                                                     </View>
                                                 ):(
                                                     <View></View>
                                                 )
                                             :<View></View>}
                                             <Animatable.View 
                                                 animation="zoomIn" 
                                                 style={[commonStyle.iconsdashboardTop,{
                                                     justifyContent:'center', flex:1, width:'100%', alignItems:'center'}]}
                                                 duration = {500}>
                                                 <Image
                                                     source={require('../assets/images/homeIcons/Notification.png')}
                                                     resizeMode={"contain"}
                                                     style={styles.image3d}
                                                 />
                                             </Animatable.View>
                                     </TouchableOpacity>
                                     <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                                         <Text style={[commonStyle.fontsizeGlobal, {margin:5,fontSize:(I18n.locale == 'en')?width*0.04:width*0.035,
                                              color: '#013188', textAlign:'center'}]}>{strings('main.updates')}</Text>
                                     </View>
                             </View>
                         </View>
 
                         <View style={{flex:1, backgroundColor:'#EDEDED', }}>
                             <View style={{
                                 flexDirection: (I18n.locale === 'ar') ? 'row-reverse' : 'row',
                                 alignItems: 'center',
                                 margin:'3%',
                                 justifyContent: 'space-between',}}>
                                 <View style={{flex:2,
                                     paddingLeft: (I18n.locale === 'ar')?0:'3%',
                                     paddingRight: (I18n.locale === 'ar')?'3%':0}}>
                                     <Text style={{fontSize: width*0.06, fontWeight: '400', textAlign:(I18n.locale === 'ar')?
                                     'right':'left',
                                      color: '#343D40'}}>
                                         {strings('main.all_your_car')}
                                     </Text>
                                 </View>
                                 <View style={{flex:1, 
                                     paddingLeft: (I18n.locale === 'ar')?0:'3%',
                                     paddingRight: (I18n.locale === 'ar')?'3%':0, alignItems:'flex-end'}}>
                                 <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate("AddCars")}>
                                     <FontAwesomeIcon 
                                         icon={faPlusCircle}
                                         color="#0093FF"
                                         size={width*0.08}
                                     />
                                 </TouchableOpacity>
                                 </View>
                             </View>
                             <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center', marginBottom:'2%'}}>
                                 <TouchableOpacity
                                         onPress = {() => this.props.navigation.navigate('trackDetails',
                                          {type: "new", titltePage: strings('car.new_cars'), count:this.state.new_cars})}>
                                             <Animatable.View duration = {2000} style={
                                                 [commonStyle.iconsdashboard, {marginLeft:'5%'}]}>
                                                 {
                                                     (this.state.new_cars > 0 )?(
                                                         <View style={{position:'absolute', left:width*0.26, top:height*0.02, zIndex: 99999}}>
                                                             {this.state.new_cars <= 999?<Badge value={this.state.new_cars} 
                                                             textStyle={commonStyle.fontsizeGlobalSmall}
                                                              badgeStyle={[commonStyle.badgeStyle, {backgroundColor: '#ffa300'}]} >
                                                             </Badge>:<Badge value={'999+'} textStyle={commonStyle.fontsizeGlobalSmall} 
                                                                 badgeStyle={[commonStyle.badgeStyle, {backgroundColor: '#ffa300'}]}>
                                                                     </Badge>}
                                                         </View>
                                                     ):(
                                                         <View></View>
                                                     )
                                                 }
                                                 <Image
                                                     resizeMode={"contain"}
                                                     source={require('../assets/images/homeIcons/new_car.png')}
                                                     style={commonStyle.smallIcons}
                                                 />
                                                 <Text style={commonStyle.redgradientTextHome}>{strings('car.new_cars')}</Text>
                                             </Animatable.View>
                                 </TouchableOpacity>
                                 <TouchableOpacity
                                         onPress = {() => this.props.navigation.navigate('trackDetails', {type: "towing", 
                                         titltePage: strings('car.towing'), count:this.state.towingCars})}>
                                             <Animatable.View duration = {2000} style={[commonStyle.iconsdashboard,{marginRight:'2%'
                                            
                                             }]}>
                                                 {
                                                     (this.state.towingCars > 0 )?(
                                                         <View style={{position:'absolute', left:width*0.26, top:height*0.02, zIndex: 99999}}>
                                                             {this.state.towingCars <= 999?<Badge value={this.state.towingCars} textStyle={commonStyle.fontsizeGlobalSmall}
                                                             badgeStyle={[commonStyle.badgeStyle, {backgroundColor: '#ffa300'}]}>
                                                             </Badge>:<Badge value={'999+'} textStyle={commonStyle.fontsizeGlobalSmall} 
                                                                 badgeStyle={[commonStyle.badgeStyle, {backgroundColor: '#ffa300'}]}></Badge>}
                                                         </View>
                                                     ):(
                                                         <View></View>
                                                     )
                                                 }
                                                 <Image
                                                     resizeMode={"contain"}
                                                     source={require('../assets/images/homeIcons/Towing.png')}
                                                     style={commonStyle.smallIcons}
                                                 />
                                                 <Text style={commonStyle.redgradientTextHome}>{strings('car.towing')}</Text>
                                             </Animatable.View>
                                 </TouchableOpacity>
                             </View>
                             <View style={{marginBottom:'2%', flex:1, flexDirection:'row',  justifyContent:'center', alignItems:'center'}}>  
                                     <TouchableOpacity
                                             onPress = {() => this.props.navigation.navigate('trackDetails', {type: "warehouse", 
                                             titltePage: strings('car.warehouse'), valuesData: [],  count:this.state.warehouseCars})}>
                                                 <Animatable.View duration = {2000} style={[commonStyle.iconsdashboard,
                                                 {marginLeft:'5%'}]}>
                                                     {
                                                         (this.state.warehouseCars > 0 )?(
                                                             <View style={{position:'absolute', left:width*0.26, top:height*0.02, zIndex: 99999}}>
                                                                 {this.state.warehouseCars <= 999?<Badge value={this.state.warehouseCars} textStyle={commonStyle.fontsizeGlobalSmall}
                                                                 badgeStyle={[commonStyle.badgeStyle, {backgroundColor: '#ffa300'}]}></Badge>
                                                                 :<Badge value={'999+'} textStyle={commonStyle.fontsizeGlobalSmall} 
                                                                 badgeStyle={[commonStyle.badgeStyle, {backgroundColor: '#ffa300'}]}></Badge>}</View>
                                                         ):(
                                                             <View></View>
                                                         )
                                                     }
                                                     <Image
                                                         resizeMode={"contain"}
                                                         source={require('../assets/images/homeIcons/warehouse.png')}
                                                         style={commonStyle.smallIcons}
                                                     />
                                                     <Text style={commonStyle.redgradientTextHome}>{strings('car.warehouse')}</Text>
                                                 </Animatable.View>
                                     </TouchableOpacity>
                                     <TouchableOpacity
                                             onPress = {() => this.props.navigation.navigate('trackDetails', {type: "shipping", 
                                             titltePage: strings('car.shipping'), count:this.state.shippingCars})}>
                                                 <Animatable.View  duration = {2000} style={[commonStyle.iconsdashboard, {marginRight:'2%'}]}>
                                                     {
                                                         (this.state.shippingCars > 0 )?(
                                                             <View style={{position:'absolute', left:width*0.26, top:height*0.02, zIndex: 99999}}>
                                                                 {this.state.shippingCars <= 999? <Badge value={this.state.shippingCars}
                                                                  textStyle={commonStyle.fontsizeGlobalSmall} 
                                                                 badgeStyle={[commonStyle.badgeStyle, {backgroundColor: '#ffa300'}]}></Badge>:
                                                                 <Badge value={'999+'} textStyle={commonStyle.fontsizeGlobalSmall} 
                                                                 badgeStyle={[commonStyle.badgeStyle, {backgroundColor: '#ffa300'}]}></Badge>}
                                                                </View>
                                                         ):(
                                                             <View></View>
                                                         )
                                                     }
                                                     <Image
                                                         resizeMode={"contain"}
                                                         source={require('../assets/images/homeIcons/shipping.png')}
                                                         style={commonStyle.smallIcons}
                                                     />
                                                     <Text style={commonStyle.redgradientTextHome}>{strings('car.shipping')}</Text>
                                                 </Animatable.View> 
                                     </TouchableOpacity>
                             </View>
                             <View style={{marginBottom:'2%',flex:1, width:'100%', flexDirection:'row',justifyContent:'center', alignItems:'center'}}>
                                 
                                 <TouchableOpacity
                                         onPress = {() => this.props.navigation.navigate('trackDetails', {type: "port", 
                                         titltePage: strings('car.port'), count:this.state.uaePortCars})}>
                                             <Animatable.View duration = {2000} style={[commonStyle.iconsdashboard, {marginLeft:'5%'}]}>
                                                 {
                                                     (this.state.uaePortCars > 0 )?(
                                                         <View style={{position:'absolute', left:width*0.26, top:height*0.02, zIndex: 99999}}>
                                                              {this.state.uaePortCars <= 999? <Badge value={this.state.uaePortCars}
                                                             textStyle={commonStyle.fontsizeGlobalSmall}
                                                              badgeStyle={[commonStyle.badgeStyle, {backgroundColor: '#ffa300'}]}></Badge>
                                                              :
                                                                 <Badge value={'999+'} textStyle={commonStyle.fontsizeGlobalSmall} 
                                                                 badgeStyle={[commonStyle.badgeStyle, {backgroundColor: '#ffa300'}]}></Badge>}</View>
                                                     ):(
                                                         <View></View>
                                                     )
                                                 }
                                                 <Image
                                                     resizeMode={"contain"}
                                                     source={require('../assets/images/homeIcons/Port.png')}
                                                     style={commonStyle.smallIcons}
                                                 />
                                                 <Text style={commonStyle.redgradientTextHome}>{strings('car.port')}</Text>
                                             </Animatable.View>
                                 </TouchableOpacity>
 
                                 <TouchableOpacity
                                         onPress = {() => this.props.navigation.navigate('trackDetails', {type: "store", 
                                                 titltePage: strings('car.store'), count:this.state.storeCars})}>
                                             <Animatable.View  duration = {2000} style={[commonStyle.iconsdashboard, {marginRight:'2%'}]}>
                                                 {
                                                     (this.state.storeCars > 0 )?(
                                                         <View style={{position:'absolute', left:width*0.26, top:height*0.02, zIndex: 99999}}>
                                                             {this.state.storeCars <= 999? <Badge value={this.state.storeCars} 
                                                             textStyle={commonStyle.fontsizeGlobalSmall}
                                                             badgeStyle={[commonStyle.badgeStyle, {backgroundColor: '#ffa300'}]}></Badge>
                                                             :
                                                                 <Badge value={'999+'} textStyle={commonStyle.fontsizeGlobalSmall} 
                                                                 badgeStyle={[commonStyle.badgeStyle, {backgroundColor: '#ffa300'}]}></Badge>}</View>
                                                     ):(
                                                         <View></View>
                                                     )
                                                 }
                                                 <Image
                                                     resizeMode={"contain"}
                                                     source={require('../assets/images/homeIcons/check2.png')}
                                                     style={commonStyle.smallIcons}
                                                 />
                                                 <Text style={[commonStyle.redgradientTextHome, {color:'#0B9A21'}]}>
                                                     {strings('car.arrival')}
                                                 </Text>
                                             </Animatable.View>
                                 </TouchableOpacity>
                             </View>
                         </View>
                         </View></SafeAreaView></ScrollView>
         )
     }
 }
 
 //export default Dashboard
 
 
 
 const styles = StyleSheet.create({
     container: {
        flexGrow: 1,
        backgroundColor: '#fff',
       /**justifyContent: 'center',
       alignItems: 'center',
       /**backgroundColor: '#ebebeb',
       margin: 10,**/
     },
     rowContainer: {
         flexDirection: 'row',
         justifyContent: 'center',
         alignItems: 'center'
     },
     text: {
       color: '#101010',
       fontSize: 24,
       fontWeight: 'bold'
     },
     linearGradient: {
         flex: 1,
         position: 'absolute',
         left: -5,
         top: -5,
         borderBottomRightRadius: 20,
         /**paddingLeft: 15,
         paddingRight: 15,
         borderRadius: 5**/
     },
     linearGradientCircle: {
         zIndex: 1000,
         position: 'absolute',
         borderBottomRightRadius: 10,
         borderBottomLeftRadius: 10,
         borderTopRightRadius: 10,
         flex: 1,
         left: '10%',
         top: '40%',
 
     },
     linearGradientCircleopposite: {
         zIndex: 1000,
         position: 'absolute',
         borderBottomRightRadius: 10,
         borderBottomLeftRadius: 10,
         borderTopRightRadius: 10,
         flex: 1,
         left: -5,
         top: -5,
 
     },
     buttonText: {
         fontSize: 15,
         textAlign: 'center',
         margin: 10,
         color: '#0d5db8',
         backgroundColor: 'transparent',
     },
     rowView: {
         flexDirection: 'row',
     },
     ImageIconStyle: {
         padding: 10,
         margin: 5,
         height: 50,
         width: 50,
         resizeMode: 'stretch',
     },
     horizontalSlider : {
         flex: 1,
         flexDirection: 'column',
     },
     sliderView : {
         alignItems: 'center',
         width: 90,
         borderRadius: 10,
         borderWidth: 1,
         borderColor: 'grey',
         margin: 4
     },
     ImageIconStyleup : {
         width: 150,
         height: 80,
         resizeMode: 'stretch',
     },
     buttonTextup: {
         fontSize: 15,
         fontFamily: 'Gill Sans',
         textAlign: 'center',
         marginTop: 2,
         color: '#000',
         backgroundColor: 'transparent',
     },image: {
         flex: 1,
         resizeMode: "cover",
         width: '100%',
         justifyContent: "center",
         borderTopRightRadius: 40,
         borderBottomLeftRadius: 40
     },
     image3d: {
         width: height*0.05,
         height: height*0.05,
         resizeMode: "contain",
     },
     redText: {
         left: 0,
         zIndex: 1,
         right: 0,
         top: 0,
         borderBottomRightRadius: 15,
         margin: 0,
         fontSize: 15,
         padding: 10,
         color: '#ffff',
     },
     imagerowView: {
         flex: 1,
         resizeMode: "cover",
         width: '100%',
         justifyContent: "center",
         borderTopRightRadius: 40,
         borderBottomLeftRadius: 40
     },
     rowContainerImg: {
         flex: 1,
         margin: 20,
         flexDirection: 'row',
         justifyContent: 'flex-end',
         alignItems: 'center'
     },
     rowContainerImgopposit: {
         flex: 1,
         margin: 20,
         flexDirection: 'row',
         justifyContent: 'flex-start',
         alignItems: 'center',
         
     },
     ImageIconStyleImg: {
         resizeMode: 'stretch',
     },
     blueText: {
         left: 0,
         zIndex: 1,
         right: 0,
         top: 0,
         borderBottomRightRadius: 15,
         margin: 0,
         fontSize: 20,
         padding: 5,
         color: '#ffff',
     },
     blueText2: {
         left: 0,
         zIndex: 1,
         right: 0,
         top: 0,
         borderBottomRightRadius: 15,
         margin: 0,
         fontSize: 15,
         padding: 5,
         color: '#1c3e64',
     },
     
     blueTextoverlay: {
         position: 'absolute',
         zIndex: 1000,
         bottom: 0,
         padding: 10,
         color: '#fff',
         fontSize: 18,
     },
     blueTextoverlayopposite: {
         position: 'absolute',
         zIndex: 1000,
         bottom: 0,
         padding: 10,
         right: 0,
         color: '#fff',
         fontSize: 20,
     },
     overflowgrey: {
         position: 'absolute',
         bottom:0,
         backgroundColor: 'transparent',
         borderStyle: 'solid',
         borderRightWidth: 250,
         borderBottomWidth: 100,
         borderLeftColor: 'transparent',
         borderRightColor: 'transparent',
         borderBottomColor: 'rgba(0, 0, 0, 0.5)', 
         zIndex: 900
     },
     overflowgreyopposite: {
         position: 'absolute',
         bottom:0,
         right:0,
         backgroundColor: 'transparent',
         borderStyle: 'solid',
         borderLeftWidth: 210,
         borderBottomWidth: 70,
         borderLeftColor: 'transparent',
         borderRightColor: 'transparent',
         borderBottomColor: 'rgba(0, 0, 0, 0.2)', 
         zIndex: 900
     },
     fab: {
         position: 'absolute',
         margin: 16,
         right: 0,
         zIndex: 1000,
         backgroundColor: '#1c3e64',
         bottom: height-650,
     },
     overlaystyle: {
         flex: 0.5,
         width: '100%',
         height: '100%',
         justifyContent: 'center',
         backgroundColor: '#434484',
         opacity: 0.9
     },
     modals: {
         width: 300,
         height: 200,
         flex: 0.3,
         borderBottomLeftRadius: 20,
         borderRadius: 25,
         justifyContent: 'center',
         alignItems: 'center'
     },
     userInfoTopSection: {
         borderBottomLeftRadius: 100,
         backgroundColor: '#013188'
     },
     smallModal: {
         backgroundColor:'red',
         flexDirection: 'column',
         justifyContent: 'center',
         alignItems: 'center',
     },
     contentView: {
         justifyContent: 'center',
         margin: 0,
     },
     content:{
         flex:0.7,
         margin: width*0.02,
         backgroundColor: '#80ced6',
         padding: 22,
         justifyContent: 'center',
         alignItems: 'center',
         borderRadius: 17,
     },
     tinyLogo: {
         width: 100,
         height: 100,
         borderTopRightRadius: 20,
         borderBottomLeftRadius: 20
     },
     alertContainer: {
         backgroundColor: 'white',
         padding: 20,
         borderRadius: 10,
         alignItems: 'center',
       },
       input: {
         width: '100%',
         height: 40,
         borderWidth: 1,
         borderColor: '#ccc',
         borderRadius: 5,
         padding: 10,
         marginBottom: 10,
       },
       confirmButton: {
         backgroundColor: '#0B9A21',
       },
       cancelButton: {
         backgroundColor: '#A30000',
       },
       button: {
         backgroundColor: '#EDEDED',
         padding: 10,
         borderRadius: 5,
         marginTop: 10,
         minWidth: 150,
         alignItems: 'center',
       },
       buttonText22: {
         color: 'white',
         fontWeight: 'bold',
       },
 });