import React, {Component} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Platform,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  DevSettings,
  TouchableWithoutFeedback
} from 'react-native';

import { Badge } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import doPayment from '../src/doPayment.js';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyTabBar from '../components/MyTabBar.js';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Dashboard from '../src/Dashboard.js';
import SignInScreen   from '../src/SignInScreen.js';
import carforSale from '../src/carforSale.js';
import I18n from 'react-native-i18n';
import { strings } from '../locals/i18n';
import { SearchBar } from 'react-native-elements';
import cancelledCars from '../src/CancelledCars.js';
import statement from '../src/Statement.js';
import { AuthContext } from '../components/context';
import carTrack from '../src/CarTrack.js';
import CarTrackSearch from '../src/CarTrackSearch.js';
import aboutCompany from '../src/AboutCompany.js';
import BranchesCompany from '../src/BranchesCompany.js';
import contactCompany from '../src/ContactusCompany.js';
import wyouloggin from '../src/wyouloggin.js';
import MyRequests from '../src/MyRequests.js';
import MyAuthorizedRequests from '../src/MyAuthorizedRequests.js';
import AddAuthorizedRequests from '../src/AddAuthorizedRequests.js';
import priceLists from '../src/priceLists.js';
import priceFiles from '../src/priceFiles.js';
import LinearGradient from 'react-native-linear-gradient';
import carImagesNavigator from '../src/carImagesNavigator';
import trackDetails from '../src/trackDetails.js';
import allCars from '../src/allCars.js';
import imagesSlider from '../src/imagesSlider';
import navigAccount from '../src/navigAccount.js';
import navigAccount2 from '../src/navigAccount2.js';
import generalStatement from '../src/generalStatement.js';
import statementDetails from '../src/statementDetails.js';
import carforSaleSlider from '../src/carforSaleSlider';
import bookmarksCars from '../src/bookmarksCars';
import carDetails2 from '../src/carDetails2.js';
import commonStyle from '../assets/style/styles.js';
import debitCarsStatement from '../src/debitCarsStatement.js';
import carsInAuctions from '../src/carsInAuctions.js';
import notPaidinauctions from '../src/notPaidinauctions.js';
import generalunpaidstmt from '../src/generalunpaidstmt.js';
import shippedcarsstmt from '../src/shippedcarsstmt.js';
import AsyncStorage from '@react-native-community/async-storage';
import profile from '../src/profile.js';
import notification from '../src/notification';
import priceFilesViewer from '../src/priceFilesViewer.js';
import shippingCalculator from '../src/shippingCalculator.js';
//import analytics from '@react-native-firebase/analytics';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import notificationGeneral from '../src/notificationGeneral.js';
import gneralstatementPDF from '../src/gneralstatementPDF.js';
import inauctionsDetailsstmt from '../src/inauctionsDetailsstmt.js';
import shippingCostDetailsStmt from '../src/shippingCostDetailsStmt.js';
import billFilesViewer from '../src/billFilesViewer.js';
import activateAdminAccess from '../src/activateAdminAccess.js';	
import notificationAnnouncements from '../src/notificationAnnouncements.js';	
import filesNav from '../src/filesNav.js';									
import billFiles from '../src/billFiles.js';
import pafPreview from '../src/pafPreview.js';
import carsInWay from '../src/carsInWay.js';
import changePassword from '../src/changePassword';
import carImages from '../src/carImages.js';
import complaints from '../src/complaints.js';
import complaintsDetailsWrapper from '../src/complaintsDetailsWrapper.js';
import complaintsDetails from '../src/complaintsDetails.js';
import imageViewer from '../src/imageViewer.js';
import * as Animatable from 'react-native-animatable';
import { faChevronLeft, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import newPayment from '../src/newPayment.js';
import paymentCars from '../src/paymentCars.js';
import MyBuyerRequest from '../src/MyBuyerRequest.js';
import add_ones_services from '../src/add_ones_services.js';
import MyShippingServicesRequest from '../src/MyShippingServicesRequest.js';
import AddCars from '../src/addCars.js';
import MyCarsAdded from '../src/MyCarsAdded.js';
import MyDamagedCarsRequest from '../src/MyDamagedCarsRequest.js';
import AddDamagedCarsRequest from '../src/addDamageRequest';
import StripeScreen from '../src/Stripe.js';
import addServiceRequest from '../src/addServiceRequest';
import myServiceRequest from '../src/myServiceRequest';
// import Ab from '../src/Ab';
import MyPaidByCustomerRequest from '../src/MyPaidByCustomerRequest.js';
import paymentNavigation from '../src/paymentNavigation.js';
import paymentOther from '../src/paymentOther.js';
import newPaymentOther from '../src/newPaymentOther.js';


function MyTabBar2({ state, descriptors, navigation }) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    

    
    <Animatable.View animation="fadeInUp" 
    duration = {2000}>
      <StatusBar hidden />
<LinearGradient 
                                start={{x: 0.0, y: 0}} 
                                end={{x: 1, y: 0}} 
                                colors = {['#fff', '#fff']}>
                                  <View style={{ flexDirection: 'row' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, padding:8, justifyContent:'center', alignItems:'center' }}>
              {isFocused && index == 0 ?
              (<View style={commonStyle.bottomBarView}>
                    <Image
                    source={require('../assets/images/bottomBar/active/home.png')}
                    style={{width: width*0.1, height: width*0.1, resizeMode: 'contain'}}/>
                    <Text style={commonStyle.bottomBarTextActive}>{strings('main.home')}</Text>
                </View>):isFocused && index == 1 ? (
                <View style={commonStyle.bottomBarView}>
                    <Image
                    source={require('../assets/images/bottomBar/active/forSell.png')}
                    style={{width: width*0.1, height: width*0.1, resizeMode: 'contain'}}/>
                    <Text style={commonStyle.bottomBarTextActive}>{strings('main.SaleCars')}</Text>
                </View>):isFocused && index == 2 ?(
                <View style={commonStyle.bottomBarView}>
                    <Image
                    source={require('../assets/images/bottomBar/active/calculator.png')}
                    style={{width: width*0.1, height: width*0.1, resizeMode: 'contain'}}/>
                    <Text style={commonStyle.bottomBarTextActive}>{strings('main.shippingcalculator')}</Text>
                </View>):isFocused && index == 3 ? (
                <View style={commonStyle.bottomBarView}>
                     {/**<View style={{position:'absolute', left:-13, top:-7,zIndex:10}}>
                        <Badge value={AuthContext.totalUpaid} textStyle={commonStyle.fontsizeGlobalSmall} 
                          badgeStyle={[commonStyle.badgeStyle, {backgroundColor: '#A30000'}]}>
                </Badge>
                      </View>**/}
                    <Image
                    source={require('../assets/images/bottomBar/active/Payment.png')}
                    style={{width: width*0.1, height: width*0.1, resizeMode: 'contain'}}/>
                    <Text style={commonStyle.bottomBarTextActive}>{strings('main.paymentCars')}</Text>
                </View>): !isFocused && index == 0 ? (
                  <View style={commonStyle.bottomBarView}>
                      <Image
                      source={require('../assets/images/bottomBar/notactive/home.png')}
                      style={{width: width*0.1, height: width*0.1, resizeMode: 'contain'}}/>
                      <Text style={commonStyle.bottomBarText}>{strings('main.home')}</Text>
                  </View>): !isFocused && index == 1 ? (
                  <View style={commonStyle.bottomBarView}>
                    <Image
                      source={require('../assets/images/bottomBar/notactive/forSell.png')}
                      style={{width: width*0.1, height: width*0.1, resizeMode: 'contain'}}/>
                    <Text style={commonStyle.bottomBarText}>{strings('main.SaleCars')}</Text>
                </View>
                ):!isFocused && index == 2 ? (
                  <View style={commonStyle.bottomBarView}>
                  <Image
                    source={require('../assets/images/bottomBar/notactive/calculator.png')}
                    style={{width: width*0.1, height: width*0.1, resizeMode: 'contain'}}/>
                    <Text style={commonStyle.bottomBarText}>{strings('main.shippingcalculator')}</Text>
                  </View>
                  ):(
                  <View style={commonStyle.bottomBarView}>
                    <Image
                        source={require('../assets/images/bottomBar/notactive/Payment.png')}
                        style={{width: width*0.1, height: width*0.1, resizeMode: 'contain'}}/>
                        {/**<View style={{position:'absolute', left:-13, top:-7,zIndex:10}}>
                          <Badge value={AuthContext.totalUpaid} textStyle={commonStyle.fontsizeGlobalSmall} 
                            badgeStyle={[commonStyle.badgeStyle, {backgroundColor: '#A30000'}]}>
                          </Badge>
                        </View>**/} 
                        <Text style={commonStyle.bottomBarText}>{strings('main.paymentCars')}</Text>
                  </View>
                )
                }
          </TouchableOpacity>
        );
      })}</View>
    </LinearGradient></Animatable.View>
    
  );
}

