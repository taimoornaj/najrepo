/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React , {Component, Profiler} from 'react';
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
   Modal,
   ImageBackground,
   SafeAreaView,
   StatusBar,
   BackHandler,
   TouchableHighlight,LogBox,
   TextComponent, Dimensions, Share, TextInput, Button,
 } from "react-native";
 import i18n, { strings } from '../locals/i18n';
 import { AuthContext } from '../components/context';
 import {FlatListSlider} from 'react-native-flatlist-slider';
 import PreviewCarDetails from '../components/PreviewCarDetails';
 import I18n from 'react-native-i18n';
 import PreviewCarDetails2 from '../components/PreviewCarDetails2';
 import commonStyle from '../assets/style/styles.js';
 import Modal22 from 'react-native-modal';
 //function Dashboard () {
 import withTailwindHook from "../components/hooks/WithTailwindHook";
 import { useTailwind } from "tailwind-rn";
 import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
 import { faEdit, faXmarkCircle, faEye, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
 import ImageViewer from 'react-native-image-zoom-viewer';
 import  Loader  from '../components/Loader.js';
 import FloatingActionButton from '../components/FloatingActionButton.js';

 LogBox.ignoreLogs(['Warning: ...']);
 const {width, height} = Dimensions.get('window');
 
 const RenderRow = ({lable,text}) => {
  const tailwind =useTailwind();
  return <View style={tailwind(`${I18n.locale == 'ar'? "flex-row-reverse":"flex-row"} mt-1    
   justify-start text-start items-start px-4 p-1
   border-b-2 border-lightgrey w-\[80\%\] 
   `)}>
    <Text style={tailwind(`flex-initial text-black font-bold text-md w-2/5    text-right   ${I18n.locale == 'ar'? "text-right":"text-left"} `)}>{lable}</Text>
    <Text style={tailwind('flex-initial text-black  text-md   ')}>{text}</Text>
  </View>
}

const RenderAction = ({lable,data,source}) => {
  const tailwind =useTailwind();
  return <View style={tailwind(`${I18n.locale == 'ar'? "flex-row-reverse":"flex-row"} mt-1    
   justify-start text-start items-start px-4 p-1
   border-b-2 border-lightgrey w-\[80\%\] 
   `)}>
    <Text style={tailwind(`flex-initial text-black font-bold text-md w-2/5    text-right   ${I18n.locale == 'ar'? "text-right":"text-left"} `)}>{lable}</Text>
    <TouchableOpacity onPress={()=> Alert.alert(strings('main.note'), data, [
       {text: strings('main.ok')}
     ])}>
      <Image
        style={{width: 20, height: 20, resizeMode: 'contain'}}
        source={source}
      />
    </TouchableOpacity>

  </View>
}

 let carDetails2 = class carDetails2 extends Component {
 
   constructor(props){
     super(props);
     this.state = {
       loader      : false,
       fulldata    : [],
       post_page   : 0,
       visibleImage: false,
       load_more   : false,
       arrays      : [],
       modalVisible: false,
       isModalVisible: false,
       notemodal: false,
       receiver_name: this.props.route.params.data.receiver_name?this.props.route.params.data.receiver_name:''
     }
   }
 
   componentDidMount() {
     this.getRemarkCars();
     this.fillImagesarr(this.props.route.params.data.id);
 
     BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
     this.render();
   }
 
   componentWillUnmount() {
     BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
   }
 
   handleBackButton = () => {
     this.props.navigation.goBack();
     return true;
   };
 
   shownote = (note) => {
     var notetext = this.props.route.params.data.follow_car_title_note;
     Alert.alert(strings('main.note'), notetext, [
       {text: strings('main.ok')}
     ]);
 
   }

   fillImagesarr = (car_id) => {
    this.setState({loader: true});
    const formData = new FormData();
    formData.append('client_id', '1230');
    formData.append('client_secret', '1230NEJOUM1230');
    formData.append('customer_id', AuthContext.id);
    formData.append('type', this.props.route.params.type);
    formData.append('car_id', car_id);
    var Url  = AuthContext.server_url + "/Nejoum_App/getImages";
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
            var images  = [];
            var img     = '';
            carImages=[];
            response.data.forEach(element => {
                img = element;
                images.push({image: img});
                carImages.push({url: img});
            });
            this.setState({imagesSlider: images, loader:false, imagesSlider22: carImages});
            return;
        }
        else{
            return;
        }
    })
    .catch((error) => {
        this.setState({
            loader      : false,
        });
        Alert.alert(strings('main.network_error'), strings('main.network_error'), [
            {text: strings('main.ok')}
        ]);
    });
}

 
   getRemarkCars = async () => {
     const url ="https://api.nejoumaljazeera.co/api/specialPortCustomerCars?customer_id="+AuthContext.id;
     const requestOptions = {
       method: 'GET',
       headers: {
         'Content-Type': 'application/json',
       }
     };
     const response = await fetch(url, requestOptions);
     const data = await response.json();
     const remarkCars = data.data;
     const carInsideRemarkCars= remarkCars.filter(car => car == this.props.route.params.data.id).length > 0;
 
     this.setState({carInsideRemarkCars});
 
 
 
   }
 
   fillImagesarr22 = (image) => {
    image = image.image;
      index = this.state.imagesSlider22.findIndex(x => x.url ===image);
      this.setState({visibleImage: true, activeIndexImage: index});
  }

   showmodal = (val) => {
     this.setState({isModalVisible:val});
   }
   saveRemark = async (e) => {
     // prevent default behavior of the event
     e.preventDefault();
     //specialPortReceivableInfo
     const url ="https://api.nejoumaljazeera.co/api/specialPortReceivableInfo";
 
 
     const data = {
       "car_id": this.props.route.params.data.id,
       "customer_name": this.state.receiver_name,
     }
     const request = await fetch(url, {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
         'Authorization': 'Bearer ' + AuthContext.token,
       },
       body: JSON.stringify(data)
     })
     const response = await request.json();
 
     if(response.success == false){
       this.setState({receiver_name: this.props.route.params.data.receiver_name});
     }
     this.setState({isModalVisible: false});
   }
 
   render(){
     const tailwind= this.props.tailwind;
     const data = this.props.route.params.data;

     const hasTitle = (data.delivered_title ==1 || data.follow_title ) || false;
     const images = [];
     if(data){
       var details = '';
       var imageModal = '';
       var special_notes = '';
       var add_ones_services = data.add_ones_services;
       var able_service = data.able_service;
       if(this.props.route.params.type != 'all'){
         if(this.props.route.params.allNotes){
           var res = this.props.route.params.allNotes.filter(function(o) {
             return o.id == data.id
           }).pop();
           if(res){
             special_notes = res.note;
           }else {
             special_notes = data.special_notes;
           }
         }else {
           special_notes = data.special_notes;
         }
       }else {
         if(this.props.route.params.allNotes){
           var res = this.props.route.params.allNotes.filter(function(o) {
             return o.id == data.id
           }).pop();
           if(res){
             special_notes = res.note;
           }else {
             special_notes = data.special_notes;
           }
         }else {
           special_notes = data.special_notes;
         }
       }
 
       if(this.props.route.params.type == 'new'){
         var carImage = data.image_small;
         imageModal =  <View>
           <Image
             style={styles.headerImage}
             source={{uri: carImage}}
           />
         </View>;
       } else if(this.props.route.params.type == 'towing'){
         var carImage = data.image_small;
         imageModal = 
           <Image
             style={styles.headerImage}
             source={{uri: carImage}}
           />;
       }else if(this.props.route.params.type == 'warehouse'){
         var ii = 1;
         var carImage = data.image_small;
         if(this.state.imagesSlider){
           if(this.state.imagesSlider.length > 0){
             this.state.imagesSlider.map( ( item )=> {
               ii++;
               images.push(
                 {
                   //image: AuthContext.server_url  + '/upload/car_images/warehouse_car/' + item.photo_name,
                   image: item,
                   id: ii
                 });
             });
             imageModal =
               <FlatListSlider
                 data={this.state.imagesSlider}
                 timer={5000}
                 width={width-40}
                 loop={false}
                 indicator={false}
                 autoscroll={false}
                 component={<PreviewCarDetails2 />}
                 indicatorContainerStyle={{position:'absolute', bottom: height*0.05}}
                 onPress={item => this.fillImagesarr22(item)}
                 indicatorActiveWidth={40}
                 animation
                 contentContainerStyle={{paddingHorizontal: 16,}}
               />;
           }else {
             imageModal =  
               <Image
                 style={styles.headerImage}
                 source={{uri: carImage}}
               />
           }
         }else {
           imageModal =  <View>
             <Image
               style={styles.headerImage}
               source={{uri: carImage}}
             />
           </View>;
         }
 
         }else if(this.props.route.params.type == 'loading'){
         var ii = 1;
         var carImage = data.image_small;
         if(data.images){
           data.images.map( ( item )=> {
             ii++;
             images.push(
               {
                 //image: AuthContext.server_url  + '/upload/car_images/warehouse_car/' + item.photo_name,
                 image: item,
                 id: ii
               });
           });
           imageModal =
             <FlatListSlider
               data={images}
               timer={5000}
               width={width-40}
               loop={false}
               indicator={true}
               autoscroll={false}
               component={<PreviewCarDetails2 />}
               indicatorContainerStyle={{position:'absolute', bottom: height*0.05}}
               onPress={item => this.setState({modalVisible: true})}
               indicatorActiveWidth={40}
               animation
               contentContainerStyle={{paddingHorizontal: 16}}
             />;
         }else {
           imageModal =  <View>
             <Image
               style={styles.headerImage}
               source={{uri: carImage}}
             />
           </View>;
         }
 
 
 
         var title = '';
         var keys = '';
 
         if(data.delivered_title == 1){
           title= I18n.locale == 'ar'?(<View style={{flexDirection: 'row'}}>
             <View style={commonStyle.blogTextLeft}>
               <Image
                 style={commonStyle.titleStyle}
                 source={require('../assets/check.png')}
               />
               <Text style={{color: '#818181'}}>{data.delivered_date}</Text>
             </View>
             <Text style={commonStyle.blogTextRight}>{strings('car.title')}</Text>
           </View>):(<View style={{flexDirection: 'row'}}>
             <Text style={commonStyle.blogTextLeft}>{strings('car.title')}</Text>
             <View style={[commonStyle.blogTextRight,{flexDirection:'row'}]}>
               <Text style={{color: '#818181'}}>{data.delivered_date} </Text>
               <Image
                 style={commonStyle.titleStyle}
                 source={require('../assets/check.png')}
               />
             </View>
           </View>);
         }else{
           if(data.follow_title){
             title=  I18n.locale == 'ar'?(<View style={{flexDirection: 'row'}}>
               <View style={commonStyle.blogTextLeft}>
                 <Image
                   style={commonStyle.titleStyle}
                   source={require('../assets/check.png')}
                 />
                 <Text style={{color: '#818181'}}>{data.titleDate}</Text>
               </View>
               <Text style={commonStyle.blogTextRight}>{strings('car.title')}</Text>
             </View>):(
               <View style={{flexDirection: 'row'}}>
                 <Text style={commonStyle.blogTextLeft}>{strings('car.title')}</Text>
                 <View style={[commonStyle.blogTextRight,{flexDirection:'row'}]}>
                   <Image
                     style={commonStyle.titleStyle}
                     source={require('../assets/check.png')}
                   />
                   <Text style={{color: '#818181'}}>{data.titleDate}</Text>
                 </View>
               </View>
             );
           }else {
             title= I18n.locale == 'ar'?(<View style={{flexDirection: 'row'}}>
               <View style={commonStyle.blogTextLeft}>
                 <Image
                   style={commonStyle.titleStyle}
                   source={require('../assets/x.png')}
                 />
                 <Text style={{color: '#818181'}}>{data.titleDate}</Text>
               </View>
               <Text style={commonStyle.blogTextRight}>{strings('car.title')}</Text>
             </View>):(<View style={{flexDirection: 'row'}}>
               <Text style={commonStyle.blogTextLeft}>{strings('car.title')}</Text>
               <View style={[commonStyle.blogTextRight,{flexDirection:'row'}]}>
                 <Image
                   style={commonStyle.titleStyle}
                   source={require('../assets/x.png')}
                 />
                 <Text style={{color: '#818181'}}>{data.titleDate}</Text>
               </View>
             </View>);
           }
         }

       }else if(this.props.route.params.type == 'shipping'){
         var ii = 1;
         var carImage = data.image_small;
         if(this.state.imagesSlider){
          if(this.state.imagesSlider.length > 0){
            this.state.imagesSlider.map( ( item )=> {
              ii++;
              images.push(
                {
                  //image: AuthContext.server_url  + '/upload/car_images/warehouse_car/' + item.photo_name,
                  image: item,
                  id: ii
                });
            });
            imageModal =
              <FlatListSlider
                data={this.state.imagesSlider}
                timer={5000}
                width={width-40}
                loop={false}
                indicator={false}
                autoscroll={false}
                component={<PreviewCarDetails2 />}
                indicatorContainerStyle={{position:'absolute', bottom: height*0.05}}
                onPress={item => this.fillImagesarr22(item)}
                indicatorActiveWidth={40}
                animation
                contentContainerStyle={{paddingHorizontal: 16,}}
              />;
          }else {
            imageModal =  
              <Image
                style={styles.headerImage}
                source={{uri: carImage}}
              />
          }
        }else {
          imageModal =  <View>
            <Image
              style={styles.headerImage}
              source={{uri: carImage}}
            />
          </View>;
        }

       }else if(this.props.route.params.type == 'store'){
         var ii = 1;
         var carImage = data.image_small;
         if(data.images){
           if(data.images.length > 0){
             data.images.map( ( item )=> {
               ii++;
               images.push(
                 {
                   image: item,
                   id: ii
                 });
             });
             imageModal =
               <FlatListSlider
                  data={images}
                  timer={5000}
                  width={width-40}
                  loop={false}
                  indicator={true}
                  autoscroll={false}
                  component={<PreviewCarDetails2 />}
                  indicatorContainerStyle={{position:'absolute', bottom: height*0.05}}
                  onPress={item => this.setState({modalVisible: true})}
                  indicatorActiveWidth={40}
                  animation
                  contentContainerStyle={{paddingHorizontal: 16}}
               />;
           }else {
             imageModal =  <View>
               <Image
                 style={styles.headerImage}
                 source={{uri: carImage}}
               />
             </View>;
           }
         }else {
           imageModal =  <View>
             <Image
               style={styles.headerImage}
               source={{uri: carImage}}
             />
           </View>;
         }
       }else if(this.props.route.params.type == 'port'){
         var carImage = data.image_small;
         imageModal =  <View>
           <Image
             style={styles.headerImage}
             source={{uri: carImage}}
           />
         </View>;
        
       }else if(this.props.route.params.type == 'cancelled'){
         var carImage = data.image_small;
         imageModal =  <View>
           <Image
             style={styles.headerImage}
             source={{uri: carImage}}
           />
         </View>;
       }else if(this.props.route.params.type == 'all'){
         var carImage = data.image_small;
         imageModal =  <View>
           <Image
             style={styles.headerImage}
             source={{uri: carImage}}
           />
         </View>;
       }
       else {
         var imageModal =  <View>
           <FlatListSlider
             data={images}
             width={275}
             timer={5000}
             indicator={false}
             autoscroll={false}
             component={<PreviewCarDetails />}
             onPress={item => this.setState({modalVisible: true})}
             indicatorActiveWidth={40}
             contentContainerStyle={{paddingHorizontal: 16}}
           />
         </View>;
       }
       var port_string = '';
        if(data.destination == 60){
          port_string = strings('main.depends_shipping')
        }
       return (
         <View style={{flex:1, padding:'2%'}}>
           <Modal
             animationType="fade"
             transparent={true}
             visible={this.state.notemodal} style={styles.modalnotes}
             onRequestClose={() => {this.setState({notemodal: false})}}>
             <View style={styles.centeredView}>
               <ScrollView style={{flexGrow: 1}}>
                 <View style={styles.modalView2}>
                   <Text style={styles.notestyle}>{this.state.notetext}</Text>
                   <TouchableHighlight
                     style={{ ...styles.openButton, backgroundColor: "#5e0404", justifyContent:'center', alignItems:'center' }}
                     onPress={() => {
                       this.setState({notemodal: !this.state.notemodal});
                     }}
                   >
                     <Text style={styles.textStyle}>x</Text>
                   </TouchableHighlight>
                 </View>
               </ScrollView>
             </View>
           </Modal>

           <Modal visible={this.state.visibleImage} transparent={true} style={{backgroundColor: 'white',
                margin: 0, // This is the important style you need to set
                alignItems: undefined,
                justifyContent: undefined, flex:1,}}>
                <ImageViewer
                    imageUrls={this.state.imagesSlider22}
                    enableSwipeDown="true"
                    enablePreload= "true"
                    backgroundColor="#000"
                    index={this.state.activeIndexImage}
                    renderHeader={(index) =>
                        <SafeAreaView>
                                <View  style={{flexDirection:'row', zIndex: 9999}}>
                                    <TouchableOpacity style={{borderRadius:25,justifyContent:'center',
                                    alignItems:'center', width:50, height:50}}
                                    onPress={() => this.setState({visibleImage: false})}>
                                    <FontAwesomeIcon
                                    icon = { faXmarkCircle } size={25} color="#fff" /></TouchableOpacity>
                                </View>
                        </SafeAreaView>
                    }
                    loadingRender = {() => <Loader loader={true}></Loader> }
                />
            </Modal>

           <ScrollView contentContainerStyle = {styles.container}>
           {this.state.loader ?
           <View style={{flex:0.3, justifyContent:'center', alignItems:'center'}}>
            <Image source={require("../assets/loadingapp.gif")}
                style={{justifyContent:'center', width:50, height:50, alignItems:'center', flex:0.2}}
                resizeMode="contain">
            </Image></View>:
            <View style={{flex:0.3}}>
              {imageModal}
            </View>
           }
           
           <View style={{flex:0.7}}>
           <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop:'3%'}}>
             <View style={{flexDirection: 'row', justifyContent: 'flex-start', paddingTop:'3%'}}>
               <Text style={tailwind('text-darkblue text-lg font-bold pr-2 capitalize  ')}>{data.carMakerName}</Text>
               <Text style={tailwind('text-darkblue text-lg font-bold pr-2 capitalize')}>{data.carModelName}</Text>
               <Text style={tailwind('text-darkblue text-lg font-bold pr-2')}>- {data.year}</Text>
             </View>
             <FloatingActionButton width={width} lotnumber={data.lotnumber}  navigation={this.props.navigation} user_id={AuthContext.id}/>
             </View>

              {special_notes &&
                   <View style={{flexDirection: 'row', justifyContent: 'flex-start', paddingBottom:'3%'}}>
                     <Text style={{color: '#0093FF',
                         textDecorationLine:'underline',
                         fontSize: width*0.04,
                         textAlign: 'center',
                         borderRadius: 6,
                         fontWeight:'bold'}}>{special_notes}</Text>
                   </View>
                }
                {!(add_ones_services) && able_service?
                   <View style={{flexDirection: I18n.locale == 'ar'?'row-reverse':'row',
                      alignItems:I18n.locale == 'ar'?'flex-end':'flex-start', justifyContent:'space-between', paddingBottom:'2%', flex:1}}>
                    <TouchableOpacity style={{
                        borderRadius: 10, borderColor:'#707070',
                        borderWidth:2, padding:'3%',
                        justifyContent:I18n.locale == 'ar'?'flex-end':'flex-start',
                        alignItems: I18n.locale == 'ar'?'flex-end':'flex-start', flexDirection:'row'}} 
                        onPress={() => this.props.navigation.navigate("add_ones_services", {
                          'purchasedate': data.purchasedate, 'lotnumber':data.lotnumber, 'carMakerName': data.carMakerName,
                          'carModelName': data.carModelName, 'year': data.year, 'vin': data.vin, 'car_id': data.id
                        })}>
                        <Text style={[tailwind('flex-row-reverse flex-initial text-black text-md')]}> 
                          {strings('car.add_ons_services_list')} 
                        </Text>
                        <FontAwesomeIcon
                          icon={ faPlusCircle }
                          color="#0B4282"
                          size={width*0.035}
                        />
                    </TouchableOpacity>
                   </View>:(add_ones_services == 0 || add_ones_services == 1 || add_ones_services == 2 ||
                   add_ones_services == 3)?
                   <View style={{flexDirection: I18n.locale == 'ar'?'row-reverse':'row',
                          alignItems:I18n.locale == 'ar'?'flex-end':'flex-start', justifyContent:'space-between', paddingBottom:'2%', flex:1}}>
                        <TouchableOpacity style={{
                            borderRadius: 10, borderColor:'#707070',
                            borderWidth:2, padding:'3%',
                            justifyContent:I18n.locale == 'ar'?'flex-end':'flex-start',
                            alignItems: I18n.locale == 'ar'?'flex-end':'flex-start', flexDirection:'row'}} 
                            onPress={() => this.props.navigation.navigate("MyShippingServicesRequest")}>
                            <Text style={[tailwind('flex-row-reverse flex-initial text-black text-md')]}> 
                              {strings('main.show_service_added')}  
                            </Text>
                            <FontAwesomeIcon
                              icon={ faEye }
                              color="#0B4282"
                              size={width*0.035}
                            />
                        </TouchableOpacity>
                    </View>:<View></View>
                }
                {data.lotnumber &&
                <View style={tailwind(`${I18n.locale == 'ar'? "flex-row-reverse":"flex-row"} mt-1    
                        justify-start text-start items-start px-4 p-1
                        border-b-2 border-lightgrey w-\[80\%\] 
                        `)}>
                        <Text style={tailwind(`flex-initial text-black font-bold text-md w-2/5    text-right   
                        ${I18n.locale == 'ar'? "text-right":"text-left"} `)}>{strings('car.lotnumber')}</Text>
                        <Text style={tailwind('flex-initial text-xdDarkblue text-md   ')}>{data.lotnumber}</Text>
               </View>

                }

              {data.vin &&
              <View style={tailwind(`${I18n.locale == 'ar'? "flex-row-reverse":"flex-row"} mt-1    
              justify-start text-start items-start px-4 p-1
              border-b-2 border-lightgrey w-\[80\%\] 
              `)}>
              <Text style={tailwind(`flex-initial text-black font-bold text-md w-2/5    text-right   
              ${I18n.locale == 'ar'? "text-right":"text-left"} `)}>{strings('car.vin')}</Text>
              <Text style={tailwind('flex-initial text-xdDarkblue text-md   ')}>{data.vin}</Text>
     </View>
                }

                {data.color_name &&
                    <RenderRow
                      lable={strings('car.color')}
                      text={data.color_name}
                  />
                }

                {data.aTitle &&
                    <RenderRow
                      lable={strings('car.auction')}
                      text={data.aTitle}
                  />
                }
                {data.auction_location_name &&
                    <RenderRow
                      lable={strings('car.auction_location')}
                      text={(data.short_name?data.short_name+"-"+data.auction_location_name:data.auction_location_name)}
                  />
                }

                {data.port_name &&
                    <RenderRow
                      lable={strings('car.destination')}
                      text={data.port_name}
                  />
                }

                {data.purchasedate &&
                    <RenderRow
                      lable={strings('car.purchase_date')}
                      text={data.purchasedate}
                  />
                }

{data.calculation && data.calculation.carCost$ &&
                    <RenderRow
                      lable={strings('car.total_price')}
                      text={'$ ' +data.calculation.carCost$}
                  />
                }

{data.calculation && data.calculation.storageLate$ &&
                    <RenderRow
                      lable={strings('car.late_fines')}
                      text={'$ ' + data.calculation.storageLate$}
                  />
                }


{data.calculation && data.calculation.storageLate$ &&
                    <RenderRow
                      lable={strings('car.fines_storage')}
                      text={'$ ' + data.calculation.totalStorage$.toString()}
                  />
                }

{data.calculation && data.calculation.total$ &&
                    <RenderRow
                      lable={strings('car.total')}
                      text={'$ ' +data.calculation.total$ + strings('main.noteswarning')}
                  />
                }

                
{data.calculation && data.calculation.cancellationdate &&
                    <RenderRow
                      lable={strings('car.cancellation_date')}
                      text={data.calculation.cancellationdate}
                  />
                }

{data.car_price &&
                    <RenderRow
                      lable={strings('car.sales_price')}
                      text={'$ ' +data.car_price}
                  />
                }

{data.calculation && data.calculation.rule &&
                    <RenderRow
                      lable={strings('car.rule')}
                      text={'$ ' +data.calculation.rule}
                  />
                }

{data.calculation && data.calculation.finecost &&
                    <RenderRow
                      lable={strings('car.fines_storage')}
                      text={'AED ' +data.calculation.finecost}
                  />
                }

{data.paymentDate &&
                    <RenderRow
                      lable={strings('car.payment_date')}
                      text={data.paymentDate}
                  />
                }
                
                {data.car_cost_aed &&
                    <RenderRow
                      lable={strings('car.total_price')}
                      text={'AED ' + data.car_cost_aed.toString()}
                  />
                }
{data.transfer_money &&
                    <RenderRow
                      lable={strings('main.transfer_fee')}
                      text={'AED ' + data.transfer_money.toString()}
                  />
                }
                {(data.total_paida !=0 && data.car_payment_to_cashier == 1) &&
                    <RenderRow
                      lable={strings('car.paid')}
                      text={'AED ' + data.total_paida.toString()}
                  />
                }

{(data.amount_pay && data.car_payment_to_cashier == 3) &&
                    <RenderRow
                      lable={strings('car.paid')}
                      text={'AED ' + data.amount_pay.toString()}
                  />
                }
                {/**data.remaining_amount &&
                    <RenderRow
                      lable={strings('car.remaining_amount')}
                      text={data.remaining_amount}
                  />**/
                }

{data.picked_date &&
                    <RenderRow
                      lable={strings('car.pick_date')}
                      text={data.picked_date}
                  />
                }
                {data.ETD &&
                    <RenderRow
                      lable={strings('car.etatowarehouse')}
                      text={data.ETD}
                  />
                }
{data.port_departuren && <RenderRow
                      lable={strings('main.port_departure')}
                      text={data.port_departuren}
                  />}
                  
{data.delivered_date &&
                    <RenderRow
                      lable={strings('car.arrived_date')}
                      text={data.delivered_date}
                  />
                }




{hasTitle &&
                    <RenderRow
                      lable={strings('car.title')}
                      text={strings('main.yes') + ' ' + ((data.titleDate)?data.titleDate:'')}
                  />
                }

{data.follow_car_title_note &&
                    <RenderAction
                      lable={strings('main.note')}
                      data={data.follow_car_title_note}
                      source={require('../assets/help_active.png')}
                  />

                }

{data.delivered_car_key == '1' &&
                    <RenderRow
                      lable={strings('car.keys')}
                      text={strings('main.yes')}
                  />
                }

{data.loaded_date &&
                    <RenderRow
                      lable={strings('car.date_loaded')}
                      text={data.loaded_date}
                  />
                }
{data.booking_number &&
                    <RenderRow
                      lable={strings('car.booking_id')}
                      text={data.booking_number}
                  />
                }

{data.container_number &&
                    <RenderRow
                      lable={strings('car.container_id')}
                      text={data.container_number}
                  />
                }

{data.ETD &&
                    <RenderRow
                      lable={strings('car.etd')}
                      text={data.ETD}
                  />
                }

{data.shipping_date &&
                    <RenderRow
                      lable={strings('car.shipping_date')}
                      text={data.shipping_date}
                  />
                }

{data.eta &&
                    <RenderRow
                      lable={strings('car.eta')}
                      text={data.eta +" "+port_string}
                  />
                }

{data.booking_arrival_date &&
                    <RenderRow
                      lable={strings('car.date_arrived_port')}
                      text={data.booking_arrival_date}
                  />
                }


                 <View>
                 
                   {this.state.isModalVisible && this.state.carInsideRemarkCars && (
                     <Modal22
                       animationType="slide"
                       transparent isVisible={this.state.isModalVisible}
                       presentationStyle="overFullScreen"
                       onBackdropPress={() => this.showmodal(false)}>
                       <View style={[styles.viewWrapper,{flex:0.2}]}>
                         <View style={styles.modalView}>
                           {(this.state.loaderinside)?(
                             <View style={styles.overlay}>
                               <Image source={require("../assets/loadingapp.gif")}
                                      style={{backgroundColor:'transparent', width:100}}
                                      resizeMode="contain">
                               </Image>
                             </View>
                           ):(
 
                             <View style={styles.modalView}>
                               <TextInput placeholder={strings('main.receiver_name')}
                                          value = {this.state.receiver_name} style={[styles.textInput,{margin:'10%'}]}
                                          multiline = {true}
                                          numberOfLines = {height*0.005}
                                          onChangeText = {(value) => this.setState({receiver_name: value})} />
 
                               {/*                                      <TextInput placeholder={strings('main.receiver_phone')}
                                                  value={this.state.receiver_phone} style={styles.textInput}
                                                  multiline = {true}
                                                  numberOfLines = {height*0.005}
                                                  onChangeText={(value) => this.setState({receiver_phone: value})} />*/}
 
 
                               <Button title={strings('main.save')} onPress={(value) => {
                                 this.saveRemark(value);
                               }} />
 
                             </View>
                           )
                           }
                         </View>
                       </View>
                     </Modal22>
                   )
                   }
 
                 
                  {this.state.carInsideRemarkCars &&
                     (
                       <View style={tailwind(`${I18n.locale == 'ar'? "flex-row-reverse":"flex-row"} mt-1    
                       justify-start text-start items-start px-4 p-1
                       border-b-2 border-lightgrey w-\[80\%\] 
                       `)}>
                         <Text style={tailwind(`flex-initial text-black font-bold text-md w-2/5    text-right   ${I18n.locale == 'ar'? "text-right":"text-left"} `)}>
                          {strings('main.receiver_name')}</Text>
                         {
                           data.receiver_name ?
                             <TouchableOpacity style={{justifyContent: 'space-between'}} activeOpacity={1} onPress={this.showmodal}>
                               <Text  style={tailwind('flex-initial text-black  text-md   ')}> {this.state.receiver_name} <FontAwesomeIcon
                                        icon={ faEdit }
                                        color="#0b4282"
                                        size={width*0.035}
                                    />
                               </Text>
                             </TouchableOpacity>
                             :
                             <TouchableOpacity style={{justifyContent: 'space-between'}} activeOpacity={1} onPress={this.showmodal}>
                               <Text  style={tailwind('flex-initial text-black  text-md   ')}> {this.state.receiver_name} 
                                    <FontAwesomeIcon
                                        icon={ faEdit }
                                        color="#0b4282"
                                        size={width*0.035}
                                    />
                               </Text>
                             </TouchableOpacity>
                         }
                       </View>
                     )
                   }
                 </View>
         </View>
             </ScrollView>
           </View>
       )

     }else {
       return(
         <Text>error</Text>
       );
     }
 
   }
 };
 export default withTailwindHook(carDetails2)
 

 
 
 const styles = StyleSheet.create({
   container: {
     flexGrow: 1,
   },
   textTotal: {
     //color: '#6a6969',
     color: 'green',
     fontSize: 17,
     lineHeight: 24,
     padding: 4,
     justifyContent: 'center',
     alignItems: 'center',
     flex: 1
   },
   headerImage: {
     width: '100%',
     height: '100%',
     borderRadius:10,
     height:height*0.3,
     resizeMode: "cover",
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
     resizeMode: "contain",
     justifyContent: "center",
     width: 15,
     height: 15
   },
   iconstyle2: {
     resizeMode: "cover",
     justifyContent: "center",
     width: 30,
     height: 30
   },
 
   centeredView: {
     flex: 1,
     justifyContent: "center",
     alignItems: "center",
   },
   modalView: {
     backgroundColor: "white",
     alignItems: "center",
     shadowColor: "#000",
     shadowOffset: {
       width: 0,
       height: 2
     },
     shadowOpacity: 0.25,
     shadowRadius: 3.84,
     elevation: 5
   },
   modalView2: {
     width:'100%',
     height: '100%',
     padding:20,
     borderRadius: 25,
     backgroundColor: "white",
     alignItems: "center",
     shadowColor: "#000",
     shadowOffset: {
       width: 0,
       height: 2
     },
     shadowOpacity: 0.25,
     shadowRadius: 3.84,
     elevation: 5
   },
   openButton: {
     borderRadius: 20,
     padding: 10,
     elevation: 2,
     position: 'absolute',
     left: 0,
     right: 0,
     top: 0,
     width: '20%',
   },
   textStyle: {
     justifyContent: 'center',
     backgroundColor: "transparent",
     alignItems: "center",
     color: 'white'
   },
   modalnotes: {
     flex: 0.3,
     backgroundColor:'red',
     borderBottomLeftRadius: 20,
     borderRadius: 25,
   },
   notestyle: {
     fontSize: 15,
     padding: 20
   },
   blogTextRightButton: {
     color: '#818181',
     fontSize: 12,
     lineHeight: 24,
     padding: 4,
     width:'20%',
     flex:1,
     borderRadius:25,
     backgroundColor: '#0a407c',
     justifyContent: 'center',
     alignItems: 'center',
   }
   , viewWrapper: {
     flex: 1,
     alignItems: "center",
     justifyContent: "center",
   },
   textInput: {
     width: "80%",
     borderRadius: 5,
     paddingVertical: 8,
     paddingHorizontal: 16,
     borderColor: "rgba(0, 0, 0, 0.2)",
     borderWidth: 1,
     marginBottom: 8,
   },
 });
 