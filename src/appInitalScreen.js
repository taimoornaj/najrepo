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
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  SafeAreaView
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import  Loader  from '../components/Loader.js';
import Share2 from 'react-native-share';
import ImgToBase64 from 'react-native-image-base64';
import FastImage from 'react-native-fast-image';											
import commonStyle from '../assets/style/styles.js';
import I18n from 'react-native-i18n';

const {width, height} = Dimensions.get('window'); 
export default class appInitalScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            loader      : false,
            fulldata    : [],
            post_page   : 0,
            load_more   : false,
            arrays      :[],
            visibleImage: false
          }
    }

    
    render(){
        if(this.state.loader){
            return(
                <Loader loader={this.state.loader}></Loader>
            );
        }

        if(this.state.load_more){
            var load_more = <View style={{backgroundColor:'transparent', flex:1, justifyContent:'center', alignItems:'center'}}>
                                <Image source={require("../assets/loadingapp.gif")}
                                    style={{borderWidth:1, justifyContent:'center', width:50, height:50, alignItems:'center', flex:0.2}}
                                    resizeMode="contain">
                                </Image>
                            </View>;
          }
          else{
            var load_more = [];
          }
 
        return (
            <ScrollView
                contentContainerStyle = {styles.container}
                scrollEventThrottle = {400}>
            <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <View style={{ flexDirection:'row', 
                    marginBottom:'2%', padding: '5%'}}>
                    <Text style={{color:'#343D40',textAlign:
                                I18n.locale=='en'?'left':'right',}}>
                    {strings('main.select_service_options')}</Text>
            </View>
                <TouchableOpacity
                  onPress = {() => this.props.navigation.navigate('carforSale2')}
                  style={{justifyContent:'center', alignItems:'center',
                      padding:'6%',
                      borderRadius:10, margin:'5%',
                      width:'65%', backgroundColor:'#fff', borderWidth:0.5, borderColor:'#707070',
                      flexDirection:'row'}}>
                    <Animatable.View
                      animation="zoomIn"
                      style={{flex:1, flexDirection:'row', }}
                      duration = {2000}>
                        <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center',flex:1,}}>
                            <View style={{flex: 0.3}}>
                                <Image
                                  source={require('../assets/images/car_statement.png')}
                                  resizeMode={"contain"}
                                  style={commonStyle.image3d6}
                                />
                            </View>
                            <View style={{flex: 1, flexDirection:'column'}}>
                                <Text style={[commonStyle.fontsizeGlobalbig, {textAlign:
                                I18n.locale=='en'?'left':'right', color: '#343D40',
                                 fontSize:width*0.05, fontWeight:'500', marginBottom: '4%'}]}>
                                    {"Cars For Sale"}</Text>
                                <Text style={[commonStyle.fontsizeGlobalbig, {textAlign: I18n.locale=='en'?'left':'right', color: '#707070', 
                                    textAlign: I18n.locale=='en'?'left':'right', fontSize:width*0.04}]}>
                                    {strings('main.carsSellDes')}</Text>
                            </View>
                        </View>
                    </Animatable.View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress = {() => this.props.navigation.navigate('addServiceRequest')}
                  style={{justifyContent:'center', alignItems:'center',
                      padding:'6%',
                      margin:'2%',
                      borderRadius:10,
                      width:'65%', backgroundColor:'#fff', borderWidth:0.5, borderColor:'#707070',
                      flexDirection:'row'}}>
                    <Animatable.View
                      animation="zoomIn"
                      style={{flex:1, flexDirection:'row', }}
                      duration = {2000}>
                        <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center',flex:1,}}>
                            <View style={{flex: 0.3}}>
                                <Image
                                  source={require('../assets/images/payments.png')}
                                  resizeMode={"contain"}
                                  style={commonStyle.image3d6}
                                />
                            </View>
                            <View style={{flex: 1, flexDirection:'column'}}>
                                <Text style={[commonStyle.fontsizeGlobalbig, {textAlign: I18n.locale=='en'?'left':'right', color: '#343D40',
                                 fontSize:width*0.05, fontWeight:'500', marginBottom: '4%'}]}>
                                    {strings('main.service_request')}</Text>
                                <Text style={[commonStyle.fontsizeGlobalbig, {textAlign: I18n.locale=='en'?'left':'right', color: '#707070', 
                            textAlign: I18n.locale=='en'?'left':'right', fontSize:width*0.04}]}>
                                    {strings('main.otherTrafficDes')}</Text>
                            </View>
                        </View>
                    </Animatable.View>
                </TouchableOpacity>
            </View>
        </ScrollView>
        )
    }
}

//export default Dashboard

const styles = StyleSheet.create({
    container: {
       flexGrow: 1,
       justifyContent:'center', 
       alignItems:'center'
       /**justifyContent: 'center',
      /**alignItems: 'center',
      backgroundColor: '#ebebeb',
      margin: 10,**/
    },
    footerModel: {
        backgroundColor: '#0d5db8',
        flexDirection: "row",
        alignItems: "center",
        width: '75%',
        borderBottomLeftRadius: 50,
        alignSelf: 'flex-end',
        paddingBottom: 10,
        paddingTop: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 18,
        backgroundColor : "#0000"
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
      color: '#101010',
      fontSize: 24,
      fontWeight: 'bold',
    },
    linearGradient: {
        flex: 1,
        /**paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5**/
    },
    numbergradient: {
        flex: 3,
        width: '75%',
        borderTopRightRadius: 25,
        marginTop: 6
    },
    buttonText: {
        fontSize: 20,
        color: '#0d5db8',
    },
    buttonNav:{
        width: 120,
        height: 100,
        margin: 20,
        borderRadius: 20,
        borderColor: '#ffff',
        backgroundColor: '#ffff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
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
    },
    tinyLogo: {
        resizeMode: 'contain',
        width: 180,
        height: 100
    },
    image: {
        flex: 1,
        resizeMode: "stretch",
        width: '100%',
        justifyContent: "center",
        borderTopRightRadius: 40,
        borderBottomLeftRadius: 40
    }, 
    iconstyle: {
        resizeMode: "cover",
        justifyContent: "center",
        width: 20,
        height: 20
    },
    leftContainer: {
        flex: 0.3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rightContainer: {
        flex: 0.7,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    normalText: {
        color: '#ffff',
    },
    normalgreyText: {
        color: '#A3A9AF',
    },
    normalgreyTextHeader: {
        fontSize: 16,
        color: '#676767',
    }
});