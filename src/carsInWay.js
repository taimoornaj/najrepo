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
  Dimensions
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import  Loader  from '../components/Loader.js';
import  ModalMsg  from '../components/ModalMsg.js';
import I18n from 'react-native-i18n';
import { Container, Header, Tab, Tabs, TabHeading } from 'native-base';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import commonStyle from '../assets/style/styles.js';
import Modal from 'react-native-modal';
import { Overlay } from 'react-native-elements';
import { Table, TableWrapper,Col, Cols, Cell,Row,Rows } from 'react-native-table-component';
import ImageViewer from 'react-native-image-zoom-viewer';
import Share from 'react-native-share';
import ImgToBase64 from 'react-native-image-base64';
import Icon from 'react-native-vector-icons/FontAwesome';
import Clipboard from '@react-native-community/clipboard';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShare, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';

const {width, height} = Dimensions.get('window'); 
const radius = height*0.3 / 2;//0.35
const center = radius-15;
const circlesmalsize = height*0.09;



//function Dashboard () {
export default class CarsInWay extends Component {

    constructor(props){
        super(props);
        this.state = {
            fulldata: [],
            visible: false,
            loaderinside: false,
            tableHead: ['', strings('car.details'), strings('car.purchase_date'), strings('main.track')],
            tableData: [
                ['1', '2', '3'],
                ['a', 'b', 'c'],
                ['1', '2', '3'],
                ['a', 'b', 'c']
            ],
            imagesSlider: [],
            visibleImage: false,
            all_data    : []
          }
    }


    elementImage = (carImage, index) => (
            <Image
                resizeMode={"contain"}
                style={{width: '100%', height:50, justifyContent:'center', alignItems:'center'}}
                source={{uri: carImage}}
            />
        
    );

    shareImage = async (images) => {
        await ImgToBase64.getBase64String(images.url)
        .then(base64String => this.doSomethingWith(base64String));
    }

    doSomethingWith = async (varyhy)=> {
        const shareOptions = {
            title: 'Share file',
            url: 'data:image/png;base64,'+varyhy,
            failOnCancel: false,
        }
        try {
            const ShareResponse = await Share.open(shareOptions);
        } catch (error) {
            console.log('Error =>', error);
        }
    }

    fillImagesarr = (index) => {
        //console.warn(this.state.all_data[index].images);
        var images = [];
        var img = '';
        //images.push({url: AuthContext.server_url + '/uploads/'+ this.state.all_data[index].photo});
        images.push({url: this.state.all_data[index].image_small});
        this.state.all_data[index].images.forEach(element => {
            img = AuthContext.server_url  + '/upload/car_images/warehouse_car/' + element.photo_name;
            images.push({url: img})
        });
        this.setState({visibleImage: true, imagesSlider: images});
    }

    elementTotal = (lotnumber) => (
        <TouchableOpacity style={{flex:1, justifyContent:'center', alignItems:'center'}}
            onPress = {() => this.track(lotnumber)}>
                <Text style={[styles.textbody, {color:'#0ba00f'}]}>{strings('main.track')}</Text>
        </TouchableOpacity>
    );

    elementdetails = (carMakerName, year, carModelName, lotnumber) => (
        <View>
            <Text style={[styles.textbody]}>{carMakerName} {year}</Text>
            <Text style={styles.textbody}>{carModelName}</Text>
            <Text style={[styles.textbody]} selectable>Lot#: {lotnumber}</Text>
        </View>
    );
    componentDidMount() {
        this.getData();   
    }

    toggleOverlay = () => {
        this.setState({visible: false});
    }

