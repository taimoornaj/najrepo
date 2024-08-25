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
   ActivityIndicator,
   RefreshControl,
   Alert,
   Dimensions,
   SafeAreaView,
   ImageBackground,
   TextComponent,
   StatusBar,
   TextInput,
   FlatList, Button,
 } from "react-native";
 import * as Animatable from 'react-native-animatable';
 import LinearGradient from 'react-native-linear-gradient';
 import { Icon } from 'react-native-elements';
 import { strings } from '../locals/i18n';
 import { AuthContext } from '../components/context';
 import  Loader  from '../components/Loader.js';
 import Icon2 from 'react-native-vector-icons/FontAwesome';
 import { SearchBar } from 'react-native-elements';
 import commonStyle from '../assets/style/styles.js';
 import Modal from "react-native-modal";
 import FontAwesome from "react-native-vector-icons/FontAwesome";
 import DropDownPicker from "react-native-dropdown-picker";
 import I18n from "react-native-i18n";
 import withTailwindHook from "../components/hooks/WithTailwindHook";
 import { string } from "prop-types";
 import { CarTrackLine, TRACK_ACTIVITY_STATUS } from "../components/template/CarTrackLine";
import { faArrowDown, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import RNPicker from "search-modal-picker";

 const {width, height} = Dimensions.get('window');
 const radius = height*0.3 / 2;
 const center = radius-15;
 const circlesmalsize = height*0.09;
 
 //function Dashboard () {
 let CarTrackSearch = class CarTrackSearch extends Component {
 
   constructor(props){
     super(props);
     this.state = {
       loader      : false,
       fulldata    : [],
       post_page   : 0,
       load_more   : false,
       arrays      : [],
       search      : this.props.route.params.lot_vin,
       modalmsg    : false,
       dataSource  : [],
       show_receiver: false,
       visiblePort: false,
       carsForPort:[],
       ports: [],
       selectedPort:false,
       loaderinside: false,
       lot_vin: this.props.route.params.lot_vin,
       receiver_name:'',
       tag: false,
       dataSource: [
        {
          id: 1,
          name: "Afghanistan"
        },
        {
          id: 2,
          name: "Bahrain"
        },
        {
          id: 3,
          name: "Canada"
        },
        {
          id: 4,
          name: "Denmark"
        },
        {
          id: 5,
          name: "Egypt"
        },
        {
          id: 6,
          name: "France"
        },
        {
          id: 7,
          name: "Greece"
        },
        {
          id: 8,
          name: "Hong Kong"
        },
        {
          id: 9,
          name: "India"
        },
        {
          id: 10,
          name: "Japan"
        },
        {
          id: 11,
          name: "Kenya"
        },
        {
          id: 12,
          name: "Liberia"
        }
      ],
     }
   }
 
   componentDidMount() {
     this.getData(this.props.route.params.lot_vin);
     this.getcustomerslotvin();
   }
 
   updateSearch = (search) => {
     this.setState({ search });
   };
   changePort2 = (id,port_id) => {
    
     if (!port_id){
       Alert.alert('Error', 'Please Select Port', [
         {text: 'Okay'}
       ]);
       return;
     }
     /*    //todo: based on tag handle the port change
         const tag = this.state.tag;
 
         if (tag=="customer"){
           //send api to customer with the id and port_id
           //show error or success message
 
         }
         if (tag=="customer_service"){
         // send request to customer service with the id and port_id
         // show error or success message
 
         }
         ///*/
 
 
 
     this.setState({
       visiblePort : false,
       loaderinside : false,
     });
     return true;
   }
   changePort = async(id, port_id) => {
     if (!port_id){
       Alert.alert('Error', 'Please Select Port', [
         {text: 'Okay'}
       ]);
       return;
     }
     if(port_id == 38 && this.state.receiver_name==''){
      Alert.alert('Error', strings('main.add_receiver_name'), [
        {text: 'Okay'}
      ]);
      return;
     }
     const tag = this.state.tag;
 
 
     if (tag=="customer_service" || tag=="customer"){
       // send request to customer service with the id and port_id
       const url =`https://api.nejoumaljazeera.co/api/sendDestinationRequest`;
       const formData = new FormData();
       formData.append('customer_id', AuthContext.id);
       formData.append('car_id', id);
       formData.append('destination', port_id);
       formData.append('notes', this.state.notes||"");
       formData.append('receiver_name', this.state.receiver_name||"");
       const data = {
         "customer_id": AuthContext.id,
         "car_id": id,
         "destination": port_id,
         "notes": this.state.notes||"",
         "receiver_name": this.state.receiver_name||"",
       }
       const request = new Request(url, {
         method: 'POST',
         body: formData,
         headers: new Headers({
           'Content-Type': 'multipart/form-data',
           'Authorization': 'Bearer ' + AuthContext.token,
         }),
       });
       const responseRequest = await fetch(request);
       const response = await responseRequest.json();
       // show error or success message
       if(!response.success){
         Alert.alert('Error', I18n.locale == 'ar'?response.message_ar:response.message, [
           {text: 'Okay'}
         ]);
         return;
       }else{
        Alert.alert('Success', strings('main.reqeust_send_succcess'), [
            {text: 'Okay'}
          ]);
         this.setState({
           visiblePort : false,
           loaderinside : false,
           notes: ''
         });
         return;
       }
     }
     this.setState({
       visiblePort : false,
       loaderinside : false,
     });
     return true;
   }
 
   changeOrRequest = (id) => {
     // check if the car_id is in the array
     // id
     this.setState({
       visiblePort : true,
     });
 
   }
 
   getCarsForPort = async () => {
     this.setState({
       loader : true
     });
     const baseUrl =`https://api.nejoumaljazeera.co/api/destinationChangeCars?customer_id=${AuthContext.id}`;
     const response = await fetch(baseUrl);
     const json = await response.json();
 
     let carsForPort = json.data;
     let tag = false;
     const lotVin =this.state.lot_vin;
 
     for (let i = 0; i < carsForPort.length; i++) {
       let currentCar = carsForPort[i];
       if (currentCar.lotnumber==lotVin){
         tag = currentCar.tag;
         break;
       }
     }
     this.setState({
       isLoading: false,
       loader : false
 
     });
     if (!tag){
       return;
     }
     this.setState(
       {
         tag: tag,
       }
     )

     // get ports for the user
     const portUrl =`https://api.nejoumaljazeera.co/api/general/getCountryPorts?limit=all`;
     const responsePort = await fetch(portUrl);
     const jsonPort = await responsePort.json();
     const formatted_data =[];
     let name = '';
     let port_name =this.state.car_data.destination;
     for (let i = 0; i < jsonPort.data.length; i++) {
       if (jsonPort.data[i].port_id ==port_name){
         port_name= I18n.locale == 'ar'?(jsonPort.data[i].port_name_ar)?jsonPort.data[i].port_name_ar:jsonPort.data[i].port_name:jsonPort.data[i].port_name;
       }
       name = I18n.locale == 'ar'?(jsonPort.data[i].port_name_ar)?jsonPort.data[i].port_name_ar:jsonPort.data[i].port_name:jsonPort.data[i].port_name;
       formatted_data.push({
         name: name,
         id: jsonPort.data[i].port_id,
       });
     }

     this.setState({
       ports: formatted_data,
       isLoading: false,
       port_name: port_name,
     });
 
 
   }
 
   getcustomerslotvin = () => {
     this.setState({
       loader          : true
     });
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
         if(response.success == 'success') {
           this.setState({
             loader              : false,
             searcharrayLotvin   : response.data,
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
         Alert.alert('Error', 'Connection Error', [
           {text: 'Okay'}
         ]);
       });
   }
 
 
   SearchFilterFunction(text) {
     //text = 25502547;
     //console.warn(this.state.search);
     const newData = this.state.searcharrayLotvin.filter(function(item) {
       const itemData = item ? item :'';
       const textData = text;
       return itemData.indexOf(textData) > -1;
     });
     this.setState({ dataSource: newData, search: text,visibleFlat:true
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
 
   getData = (lot_vin) => {
     this.setState({
       loader          : true,
       lot_vin: lot_vin,
     });
     var start     = this.state.start;
     const formData = new FormData();
     formData.append('client_id', '1230');
     formData.append('client_secret', '1230NEJOUM1230');
     formData.append('customer_id', AuthContext.id);
     formData.append('lot_vin',lot_vin);
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
             loader          : false,
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
             op_notes       : response.data.op_notes,
             search          : lot_vin,
             last_status     : response.data.lastStatus,
             lot_vin:    lot_vin,
             car_image       : response.data.photo,
             visibleFlat : false
           });
           this.getCarsForPort()
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
         Alert.alert('Error', 'Connection Error', [
           {text: 'Okay'}
         ]);
       });
   }
 
   degToRad = (deg) => {
     return deg * Math.PI / 180;
   }
 
   render(){
 const tailwind= this.props.tailwind;
     if(this.state.loader){
       return(
         <View>
           <Loader loader={this.state.loader}></Loader>
         </View>
       )
     }
 
     var flatlist = '';
     if( this.state.visibleFlat && this.state.dataSource && this.state.search != ''){
       flatlist= <View style={{flexDirection:'row',flex:1, height:height*(this.state.dataSource.length/15), 
       top:0,right:0,left:width*0.1, marginTop:height*0.07,
         position:'absolute', backgroundColor:'red', width: '80%',
         zIndex: 1000, maxHeight: height*0.7,
         backgroundColor: '#fff', borderBottomLeftRadius: 15, borderRadius:15,
         borderBottomRightRadius: 15,  borderColor: '#dde7f3', justifyContent:'flex-start',alignItems:'center'}}>
         <FlatList keyboardShouldPersistTaps='handled' data={this.state.dataSource}
                   renderItem={({ item }) => (
                     <TouchableOpacity
                       style={{ flexDirection:'row', flex:1,textAlign:'left', justifyContent:'center', padding: '2%',
                         color: '#0d2750'
                         ,BorderSize: 24, borderRadius:25}}
                       activeOpacity={1} onPress = {() => this.getData(item)}>
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
 
 
     if(this.state.trackdata){
       let carTrackList =[];
 
         /*------------------*/
       carTrackList.push({
             name:strings('car.new_cars'),
             status:TRACK_ACTIVITY_STATUS.ACTIVE,
             date:this.state.car_data.purchasedate,
             imgPath:require('../assets/images/car-track/Car1-gray.png')
           }
         );
 
         /*------------------*/
         let towing_status = this.state.car_data.towingstatus==0?TRACK_ACTIVITY_STATUS.INACTIVE:TRACK_ACTIVITY_STATUS.ACTIVE;
         carTrackList.push(
           {
             name:strings('car.towing'),
             status:towing_status,
             date:this.state?.towingstatus?.Picked_date,
             imgPath:require('../assets/images/car-track/towing-gray.png')
           }
         )
 
         /*------------------*/
         let warehouse_status = TRACK_ACTIVITY_STATUS.ACTIVE;
         if (this.state.last_status == "arrivedstatus") {
           warehouse_status = TRACK_ACTIVITY_STATUS.CURRENT;
         }
         if(this.state.car_data.arrivedstatus == 0){
           warehouse_status = TRACK_ACTIVITY_STATUS.INACTIVE;
         }
         carTrackList.push(
           {
             name:strings('car.warehouse'),
             status:warehouse_status,
             date:this.state?.arrivedstatus?.delivered_date,
             imgPath:require('../assets/images/car-track/warehouse-gray.png')
           }
         )
 
         /*------------------*/
 
         let loading_status = TRACK_ACTIVITY_STATUS.ACTIVE;
         if(this.state.last_status == "loading_status"){
           loading_status = TRACK_ACTIVITY_STATUS.CURRENT;
         }
         if (this.state.car_data.loading_status == 0) {
           loading_status = TRACK_ACTIVITY_STATUS.INACTIVE;
         }
         carTrackList.push(
           {
             name:strings('car.loading'),
             status:loading_status,
             date:this.state?.loading_status?.loaded_date,
             imgPath:require('../assets/images/car-track/Loading-gray.png')
           }
         )
         /*------------------*/
         let shipping_status = TRACK_ACTIVITY_STATUS.ACTIVE;
         if(this.state.last_status == "shipping_status"){
           shipping_status = TRACK_ACTIVITY_STATUS.CURRENT;
         }
         if (this.state.car_data.shipping_status == 0) {
           shipping_status = TRACK_ACTIVITY_STATUS.INACTIVE;
         }
         carTrackList.push(
           {
             name:strings('car.shipping'),
             status:shipping_status,
             date:this.state?.shipping_status?.shipping_date,
             imgPath:require('../assets/images/car-track/shipping-gray.png')
           }
         )
         /*------------------*/
         let arrived_status = TRACK_ACTIVITY_STATUS.ACTIVE;
         if(this.state.last_status == "arrived_port"){
           arrived_status = TRACK_ACTIVITY_STATUS.CURRENT;
         }
         if (this.state.car_data.arrived_port == 0) {
           arrived_status = TRACK_ACTIVITY_STATUS.INACTIVE;
         }
         carTrackList.push(
           {
             name:strings('car.port'),
             status:arrived_status,
             date:this.state?.arrived_port?.arrival_date,
             imgPath:require('../assets/images/car-track/Port-gray.png')
           }
         )
         /*------------------*/
 
         let arrive_store_status = TRACK_ACTIVITY_STATUS.ACTIVE;
         if(this.state.last_status == "arrive_store"){
           arrive_store_status = TRACK_ACTIVITY_STATUS.CURRENT;
         }
         if (this.state.car_data.arrive_store == 0) {
           arrive_store_status = TRACK_ACTIVITY_STATUS.INACTIVE;
         }
 
         carTrackList.push(
           {
             name:strings('car.store'),
             status:arrive_store_status,
             date:this.state?.arrive_store?.create_date,
             imgPath:require('../assets/images/car-track/warehouse-store-icon.png')
           }
         )
         /*------------------*/
         let deleivered_status = TRACK_ACTIVITY_STATUS.ACTIVE;
         if(this.state.last_status == "delivercustomer"){
           deleivered_status = TRACK_ACTIVITY_STATUS.CURRENT;
         }
         if (this.state.car_data.deliver_customer == 0) {
           deleivered_status = TRACK_ACTIVITY_STATUS.INACTIVE;
         }
         carTrackList.push(
           {
             name:strings('car.delivered'),
             status:deleivered_status,
             date:this.state?.deliver_customer?.deliver_create_date,
             imgPath:require('../assets/images/car-track/arrived-gray.png')
           }
         )
 
       return (
         <View  style={tailwind('flex-1 flex bg-white')}    >
           <View  style={tailwind('flex-1')}    >
 
           <View style={{backgroundColor:'#343D40', flexDirection:'row', padding:'5%'}}>
             <SearchBar
               platform="ios"
               placeholder={strings("main.search_by")}
               value={this.state.search}
               onChangeText={text => this.SearchFilterFunction(text)}
               onClear={text => this.SearchFilterFunction('')}
               inputStyle={tailwind('text-gray-900  text-sm font-semibold')}

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
                            icon={ faXmarkCircle }
                            color="#ccc"
                            size={width*0.06}
                        />
                   </View>
                 </TouchableOpacity>
               }
             />
           </View>
           {flatlist}
           <SafeAreaView style={tailwind('flex-1 mb-2')}>
             {/*modal  */}
             <Modal
               backdropOpacity={0.3}
               isVisible={this.state.visiblePort}
               onBackdropPress={() =>   this.setState({visiblePort:false})}
               style={styles.contentView}>
               <View style={styles.content}>
 
                 <View  >
                   <View>
                     <Text style={{
                       fontSize: width*0.06,
                       fontWeight: 'bold',
                       color: '#0b4282',
                       textAlign: 'center',
                       marginTop: 10,
                       marginBottom: 10,
                     }}
                     >
                       {this.state.tag== "customer" ? strings('main.change_port'):strings('main.request_port_change')}
                     </Text>
                   </View>
 
                   
                   <View><Text style={
                     {
                      fontSize: width*0.04,
                      fontWeight: 'bold',
                      color: '#0b4282',
                      textAlign: 'center',
                      marginTop: 10,
                      marginBottom: 10,
                     }
                   }>{this.state.port_name}</Text></View>
                  
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
                     <View 
                          style={{backgroundColor:'#ab0909',flex: 1,
                          backgroundColor: '#FFF',
                          minHeight: 1,
                          minWidth: 1,
                          alignItems:'center',}}>
                       <View style={{justifyContent:'center',}}>
                            {(this.state.ports)?
                            <View sryle={{flex:1, width:300}}>
                            <RNPicker
                              dataSource={this.state.ports}
                              dummyDataSource={this.state.ports}
                              defaultValue={false}
                              pickerTitle={strings("main.select_port")}
                              showSearchBar={true}
                              disablePicker={false}
                              changeAnimation={"none"}
                              searchBarPlaceHolder={"Search....."}
                              showPickerTitle={true}
                              searchBarContainerStyle={styles.searchBarContainerStyle}
                              pickerStyle={styles.pickerStyle}
                              pickerItemTextStyle={styles.listTextViewStyle}
                              selectedLabel={this.state.selectedPortname}
                              placeHolderLabel={this.state.selectedPortname}
                              selectLabelTextStyle={styles.selectLabelTextStyle}
                              placeHolderTextStyle={styles.placeHolderTextStyle}
                              dropDownImageStyle={styles.dropDownImageStyle}
                              selectedValue={(index, item) => {
                                if(item.id == 38){
                                  this.setState(
                                    {
                                      selectedPort      : item.id,
                                      selectedPortname : item.name,
                                      show_receiver    : true
                                    });
                                  }else {
                                    this.setState(
                                      {
                                        selectedPort      : item.id,
                                        selectedPortname : item.name,
                                        show_receiver     : false
                                      }
                                    )
                                  }
                                }
                            }
                          /></View>:<View></View>}

                          {(this.state.show_receiver)?
                          <TextInput
                            placeholder={strings('main.receiver_name')}
                            value = {this.state.receiver_name} style={[{
                            borderColor:'#343D40', borderWidth:1, borderRadius: 10, 
                            padding:'5%',
                            marginTop: '10%'}]}
                            multiline = {false}
                            numberOfLines={Platform.OS === 'ios' ? null : height*0.008}
                            minHeight={(Platform.OS === 'ios' && height*0.004) ? (20 * height*0.004) : null}
                            onChangeText = {(value) => this.setState({receiver_name: value})} />:<View></View>}

                          <TextInput
                            placeholder={strings('main.notes')}
                            value = {this.state.notes} style={[{
                            borderColor:'#343D40', borderWidth:1, borderRadius: 10, 
                            padding:'5%',
                            marginTop: '10%'}]}
                            multiline = {false}
                            numberOfLines={Platform.OS === 'ios' ? null : height*0.008}
                            minHeight={(Platform.OS === 'ios' && height*0.008) ? (20 * height*0.008) : null}
                            onChangeText = {(value) => this.setState({notes: value})} />
                          
                       </View>
                        <TouchableOpacity activeOpacity={1} delayPressIn={0} style={commonStyle.submitbutton}
                            onPress={() => this.changePort(this.state.car_data.id,this.state.selectedPort)}>
                            <Text style={commonStyle.buttonText}>
                              {this.state.tag== "customer" ? strings('main.save'):strings('main.request')}
                            </Text>
                        </TouchableOpacity>
                     </View>)
                   }
                 </View>
               </View>
             </Modal>
             <ScrollView contentContainerStyle = {styles.container}>
               <View style={{flex:1, flexDirection:'row', borderBottomColor:'#0d2750',
               backgroundColor:'#EDEDED',
               borderTopWidth:0.5, borderTopColor:'#0d2750', borderBottomWidth:0.5, padding:'1%'}}>
                 <TouchableOpacity
                   animation = "fadeInRight"
                   duration  = {1000}
                   onPress={() => this.props.navigation.navigate('carImagesNavigator',
                    {'car_id': (this.state.car_data)?this.state.car_data.id:'', 
                    'lotnumber':(this.state.car_data)?this.state.car_data.lotnumber:''})}
                   style={{flex:0.4, borderRadius: 10, justifyContent:'flex-start', alignItems:'flex-start'}}>
                   <Image
                     style = {{
                       marginTop: '6%',
                       width: '100%',
                       height: '85%',
                       resizeMode: "cover",
                       borderRadius: 2
                     }}
                     source = {{uri: 'https://cdn.nejoumaljazeera.co/uploads/'+ this.state.car_data.photo}}
                   />
                 </TouchableOpacity>
                 {I18n.locale == 'ar'?
                   <View
                     animation = "fadeInRight"
                     duration  = {1000}
                     style={{flex:1, justifyContent:'flex-start', alignItems:'flex-start'}}
                   >
                     <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                       <Text style={tailwind('text-darkblue ml-3 flex-start font-bold text-md capitalize flex-1 text-left ')}>
                         {this.state.car_data?.year + " "+this.state.car_data?.carMakerName  + " " + this.state.car_data?.carModelName}
                       </Text>
                     </View>
                     <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                       <Text style={tailwind('text-lightblue ml-3 flex-start font-bold text-xxs capitalize flex-1 text-left ')}>
                         { strings('car.lotnumber') +" # " + this.state.car_data?.lotnumber}
                       </Text>
                     </View>
 
 
                     <View style={tailwind('flex-row justify-between   text-start items-start')}>
                       <Text style={tailwind('flex-initial  w-[3rem]     ml-3 text-xxxs  ')}>{strings('car.vin')} </Text>
                       <Text style={tailwind('flex-initial  ml-3   text-xxxs  ')}>
                         {(this.state.car_data)?this.state.car_data.vin:''}{' '}
                       </Text>
                     </View>
                     <View style={tailwind('flex-row justify-between   text-start items-start')}>
                       <Text style={tailwind('flex-initial    w-[3rem]    ml-3 text-xxxs  ')}>{strings('main.model')} </Text>
                       <Text style={tailwind('flex-initial  ml-3   text-xxxs  ')}>
                         {(this.state.car_data)?this.state.car_data.carModelName:''}{' '}
                       </Text>
                     </View>
 
                     <View style={tailwind('flex-row justify-between   text-start items-start')}>
                       <Text style={tailwind('flex-initial     w-[3rem]       ml-3 text-xxxs  ')}>{strings('main.maker')} </Text>
                       <Text style={tailwind('flex-initial  ml-3   text-xxxs  ')}>
                         {(this.state.car_data)?this.state.car_data.carMakerName:''}{' '}
                       </Text>
                     </View>
                     <View style={tailwind('flex-row justify-between   text-start items-start')}>
                       <Text style={tailwind('flex-initial     w-[3rem]    ml-3 text-xxxs  ')}>{strings('main.year')} </Text>
                       <Text style={tailwind('flex-initial  ml-3   text-xxxs  ')}>
                         {(this.state.car_data)?this.state.car_data.year:''}{' '}
                       </Text>
                     </View>
 
 
 
                   </View>:
 
                   <View
                     style={{flex:1, justifyContent:'flex-start', alignItems:'flex-start'}}>
                     <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                       <Text style={tailwind('text-darkblue ml-3 flex-start font-bold text-md capitalize flex-1 text-left ')}>
                         {this.state.car_data?.year + " "+this.state.car_data?.carMakerName  + " " + this.state.car_data?.carModelName}
                       </Text>
                     </View>
                     <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                       <Text style={tailwind('text-lightblue ml-3 flex-start font-bold text-xxs capitalize flex-1 text-left ')}>
                         { strings('car.lotnumber') +" # " + this.state.car_data?.lotnumber}
                       </Text>
                     </View>
                     <View style={tailwind('flex-row justify-between  ml-3 text-start items-start')}>
                       <Text style={tailwind('flex-initial w-[9rem] text-xxxs  ')}>{strings('car.vin')} </Text>
                       <Text style={tailwind('flex-initial  w-[15rem]  text-xxxs  ')}>
                         {(this.state.car_data)?this.state.car_data.vin:''}{' '}
                       </Text>
                     </View>
                     <View style={tailwind('flex-row justify-between  ml-3 text-start items-start')}>
                       <Text style={tailwind('flex-initial w-[9rem] text-xxxs  ')}>{strings('main.model')} </Text>
                       <Text style={tailwind('flex-initial  w-[15rem]  text-xxxs  ')}>
                         {(this.state.car_data)?this.state.car_data.carModelName:''}{' '}
                       </Text>
                     </View>
                     <View style={tailwind('flex-row justify-between  ml-3 text-start items-start')}>
                       <Text style={tailwind('flex-initial w-[9rem] text-xxxs  ')}>{strings('main.maker')} </Text>
                       <Text style={tailwind('flex-initial  w-[15rem]  text-xxxs  ')}>
                         {(this.state.car_data)?this.state.car_data.carMakerName:''}{' '}
                       </Text>
                     </View>
                     <View style={tailwind('flex-row justify-between  ml-3 text-start items-start')}>
                       <Text style={tailwind('flex-initial w-[9rem] text-xxxs  ')}>{strings('main.year')} </Text>
                       <Text style={tailwind('flex-initial  w-[15rem]  text-xxxs  ')}>
                         {(this.state.car_data)?this.state.car_data.year:''}{' '}
                       </Text>
                     </View>
 
                   </View>
                 }
               </View>
               {this.state.car_data.special_notes &&
                      <View style={{width:width,
                       flexDirection: 'row', justifyContent: 'flex-start', padding:'2%'}}>
                        <Text style={{color: '#0093FF',
                            textDecorationLine:'underline',
                            fontSize: width*0.04,
                            textAlign: 'center',
                            borderRadius: 6,
                            fontWeight:'bold'}}>{this.state.car_data.special_notes}</Text>
                      </View>
                    }

               {this.state.tag &&
                 <Animatable.View
                   animation = "fadeInRight"
                   duration  = {1000}
                   style={{
                     textAlign: 'left',
                     justifyContent: 'flex-start',
                     alignContent: 'flex-start',
                     alignItems: 'flex-start',
                     flexDirection: 'row',
                     width: '100%',
                     padding: '1%',
 
                   }}>
                   <View>
                     <TouchableOpacity style={{
                       flexDirection: 'row',
                     }} activeOpacity={1} delayPressIn={0}
                          onPress={() => this.changeOrRequest(this.state.car_data.id)}>
                       <Text style={{
                         color: '#0093FF',
                         textDecorationLine:'underline',
                         fontSize: width*0.04,
                         textAlign: 'center',
                         borderRadius: 6,
                         padding: '2%',
                         fontWeight:'bold'}} >
                         {this.state.tag== "customer" ? strings('main.change_port'):strings('main.request_port_change')}
                       </Text>
 
                     </TouchableOpacity>

                   </View>
                 </Animatable.View>
               }
                 <Text style = {tailwind('text-darkblue rounded-md px-3  font-bold text-lg capitalize flex-1  ')}>
                   { strings('car.lotnumber') +" # " + this.state.car_data?.lotnumber}
                 </Text>
                 <Text style = {[tailwind('text-red rounded-md px-3 font-bold text-xs capitalize flex-1'), {color:'red'}]}>
                    {this.state.op_notes?this.state.op_notes:''}
                  </Text>
                 <CarTrackLine data={carTrackList}/>
             </ScrollView>
           </SafeAreaView>
         </View>
         </View>
       )
     }else {
       return (
         <View style={[styles.container]}><Text>{strings('main.waiting')}</Text></View>
       )
     }
   }
 };
 export default withTailwindHook(CarTrackSearch);
 
 //export default Dashboard
 
 
 
 const styles = StyleSheet.create({
   container: {
     flexGrow: 1,
     justifyContent:'center',
     alignItems:'center'
     /**justifyContent: 'center',
      alignItems: 'center',
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
   textblue: {
     color: '#0d5db8',
     fontSize: 24,
     textAlign: 'right',
   },
   textwhite: {
     color: '#fff',
     fontSize: 20,
     textAlign: 'left',
   },
   textSmallwhite: {
     color: '#fff',
     fontSize: 15,
     textAlign: 'left',
   },
   linearGradientTrack: {
     flex: 1
   },
   numbergradient: {
     flex: 3,
     width: '75%',
     borderTopRightRadius: 25,
     marginTop: 6
   },
   buttonText: {
     fontSize: 15,
     fontFamily: 'Gill Sans',
     textAlign: 'center',
     margin: 10,
     color: '#b8130d',
     backgroundColor: 'transparent',
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
     width: '100%',
     height: '100%',
     borderTopRightRadius: 60,
     borderBottomLeftRadius: 25
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
   },
   circleNewCar: {
     width: 75,
     height: 75,
     position: 'absolute',
     left: '20%',
     right:0,
     top: 80,
     zIndex: 20,
     borderColor: 'white',
     borderWidth: 2,
     borderRadius: 100/2,
     backgroundColor: '#08396f'
   },
   iconNewCar: {
     resizeMode: "contain",
     justifyContent: "center",
     width: 70,
     height: 70,
     position: 'absolute',
     left: 0,
     right: 0
   },
   circleTowing: {
     width: 75,
     height: 75,
     position: 'absolute',
     left: '20%',
     right:0,
     top: 180,
     zIndex: 20,
     borderColor: 'white',
     borderWidth: 2,
     borderRadius: 100/2,
     backgroundColor: '#08396f'
   },
   iconTowing: {
     resizeMode: "contain",
     justifyContent: "center",
     width: 70,
     height: 70,
     position: 'absolute',
     left: 0,
     right: 0
   },
   circleWarehouse: {
     width: 75,
     height: 75,
     position: 'absolute',
     left: '20%',
     right:0,
     top: 280,
     zIndex: 20,
     borderColor: 'white',
     borderWidth: 2,
     borderRadius: 100/2,
     backgroundColor: '#08396f'
   },
   iconWarehouse: {
     resizeMode: "contain",
     justifyContent: "center",
     width: 70,
     height: 70,
     position: 'absolute',
     left: 0,
     right: 0
   },
   circleLoading: {
     width: 75,
     height: 75,
     position: 'absolute',
     left: '20%',
     right:0,
     top: 380,
     zIndex: 20,
     borderColor: 'white',
     borderWidth: 2,
     borderRadius: 100/2,
     backgroundColor: '#08396f'
   },
   iconLoading: {
     resizeMode: "contain",
     justifyContent: "center",
     width: 70,
     height: 70,
     position: 'absolute',
     left: 0,
     right: 0
   },
   circleShipping: {
     width: 75,
     height: 75,
     position: 'absolute',
     left: '20%',
     right:0,
     top: 480,
     zIndex: 20,
     borderColor: 'white',
     borderWidth: 2,
     borderRadius: 100/2,
     backgroundColor: '#08396f'
   },
   iconShipping: {
     resizeMode: "contain",
     justifyContent: "center",
     width: 70,
     height: 70,
     position: 'absolute',
     left: 0,
     right: 0
   },
   circleCarinstore: {
     width: 75,
     height: 75,
     flexDirection: 'row',
     left: '20%',
     right:0,
     zIndex: 20,
     borderColor: 'white',
     borderWidth: 2,
     borderRadius: 100/2,
     backgroundColor: '#08396f'
   },
   iconCarinstore: {
     resizeMode: "contain",
     justifyContent: "center",
     width: 70,
     height: 70,
     position: 'absolute',
     left: 0,
     right: 0
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
   halfCircle: {
     width: 75,
     height: 75,
     zIndex: 100,
     position: 'absolute',
     resizeMode: "cover",
     justifyContent: "center",
     alignItems: 'center',
     left: '55%',
     right: 0,
     borderRadius: 100/2,
     backgroundColor: 'transparent'
   },
   iconUaePort: {
     resizeMode: "contain",
     justifyContent: "center",
     alignItems: 'center',
     width: 50,
     height: 50,
 
   },
   iconUaePortArrived: {
     resizeMode: "contain",
     justifyContent: "center",
     alignItems: 'center',
     width: 40,
     height: 40,
   },
   circleReceived: {
     width: 75,
     height: 75,
     left: '20%',
     right:0,
     top: 0,
     zIndex: 20,
     borderColor: 'white',
     borderWidth: 2,
     borderRadius: 100/2,
     backgroundColor: '#08396f'
   },
   iconReceived: {
     resizeMode: "contain",
     justifyContent: "center",
     width: 70,
     height: 70,
     position: 'absolute',
     left: 0,
     right: 0
   },
   circleSmall: {
     width: 25,
     height: 25,
     position: 'absolute',
     justifyContent: 'center',
     alignItems: 'center',
     left: 0,
     right:0,
     top: -8,
     zIndex: 100,
     backgroundColor: '#ff0000',
     borderRadius: 100/2,
     shadowColor: "#000",
     shadowOffset: {
       width: 0,
       height: 12,
     },
     shadowOpacity: 0.58,
     shadowRadius: 16.00,
     elevation: 24,
   },
   fixed: {
     position: 'absolute',
     top: 0,
     left: 0,
     right: 0,
     bottom: 0,
     zIndex: -200,
     marginBottom: 50,
     marginTop: 100,
   },
   container2: {
     position: 'relative'
   },
   horizontal: {
     flexDirection: "row",
     justifyContent: "space-around",
     padding: 10
   },
   content: {
     flex:0.8,
     backgroundColor: 'white',
     padding: 22,
     justifyContent: 'center',
     alignItems: 'center',
     borderTopRightRadius: 17,
     borderTopLeftRadius: 17,
   },
   contentView: {
     justifyContent: 'flex-end',
     margin: 0,
   },
   container5: {
     flex: 1,
     backgroundColor: '#FFF',
     minHeight: 1,
     minWidth: 1,
     alignItems:'center',
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
    textAlign: "left",
    width: "99%",
    padding: 10,
    flexDirection: "row"
  },
  placeHolderTextStyle: {
    color: "#D3D3D3",
    padding: 10,
    textAlign: "left",
    width: "99%",
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
    marginVertical: 10,
    flex: 0.9,
    marginLeft: 20,
    marginHorizontal: 10,
    textAlign: "left"
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
    borderWidth:1,
    shadowRadius: 10,
    backgroundColor: "rgba(255,255,255,1)",
    shadowColor: "#d3d3d3",
    borderRadius: 5,
    flexDirection: "row"
  }

   
 });
 