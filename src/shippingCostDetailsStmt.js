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
   Alert,
   SafeAreaView,
   Dimensions,
   RefreshControl,
   StatusBar
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
 import commonStyle from '../assets/style/styles.js';
 import Modal from 'react-native-modal';
 import Icon2 from 'react-native-vector-icons/FontAwesome';
 import DatePicker from 'react-native-datepicker';
 import MonthPicker from 'react-native-month-picker';
 import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
 import { faChevronLeft, faSliders, faShare, faXmarkCircle, faArrowRight, faX } from '@fortawesome/free-solid-svg-icons';
 import RNPicker from "search-modal-picker";
 import DateTimePicker from '@react-native-community/datetimepicker';
 import ImageViewer from 'react-native-image-zoom-viewer';
 import Share from 'react-native-share';
 import ImgToBase64 from 'react-native-image-base64';
 import { Table, TableWrapper,Col, Cols, Cell,Row,Rows } from 'react-native-table-component';
import { FlashList } from '@shopify/flash-list';
 
 const {width, height} = Dimensions.get('window'); 
 
 export default class ShippingCostDetailsStmt extends Component {
 
     constructor(props){
         super(props);
         this.state = {
             setd: '',
             search: '',
             allcount: 0,
             from_date: '',
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
             dataNewnotPaid: [],
             dataCancelled: [],
             noneComplete: [],
             visibleImage: false,
             imagesSlider: [],
             unpaidViewTabs: true,
             carsShippedPaid: [],
             visibleShipping: false,
             shipping_details : [],
             carsShippedPaid: [],
             shipping_extra: [],
             dataPaid: [],
             visibleShippingExtra: false,
             visibleShippingFines: false,
             start:0,
             balance:0,
             balanceTotalPaid:0,
             tableHeadExtra: [strings('car.details'), strings('main.amount'), strings('main.note')],
             tableHeadFines: [strings('car.warehouse'), strings('main.StartDate'), strings('main.EndDate'), strings('main.days')
             , strings('main.fines')],
             tableHeadShipping: [strings('car.details'), strings('car.unpaid2'), strings('car.paid')],
             loader_unpaid: false,
             balance_paid: 0,
             balance_unpaid: 0,
             total_cars_paid:0, 
             total_cars_unpaid: 0
         }
 
           this.props.navigation.setOptions({
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
                             <Text style={commonStyle.headerText}>{strings('car.arrived_car')}</Text>
                         </View>
                         <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                             <TouchableOpacity onPress={() => this.setState({visible:true})}>
                                 <FontAwesomeIcon
                                         icon={ faSliders }
                                         color="#fff"
                                         size={width*0.06}
                                     />
                             </TouchableOpacity>
                         </View>
                         </View>       
                 </View>
             )
           });
     }
 
     async componentDidMount() {
        this.getData();
        this.getUnPaidBalance();
        this.getPaidBalance();
     }
 
     onscroll = (e) => {
         var total_posts      = this.state.total_data;
         var total_post_count = 0;
 
         if (this.state.paidView) {
             total_post_count = this.state.dataPaid.length;
         } else {
             total_post_count = this.state.carsShippedPaid.length;
         }
 
         var contentLength    = e.nativeEvent.contentSize.height;
         var trailingInset    = e.nativeEvent.contentInset.bottom;
         var scrollOffset     = e.nativeEvent.contentOffset.y;
         var viewportLength   = e.nativeEvent.layoutMeasurement.height;
      
         if( Math.round(viewportLength + scrollOffset) >= Math.round(contentLength)){
           if(this.state.load_more == false && total_posts != total_post_count)
             this.load_more_data();
         }
     }
 
     getShippingDetails = (car_id, lotnumber) => {
         this.setState({
             loaderInside          : true,
             visibleShipping: true,
             shipping_details: []
         });
         var Url  = "https://api.nejoumaljazeera.co/api/car/shippingBillDetailnoAuth/"+car_id;
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
             var temparr = [];
             if(response.data.length > 0){
                 response.data.forEach((element,i) => {
                     var objectarr = [];
                     if(i == 0 || i == 1){
                         objectarr.push(this.details2(element.service_label_en, element.service_label_ar));
                         objectarr.push(this.debitDetails2(element.debit));
                         objectarr.push(this.creditDetails2(element.credit));
                     }else {
                         objectarr.push(this.details2(element.service_label_en, element.service_label_ar));
                         objectarr.push(this.debitDetails(element.debit));
                         objectarr.push(this.creditDetails(element.credit));
                     }
                     temparr.push(objectarr);
                 });
                 this.setState({
                     loaderInside      : false,
                     shippingDetails   : response.data,
                     shipping_details: temparr,
                     totalremainingShipping: response.total,
                     lot: lotnumber,
                 });
             }else {
                 this.setState({
                     loaderInside      : false
                 });
             }
             return;
         })
         .catch((error) => {
             this.setState({
                 loaderInside      : false,
                 error_message    : error  
             });
             Alert.alert('Error', 'Connection Error', [
                 {text: 'Okay'}
             ]);
         });  
     }
 
     getStorageDetails = (car_id, lotnumber) => {
         this.setState({
             loaderInside          : true,
             visibleShippingFines: true,
         });
         var Url  = "https://api.nejoumaljazeera.co/api/car/storageFine/"+car_id;
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
             var temparr = [];
             if(response.data){
                 data = response.data;
                 var dd1 = '';
                 if (data.days_transport_allow){
                     dd1 = '';
                 }
                 else {
                     dd1 = data.start_transport;
                 }
                 var dd2 = '';
                 if (data.days_transport_allow){
                     dd2 = data.days_transport;
                 }
                 else {
                     dd2 = data.days_transport;
                 }
                 var temparr = [];
                 var totalCost = 0;
 
                 var objectarr = [];
                 objectarr.push(data.warehouse_transport);
                 objectarr.push(dd1);
                 objectarr.push(data.end_transport);
                 objectarr.push(dd2);
                 objectarr.push(data.fine_transport);
                 temparr.push(objectarr);
                 
                 if(data.fine_transport){
                     totalCost = parseFloat(totalCost) + parseFloat(data.fine_transport);
                 }
 
                 if(data.days_warehouse){
                     data.days_warehouse.forEach((element,i) => {
                         if(data.warehouse_warehouse[i]){
                             var dd1 = '';
                             if (data.days_warehouse_allow[i]){
                                 dd1 = '';
                             }
                             else {
                                 dd1 = data.start_warehouse[i];
                             }
                 
                 
                             var dd2 = '';
                             if (data.days_warehouse_allow[i]){
                                 dd2 = data.days_warehouse[i];
                             }
                             else {
                                 dd2 = data.days_warehouse[i];
                             }
                             var objectarr = [];
                             objectarr.push(data.warehouse_warehouse[i]);
                             objectarr.push(dd1);
                             objectarr.push(data.end_warehouse[i]);
                             objectarr.push(dd2);
                             objectarr.push(data.fine_wearhouse[i]);
                             temparr.push(objectarr);
                 
                             if(data.fine_wearhouse[i]){
                                 totalCost = parseFloat(totalCost) + parseFloat(data.fine_wearhouse[i]);
                             }
                         }
                     });
                 }
                 
                 this.setState({
                     shipping_Fines: temparr,
                     totalFines: totalCost,
                     lot: lotnumber,
                     visibleShippingFines: true
                 });
             } else {
                 this.setState({
                     loaderInside      : false
                 });
             }
             return;
         })
         .catch((error) => {
             this.setState({
                 loaderInside      : false
             });
             Alert.alert('Error', 'Connection Error', [
                 {text: 'Okay'}
             ]);
         });  
     }
 
     getExtraDetails = (car_id, lotnumber) => {
         this.setState({
             loaderInside            : true,
             visibleShippingExtra    : true,
         });
         var Url  = "https://api.nejoumaljazeera.co/api/car/getExtraDetail/"+car_id;
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
             var temparr = [];
             var totalCost = 0;
             response.data.forEach(element => {
                 if(element.value && element.value > 0){
                     var objectarr = [];
                     var details =  element.service_labal_en + '/' + element.service_labal_ar;
                     objectarr.push(details);
                     objectarr.push(element.value);
                     objectarr.push(element.note);
                     totalCost = parseFloat(totalCost) + parseFloat(element.value);
                     temparr.push(objectarr);
                 }
             });
             this.setState({
                 shipping_extra: temparr,
                 totalExtra: totalCost,
                 lot: lotnumber,
                 visibleShippingExtra: true
             });
         })
         .catch((error) => {
             this.setState({
                 loaderInside      : false,
                 error_message    : error  
             });
             Alert.alert('Error', 'Connection Error', [
                 {text: 'Okay'}
             ]);
         });
     }
     
     load_more_data = async () => {
         this.setState({
             load_more          : true,
             visible            : false
         });
         var start     = Number(parseInt(this.state.start)+1);
         var Url = '';
         if(this.state.paidView){
             Url = "https://api.nejoumaljazeera.co/api/cashier/getCarsFinalInvoices?customer_id="+AuthContext.id+"&page="+start
             +"&date_from="+this.state.from_date+"&date_to="+this.state.to_date;
         } else {
             Url  = "https://api.nejoumaljazeera.co/api/cashier/arrivedCars?customer_id="+AuthContext.id+"&page="+start
             +"&date_from="+this.state.from_date+"&date_to="+this.state.to_date;
         }
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
             if(response.data){
                 if (this.state.paidView) {
                     var old_data    = this.state.dataPaid;
                     for(var i = 0; i < response.data.length; i++){
                         old_data.push(response.data[i]);
                     }
                     const uniqueData = old_data.filter((item, index, self) =>
                         index === self.findIndex((t) => t.car_id === item.car_id)
                     );
                     this.setState({
                         load_more       : false,
                         post_page       : uniqueData.length,
                         dataPaid        : uniqueData,
                         start: start,
                         balance         : this.state.balance + response.total_amount
                     });
                 } else {
                     var old_data    = this.state.carsShippedPaid;
                     for(var i = 0; i < response.data.length; i++){
                         old_data.push(response.data[i]);
                     }
                     const uniqueData = old_data.filter((item, index, self) =>
                         index === self.findIndex((t) => t.car_id === item.car_id)
                     );
 
                     this.setState({
                         load_more       : false,
                         post_page       : uniqueData.length,
                         start: start,
                         carsShippedPaid : uniqueData,
                         balance         : this.state.balance + response.total_required
                     });
                 }
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
 
     getUnPaidBalance = () => {
         this.setState({
             loader_unpaid          : true,
         });
         var Url  = "https://api.nejoumaljazeera.co/api/cashier/arrivedCarsCount?customer_id="+AuthContext.id+
         "&date_from="+this.state.from_date+"&date_to="+this.state.to_date;
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
             this.setState ({
                 loader_unpaid     : false,
                 total_cars_unpaid : response.totalRecords,
                 balance_unpaid    : response.total_required
             });
             return;
         })
         .catch((error) => {
             this.setState({
                 loader_unpaid      : false,
                 error_message    : error  
             });
         });
     }
 
     getPaidBalance = () => {
         this.setState({
             loader_unpaid          : true,
         });
         var Url  = "https://api.nejoumaljazeera.co/api/cashier/getCarsFinalInvoicesCount?customer_id="+AuthContext.id+
         "&date_from="+this.state.from_date+"&date_to="+this.state.to_date;
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
             this.setState ({
                 loader_unpaid      : false,
                 total_cars_paid : response.totalRecords,
                 balance_paid: response.total_amount
                 
             });
             return;
         })
         .catch((error) => {
             this.setState({
                 loader_unpaid      : false,
                 error_message    : error  
             });
         });
     }
 
     getData = () => {
         this.setState({
             loader          : true,
             visible         : false
         });
         var start     = this.state.start;
         var Url  = "https://api.nejoumaljazeera.co/api/cashier/arrivedCars?customer_id="+AuthContext.id+
         "&page="+start+"&date_from="+this.state.from_date+"&date_to="+this.state.to_date;
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
             if(response.data){
                 this.setState ({
                     loader      : false,
                     unpaidView: true,
                     carsShippedPaid: response.data,
                     post_page: response.totalRecords,
                     start: start,
                     balanceTotalUnPaid: response.total_required
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
 
     getunPaid = () => {
         this.setState({
             backgroundColor2: '#fff',
             unpaidView: true,
             remainingView: false,
             loader: true,
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
             ColorText4:'#fff',
         });
         var start     = 0;
         var Url  = "https://api.nejoumaljazeera.co/api/cashier/arrivedCars?customer_id="+AuthContext.id+
         "&page="+start+"&date_from="+this.state.from_date+"&date_to="+this.state.to_date;
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
             if(response.data){
                 this.setState ({
                     loader      : false,
                     carsShippedPaid: response.data,
                     post_page: response.data.length,
                     dataPaid: [],
                     balanceTotalPaid: 0,
                     start: start,
                     balanceTotalUnPaid: response.total_required
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
 
     getPaid = () => {
         this.setState({
             backgroundColor2: '#fff',
             unpaidView: false,
             remainingView: false,
             paidView: true,
             backgroundColor1: '#fff',
             backgroundColor: '#fff',
             ColorText: '#1760B2',
             ColorText1:'#1760B2',
             ColorText2:'#1760B2',
             ColorText3:'#fff',
             ColorText4:'#1760B2',
             backgroundColor3:  '#013188',
             backgroundColor4: '#EDEDED',
             unpaidViewTabs: false,
             loader          : true,
             visible         : false,
             balance : 0
         });
         var start     = this.state.start;
         var Url = "https://api.nejoumaljazeera.co/api/cashier/getCarsFinalInvoices?customer_id="+AuthContext.id+"&page="+start
         +"&date_from="+this.state.from_date+"&date_to="+this.state.to_date;
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
             if (this.state.paidView) {
                 post_page   = response.data.length;
             } else {
                 post_page   = response.data.length;
             }
             if(response.data){
                 this.setState ({
                     loader      : false,
                     post_page: post_page,
                     dataPaid: response.data,
                     carsShippedPaid: [],
                     balanceTotalUnPaid: 0,
                     balanceTotalPaid: response.total_amount,
                 });
                 return;
             }
             else {
                 this.setState({
                     loader      : false,
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
             });
             Alert.alert('Error', 'Connection Error', [
                 {text: 'Okay'}
             ]);
         });
 
     }
     
     setModalVisible = () => {
         this.setState({
             visible: false,
         });
     }
 
     setModalVisibleShipping = () => {
         this.setState({
             visibleShipping: false,
         });
     }
 
     setModalVisibleShippingExtra = () => {
         this.setState({
             visibleShippingExtra: false,
         });
     }
 
     setModalVisibleShippingFines = () => {
         this.setState({
             visibleShippingFines: false,
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
             from_date: '',
             to_date: '',
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
 
     fillImagesarr = async(car_id) => {
         this.setState({
             loader          : true
         });
         var type = 'store';
         var Url = '';
         Url = "https://api.nejoumaljazeera.co/api/getImages?car_id="+car_id+"&type="+type;
 
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
             if(response.images){
                 carImages=[];
                 if(response.images.length >0){
                     fakeData = [];
                     response.images.forEach(instance => {
                         fakeData.push({
                           image: instance
                         });
                         carImages.push({url: instance});
                     });
                 this.setState ({
                   loader      : false,
                   total_images: response.images.length,
                   imagesSlider: carImages,
                   visibleImage:true
                 });
 
                 }else {
                     this.setState({
                         loader      : false,
                         error_message    : 'error',
                         no_data : true
                     });
                 }
 
                 return;
             }
             else{
                 this.setState({
                     loader      : false,
                     error_message    : 'error',
                     no_data : true
                 });
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
 
 
     debitDetails = (value) => (
         <View style={{flex:1, justifyContent:'center', alignItems:'flex-end'}}>
             <Text style = {[commonStyle.fontsizeGlobal, {color: '#a41720'}]}>
                 {value}
             </Text>
         </View>
     );
 
 
     creditDetails = (value) => (
         <View style={{flex:1, justifyContent:'center', alignItems:'flex-end'}}>
             <Text style = {[commonStyle.fontsizeGlobal,{ color: 'green'}]}>
                 {value}
             </Text>
         </View>
     );
 
     debitDetails2 = (value) => (
         <View style={{flex:1, justifyContent:'center', alignItems:'flex-end',}}>
             <Text style = {[commonStyle.fontsizeGlobal, {color: '#a41720'}]}>
                 {value}
             </Text>
         </View>
     );
 
     details2 = (value_en, value_ar) => (
         <View>
             <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                 <Text style = {[commonStyle.fontsizeGlobal, {color: '#000'}]}>
                     {value_en}
                 </Text>
             </View>
             <View style={{justifyContent:'center', alignItems:'center'}}>
                 <Text style = {[commonStyle.fontsizeGlobal, {color: '#000'}]}>
                     {value_ar}
                 </Text>
             </View>
         </View>
     );
 
     details = (value) => (
         <View style={{justifyContent:'center', alignItems:'center'}}>
             <Text style = {[commonStyle.fontsizeGlobal, {color: '#000'}]}>
                 {value}
             </Text>
         </View>
     );
 
 
     creditDetails2 = (value) => (
         <View style={{flex:1, justifyContent:'center', alignItems:'flex-end'}}>
             <Text style = {[commonStyle.fontsizeGlobal, { color: 'green'}]}>
                 {value}
             </Text>
         </View>
     );
 
     remainginDetails = (value) => {
         <View style={{flex:1, justifyContent:'flex-end', alignItems:'flex-end'}}>
             <Text style = {{fontSize:width*0.03, justifyContent:'flex-end', color: '#fc5185'}}>
                 {value}
             </Text>
         </View>
     }
     
     showShippingExtra = (data, lotnumber) => {
         var temparr = [];
         var totalCost = 0;
         data.forEach(element => {
             var objectarr = [];
             var details =  element.service_labal_en + '/' + element.service_labal_ar;
             objectarr.push(details);
             objectarr.push(element.value);
             objectarr.push(element.note);
             if(element.value){
                 totalCost = parseFloat(totalCost) + parseFloat(element.value);
             }
             temparr.push(objectarr);
         });
         this.setState({
             shipping_extra: temparr,
             totalExtra: totalCost,
             lot: lotnumber,
             visibleShippingExtra: true
         });
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
 
         if(this.state.from_date != '' || this.state.to_date != '' && (this.state.from_date || !this.state.from_date)){
             var today = new Date();
             var dd = String(today.getDate()).padStart(2, '0');
             var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
             var yyyy = today.getFullYear();
 
             today = yyyy + '-' + mm + '-' + dd ;
 
             var date_scale = 
                 <View style={{flexDirection:'row', flex:1, justifyContent:'space-around', alignItems:'center'}}>
                     <View style={{}}>
                         <Text style={styles.textBlue}>{this.state.from_date}</Text>
                     </View>
                     <View style={{}}>
                         <FontAwesomeIcon
                             icon={ faArrowRight }
                             color="#0d5db8"
                             backgroundColor="#fff"
                             size={20}
                         />
                     </View>
                     <View style={{}}>
                         <Text style={styles.textBlue}>{(this.state.to_date)?this.state.to_date:today}</Text>
                     </View>
                         <TouchableOpacity activeOpacity={1} style={{}} onPress={() => this.resetDate()}>
                             <View >
                                 <FontAwesomeIcon
                                     icon={ faX }
                                     color="#0d5db8"
                                     backgroundColor="#0d5db8"
                                     size={20}
                                 />
                             </View>
                         </TouchableOpacity>
                 </View>;
         }else {
             var date_scale =  <View></View>;
         }
 const  tablefooter = ['', 
 <LinearGradient colors = {['#0B9A21', '#0B9A21']} style={{ borderRadius:10, flexDirection:'row',
  flex:1, justifyContent:'center', alignItems:'center'}}>
     <Text style = {{color: '#fff', fontSize: width*0.04, textAlign:'center'}}>
         {this.state.totalExtra} 
     </Text>
 </LinearGradient>, ''] ;
 
 const  tablefooterShipping = ['', 
                         <LinearGradient colors = {['#0B9A21', '#0B9A21']} style={{borderRadius:10, flexDirection:'row',
                         flex:1, justifyContent:'center', alignItems:'center'}}>
                             <Text style = {{color: '#fff', fontSize: width*0.04, textAlign:'center'}}>
                                 {this.state.totalremainingShipping} 
                             </Text>
                         </LinearGradient>,''] ;
 
 const  tablefooterFines = ['', '', '', '', 
 <LinearGradient colors = {['#0B9A21', '#0B9A21']} style={{ borderRadius:10, flexDirection:'row',
  flex:1, justifyContent:'center', alignItems:'center'}}>
     <Text style = {{color: '#fff', fontSize: width*0.04, textAlign:'center'}}>
         {this.state.totalFines} 
     </Text>
 </LinearGradient>] ;
 
         var balance = 0;
         var total_cars = 0;
         if(this.state.paidView){
             balance = 'AED ' + this.state.balance_paid;
             total_cars = '(' + this.state.total_cars_paid + ') ' +strings('main.cars');
         } else {
             balance = 'AED ' + this.state.balance_unpaid;
             total_cars = '(' + this.state.total_cars_unpaid + ') ' +strings('main.cars');
         }
         return (
             <SafeAreaView style={{flex:1, backgroundColor:'#EDEDED'}}>
              <Modal visible={this.state.visibleImage} transparent={true} style={{
                 backgroundColor: 'white',
                 margin: 0, // This is the important style you need to set
                 alignItems: undefined,
                 justifyContent: undefined, flex:1, flexGrow:1}}>
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
                                         size={width*0.06}
                                     />
                                 </TouchableOpacity>
                                 <TouchableOpacity style={{borderRadius:25,justifyContent:'center',
                                 alignItems:'center', width:50, height:50}}
                                 onPress={() => this.shareImage(this.state.imagesSlider[0])}>
                                     <FontAwesomeIcon
                                         icon={ faShare }
                                         color="#fff"
                                         size={width*0.06}
                                     />                                
                                 </TouchableOpacity>
                             </View>
                         </SafeAreaView>
                     }
                     loadingRender = {() => <Loader loader={true}></Loader> }
                 />
         </Modal>
 
 
                         <Modal
                             backdropOpacity={0.3}
                             isVisible={this.state.visibleShippingExtra}
                             onBackdropPress={() => this.setModalVisibleShippingExtra(false)}
                             style={styles.contentView}>
                             <View style={styles.contentExtra}>
                                 <View style={{flexDirection:'row', margin:'3%'}}>
                                     <Text style={[commonStyle.headerText, {color: '#0b4282'}]}>{strings('car.extra')}</Text>
                                 </View>
                                 <View style={{flexDirection:'row', margin:'3%'}}>
                                     <Text style={[commonStyle.textbody2, {color: '#0b4282'}]}>LOT: {this.state.lot}</Text>
                                 </View>
                                 <View style={{flex:1, width:'100%'}}>
                                     <TableWrapper>
                                         <Row data={this.state.tableHeadExtra} 
                                         style={styles.head} textStyle={styles.text}/>
                                         <Rows data={this.state.shipping_extra} 
                                             style={styles.row} textStyle={[styles.textbody2]}/>
                                     </TableWrapper>
                                     <Row data={tablefooter} 
                                         borderStyle= {{}} 
                                         style={styles.footer} textStyle={styles.text}/>
                                </View>
                             </View>
                         </Modal>
 
                         <Modal
                             backdropOpacity={0.3}
                             isVisible={this.state.visibleShippingFines}
                             onBackdropPress={() => this.setModalVisibleShippingFines(false)}
                             style={styles.contentView}>
                             <View style={styles.contentExtra}>
                                 <View style={{flexDirection:'row', margin:'3%'}}>
                                     <Text style={[commonStyle.headerText, {color: '#0b4282'}]}>{strings('car.storage')}</Text>
                                 </View>
                                 <View style={{flexDirection:'row', margin:'3%'}}>
                                     <Text style={[commonStyle.textbody2, {color: '#0b4282'}]}>LOT: {this.state.lot}</Text>
                                 </View>
                                 <View style={{flex:1, width:'100%'}}>
                                     <TableWrapper>
                                         <Row data={this.state.tableHeadFines} 
                                         style={styles.head} textStyle={styles.text}/>
                                         <Rows data={this.state.shipping_Fines} 
                                         borderStyle= {{padding:3}}
                                             style={styles.row} textStyle={[styles.textbody2,{textAlign:'center'}]}/>
                                     </TableWrapper>
                                     <Row data={tablefooterFines} 
                                         borderStyle= {{}} 
                                         style={styles.footer} textStyle={styles.text}/>
                                 </View>
                             </View>
                         </Modal>
                         
                         <Modal
                            backdropOpacity={0.3}
                            isVisible={this.state.visibleShipping}
                            onBackdropPress={() => this.setModalVisibleShipping(false)}
                            style={styles.contentView}>
                             {!this.state.loaderInside?
                                <View style={styles.content}>
                                     <ScrollView contentContainerStyle = {{flexGrow:1, width:width*0.9,justifyContent: 'center',alignItems: 'center',}}>
                                            <View style={{ flexDirection:'row', margin:'3%'}}>
                                                <Text style={[commonStyle.headerText, {color: '#0B4282'}]}>{strings('car.shipping_details')}</Text>
                                            </View>
                                            <View style={{ flexDirection:'row', margin:'3%'}}>
                                                <Text style={[commonStyle.textbody2, {color: '#0B4282'}]}>LOT: {this.state.lot}</Text>
                                            </View>
                                            <View style={{flex:1, width:'100%'}}>
                                                    <TableWrapper>
                                                        <Row data={this.state.tableHeadShipping}
                                                        borderStyle= {{borderWidth: 1, borderColor: '#fff'}}
                                                        style={styles.head} textStyle={styles.text}/>
                                                        <Rows data={this.state.shipping_details}
                                                        borderStyle= {{padding:3}}
                                                            style={styles.row} textStyle={styles.textbody2}/>
                                                    </TableWrapper>
                                                    <Row data={tablefooterShipping}
                                                        borderStyle= {{}}
                                                        style={styles.footer} textStyle={styles.text}/>
                                            </View>
                                    </ScrollView>
                                </View>
                             :
                            <View style={{ flex:1}}>
                                <Loader loader={this.state.loaderInside}></Loader>
                            </View>}
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
                                     onDateChange={(date) => {this.setState({from_date: date})}}
                             />
                             <Text style={styles.whiteText2}>{strings('main.from')}: </Text>
                         </View>
                         ):(<View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
                         <Text style={styles.whiteText2}>{strings('main.from')}: </Text>
 
                             <DatePicker
                                 style={{width: 150}}
                                 date={this.state.from_date}
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
                                 onDateChange={(date) => {this.setState({from_date: date})}}
                             />
 
                     </View>)
 
                         }
                         {I18n.locale == 'ar'?(
                              <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
 
 
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
                                 onPress={() => 
                                 this.state.paidView?
                                 this.getPaid():this.getData()}>           
                                             <Text style={commonStyle.buttonText}>
                                                     {strings('main.search')}        
                                             </Text>
                                 </TouchableOpacity>
                             </View>
                         
                     </View>
                 </Modal>
             
             
            
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
         <View style={{flexDirection:'row'}}>
             {date_scale}    
         </View>
             <SafeAreaView style={[commonStyle.marginGlobaleless,{borderColor: '#707070', borderWidth: 1, margin: '1%', 
             borderRadius: 10, elevation:10000}]}>
        
                     
                     {(this.state.unpaidView)?
                      <View style={{flexDirection:'row', padding:10, backgroundColor:'#013188', borderTopLeftRadius:10,
                      borderTopRightRadius:10}}>
                          <View style={{flex:0.173, justifyContent:'center', alignItems:'center'}}>
                              <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('main.car_images')}</Text>
                          </View>
                          <View style={{flex:0.3, justifyContent:'center', alignItems:'center'}}>
                              <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('car.details')}</Text>
                          </View>
                          <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                              <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('car.arrived_date')}</Text>
                          </View>
                          <View style={{flex:0.15, justifyContent:'center', alignItems:'center'}}>
                              <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('main.fines2')}</Text>
                          </View>
                          <View style={{flex:0.15, justifyContent:'center', alignItems:'center'}}>
                              <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('car.extra')}</Text>
                          </View>
                          <View style={{flex:0.15, justifyContent:'center', alignItems:'center'}}>
                              <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('car.total')}</Text>
                          </View>
                      </View>:
                       <View style={{flexDirection:'row', padding:10, backgroundColor:'#013188', borderTopLeftRadius:10,
                       borderTopRightRadius:10}}>
                           <View style={{flex:0.173, justifyContent:'center', alignItems:'center'}}>
                               <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('main.car_images')}</Text>
                           </View>
                           <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                               <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('car.details')}</Text>
                           </View>
                           <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                               <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('car.payment_date')}</Text>
                           </View>
                           <View style={{flex:0.15, justifyContent:'center', alignItems:'center'}}>
                               <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('main.fines2')}</Text>
                           </View>
                           <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                               <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('car.amount_paid')}</Text>
                           </View>
                           <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                               <Text style={{fontSize:width*0.03, color:'#fff', fontWeight:'bold'}}>{strings('main.remaining')}</Text>
                           </View>
                       </View>}
                         
                     <ScrollView
                         contentContainerStyle = {styles.container}
                         onScroll = {(e) => this.onscroll(e)}
                         scrollEventThrottle = {400}>
                     {
                         (this.state.unpaidView)?
                             (this.state.carsShippedPaid.length > 0)? this.state.carsShippedPaid.map((item,i) => {
                                 var carImage = item.image;
                                 var mode     = i%2;
                                 return(
                                     <View style={{flexDirection:'row', justifyContent:'center',
                                     borderTopWidth:1,
                                     borderTopColor:'#707070',
                                      backgroundColor: mode==0?'#EDEDED':'#fff', padding:'2%',elevation:3}} key={item.car_id}>
                                         <View style={{flex:0.173, justifyContent:'center', alignItems:'center'}}>
                                             <TouchableOpacity style={{flex:1, justifyContent:'center', alignItems:'center'}} 
                                                 onPress={() => this.fillImagesarr(item.car_id)}>
                                                 <Image
                                                     resizeMode={"cover"}
                                                     style={commonStyle.image3dbigcover}
                                                     source={{uri: carImage}}
                                                 />
                                             </TouchableOpacity>
                                         </View>
                                         
                                         <View style={{flex:0.3, justifyContent:'flex-start', alignItems:'flex-start'}}>
                                             <Text style={[styles.textbody]} selectable>
                                                 <Text style={{color: '#1760B2'}}>
                                                     Lot#: {item.lotnumber}
                                                 </Text>
                                             </Text>
                                             <Text style={[styles.textbody]}>{item.carMakerName} {item.year}</Text>
                                             <Text style={styles.textbody}>{item.carModelName}</Text>
                                         </View>
 
                                         <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                             <Text style={styles.textbody}>{item.arrival_date}</Text>
                                         </View>
                                         <View style={{flex:0.15, justifyContent:'center', alignItems:'center'}}>
                                             <TouchableOpacity
                                                     onPress = {() => this.getStorageDetails(item.car_id, item.lotnumber)}>
                                                     <Text style={[commonStyle.fontsizeGlobalbig, 
                                                         {color: '#B80D0D',fontSize:width*0.03}]}>{item.storage}</Text>
                                             </TouchableOpacity>
                                         </View>
                                         <View style={{flex:0.15, justifyContent:'center', alignItems:'center'}}>
                                             <TouchableOpacity
                                                 onPress = {() => this.getExtraDetails(item.car_id, item.lotnumber)}>
                                                     <Text style={[commonStyle.fontsizeGlobalbig, 
                                                         {color:'#44427e', textAlign:'center', fontSize:width*0.03}]}>
                                                             {item.extra}</Text>
                                             </TouchableOpacity>
                                         </View>
                                         <View style={{flex:0.15, justifyContent:'center', alignItems:'center'}}>
                                             <TouchableOpacity
                                                 onPress = {() => /**this.showShipping(item.manageJornal, item.lotnumber)**/
                                                 this.getShippingDetails(item.car_id, item.lotnumber)
                                                 }>
                                                     <Text style={[commonStyle.fontsizeGlobalbig,
                                                          {color:'#343D40', textAlign:'center', fontSize:width*0.03}]}>
                                                             {item.remaining_total}</Text>
                                             </TouchableOpacity>
                                         </View>
                                     </View>
                                 )
                         }):<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                             <Text style={commonStyle.fontsizeGlobal}>{strings('main.no_data')}</Text>
                         </View>:<View></View> 
                     }
                     {(this.state.paidView)?
                      (this.state.dataPaid.length > 0)? this.state.dataPaid.map((item,i) => {
                                 var carImage = item.image;
                                 var mode     = i%2;
                                 return (
                                     <View style={{flexDirection:'row', justifyContent:'center', 
                                         backgroundColor: mode==0?'#EDEDED':'#fff', padding:'2%',elevation:3, borderTopWidth:1,
                                         borderTopColor:'#707070'}} key={item.car_id}>
                                         <View style={{flex:0.173, justifyContent:'center', alignItems:'center'}}>
                                             <TouchableOpacity style={{flex:1, justifyContent:'center', alignItems:'center'}} 
                                                 onPress={() => this.fillImagesarr(item.car_id)}>
                                                 <Image
                                                     resizeMode={"cover"}
                                                     style={commonStyle.image3dbigcover}
                                                     source={{uri: carImage}}
                                                 />
                                             </TouchableOpacity>
                                         </View>
                                         
                                         <View style={{flex:0.2, justifyContent:'flex-start', alignItems:'flex-start'}}>
                                             <Text style={[styles.textbody]} selectable>
                                                 <Text style={{color: '#1760B2'}}>
                                                     Lot#: {item.lotnumber}
                                                 </Text>
                                             </Text>
                                             <Text style={[styles.textbody]}>{item.carMakerName} {item.year}</Text>
                                             <Text style={styles.textbody}>{item.carModelName}</Text>
                                         </View>
 
                                         <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                             <Text style={styles.textbody}>{item.arrival_date}</Text>
                                         </View>
                                         <View style={{flex:0.15, justifyContent:'center', alignItems:'center'}}>
                                             <TouchableOpacity
                                                     onPress = {() => this.getStorageDetails(item.car_id, item.lotnumber)}>
                                                     <Text style={[commonStyle.fontsizeGlobalbig, {color: '#B80D0D',
                                                     fontSize:width*0.03}]}>{item.storage}</Text>
                                             </TouchableOpacity>
                                         </View>
                                         <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                             <Text style={[commonStyle.fontsizeGlobalbig, {color:'#44427e', 
                                             textAlign:'center',fontSize:width*0.03}]}>{item.amount_paid}</Text>
                                         </View>
                                         <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                             <TouchableOpacity
                                                 onPress = {() => this.getShippingDetails(item.car_id, item.lotnumber)}>
                                                     <Text style={[commonStyle.fontsizeGlobalbig, {color:'#343D40', 
                                                     textAlign:'center',fontSize:width*0.03}]}>{item.remaining_total}</Text>
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
                         {balance} {total_cars}
                     </Text>
                 </View>
                 
                 
         </SafeAreaView>
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
       fontSize: width*0.06,//24
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
     content: {
         flex:0.8,
         backgroundColor: 'white',
         padding: 12,
         justifyContent: 'center',
         alignItems: 'center',
         borderTopRightRadius: 17,
         borderTopLeftRadius: 17,
     },
     contentDate: {
         flex:0.3,
         backgroundColor: 'white',
         padding: 12,
         justifyContent: 'center',
         alignItems: 'center',
         borderTopRightRadius: 17,
         borderTopLeftRadius: 17,
     },
     contentExtra: {
         flex:0.8,
         backgroundColor: 'white',
         padding: 12,
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
       textbody: { 
         textAlign: 'left',
         color:'#000',
         fontSize:width*0.02
      },
     head: {  height: 40,  backgroundColor: '#0b4282',  },
     footer: {  height: 40,  backgroundColor: 'transparent',  },
     wrapper: { flexDirection: 'row' },
     title: { flex: 1, },
     text: { textAlign: 'center', color:'#fff', fontSize: width*0.03,  },
     row: {padding:'1%'},
     textbody: { textAlign: 'left', color:'#000',fontSize:width*0.02, margin:'4%'},
     textbody2: { textAlign: 'center', color:'#000',fontSize:width*0.025, padding:4},
 });