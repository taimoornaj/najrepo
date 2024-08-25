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
  TouchableOpacity,
  Alert,
  Dimensions
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import  Loader  from '../components/Loader.js';
import commonStyle from '../assets/style/styles.js';
import I18n from 'react-native-i18n';

const {width, height} = Dimensions.get('window'); 

export default class DebitCarsStatement extends Component {
    constructor(props){
        super(props);
        this.state = {
            setd: '',
            search: '',
            allcount: 0,
            cancelledCount:0,
            searcharrayLotvin: []
          }
    }

    async componentDidMount() {
        this.getData();
        
    }

    getData = () => {
        this.setState({
            loader          : true
        });
        var start     = this.state.start;
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('customer_id', AuthContext.id);
        var Url  = "https://api.nejoumaljazeera.co/api/getCustomerBalancenoAuth?customer_id="+AuthContext.id;
        fetch(Url, {
            method: 'GET',
            credentials: 'same-origin',
        })
        .then((response) => {
            if(response.ok){
              return response;
            }
            throw Error(response.success);
        })
        .then(res => res.json())
        .then((response) => {
            this.setState({
                loader      : false,
                shippedBalance   : response.shippedBalance,
                gneralBalance    : response.gneralBalance,
                AuctionBalance   : response.AuctionBalance,
                totalDebit       : response.data  
                });
            return;
  
        })
        .catch((error) => {
            this.setState({
                loader      : false,
                error_message    : error  
            });
            console.log(error);
            Alert.alert('Error', 'Connection Error', [
                {text: 'Okay'}
            ]);
        });  
    }