const Tab = createBottomTabNavigator();
const {width, height} = Dimensions.get('window'); 

const HomeStack = createStackNavigator();
const DetailsStack = createStackNavigator();
const Drawer = createDrawerNavigator();
const PriceListStack = createDrawerNavigator();
const Stack = createStackNavigator();


const iconsActive = [
  <View style={{backgroundColor: '#fff', padding:8, borderRadius:25}}><Image
      source={require('../assets/images/bottomBar/notactive/home.png')}
      style={{width: width*0.085, height: width*0.085, resizeMode: 'contain'}}/></View>,
  <View style={{backgroundColor: '#fff', padding:4, borderRadius:25}}>
  <Image
      source={require('../assets/images/bottomBar/notactive/forSell.png')}
      style={{width: width*0.1, height: width*0.1, resizeMode: 'contain'}}/></View>,
  <View style={{backgroundColor: '#fff', padding:4, borderRadius:25}}>
  <Image
      source={require('../assets/images/bottomBar/notactive/calculator.png')}
       style={{width: width*0.1, height: width*0.1, resizeMode: 'contain'}}/></View>,
  <View style={{backgroundColor: '#fff', padding:4, borderRadius:25}}>
  <Image
      source={require('../assets/images/bottomBar/notactive/cancelled.png')}
        style={{width: width*0.1, height: width*0.1, resizeMode: 'contain'}}/></View>,
];

const iconsnotActive = [
  <View style={{backgroundColor: '#fff', padding:8, borderRadius:25}}><Image
      source={require('../assets/images/bottomBar/active/home.png')}
      style={{width: width*0.085, height: width*0.085, resizeMode: 'contain'}}/></View>
  ,
  <Image
      source={require('../assets/images/bottomBar/active/forSell.png')}
      style={{width: width*0.1, height: width*0.1, resizeMode: 'contain'}}/>,
  <Image
      source={require('../assets/images/bottomBar/active/calculator.png')}
       style={{width: width*0.1, height: width*0.1, resizeMode: 'contain'}}/>,
  <Image
      source={require('../assets/images/bottomBar/active/cancelled.png')}
        style={{width: width*0.1, height: width*0.1, resizeMode: 'contain'}}/>,
];


export default class MainTabScreen extends Component  {
  constructor(props){
    super(props);
      this.state = {
      setd: '',
      search: '',
      searcharrayLotvin: [],
      iconsnotActive: iconsnotActive,
      iconsActive: iconsActive,
      totalUpaid: 0
      //iconsnotActive2: iconsnotActive2,
      //iconsActive1: iconsActive1
    }
  }

