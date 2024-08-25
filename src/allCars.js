import React, {Component} from 'react';
import { StyleSheet, View, Dimensions, Text, Image,
   ScrollView,
   TouchableOpacity,
   Alert,
   ImageBackground,
   SafeAreaView,
   
   TextInput,
   } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider, ContextProvider  } from 'recyclerlistview';
import I18n from 'react-native-i18n';
import * as Animatable from 'react-native-animatable';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import  Loader  from '../components/Loader.js';
import commonStyle from '../assets/style/styles.js';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
//import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { Button, Menu, Divider, Provider } from 'react-native-paper';

import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-datepicker';
import RNPicker from "search-modal-picker";
import { faChevronLeft, faSliders, faImage } from '@fortawesome/free-solid-svg-icons';

import WithTailwindHook from "../components/hooks/WithTailwindHook";
import ScreenTitle from "../components/atoms/ScreenTitle";
import HeaderLogo from "../components/atoms/HeaderLogo";
import CarCard from "../components/molecules/CarCard";
import FloatingActionButton from '../components/FloatingActionButton.js';

const SCREEN_WIDTH = Dimensions.get('window').width;
const {width, height} = Dimensions.get('window');
const radius = height*0.3 / 2;//0.35
const center = radius-15;
const circlesmalsize = height*0.09;