    render(){
        if(this.state.loader){
            return(
                <Loader loader={this.state.loader}></Loader>
            );
        }
        return (
                <View style={{flex:1, alignItems:'center',backgroundColor:'#EDEDED' }}>
                    <View style={{marginTop:'10%', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                        <Text style={{color: '#343D40', fontSize:width*0.08}}>{strings('main.gerneral_due')}</Text>
                        <Text style={{color: '#a30000', fontSize:width*0.06}}>
                            AED {this.state.totalDebit} </Text>
                    </View>
                    <View style={{ flexDirection:'row', 
                            marginBottom:'2%', padding: '5%'}}>
                        <Text style={{color:'#343D40',}}>{strings('main.StatementDES')}</Text>
                    </View>
                    <TouchableOpacity
                        onPress = {() => this.props.navigation.navigate('notPaidinauctions')}
                        style={{justifyContent:'center', alignItems:'center',
                        padding:'6%',
                        borderRadius:10,
                        width:'95%', backgroundColor:'#fff', borderWidth:0.5, borderColor:'#707070',
                        flexDirection:'row'}}>
                        <Animatable.View
                          animation="zoomIn"
                          style={{flex:1, flexDirection:'row', }}
                          duration = {2000}>
                            <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center',flex:1,}}>
                                <View style={{flex: 0.3}}>
                                    <Image
                                      source={require('../assets/images/auction-cars-icon.png')}
                                      resizeMode={"contain"}
                                      style={commonStyle.image3d6}
                                    />
                                </View>
                                <View style={{flex: 1, flexDirection:'column'}}>
                                    <Text style={[commonStyle.fontsizeGlobalbig, {textAlign:I18n.locale=='en'?'left':'right', color: '#343D40',
                                     fontSize:width*0.05, fontWeight:'500', marginBottom: '4%'}]}>
                                        {strings('main.notPaidinauctions')}</Text>
                                </View>
                            </View>
                        </Animatable.View>
                    </TouchableOpacity>
  
                    <TouchableOpacity
                      onPress = {() => this.props.navigation.navigate('shippedcarsstmt')}
                      style={{justifyContent:'center', alignItems:'center',
                          padding:'6%',
                          margin:'2%',
                          borderRadius:10,
                          width:'95%', backgroundColor:'#fff', borderWidth:0.5, borderColor:'#707070',
                          flexDirection:'row'}}>
                        <Animatable.View
                          animation="zoomIn"
                          style={{flex:1, flexDirection:'row', }}
                          duration = {2000}>
                            <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center',flex:1,}}>
                                <View style={{flex: 0.3}}>
                                    <Image
                                      source={require('../assets/images/arrived-cars-icon.png')}
                                      resizeMode={"contain"}
                                      style={commonStyle.image3d6}
                                    />
                                </View>
                                <View style={{flex: 1, flexDirection:'column'}}>
                                    <Text style={[commonStyle.fontsizeGlobalbig, {textAlign:I18n.locale=='en'?'left':'right', color: '#343D40',
                                     fontSize:width*0.05, fontWeight:'500', marginBottom: '4%'}]}>
                                        {strings('main.shipped_cars')}</Text>
                                </View>
                            </View>
                        </Animatable.View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress = {() => this.props.navigation.navigate('generalunpaidstmt',
                      {"sumBalance": this.props.route.params.sumBalance})}
                      style={{justifyContent:'center', alignItems:'center',
                          padding:'6%',
                          borderRadius:10,
                          width:'95%', backgroundColor:'#fff', borderWidth:0.5, borderColor:'#707070',
                          flexDirection:'row'}}>
                        <Animatable.View
                          animation="zoomIn"
                          style={{flex:1, flexDirection:'row', }}
                          duration = {2000}>
                            <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center',flex:1,}}>
                                <View style={{flex: 0.3}}>
                                    <Image
                                      source={require('../assets/images/detailed-account-icon.png')}
                                      resizeMode={"contain"}
                                      style={commonStyle.image3d6}
                                    />
                                </View>
                                <View style={{flex: 1, flexDirection:'column', width:'100%'}}>
                                    <Text style={[commonStyle.fontsizeGlobalbig, {textAlign:I18n.locale=='en'?'left':'right', color: '#343D40',
                                     fontSize:width*0.05, fontWeight:'500', marginBottom: '4%'}]}>
                                        {strings('main.other_debit')}</Text>
                                </View>
                            </View>
                        </Animatable.View>
                    </TouchableOpacity>
                    <View style={{ flexDirection:'row', marginTop:'8%', borderTopWidth:1, borderTopColor: '#707070', 
                        padding: '5%', flex:1, width:'90%', justifyContent:'center'}}>
                        <Text style={{color:'#343D40',}}>
                        {strings('dashboard.comName')}</Text>
                    </View>
                </View>
        )
    }
}

//export default Dashboard



const styles = StyleSheet.create({
    container: {
       flexGrow: 1,
       /**height: height, 
      justifyContent: 'center',
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
        fontSize: 18,
        textAlign: 'left',
        color: '#013188',
        backgroundColor: 'transparent',
    },
    rowView: {
        height: 150,
        flexDirection: 'row',
        flex: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
    },
    buttonNav:{
        width: width-50,
        height: 120,
        justifyContent: 'center',
        marginTop: '30%',
        shadowColor: "#b3c4e8",
        shadowOffset: {
            width: 0,
            height: 25,
        },
        shadowOpacity: 1,
        shadowRadius: 25.00,
        elevation: 24,
    },
    ImageIconStyle: {
        padding: 10,
        margin: 5,
        height: 30,
        width: 30,
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
        resizeMode: "stretch",
        width: '100%',
        justifyContent: "center",
        borderTopRightRadius: 40,
        borderBottomLeftRadius: 40
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
        alignItems: 'center'
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
        fontSize: 20,
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
        bottom: 15,
        padding: 10,
        right: 10,
        color: '#fff',
        fontSize: 22,
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
        borderLeftWidth: 250,
        borderBottomWidth: 100,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'rgba(0, 0, 0, 0.2)', 
        zIndex: 900
    },
    numbergradientLayer2: {
        width: width-50,
        flexDirection:'row',
        height: 120,
        flex:1,
        top:10,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25,
        zIndex: 100,
        borderColor: '#eff4f9',
        position: 'absolute',
        left:0,
        right:0,
    },
    numbergradientLayer3: {
        flexDirection:'row',
        width: '100%',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        height: 140,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        borderRadius: 25,
        borderColor: '#eff4f9',
        zIndex: -500,
    },
    buttonNav2:{
        width:width,
        height: 120,
        flexDirection:'row',
        marginLeft:'14%',
        paddingLeft:20,
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        borderColor: '#eff4f9',
        position: 'absolute',
        left:0,
        right:0,
        backgroundColor: 'yellow',
        zIndex: 200,
    },
    buttonNav3:{
        marginLeft:'8%',
        width:width,
        height: 120,
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        borderColor: '#eff4f9',
        position: 'absolute',
        left:0,
        right:0,
        backgroundColor: '#fff',
        zIndex: -200,
    },
    buttonNav4:{
        width:width-50,
        height: 120,
        borderTopRightRadius: 25,
        borderColor: '#eff4f9',
        position: 'absolute',
        left:0,
        right:0,
        backgroundColor: '#fff',
        zIndex: 20,
    },
    buttonNav5:{
        flex:1,
        justifyContent:'center',
        marginLeft: 0,
        width: width-100,
        height: 80,
        position: 'absolute',
        left: 0,
        right: 0,
        top: -30,
        borderRadius: 15,
        borderColor: '#eff4f9',
        zIndex: -500,
    },
});