  async set_language () {
    if(I18n.locale == 'en' ){
      this.setState({stateOfLocale: 'ar'});
      await AsyncStorage.setItem('lang', 'ar');
      I18n.locale = 'ar';
    }
    else{
      this.setState({stateOfLocale: 'ar'});
      I18n.locale = 'en';
      await AsyncStorage.setItem('lang', 'en');
    }
    DevSettings.reload();
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
        height: 0.4,
        width: '100%',
        backgroundColor: '#141313',
      }}
    />
);
};


   HomeStackScreen = ({navigation}) => (
     
        <HomeStack.Navigator
            count="20" 
            headerMode="screen"
            initialRouteName="Dashboard" 
            /**onStateChange={async () => await analytics().logScreenView({
              screen_name: 'currentRouteName',
              screen_class: 'currentRouteName',
            })}**/
            screenOptions={{
                headerStyle: {
                backgroundColor: '#0d5db8',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                fontWeight: 'bold'
                }
            }}>
                <HomeStack.Screen name="Dashboard" component={Dashboard} count="20" options={{
                header: () => (
                  <Animatable.View animation="fadeInDown" 
                  duration = {1000}>
                      <View style = {{
                              position: 'relative',
                              left: 0,
                              right: 0,
                              bottom: 0,
                              top:0,
                              width: '100%',
                              backgroundColor: '#013188',
                              height: 120,
                              fontFamily: 'ZEKTON',
                              borderBottomLeftRadius: 30,
                              borderBottomRightRadius: 30,
                              shadowColor: "#000",
                              justifyContent: 'center',
                              shadowOffset: {
                                  width: 0,
                                  height: 12,
                              },
                              shadowOpacity: 0.58,
                              shadowRadius: 16.00,
                              elevation: 18,
                              }}>

                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                  <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', flex: 1, marginLeft: 25}}>
                                      
                                  </View>
                                  <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                    <Text style={{color: '#ffffff', fontSize: 20, fontFamily: 'ZEKTON' }}>{strings('main.home')}</Text>
                                  </View>
                                  <View style={{justifyContent: 'flex-end', alignItems: 'flex-end', flex: 1, flexDirection:'row', marginRight: 25}}>
                                      <Icon2.Button name="bell" size={25} backgroundColor="#0d5db8" onPress={() => navigation.openDrawer()}></Icon2.Button> 
                                      <Icon2.Button name="ellipsis-v" size={25} backgroundColor="#0d5db8" onPress={() => navigation.openDrawer()}></Icon2.Button>  
                                  </View>
                                </View>       
                        </View>
                  </Animatable.View>
    
                ),
                headerRight: () => (
                  <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity activeOpacity={1}
                        onPress = {() => {
                          this.set_language()}} >
                        <Text  style = {{margin: 10, fontSize: 18, color: '#fff'}}>{strings('main.lang')}</Text>
                      </TouchableOpacity>
                    </View>                 
                ),
                headerStyle: {
                    backgroundColor: '#0d5db8',
                },
                headerTintColor: '#ffffff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerLeft: () => (
                    <Icon.Button name="ios-menu" size={25} backgroundColor="#0d5db8" onPress={() => navigation.openDrawer()}></Icon.Button>
                )
                }} />
                  
                  <HomeStack.Screen name="CarTrackSearch" component = {CarTrackSearch}
                  options = {{
                    header: () => (
                      <View style = {commonStyle.header}>
                          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                        marginTop: height*0.05, flex:1}}>
                            <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                          ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                                <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
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
                              <Text style={commonStyle.headerText}>{strings('main.car_tracking')}</Text>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                              <Text style={commonStyle.headerText}></Text>
                            </View>
                          </View>       
                      </View>
                    )
                    }} 
                     />
                  <HomeStack.Screen name="complaints" component = {complaints} />
                  <HomeStack.Screen name="complaintsDetailsWrapper" component = {complaintsDetailsWrapper} />
                  <HomeStack.Screen name="complaintsDetails" component = {complaintsDetails} /> 
      
                <HomeStack.Screen name="aboutCompany" component = {aboutCompany} options = {{
                  header: () => (
                    <View style = {commonStyle.header}>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                      marginTop: height*0.05, flex:1}}>
                          <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                        ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                              <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
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
      
      <HomeStack.Screen name="gneralstatementPDF" component = {gneralstatementPDF} options = {{
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
                            <Text style={commonStyle.headerText}>{strings('car.general_statement')}</Text>
                          </View>
                          <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                            <Text style={commonStyle.headerText}></Text>
                          </View>
                        </View>       
                    </View>

                      
                  )
                  }} />


                <HomeStack.Screen name="contactCompany" component = {contactCompany} options = {{
                  header: () => (
                    <View style = {commonStyle.header}>
                      <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                        marginTop: height*0.05, flex:1}}>
                            <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                          ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                                <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
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
                <HomeStack.Screen name="MyRequests" component = {MyRequests} options = {{
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
                              <Text style={commonStyle.headerText}>{strings('main.my_requests')}</Text>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                              <Text style={commonStyle.headerText}></Text>
                            </View>
                          </View>       
                      </View>

                  )
                }} />

              <HomeStack.Screen name="MyBuyerRequest" component = {MyBuyerRequest} options = {{
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
                               <Text style={commonStyle.headerText}>{strings('main.buyerAcc')}</Text>
                             </View>
                             <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                
                            </View>
                           </View>       
                       </View>
                       )
                      }} />

                  <HomeStack.Screen name="MyShippingServicesRequest" component = {MyShippingServicesRequest} options = {{
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
                               <Text style={commonStyle.headerText}>{strings('main.add_ons_services_list')}</Text>
                             </View>
                             <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                
                            </View>
                           </View>       
                       </View>
                       )
                  }} />

<HomeStack.Screen name="MyCarsAdded" component = {MyCarsAdded} options = {{
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
                               <Text style={commonStyle.headerText}>{strings('main.MyCarsAdded')}</Text>
                             </View>
                             <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                <TouchableOpacity activeOpacity={1} onPress={() => 
                                  this.props.navigation.navigate("AddCars")}>
                                    <Text style={commonStyle.headerText}>
                                        <FontAwesomeIcon
                                            icon={ faPlusCircle }
                                            color="#0093FF"
                                            size={width*0.08}
                                        />
                                    </Text>
                                </TouchableOpacity>
                            </View>
                           </View>       
                       </View>
                       )
                      }} />
                      
                <HomeStack.Screen name="AddCars" component={AddCars} options={{
                      header: () => (
                        <View style = {commonStyle.header}>
                              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                            marginTop: height*0.05, flex:1}}>
                                <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                              ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                                    <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
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
                                  <Text style={commonStyle.headerText}>{strings('main.add_cars')}</Text>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                  <Text style={commonStyle.headerText}></Text>
                                </View>
                              </View>       
                          </View>
                       )
                  }} />


