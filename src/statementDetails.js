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
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-elements';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import  Loader  from '../components/Loader.js';
import  ModalMsg  from '../components/ModalMsg.js';
import I18n from 'react-native-i18n';

const {width, height} = Dimensions.get('window'); 


export default class StatementDetais extends Component {

    constructor(props){
        super(props);
        this.state = {
            setd: '',
            search: '',
            fulldata: [],
            searcharrayLotvin: [],
            post_page   : 0,
            load_more   : false,
          }
    }

    async componentDidMount() {
        //const username = await AsyncStorage.getItem('loggedin'); 
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
        formData.append('invoice_id',  this.props.route.params.invoice_id);
       
        var Url  = AuthContext.server_url + "/Nejoum_App/invoiceDetails";
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
                    fulldata   : response.data,
                    post_page   : response.data.length  
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
            console.warn(error);
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
        
        <SafeAreaView style={{flex:1, backgroundColor:'#fff'}}>
        <ScrollView contentContainerStyle = {styles.container}>
                <View  style={{flex: 1}}>
                {
                (this.state.fulldata.length > 0)? this.state.fulldata.map((item,i) => {
                    var due = parseFloat(Math.floor(item.amount_due) + Math.floor(item.storage_fine),2).toFixed(2);
                    return (
                        
                        <Animatable.View 
                            animation="fadeInUp" 
                            duration = {700}>
                                <View style = {{flex:1,
                                    height:height*0.35, marginLeft:'2%', marginRight:'2%', marginTop:'5%'}}>
                                    <View style={{margin:'6%'}}>
                                        <View style={{flexDirection:'column'}}>
                                            <Text style={{color:'green', fontSize: width*0.04}}>
                                                {strings('car.paid')}
                                            </Text>
                                            <Text style={{ color: "#343D40", justifyContent:'center', fontSize: width*0.09}}>
                                                AED {this.props.route.params.totalBill} 
                                            </Text>
                                        </View>
                                        <View style={{flexDirection:'row', borderBottomColor:'#343D40', borderBottomWidth:1, marginTop: '2%', marginBottom: '4%'}}>

                                        </View>
                                            <View style={{flexDirection:'column'}}>
                                                <Text style={{color: '#343D40', flexDirection:'row', marginTop:'2%'}}>{strings('car.details')}</Text>
                                                <Text style={{color: '#343D40', flexDirection:'row', marginTop:'2%'}}>
                                                        {(item.carMakerName.substr(0,item.carMakerName.indexOf(' ')) != '')?
                                                            item.carMakerName.substr(0,item.carMakerName.indexOf(' ')):item.carMakerName} {
                                                            (item.carModelName.substr(0,item.carModelName.indexOf(' ')) != '')?
                                                            item.carModelName.substr(0,item.carModelName.indexOf(' ')):item.carModelName} {item.year}
                                                </Text>
                                                <Text style={{color:'#005FB7', fontSize:  width*0.04, marginTop:'2%'}}>
                                                        Lot#{item.lotnumber}
                                                </Text>
                                                <Text style={{color:'#7F7F7F', fontSize:  width*0.04, marginTop:'2%'}}>
                                                        VIN#{item.vin}
                                                </Text>
                                            </View>
                                        <View style={{flexDirection:'row', marginTop: '4%', marginBottom: '4%'}}></View>
                                        <View style={{flexDirection:'row', justifyContent:'space-between', width:width*0.5}}>
                                            <Text style={{color:'#343D40', fontSize: width*0.04, marginTop:'2%'}}>
                                                {strings('car.amount_due')}
                                            </Text>
                                            <Text style={{color:'#7F7F7F', fontSize: width*0.04, marginTop:'2%'}}>
                                                AED {due}
                                            </Text>
                                        </View>
                                        <View style={{flexDirection:'row', justifyContent:'space-between', width:width*0.5}}>
                                            <Text style={{color:'#343D40', fontSize: width*0.04, marginTop:'2%'}}>
                                                {strings('car.amount_paid')}
                                            </Text>
                                            <Text style={{color:'#7F7F7F', fontSize: width*0.04, marginTop:'2%'}}>
                                                AED {item.amount_paid}
                                            </Text>
                                        </View>
                                    </View>
                                </View> 
                        </Animatable.View>
                        
                    )
                    }):<View><Text>No data</Text></View>
                    }
                    <View style={{flexDirection:'row', marginLeft:'7%', marginTop:'8%', borderTopWidth:1, borderTopColor: '#707070', 
                        padding: '5%', flex:1, width:'86%', justifyContent:'center',}}>
                        <Text style={{color:'#343D40',}}>
                        {strings('dashboard.comName')}</Text>
                    </View>
                </View>
        </ScrollView></SafeAreaView>
    )
    }
}

//export default Dashboard
const styles = StyleSheet.create({
    container: {
       flexGrow: 1
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowContainer2: {
        flexDirection: I18n.locale == 'ar'? 'row': 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    blogTitle: {
        color: '#000',
        fontSize: 20,
        lineHeight: 24,
        padding: 8,
        textAlign: 'center'
    },
    blogTextLeft: {
        color: '#334a93',
        fontSize:  width*0.04,
        padding: 4,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flex: 1
    },
    blogTextRight: {
        color: '#818181',
        fontSize:  width*0.04,
        padding: 4,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
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
    buttonText22: {
        fontSize: 15,
        textAlign: 'center',
        margin: 10,
        color: '#767676',
        backgroundColor: 'transparent',
    },
    buttonTextbig: {
        fontSize: 15,
        textAlign: 'center',
        margin: 2,
        color: '#707070',
        backgroundColor: 'transparent',
    },
    buttonTextbig2: {
        fontSize: 22,
        textAlign: 'center',
        margin: 10,
        color: '#3a3a3a',
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
        flex:1,
        backgroundColor:'#fff',
        flexDirection:'row',
        margin:'2%',
        borderRadius: 25,
        justifyContent:'center',
        alignItems:'center',
        height: height*0.17,
        justifyContent: 'center',
        shadowColor: "#b3c4e8",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 2,
    },
    buttonNav2:{
        width:width,
        height: height*0.2,
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
        height: height*0.2,
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
        marginLeft:'4%',
        width:width,
        height: height*0.2,
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
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
    ImageIconStyle: {
        width: '90%',
        resizeMode: 'contain',
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
    numbergradientLayer2: {
        width: width-50,
        flexDirection:'row',
        height: height*0.2,
        marginLeft:'10%',
        paddingLeft:20,
        flex:1,
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        zIndex: 200,
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
    buttonTextup: {
        fontSize: 15,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        marginTop: 2,
        color: '#000',
        backgroundColor: 'transparent',
    },image: {
        flex: 1,
        width: '100%',
        resizeMode: "cover",
        justifyContent: "center"
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
    numbergradient: {
        width: '50%',
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,

    },ImageIconStyle2: {
       
        height: 80,
        resizeMode: 'contain',
    },
    normalgreyText: {
        color: '#A3A9AF',
        fontSize:  width*0.04,
    },
    normalgreyTextHeader: {
        fontSize:  width*0.04,
        color: '#676767',
    },
});