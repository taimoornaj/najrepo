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
   Alert,
   Dimensions,
   SafeAreaView,
 } from 'react-native';
 import { strings } from '../locals/i18n';
 import { AuthContext } from '../components/context';
 import  Loader  from '../components/Loader.js';
 import  ModalMsg  from '../components/ModalMsg.js';
 import commonStyle from '../assets/style/styles.js';
 import RNPicker from "search-modal-picker";
 import withTailwindHook from "../components/hooks/WithTailwindHook";
 import I18n from 'react-native-i18n';
 
 const {width, height} = Dimensions.get('window'); 
 
 let ShippingCalculator = class shippingCalculator extends Component {
 
   constructor(props){
       super(props);
       this.state = {
             loader      : false,
             auction    : [],
             country    : [],
             post_page   : 0,
             load_more   : false,
             arrays      : [],
             vehicleTypes: [],
             auction_location : [],
             port_country: [],
             auctionval  : -1,
             modalmsg: false,
             vehicleval: -1,
             vtypeval    : -1,
             portcountryval: -1,
             auctionlocationval: -1,
             auctionname: strings("car.auction"),
             vehiclename: strings("main.vehicle_type"),
             countryname: strings("main.country"),
             portname: strings("car.port"),
             countryval : -1,
             result: '',
             radioBtnsData: [{
                 imagvalid: require("../assets/carvalid.png"),
                 imagnovalid: require("../assets/carnotvalid.png"),
                 id: 1
             },
             {
                 imagvalid: require("../assets/bikevalid.png"),
                 imagnovalid: require("../assets/bikenvalid.png"),
                 id: 2
             },
             {
                 imagvalid: require("../assets/boatvalid.png"),
                 imagnovalid: require("../assets/boatnotvalid.png"),
                 id: 3
             }
             ],
             modalVisible: false,
             select1: 'fsdaf',
             checked: 0
       }
   }
 
 
   componentDidMount() {
     this.getVehicle();
     this.getCountry();
     this.getAuction();
   }

   getCountry = () => {
    this.setState({
      loader          : true
    });
    var Url = "https://api.nejoumaljazeera.co/api/getCountries";
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
        if(response){
          this.setState({
            loader      : false,
            country   : response.data
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

  getVehicle = () => {
    this.setState({
      loader          : true
    });
    var Url = "https://api.nejoumaljazeera.co/api/getVehicleType";
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
        if(response){
          this.setState({
            loader      : false,
            vehicleTypes   : response.data
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

  getAuction = () => {
    this.setState({
      loader          : true
    });
    var Url = "https://api.nejoumaljazeera.co/api/getAuction";
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
        if(response){
          this.setState({
            loader      : false,
            auction   : response.data
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
 
   getAcuationLocation = (itemValue) => {
     this.setState({
       auctionname: this.state.auctionname,
       loader          : true,
     });
     const formData = new FormData();
     formData.append('client_id', '1230');
     formData.append('client_secret', '1230NEJOUM1230');
     formData.append('auction_id', this.state.auctionval);
     var Url  = AuthContext.server_url + "/Nejoum_App/getAcuationLocation";
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
             auction_location    : response.data,
             auctionname: this.state.auctionname,
             auction: this.state.auction
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
         Alert.alert('Error', 'Connection Error', [
           {text: 'Okay'}
         ]);
       });
   }
 
   getPortCountry = () => {
       this.setState({
         loader          : true,
         //countryval      : itemValue
       });
       itemValue = this.state.countryval;
       const formData = new FormData();
       formData.append('client_id', '1230');
       formData.append('client_secret', '1230NEJOUM1230');
       formData.append('port_id', itemValue);
       var Url = AuthContext.server_url + "/Nejoum_App/getPortCountry";
       fetch(Url, {
         method: 'POST',
         credentials: 'same-origin',
         body: formData,
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
             port_country   : response.data,
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
 
   calculateShipping = () => {
     var auction = this.state.auctionval;
     var vehicle_type = this.state.vehicleval;
     var acuationLocation = this.state.auctionlocationval;
     var country = this.state.countryval;
     var port = this.state.portcountryval;
 
     if(auction == -1){
       Alert.alert(strings('main.error'), strings('main.choose_auction'), [
         {text: 'Okay'}
       ]);
       return;
     }
 
     if(vehicle_type == -1 ){
       Alert.alert(strings('main.error'), strings('main.choose_vehicle_type'), [
         {text: 'Okay'}
       ]);
       return;
     }
 
     if(acuationLocation == -1 ){
       Alert.alert(strings('main.error'), strings('main.choose_acuation_location'), [
         {text: 'Okay'}
       ]);
       return;
     }
 
     if(auction == -1 || vehicle_type==-1 || acuationLocation==-1 || country==-1 || port==-1){
       Alert.alert(strings('main.error'), strings('main.fill_all_data'), [
         {text: 'Okay'}
       ]);
       return;
     }
     this.setState({
       //loader          : true,
     });
       var Url = "https://api.nejoumaljazeera.co/api/shippingCalculatornoAuth/?customer_id="+AuthContext.id
       +"&auctionLocation="+acuationLocation+"&vehicle_type="+vehicle_type+"&port="+port;
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
         if(response){
           this.setState({
             loader      : false,
             result      : response.data,
             dirhams     : response.dirhams,
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
       const tailwind =this.props.tailwind;
     if(this.state.loader){
       return(<Loader loader={this.state.loader}></Loader>)
     }
     if(this.state.modalmsg){
       return(<ModalMsg msg={this.state.error_message} modalmsg={this.state.modalmsg} page={this.state.pageload} navigation={this.props.navigation}></ModalMsg>);
     }
 
     if(this.state.auction){
       const dataAuctions = [];
       this.state.auction.map((item,i) => {
         var name = (item.title).toString();
         dataAuctions.push({
           id: item.id,
           name: name
         })
       });
       var auction_pickers =
 
         <RNPicker
           dataSource={dataAuctions}
           dummyDataSource={dataAuctions}
           defaultValue={false}
           pickerTitle={strings("car.auction")}
           showSearchBar={true}
           disablePicker={false}
           changeAnimation={"none"}
           searchBarPlaceHolder={"Search....."}
           showPickerTitle={true}
           searchBarContainerStyle={styles.searchBarContainerStyle}
           pickerStyle={styles.pickerStyle}
           pickerItemTextStyle={styles.listTextViewStyle}
           selectedLabel={this.state.auctionname}
           placeHolderLabel={this.state.auctionname}
           selectLabelTextStyle={styles.selectLabelTextStyle}
           placeHolderTextStyle={styles.placeHolderTextStyle}
           dropDownImageStyle={styles.dropDownImageStyle}
           selectedValue={(index, item) => this.setState(
             {
               auctionval      : item.id,
               auctionname     : item.name,
             },
             this.getAcuationLocation         // here is where you put the callback
           )
           }
         />;
     }else{
       var auction_pickers = <View></View>;
     }
 
     if(this.state.vehicleTypes){
       //console.log('fasdfasd');
 
       const dataVehicle = [];
       this.state.vehicleTypes.map((item,i) => {
         var name = (item.name).toString();
         dataVehicle.push({
           id: item.id_vehicle_type,
           name: name
         })
       });
     var vehicle_pickers =
         <RNPicker
           dataSource={dataVehicle}
           dummyDataSource={dataVehicle}
           defaultValue={false}
           pickerTitle={strings("main.vehicle_type")}
           showSearchBar={true}
           disablePicker={false}
           changeAnimation={"none"}
           searchBarPlaceHolder={"Search....."}
           showPickerTitle={true}
           searchBarContainerStyle={styles.searchBarContainerStyle}
           pickerStyle={styles.pickerStyle}
           pickerItemTextStyle={styles.listTextViewStyle}
           selectedLabel={this.state.vehiclename}
           placeHolderLabel={this.state.vehiclename}
           selectLabelTextStyle={styles.selectLabelTextStyle}
           placeHolderTextStyle={styles.placeHolderTextStyle}
           dropDownImageStyle={styles.dropDownImageStyle}
           selectedValue={(index, item) => this.setState(
             {
               vehicleval      : item.id,
               vehiclename     : item.name,
             }      // here is where you put the callback
           )
           }
         />;
     }else{
       var vehicle_pickers = <View></View>;
     }
 
     if(this.state.country){
       const dataCountry = [];
       this.state.country.map((item,i) => {
         var name = (item.name).toString();
         dataCountry.push({
           id: item.id,
           name: name
         })
       });
       var country_pickers =
           <RNPicker
               dataSource={dataCountry}
               dummyDataSource={dataCountry}
               defaultValue={false}
               pickerTitle={strings("main.country")}
               showSearchBar={true}
               disablePicker={false}
               changeAnimation={"none"}
               searchBarPlaceHolder={"Search....."}
               showPickerTitle={true}
               searchBarContainerStyle={styles.searchBarContainerStyle}
               pickerStyle={styles.pickerStyle}
               pickerItemTextStyle={styles.listTextViewStyle}
               selectedLabel={this.state.countryname}
               placeHolderLabel={this.state.countryname}
               selectLabelTextStyle={styles.selectLabelTextStyle}
               placeHolderTextStyle={styles.placeHolderTextStyle}
               dropDownImageStyle={styles.dropDownImageStyle}
               selectedValue = {(index, item) => this.setState(
               {
                 countryval      : item.id,
                 countryname     : item.name,
               },
               this.getPortCountry         // here is where you put the callback
             )
             }
           />;
     } else {
       var country_pickers = <View></View>;
     }
 
     if(this.state.auction_location){
       const dataAuctionLocation = [];
       this.state.auction_location.map((item,i) => {
         var name = (item.name).toString();
         dataAuctionLocation.push({
           id: item.id,
           name: name
         })
       });
       var auction_location_pickers =
         <RNPicker
           dataSource={dataAuctionLocation}
           dummyDataSource={dataAuctionLocation}
           defaultValue={false}
           pickerTitle={strings("car.auction_location")}
           showSearchBar={true}
           disablePicker={false}
           changeAnimation={"none"}
           searchBarPlaceHolder={"Search....."}
           showPickerTitle={true}
           searchBarContainerStyle={styles.searchBarContainerStyle}
           pickerStyle={styles.pickerStyle}
           pickerItemTextStyle={styles.listTextViewStyle}
           selectedLabel={this.state.auctionlocationname}
           placeHolderLabel={strings("car.auction_location")}
           selectLabelTextStyle={styles.selectLabelTextStyle}
           placeHolderTextStyle={styles.placeHolderTextStyle}
           dropDownImageStyle={styles.dropDownImageStyle}
           selectedValue={(index, item) => this.setState(
             {auctionlocationval :item.id,
               auctionlocationname: item.name,
             },
             //this.calculateShipping
           ) }
         />;
     }else{
       var auction_location_pickers = <View></View>;
     }
 
     if(this.state.port_country){
       const dataPort = [];
       this.state.port_country.map((item,i) => {
         var name = (item.name).toString();
         dataPort.push({
           id: item.id,
           name: name
         })
       });
       var port_country_pickers =
       <RNPicker
           dataSource={dataPort}
           dummyDataSource={dataPort}
           defaultValue={false}
           pickerTitle={strings("car.port")}
           showSearchBar={true}
           disablePicker={false}
           changeAnimation={"none"}
           searchBarPlaceHolder={"Search....."}
           showPickerTitle={true}
           searchBarContainerStyle={styles.searchBarContainerStyle}
           pickerStyle={styles.pickerStyle}
           pickerItemTextStyle={styles.listTextViewStyle}
           selectedLabel={this.state.portname}
           placeHolderLabel={strings("car.port")}
           selectLabelTextStyle={styles.selectLabelTextStyle}
           placeHolderTextStyle={styles.placeHolderTextStyle}
           dropDownImageStyle={styles.dropDownImageStyle}
           selectedValue={(index, item) => this.setState(
             {portcountryval :item.id,
               portname: item.name,
             },
             this.calculateShipping
           ) }
         />;
     }else{
       var port_country_pickers = <View></View>;
     }
 
 
     return (
       <SafeAreaView style = {{ backgroundColor:'#EDEDED', flex:1 }}>
         <View style={{}}>
           <View style={{padding:20}}>
             <View style={{justifyContent:'center', alignItems:'center', flexDirection:'row', marginTop:'4%', marginBottom:'4%'}}>
                 <Text style={{color:'#343D40', textAlign:(I18n.locale == 'en')?'left':'right'}}>
                 {strings('main.shippingCalculatordesc')}</Text>
             </View>
             
             <View  style={{height: height*0.05,marginTop:16, }}>
               <View style={{flex:1, alignItems: "center", justifyContent: 'center' }}>
                 <View style={{flexDirection: "row",flex:1 , width: '90%',
                   alignItems: "flex-start", backgroundColor: '#fff',
                   borderColor: "#000",
                   borderRadius:8,
                   borderWidth: 1,
                 }}>
                   {vehicle_pickers}
                 </View>
               </View>
             </View>
 
             <View  style={{height: height*0.05,marginTop:16 }}>
               <View style={{flex:1, alignItems: "center", justifyContent: 'center' }}>
 
                 <View style={{flexDirection: "row",flex:1 , width: '90%',
                   alignItems: "flex-start", backgroundColor: '#fff',
                   borderColor: "#000",
                   borderRadius:8,
                   borderWidth: 1,
                 }}>
                   {auction_pickers}
                 </View>
               </View>
             </View>
 
             <View  style={{height: height*0.05,marginTop:16 }}>
               <View style={{flex:1, alignItems: "center", justifyContent: 'center' }}>
 
                 <View style={{flexDirection: "row",flex:1 , width: '90%',
                   alignItems: "flex-start", backgroundColor: '#fff',
                   borderColor: "#000",
                   borderRadius:8,
                   borderWidth: 1,
                 }}>
                   {auction_location_pickers}
 
                 </View>
               </View>
             </View>
 
             <View  style={{height: height*0.05,marginTop:16 }}>
               <View style={{flex:1, alignItems: "center", justifyContent: 'center' }}>
                 <View style={{flexDirection: "row",flex:1 , width: '90%',
                   alignItems: "flex-start", backgroundColor: '#fff',
                   borderColor: "#000",
                   borderRadius:8,
                   borderWidth: 1,
                 }}>
                   {country_pickers}
                 </View>
               </View>
             </View> 
 
             <View style={{height: height*0.05,marginTop:16 }}>
               <View style={{flex:1, alignItems: "center", justifyContent: 'center' }}>
                 <View style={{flexDirection: "row",flex:1 , width: '90%',
                   alignItems: "flex-start", backgroundColor: '#fff',
                   borderColor: "#000",
                   borderRadius:8,
                   borderWidth: 1,
                 }}>
                   {port_country_pickers}
                 </View>
               </View>
             </View>
           </View>
 
           {this.state.result !='' &&
               <View style = {{borderRadius: 5, justifyContent:'center', borderWidth:1, borderColor:'#343D40',
               backgroundColor: '#fff'
               ,margin:'9%', padding:'4%'}}>
                   <View style = {{ustifyContent: 'center', alignItems:'flex-start' }}>
                           <Text style = {[commonStyle.normalgreyTextlabelCarSell, {color: '#013188'}]}>
                              {strings("main.shipping_cost_text")}
                           </Text>
                   </View>
                   <View style = {{justifyContent:'space-between', margin: '2%'}}>
                       <Text style = {[commonStyle.normalgreyTextlabelCarSell,{color: 'green',
                           fontWeight:'bold',  alignItems:'flex-start', fontSize: width*0.05}]}>
                           $ {this.state.result}
                       </Text>
                   </View>
                   <View style = {{justifyContent:'space-between'}}>
                       <Text style = {[commonStyle.normalgreyTextlabelCarSell,{color: 'green',
                           fontWeight:'bold',  alignItems:'flex-start', fontSize: width*0.05}]}>
                           AED  {this.state.dirhams}
                       </Text>
                   </View>
               </View>
           }
         </View>
       </SafeAreaView>
 
     )
   }
 };
 export default withTailwindHook(ShippingCalculator);
 
 const styles = StyleSheet.create({
   container: {
     flexGrow: 1
   },
   image: {
     flex: 1,
     resizeMode: "cover",
     justifyContent: "center"
   },
   numbergradient: {
     width: '50%',
     height:height*0.035,
     justifyContent:'center',
     alignItems:'center',
     borderTopLeftRadius: 50,
   },
   normalgreyTextHeader: {
     fontSize: 16,
     color: '#676767',
   },
   btn:{
     backgroundColor: 'transparent',
     flexDirection: 'row'
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
     color: "#7F7F7F",
     textAlign: "left",
     width: "95%",
     padding: 10,
     fontSize: width*0.04,
     flexDirection: "row"
   },
   placeHolderTextStyle: {
     //color: "#D3D3D3",
     color: "#7F7F7F",
     padding: 0,
     fontSize: width*0.035,
     backgroundColor:'transparent',
     textAlign: "left",
     width: "95%",
     flexDirection: "row",
     margin:5
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
     fontSize: width*0.04,
     marginLeft: 20,
     marginHorizontal: 10,
     textAlign: "left",
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
   }
 });
 