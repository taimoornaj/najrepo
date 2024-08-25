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
  Alert,
  SafeAreaView,
  Dimensions,
  StatusBar
} from 'react-native';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import  Loader  from '../components/Loader.js';
import I18n from 'react-native-i18n';
import commonStyle from '../assets/style/styles.js';
import Modal from 'react-native-modal';
import { faArrowLeft, faArrowRight, faCloudArrowDown, faShare, faX, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import Share from 'react-native-share';
import ImgToBase64 from 'react-native-image-base64';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import ImageViewer from 'react-native-image-zoom-viewer';
import DatePicker from 'react-native-datepicker';

const {width, height} = Dimensions.get('window'); 

export default class InauctionsDetailsstmt extends Component {

    constructor(props){
        super(props);
        this.state = {
            setd: '',
            search: '',
            allcount: 0,
            from_date:'',
            to_date: '',
            cancelledCount:0,
            fulldata:[],
            visible: false,
            isOpen: false,
            value: new Date().getMonth(),
            remaining_status: 2,
            transfer_status:0,
            arrive_store: 1,
            searcharrayLotvin: [],
            post_page   : 0,
            load_more   : false,
            loader      : false,
            previous_balance : 0,
            Previous_balanceA: '',
            unpaidView: true,
            remainingView: false,
            relistView: false,
            paidView: false,
            backgroundColor:  [ '#ffc36c','#ffc36c','#ffc36c','#ffc36c'],
            backgroundColor1: [ '#fff', '#fff'],
            backgroundColor2: [ '#fff', '#fff'],
            backgroundColor4: '#013188',
            backgroundColor3: '#EDEDED',
            ColorText: '#0093FF',
            ColorText1:'#000',
            ColorText2:'#000',
            ColorText3:'#000',
            ColorText4:'#fff',
            textDecorationLine: 'underline',
            textDecorationLine1: '',
            textDecorationLine2: '',
            dataNewnotPaid: [],
            dataCancelled: [],
            noneComplete: [],
            visibleImage: false,
            imagesSlider: [],
            unpaidViewTabs: true,
            relistViewTabs: false,
            carsPaid: []
          }

    }

    async componentDidMount() {
       this.getData();
    }

    onscroll = (e) => {
        var total_posts      = this.state.total_data;
        var total_post_count = this.state.carsPaid.length;
        var contentLength    = e.nativeEvent.contentSize.height;
        var trailingInset    = e.nativeEvent.contentInset.bottom;
        var scrollOffset     = e.nativeEvent.contentOffset.y;
        var viewportLength   = e.nativeEvent.layoutMeasurement.height;
     
        if( Math.round(viewportLength + scrollOffset) >= Math.round(contentLength)){
          if(this.state.load_more == false && total_posts != total_post_count)
            this.load_more_data();
        }
    }

    getData = () => {
        this.setState({
            loader          : true,
            visible         : false
        });
        var start     = this.state.start;
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('customer_id', AuthContext.id);
        formData.append('from_date',  this.state.from_date);
        formData.append('to_date',  this.state.to_date);
        formData.append('start', 0);
        formData.append('length', 10);
        var Url  = AuthContext.server_url + "/Nejoum_App/unpaidinauctionsStmt";
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
                    noneComplete: response.nonComplatePayment,
                    dataNewnotPaid: response.dataNewnotPaid,
                    dataCancelled: response.dataCancelled,
                    balanceTotalRemaining:  response.balanceTotalremaining,
                    balanceTotalnotPaid: response.balanceTotalnotPaid,
                    balance: response.balanceTotalnotPaid + ' USD',
                    //balancePaidTotal: response.balancePaidTotal,
                    //carsPaid: response.carsPaid,
                    post_page   : response.carsPaid.length,
                    balanceCancelledTotal: response.balanceTotalCancelled
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
            console.log(error);
            Alert.alert('Error', 'Connection Error', [
                {text: 'Okay'}
            ]);
        });  
    }

    getunPaid = () => {
        this.setState({
            backgroundColor2: [ '#fff', '#fff'],
            unpaidView: true,
            remainingView: false,
            relistView: false,
            paidView: false,
            backgroundColor1: [ '#fff', '#fff'],
            backgroundColor:  [ '#ffc36c','#ffc36c','#ffc36c','#ffc36c'],
            backgroundColor3:  '#EDEDED',
            backgroundColor4: '#013188',
            ColorText: '#0093FF',
            ColorText1:'#000',
            ColorText2:'#000',
            ColorText3:'#000',
            unpaidViewTabs: true,
            textDecorationLine: 'underline',
            textDecorationLine1: '',
            textDecorationLine2: '',
            ColorText4:'#fff',
            balance: this.state.balanceTotalnotPaid + ' USD'
        });
    }

    setModalVisible = () => {
        this.setState({
            visible: false,
        });
    }

    getRelist = () => {
        this.setState({
            backgroundColor2:  [ '#ffc36c','#ffc36c','#ffc36c','#ffc36c'],
            unpaidView: false,
            remainingView: false,
            relistView: true,
            paidView: false,
            backgroundColor1: [ '#fff', '#fff'],
            backgroundColor: [ '#fff', '#fff'],
            ColorText: '#000',
            ColorText1:'#000',
            ColorText2:'#0093FF',
            textDecorationLine: '',
            textDecorationLine1: '',
            textDecorationLine2: 'underline',
            unpaidViewTabs: true,
            balance: this.state.balanceCancelledTotal + ' AED'
        });
    }

    getRemaining = () => {
        this.setState({
            backgroundColor2: [ '#fff', '#fff'],
            unpaidView: false,
            remainingView: true,
            relistView: false,
            paidView: false,
            backgroundColor1:  [ '#ffc36c','#ffc36c','#ffc36c','#ffc36c'],
            backgroundColor: [ '#fff', '#fff'],
            ColorText: '#000',
            ColorText1:'#0093FF',
            textDecorationLine: 'underline',
            textDecorationLine1: '',
            textDecorationLine2: '',
            ColorText2:'#000',
            unpaidViewTabs: true,
            balance: this.state.balanceTotalRemaining + ' AED'
        });
    }

    

    getPaid = () => {
        this.setState({
            backgroundColor2: '#013188',
            unpaidView: false,
            relistView: false,
            remainingView: false,
            paidView: true,
            loader: true,
            backgroundColor1: [ '#fff', '#fff'],
            backgroundColor: [ '#fff', '#fff'],
            ColorText: '#1760B2',
            ColorText1:'#1760B2',
            ColorText2:'#1760B2',
            textDecorationLine: 'underline',
            textDecorationLine1: '',
            textDecorationLine2: '',
            ColorText3:'#fff',
            ColorText4:'#1760B2',
            backgroundColor3:  '#013188',
            backgroundColor4: '#EDEDED',
            unpaidViewTabs: false,
            //balance: this.state.balancePaidTotal+ ' AED'
        });

        var start     = this.state.start;
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('customer_id', AuthContext.id);
        formData.append('from_date',  this.state.from_date);
        formData.append('to_date',  this.state.to_date);
        formData.append('start', 0);
        formData.append('length', 10);
        var Url  = AuthContext.server_url + "/Nejoum_App/unpaidinauctionsStmt";
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
            //console.warn('fsadf');
            //console.warn(response);
            if(response.success == 'success'){
                this.setState({
                    loader              : false,
                    balance    : response.balancePaidTotal+ ' AED',
                    carsPaid            : response.carsPaid,
                    post_page           : response.carsPaid.length,
                });
                return;
            }
            else {
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
            console.log(error);
            Alert.alert('Error', 'Connection Error', [
                {text: 'Okay'}
            ]);
        });  

    }
    
    
    load_more_data = () => {
        this.setState({
            load_more          : true,
            visible         : false
        });
        var start     = this.state.post_page+1;
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('customer_id', AuthContext.id);
        formData.append('from_date',  this.state.from_date);
        formData.append('to_date',  this.state.to_date);
        formData.append('start', start);
        formData.append('length', 10);
        var Url  = AuthContext.server_url + "/Nejoum_App/unpaidinauctionsStmt";
        //console.warn(formData);
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
            //console.warn('fsadf');
//console.warn(response);
            if(response.success == 'success'){
                var old_data    = this.state.carsPaid;
                for(var i = 0; i < response.carsPaid.length; i++){
                    old_data.push(response.carsPaid[i]);
                }

                this.setState({
                    load_more      : false,
                    post_page       : old_data.length,
                    carsPaid: old_data,
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
            console.log(error);
            Alert.alert('Error', 'Connection Error', [
                {text: 'Okay'}
            ]);
        });
    }

    onChange = () => {
        this.setState({value: value})
    }

    toggleOpen = () => {
        this.setState({isOpen: false})
    }

    resetDate = () => {
        this.setState({
            from_date: new Date("2020-01-01"),
            to_date: new Date(),
        }, this.getData );
    }

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

    fillImagesarr = (carImage) => {
        var images = [];
        var img = '';
        images.push({url: carImage});
        this.setState({visibleImage: true, imagesSlider: images});
    }
    
    render(){
        const from_date = this.state.from_date;
        const to_date = this.state.to_date;
        if(this.state.loader){
            return(
                <Loader loader={this.state.loader}></Loader>
            );
        }

        if(this.state.load_more){
            var load_more = <View style={{backgroundColor:'transparent', flex:1, justifyContent:'center', alignItems:'center'}}>
                <Image source={require("../assets/loadingapp.gif")}
                    style={{justifyContent:'center', width:50, height:50, alignItems:'center', flex:0.2}}
                    resizeMode="contain">
                </Image>
            </View>;
        }
        else {
            var load_more = [];
        }

        if(this.state.from_date != '' || this.state.to_date != ''){
            var date_scale = 
                                  <View style={{flexDirection:'row', flex:1, justifyContent:'space-around', alignItems:'center'}}>
                                      <View style={{}}>
                                          <Text style={styles.textBlue}>{this.state.from_date}</Text>
                                      </View>
                                      <View style={{}}>
                                        <FontAwesomeIcon 
                                            icon={ faArrowRight }
                                          size={20} backgroundColor="#fff" color="#0d5db8"/>  
                                      </View>
                                      <View style={{}}>
                                          <Text style={styles.textBlue}>{this.state.to_date}</Text>
                                      </View>
                                          <TouchableOpacity activeOpacity={1} style={{}} onPress={() => this.resetDate()}>
                                              <View >
                                                <FontAwesomeIcon 
                                                    icon={ faX } size={20} color='#0d5db8' backgroundColor="#0d5db8" />
                                              </View>
                                          </TouchableOpacity>
                                  </View>;
        }else {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            today = yyyy + '-' + mm + '-' + dd ;
            var date_scale =  <View style={{marginLeft:'10%', flexDirection:'row', flex:1, justifyContent:'center', alignItems:'center'}}>
                                <View style={{flex:0.5}}>
                                    <Text style={{color:'#fff'}}>2020-01-01</Text>
                                </View>
                                <View style={{flex:0.2}}>
                                    <FontAwesomeIcon 
                                        icon={ faArrowRight } size={20} backgroundColor="#fff" color="#fff"/>  
                                </View>
                                <View style={{flex:0.5}}>
                                    <Text style={{color:'#fff'}}>{today}</Text>
                                </View>
                                    <TouchableOpacity activeOpacity={1} style={{flex:0.3}} onPress={() => this.resetDate()}>
                                        <View >
                                            <FontAwesomeIcon 
                                                icon={ faX }size={20} color='#fff' backgroundColor="#fff" />
                                        </View>
                                    </TouchableOpacity>
                            </View>;
        }

        return (
            <SafeAreaView style={{flex:1, backgroundColor:'#fff'}}>
                <View style={{margin:'2%'}}></View>
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
                                        icon={ faXmarkCircle } size={25} color="#fff" /></TouchableOpacity>
                                    <TouchableOpacity style={{borderRadius:25,justifyContent:'center',
                                    alignItems:'center', width:50, height:50}}
                                    onPress={() => this.shareImage(this.state.imagesSlider[0])}>
                                    <FontAwesomeIcon 
                                        icon={ faShare } size={25} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </SafeAreaView>
                        }
                        loadingRender = {() => <Loader loader={true}></Loader> }
                        renderFooter={ (index) => {/**<SafeAreaView style={{height:height*0.2, flex:1}}>
                        <TouchableOpacity onPress={()=> this.shareImage(this.state.imagesSlider[index])} 
                            style={{  justifyContent:'center',alignItems:'center', padding:'2%',
                            width:width, backgroundColor:"#0b4282"}}>
                            <Text style={{color: '#fff',  alignItems:'center',justifyContent:'center', 
                            fontSize: I18n.locale=='ar'?20:20}} >{strings('main.share')}</Text>
                        </TouchableOpacity></SafeAreaView>**/}}
                    />
            </Modal>

                    <Modal
                        backdropOpacity={0.3}
                        isVisible={this.state.visible}
                        onBackdropPress={() => this.setModalVisible(false)}
                        style={styles.contentView}>
                        <View style={styles.contentDate}>
                        <View style={{flex:1, justifyContent:'space-around', alignItems:'center'}}>
                        {I18n.locale == 'ar'?(
                                <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>

<DatePicker
                                            style={{width: 150}}
                                            date={this.state.from_date}
                                            mode="date"
                                            placeholder="From"
                                            format="YYYY-MM-DD"
                                            confirmBtnText="Confirm"
                                            cancelBtnText="Cancel"
                                            customStyles={{
                                            dateIcon: {
                                                position: 'absolute',
                                                left: 0,
                                                top: 4,
                                                marginLeft: 0
                                            },
                                            dateInput: {
                                                marginLeft: 36
                                            }
                                            // ... You can check the source to find the other keys.
                                            }}
                                            onDateChange={(date) => {this.setState({from_date: date})}}
                                        />

                                {/**<DateTimePicker
                                    mode={"date"} // THIS DOES NOT WORK ON ANDROID. IT DISPLAYS ONLY A DATE PICKER.
                                    display='default' // Android Only  
                                    is24Hour={false} // Android Only 
                                    value={from_date}
                                    style={{flex:0.4, alignItems:'center',justifyContent:'',alignContent:'center', 
                                    alignSelf:'center', backgroundColor: "white"}}
                                    onChange={(event, value) => {
                                        this.setState({
                                            from_date: value,
                                            //dateTimePickerVisible: Platform.OS === 'ios' ? true : false,
                                        });
                                        if (event.type === "set")
                                            console.log("value:" , value);
                                    }}

                                />**/} 
                                <Text style={styles.whiteText2}>{strings('main.from')}: </Text>
                            </View>
                            ):(<View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
                            <Text style={styles.whiteText2}>{strings('main.from')}: </Text>

                            <DatePicker
                                            style={{width: 150}}
                                            date={this.state.from_date}
                                            mode="date"
                                            placeholder="From"
                                            format="YYYY-MM-DD"
                                            confirmBtnText="Confirm"
                                            cancelBtnText="Cancel"
                                            customStyles={{
                                            dateIcon: {
                                                position: 'absolute',
                                                left: 0,
                                                top: 4,
                                                marginLeft: 0
                                            },
                                            dateInput: {
                                                marginLeft: 36
                                            }
                                            // ... You can check the source to find the other keys.
                                            }}
                                            onDateChange={(date) => {this.setState({from_date: date})}}
                                        />

                            {/**<DateTimePicker
                                mode={"date"} // THIS DOES NOT WORK ON ANDROID. IT DISPLAYS ONLY A DATE PICKER.
                                display='default' // Android Only  
                                is24Hour={false} // Android Only 
                                value={from_date}
                                style={{flex:0.4, alignItems:'center',justifyContent:'',alignContent:'center',
                                alignSelf:'center', backgroundColor: "white"}}
                                onChange={(event, value) => {
                                    this.setState({
                                        from_date: value,
                                        //dateTimePickerVisible: Platform.OS === 'ios' ? true : false,
                                    });
                                    if (event.type === "set")
                                        console.log("value:" , value);
                                }}
                            />**/}
                        </View>)

                            }
                            {I18n.locale == 'ar'?(
                                 <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
                                    {/** <DateTimePicker
                                         mode={"date"} // THIS DOES NOT WORK ON ANDROID. IT DISPLAYS ONLY A DATE PICKER.
                                         display='default' // Android Only  
                                         is24Hour={false} // Android Only 
                                         value={to_date}
                                         textColor="red"
                                         style={{flex:0.4, alignItems:'center',justifyContent:'flex-start',backgroundColor: "white"}}
                                         onChange={(event, value) => {
                                             this.setState({
                                                 to_date: value,
                                                 //dateTimePickerVisible: Platform.OS === 'ios' ? true : false,
                                             });
                                             if (event.type === "set")
                                                 console.log("value:", value);
                                         }}
                                        />**/}

<DatePicker
                            style={{width: 150}}
                            date={this.state.to_date}
                            mode="date"
                            placeholder="To"
                            format="YYYY-MM-DD"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                            // ... You can check the source to find the other keys.
                            }}
                            onDateChange={(date) => {this.setState({to_date: date})}}
                        />
                                    <Text style={styles.whiteText2}>{strings('main.to')}: </Text>
                             </View>
                            ):( <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
                            <Text style={styles.whiteText2}>{strings('main.to')}: </Text>
                                {/**<DateTimePicker
                                    mode={"date"} // THIS DOES NOT WORK ON ANDROID. IT DISPLAYS ONLY A DATE PICKER.
                                    display='default' // Android Only  
                                    is24Hour={false} // Android Only 
                                    value={to_date}
                                    textColor="red"
                                    style={{flex:0.4, alignItems:'center',justifyContent:'flex-start',backgroundColor: "white"}}
                                    onChange={(event, value) => {
                                        this.setState({
                                            to_date: value,
                                            //dateTimePickerVisible: Platform.OS === 'ios' ? true : false,
                                        });
                                        if (event.type === "set")
                                            console.log("value:", value);
                                    }}
                                />**/}

<DatePicker
                            style={{width: 150}}
                            date={this.state.to_date}
                            mode="date"
                            placeholder="To"
                            format="YYYY-MM-DD"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                            // ... You can check the source to find the other keys.
                            }}
                            onDateChange={(date) => {this.setState({to_date: date})}}
                        />

                        </View>)}
                            
                                    
                                </View>
                                <View style={commonStyle.submitbutton}>
                                    <TouchableOpacity activeOpacity={1} 
                                    onPress={() => this.getData()}>           
                                                <Text style={commonStyle.buttonText}>
                                                        {strings('main.search')}        
                                                </Text>
                                    </TouchableOpacity>
                                </View>
                            
                        </View>
                    </Modal>
                

                <View style={{ backgroundColor:'transparent',  borderBottomWidth:4, borderColor:'#fff'}}>
                 

                    <View style={{ backgroundColor:'transparent',  borderBottomWidth:4, borderColor:'#fff', marginBottom:'3%',
            margin: '1%'}}>
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                    <View
                        style={{flex:0.48, justifyContent:'center', alignItems:'center', backgroundColor:
                            this.state.backgroundColor4, borderRadius:5,shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            shadowOpacity: 0.58,
                            shadowRadius: 5.00,
                            elevation: 10,}}>
                        <TouchableOpacity style={{width:'80%', padding:height*0.02, 
                            justifyContent:'center', alignItems:'center'}}
                            onPress={() => this.getunPaid()}>
                            <Text style={[commonStyle.fontsizeGlobalbig, 
                                {color:this.state.ColorText4}]}>{strings('car.unpaid2')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View 
                            style={{flex:0.48, justifyContent:'center', alignItems:'center',
                             backgroundColor: this.state.backgroundColor3, shadowColor: "#000", borderRadius:5,
                             shadowOffset: {
                                 width: 0,
                                 height: 1,
                             },
                             shadowOpacity: 0.58,
                             shadowRadius: 5.00,
                             elevation: 10,}}>
                            <TouchableOpacity style={{ width:'80%', 
                            padding:height*0.02,  justifyContent:'center', alignItems:'center',}}
                                onPress={() => this.getPaid()}>
                                <Text style={[commonStyle.fontsizeGlobalbig, {color:this.state.ColorText3}]}>
                                    {strings('car.paid')}</Text>
                            </TouchableOpacity>
                    </View>
                </View>
        </View>

                    {
                        (this.state.unpaidViewTabs)?(
                            <View style={{flexDirection:'row', marginTop:'2%', justifyContent:'center', alignItems:'center'}}>
                                <View
                                    style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                    <TouchableOpacity style={{ justifyContent:'center', alignItems:'center'}}
                                        onPress={() => this.getunPaid()}>
                                        <Text style={[commonStyle.fontsizeGlobalbig, {color:this.state.ColorText,
                                        textDecorationLine: this.state.textDecorationLine}]}>{strings('car.unpaid2')}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                    <TouchableOpacity style={{justifyContent:'center', alignItems:'center'}}
                                        onPress={() => this.getRemaining()}>
                                        <Text style={[commonStyle.fontsizeGlobalbig, {color:this.state.ColorText1,
                                        textDecorationLine: this.state.textDecorationLine1}]}>{strings('car.transferRemaining')}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                    <TouchableOpacity style={{justifyContent:'center', alignItems:'center'}}
                                        onPress={() => this.getRelist()}>
                                        <Text style={[commonStyle.fontsizeGlobalbig, {color:this.state.ColorText2,
                                        textDecorationLine: this.state.textDecorationLine2}]}>{strings('car.relist')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ):(<View></View>)
                    }
                    
                </View>

                <SafeAreaView style={[commonStyle.marginGlobaleless,{borderColor: '#707070', borderWidth: 1, 
                margin: '1%', borderRadius: 10, elevation:10000}]}>  
                        {  (this.state.unpaidView)?(
                        <View style={{flexDirection:'row', padding:10, backgroundColor:'#013188', borderTopLeftRadius:10,
                        borderTopRightRadius:10}}>
                            <View style={{flex:0.173, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('main.car_images')}</Text>
                            </View>
                            <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('car.details')}</Text>
                            </View>
                            <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('car.auction')}</Text>
                            </View>
                            <View style={{flex:0.2, justifyContent:'center', alignItems:'center', textAlign:'center'}}>
                                <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('car.purchase_date')}</Text>
                            </View>
                            <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('car.total')}</Text>
                            </View>
                        </View>):<View></View>
                        }
                            {(this.state.remainingView)?(
                            <View style={{flexDirection:'row', padding:10, backgroundColor:'#013188', borderTopLeftRadius:10,
                            borderTopRightRadius:10}}>
                                <View style={{flex:0.173, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('main.car_images')}</Text>
                                </View>
                                <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('car.details')}</Text>
                                </View>
                                <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('car.debit')}</Text>
                                </View>
                                <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('car.credit')}</Text>
                                </View>
                                <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('main.remaining')}</Text>
                                </View>
                        </View>):<View></View>
                        }
                        {(this.state.relistView)?(
                          <View style={{flexDirection:'row', padding:10, backgroundColor:'#013188', borderTopLeftRadius:10,
                          borderTopRightRadius:10}}>
                            <View style={{flex:0.173, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('main.car_images')}</Text>
                            </View>
                            <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('car.details')}</Text>
                            </View>
                            <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('car.auction')}</Text>
                            </View>
                            <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('car.cancellation_date')}</Text>
                            </View>
                            <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('car.total')}</Text>
                            </View>
                        </View>):<View></View>}

                        {(this.state.paidView)?(
                             <View style={{flexDirection:'row', padding:10, backgroundColor:'#013188', borderTopLeftRadius:10,
                             borderTopRightRadius:10}}>
                                <View style={{flex:0.173, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('main.car_images')}</Text>
                                </View>
                                <View style={{flex:0.3, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('car.details')}</Text>
                                </View>
                                <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={{color:'#fff', fontSize:width*0.03, fontWeight:'bold'}}>{strings('car.car_price')}</Text>
                                </View>
                                <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('main.transfer')}</Text>
                                </View>
                                <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('car.total_paid')}</Text>
                                </View>
                                <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('car.remaining_amount')}</Text>
                                </View>
                        </View>):<View></View>}
                            
                        <ScrollView
                            contentContainerStyle = {styles.container}
                            onScroll={(e)=>this.onscroll(e)}
                            scrollEventThrottle={400}>
                        {
                            (this.state.unpaidView)?
                                (this.state.dataNewnotPaid.length > 0)? this.state.dataNewnotPaid.map((item,i) => {
                                    var carImage = item.image_small;
                                    var mode     = i%2;
                                    return(
                                        <View style={{flexDirection:'row', justifyContent:'center',
                                        borderTopWidth:1,
                                        borderTopColor:'#707070',
                                         backgroundColor: mode==0?'#EDEDED':'#fff', padding:'2%',elevation:3}}>
                                            <View style={{flex:0.17, justifyContent:'center', alignItems:'center'}}>
                                                <TouchableOpacity style={{flex:1, justifyContent:'center', alignItems:'center'}} 
                                                    onPress={() => this.fillImagesarr(carImage)}>
                                                    <Image
                                                        resizeMode={"cover"}
                                                        style={commonStyle.image3dbigcover} 
                                                        source={{uri: carImage}}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{flex:0.173, justifyContent:'flex-start', alignItems:'flex-start'}}>
                                                
                                                <Text style={[styles.textbody]}>{item.carMakerName} {item.year}</Text>
                                                <Text style={styles.textbody}>{item.carModelName}</Text>
                                                <Text style={[styles.textbody]} selectable>
                                                    <Text style={{color: '#1760B2'}}>
                                                        Lot#: {item.lotnumber}
                                                    </Text>
                                                </Text>
                                            </View>
                                            <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                                <Text style={styles.textbody}>{item.aTitle+'\n'+item.auction_location_name}</Text>
                                            </View>
                                            <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                                <Text style={styles.textbody}>{item.purchasedate}</Text>
                                            </View>
                                            <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                                <Text style={{color:'green', fontSize:width*0.03, textAlign:'center'}}>{item.calculation.total$} USD</Text>
                                            </View>
                                        </View>
                                    )
                                    }):<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                                        <Text style={commonStyle.fontsizeGlobal}>{strings('main.no_data')}</Text></View>:<View></View> 
                        }