let AllCars = class AllCars extends Component {

  constructor(props){
    super(props);
    this.state = {
      loader      : true,
      fulldata    : [],
      post_page   : 0,
      load_more   : false,
      arrays      :[],
      loadfilter: false,
      search      : '',
      dataSource  : [],
      countries: ['uk'],
      searcharrayLotvin: [],
      store: '',
      type: '',
      from_date:'',
      to_date: '',
      new: '',
      port: '',
      delivered: '',
      warehouse: '',
      loading: '',
      towing: '',
      no_data: false,
      visible: false,
      ports: [],
      isFetching: false,
      loaderinside: false,
      isModalVisible: false,
      visible_filter: false,
      year: [],
      yearval: '',
      makerval: '',
      modelval: '',
      all_model: [],
      all_maker: [],
      visible22:false,
      allNotes: [],
      list: [],
      total_posts: 0
    }

    this.props.navigation.setOptions({
        header: () => (
              <View style={[commonStyle.header, 
                {flexDirection: 'row', justifyContent: 'center', alignItems:'center'}]}>
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
                            <Text style={commonStyle.headerText}>{strings('main.my_cars')}</Text>
                        </View>
                        <View style={{ justifyContent: 'flex-start', alignItems: 'flex-end', flex: 0.1}}>
                        <Provider>
      <View
        style={{
          paddingTop: 50,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Menu
          visible={this.state.visible}
          onDismiss={this.setState({visible:false})}
          anchor={<Button onPress={() => this.setState({visible:true})}>Show menu</Button>}>
          <Menu.Item onPress={() => {}} title="Item 1" />
          <Menu.Item onPress={() => {}} title="Item 2" />
          <Divider />
          <Menu.Item onPress={() => {}} title="Item 3" />
        </Menu>
      </View>
    </Provider></View>
                        <View style={{justifyContent: 'center', alignItems: 'center', flex: 0.2}}>
                            <TouchableOpacity activeOpacity={1} onPress={() => this.setState({visible_filter:true})} size={20}>
                                <View>
                                    <FontAwesomeIcon
                                        icon={ faSliders }
                                        color="#fff"
                                        size={width*0.06}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                      </View>
                </View>
          )});
    /**this.props.navigation.setOptions({
      header: () => (
        <SafeAreaView>
          <View style={[commonStyle.headernoShadowNew, {flexDirection: 'row', justifyContent: 'center', alignItems:'center'}]}>
            <View style={{flex:0.2, justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
                    <FontAwesomeIcon
                        icon={ faArrowLeft }
                        color="#fff"
                        size={width*0.06}
                    />
              </TouchableOpacity>
            </View>
            <HeaderLogo/>
            <View style={{ justifyContent: 'flex-start', alignItems: 'flex-end', flex: 0.1}}>
              <Menu
                style={{backgroundColor:'#fff'}}
                ref={this.setMenuRef}
                button={<TouchableOpacity activeOpacity={1} onPress={this.showMenu}>
                  <Image
                    source={require('../assets/filter_white.png')}
                    style = {{
                      resizeMode: "contain",
                      justifyContent: "center",
                      width: 25,
                      height: 25,
                    }} /></TouchableOpacity> }
              >
                <MenuItem textStyle={{color:'#0b4282', backgroundColor:'#fff'}} onPress={this.hideMenuNew}>{strings('car.new_cars')}</MenuItem>
                <MenuItem textStyle={{color:'#0b4282', backgroundColor:'#fff'}} onPress={this.hideMenuTowing}>{strings('car.towing')}</MenuItem>
                <MenuItem textStyle={{color:'#0b4282', backgroundColor:'#fff'}} onPress={this.hideMenuWarehouse}>{strings('car.warehouse')}</MenuItem>
                <MenuItem textStyle={{color:'#0b4282', backgroundColor:'#fff'}} onPress={this.hideMenuLoading}>{strings('car.loading')}</MenuItem>
                <MenuItem textStyle={{color:'#0b4282', backgroundColor:'#fff'}} onPress={this.hideMenuPort}>{strings('car.port')}</MenuItem>
                <MenuItem textStyle={{color:'#0b4282', backgroundColor:'#fff'}} onPress={this.hideMenuStore}>{strings('car.store')}</MenuItem>
                <MenuItem textStyle={{color:'#0b4282', backgroundColor:'#fff'}} onPress={this.hideMenuDelivered}>{strings('car.delivered_car')}</MenuItem>
              </Menu>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center', flex: 0.2}}>
              <TouchableOpacity activeOpacity={1} onPress={() => this.setState({visible_filter:true})} size={20}>
                <View>
                    <FontAwesomeIcon
                        icon={ faSliders }
                        color="#fff"
                        size={width*0.06}
                    />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>)
    });**/
  }

  componentDidMount() {
    this.getData('', '');
    this.getcustomerslotvin();
    this.getModelMaker();
  }

  componentWillMount() {
    this.getData('', '');
  }

  setModalVisible = (val) => {
    this.setState({visible:val});
  }

  degToRad = (deg) => {
    return deg * Math.PI / 180;
  }

  setModalVisibleFilter = (val) => {
    this.setState({visible_filter:val});
  }

  getData = (item, type) => {
    this.setState({
      loader          : true,
      search: item,
      visible_filter: false
    });
    var lengthVar = 1;
    if(type != ''){
      lengthVar = 10;
    }else {
      lengthVar = 10
    }
    var start     = this.state.start;
    const formData = new FormData();
    formData.append('client_id', '1230');
    formData.append('client_secret', '1230NEJOUM1230');
    formData.append('customer_id', AuthContext.id);
    formData.append('type', type);
    formData.append('year', this.state.yearval);
    formData.append('maker', this.state.makerval);
    formData.append('model', this.state.modelval);
    formData.append('from_date', this.state.from_date);
    formData.append('to_date', this.state.to_date);
    formData.append('search_val', item);
    formData.append('start', 0);
    formData.append('length', lengthVar);
    var Url  = AuthContext.server_url + "/Nejoum_App/allCars2";
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
          console.log(' response.data');
          console.log( response.data);
          response.data.forEach(instance => {
            if(fakeData.length == 0){
              fakeData.push({
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
                receiver_name                    : instance.receiver_name,
                type                    : 'all',

              });
            }else if (fakeData.indexOf({ id: instance.car_id}) ==-1){
              fakeData.push({
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
                type                    : 'all',
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
                receiver_name                    : instance.receiver_name,
              });
            }
          });
          this.setState ({
              list: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(fakeData),
            },
            this.setLayout()
          );
          this.setState({
            loader      : false,
            fulldata    : response.data,
            post_page   : response.data.length,
            total_posts : response.data.length
            //list        : new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(fakeData),
          });
          return;
        }
        else{
          this.setState({
            loader      : false,
            error_message    : 'error',
            no_data: true
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

  getModelMaker = () => {
    this.setState({
      loader          : true
    });
    const formData = new FormData();
    formData.append('client_id', '1230');
    formData.append('client_secret', '1230NEJOUM1230');
    formData.append('customer_id', AuthContext.id);
    var Url  = AuthContext.server_url + "/Nejoum_App/getModelMaker";
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
        //console.warn(response);
        if(response.success == 'success') {
          this.setState({
            loader    : false,
            all_maker : response.maker,
            year      : response.year,
            all_model: response.model,
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

  getmakerModel = (itemValue, name) => {
    this.setState({
      loadfilter  : true,
      makerval    : itemValue,
      nameMaker   : name
    });
    const formData = new FormData();
    formData.append('client_id', '1230');
    formData.append('client_secret', '1230NEJOUM1230');
    formData.append('maker_id', itemValue);
    formData.append('customer_id', AuthContext.id);
    formData.append('year', this.state.yearval);
    //console.log(itemValue);
    var Url  = AuthContext.server_url + "/Nejoum_App/getModelCustomer";
    //var Url  = "https://www.nejoumaljazeera.tech/Nejoum106/Nejoum_App/getModelCustomer";
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
          //console.log(response);
          this.setState({
            loadfilter      : false,
            all_model    : response.data,


          });
          return;
        }
        else {
          this.setState({
            loadfilter      : false,
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
          loadfilter      : false,
          error_message    : error
        });
        console.warn(error);
        Alert.alert('Error', 'Connection Error', [
          {text: 'Okay'}
        ]);
      });
  }


  SearchFilterFunction(text) {
    //console.warn(this.state.searcharrayLotvin);
    const newData = this.state.searcharrayLotvin.filter(function(item) {
      const itemData = item ? item :'';
      const textData = text;
      return itemData.indexOf(textData) > -1;
    });
    this.setState({ dataSource: newData, search: text,
    });
    console.log(text);
    this.getData(text, this.state.type);
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

  updateSearch = (search) => {
    this.setState({ search });
  };

  reset = () => {
    this.setState({
      visible_filter: false,
      yearval: '',
      makerval: '',
      nameMaker:'',
      nameModel:'',
      modelval: '',
      from_date:'',
      to_date:''
    }, () => {
      this.getData('','');
    })
  }

  saveNotes = () => {
    this.setState({
      loaderinside          : true,
    });
    const formData = new FormData();
    formData.append('client_id', '1230');
    formData.append('client_secret', '1230NEJOUM1230');
    formData.append('customer_id', AuthContext.id);
    formData.append('car_id', this.state.car_id);
    formData.append('notes', this.state.inputValue);
    var Url  = AuthContext.server_url + "/Nejoum_App/save_notes";
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
          var notes = this.state.allNotes;
          notes.push(
            {
              id : this.state.car_id,
              note: this.state.inputValue
            });
          this.setState({
            loaderinside      : false,
            isModalVisible    : false,
            inputValue: '',
            allNotes : notes
          });
          return;
        }
        else{
          this.setState({
            loaderinside      : false,
            error_message    : 'error',
          });
          Alert.alert('Error', 'Error Occured', [
            {text: 'Okay'}
          ]);
          return;
        }
      })
      .catch((error) => {
        this.setState({
          loaderinside      : false,
          error_message    : error
        });
        Alert.alert('Error', 'Connection Error', [
          {text: 'Okay'}
        ]);
      });
  }


  setLayout = () => {
    this.layoutProvider = new LayoutProvider((i) => {
      return this.state.list.getDataForIndex(i);
    }, (dim) => {
      dim.width  = SCREEN_WIDTH;
      dim.height = 100;
    })
  }

  shownote = (note) => {
    Alert.alert(strings('main.note'), note, [
      {text: strings('main.ok')}
    ]);

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
        this.setState({
          loaderinside      : false,
          error_message    : error
        });
        Alert.alert('Error', 'Connection Error', [
          {text: 'Okay'}
        ]);
      });
  }




  showMenu = () => {
    this._menu.show();
  };

  setMenuRef = ref => {
    this._menu = ref;
  };


  hideMenuTowing = () => {
    this.setState({type: "towing"});
    this._menu.hide();
    this.getData(this.state.search, "towing");
  };

  hideMenuDelivered = () => {
    this.setState({type: "delivered"});
    this._menu.hide();
    this.getData(this.state.search, "delivered");
  }

  hideMenuLoading = () => {
    this.setState({type: "loading"});
    this._menu.hide();
    this.getData(this.state.search, "loading");
  }
  hideMenuWarehouse = () => {
    this.setState({type: "warehouse"});
    this._menu.hide();
    this.getData(this.state.search, "warehouse");
  }
  hideMenuPort = () => {
    this.setState({type: "port"});
    this._menu.hide();
    this.getData(this.state.search, "port");
  }
  hideMenuStore = () => {
    this.setState({type: "store"});
    this._menu.hide();
    this.getData(this.state.search, "store");
  }
  hideMenuNew = () => {
    this.setState({type: "new"});
    this._menu.hide();
    this.getData(this.state.search, "new");
  }

  YourImage = (url) => (
    <FastImage
      style={commonStyle.redgradientimage}
      source={{
        uri: url,
        priority: FastImage.priority.normal,
      }}
      resizeMode={FastImage.resizeMode.contain}
    />
  )


  title = (delivered_title, follow_title) =>
  {
    if(delivered_title == 1){
      return( <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center',flex:1}}>
        <Text style={commonStyle.redgradientblueText}>{strings('car.title')}</Text>
        <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
          <Image
            style={commonStyle.keysStyleborderWhite}
            source={require('../assets/check.png')}
          />
        </View>
      </View>);
    }else{
      if(follow_title){
        return(
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center',flex:1}}>
            <Text style={commonStyle.redgradientblueText}>{strings('car.title')}</Text>
            <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
              <Image
                style={commonStyle.keysStyleborderWhite}
                source={require('../assets/check.png')}
              />
            </View>
          </View>
        );
      }else {
        return(
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center',flex:1}}>
            <Text style={commonStyle.redgradientblueText}>{strings('car.title')}</Text>
            <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
              <Image
                style={commonStyle.keysStyleborderWhite}
                source={require('../assets/x.png')}
              />
            </View>
          </View>
        )
      }
    }
  }


  keys = (delivered_car_key) =>
  {
    if(delivered_car_key == 1){
      return(
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center',flex:1}}>
          <Text style={commonStyle.redgradientblueText}>{strings('car.keys')}</Text>
          <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
            <Image
              style={commonStyle.keysStyleborderWhite}
              source={require('../assets/check.png')}
            />
          </View>
        </View>
      );
    }else{
      return(
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center',flex:1}}>
          <Text style={commonStyle.redgradientblueText}>{strings('car.keys')}</Text>
          <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
            <Image
              style={commonStyle.keysStyleborderWhite}
              source={require('../assets/x.png')}
            />
          </View>
        </View>
      )
    }
  }


  rowRenderer = (item,type,index) => {
    const { id, lotnumber,special_notes,follow_car_title_note, carMakerName, carModelName, year, purchasedate } = item;

    dataDetails = {};
    dataDetails.id              = item.id;
    dataDetails.vin       = item.vin;
    dataDetails.lotnumber       = item.lotnumber;
    dataDetails.titleDate = item.titleDate;
    dataDetails.type    = 'all';
    dataDetails.port_name       = item.port_name;
    dataDetails.calculation            = item.calculation;
    dataDetails.aTitle = item.aTitle;
    dataDetails.carnotes = item.carnotes;
    dataDetails.auction_location_name     = item.auction_location_name;
    dataDetails.special_notes   = item.special_notes;
    dataDetails.follow_car_title_note = item.follow_car_title_note;
    dataDetails.carMakerName    = item.carMakerName;
    dataDetails.year            = item.year;
    dataDetails.carModelName    = (item.carModelName.substr(0,item.carModelName.indexOf(' ')) != '')?
    item.carModelName.substr(0,item.carModelName.indexOf(' ')):item.carModelName;
    dataDetails.receive_date     = item.receive_date;
    dataDetails.deliver_create_date             = item.deliver_create_date;
    dataDetails.recovery_iddata= item.recovery_iddata;
    dataDetails.image_small     = item.image_small;
    dataDetails.delivered_car_key     = item.delivered_car_key;
    dataDetails.follow_title = item.follow_title;
    dataDetails.delivered_title = item.delivered_title;
    dataDetails.purchasedate    = item.purchasedate;
    dataDetails.deliver_customer    = item.deliver_customer;
    dataDetails.final_payment_status    = item.final_payment_status;
    dataDetails.finesTotal    = item.finesTotal;
    dataDetails.end_warehouse    = item.end_warehouse;
    dataDetails.recovery_name    = item.recovery_name;
    dataDetails.paymentDate             = item.paymentDate;
    dataDetails.ETD = item.etd;
    dataDetails.loaded_date     = item.loaded_date;
    dataDetails.eta             = item.eta;
    dataDetails.booking_number = item.booking_number;
    dataDetails.container_number= item.container_number;
    dataDetails.shipping_date = item.shipping_date;    
    dataDetails.allNotes    = this.state.allNotes;
    dataDetails.port_departuren    = item.port_departuren;  
    dataDetails.titleDate = item.titleDate;            

    const actions={
      goToDetails: () => this.props.navigation.navigate('carDetails2', {'data': dataDetails, 'type': 'all','allNotes': this.state.allNotes}),
      goToImages:() => this.props.navigation.navigate('carImagesNavigator', {'car_id': id, 'purchasedate': purchasedate, 'lotnumber':lotnumber, 'carMakerName': carMakerName,
        'carModelName': carModelName, 'year': year}),
      showNote:() =>this.shownote(follow_car_title_note),
      addNote:() =>this.setModalNotesVisible(true, id, special_notes),
      track: () =>this.track(lotnumber)
    }
  return (
      <View style={{flex:1}}>
          <CarCard data={dataDetails} actions={actions} props={this.props}/>
        </View>
    )
  }

  setModalNotesVisible = (val, car_id, value) => {
    var res = this.state.allNotes.filter(function(o) {
      return o.id == car_id
    }).pop();
    if(res){
      this.setState({
        car_id: car_id,
        isModalVisible:val,
        inputValue: res.note
      });
    }else {
      this.setState({
        car_id: car_id,
        isModalVisible:val,
        inputValue: value
      });
    }
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
        //console.warn(response);
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


  changeStatussearch = () => {
    this.setState({type:''});
    this.getData(this.state.search, '');
  }

  onEndReached = () => {
    if (this.state.isFetching) return; 
    this.setState({load_more:true});
    var start     = this.state.post_page +1;
    var Url       = AuthContext.server_url+"/Nejoum_App/allCars2";
    this.setState({ isFetching: true });
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
    formData.append('start', start-1);
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
            const exists = fakeDatad.some(item => item.id === instance.car_id);
            if (!exists) {
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
          }
          });
          /**this.setState(prevState => {
          return {
            list: prevState.dataProvider.cloneWithRows(fakeDatad)
          }
        }, () => {
          this._recyclerListView._refreshViewability()
          this.setState({
            dataProvider: this.state.dataProvider.cloneWithRows(fakeDatad),
              indexes: this._recyclerListView.getCurrentScrollOffset()
            });
        });**/
          this.setState ({
              load_more       : false,
              post_page       : fakeDatad.length,
              total_posts     : fakeDatad.length,
              fulldata        : old_data,
              list            : new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(fakeDatad),
              isFetching:false
            },
            //this.setLayout(),
            //this._recyclerListView.scrollToIndex(fakeDatad.length-count-1, true)
          );
        }
      })
      .catch((error) => {
        console.warn(error.message);
      });
  }

  _handleRefresh = () => {
  }

  renderFooter = () => {
    //Second view makes sure we don't unnecessarily change height of the list on this event. That might cause indicator to remain invisible
    //The empty view can be removed once you've fetched all the data
    return this.state.load_more
      ? <View style={{backgroundColor:'transparent',flex:1, justifyContent:'center', alignItems:'center'}}>
        <Image source={require("../assets/loadingapp.gif")}
               style={{justifyContent:'center', width:50, height:50, alignItems:'center', flex:0.2}}
               resizeMode="contain">
        </Image>
      </View>
      : <View style={{ height: 60 }} />;
  };

  render() {
    const tailwind = this.props.tailwind;
    if(this.state.loadfilter){
      var loadfilter = <View style={{backgroundColor:'transparent', flex:1, justifyContent:'center', alignItems:'center'}}>
        <Image source={require("../assets/loadingapp.gif")}
               style={{borderWidth:1, justifyContent:'center', width:30, height:30, alignItems:'center', flex:0.2}}
               resizeMode="contain">
        </Image>
      </View>;
    }else {
      var loadfilter = [];
    }


    var flatlist = <View></View>;
    var searchval = false;
    var typesearch = '';
    if(this.state.type != ''){
      searchval = true;
      typesearch = <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
        <TouchableOpacity activeOpacity={1} style={{ borderWidth: 2, borderColor: '#0b4282',
          borderRadius:5,backgroundColor: '#0b4282', flexDirection:'row',
          width:100,color: '#0b4282', alignItems:'center', justifyContent:'center'}}
                          onPress={() => this.changeStatussearch() }>
          <Text style={{padding:'5%', color: '#fff',  textAlign:'center'}}>{this.state.type}</Text>
        </TouchableOpacity></View>
      ;
    }else {
      typesearch = <View></View>;
      searchval = false;
    }

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

      var  actualStatus = '';


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
        actualStatus = strings('car.warehouse');
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
        actualStatus = strings('car.loading');
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
        actualStatus = strings('car.shipping');
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
        actualStatus = strings('car.port');
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
        actualStatus = strings('car.store');
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

//Filter
    if(this.state.year){
      const dataYear = [];
      this.state.year.map((item,i) => {
        var name = (item.name).toString();
        dataYear.push({
          id: i,
          name: name
        })
      });
      var year_pickers =
        <RNPicker
          dataSource={dataYear}
          dummyDataSource={dataYear}
          defaultValue={false}
          pickerTitle={strings("main.year")}
          showSearchBar={true}
          disablePicker={false}
          changeAnimation={"none"}
          searchBarPlaceHolder={"Search....."}
          showPickerTitle={true}
          searchBarContainerStyle={this.props.searchBarContainerStyle}
          pickerStyle={styles.pickerStyle}
          pickerItemTextStyle={styles.listTextViewStyle}
          selectedLabel={this.state.yearval}
          placeHolderLabel={(this.state.yearval != '')?(this.state.yearval):strings("main.year")}
          selectLabelTextStyle={styles.selectLabelTextStyle}
          placeHolderTextStyle={styles.placeHolderTextStyle}
          dropDownImageStyle={styles.dropDownImageStyle}
          selectedValue={(index, item) => this.setState({yearval:item.name})}
        />
    }else{
      var year_pickers = <View></View>;
    }

    if(this.state.all_maker){
      const dataMaker = [];
      this.state.all_maker.map((item,i) => {
        dataMaker.push({
          id: item.id,
          name:  item.name
        })
      });
      //console.log(dataMaker);
      var maker_pickers =
        <RNPicker
          dataSource={dataMaker}
          dummyDataSource={dataMaker}
          defaultValue={false}
          pickerTitle={strings("main.maker")}
          showSearchBar={true}
          disablePicker={false}
          changeAnimation={"none"}
          searchBarPlaceHolder={"Search....."}
          showPickerTitle={true}
          searchBarContainerStyle={this.props.searchBarContainerStyle}
          pickerStyle={styles.pickerStyle}
          pickerItemTextStyle={styles.listTextViewStyle}
          selectedLabel={this.state.nameMaker}
          placeHolderLabel={(this.state.nameMaker != '')?(this.state.nameMaker):strings("main.maker")}
          selectLabelTextStyle={styles.selectLabelTextStyle}
          placeHolderTextStyle={styles.placeHolderTextStyle}
          dropDownImageStyle={styles.dropDownImageStyle}
          selectedValue={(index, item) => this.getmakerModel(item.id, item.name)}
        />
    }else {
      var maker_pickers = <View></View>;
    }

    if(this.state.all_model){
      const dataModel = [];
      this.state.all_model.map((item,i) => {
        var name = (item.name).toString();
        dataModel.push({
          id: item.id,
          name:  item.name
        })
      });
      var model_pickers =
        <RNPicker
          dataSource={dataModel}
          dummyDataSource={dataModel}
          defaultValue={false}
          pickerTitle={strings("main.model")}
          showSearchBar={true}
          disablePicker={false}
          changeAnimation={"none"}
          searchBarPlaceHolder={"Search....."}
          showPickerTitle={true}
          searchBarContainerStyle={this.props.searchBarContainerStyle}
          pickerStyle={styles.pickerStyle}
          pickerItemTextStyle={styles.listTextViewStyle}
          selectedLabel={this.state.nameModel}
          placeHolderLabel={(this.state.nameModel != '')?(this.state.nameModel):strings("main.model")}
          selectLabelTextStyle={styles.selectLabelTextStyle}
          placeHolderTextStyle={styles.placeHolderTextStyle}
          dropDownImageStyle={styles.dropDownImageStyle}
          selectedValue={(index, item) => this.setState({modelval:item.id, nameModel: item.name})}
        />
    }else {
      var model_pickers = <View></View>;
    }

    if(this.state.yearval != ''){
      var year_filter_btn = <TouchableOpacity activeOpacity={1} style={{borderWidth: 2, borderColor: '#0d5db8', backgroundColor:'#0d5db8', borderRadius:25, padding: 10}}
                                              onPress={() => this.changestatusyear() }>
        <Text style={commonStyle.textwhite}>{this.state.yearval}</Text>
      </TouchableOpacity>
    }else{
      var year_filter_btn = <TouchableOpacity activeOpacity={1} style={{borderWidth: 2, borderColor: '#0d5db8', borderRadius:25, padding: 10}}>
        <Text style={commonStyle.textBlue}>{strings('main.year')}</Text>
      </TouchableOpacity>
    }

    if(this.state.makerval != ''){
      var values_maker = this.state.makerval;
      var res = this.state.all_maker.filter(function(o) {
        return o.id_car_make == values_maker
      }).pop();
      //console.log(res);
      if(res){
        var maker_filter_btn = <TouchableOpacity activeOpacity={1} style={{borderWidth: 2, borderColor: '#0d5db8', backgroundColor:'#0d5db8', borderRadius:25, padding: 10}}
                                                 onPress={() => this.changestatusmaker() }>
          <Text style={commonStyle.textwhite}>{res.name}</Text>
        </TouchableOpacity>
      }else{
        var maker_filter_btn = <TouchableOpacity activeOpacity={1} style={{borderWidth: 2, borderColor: '#0d5db8', borderRadius:25, padding: 10}}>
          <Text style={commonStyle.textBlue}>{strings('main.maker')}</Text>
        </TouchableOpacity>
      }
    }else{
      var maker_filter_btn = <TouchableOpacity activeOpacity={1} style={{borderWidth: 2, borderColor: '#0d5db8', borderRadius:25, padding: 10}}>
        <Text style={commonStyle.textBlue}>{strings('main.maker')}</Text>
      </TouchableOpacity>
    }

    if(this.state.modelval != ''){
      var values_model = this.state.modelval;
      var res = this.state.all_model.filter(function(o) {
        return o.id_car_model == values_model
      }).pop();
      if(res){
        var model_filter_btn = <TouchableOpacity activeOpacity={1} style={{borderWidth: 2, borderColor: '#0d5db8', backgroundColor:'#0d5db8', borderRadius:25, padding: 10}}
                                                 onPress={() => this.changestatusmodel() }>
          <Text style={commonStyle.textwhite}>{res.name}</Text>
        </TouchableOpacity>;
      }else {
        var model_filter_btn = <TouchableOpacity activeOpacity={1} style={{borderWidth: 2, borderColor: '#0d5db8', borderRadius:25, padding: 10}}>
          <Text style={commonStyle.textBlue}>{strings('main.model')}</Text>
        </TouchableOpacity>
      }

    }else{
      var model_filter_btn = <TouchableOpacity activeOpacity={1} style={{borderWidth: 2, borderColor: '#0d5db8', borderRadius:25, padding: 10}}>
        <Text style={commonStyle.textBlue}>{strings('main.model')}</Text>
      </TouchableOpacity>
    }

    /**if(this.state.loader){
          return(
              <Loader loader={this.state.loader}></Loader>
          );
      }**/

    if(this.state.no_data){
      return(
        <View style={styles.image}>
          <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
            <Text style={commonStyle.noDataText}>
              {strings('main.no_data')}
            </Text>
          </View>
        </View>
      );
    }


    return (
      <SafeAreaView style={commonStyle.marginGlobaleless}>

        {typesearch}
        <Modal
          backdropOpacity={0.3}
          isVisible={this.state.visible_filter}
          onBackdropPress={() => this.setModalVisibleFilter(false)}
          style={styles.contentView}>
          <View style={styles.content2}>
            <View style={{justifyContent:'space-between', alignItems:'center', flex:1}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.blueText2}>{strings('main.purchase_from')}</Text>
              </View>
              <View style={{flexDirection: "row"}}>
                <DatePicker
                  style={{width: 250}}
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
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.blueText2}>{strings('main.purchase_to')}</Text>
              </View>
              <View style={{flexDirection: "row"}}>
                <DatePicker
                  style={{width: 250}}
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
              </View>
              <View style={{flexDirection: "row"}}>
                {year_pickers}
              </View>
              <View style={{flexDirection: "row"}}>
                {maker_pickers}
              </View>
              <View style={{flexDirection: "row"}}>
                {model_pickers}
              </View>
              <View style={{flexDirection: 'row', justifyContent:'center', alignItems:'center'}}>
                {loadfilter}
              </View>

            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity activeOpacity={1} delayPressIn={0} style={commonStyle.submitbutton}
                                onPress={() => this.getData('','')}>
                <Text style={commonStyle.buttonText}>
                  {strings('main.search')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} style={commonStyle.submitbuttonSmall}
                                onPress={() => this.reset()}>
                <Text style={commonStyle.buttonText}>
                  {strings('main.reset')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <FloatingActionButton width={width} lotnumber={false} navigation={this.props.navigation} styleType="Floating"/>

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
            <View style={{flexDirection:'row'}}>
              <Text style={[commonStyle.buttonText, {color:'#0b4282'}]}>
                {actualStatus}
              </Text>
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



        <Modal animationType="slide"
               transparent isVisible={this.state.isModalVisible}
               presentationStyle="overFullScreen"
               onBackdropPress={() => this.setModalNotesVisible(false, '', '')}>
          <View style={styles.viewWrapper}>
            <View style={styles.modalView}>
              {(this.state.loaderinside)?(
                <View style={styles.overlay}>
                  <Image source={require("../assets/loadingapp.gif")}
                         style={{backgroundColor:'transparent', width:100}}
                         resizeMode="contain">
                  </Image>
                </View>
              ):(<View style={styles.modalView}>
                <TextInput placeholder={strings('main.write_somthing')}
                           value={this.state.inputValue} style={styles.textInput}
                           multiline = {true}
                           numberOfLines = {height*0.005}
                           onChangeText={(value) => this.setState({inputValue: value})} />
                <Button title={strings('main.save')} onPress={(value) => this.saveNotes()} />
              </View>)
              }
            </View>
          </View>
        </Modal>
        {this.state.loader?(<Loader  loader={this.state.loader}></Loader>):
          this.state.total_posts > 0
            ? (

              <RecyclerListView
                  ref={ref => this._recyclerListView = ref}
                  style={{flex: 1}}
                  useWindowScroll
                  optimizeForInsertDeleteAnimations={true}
                  initialRenderIndex={0}
                  scrollsToTop={false}
                  renderAheadOffset={1000}
                  showsVerticalScrollIndicator={true}
                  rowRenderer={(type , data ,index) => this.rowRenderer(type, data,index)}
                  forceNonDeterministicRendering={true}
                  dataProvider={this.state.list}
                  initialListSize={10}
                  onEndReached={() => this.onEndReached()}
                  onEndReachedThreshold={10}//height-0.07
                  layoutProvider={this.layoutProvider}
                  renderFooter={() => this.renderFooter()}
                />

            )
            :   <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
              <Text style={commonStyle.noDataText}>
                {strings('main.no_data')}
              </Text>
            </View>}


      </SafeAreaView>
    );
  }

};
export default WithTailwindHook(AllCars);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    minHeight: 1,
    minWidth: 1,
  },

  body: {
    marginLeft: 10,
    marginRight: 10,
    backgroundColor:'red',
    maxWidth: SCREEN_WIDTH - (80 + 10 + 20),
  },
  image22: {
    height: 80,
    width: 80,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    opacity: 0.5,
  },
  listItem: {
    flexDirection: 'row',
    margin: 10,
  },
  container: {
    flexGrow: 1,

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
  textwhite: {
    color: '#fff',
    fontSize: 20,
  },
  linearGradient: {
    flex: 1,
    /**paddingLeft: 15,
     paddingRight: 15,
     borderRadius: 5**/
  },
  numbergradient: {
    flex: 3,
    width: '75%',
    borderTopRightRadius: 25,
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
  imgBackground: {
    flex: 1,
    width: '100%',
    resizeMode: "contain",
    justifyContent: "center"
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
    fontSize: 16,
  },
  normalgreyTextHeader: {
    fontSize: 16,
    color: '#676767',
  },
  iconstyleHeader:{
    resizeMode: "cover",
    justifyContent: "center",
    marginBottom:10,
    width: 25,
    height: 25
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
  content2: {
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

  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    elevation: 5,
    transform: [{ translateX: -(width * 0.4) },
      { translateY: -90 }],
    height: 180,
    width: width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 7,
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
  selectLabelTextStyle: {
    color: "#000",
    textAlign: "left",
    width: "99%",
    padding: 10,
    flexDirection: "row"
  },
  placeHolderTextStyle: {
    color: "#000",
    padding: 10,
    textAlign: "left",
    width: "99%",
    flexDirection: "row"
  },
});