<HomeStack.Screen name="MyDamagedCarsRequest" component = {MyDamagedCarsRequest} options = {{
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
                               <Text style={commonStyle.headerText}>{strings('main.damage_request')}</Text>
                             </View>
                             <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                <TouchableOpacity activeOpacity={1} onPress={() => 
                                  this.props.navigation.navigate("AddDamagedCarsRequest")}>
                                    <Text style={commonStyle.headerText}>
                                        <FontAwesomeIcon
                                            icon={ faPlusCircle }
                                            color="#0093FF"
                                            size={width*0.08}
                                        />
                                    </Text>
                                </TouchableOpacity>
                            </View>
                           </View>       
                       </View>
                       )
                      }} />
<HomeStack.Screen name="myServiceRequest" component = {myServiceRequest} options = {{
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
                               <Text style={commonStyle.headerText}>{strings('main.service_request')}</Text>
                             </View>
                             <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                <TouchableOpacity activeOpacity={1} onPress={() => 
                                  this.props.navigation.navigate("addServiceRequest")}>
                                    <Text style={commonStyle.headerText}>
                                        <FontAwesomeIcon
                                            icon={ faPlusCircle }
                                            color="#0093FF"
                                            size={width*0.08}
                                        />
                                    </Text>
                                </TouchableOpacity>
                            </View>
                           </View>       
                       </View>
                       )
                      }} />


          
                <HomeStack.Screen name="MyPaidByCustomerRequest" component = {MyPaidByCustomerRequest} options = {{
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
                               <Text style={commonStyle.headerText}>{strings('main.paid_bill')}</Text>
                             </View>
                             <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                
                            </View>
                           </View>       
                       </View>
                       )
                }} />

                <HomeStack.Screen name="AddDamagedCarsRequest" component={AddDamagedCarsRequest} options={{
                      header: () => (
                        <View style = {commonStyle.header}>
                              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                            marginTop: height*0.05, flex:1}}>
                                <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                              ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                                    <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
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
                                  <Text style={commonStyle.headerText}>{strings('main.add_damage')}</Text>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                  <Text style={commonStyle.headerText}></Text>
                                </View>
                              </View>       
                          </View>
                       )
                  }} />
                <HomeStack.Screen name="addServiceRequest" component={addServiceRequest} options={{
                      header: () => (
                        <View style = {commonStyle.header}>
                              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                            marginTop: height*0.05, flex:1}}>
                                <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                              ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                                    <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
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
                                  <Text style={commonStyle.headerText}>{strings('main.add_service_request')}</Text>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                  <Text style={commonStyle.headerText}></Text>
                                </View>
                              </View>       
                          </View>
                       )
                  }} />
                <HomeStack.Screen name="StripeScreen" component={StripeScreen} options={{
                      header: () => (
                        <View style = {commonStyle.header}>
                              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                            marginTop: height*0.05, flex:1}}>
                                <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                              ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                                    <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
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
                                  <Text style={commonStyle.headerText}>{strings('main.add_service_request')}</Text>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                  <Text style={commonStyle.headerText}></Text>
                                </View>
                              </View>       
                          </View>
                       )
                  }} />

            <HomeStack.Screen name="wyouloggin" component = {wyouloggin} options = {{
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
                               <Text style={commonStyle.headerText}>{strings('main.wyouloggin')}</Text>
                             </View>
                             <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                
                            </View>
                           </View>       
                       </View>
                       )
                  }} />

                <HomeStack.Screen name="MyAuthorizedRequests" component = {MyAuthorizedRequests} options = {{
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
                               <Text style={commonStyle.headerText}>{strings('main.my_authorized_persons')}</Text>
                             </View>
                             <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                <TouchableOpacity activeOpacity={1} onPress={() => 
                                  this.props.navigation.navigate("AddAuthorizedRequests")}>
                                    <Text style={commonStyle.headerText}>
                                        <FontAwesomeIcon
                                            icon={ faPlusCircle }
                                            color="#0093FF"
                                            size={width*0.08}
                                        />
                                    </Text>
                                </TouchableOpacity>
                            </View>
                           </View>       
                       </View>
                       )
                      }} />



                  <HomeStack.Screen name="AddAuthorizedRequests" component = {AddAuthorizedRequests} options = {{
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
                               <Text style={commonStyle.headerText}>{strings('main.add_my_vccrequests')}</Text>
                             </View>
                             <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                
                            </View>
                           </View>       
                       </View>
                       )
                      }} />
                      
                <HomeStack.Screen name="cancelledCars" component = {cancelledCars} options = {{
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
                              <Text style={commonStyle.headerText}>{strings('main.cancelled_cars')}</Text>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                              <Text style={commonStyle.headerText}></Text>
                            </View>
                          </View>       
                      </View>
                  )
                }} />		 
                
                 

              <HomeStack.Screen name="priceLists" component = {priceLists} options = {{
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
                            <Text style={commonStyle.headerText}>{strings('main.prices_list')}</Text>
                          </View>
                          <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                            <Text style={commonStyle.headerText}></Text>
                          </View>
                        </View>       
                    </View>

                  )
                }} /> 

              <HomeStack.Screen name="priceFiles" component = {priceFiles} options = {{
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
                        <Text style={commonStyle.headerText}>{strings('main.all_documents')}</Text>
                      </View>
                      <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                        <Text style={commonStyle.headerText}></Text>
                      </View>
                    </View>       
                </View>
                  )
              }} />
              
			<HomeStack.Screen name="priceFilesViewer" component = {priceFilesViewer} options = {{}} />

      <HomeStack.Screen name="BranchesCompany" component = {BranchesCompany} options = {{
                  header: () => (
                    <View style = {commonStyle.header}>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                      marginTop: height*0.05, flex:1}}>
                          <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                        ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                              <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
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
      

      <HomeStack.Screen name="profile" component = {profile} options = {{
                  header: () => (
                    <View style = {commonStyle.header}>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                      marginTop: height*0.05, flex:1}}>
                          <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                        ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                              <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
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
    
              <HomeStack.Screen name="navigAccount" component={navigAccount} options={{
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
                                <Text style={commonStyle.headerText}>{strings('main.my_accounts')}</Text>
                              </View>
                              <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                <Text style={commonStyle.headerText}></Text>
                              </View>
                            </View>       
                        </View>
                   ),}} />

                <HomeStack.Screen name="navigAccount2" component={navigAccount2} options={{
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
                          <Text style={commonStyle.headerText}>{strings('main.my_accounts')}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                          <Text style={commonStyle.headerText}></Text>
                        </View>
                      </View>       
                  </View>
                   ),}} />


                      <HomeStack.Screen name="generalStatement" component={generalStatement} options={{
                     header: () => (


                      <View style = {commonStyle.header}>
                          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center'}}>
                            <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', flex: 1, marginLeft: 25}}>
                                <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate("navigAccount")}>
                                    <View style={{margin: 16, alignItems: 'center', justifyContent: 'center'}}>
                                          <View>
                                          <FontAwesomeIcon
                                                icon={ faChevronLeft }
                                                color="#fff"
                                                size={width*0.06}
                                            />
                                          </View>
                                    </View>
                                </TouchableOpacity>  
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                              <Text style={commonStyle.headerText}>{strings('car.general_statement')}</Text>
                            </View>
                            <View style={{justifyContent: 'flex-end', alignItems: 'flex-end', flex: 1, marginRight: 25}}>
                                  <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate("filterStatement")} size={25}>
                                    <View>
                                        <Image
                                            style={{resizeMode: "contain",
                                                    justifyContent: "center",
                                                    width: 25,
                                                    height: 25}}
                                            source={require('../assets/filter1.png')}/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                          </View>       
                  </View>),}} />
                      
                  <HomeStack.Screen name="statement" component={statement} options={{

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
                                <Text style={commonStyle.headerText}>{strings('car.car_statement')}</Text>
                              </View>
                              <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                <Text style={commonStyle.headerText}></Text>
                              </View>
                            </View>       
                        </View>
                     ),}} />

                      <HomeStack.Screen name="statementDetails" component={statementDetails} options={{
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
                                <Text style={commonStyle.headerText}>{strings('car.statementDetails')}</Text>
                              </View>
                              <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                <Text style={commonStyle.headerText}></Text>
                              </View>
                            </View>       
                        </View>
                     ),}} />

                <HomeStack.Screen name="imagesSlider" component={imagesSlider} options={{
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
                            <Text style={commonStyle.headerText}>{strings('main.car_images')}</Text>
                          </View>
                          <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                            <Text style={commonStyle.headerText}></Text>
                          </View>
                        </View>       
                    </View>
                  )
                }} />

                <HomeStack.Screen headerMode="screen"  name="trackDetails" component={trackDetails} 
                />
                

                  <HomeStack.Screen name="carImagesNavigator" component={carImagesNavigator} options={{
                      header: () => (
                        <View style = {commonStyle.header}>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                            marginTop: height*0.05, flex:1}}>
                                <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                              ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                                    <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
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
                                  <Text style={commonStyle.headerText}>{strings('main.car_images2')}</Text>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                    <Text style={commonStyle.headerText}></Text>
                                </View>
                              </View>       
                          </View>
                      )
                  }} />

      

                <HomeStack.Screen name="imageViewer" component={imageViewer} options={{
                            header: () => (
                              <View style = {commonStyle.header}>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                            marginTop: height*0.05, flex:1}}>
                                <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                              ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                                    <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
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
                                  <Text style={commonStyle.headerText}>{strings('main.car_images')}</Text>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                    <Text style={commonStyle.headerText}></Text>
                                </View>
                              </View>       
                          </View>
                            )
                }} />

                  <HomeStack.Screen name="filesNav" component={filesNav} options={{
                            header: () => (
<View style = {commonStyle.header}>
<View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
marginTop: height*0.05, flex:1}}>
    <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
  ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
        <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
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
      <Text style={commonStyle.headerText}>{strings('main.files')}</Text>
    </View>
    <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
        <Text style={commonStyle.headerText}></Text>
    </View>
  </View>       
</View>

                            )
                }} />

                  <HomeStack.Screen name="billFiles" component={billFiles} options={{
                            header: () => (
                              <View style = {commonStyle.header}>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                            marginTop: height*0.05, flex:1}}>
                                <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                              ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                                    <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
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
                                  <Text style={commonStyle.headerText}>{strings('main.billFiles')}</Text>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                    <Text style={commonStyle.headerText}></Text>
                                </View>
                              </View>       
                          </View>
                            )
                }} />


                  <HomeStack.Screen name="billFilesViewer" component={billFilesViewer} options={{}} />
                  <HomeStack.Screen name="notification" component={notification} options={{}} />
                  <HomeStack.Screen name="notificationGeneral" component={notificationGeneral} options={{}} />
                  <HomeStack.Screen name="notificationAnnouncements" component={notificationAnnouncements} options={{
                    header: () => (
                        <View style = {commonStyle.header}>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                            marginTop: height*0.05, flex:1}}>
                                <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                              ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                                    <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
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
                                  <Text style={commonStyle.headerText}>{strings('main.notification')}</Text>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                    <Text style={commonStyle.headerText}></Text>
                                </View>
                              </View>       
                          </View>
                    )
                  }} />
                  
                  <HomeStack.Screen name="activateAdminAccess" component={activateAdminAccess} options={{
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
                            <Text style={commonStyle.headerText}>{strings('main.adminAccess')}</Text>
                          </View>
                          <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                            <Text style={commonStyle.headerText}></Text>
                          </View>
                        </View>       
                    </View>
                            )
                }} />

                 
                  <HomeStack.Screen name="allCars" component={allCars} options={{
                      header: () => (
                        <View style = {{
                          position: 'relative',
                          left: 0,
                          right: 0,
                          bottom: 0,
                          top:0,
                          width: '100%',
                          backgroundColor: '#013188',
                          height: height*0.08,
                          fontFamily: 'ZEKTON',
                          borderBottomLeftRadius: 30,
                          borderBottomRightRadius: 30,
                          shadowColor: "#000",
                          justifyContent: 'center',
                          shadowOffset: {
                              width: 0,
                              height: 12,
                          },
                          shadowOpacity: 0.58,
                          shadowRadius: 16.00,
                          elevation: 18,
                          }}>

                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center'}}>
                                <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', flex: 1, marginLeft: 25}}>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                  <Text style={{color: '#ffffff', fontSize: 30 }}>{strings('main.allCars')}</Text>
                                </View>
                                <View style={{justifyContent: 'flex-end', alignItems: 'flex-end', flex: 1, marginRight: 25}}>
                                </View>
                            </View>     
                      </View>
                        
                      )
                }} />

              <HomeStack.Screen name="changePassword" component={changePassword} options={{
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
                            <Text style={commonStyle.headerText}>{strings('main.change_password')}</Text>
                          </View>
                          <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                            <Text style={commonStyle.headerText}></Text>
                          </View>
                        </View>       
                    </View>

                        
                      )
                  }} />

                  { <HomeStack.Screen name="carDetails2" component={carDetails2} options={{
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
                            <Text style={commonStyle.headerText}>{strings('car.car_details')}</Text>
                          </View>
                          <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                            <Text style={commonStyle.headerText}></Text>
                          </View>
                        </View>       
                    </View>
                        
                      )
                  }} /> }

                  <HomeStack.Screen name="inauctionsDetailsstmt" component={inauctionsDetailsstmt} options={{
                      header: () => (
                        <View style = {commonStyle.header}>
                              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                            marginTop: height*0.05, flex:1}}>
                                <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                              ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                                    <TouchableOpacity activeOpacity={1}  onPress={() => this.props.navigation.reset({
  routes: [{ name: "HomeDrawer" }]})}>
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
                                  <Text style={commonStyle.headerText}>{strings('main.auction_cars')}</Text>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                  <Text style={commonStyle.headerText}></Text>
                                </View>
                              </View>       
                          </View>)
                  }} />

                  <HomeStack.Screen name="shippingCostDetailsStmt" component={shippingCostDetailsStmt} options={{
                      header: () => (
                        <View style = {commonStyle.header}>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center'}}>
                              <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', flex: 1}}>
                              </View>
                              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                <Text style={commonStyle.headerText}>{strings('main.shipping_cost')}</Text>
                              </View>
                              <View style={{justifyContent: 'flex-end', alignItems: 'flex-end', flex: 1}}>
                              </View>
                            </View>       
                      </View>)
                  }} />



                <HomeStack.Screen name="notPaidinauctions" component={notPaidinauctions} options={{
                      header: () => (
                        <View style = {commonStyle.header}>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center'}}>
                              <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', flex: 1}}>
                              </View>
                              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                <Text style={commonStyle.headerText}>{strings('main.notPaidinauctions')}</Text>
                              </View>
                              <View style={{justifyContent: 'flex-end', alignItems: 'flex-end', flex: 1}}>
                              </View>
                            </View>       
                      </View>)
                  }} />


              <HomeStack.Screen name="generalunpaidstmt" component={generalunpaidstmt} options={{
                      header: () => (
                        <View style = {commonStyle.header}>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center'}}>
                              <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', flex: 1}}>
                              </View>
                              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                <Text style={commonStyle.headerText}>{strings('main.general_entries')}</Text>
                              </View>
                              <View style={{justifyContent: 'flex-end', alignItems: 'flex-end', flex: 1}}>
                              </View>
                            </View>       
                      </View>)
                  }} />


                <HomeStack.Screen name="shippedcarsstmt" component={shippedcarsstmt} options={{
                      header: () => (
                        <View style = {commonStyle.header}>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center'}}>
                              <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', flex: 1}}>
                              </View>
                              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                <Text style={commonStyle.headerText}>{strings('main.shipped_cars')}</Text>
                              </View>
                              <View style={{justifyContent: 'flex-end', alignItems: 'flex-end', flex: 1}}>
                              </View>
                            </View>       
                      </View>)
                  }} />



                <HomeStack.Screen name="debitCarsStatement" component={debitCarsStatement} options={{
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
                                  <Text style={commonStyle.headerText}>{strings('car.general_statement')}</Text>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                  <Text style={commonStyle.headerText}></Text>
                                </View>
                              </View>       
                          </View>
                      )
                  }} />

                <HomeStack.Screen name="carsInAuctions" component={carsInAuctions} options={{
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
                            <Text style={commonStyle.headerText}>{strings('main.in_auction')}</Text>
                          </View>
                          <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                            <Text style={commonStyle.headerText}></Text>
                          </View>
                        </View>       
                    </View>
                        )
                  }} />

                <HomeStack.Screen name="carsInWay" component={carsInWay} options={{
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
                            <Text style={commonStyle.headerText}>{strings('main.inway')}</Text>
                          </View>
                          <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                            <Text style={commonStyle.headerText}></Text>
                          </View>
                        </View>       
                    </View>

                        )
                  }} />

                  <HomeStack.Screen name="add_ones_services" component={add_ones_services} options={{
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
                          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 0.9}}>
                            <Text style={commonStyle.headerText}>{strings('car.add_ons_services')}</Text>
                          </View>
                          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 0.2}}>
                            <Text style={commonStyle.headerText}></Text>
                          </View>
                        </View>       
                    </View>

                        )
                  }} />