{
                            (this.state.remainingView)?
                                (this.state.noneComplete.length > 0)? this.state.noneComplete.map((item,i) => {
                                    var carImage = item.image_small;
                                    var mode     = i%2;
                                    return(
                                        <View style={{flexDirection:'row', justifyContent:'center',
                                        borderTopWidth:1,
                                        borderTopColor:'#707070',
                                         backgroundColor: mode==0?'#EDEDED':'#fff', padding:'2%',elevation:3}}>
                                            <View style={{flex:0.15, justifyContent:'center', alignItems:'center'}}>
                                                <TouchableOpacity style={{flex:1, justifyContent:'center', alignItems:'center'}} 
                                                    onPress={() => this.fillImagesarr(carImage)}>
                                                    <Image
                                                        resizeMode={"cover"}
                                                        style={commonStyle.image3dbigcover}
                                                        source={{uri: carImage}}
                                                    />
                                                    <Text style={[styles.textbody]}>{item.carMakerName}</Text>
                                                    <Text style={styles.textbody}>{item.carModelName}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{flex:0.2, justifyContent:'flex-start', alignItems:'flex-start'}}>
                                                
                                                <Text style={styles.textbody}>{item.aTitle}</Text>
                                                <Text style={styles.textbody}>{item.purchasedate}</Text>
                                                <Text style={[styles.textbody]} selectable>
                                                    <Text style={{color: '#1760B2'}}>
                                                        Lot#: {item.lotnumber}
                                                    </Text>
                                                </Text>
                                            </View>
                                            <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                                <Text style={styles.textbody}>{item.Debit}</Text>
                                            </View>
                                            <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                                <Text style={styles.textbody}>{item.Credit}</Text>
                                            </View>
                                            <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                                <Text style={{color:'green', fontSize:width*0.03, textAlign:'center'}}>{item.balance} AED</Text>
                                            </View>
                                        </View>
                                    )
                            }):<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                                <Text style={commonStyle.fontsizeGlobal}>{strings('main.no_data')}</Text></View>:<View></View> 
                        }

