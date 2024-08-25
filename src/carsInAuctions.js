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
  FlatList,
  ImageBackground,
  AsyncStorage,
  SafeAreaView,
  Alert,
  ToastAndroid,
  Dimensions,
  Linking
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-elements';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import  Loader  from '../components/Loader.js';
import  ModalMsg  from '../components/ModalMsg.js';
import I18n from 'react-native-i18n';
import { Container, Header, Tab, Tabs, TabHeading } from 'native-base';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import commonStyle from '../assets/style/styles.js';
import Clipboard from '@react-native-community/clipboard';
import { Table, TableWrapper,Col, Cols, Cell,Row,Rows } from 'react-native-table-component';
const {width, height} = Dimensions.get('window'); 
  
const elementImage = (carImage, auctionUrl) => (
    (auctionUrl !== undefined )?
    (<TouchableOpacity style={{flex:1, justifyContent:'center', alignItems:'center'}} onPress={() => Linking.openURL(auctionUrl)}>
    <Image
        resizeMode={"contain"}
        style={{width:'100%', height:'100%'}} 
        source={{uri: carImage}}
    />
</TouchableOpacity>):(<TouchableOpacity style={{flex:1, justifyContent:'center', alignItems:'center'}} onPress={() => Alert.alert('info', 
strings('main.car_deleted'), [
                        {text: 'Okay'}
                    ])}>
        <Image
            resizeMode={"contain"}
            style={{width:'100%', height:'100%'}} 
            source={{uri: carImage}}
        />
    </TouchableOpacity>)
    
);


//function Dashboard () {
export default class CarsInAuctions extends Component {

    constructor(props){
        super(props);
        this.state = {
            fulldata: [],
            tableHead: ['', strings('car.details'), strings('car.auction'), strings('car.purchase_date'), strings('main.price')],
            tableData: [
                ['1', '2', '3'],
                ['a', 'b', 'c'],
                ['1', '2', '3'],
                ['a', 'b', 'c']
            ]
        }
    }

    setTextCopy = (lotnumber) => {
        Clipboard.setString(lotnumber);
        ToastAndroid.show(strings('main.number_copied'), ToastAndroid.SHORT);
    }

    elementDetails = (carMakerName, year, carModelName, lotnumber) => (
        <View>
            <Text style={[styles.textbody]}>{carMakerName} {year}</Text>
            <Text style={styles.textbody}>{carModelName}</Text>
            <Text style={[styles.textbody]} selectable>Lot#: {lotnumber}</Text>
        </View>
        
    );

    elementbill = (price, file) => (
        /**<TouchableOpacity
            onPress = {() => this.props.navigation.navigate('pafPreview',
                {"file": file})}>
                
        </TouchableOpacity>*/
        <Text style={[styles.textbody, {color:'#B80D0D'}]}>{price} $</Text>
    );
    componentDidMount() {
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
        var Url  = AuthContext.server_url + "/Nejoum_App/carsTodayDetalies";
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
                var temparr = [];
                var totalCost = 0;
                response.data.forEach(element => {
                    var objectarr = [];
                    //var carImage = AuthContext.server_url + '/uploads/'+ element.photo;
                    var carImage = element.image_small;
                    objectarr.push(elementImage(carImage, element.auctionUrl));
                    //var details = element.carMakerName + ' '+ element.year + '\n'+ element.carModelName + '\n Lot#: '+element.lotnumber
                    objectarr.push(this.elementDetails(element.carMakerName, element.year, element.carModelName, element.lotnumber));
                    objectarr.push(element.aTitle+'\n'+element.auction_location_name);
                    objectarr.push(element.purchasedate);
                    objectarr.push(this.elementbill(element.calculation.total$, element.invoice_file_auction));
                    totalCost = parseFloat(totalCost) + parseFloat(element.calculation.total$);
                    temparr.push(objectarr);
                });
                this.setState({
                    loader      : false,
                    fulldata    : temparr,
                    totalcarcost: parseFloat(totalCost).toFixed(2)
                  });
                return;
            }
            else {
                if(response.data.length == 0){
                    this.setState({
                        loader      : false,
                        no_data: true
                    });
                }else {
                    this.setState({
                        loader      : false,
                        error_message    : 'error'   
                    });
                    Alert.alert('Error', 'Error Occured', [
                        {text: 'Okay'}
                    ]);
                }
                return;
            }
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

        if(this.state.no_data){
            return(
                <View style={commonStyle.backgroundimage}>
                    <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
                        <Text style={commonStyle.noDataText}>
                            {strings('main.no_data')}
                        </Text>
                    </View>
                </View>
            );
        }
        const tablefooter = ['', '', '', '', <View style={{flex:1, justifyContent:'center', backgroundColor:'#ffa300'}}>
        <Text style={{color: '#fff', fontSize: 18, textAlign:'center'}}>{this.state.totalcarcost}
        </Text>
    </View>];
        return (
            <View style={styles.image}>
                <SafeAreaView style={{marginBottom:height*0.05, backgroundColor:'transparent', flex:1}}>
                    <ScrollView contentContainerStyle = {styles.container}>
                        <View style={{marginBottom:height*0.03}}>
                        <TableWrapper>
                            <Row data={this.state.tableHead} borderStyle= {{borderWidth: 1, borderColor: '#fff'}} style={styles.head} textStyle={styles.text}/>
                            <Rows data={this.state.fulldata} borderStyle= {{borderWidth: 1, borderColor: '#ccc'}} style={styles.row} textStyle={styles.textbody}/>
                        </TableWrapper>
                        <View style={{justifyContent:'center', alignItems:'center', borderTopColor:'#ccc', 
                        borderTopWidth:5}}>    
                            <LinearGradient colors = {['#0ba00f','#067409']} style={{padding:'2%', margin:'2%', width:'50%', borderRadius:25,
                            flexDirection:'row', flex:1, justifyContent:'center', alignItems:'center'}}>
                                <Text style = {{color: '#fff',  
                                                fontSize: 18, textAlign:'center'}}>
                                    {this.state.totalcarcost}
                                </Text>
                            </LinearGradient>
                        </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
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
    head: {  height: 40,  backgroundColor: '#ccc',  },
    wrapper: { flexDirection: 'row' },
    title: { flex: 1, backgroundColor: '#ccc' },
    text: { textAlign: 'center', color:'#013188' },
    textbody: { textAlign: 'center', color:'#000',fontSize:12 }
});