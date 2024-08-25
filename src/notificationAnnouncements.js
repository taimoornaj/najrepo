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
  StatusBar,
  Animated,
  TextInput
} from 'react-native';
import { Badge } from 'react-native-elements';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import  Loader  from '../components/Loader.js';
import I18n from 'react-native-i18n';
import commonStyle from '../assets/style/styles.js';
import Modal from 'react-native-modal';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faServer, faVolume, faXmarkCircle, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import ImageViewer from 'react-native-image-zoom-viewer';
import { RecyclerListView,   DataProvider, LayoutProvider, ContextProvider  } from 'recyclerlistview';								 
import FastImage from 'react-native-fast-image';
import WithTailwindHook from "../components/hooks/WithTailwindHook";
import AwesomeAlert from 'react-native-awesome-alerts';
import VideoPlayer from '../components/molecules/VideoPlayer';

const {width, height} = Dimensions.get('window');
const SCREEN_WIDTH = Dimensions.get('window').width;

let NotificationAnnouncements = class notificationAnnouncements extends Component {

  constructor(props){
    super(props);
    this.state = {
      post_page   : 0,
      load_more   : false,
      loader      : false,
      loaderCars: false,
      loaderTowing: false,
      previous_balance : 0,
      Previous_balanceA: '',
      carsView: false,
      announementView: true,
      towingView: false,
      visibleImage: false,
      visibleVideo: false,
      imagesSlider: [],
      carsData: [],
      fulldata: [],
      data:[],
      towingCases: [],
      selectedTab: 2,
      showAlert: false,
      idGlbal: '',
      carGlobal: '',
      valueGlobal: '',
      showAlertInput: false,
      inputText: '',
      isModalVisible: false,
      content: '',
      video: '',
    }
  }

  async componentDidMount() {
    this.getAnnouncements();
    this.getTowingCases();
    this.getData();
  }

  getData = () => {
    this.setState({
      loaderCars: true,
    });
    const formData = new FormData();
    formData.append('client_id', '1230');
    formData.append('client_secret', '1230NEJOUM1230');
    formData.append('customer_id', AuthContext.id);
    formData.append('start', 0);
    formData.append('length', 10);
    var Url  = AuthContext.server_url + "/Nejoum_App/getNotification";
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
          const fakeData = [];
          if(response.data.length > 0){
            response.data.forEach(item => {
              if(fakeData.length == 0){
                fakeData.push({
                  index           : item.notification_id,
                  carImage        : item.image_small,
                  notification_id : item.notification_id,
                  carModelName    : (item.carModelName.substr(0,item.carModelName.indexOf(' ')) != '')?
                    item.carModelName.substr(0,item.carModelName.indexOf(' ')):item.carModelName,
                  carMakerName    : item.carMakerName,
                  year            : item.year,
                  notification_text: item.notification_text,
                  created_date    : item.created_date,
                  type_info       :item.type_info,
                  car_level       : item.car_level
                });
              }else if (fakeData.indexOf({ id: item.id}) ==-1){
                fakeData.push({
                  index           : item.notification_id,
                  carImage        : item.image_small,
                  notification_id : item.notification_id,
                  carModelName    : (item.carModelName.substr(0,item.carModelName.indexOf(' ')) != '')?
                    item.carModelName.substr(0,item.carModelName.indexOf(' ')):item.carModelName,
                  carMakerName    : item.carMakerName,
                  year            : item.year,
                  notification_text: item.notification_text,
                  created_date    : item.created_date,
                  type_info       :item.type_info,
                  car_level       : item.car_level
                });
              }
            });
            this.setState ({
                listCars: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(fakeData),
              },this.setLayoutCars()
            );
          }
          this.setState({
            loaderCars      : false,
            carsData    : fakeData,
            post_pageCars   : fakeData.length,
            total_postsCars : fakeData.length
          });
          return;
        }
        else {
          this.setState({
            loaderCars: false,
          });
          return;
        }
      })
      .catch((error) => {
        this.setState({
          loaderCars: false,
        });
        Alert.alert('Error', error, [
          {text: 'Okay'}
        ]);
      });
  }

  setModalVisible = () => {
    this.setState({
      visible: false,
    });
  }

  activeAnnouncements = () => {
    this.setState({
      selectedTab: 2,
      announementView: true,
      carsView: false,
      towingView: false,
    });
  }

  activeTowing = () => {
    this.setState({
      selectedTab: 3,
      towingView: true,
      carsView: false,
      announementView: false,
    });
  }

  activeCars = () => {
    this.setState({
      selectedTab: 1,
      announementView: false,
      carsView: true,
      towingView: false,
    });
  }

  YourImage = (url) => (
    <FastImage
      style={styles.tinyLogo}
      source={{
        uri:  require('../assets/commercial.png'),
        priority: FastImage.priority.normal,
      }}
      resizeMode={FastImage.resizeMode.contain}
    />
  )

  onEndReached = () => {
    this.setState({load_more:true});
    var start     = this.state.post_page +1;
    var Url       = AuthContext.server_url+"/Nejoum_App/allCars2";
    const formData = new FormData();
    formData.append('client_id', '1230');
    formData.append('customer_id', AuthContext.id);
    formData.append('client_secret', '1230NEJOUM1230');
    formData.append('year', this.state.yearval);
    formData.append('maker', this.state.makerval);
    formData.append('model', this.state.modelval);
    formData.append('from_date', this.state.from_date);
    formData.append('to_date', this.state.to_date);
    formData.append('type', this.state.type);
    formData.append('search_val', this.state.search);
    formData.append('start', start);
    formData.append('length', 7);
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
          const fakeData2 = [];
          var old_data    = this.state.fulldata;
          var start       = start;
          var count       = response.data.length;
          var fakeDatad   = this.state.list['_data'];

          response.data.forEach(instance => {
            if (fakeDatad.indexOf({ id: instance.car_id}) ==-1) {
              fakeDatad.push({
                id                     : instance.car_id,
                image_small            : instance.image_small,
                vin                    : instance.vin,
                lotnumber              : instance.lotnumber,
                carMakerName           : instance.carMakerName,
                year                   : instance.year,
                carModelName           : instance.carModelName,
                follow_car_title_note  : instance.follow_car_title_note,
                follow_title           : instance.follow_title,
                aTitle                 : instance.aTitle,
                special_notes          : instance.special_notes,
                purchasedate           : instance.purchasedate,
                delivered_car_key      : instance.delivered_car_key,
                delivered_title        : instance.delivered_title,
                color_name             : instance.color_name,
                auction_location_name  : instance.auction_location_name,
                port_name              : instance.port_name,
                paymentDate            : instance.paymentDate,
                picked_date            : instance.picked_date,
                delivered_date         : instance.delivered_date,
                loaded_date            : instance.loaded_date,
                booking_number         : instance.booking_number,
                container_number       : instance.container_number,
                etd                    : instance.etd,
                shipping_date          : instance.shipping_date,
                eta                    : instance.eta,
              });
            }
          });
          this.setState ({
              load_more       : false,
              post_page       : fakeDatad.length,
              total_posts     : fakeDatad.length,
              fulldata        : old_data,
              list            : new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(fakeDatad),
            },
          );
        }
      })
      .catch((error) => {
        console.warn(error.message);
      });
  }

  onEndReachedCars = () => {
    this.setState({load_more:true});
    var start     = this.state.post_pageCars +1;
    const formData = new FormData();
    formData.append('client_id', '1230');
    formData.append('client_secret', '1230NEJOUM1230');
    formData.append('customer_id', AuthContext.id);
    formData.append('start', start);
    formData.append('length', 7);
    var Url  = AuthContext.server_url + "/Nejoum_App/getNotification";

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
          const fakeData2 = [];
          var old_data    = this.state.carsData;
          var start       = start;
          var count       = response.data.length;
          var fakeDatad   = this.state.listCars['_data'];

          response.data.forEach(item => {
            if (fakeDatad.indexOf({ id: item.car_id}) ==-1) {
              fakeDatad.push({
                index           : item.notification_id,
                carImage        : item.image_small,
                notification_id : item.notification_id,
                carModelName    : (item.carModelName.substr(0,item.carModelName.indexOf(' ')) != '')?
                  item.carModelName.substr(0,item.carModelName.indexOf(' ')):item.carModelName,
                carMakerName    : item.carMakerName,
                year            : item.year,
                notification_text: item.notification_text,
                created_date    : item.created_date,
                type_info       :item.type_info,
                car_level       : item.car_level
              });
            }
          });
          this.setState ({
              load_more           : false,
              post_pageCars       : fakeDatad.length,
              total_postsCars     : fakeDatad.length,
              carsData            : old_data,
              listCars            : new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(fakeDatad),
            },
          );
        }
      })
      .catch((error) => {
        console.warn(error.message);
      });
  }

  fillImagesarr = (carImage) => {
    var images = [];
    var img = '';
    images.push({url: carImage});
    this.setState({visibleImage: true, imagesSlider: images});
  }

  setLayoutCars = () => {
    this.layoutProvider = new LayoutProvider((i) => {
      return this.state.listCars.getDataForIndex(i);
    }, (dim) => {
      dim.width  = width;
      dim.height = 100;
    })
  }

  getAnnouncements = (props) => {
    this.setState({
      loader: true,
    });
    const formData = new FormData();
    formData.append('client_id', '1230');
    formData.append('client_secret', '1230NEJOUM1230');
    formData.append('customer_id', AuthContext.id);
    var Url  = AuthContext.server_url + "/Nejoum_App/getAnnouncement";
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
          const fakeData = [];
          if(response.data.length > 0){
            response.data.forEach(instance => {
              if(fakeData.length == 0){
                fakeData.push({
                  id                     : instance.id,
                  deleted                : instance.deleted,
                  notification_textann      : instance.notification_text,
                  notification_text_ar   : instance.notification_text_ar,
                  opened                 : instance.opened,
                  subject                : instance.subject,
                  subject_ar             : instance.subject_ar,
                  created_date           : instance.created_date,
                  type                   : instance.announcement_type,
                  filePath               : instance.file_path,
                });
              }else if (fakeData.indexOf({ id: instance.id}) ==-1){
                fakeData.push({
                  id                     : instance.id,
                  deleted                : instance.deleted,
                  notification_text      : instance.notification_text,
                  notification_textann   : instance.notification_text_ar,
                  opened                 : instance.opened,
                  subject                : instance.subject,
                  subject_ar             : instance.subject_ar,
                  created_date           : instance.created_date,
                  type                   : instance.announcement_type,
                  filePath               : instance.file_path,
                });
              }
            });
            /**this.setState ({
                  list: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(fakeData),
                },this.setLayout()
             );**/
          }
          this.setState({
            loader      : false,
            fulldata    : fakeData,
            post_page   : fakeData.length,
            total_posts : fakeData.length
          });
          return;
        }
        else {
          this.setState({
            loader: false,
          });
          return;
        }
      })
      .catch((error) => {
        this.setState({
          loader: false,
        });
        Alert.alert('Error', error, [
          {text: 'Okay'}
        ]);
      });
  }

  getTowingCases = () => {
    this.setState({
      loaderTowing          : true,
    });
    var Url  = "https://api.nejoumaljazeera.co/api/towingCases?customer_id="+AuthContext.id;
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
        if(response.data.length > 0){
            this.setState({
              loaderTowing      : false,
              data   : response.data,
              total   : response.totalRecords
            });
        }else {
            this.setState({
              loaderTowing      : false
            });
        }
        return;
    })
    .catch((error) => {
        this.setState({
          loaderTowing      : false,
          error_message    : error  
        });
        Alert.alert('Error', 'Connection Error', [
            {text: 'Okay'}
        ]);
    });  
}

  carsrRowRenderer = (data) => {
    // todo make height dynamic
    const tailwind=this.props.tailwind;
    const {index, carImage, notification_id, carModelName, carMakerName, year, notification_text, created_date
      ,type_info, car_level} = data;
    const {lotnumber} = type_info&&type_info[0] || false;
    var textcolor = '#0d5db8';
    var borderColor = '#000';
    if(car_level == 'store'){
      borderColor = '#0d5db8';
      textcolor = '#000';
    }else if (car_level == 'towing'){
      borderColor = '#E51178';
      textcolor = '#000';
    }else if (car_level == 'loading'){
      borderColor = '#11E57F';
      textcolor = '#000';
    }else if (car_level == 'shipping'){
      borderColor = '#E51511';
      textcolor = '#000';
    }else if (car_level == 'new'){
      borderColor = '#E1E511';
      textcolor = '#000';
    }
    return (
        <TouchableOpacity activeOpacity={1} style = {[
          styles.rowFront, {
            borderWidth:2,height: height*0.15,  
            borderColor:'#EDEDED', margin:'1%'}
        ]}onPress = {() => this.props.navigation.navigate('carDetails2', {'data': type_info[0], 'type': car_level})}
        >
          <View style={{ padding:'2%', flexDirection: "row", flex: 1, backgroundColor:'#fff', }}>
            <View style={{flex:0.3, flexDirection: 'row', borderRadius: 10}}>
              <Image
                resizeMode={'cover'}
                style={styles.tinyLogo}
                source={{uri: carImage}}
              />
            </View>
            <View style={{flex: 0.7, padding: '1%'}}>
              <View style={{ flexDirection: 'row', justifyContent:'flex-start'}}>
                <Text  style={tailwind('font-bold px-2 text-black text-md')}>
                  {year} {carMakerName} {carModelName}
                </Text>
              </View>
              <View
                style={{ flexDirection: 'column', justifyContent:'flex-start', alignItems:'flex-start'}}>
                {lotnumber  &&
                <View style={{ flexDirection: 'row', justifyContent:'flex-start'}}>
                  <Text  style={tailwind('font-bold pl-2 text-black text-xxs text-md')}>
                    Lot #
                  </Text>
                  <Text  style={tailwind('font-bold  text-darkblue text-xxs text-md')}>
                     {lotnumber}
                  </Text>
                </View>}
                <Text style={tailwind('pl-2 pr-4 text-black  text-xxs text-left ')}>
                  {notification_text}
                </Text>
                <Text style={tailwind('pl-2 pr-4 text-black  text-xxxs text-left ')}>
                  {created_date}
                </Text>
              </View>


            </View>
          </View>
        </TouchableOpacity>
    );
  };

  rowRenderer = (data) => {
    // todo check notification contnet and render accordinglyx
    const tailwind =this.props.tailwind;
    let ImageAnn = AuthContext.server_url + this.state.fulldata[data.index].filePath;
    let type = this.state.fulldata[data.index].type;
    return (
      <Animated.View
        style = {[
          styles.rowFront,
          { height: height*0.12 },
        ]}>
        <TouchableOpacity activeOpacity={1} onPress ={()=>
        {
          if(type == 1){
            var sub = I18n.locale == 'en'?this.state.fulldata[data.index].subject:this.state.fulldata[data.index].subject_ar;
            var not = I18n.locale == 'en'?this.state.fulldata[data.index].notification_textann:this.state.fulldata[data.index].notification_text_ar;
            // check if the sub string contain the word 'announcement'
            if(sub&&sub.toLowerCase().indexOf('price list') > -1) {
              if (AuthContext.AdminAccess){
                // navigate to the priceLists screen
                this.props.navigation.navigate('filesNav', {'data': this.state.fulldata[data.index]});
              }
              else{
                // navigate to the activateAdminAccess screen
                this.props.navigation.navigate('activateAdminAccess', {'data': this.state.fulldata[data.index]});
              }
            }
            else{
              // default fallback
              Alert.alert(sub, not, [
                {text: strings('main.ok')}
              ]);
            }

          }
          else if(type == 2) {
            this.setState({
              img: [{url: ImageAnn}],
              visibleImage:true
            });
          }else if (type == 3 ) {
            this.props.navigation.navigate('priceFilesViewer', {'url':AuthContext.server_url + this.state.fulldata[data.index].filePath,
              'name': strings('main.announcments')});
          }else if (type == 4) {
            this.setState({
              video: 'https://cdn.nejoumaljazeera.co'+this.state.fulldata[data.index].filePath,
              visibleVideo: true
            });
          }
        }
        }
            style = {[
                styles.rowFront,
            ]}>
          <View style={{flexDirection: "row", flex: 1, marginTop:'2%', padding:'2%',  backgroundColor:'#fff', borderWidth:1, borderColor:'#707070'}}>
            <View style={{flex:0.1, flexDirection: 'row',justifyContent:'center',alignContent:'center',alignItems:'center'}}>
              <Image
                resizeMode={'contain'}
                style={styles.image}
                source={require('../assets/images/announcments-icon.png')}
              />
            </View>
            <View style={{flex: 0.9, justifyContent:'center', alignItem:'flex-start'}}>
              <View style={{ padding: '2%', flexDirection: 'row', justifyContent:
              I18n.locale== 'ar'? 'flex-end': 'flex-start'}}>
                <Text style={{color:'#343D40', fontWeight:'400', textAlign: I18n.locale== 'ar'? 'right': 'left'}}>
                  {(I18n.locale == 'en')?this.state.fulldata[data.index].subject:
                    this.state.fulldata[data.index].subject_ar}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  readTowingNotif = () => {
    const car_id = this.state.carGlobal;
    const id = this.state.idGlbal;
    const value = this.state.valueGlobal;
    const inputText = this.state.inputText;

    if(car_id == '' || id == '' || value == ''){
      return;
    }

    if(inputText == ''){
      Alert.alert('Error', strings('main.add_reason'), [
        {text: 'Okay'}
      ]);
      return;
    }
    this.setState({
      loaderTowing      : true
    });
    const formData = new FormData();
    formData.append('client_id', '1230');
    formData.append('client_secret', '1230NEJOUM1230');
    formData.append('car_id', car_id);
    formData.append('response', value);
    formData.append('reject_message', inputText);
    formData.append('id', id);
    var Url  = AuthContext.server_url + "Nejoum_App/seenTowingNotif";
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
        if (response.success == 'success') {
          this.setState({
            loaderTowing  : false,
            showAlert     : false,
            showAlertInput: false
          });
          this.getTowingCases();
        }
        else {
          this.setState({
            loaderTowing  : false,
            showAlert     : false,
            showAlertInput: false
          });
        }
    })
    .catch((error) => {
    });
}

  towingRowRenderer = (data) => {
    data = data.item;
    const maxCharLimit = 70;
    var content = I18n.locale == 'ar' ? data.message_ar : data.message;
    const shouldShowReadMoreButton = content.length > maxCharLimit;
    const tailwind =this.props.tailwind;
    let ImageAnn = data.photo;
    var extension = (data.attachment)?data.attachment.split('.').pop():'';
    extension = (extension)?extension.split('?')[0]:'';
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg'];
    var ext = '';
    if (imageExtensions.includes(extension)) {
      ext = 'image';
    } else {
      ext = 'file';
    }
    if(data.attachment){
      console.error((data.attachment)?data.attachment.replace(/\.\/+/g, '/').replace(/(http[s]?:\/\/)|(\/{2,})/g, (match, p1) => p1 ? match : '/'):'');
    }
    return (
      <Animated.View
        style = {[
          styles.rowFront,
          { height: height*0.2 },
        ]}>
         <View style={{ padding:'2%', flexDirection: "row", flex: 1, backgroundColor:'#fff', margin:'2%'}}>
            <View style={{flex:0.2, flexDirection: 'column', borderRadius: 10, justifyContent:'space-between', alignItems:'center'}}>
              <Image
                resizeMode={'contain'}
                style={styles.tinyLogo}
                source={{uri: ImageAnn}}
              />
              {
                (data.attachment != null)?
                <TouchableOpacity
                  onPress={() =>
                    {
                      if(ext == 'image') {
                        this.setState({
                          img: [{url: data.attachment.replace(/\.\/+/g, '/').replace(/(http[s]?:\/\/)|(\/{2,})/g, (match, p1) => p1 ? match : '/')}],
                          visibleImage:true
                        });
                      }else if (ext == 'file' ) {
                        this.props.navigation.navigate('priceFilesViewer', {'url': data.attachment,
                          'name':  I18n.locale == 'ar' ? data.subject_ar : data.subject});
                      }
                    } }>
                  <FontAwesomeIcon
                      icon  = { faPaperclip }
                      color = "#0d5db8"
                      size  = {25}
                  />
                </TouchableOpacity>:<View></View>
              } 
            </View>

           <View style={{flex: data.response==0?0.8:0.6, padding: '1%'}}>
              <View style={{ flexDirection: 'row', justifyContent:'flex-start'}}>
                  <Text style={[tailwind('font-bold px-2 text-blue text-md'), {fontSize:width*0.03}]}>
                   {I18n.locale == 'ar' ? data.subject_ar : data.subject}
                  </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent:'flex-start'}}>
                <Text style={[tailwind('   text-black  px-2 font-bold text-xs '), {fontSize:width*0.03}]}>
                    {data.year} {data.carMakerName} {data.carModelName} 
                  </Text>
              </View>
                
                <View style={tailwind('flex-row px-2 text-start items-start')}>
                    <Text style={[tailwind('   text-black text-xxs '), {fontSize:width*0.03}]}>Lot # </Text>
                    <Text style={[tailwind('  text-xdLightBlueDarker text-xxs  '), {fontSize:width*0.03}]}>
                      {data.lotnumber}
                    </Text>
                </View>

              {data.vin?
                  <View style={tailwind('flex-row px-2 text-start items-start')}>
                    <Text style={[tailwind('   text-black text-xxs  '), {fontSize:width*0.03}]}>{strings('car.vin')} </Text>
                    <Text style={[tailwind('  text-xdLightBlueDarker text-xxs  '), {fontSize:width*0.03}]}>
                      {data.vin}
                    </Text>
                  </View>
                :
                <View />
              }

              <View
                style={{ flexDirection: 'column', justifyContent:'flex-start', alignItems:'flex-start'}}>
                  <TouchableOpacity 
                  onPress = {async () => {
                    await this.setState ({
                      content: content
                    },this.setState ({isModalVisible: true})
                  )
                  }}>
                     {shouldShowReadMoreButton?
                     <View >
                    <Text style={tailwind('pl-2 pr-4 text-black  text-xxs text-left ')}>
                      {content.substring(0, maxCharLimit)}
                        <Text style={[tailwind('pl-2 pr-4 text-xdDarkblue  text-xxs text-left '), ]}>
                        {'....more'}
                      </Text>
                    </Text>
                     </View>
                    
                    :
                    <Text style={tailwind('pl-2 pr-4 text-black  text-xxs text-left ')}>
                 {content}
           </Text>}
                </TouchableOpacity>
                <Text style={tailwind('pl-2 pr-4 text-black  text-xxxs text-left ')}>
                  {data.created_date}
                </Text>
              </View>
            </View>
            
            {
              data.response == 2 && data.ableToresponse == 0?
              <View style={{flex:0.3, flexDirection: 'row', borderRadius: 10, justifyContent:'center', alignItems:'center', margin:'2%'}}>
              <View style={{flexDirection:'row', justifyContent:'space-between', flex:1,}}>
                <TouchableOpacity activeOpacity={1} style={{
                    flexDirection: "row",
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: '#0B9A21',
                    borderRadius: 5,
                    borderWidth: 2,
                    height:'50%',padding:'4%',
                    width: '50%', backgroundColor: '#0B9A21', marginLeft:'3%', marginRight:'5%'}}
                    onPress = {async () => {
                      await this.setState ({
                        idGlbal: data.id,
                        carGlobal: data.car_id,
                        valueGlobal: 1
                      },this.setState ({showAlert: true})
                    )
                    }}>
                    <Text style={[commonStyle.buttonText, { color: '#fff',fontSize:8, padding: '1%'}]}>
                        {strings('main.approve')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={{
                    flexDirection: "row",
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: '#A30000',
                    borderRadius: 5,
                    height:'50%',
                    borderWidth: 2,padding:'4%',
                    width: '50%', backgroundColor: '#A30000', marginLeft:'3%', marginRight:'5%'}}
                    onPress = { async () => {
                      await this.setState ({
                        idGlbal: data.id,
                        carGlobal: data.car_id,
                        valueGlobal: 3
                      }, this.setState ({showAlertInput: true})
                    )
                    }}>
                    <Text style = {[commonStyle.buttonText, { color: '#fff', fontSize:8, padding: '1%' }]}>
                        {strings('main.reject')}
                    </Text>
                  </TouchableOpacity></View></View>:(data.ableToresponse != '0' && data.response == 2)?
                <View style={{flex:0.3, flexDirection: 'row', borderRadius: 10, justifyContent:'center', alignItems:'center', margin:'2%'
          }}>
                <View style={{flexDirection:'row', justifyContent:'space-between', flex:1,}}>
                    <Text style = {[commonStyle.buttonText, { color: '#A30000', fontSize:8, padding: '1%' }]}>
                      {strings('main.car_already_towed')}
                    </Text></View>
                    </View>
            :(data.response == 3)?
            <View style={{flex:0.3, flexDirection: 'row', borderRadius: 10, justifyContent:'center', alignItems:'center',
          }}>
            <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
            <View style={{
              flexDirection: "row",
              backgroundColor: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: '#A30000',
              borderRadius: 5,
              height:'20%',
              borderWidth: 2,
              width: '50%', backgroundColor: '#A30000',
            }}>
              <Text style = {[ { color: '#fff', fontSize:8, padding: '1%' }]}>
                  {strings('main.rejected')}
              </Text>
              </View>
              <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style = {[ { flex:1,color: '#A30000', fontSize:8, padding: '1%', justifyContent:'center', alignItems:'center' }]}>
                    {data.reject_message}
                </Text>
              </View></View></View>:data.response == '1'?
                <View style={{flex:0.3, flexDirection: 'row', borderRadius: 10, justifyContent:'center', alignItems:'center', margin:'2%'
              }}>
              <View style={{
                flexDirection: "row",
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: '#0B9A21',
                borderRadius: 5,
                borderWidth: 2,
                height:'20%',
                width: '50%', backgroundColor: '#0B9A21', marginLeft:'3%', marginRight:'5%'}}><Text style = {[{ color: '#fff', fontSize:8, padding: '1%' }]}>
                  {strings('main.request_approved')}
              </Text></View></View>:
                <View></View>
            }
          </View>
      </Animated.View>
    )
  }

  renderFooter = () => {
    return this.state.load_more
      ? <View style={{backgroundColor:'transparent', flex:1, justifyContent:'center', alignItems:'center'}}>
        <Image source={require("../assets/loadingapp.gif")}
               style={{justifyContent:'center', width:50, height:50, alignItems:'center', flex:0.2}}
               resizeMode="contain">
        </Image>
      </View>
      : <View style={{ height: 60 }} />;
  };


  render(){
    const tailwind = this.props.tailwind;
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

    return (
      <View style={tailwind('flex-1 bg-gray')}>
          <Modal isVisible={this.state.isModalVisible}>
          <View style={styles.alertContainer}>
              <Text>{this.state.content}</Text>
              <TouchableOpacity
              style={[styles.button]}
              onPress={() => this.setState({isModalVisible: false})}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.showAlertInput}>
              <View style={styles.alertContainer}>
                <TextInput
                  value={this.state.inputText}
                  onChangeText={(value) => this.setState({inputText: value})}
                  placeholder="Enter text here"
                   style={styles.input}
                   placeholderTextColor="#999"
                />
                <TouchableOpacity 
                style={[styles.button, styles.confirmButton]}
                onPress={
                    () => {
                      this.readTowingNotif();
                    }}>
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => this.setState({showAlertInput: false})}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
        </View>
      </Modal>

        <AwesomeAlert
            show={this.state.showAlert}
            showProgress={false}
            title="Confirmation"
            message="Are you sure you want to proceed?"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            showConfirmButton={true}
            cancelText="No, cancel"
            confirmText="Yes, proceed"
            confirmButtonColor="#DD6B55"
            onCancelPressed={() => this.setState({showAlert: false})}
            onConfirmPressed={
              async () => {
                this.readTowingNotif();
              }}
        />
        <Modal visible={this.state.visibleImage} transparent={true} style={{backgroundColor: 'white',
          margin: 0, // This is the important style you need to set
          alignItems: undefined,
          justifyContent: undefined}}>
          <ImageViewer imageUrls={this.state.img}
                       enableSwipeDown="true"
                       enablePreload= "true"
                       backgroundColor="#000"
                       renderHeader={(index) =>
                         <SafeAreaView>
                           <View style={{flexDirection:'row', zIndex: 9999}}>
                             <TouchableOpacity
                               onPress={() => this.setState({visibleImage: false})}>
                               <FontAwesomeIcon
                                    icon  = { faXmarkCircle }
                                    color = "#fff"
                                    size  = {25}
                                />
                             </TouchableOpacity>
                           </View>
                         </SafeAreaView>
                       }
                       loadingRender = {() => <Loader loader={true}></Loader> }
                       renderFooter={ (index) => {}}
          />
        </Modal>
        <Modal
          visible={this.state.visibleVideo} transparent={true} style={{backgroundColor: 'white',
          margin: 0, // This is the important style you need to set
          alignItems: undefined,
          justifyContent: undefined}}>
          <VideoPlayer source={this.state.video} />
          <TouchableOpacity style={{width:'100%', backgroundColor:'#EDEDED', padding:'3%'}} onPress={() => this.setState({visibleVideo: false})}>
            <Text style={styles.buttonTextup}>{strings('main.ok')}</Text>
          </TouchableOpacity>
        </Modal>
        <View style={{}}>
          <View style={[styles.tabBar, {backgroundColor:'#EDEDED'}]}>
            
            <TouchableOpacity
              style={tailwind(`${this.state.selectedTab == 2 ? 'bg-xdBlueDarker' : 'bg-white'} 
              flex-row p-2 align-center text-center rounded-lg  m-1 
              justify-center content-center items-center flex-1`)}
              onPress={() => this.activeAnnouncements()}>
              <Animated.Text
                style={tailwind(`${this.state.selectedTab === 2 ? 'text-white ' : 'text-xdDarkblue'} text-center text-xxs flex-1`)}>

                {strings('main.announcments')} </Animated.Text>
              <Badge value={this.state.fulldata.length}
                     textStyle={tailwind('text-xxxs p-0.5')}
                     badgeStyle={[{backgroundColor: '#FFB100'}]}>
              </Badge>
            </TouchableOpacity>

            <TouchableOpacity
              style={tailwind(`${this.state.selectedTab == 3 ? 'bg-xdBlueDarker' : 'bg-white'} flex-row p-2 align-center text-center 
              justify-center content-center items-center rounded-lg m-1  flex-1`)}
              onPress={() => this.activeTowing()}>
              <Animated.Text
                style={[tailwind(`${this.state.selectedTab === 3 ? 'text-white' : 'text-xdDarkblue'}  text-center flex-1 text-xxs` )]}
              > {strings('main.operation_notif')}  </Animated.Text>
              <Badge value={this.state.data.length}
                     textStyle={tailwind('text-xxxs p-0.5')}
                     badgeStyle={[{backgroundColor: '#FFB100'}]}>
              </Badge>
            </TouchableOpacity>

            <TouchableOpacity
              style={tailwind(`${this.state.selectedTab == 1 ? 'bg-xdBlueDarker' : 'bg-white'} flex-row p-2 align-center text-center 
              justify-center content-center items-center rounded-lg m-1  flex-1`)}
              onPress={() => this.activeCars()}>
              <Animated.Text
                style={tailwind(`${this.state.selectedTab === 1 ? 'text-white' : 'text-xdDarkblue'}  text-xxs text-center flex-1`)}
              > {strings('main.car_notification')}  </Animated.Text>
              <Badge value={this.state.carsData.length}
                     textStyle={tailwind('text-xxxs p-0.5')}
                     badgeStyle={[{backgroundColor: '#FFB100'}]}>
              </Badge>
            </TouchableOpacity>
          </View>
        </View>



          {(this.state.carsView)? (this.state.loaderCars)?
            (<Loader loader={this.state.loaderCars}></Loader>):
            (this.state.carsData.length > 0)?
              <RecyclerListView
                ref={ref => this._recyclerListView = ref}
                style={{flex: 1}}
                useWindowScroll
                optimizeForInsertDeleteAnimations={true}
                initialRenderIndex={0}
                scrollsToTop={false}
                renderAheadOffset={1000}
                showsVerticalScrollIndicator={true}
                rowRenderer={this.carsrRowRenderer}
                forceNonDeterministicRendering={true}
                dataProvider={this.state.listCars}
                initialListSize={10}
                onEndReached={() => this.onEndReachedCars()}
                onEndReachedThreshold={10}
                layoutProvider={this.layoutProvider}
                renderFooter={() => this.renderFooter()}
              />
              :<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={commonStyle.fontsizeGlobal}>{}</Text></View>:<View></View> }

          {(this.state.announementView)? (this.state.loader)?
            (<Loader loader={this.state.loader}></Loader>):
            (this.state.fulldata.length > 0)?
              <FlatList
                showsHorizontalScrollIndicator={false}
                style= {{paddingVertical: 10, height: height*0.8, backgroundColor:'#EDEDED'}}
                data={this.state.fulldata}
                initialNumToRender={10000}
                windowSize={20}
                maxToRenderPerBatch={10000}
                getItemLayout={(data, index) => (
                  {length: width, offset: width * index, index}
                )}
                removeClippedSubviews={true}
                keyExtractor={item => item.id}
                renderItem={this.rowRenderer}
                ListFooterComponentStyle={{marginTop: height*0.1}}
              />
              :<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={commonStyle.fontsizeGlobal}>{}</Text></View>
              :<View></View> }

            {(this.state.towingView)? (this.state.loaderTowing)?
            (<Loader loader={this.state.loader}></Loader>):
            (this.state.data.length > 0)?
              <FlatList
                showsHorizontalScrollIndicator={false}
                style= {{paddingVertical: 10, height: height*0.8, backgroundColor:'#EDEDED'}}
                data={this.state.data}
                initialNumToRender={10000}
                windowSize={20}
                maxToRenderPerBatch={10000}
                getItemLayout={(data, index) => (
                  {length: width, offset: width * index, index}
                )}
                removeClippedSubviews={true}
                keyExtractor={item => item.id}
                renderItem={this.towingRowRenderer}
                ListFooterComponentStyle={{marginTop: height*0.1}}
              />
              :<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={commonStyle.fontsizeGlobal}>{}</Text></View>
              :<View></View> }
      </View>
    )
  }
};
export default WithTailwindHook(NotificationAnnouncements);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  tabBar: {
    flexDirection: 'row',
    
  },
  tabItem: {
    flex: 1,
    flexDirection:'row',
    alignItems: 'center',
    padding: 16,
  },
  tinyLogo: {
    width: 75,
    height: 75,
    borderRadius:10,
  },
  rowFront: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height*0.12,
    width: '100%',
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
    resizeMode: "contain",
    width: '100%',
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
      textbody: {
        textAlign: 'center',
        color:'#000',
        fontSize:width*0.03 //12
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
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    },

    button: {
      backgroundColor: '#EDEDED',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
      minWidth: 150,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    alertContainer: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    input: {
      width: '100%',
      height: 40,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    },
    confirmButton: {
      backgroundColor: '#0B9A21',
    },
    cancelButton: {
      backgroundColor: '#A30000',
    },
    closeButton: {
      fontSize: 18,
      color: 'blue',
      marginTop: 20,
    },
});