{
                            (this.state.relistView)?
                                (this.state.dataCancelled.length > 0)? this.state.dataCancelled.map((item,i) => {
                                    var carImage = item.image_small;
                                    var mode     = i%2;
                                    return(
                                        <View style={{
                                            flexDirection:'row', justifyContent:'center',
                                            borderTopWidth:1,
                                            borderTopColor:'#707070',
                                             backgroundColor: mode==0?'#EDEDED':'#fff', padding:'2%',elevation:3}}>
                                            <View style={{flex:0.15, justifyContent:'center', alignItems:'center'}}>
                                                <TouchableOpacity style={{flex:1, justifyContent:'center', alignItems:'center'}} 
                                                    onPress={() => this.fillImagesarr(carImage)}>
                                                    <Image
                                                        resizeMode={"cover"}
                                                        style={commonStyle.image3dbigcover} 
                                                        source={{uri: carImage}}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{flex:0.2, justifyContent:'flex-start', alignItems:'flex-start'}}>
                                                
                                                <Text style={[styles.textbody]}>{item.carMakerName} {item.year}</Text>
                                                <Text style={styles.textbody}>{item.carModelName}</Text>
                                                <Text style={[styles.textbody]} selectable>
                                                    <Text style={{color: '#1760B2'}}>
                                                        Lot#: {item.lotnumber}
                                                    </Text>
                                                </Text>
                                            </View>
                                            <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                                <Text style={styles.textbody}>{item.aTitle+'\n'+item.auction_location_name}</Text>
                                            </View>
                                            <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                                <Text style={styles.textbody}>{item.calculation.cancellationdate}</Text>
                                            </View>
                                            <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                                <Text style={{color:'green', fontSize:width*0.03, textAlign:'center'}}>{item.sales_price}</Text>
                                            </View>
                                        </View>
                                    )
                            }):<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                                <Text style={commonStyle.fontsizeGlobal}>{strings('main.no_data')}</Text></View>:<View></View> 
                        }


    {  (this.state.paidView)? (this.state.carsPaid.length > 0)? this.state.carsPaid.map((item,i) => {
                                    var carImage = item.image_small;
                                    var mode     = i%2;
                                    return(
                                        <View style={{flexDirection:'row', justifyContent:'center',
                                        borderTopWidth:1,
                                        borderTopColor:'#707070',
                                         backgroundColor: mode==0?'#EDEDED':'#fff', padding:'2%',elevation:3}}>
                                            <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                                <TouchableOpacity style={{flex:1, justifyContent:'center', alignItems:'center'}} 
                                                    onPress={() => this.fillImagesarr(carImage)}>
                                                    <Image
                                                        resizeMode={"cover"}
                                                        style={commonStyle.image3dbigcover}  
                                                        source={{uri: carImage}}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{flex:0.2, justifyContent:'flex-start', alignItems:'flex-start'}}>
                                                   
                                                    <Text style={[styles.textbody]}>{item.carMakerName}</Text>
                                                    <Text style={styles.textbody}>{item.carModelName}</Text>
                                                    <Text style={styles.textbody}>{item.aTitle}</Text>
                                                    <Text style={[styles.textbody]} selectable>
                                                        <Text style={{color: '#1760B2'}}>
                                                            Lot#: {item.lotnumber}
                                                        </Text>
                                                    </Text>
                                            </View>
                                            <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                                <Text style={styles.textbody}>{item.car_cost_dallor} $</Text>
                                                <Text style={styles.textbody}>{item.car_cost_aed} AED</Text>
                                                <TouchableOpacity style={{flex:0.2, justifyContent:'center', alignItems:'center'}}
                                                onPress={ () => this.props.navigation.navigate('pafPreview',
                                                 {'url': 'https://cdn.nejoumaljazeera.co/uploads/invoice_file_auction/'+item.invoice_file_auction}) /**() => this.getauctionBill(item.ID)**/}>
                                                <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                                    <Image source={require("../assets/bills.png")}
                                                        style={{justifyContent:'center', width:20, height:20, alignItems:'center', flex:0.2}}
                                                        resizeMode="contain">
                                                    </Image>
                                                </View>
                                            </TouchableOpacity>
                                            </View>
                                            <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                                <Text style={styles.textbody}>{item.transfermoney}</Text>
                                            </View>
                                            <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                                <Text style={styles.textbody}>{item.total_paidt}</Text>
                                            </View>
                                            <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                                <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                                    <Text style={styles.textbody}>{item.remaining_paidt} AED</Text>
                                                </View>
                                                <TouchableOpacity style={{flex:0.2, justifyContent:'center', alignItems:'center'}}
                                                    onPress={ () => this.props.navigation.navigate('pafPreview',
                                                    {'url': 'https://nejoumaljazeera.co/nejoum_App/getCarDetailsInvForPrint/'+item.ID}) /**() => this.getauctionBill(item.ID)**/}>
                                                    <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                                        <Image source={require("../assets/bills.png")}
                                                            style={{justifyContent:'center', width:20, height:20, alignItems:'center', flex:0.2}}
                                                            resizeMode="contain">
                                                        </Image>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                            }):<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                                <Text style={commonStyle.fontsizeGlobal}>{strings('main.no_data')}</Text></View>:<View></View> }
                        {load_more}
                        </ScrollView>
                    </SafeAreaView>
                    

                        <View style={{justifyContent:'center', alignItems:'center', flexDirection:'row', margin:'2%'}}>
                            <Text style = {[commonStyle.fontsizeGlobalbig, {color: 'green', textAlign:'center'}]}>
                                {this.state.balance} 
                            </Text>
                        </View>
            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
       flexGrow: 1,
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
        color: '#0b4282',
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
    content: {
        flex:0.6,
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
    contentContainer1: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: '50%',
        width:'100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    content1: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginVertical: 70,
    },
    confirmButton: {
        borderWidth: 0.5,
        padding: 15,
        margin: 10,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      searchBarContainerStyle: {
        marginBottom: 10,
        flexDirection: "row",
        height: 40,
        shadowOpacity: 1.0,
        shadowRadius: 5,
        shadowOffset: {
          width: 1,
          height: 1
        },
        backgroundColor: "rgba(255,255,255,1)",
        shadowColor: "#d3d3d3",
        borderRadius: 10,
        elevation: 3,
        marginLeft: 10,
        marginRight: 10
      },
    
      selectLabelTextStyle: {
        color: "#000",
        textAlign: "center",
        width: "95%",
        padding: 10,
        flexDirection: "row"
      },
      placeHolderTextStyle: {
        color: "#D3D3D3",
        padding: 10,
        backgroundColor:'transparent',
        textAlign: "center",
        width: "95%",
        flexDirection: "row"
      },
      dropDownImageStyle: {
        marginLeft: 10,
        width: 10,
        height: 10,
        alignSelf: "center"
      },
      listTextViewStyle: {
        color: "#000",
        marginVertical: 7,
        flex: 0.9,
        marginLeft: 20,
        marginHorizontal: 10,
        textAlign: I18n.locale == 'ar'?"right":"left"
      },
      pickerStyle: {
        marginLeft: 18,
        elevation:3,
        paddingRight: 25,
        marginRight: 10,
        marginBottom: 2,
        shadowOpacity: 1.0,
        shadowOffset: {
          width: 1,
          height: 1
        },
        shadowRadius: 10,
        backgroundColor: "transparent",//rgba(255,255,255,1)
        shadowColor: "#d3d3d3",
        flexDirection: "row"
      },
      
    textbody: { textAlign: 'left', color:'#000',fontSize:width*0.02, margin:'4%'},
    contentDate: {
        flex:0.3,
        backgroundColor: 'white',
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 17,
        borderTopLeftRadius: 17,
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    }
});