    track = (lotnumber) => {
        this.setState({
            loaderinside : true,
            visible : true
        });

        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('customer_id', AuthContext.id);
        formData.append('lot_vin',lotnumber);
        var Url  = AuthContext.server_url + "/Nejoum_App/getTrackSearch";
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
                var status_arr = [];
                var obj = {
                    'arrive_store'      : response.data.car_data.arrive_store,
                    'arrived_port'      : response.data.car_data.arrived_port,
                    'shipping_status'   : response.data.car_data.shipping_status,
                    'loading_status'    : response.data.car_data.loading_status,
                    'arrivedstatus'     : response.data.car_data.arrivedstatus
                };

               //console.warn(response.data.deliver_customer);
                this.setState({
                    loaderinside          : false,
                    trackdata       : response.data,
                    car_data        : response.data.car_data,
                    num             : response.data.num,
                    bill            : response.data.bill,
                    auction         : response.data.auction,
                    postedstatus    : response.data.postedstatus,
                    towingstatus    : response.data.towingstatus,
                    arrivedstatus   : response.data.arrivedstatus,
                    planned         : response.data.planned,
                    loading_status  : response.data.loading_status,
                    shipping_status : response.data.shipping_status,
                    arrived_port    : response.data.arrived_port,
                    pick_status     : response.data.pick_status, 
                    arrive_store    : response.data.arrive_store, 
                    deliver_customer: response.data.deliver_customer,
                    last_status     : response.data.lastStatus,
                    lotnumber       : lotnumber,
                  });
                return;
            }
            else {
                this.setState({
                    loaderinside      : false,
                    error_message    : 'error'   
                });
                Alert.alert('Error', 'Error Occured', [
                    {text: 'Okay'}
                ]);
                return;
            }
        })
        .catch((error) => {
            console.log(error);
            this.setState({
                loaderinside      : false,
                error_message    : error  
            });
            Alert.alert('Error', 'Connection Error', [
                {text: 'Okay'}
            ]);
        });
    }

    degToRad = (deg) => {
        return deg * Math.PI / 180;
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
        var Url  = AuthContext.server_url + "/Nejoum_App/carsinway";
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
                    objectarr.push(this.elementImage(carImage));
                    var details = element.carMakerName + ' '+ element.year + '\n'+ element.carModelName + '\n Lot#: '+element.lotnumber
                    objectarr.push(this.elementdetails(element.carMakerName, element.year, element.carModelName, element.lotnumber));
                    objectarr.push(element.purchasedate);
                    objectarr.push(this.elementTotal(element.lotnumber));
                    totalCost = parseFloat(totalCost) + parseFloat(element.totalcarcost);
                    temparr.push(objectarr);
                });
                this.setState({
                    loader      : false,
                    fulldata    : temparr,
                    all_data    : response.data,
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

    setModalVisible = (val) => {
        this.setState({visible:val});
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
        const tablefooter = ['', '', '', <View style={{flex:1, justifyContent:'center', backgroundColor:'#ffa300'}}>
        <Text style={{color: '#fff', fontSize: 18, textAlign:'center'}}>{this.state.totalcarcost}
        </Text>
    </View>];
        
        
        if(this.state.trackdata){
            var storestatus = '';
            var storestatusimg = '';
            var portstatusimg = '';
            var portstatus = '';
            var shippingstatus = '';
            var shippingstatusimg = '';
            var loadingstatus = '';
            var loadingstatusimg = '';
            var arrivedstatus = '';
            var warehousestatus = '';
            var warehousestatusimg = '';
            var towingstatus = '';
            var towingstatusimg = '';
            var newcarstatus = '';
            var newcarstatusimg = '';


            

            newcarstatus = <View style={{flexDirection: 'row', marginTop: '25%', flex: 1, marginBottom: '10%'}}>
                <View style={styles.circleArrived}>
                        <Image
                            style={styles.iconUaePort}
                            source={require('../assets/new_car.png')}
                        />
                </View>
                <View>
                    <Text style={{fontSize:20,alignItems: 'center', flexDirection: 'row', color: '#0d2750'}}>{strings('car.new_cars')}</Text>
                    <Text style={{fontSize:20,color: '#0d2750'}}>{this.state.car_data.purchasedate}</Text>
                </View>
            </View>;
            newcarstatusimg = <View style={[commonStyle.symbolAroundCircleArrived, {
                                                width: circlesmalsize,
                                                height: circlesmalsize,
                                                borderRadius:circlesmalsize / 2,
                                                left: radius * Math.cos(this.degToRad(270)) + center - circlesmalsize / 2,
                                                top: radius * Math.sin(this.degToRad(270)) + center - circlesmalsize / 2,
                                        }]}>
                                    <Image
                                        resizeMode={"contain"}
                                        style={commonStyle.smallIcons}
                                        source={require('../assets/new_car.png')}
                                    />
                                    <View style={{position:'absolute', left:0, top:-height*0.06, width: 100}}>
                                        <Text style={{fontSize:12,alignItems: 'center', flexDirection: 'row', color: '#0d2750'}}>
                                            {strings('car.new_cars')}</Text>
                                        <Text style={{fontSize:12, color: '#0d2750'}}>
                                            {this.state.car_data.purchasedate}</Text>
                                    </View>
                                </View>;


            if(this.state.car_data.towingstatus == 0){
                towingstatus = <View style={{flexDirection: 'row', flex: 1, marginBottom: '10%'}}>
                    <View style={styles.circleUaePort}>
                            <Image
                                style={styles.iconUaePort}
                                source={require('../assets/towing.png')}
                            />
                    </View>
                    <View>
                        <Text style={{fontSize:20,alignItems: 'center', flexDirection: 'row', color: '#818181'}}>{strings('car.towing')}</Text>
                    </View>
                </View>;
                towingstatusimg = <View style={[commonStyle.symbolAroundCirclered, {
                                        width: circlesmalsize,
                                        height: circlesmalsize,
                                        borderRadius:circlesmalsize / 2,
                                        left: radius * Math.cos(this.degToRad(322)) + center - circlesmalsize / 2,
                                        top: radius * Math.sin(this.degToRad(322)) + center - circlesmalsize / 2,
                                        }]} >
                                <Image
                                    resizeMode={"contain"}
                                    style={commonStyle.smallIcons}
                                    source={require('../assets/towing.png')}
                                />
                                <View style={{position:'absolute', left:0, top:-height*0.06, width: 100}}>
                                    <Text style={{fontSize:12,alignItems: 'center', flexDirection: 'row', color: '#0d2750'}}>
                                        {strings('car.towing')}</Text>
                                    <Text style={{fontSize:12, color: '#0d2750'}}>
                                        {(this.state.towingstatus)?this.state.towingstatus.Picked_date:''}</Text>
                                </View>
                            </View>;
            }else{
                towingstatus = <View style={{flexDirection: 'row', flex: 1, marginBottom: '10%'}}>
                    <View style={styles.circleArrived}>
                            <Image
                                style={[styles.iconUaePort]}
                                source={require('../assets/towing.png')}
                            />
                    </View>
                    <View>
                        <Text style={{fontSize:20,alignItems: 'center', flexDirection: 'row', color: '#0d2750'}}>{strings('car.towing')}</Text>
                        <Text style={{fontSize:20, color: '#0d2750'}}>{(this.state.towingstatus)?this.state.towingstatus.Picked_date:''}</Text>
                    </View>
                </View>;
                towingstatusimg = <View style={[commonStyle.symbolAroundCircleArrived, {
                                            width: circlesmalsize,
                                            height: circlesmalsize,
                                            borderRadius:circlesmalsize / 2,
                                            left: radius * Math.cos(this.degToRad(322)) + center - circlesmalsize / 2,
                                            top: radius * Math.sin(this.degToRad(322)) + center - circlesmalsize / 2,
                                            }]} >
                                                <Image
                                                    resizeMode={"contain"}
                                                    style={commonStyle.smallIcons}
                                                    source={require('../assets/towing.png')}
                                                />
                                                <View style={{position:'absolute', left:0, top:-height*0.06, width: 100}}>
                                                    <Text style={{fontSize:12,alignItems: 'center', flexDirection: 'row', color: '#0d2750'}}>
                                                        {strings('car.towing')}</Text>
                                                    <Text style={{fontSize:12, color: '#0d2750'}}>
                                                        {(this.state.towingstatus)?this.state.towingstatus.Picked_date:''}</Text>
                                                </View>
                                </View>;
            }


            if(this.state.last_status == "arrivedstatus"){
                warehousestatus = <View style={{flexDirection: 'row', flex: 1, marginBottom: '10%'}}>
                        <View style={styles.circleArrivedwhite}>
                                <Image
                                    style={styles.iconUaePortArrived}
                                    source={require('../assets/warehouse_arrived.png')}
                                />
                        </View>
                        <View style={styles.halfCircle}>
                                 <Image
                                    style={styles.iconUaePort}
                                    source={require('../assets/spec.png')}
                                /> 
                        </View>
                        <View style={styles.actual}>
                                <Image
                                    style={styles.iconUaePort}
                                    source={require('../assets/arrow_actual.png')}
                                />        
                        </View>
                        <View>
                            <Text style={{fontSize:20,alignItems: 'center', flexDirection: 'row', color: '#0d2750'}}>{strings('car.warehouse')}</Text>
                        </View>
                    </View>;

                warehousestatusimg = <View style={[commonStyle.symbolAroundCircleArrivedActual, {
                                                        width: circlesmalsize,
                                                        height: circlesmalsize,
                                                        borderRadius:circlesmalsize / 2,
                                                        left: radius * Math.cos(this.degToRad(14)) + center - circlesmalsize / 2,
                                                        top: radius * Math.sin(this.degToRad(14)) + center - circlesmalsize / 2,
                                            }]}>
                                    <Image
                                        resizeMode={"contain"}
                                        style={commonStyle.smallIcons}
                                        source={require('../assets/warehouse_arrived.png')}
                                    />
                                     <View style={{position:'absolute',  bottom:-height*0.085, right:-width*0.03}}>
                                            <Text style={{fontSize:12,alignItems: 'center', flexDirection: 'row', color: '#0d2750'}}>
                                                {strings('car.warehouse')}</Text>
                                            <Text style={{fontSize:12, color: '#0d2750'}}>
                                            {(this.state.arrivedstatus)?this.state.arrivedstatus.delivered_date:''}</Text>
                                        </View>
                                    </View>;
            }
            else if(this.state.car_data.arrivedstatus == 0){
                warehousestatus = <View style={{flexDirection: 'row', flex: 1, marginBottom: '10%'}}>
                    <View style={styles.circleUaePort}>
                            <Image
                                style={styles.iconUaePort}
                                source={require('../assets/warehouse.png')}
                            />
                    </View>
                    <View>
                        <Text style={{fontSize:20,alignItems: 'center', flexDirection: 'row', color: '#818181'}}>{strings('car.warehouse')}</Text>
                    </View>
                </View>;

                warehousestatusimg = <View style={[commonStyle.symbolAroundCirclered, {
                                            width: circlesmalsize,
                                            height: circlesmalsize,
                                            borderRadius:circlesmalsize / 2,
                                            left: radius * Math.cos(this.degToRad(14)) + center - circlesmalsize / 2,
                                            top: radius * Math.sin(this.degToRad(14)) + center - circlesmalsize / 2,
                                        }]}>
                                        <Image
                                        resizeMode={"contain"}
                                        style={commonStyle.smallIcons}
                                        source={require('../assets/warehouse.png')}
                                        />
                                         <View style={{position:'absolute',  bottom:-height*0.085, right:-width*0.03}}>
                                            <Text style={{fontSize:12,alignItems: 'center', flexDirection: 'row', color: '#0d2750'}}>
                                                {strings('car.warehouse')}</Text>
                                            <Text style={{fontSize:12, color: '#0d2750'}}>
                                            {(this.state.arrivedstatus)?this.state.arrivedstatus.delivered_date:''}</Text>
                                        </View>
                                        </View>;
            }else{
                warehousestatus = <View style={{flexDirection: 'row', flex: 1, marginBottom: '10%'}}>
                    <View style={styles.circleArrived}>
                            <Image
                                style={styles.iconUaePort}
                                source={require('../assets/warehouse.png')}
                            />
                    </View>
                    <View>
                        <Text style={{fontSize:20,alignItems: 'center', flexDirection: 'row',  color: '#0d2750'}}>{strings('car.warehouse')}</Text>
                        <Text style={{fontSize:20,color: '#0d2750'}}>{(this.state.arrivedstatus)?this.state.arrivedstatus.delivered_date:''}</Text>
                    </View>
                </View>;

                warehousestatusimg = <View style={[commonStyle.symbolAroundCircleArrived, {
                                            width: circlesmalsize,
                                            height: circlesmalsize,
                                            borderRadius:circlesmalsize / 2,
                                            left: radius * Math.cos(this.degToRad(14)) + center - circlesmalsize / 2,
                                            top: radius * Math.sin(this.degToRad(14)) + center - circlesmalsize / 2,
                                        }]}>
                                        <Image
                                            resizeMode={"contain"}
                                            style={commonStyle.smallIcons}
                                            source={require('../assets/warehouse.png')}
                                        />
                                        <View style={{position:'absolute', bottom:-height*0.085, right:-width*0.03}}>
                                            <Text style={{fontSize:12,alignItems: 'center', flexDirection: 'row', color: '#0d2750'}}>
                                                {strings('car.warehouse')}</Text>
                                            <Text style={{fontSize:12, color: '#0d2750'}}>
                                            {(this.state.arrivedstatus)?this.state.arrivedstatus.delivered_date:''}</Text>
                                        </View>
                                        </View>;
            }
            
            if(this.state.last_status == "loading_status"){
                loadingstatus = <View style={{flexDirection: 'row', flex: 1, marginBottom: '10%'}}>
                        <View style={styles.circleArrivedwhite}>
                                <Image
                                    style={styles.iconUaePortArrived}
                                    source={require('../assets/loading_arrived.png')}
                                />
                        </View>
                        <View style={styles.halfCircle}>
                                 <Image
                                    style={styles.iconUaePort}
                                    source={require('../assets/spec.png')}
                                /> 
                        </View>
                        <View style={styles.actual}>
                                <Image
                                    style={styles.iconUaePort}
                                    source={require('../assets/arrow_actual.png')}
                                />        
                        </View>
                        <View>
                            <Text style={{fontSize:20,alignItems: 'center', flexDirection: 'row',  color: '#0d2750'}}>{strings('car.loading')}</Text>
                        </View>
                    </View>;

                    loadingstatusimg = <View style={[commonStyle.symbolAroundCircleArrivedActual, {
                                            width: circlesmalsize,
                                            height: circlesmalsize,
                                            borderRadius:circlesmalsize / 2,
                                            left: radius * Math.cos(this.degToRad(66)) + center - circlesmalsize / 2,
                                            top: radius * Math.sin(this.degToRad(66)) + center - circlesmalsize / 2,
                                        }]}>
                                        <Image
                                            resizeMode={"contain"}
                                            style={commonStyle.smallIcons}
                                            source={require('../assets/loading_arrived.png')}
                                        />
                                         <View style={{position:'absolute', bottom:-height*0.07,width: 100}}>
                                            <Text style={{fontSize:12,alignItems: 'center', flexDirection: 'row', color: '#0d2750'}}>
                                                {strings('car.loading')}</Text>
                                        </View>
                                        </View>;
            }
            else if(this.state.car_data.loading_status == 0){
                loadingstatus = <View style={{flexDirection: 'row', flex: 1, marginBottom: '10%'}}>
                    <View style={styles.circleUaePort}>
                            <Image
                                style={styles.iconUaePort}
                                source={require('../assets/loading.png')}
                            />
                    </View>
                    <View>
                        <Text style={{fontSize:20,alignItems: 'center', flexDirection: 'row',  color: '#818181'}}>{strings('car.loading')}</Text>
                    </View>
                </View>;

                loadingstatusimg = <View style={[commonStyle.symbolAroundCirclered, {
                                            width: circlesmalsize,
                                            height: circlesmalsize,
                                            borderRadius:circlesmalsize / 2,
                                            left: radius * Math.cos(this.degToRad(66)) + center - circlesmalsize / 2,
                                            top: radius * Math.sin(this.degToRad(66)) + center - circlesmalsize / 2,
                                        }]}>
                                        <Image
                                            resizeMode={"contain"}
                                            style={commonStyle.smallIcons}
                                            source={require('../assets/loading.png')}
                                        />
                                        <View style={{position:'absolute', bottom:-height*0.07,width: 100}}>
                                            <Text style={{fontSize:12,alignItems: 'center', flexDirection: 'row', color: '#0d2750'}}>
                                                {strings('car.loading')}</Text>
                                        </View>
                                    </View>;
            }else{
                loadingstatus = <View style = {{flexDirection: 'row', flex: 1, marginBottom: '10%'}}>
                    <View style={styles.circleArrived}>
                            <Image
                                style={styles.iconUaePort}
                                source={require('../assets/loading.png')}
                            />
                    </View>
                    <View>
                        <Text style={{fontSize:20,alignItems: 'center', flexDirection: 'row',  color: '#0d2750'}}>{strings('car.loading')}</Text>
                        <Text style={{fontSize:20, color: '#0d2750'}}>{(this.state.loading_status)?this.state.loading_status.loaded_date:''}</Text>
                    </View>
                </View>;
                loadingstatusimg = <View style={[commonStyle.symbolAroundCircleArrived, {
                                            width: circlesmalsize,
                                            height: circlesmalsize,
                                            borderRadius:circlesmalsize / 2,
                                            left: radius * Math.cos(this.degToRad(66)) + center - circlesmalsize / 2,
                                            top: radius * Math.sin(this.degToRad(66)) + center - circlesmalsize / 2,
                                        }]}>
                                        <Image
                                            resizeMode={"contain"}
                                            style={commonStyle.smallIcons}
                                            source={require('../assets/loading.png')}
                                        />
                                        
                                        <View style={{position:'absolute', bottom:-height*0.07,width: 100}}>
                                            <Text style={{fontSize:12,alignItems: 'center', flexDirection: 'row', color: '#0d2750'}}>
                                                {strings('car.loading')}</Text>
                                            <Text style={{fontSize:12, color: '#0d2750'}}>
                                            {(this.state.loading_status)?this.state.loading_status.loaded_date:''}</Text>
                                        </View>
                                    </View>;
            }


            if(this.state.last_status == "shipping_status"){
                shippingstatus = <View style={{flexDirection: 'row', flex: 1, marginBottom: '10%'}}>
                        <View style={styles.circleArrivedwhite}>
                                <Image
                                    style={styles.iconUaePortArrived}
                                    source={require('../assets/shipping_arrived.png')}
                                />
                        </View>
                        <View style={styles.halfCircle}>
                                 <Image
                                    style={styles.iconUaePort}
                                    source={require('../assets/spec.png')}
                                /> 
                        </View>
                        <View style={styles.actual}>
                                <Image
                                    style={styles.iconUaePort}
                                    source={require('../assets/arrow_actual.png')}
                                />        
                        </View>
                        <View>
                            <Text style={{fontSize:20,alignItems: 'center', flexDirection: 'row', color: '#0d2750'}}>{strings('car.shipping')}</Text>
                        </View>
                    </View>;
                
                shippingstatusimg = 
                    <View style={[commonStyle.symbolAroundCircleArrivedActual, {
                                                    width: circlesmalsize,
                                                    height: circlesmalsize,
                                                    borderRadius:circlesmalsize / 2,
                                                    left: radius * Math.cos(this.degToRad(118)) + center - circlesmalsize / 2,
                                                    top: radius * Math.sin(this.degToRad(118)) + center - circlesmalsize / 2,
                                        }]}>
                                <Image
                                    resizeMode={"contain"}
                                    style={commonStyle.smallIcons}
                                    source={require('../assets/shipping_arrived.png')}
                                />
                                 <View style={{position:'absolute', bottom:-height*0.06}}>
                                    <Text style={{fontSize:12,alignItems: 'center', flexDirection: 'row', color: '#0d2750'}}>
                                        {strings('car.shipping')}</Text>
                                </View>
                    </View>;
            }
            else if(this.state.car_data.shipping_status == 0){
                shippingstatus = <View style={{flexDirection: 'row', flex: 1, marginBottom: '10%'}}>
                    <View style={styles.circleUaePort}>
                            <Image
                                style={styles.iconUaePort}
                                source={require('../assets/shipping.png')}
                            />
                    </View>
                    <View>
                        <Text style={{fontSize:20,alignItems: 'center', flexDirection: 'row', color: '#818181'}}>{strings('car.shipping')}</Text>
                    </View>
                </View>;
            shippingstatusimg = 
            <View style={[commonStyle.symbolAroundCirclered, {
                                            width: circlesmalsize,
                                            height: circlesmalsize,
                                            borderRadius:circlesmalsize / 2,
                                            left: radius * Math.cos(this.degToRad(118)) + center - circlesmalsize / 2,
                                            top: radius * Math.sin(this.degToRad(118)) + center - circlesmalsize / 2,
                                }]}>
                        <Image
                            resizeMode={"contain"}
                            style={commonStyle.smallIcons}
                            source={require('../assets/shipping.png')}
                        />
                        <View style={{position:'absolute', bottom:-height*0.06}}>
                            <Text style={{fontSize:12,alignItems: 'center', flexDirection: 'row', color: '#0d2750'}}>
                                {strings('car.shipping')}</Text>
                        </View>
            </View>;
            }else{
                shippingstatus = <View style={{flexDirection: 'row', flex: 1, marginBottom: '10%'}}>
                    <View style={styles.circleArrived}>
                            <Image
                                style={styles.iconUaePort}
                                source={require('../assets/shipping.png')}
                            />
                    </View>
                    <View>
                        <Text style={{fontSize:20,alignItems: 'center', flexDirection: 'row', color: '#0d2750'}}>{strings('car.shipping')}</Text>
                        <Text style={{fontSize:20,color: '#0d2750'}}>{(this.state.shipping_status)?this.state.shipping_status.shipping_date:''}</Text>
                    </View>
                </View>;
                shippingstatusimg = 
                <View style={[commonStyle.symbolAroundCircleArrived, {
                                                width: circlesmalsize,
                                                height: circlesmalsize,
                                                borderRadius:circlesmalsize / 2,
                                                left: radius * Math.cos(this.degToRad(118)) + center - circlesmalsize / 2,
                                                top: radius * Math.sin(this.degToRad(118)) + center - circlesmalsize / 2,
                                    }]}>
                            <Image
                                resizeMode={"contain"}
                                style={commonStyle.smallIcons}
                                source={require('../assets/shipping.png')}
                            />
                            <View style={{position:'absolute', bottom:-height*0.06}}>
                                <Text style={{fontSize:12,alignItems: 'center', flexDirection: 'row', color: '#0d2750'}}>
                                    {strings('car.shipping')}</Text>
                                <Text style={{fontSize:12, color: '#0d2750'}}>
                                    {(this.state.shipping_status)?this.state.shipping_status.shipping_date:''}</Text>
                            </View>
                </View>;
            }



            if(this.state.last_status == "arrived_port"){
                portstatus = <View style={{flexDirection: 'row', flex: 1, marginBottom: '10%'}}>
                        <View style={styles.circleArrivedwhite}>
                                <Image
                                    style={styles.iconUaePortArrived}
                                    source={require('../assets/port_arrived.png')}
                                />
                        </View>
                        <View style={styles.halfCircle}>
                                 <Image
                                    style={styles.iconUaePort}
                                    source={require('../assets/spec.png')}
                                /> 
                        </View>
                        <View style={styles.actual}>
                                <Image
                                    style={styles.iconUaePort}
                                    source={require('../assets/arrow_actual.png')}
                                />        
                        </View>
                        <View>
                            <Text style={{fontSize:20,alignItems: 'center', flexDirection: 'row',  color: '#0d2750'}}>{strings('car.port')}</Text>
                        </View>
                    </View>;

                    portstatusimg = <View style={[commonStyle.symbolAroundCircleArrivedActual, {
                                            width: circlesmalsize,
                                            height: circlesmalsize,
                                            borderRadius:circlesmalsize / 2,
                                            left: radius * Math.cos(this.degToRad(166)) + center - circlesmalsize / 2,
                                            top: radius * Math.sin(this.degToRad(166)) + center - circlesmalsize / 2,
                                            }]}>
                                            <Image
                                                resizeMode={"contain"}
                                                style={commonStyle.smallIcons}
                                                source={require('../assets/port_arrived.png')}
                                            />
                                            <View style={{position:'absolute', bottom:-height*0.06}}>
                                                <Text style={{fontSize:12,alignItems: 'center', flexDirection: 'row', color: '#0d2750'}}>
                                                    {strings('car.port')}</Text>
                                            </View>
                                    </View>;
            }
            else if(this.state.car_data.arrived_port == 0){
                portstatus = <View style={{flexDirection: 'row', flex: 1, marginBottom: '10%'}}>
                    <View style={styles.circleUaePort}>
                            <Image
                                style={styles.iconUaePort}
                                source={require('../assets/port.png')}
                            />
                    </View>
                    <View>
                        <Text style={{alignItems: 'center', flexDirection: 'row', fontSize:20, color: '#818181'}}>{strings('car.port')}</Text>
                    </View>
                </View>;
                portstatusimg =  <View style={[commonStyle.symbolAroundCirclered, {
                                                    width: circlesmalsize,
                                                    height: circlesmalsize,
                                                    borderRadius:circlesmalsize / 2,
                                                    left: radius * Math.cos(this.degToRad(166)) + center - circlesmalsize / 2,
                                                    top: radius * Math.sin(this.degToRad(166)) + center - circlesmalsize / 2,
                                        }]}>
                                        <Image
                                            resizeMode={"contain"}
                                            style={commonStyle.smallIcons}
                                            source={require('../assets/port.png')}
                                        />
                                        <View style={{position:'absolute', bottom:-height*0.06}}>
                                            <Text style={{fontSize:12,alignItems: 'center', flexDirection: 'row', color: '#0d2750'}}>
                                                {strings('car.port')}</Text>
                                        </View>
                                </View>;
            }else{
                portstatus = <View style={{flexDirection: 'row', flex: 1, marginBottom: '10%'}}>
                    <View style={styles.circleArrived}>
                            <Image
                                style={styles.iconUaePort}
                                source={require('../assets/port.png')}
                            />
                    </View>
                    <View>
                        <Text style={{fontSize:20,alignItems: 'center',fontSize:20, flexDirection: 'row', color: '#0d2750'}}>{strings('car.port')}</Text>
                        <Text style={{fontSize:20,fontSize:20,color: '#0d2750'}}>{(this.state.arrived_port)?this.state.arrived_port.arrival_date:''}</Text>
                    </View>
                </View>;
                portstatusimg =  <View style={[commonStyle.symbolAroundCircleArrived, {
                                                    width: circlesmalsize,
                                                    height: circlesmalsize,
                                                    borderRadius:circlesmalsize / 2,
                                                    left: radius * Math.cos(this.degToRad(166)) + center - circlesmalsize / 2,
                                                    top: radius * Math.sin(this.degToRad(166)) + center - circlesmalsize / 2,
                                        }]}>
                                        <Image
                                            resizeMode={"contain"}
                                            style={commonStyle.smallIcons}
                                            source={require('../assets/port.png')}
                                        />
                                        <View style={{position:'absolute', bottom:-height*0.06}}>
                                            <Text style={{fontSize:12,alignItems: 'center', flexDirection: 'row', color: '#0d2750'}}>
                                                {strings('car.port')}</Text>
                                            <Text style={{fontSize:12, color: '#0d2750'}}>
                                            {(this.state.arrived_port)?this.state.arrived_port.arrival_date:''}</Text>
                                        </View>
                                </View>;
            }

            if(this.state.last_status == "arrive_store"){
                storestatus = <View style={{flexDirection: 'row', flex: 1, marginBottom: '10%'}}>
                        <View style={styles.circleArrivedwhite}>
                                <Image
                                    style={styles.iconUaePortArrived}
                                    source={require('../assets/store_arrived.png')}
                                />
                        </View>
                        <View style={styles.halfCircle}>
                                 <Image
                                    style={styles.iconUaePort}
                                    source={require('../assets/spec.png')}
                                /> 
                        </View>
                        <View style={styles.actual}>
                                <Image
                                    style={styles.iconUaePort}
                                    source={require('../assets/arrow_actual.png')}
                                />        
                        </View>
                        <View>
                            <Text style={{alignItems: 'center', flexDirection: 'row', color: '#0d2750', fontSize: 20}}>{strings('car.store')}</Text>
                        </View>
                    </View>;

                storestatusimg = <View style={[commonStyle.symbolAroundCircleArrivedActual, {
                                                    width: circlesmalsize,
                                                    height: circlesmalsize,
                                                    borderRadius:circlesmalsize / 2,
                                                    left: radius * Math.cos(this.degToRad(218)) + center - circlesmalsize / 2,
                                                    top: radius * Math.sin(this.degToRad(218)) + center - circlesmalsize / 2,
                                            }]}>
                                        <Image
                                            resizeMode={"contain"}
                                            style={commonStyle.smallIcons}
                                            source={require('../assets/store_arrived.png')}
                                        />
                                         <View style={{position:'absolute', top:-height*0.06}}>
                                            <Text style={{fontSize:12,alignItems: 'center', flexDirection: 'row', color: '#0d2750'}}>
                                                {strings('car.store')}</Text>
                                        </View>
                                </View>;
            }
            else if(this.state.car_data.arrive_store == 0){
                storestatus = <View style={{flexDirection: 'row', flex: 1, marginBottom: '10%'}}>
                    <View style={styles.circleUaePort}>
                            <Image
                                style={styles.iconUaePort}
                                source={require('../assets/store.png')}
                            />
                    </View>
                    <View>
                        <Text style={{fontSize:20,alignItems: 'center', flexDirection: 'row', color: '#818181'}}>{strings('car.store')}</Text>
                    </View>
                </View>;

                storestatusimg = <View style={[commonStyle.symbolAroundCirclered, {
                                        width: circlesmalsize,
                                        height: circlesmalsize,
                                        borderRadius:circlesmalsize / 2,
                                        left: radius * Math.cos(this.degToRad(218)) + center - circlesmalsize / 2,
                                        top: radius * Math.sin(this.degToRad(218)) + center - circlesmalsize / 2,
                                    }]}>
                                    <Image
                                        resizeMode={"contain"}
                                        style={commonStyle.smallIcons}
                                        source={require('../assets/store.png')}
                                    />
                                     <View style={{position:'absolute', top:-height*0.06}}>
                                        <Text style={{fontSize:12,alignItems: 'center', flexDirection: 'row', color: '#0d2750'}}>
                                            {strings('car.store')}</Text>
                                    </View>
                                </View>;

            }else{
                storestatus = <View style={{flexDirection: 'row', flex: 1, marginBottom: '10%'}}>
                    <View style={styles.circleArrived}>
                            <Image
                                style={styles.iconUaePort, [{width:40, height:40}]}
                                source={require('../assets/store.png')}
                            />
                    </View>
                    <View>
                        <Text style={{fontSize:20,alignItems: 'center', flexDirection: 'row',  color: '#0d2750'}}>{strings('car.store')}</Text>
                        <Text style={{fontSize:20, color: '#0d2750'}}>{(this.state.arrive_store)?this.state.arrive_store.create_date:''}</Text>
                    </View>
                </View>;


                storestatusimg = <View style={[commonStyle.symbolAroundCircleArrived, {
                            width: circlesmalsize,
                            height: circlesmalsize,
                            borderRadius: circlesmalsize / 2,
                            left: radius * Math.cos(this.degToRad(218)) + center - circlesmalsize / 2,
                            top: radius * Math.sin(this.degToRad(218)) + center - circlesmalsize / 2,
                        }]}>
                        <Image
                        resizeMode={"contain"}
                        style={commonStyle.smallIcons}
                        source={require('../assets/store.png')}
                        />
                         <View style={{position:'absolute', top:-height*0.06}}>
                            <Text style={{fontSize:12,alignItems: 'center', flexDirection: 'row', color: '#0d2750'}}>
                                {strings('car.store')}</Text>
                            <Text style={{fontSize:12, color: '#0d2750'}}>
                            {(this.state.arrive_store)?this.state.arrive_store.create_date:''}</Text>
                        </View>
                </View>;
            }
        }
        
        return (
            
            <View style={styles.image}>
                <Modal visible={this.state.visibleImage} transparent={true} style={{backgroundColor: 'white',
    margin: 0, // This is the important style you need to set
    alignItems: undefined,
    justifyContent: undefined}}>
                    <ImageViewer imageUrls={this.state.imagesSlider}
                        enableSwipeDown="true"
                        enablePreload= "true"
                        backgroundColor="#000"
                        renderHeader={(index) =>
                            <SafeAreaView>
                                    <View  style={{flexDirection:'row', zIndex: 9999}}> 
                                        <TouchableOpacity style={{borderRadius:25,justifyContent:'center',
                                        alignItems:'center', width:50, height:50}}
                                        onPress={() => this.setState({visibleImage: false})}>
                                            <FontAwesomeIcon
                                                icon={ faXmarkCircle }
                                                color="#fff"
                                                size={25}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{borderRadius:25,justifyContent:'center',
                                        alignItems:'center', width:50, height:50}}
                                        onPress={() => this.shareImage(this.state.imagesSlider[index])}>
                                            <FontAwesomeIcon
                                                icon={ faShare }
                                                color="#fff"
                                                size={25}
                                            />
                                        </TouchableOpacity>
                                    </View></SafeAreaView>
                                        }
                        loadingRender = {() => <Loader loader={true}></Loader> }
                        renderFooter={ (index) => {/**<SafeAreaView style={{height:height*0.2, flex:1}}>
                        <TouchableOpacity onPress={()=> this.shareImage(this.state.imagesSlider[index])} 
                            style={{  justifyContent:'center',alignItems:'center', padding:'2%',
                            width:width, backgroundColor:"#013188"}}>
                            <Text style={{color: '#fff',  alignItems:'center',justifyContent:'center', 
                            fontSize: I18n.locale=='ar'?20:20}} >{strings('main.share')}</Text>
                        </TouchableOpacity></SafeAreaView>**/}}
                    />
            </Modal>
                <SafeAreaView style={{marginBottom:height*0.05, backgroundColor:'transparent', flex:1}}>
                    <View style={styles.container}>
                            <Modal
                            backdropOpacity={0.3}
                            isVisible={this.state.visible}
                            onBackdropPress={() => this.setModalVisible(false)}
                            style={styles.contentView}>
                            <View style={styles.content}>
                                    <View style={commonStyle.submitbutton}>
                                        <TouchableOpacity activeOpacity={1}>           
                                                    <Text style={commonStyle.buttonText}>
                                                            Lot: {this.state.lotnumber}        
                                                    </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{flexDirection:'row', flex:1}}>
                                        {(this.state.loaderinside)?(
                                                   <View style={styles.overlay}>
                                                   <Image source={require("../assets/loadingapp.gif")}
                                                       style={{backgroundColor:'transparent', width:100}}
                                                       resizeMode="contain">
                                                   </Image>
                                               </View>
                                        ):(
                                        <ScrollView contentContainerStyle = {styles.container}>
                                            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center', flex:1}}>
                                                <Animatable.View
                                                    animation = "fadeInRight" 
                                                    duration  = {1000}
                                                    style={commonStyle.bigCircle}>
                                                    
                                                        {newcarstatusimg}
                                                        {towingstatusimg}
                                                        {warehousestatusimg}
                                                        {loadingstatusimg}
                                                        {shippingstatusimg}
                                                        {portstatusimg}
                                                        {storestatusimg}
                                                </Animatable.View>
                                            </View>
                                        </ScrollView>)
                                        }
                                        

                                    </View>
                                
                            </View>
                            </Modal>
                    </View>

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
    textbody: { textAlign: 'center', color:'#000',fontSize:12 },
    content: {
        flex:0.8,
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 17,
        borderTopLeftRadius: 17,
    },
    contentTitle: {
        fontSize: 20,
        marginBottom: 12,
    },
    contentView: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    circleArrived: {
        width: 75,
        height: 75,
        borderColor:'#149414',
        zIndex: 20,
        resizeMode: "cover",
        justifyContent: "center",
        alignItems: 'center',
        left: '275%',
        borderWidth: 2,
        borderRadius: 100/2,
        backgroundColor: '#0c55a8'
    },
    iconUaePort: {
        resizeMode: "contain",
        justifyContent: "center",
        alignItems: 'center',
        width: 50,
        height: 50,
    },
    circleUaePort: {
        width: 75,
        height: 75,
        zIndex: 20,
        resizeMode: "cover",
        justifyContent: "center",
        alignItems: 'center',
        left: '275%',
        borderColor:'red',
        borderWidth: 2,
        borderRadius: 100/2,
        backgroundColor: '#0a4180'
    },
    iconUaePortArrived: {
        resizeMode: "contain",
        justifyContent: "center",
        alignItems: 'center',
        width: 40,
        height: 40,
    },
    circleArrivedwhite: {
        width: 75,
        height: 75,
        zIndex: 20,
        resizeMode: "cover",
        justifyContent: "center",
        alignItems: 'center',
        left: '275%',
        borderColor:'#149414',
        borderWidth: 2,
        borderRadius: 100/2,
        backgroundColor: '#ffff'
    },
    actual: {
        width: 75,
        height: 75,
        zIndex: 200,
        position: 'absolute',
        resizeMode: "cover",
        justifyContent: "center",
        alignItems: 'center',
        left: '80%',
        right: 0,
        borderRadius: 100/2,
        backgroundColor: 'transparent'
    },
});