<HomeStack.Screen name="pafPreview" component={pafPreview} options={{
                      header: () => (
                        <View style = {commonStyle.header}>
                              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                            marginTop: height*0.05, flex:1}}>
                                <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                              ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                                    <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
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
                                  <Text style={commonStyle.headerText}>{strings('main.file_preview')}</Text>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                  <Text style={commonStyle.headerText}></Text>
                                </View>
                              </View>       
                          </View>
                       )
                  }} />
        </HomeStack.Navigator>
        );

  

        DetailsStackScreen = ({navigation}) => (
          <DetailsStack.Navigator screenOptions={{
                  headerStyle: {
                  backgroundColor: '#0d5db8',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                  fontWeight: 'bold'
                  }
              }}>
                  <DetailsStack.Screen name="carforSale" component={carforSale} options={{}} />
                  <DetailsStack.Screen name="bookmarksCars" component={bookmarksCars} options={{}} />
                  <HomeStack.Screen name="carforSaleSlider" component={carforSaleSlider} options={{}} />
          </DetailsStack.Navigator>
          );

          
          shippingStackScreen = ({navigation}) => (
            <DetailsStack.Navigator screenOptions={{
                    headerStyle: {
                    backgroundColor: '#013188',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                    fontWeight: 'bold'
                    }
                }}>
                    <DetailsStack.Screen name="shippingCalculator" component={shippingCalculator} options={{
                      header: () => (
                        <View style = {commonStyle.header}>
                              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                            marginTop: height*0.05, flex:1}}>
                                <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                              ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                                    <TouchableOpacity activeOpacity={1}  onPress={() => this.props.navigation.reset({
  routes: [{ name: "HomeDrawer" }]
})}>
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
                                  <Text style={commonStyle.headerText}>{strings('main.shippingcalculator')}</Text>
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

            
            profileStackScreen = ({navigation}) => (
              <DetailsStack.Navigator screenOptions={{
                      headerStyle: {
                      backgroundColor: '#0d5db8',
                      },
                      headerTintColor: '#fff',
                      headerTitleStyle: {
                      fontWeight: 'bold'
                      }
                  }}>
                      <DetailsStack.Screen name="profile" component={profile} options={{
                      header: () => (
                        <View style = {{
                              position: 'relative',
                              left: 0,
                              right: 0,
                              bottom: 0,
                              top:0,
                              width: '100%',
                              backgroundColor: '#013188',
                              height: 80,
                              borderBottomLeftRadius: 30,
                              borderBottomRightRadius: 30,
                              shadowColor: "#000",
                              justifyContent: 'center',
                              shadowOffset: {
                                  width: 0,
                                  height: 12,
                              },
                              shadowOpacity: 0.58,
                              shadowRadius: 16.00,
                              elevation: 18,
                              }}>

                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center'}}>
                                  <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', flex: 1, marginLeft: 25}}>
                                    <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
                                        <View style={{margin: 16, alignItems: 'center', justifyContent: 'center'}}>
                                            <View>
                                                <FontAwesomeIcon
                                                    icon={ faChevronLeft }
                                                    color="#fff"
                                                    size={width*0.06}
                                                />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                    <Text style={{color: '#ffffff', fontSize: 30 }}>{strings('main.profile')}</Text>
                                  </View>
                                  <View style={{justifyContent: 'flex-end', alignItems: 'flex-end', flex: 1, marginRight: 25}}>
                                  </View>
                                </View>         
                        </View>
                  )
                      }} />
              </DetailsStack.Navigator>
              );

              paymentStackScreen = ({navigation}) => (
                <DetailsStack.Navigator screenOptions={{
                        headerStyle: {
                        backgroundColor: '#0d5db8',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                        fontWeight: 'bold'
                        }
                    }}>
                        
                        <DetailsStack.Screen name="paymentNavigation" component={paymentNavigation} options={{
                         header: () => (
                          
                          <View style = {commonStyle.header}>
                              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                            marginTop: height*0.05, flex:1}}>
                                <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                              ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                                    <TouchableOpacity activeOpacity={1}  onPress={() => this.props.navigation.reset({
  routes: [{ name: "HomeDrawer" }]
})}>
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
                                  <Text style={commonStyle.headerText}>{strings('main.paymentNav')}</Text>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                   
                                </View>
                              </View>       
                          </View>
                        )
                        }} />
                        <DetailsStack.Screen name="newPayment" component = {newPayment} options = {{
                            header: () => (
                              <View style = {commonStyle.header}>
                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                                  marginTop: height*0.05, flex:1}}>
                                      <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                                    ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                                          <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
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
                                        <Text style={commonStyle.headerText}>{strings('main.newPayment')}</Text>
                                      </View>
                                      <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                        <Text style={commonStyle.headerText}></Text>
                                      </View>
                                    </View>       
                              </View>
                            )
                            }} />


                        <DetailsStack.Screen name="newPaymentOther" component = {newPaymentOther} options = {{
                            header: () => (
                              <View style = {commonStyle.header}>
                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                                  marginTop: height*0.05, flex:1}}>
                                      <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                                    ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                                          <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
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
                                        <Text style={commonStyle.headerText}>{strings('main.otherPayments')}</Text>
                                      </View>
                                      <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                        <Text style={commonStyle.headerText}></Text>
                                      </View>
                                    </View>       
                              </View>
                            )
                            }} />

                        <DetailsStack.Screen name="paymentCars" component={paymentCars} options={{
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
                                  <Text style={commonStyle.headerText}>{strings('main.paymentCars')}</Text>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                    <TouchableOpacity activeOpacity={1} onPress={() => 
                                      this.props.navigation.navigate("newPayment")}>
                                        <Text style={commonStyle.headerText}>
                                            <FontAwesomeIcon 
                                                icon={ faPlusCircle }
                                                color="#0093FF"
                                                size={width*0.08}
                                            />
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                              </View>
                          </View>
                        )
                        }} />


                        <DetailsStack.Screen name="doPayment" component={doPayment} options={{
                         header: () => (
                          <View style = {commonStyle.header}>
                              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                            marginTop: height*0.05, flex:1}}>
                                <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                              ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                                    <TouchableOpacity activeOpacity={1}  onPress={() => this.props.navigation.reset({
                                          routes: [{ name: "HomeDrawer" }]
                                        })}>
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
                                  <Text style={commonStyle.headerText}>{strings('main.payment')}fafdsa</Text>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                    <TouchableOpacity activeOpacity={1} onPress={() => 
                                      this.props.navigation.navigate("newPayment")}>
                                        <Text style={commonStyle.headerText}>
                                            <FontAwesomeIcon 
                                                icon={ faPlusCircle }
                                                color="#0093FF"
                                                size={width*0.08}
                                            />
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                              </View>       
                          </View>
                        )
                        }} />

                      <DetailsStack.Screen name="paymentOther" component={paymentOther} options={{
                         header: () => (
                          <View style = {commonStyle.header}>
                              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                            marginTop: height*0.05, flex:1}}>
                                <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                              ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                                    <TouchableOpacity activeOpacity={1}  onPress={() => this.props.navigation.reset({
                                          routes: [{ name: "HomeDrawer" }]
                                        })}>
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
                                  <Text style={commonStyle.headerText}>{strings('main.otherPayments')}</Text>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                                    <TouchableOpacity activeOpacity={1} onPress={() => 
                                      this.props.navigation.navigate("newPaymentOther")}>
                                        <Text style={commonStyle.headerText}>
                                            <FontAwesomeIcon 
                                                icon={ faPlusCircle }
                                                color="#0093FF"
                                                size={width*0.08}
                                            />
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                              </View>       
                          </View>
                        )
                        }} />

                </DetailsStack.Navigator>


                );

                cancelledStackScreen = ({navigation}) => (
                  <DetailsStack.Navigator screenOptions={{
                          headerStyle: {
                          backgroundColor: '#0d5db8',
                          },
                          headerTintColor: '#fff',
                          headerTitleStyle: {
                          fontWeight: 'bold'
                          }
                      }}>
                          <DetailsStack.Screen name="cancelledCars" component={cancelledCars} options={{
                           header: () => (
                            <View style = {commonStyle.header}>
                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                              marginTop: height*0.05, flex:1}}>
                                  <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                                ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                                      <TouchableOpacity activeOpacity={1}  onPress={() => this.props.navigation.reset({
                                            routes: [{ name: "HomeDrawer" }]})}>
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
                                    <Text style={commonStyle.headerText}>{strings('main.cancelled_cars')}</Text>
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

                PriceListStackScreen = ({navigation}) => {
                  return (
              
                    <PriceListStack.Navigator screenOptions={{
                      headerStyle: {
                        backgroundColor: "#0d5db8",
                      },
                      headerTintColor: "#fff",
                      headerTitleStyle: {
                        fontWeight: "bold",
                      },
                    }}>
                      <PriceListStack.Screen name="priceLists" component={
                        AuthContext.AdminAccess?filesNav:activateAdminAccess
              
                      } options={{
                        header: () => (

<View style = {commonStyle.header}>
<View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
marginTop: height*0.05, flex:1}}>
  <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
,justifyContent: 'flex-start', alignItems:'flex-start'}}>
       <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.reset({
                                    routes: [{ name: "HomeDrawer" }],
                                  })}>
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
    <Text style={commonStyle.headerText}>{strings('main.prices_list')}</Text>
  </View>
  <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
    <Text style={commonStyle.headerText}></Text>
  </View>
</View>       
</View>

              
                        ),
                      }} />
                    </PriceListStack.Navigator>
                  );
                };
            
  /**MyTabs = () =>{
    return (
      <Tab.Navigator tabBar={props => <MyTabBar backgroundColor={'#fff'} selectedColor={'#0d5db8'} onSelect={(index)=>this.update_tab(index)} 
                     icons={this.state.iconsnotActive}
        {...props} />}>
        <Tab.Screen name="Home" component={this.HomeStackScreen} />
        <Tab.Screen name="SignInScreen" component={SignInScreen} />
      </Tab.Navigator>
    );
  }**/


 
    render(){
      return (
        <Tab.Navigator  tabBar={props => <MyTabBar2 {...props} />}
        tabBarOptions={{
          activeTintColor: '#FF0000',
          activeBackgroundColor: '#FFFFFF',
          inactiveBackgroundColor: '#FF0000',
          inactiveTintColor:  '#FFFFFF'
        }}
        barStyle={{backgroundColor: 'red' }}
        
        >
            <Tab.Screen name="HomeDrawer" component={this.HomeStackScreen} 
           
            options={{
              headerShown: false,
              tabBarLabel: 'Home'
            }}
            />
                <Tab.Screen name="carforSale" options={{headerShown: false}} component={this.DetailsStackScreen} />
                <Tab.Screen name="shippingCalculator" options={{headerShown: false}} component={this.shippingStackScreen} />
                <Tab.Screen name="paymentCars" options={{headerShown: false}} component={this.paymentStackScreen} />
          </Tab.Navigator>

         /**
          * <Tab.Screen name="cancelledCars" component={this.cancelledStackScreen} />
           <Tab.Navigator
              tabBar={props => 
              <MyTabBar backgroundColor={'transparent'} selectedColor={'red'}
                        onSelect={(index) => this.update_tab(index-1)} icons = {this.state.iconsnotActive}  
                        //onSelect={(index) => this.update_tab(this.=props.route.params.indextab)} icons = {this.state.iconsnotActive}
                        {...props} />}>
              <Tab.Screen name="HomeDrawer" component={this.HomeStackScreen} />
              <Tab.Screen name="carforSale" component={this.DetailsStackScreen} />
              <Tab.Screen name="shippingCalculator" component={this.shippingStackScreen} />
              <Tab.Screen name="cancelledCars" component={this.cancelledStackScreen} />
          </Tab.Navigator>
          */
           
         
          //<Tab.Navigator   tabBar={props => <MyTabBar  icons={this.state.icons}  {...props} />}>
          // <Tab.Screen name="Home" component={HomeStackScreen} />
          // <Tab.Screen name="Settings" component={SettingsScreen} />
          //</Tab.Navigator>
      );
    }

}
