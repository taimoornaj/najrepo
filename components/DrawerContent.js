import React from 'react';
import { View, StyleSheet, Image, BackHandler,ToastAndroid,Dimensions  } from 'react-native';
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch,
    I18nManager,
    Alert,
    DevSettings
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import { strings } from '../locals/i18n';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { AuthContext } from '../components/context';
import AsyncStorage from '@react-native-community/async-storage';
import I18n from 'react-native-i18n';
import RNRestart from 'react-native-restart';
import SplashScreen from './SplashScreen';
import  Loader  from '../components/Loader.js';
import { useTailwind } from "tailwind-rn";
import Icon2 from "react-native-vector-icons/FontAwesome";
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
//import DrawerItem from "./atoms/DrawerItem";

const {width, height} = Dimensions.get('window');

export function DrawerContent(props) {

  const tailwind = useTailwind();

    const forgetUser = async () => {
        try {
            var device_id = await AsyncStorage.getItem('device_id');
            const formData = new FormData();
            formData.append('client_id', '1230');
            formData.append('client_secret', '1230NEJOUM1230');
            formData.append('customer_id',AuthContext.id);
            formData.append('Device_push_regid', AuthContext.device_id);
            var Url        = AuthContext.server_url+"/Nejoum_App/logout";
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
            .then(async (response) => {
                const MyContext = React.createContext();
                if(response.success == 'success'){
                    await AsyncStorage.removeItem('loggedin');
                    await AsyncStorage.removeItem('customer_id');
                    await AsyncStorage.removeItem('server_url');
                    await AsyncStorage.removeItem('lang');
                    await AsyncStorage.removeItem('logged_id');
                    await AsyncStorage.removeItem('name');
                    await AsyncStorage.removeItem('type');
                    await AsyncStorage.removeItem('username');
                    return;
                }
                else{
                    this.setState({
                        loader: false,
                        error_message: strings('main.network_error'),
                        userName: userName,
                        password: password
                        //modalmsg: true,
                        //pageload: 'SignInScreen'
                    });
                    Alert.alert(strings('main.error'), strings('main.accountnotexist'), [
                        {text: strings('main.ok')}
                    ]);
                    return;
                }
            });
            } catch (error) {   // Error removing
        }

        props.navigation.closeDrawer();
        props.navigation.navigate("SignInScreen");
    };

     componentDidMount = async() => {
        this.set_language();
    }

    handleLanguageChange = lang => {
		AsyncStorage.setItem("lang", lang)
			.then(data => {
				RNRestart.Restart();
			})
			.catch(err => {
				console.log("err");
			});
	}

    change_language = () => {
            if(I18n.locale == 'en'){
                I18n.locale = 'ar';
                AsyncStorage.setItem("lang",'ar');
            }else {
                I18n.locale = 'en';
                AsyncStorage.setItem("lang",'en');
            }

            //SplashScreen.show();
            //this.setState({loader: true});
           // ToastAndroid.show("A pikachu appeared nearby !", ToastAndroid.SHORT);
           //RNRestart.Restart();
            //DevSettings.reload();
            ToastAndroid.show('Changing Language', ToastAndroid.SHORT);
            RNRestart.Restart();
            props.navigation.closeDrawer();
            //props.navigation.navigate("HomeDrawer");
        }

    set_language = async() => {
        var lang = await AsyncStorage.getItem("lang");
        if(lang)
            I18n.locale = lang;
        else
            AsyncStorage.setItem("lang",I18n.locale);
    }

    const paperTheme = useTheme();
    return (

        <View style={{flex:1, top:-5}}>
            <DrawerContentScrollView {...props}>
                <View style = {styles.drawerContent}>
                    {/*<View style={{height:220,width:'100%',backgroundColor:"#fff"}}>*/}
                    <View style={[tailwind("h-[10rem] w-full bg-white"),]}>
                      <View style={{flexDirection: I18n.locale == 'ar'?'row-reverse':'row'}}>
                      <Image
                        source= {I18n.locale=='ar'?require('../assets/images/side_ar.png'):require('../assets/images/logo-blue-text.png')}
                        style={[styles.Imagelogo,]}
                      />
                      </View>
                      
                      <View>
                        <Text
                          style={tailwind(
                            `row text-darkblue  ${
                              I18n.locale == 'ar' ? 'text-right' : 'text-left'
                            }   text-xl   font-semibold pt-6 pl-6 pr-4 `,
                          )}>
                          {strings('main.good_morning')}
                        </Text>
                      </View>
                    </View>

                  <View style = {styles.userInfoSection}>
                    <View style={{flexDirection:'row'}}>
                        <FontAwesomeIcon
                            icon={ faUserCircle }
                            color="orange"
                            size={width*0.06}
                        />

                      <View style={{marginLeft:4, flexDirection:'column'}}>
                        <Title style={tailwind('text-base text-darkblue pl-1 capitalize ')}>{AuthContext.name}</Title>
                      </View>
                    </View>
                  </View>

                  <Drawer.Section style={styles.drawerSection}>
                    {
                      AuthContext.type == '2'?(null):(<DrawerItem
                        style={{borderBottomWidth: 1, borderBottomColor:'#707070'}}
                        icon={({color, size}) => (
                          <Icon
                            color={color}
                            size={size}
                          />
                        )}
                        labelStyle={styles.textDrawer}
                        label={strings('main.profile')}
                        onPress={() => {props.navigation.navigate('profile')}}
                      />)
                    }

                    <DrawerItem style={{borderBottomWidth: 1, borderBottomColor:'#707070'}}
                      icon={({color, size}) => (
                        <Icon
                          color={color}
                          size={size}
                        />
                      )}

                      labelStyle={styles.textDrawer}
                      label={strings('main.files')}
                      onPress={() => {props.navigation.navigate('filesNav')}}
                    />

                    
                      <DrawerItem style={{borderBottomWidth: 1, borderBottomColor:'#707070'}}
                            icon={({color, size}) => (
                                <Icon
                                color={color}
                                size={size}
                                />
                            )}
                            labelStyle={styles.textDrawer}
                            label={strings('main.my_requests')}
                            onPress={() => {props.navigation.navigate('MyRequests')}}
                        />
                        <DrawerItem style={{borderBottomWidth: 1, borderBottomColor:'#707070'}}
                            icon={({color, size}) => (
                                <Icon
                                color={color}
                                size={size}
                                />
                            )}
                            labelStyle={styles.textDrawer}
                            label={strings('main.damage_request')}
                            onPress={() => {props.navigation.navigate('MyDamagedCarsRequest')}}
                        />

                        <DrawerItem style={{borderBottomWidth: 1, borderBottomColor:'#707070'}}
                            icon={({color, size}) => (
                                <Icon
                                color={color}
                                size={size}
                                />
                            )}
                            labelStyle={styles.textDrawer}
                            label={strings('main.paid_bill')}
                            onPress={() => {props.navigation.navigate('MyPaidByCustomerRequest')}}
                        />
                        <DrawerItem style={{borderBottomWidth: 1, borderBottomColor:'#707070'}}
                            icon={({color, size}) => (
                                <Icon
                                  color={color}
                                  size={size}
                                />
                            )}
                            labelStyle={styles.textDrawer}
                            label={strings('main.my_authorized_persons')}
                            onPress={() => {props.navigation.navigate('MyAuthorizedRequests', {'refresh': Math.random().toString()})}}
                        />

<DrawerItem style={{borderBottomWidth: 1, borderBottomColor:'#707070'}}
                            icon={({color, size}) => (
                                <Icon
                                color={color}
                                size={size}
                                />
                            )}
                            labelStyle={styles.textDrawer}
                            label={strings('main.MyCarsAdded')}
                            onPress={() => {props.navigation.navigate('MyCarsAdded', {'refresh': Math.random().toString()})}}
                        />
                        
                        <DrawerItem style={{borderBottomWidth: 1, borderBottomColor:'#707070'}}
                            icon={({color, size}) => (
                                <Icon
                                color={color}
                                size={size}
                                />
                            )}
                            labelStyle={styles.textDrawer}
                            label={strings('main.buyerAcc')}
                            onPress={() => {props.navigation.navigate('MyBuyerRequest', {'refresh': Math.random().toString()})}}
                        />

                         <DrawerItem style={{borderBottomWidth: 1, borderBottomColor:'#707070'}}
                            icon={({color, size}) => (
                                <Icon
                                color={color}
                                size={size}
                                />
                            )}
                            labelStyle={styles.textDrawer}
                            label={strings('main.add_ons_services_list')}
                            onPress={() => {props.navigation.navigate('MyShippingServicesRequest', {'refresh': Math.random().toString()})}}
                        />
                        
                        <DrawerItem style={{borderBottomWidth: 1, borderBottomColor:'#707070'}}
                            icon={({color, size}) => (
                                <Icon
                                color={color}
                                size={size}
                                />
                            )}
                            labelStyle={styles.textDrawer}
                            label={strings('main.cancelled_cars')}
                            onPress={() => {props.navigation.navigate('cancelledCars')}}
                        />
                        <DrawerItem style={{borderBottomWidth: 1, borderBottomColor:'#707070'}}
                            icon={({color, size}) => (
                              <Icon
                                color={color}
                                size={size}
                              />
                            )}
                            labelStyle={styles.textDrawer}
                            label={strings('main.about')}
                            onPress={() => {props.navigation.navigate('aboutCompany')}}
                        />

                        <DrawerItem style={{borderBottomWidth: 1, borderBottomColor:'#707070'}}
                            icon={({color, size}) => (
                                <Icon
                                color={color}
                                size={size}
                                />
                            )}
                            labelStyle={styles.textDrawer}
                            label={strings('main.branches')}
                            onPress={() => {props.navigation.navigate('BranchesCompany')}}
                        />


                        <DrawerItem style={{borderBottomWidth: 1, borderBottomColor:'#707070'}}
                            icon={({color, size}) => (
                                <Icon
                                color={color}
                                size={size}
                                />
                            )}
                            labelStyle={styles.textDrawer}
                            label={strings('main.contact')}
                            onPress={() => {props.navigation.navigate('contactCompany')}}
                        />


                        <DrawerItem style={{borderBottomWidth: 1, borderBottomColor:'#707070'}}
                            icon={({color, size}) => (
                                <Icon
                                color={color}
                                size={size}
                                />
                            )}
                            labelStyle={styles.textDrawer}
                            label={strings('main.lang')}
                            onPress={() => change_language()}
                        />
                        <DrawerItem style={{borderBottomWidth: 1, borderBottomColor:'#707070'}}
                            icon={({color, size}) => (
                                <Icon
                                color={color}
                                size={size}
                                />
                            )}
                            labelStyle={styles.textDrawer}
                            label={strings('main.wyouloggin')}
                            onPress={() => {props.navigation.navigate('wyouloggin')}}
                        />
                         <DrawerItem style={{borderBottomWidth: 1, borderBottomColor:'#707070'}}
                            icon={({color, size}) => (
                                <Icon
                                color={color}
                                size={size}
                                />
                            )}
                            labelStyle={styles.textDrawer}
                            label={strings('main.logout')}
                             onPress={() => forgetUser()}
                        />
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
      width: width*0.7,
    },
    userInfoSection: {
      paddingLeft: 21,
      marginTop: '2%',
    },
    userInfoTopSection: {
        borderBottomLeftRadius: 100,
        backgroundColor: '#0b4282'
    },
    title: {
      fontSize:  I18n.locale == 'ar'?15: 15,
      color: '#000'
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      textAlign: 'left',
      width: "100%"
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#0d5db8',
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    Imagelogo : {
      marginLeft: 15,
      marginTop: 20,
      marginBottom: 20,
        width: '60%',
        height: 55,
      alignItems:'flex-start',
      justifyContent:'flex-start',

        resizeMode: 'contain',
    },
    textDrawer: {
        color: '#113083',
        textAlign: I18n.locale = 'ar'?'right':left
    }
  });
