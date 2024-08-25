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
  Alert,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import  Loader  from '../components/Loader.js';
import I18n from 'react-native-i18n';
import commonStyle from '../assets/style/styles.js';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faArrowRight, faX, faSliders } from '@fortawesome/free-solid-svg-icons';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import RNPicker from "search-modal-picker";

const {width, height} = Dimensions.get('window'); 

  const month = new Array();
  month[0] = "Jan";
  month[1] = "Feb";
  month[2] = "Mar";
  month[3] = "Apr";
  month[4] = "May";
  month[5] = "Jun";
  month[6] = "Jul";
  month[7] = "Aug";
  month[8] = "Sep";
  month[9] = "Oct";
  month[10] = "Nov";
  month[11] = "Dec";

export default class Shippedcarsstmt extends Component {
    constructor(props){
        super(props);
        status_shipping = new Array();
        status_shipping[0] = I18n.t('car.all');
        status_shipping[1] = I18n.t('car.paid');
        status_shipping[2] = I18n.t('car.unpaid');
        status_arrive = new Array();
        status_arrive[1] = I18n.t('car.arrived');
        status_arrive[0] = I18n.t('car.not_arrived');
        status_arrive[2] = I18n.t('car.all');
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
            remaining_status: 0,
            transfer_status:0,
            arrive_store: 1,
            searcharrayLotvin: [],
            post_page   : 0,
            load_more   : false,
            loader      : false,
            previous_balance : 0,
            Previous_balanceA: '',
            status_arrive: status_arrive,
            status_shipping: status_shipping,
            dataStatus : [{
                id: 1,
                name: strings('car.arrived'),
                value: 1,
            },
            {
                id: 2,
                name: strings('car.not_arrived'),
                value: 0,
            },{
                id: 3,
                name: strings('car.all'),
                value: 2,
            }],
            dataShippping : [{
                id: 1,
                name: strings('car.paid'),
                value: 1,
            },
            {
                id: 2,
                name: strings('car.unpaid'),
                value: 2,
            },{
                id: 3,
                name: strings('car.all'),
                value: 0,
            }]
          }

          this.props.navigation.setOptions({
            header: () => (
                <View style = {commonStyle.header}>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                    marginTop: height*0.05, flex:1}}>
                        <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                                ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                            <TouchableOpacity activeOpacity={1}  onPress={() => this.props.navigation.goBack()}>
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
                            <Text style={commonStyle.headerText}>{strings('main.shipped_cars')}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                            <TouchableOpacity onPress={() => this.setState({visible:true})}>
                                <View>
                                    <FontAwesomeIcon 
                                        icon = {faSliders}
                                        color="#fff"
                                        size={width*0.06}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                </View>       
            </View>
            )
        });
    }

    async componentDidMount() {
        this.getData();
        
    }

    setMenuRef_status = ref => {
        this._menu2 = ref;
    };

    showMenu__status = () => {
        this._menu2.show();
    };

    setMenuRef_shipping = ref => {
        this._menu3 = ref;
    };

    showMenu__shipping = () => {
        this._menu3.show();
    };

    setMenuRef_transfer = ref => {
        this._menu4 = ref;
    };

    showMenu__transfer = () => {
        this._menu4.show();
    };


    setMenuRef = ref => {
        this._menu = ref;
    };

    showMenu = () => {
        this._menu.show();
    };

    hideMenuAll = () => {
        this._menu.hide();
        this.setState(
            {
                arrive_store : 2
            },
            this.getData         // here is where you put the callback
        );
    }

    hideMenuArrived = () => {
        this._menu2.hide();
        this.setState(
            {
                arrive_store : 1
            },
            this.getData         // here is where you put the callback
        );
    }

    hideMenunotArrived = () => {
        this._menu2.hide();
        this.setState(
            {
                arrive_store : 0
            },
            this.getData         // here is where you put the callback
        );
    }


    hideMenuAllshipping = () => {
        //console.warn('faefsda');
        this._menu3.hide();
        this.setState(
            {
                remaining_status : 0
            },
            this.getData         // here is where you put the callback
        );
    }

    hideMenuPaidShipping = () => {
        this._menu3.hide();
        this.setState(
            {
                remaining_status : 1
            },
            this.getData         // here is where you put the callback
        );
    }

    hideMenuUnpaidShipping = () => {
        this._menu3.hide();
        this.setState(
            {
                remaining_status : 2
            },
            this.getData         // here is where you put the callback
        );
    }

    
    hideMenuAllTransfere = () => {
        this._menu4.hide();
        this.setState(
            {
                transfer_status : 0
            },
            this.getData         // here is where you put the callback
        );
    }

    hideMenuPaidTransfere = () => {
        this._menu4.hide();
        this.setState(
            {
                transfer_status : 1
            },
            this.getData         // here is where you put the callback
        );
    }

    hideMenuUnpaidTransfere = () => {
        this._menu4.hide();
        this.setState(
            {
                transfer_status : 2
            },
            this.getData         // here is where you put the callback
        );
    }
    
    hideMenuJan = () => {
        this._menu.hide();
        this.setState(
            {
                value: 0,
                previous_balance: 0,
                from_date: new Date(new Date().getFullYear(), 0, 1).toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10),
                to_date: new Date(new Date().getFullYear(), 1, 1).toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10)
            },
            this.getData         // here is where you put the callback
        );
    }

    hideMenuFeb = () => {
        this._menu.hide();
        this.setState(
            {
                value: 1,
                previous_balance: 0,
                from_date: new Date(new Date().getFullYear(), 1, 1).toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10),
                to_date: new Date(new Date().getFullYear(), 2, 1).toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10)
            },
            this.getData         // here is where you put the callback
        );
    }

    
    hideMenuMar = () => {
        this._menu.hide();
        this.setState(
            {
                value: 2,
                previous_balance: 0,
                from_date: new Date(new Date().getFullYear(), 2, 1).toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10),
                to_date: new Date(new Date().getFullYear(), 3, 1).toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10)
            },
            this.getData         // here is where you put the callback
        );
    }

    
    hideMenuApr = () => {
        this._menu.hide();
        this.setState(
            {
                value: 3,
                previous_balance: 0,
                from_date: new Date(new Date().getFullYear(), 3, 1).toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10),
                to_date: new Date(new Date().getFullYear(), 4, 1).toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10)
            },
            this.getData         // here is where you put the callback
        );
    }

    
    hideMenuMay = () => {
        this._menu.hide();
        this.setState(
            {
                value: 4,
                previous_balance: 0,
                from_date: new Date(new Date().getFullYear(), 4, 1).toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10),
                to_date: new Date(new Date().getFullYear(), 5, 1).toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10)
            },
            this.getData         // here is where you put the callback
        );
    }


    hideMenuJun = () => {
        this._menu.hide();
        this.setState(
            {
                value: 5,
                previous_balance: 0,
                from_date: new Date(new Date().getFullYear(), 5, 1).toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10),
                to_date: new Date(new Date().getFullYear(), 6, 1).toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10)
            },
            this.getData         // here is where you put the callback
        );
    }

    hideMenuJul = () => {
        this._menu.hide();
        this.setState(
            {
                value: 6,
                previous_balance: 0,
                from_date: new Date(new Date().getFullYear(), 6, 1).toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10),
                to_date: new Date(new Date().getFullYear(), 7, 1).toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10)
            },
            this.getData         // here is where you put the callback
        );
    }

    hideMenuAug = () => {
        this._menu.hide();
        this.setState(
            {
                value: 7,
                previous_balance: 0,
                from_date: new Date(new Date().getFullYear(), 7, 1).toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10),
                to_date: new Date(new Date().getFullYear(), 8, 1).toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10)
            },
            this.getData         // here is where you put the callback
        );
    }

    hideMenuSep = () => {
        this._menu.hide();
        this.setState(
            {
                value: 8,
                previous_balance: 0,
                from_date: new Date(new Date().getFullYear(), 8, 1).toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10),
                to_date: new Date(new Date().getFullYear(), 9, 1).toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10)
            },
            this.getData         // here is where you put the callback
        );
    }

    hideMenuOct = () => {
        this._menu.hide();
        this.setState(
            {
                value: 9,
                previous_balance: 0,
                from_date: new Date(new Date().getFullYear(), 9, 1).toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10),
                to_date: new Date(new Date().getFullYear(), 10, 1).toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10)
            },
            this.getData         // here is where you put the callback
        );
    }

    hideMenuNov = () => {
        this._menu.hide();
        this.setState(
            {
                value: 10,
                previous_balance: 0,
                from_date: new Date(new Date().getFullYear(), 10, 1).toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10),
                to_date: new Date(new Date().getFullYear(), 11, 1).toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10)
            },
            this.getData         // here is where you put the callback
        );
    }

    hideMenuDec = () => {
        this._menu.hide();
        this.setState(
            {
                value: 11,
                previous_balance: 0,
                from_date: new Date(new Date().getFullYear(), 11, 1).toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10),
                to_date: new Date(new Date().getFullYear(), 12, 1).toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10)
            },
            this.getData         // here is where you put the callback
        );
    }

    toggleOverlay = () => {
        this.setState({visible: false});
        //this.props.navigation.navigate(this.props.page);
    }

    setModalVisible = (val) => {
        this.setState({visible:val});
    }

    onscroll = (e) => {
        var total_posts      = this.state.total_data;
        var total_post_count = this.state.fulldata.length;
        var contentLength    = e.nativeEvent.contentSize.height;
        var trailingInset    = e.nativeEvent.contentInset.bottom;
        var scrollOffset     = e.nativeEvent.contentOffset.y;
        var viewportLength   = e.nativeEvent.layoutMeasurement.height;
     
        if( Math.round(viewportLength + scrollOffset) >= Math.round(contentLength)){
          if(this.state.load_more == false && total_posts != total_post_count)
            this.load_more_data();
        }
    }

    load_more_data = async() => {
        this.setState({
            load_more          : true,
            visible:false
        });
        var start     = this.state.post_page+1;
        //console.warn(start);
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('customer_id', AuthContext.id);
        formData.append('arrive_store', this.state.arrive_store);
        formData.append('from_date',  this.state.from_date);
        formData.append('to_date',  this.state.to_date);
        formData.append('transfer_status', this.state.transfer_status);
        formData.append('remaining_status', this.state.remaining_status);
        formData.append('previous_balance', this.state.previous_balance);
        formData.append('start', start);
        formData.append('length', 50);
        var Url  = AuthContext.server_url + "/Nejoum_App/generalunpaidstmt";
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
            if(response.success == 'success'){
                var old_data    = this.state.fulldata;
                var start       = start;
                var count       = response.data.length;
                for(var i = 0; i < response.data.length; i++){
                    old_data.push(response.data[i]);
                }
                if(response.data.length > 0){
                this.setState({
                    loader      : false,
                    fulldata    : response.data,
                    load_more       : false,
                    post_page       : old_data.length,
                    total_posts     : count,
                    fulldata        : old_data,
                    previous_balance : response.data[response.data.length-1].sumBalance2
                  });
                }else {
                    this.setState({
                        loader      : false,
                        fulldata    : response.data,
                        load_more       : false,
                        post_page       : old_data.length,
                        total_posts     : count,
                        fulldata        : old_data,
                      });
                }
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

      getData = async () => {
        this.setState({
            loader          : true,
            visible         : false
        });
        var date_from   = this.state.from_date;
        var date_to     = this.state.to_date;
        var Url  = "https://api.nejoumaljazeera.co/api/carStatement/shippedCarsnoAuth?customer_id="+AuthContext.id+
        "&arrived_status="+this.state.arrive_store+"&date_from="+date_from+"&date_to="+date_to+
        "&transfer_status="+this.state.transfer_status+"&remaining_status="+this.state.remaining_status;
        await fetch(Url, {
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
                if(response.shippedCars.length >0){
                    this.setState({
                        loader      : false,
                        fulldata    : response.shippedCars,
                        balance     : response.shippedCars[response.shippedCars.length-1].balance,
                        post_page   : response.shippedCars.length,
                        previous_balance : response.shippedCars[response.shippedCars.length-1].sumBalance2,
                        Previous_balanceA   : response.shippedCars[0].balance,
                        debitPrevious   : response.shippedCars[0].debit,
                        creditPrevious   : response.shippedCars[0].credit
                      });
                }else {
                    this.setState({
                        loader      : false,
                        fulldata    : response.shippedCars,
                        balance     : response.sumBalanceTotal,
                        post_page   : response.shippedCars.length,
                      });
                }
                return;
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
            from_date: '',
            to_date: '',
        }, this.getData );
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
                                <Text style={{color:'#1760B2'}}>{this.state.from_date}</Text>
                            </View>
                            <View style={{}}>
                            <FontAwesomeIcon 
                                    icon = {faArrowRight}
                                    size={20} backgroundColor="#fff" color="#0d5db8"/>
                            </View>
                            <View style={{}}>
                                <Text style={{color:'#1760B2'}}>{this.state.to_date}</Text>
                            </View>
                                <TouchableOpacity activeOpacity={1} style={{}} onPress={() => this.resetDate()}>
                                    <View >
                                        <FontAwesomeIcon 
                                            icon = {faX} size={20} color='#0d5db8' backgroundColor="#0d5db8" />
                                    </View>
                                </TouchableOpacity>
                        </View>;
        } else {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            today = yyyy + '-' + mm + '-' + dd ;
            var date_scale =  <View style={{marginLeft:'10%', flexDirection:'row', flex:1, justifyContent:'center', alignItems:'center'}}>
                                <View style={{flex:0.5}}>
                                    <Text style={{color:'#1760B2'}}>2020-01-01</Text>
                                </View>
                                <View style={{flex:0.2}}>
                                    <FontAwesomeIcon 
                                        icon = {faArrowRight} size={20} backgroundColor="#343D40" color="#343D40"/> 
                                </View>
                                <View style={{flex:0.5}}>
                                    <Text style={{color:'#1760B2'}}>{today}</Text>
                                </View>
                                    <TouchableOpacity activeOpacity={1} style={{flex:0.3}} onPress={() => this.resetDate()}>
                                        <View >
                                        <FontAwesomeIcon 
                                                icon = {faX} size={20} color='#343D40' backgroundColor="#343D40" />
                                        </View>
                                    </TouchableOpacity>
                            </View>;
        }

        return (
            <SafeAreaView style={{flex:1, backgroundColor:'#EDEDED'}}>
                    <Modal
                        backdropOpacity={0.3}
                        isVisible={this.state.visible}
                        onBackdropPress={() => this.setModalVisible(false)}
                        style={styles.contentView}>
                        <View style={styles.content}>
                        <View style={{justifyContent:'space-between', alignItems:'center', flex:1}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.whiteText2}>{strings('main.from')}</Text>
                            </View>
                            <View style={{flexDirection: "row"}}>
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
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.whiteText2}>{strings('main.to')}</Text>
                            </View>
                            <View style={{flexDirection: "row"}}>
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

                            </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={styles.whiteText2}>{strings('main.status')}</Text>
                                    </View>
                                        <RNPicker
                                            dataSource={this.state.dataStatus}
                                            dummyDataSource={this.state.dataStatus}
                                            defaultValue={false}
                                            pickerTitle={strings("main.status")}
                                            showSearchBar={true}
                                            disablePicker={false}
                                            changeAnimation={"none"}
                                            searchBarPlaceHolder={"Search....."}
                                            showPickerTitle={true}
                                            searchBarContainerStyle={styles.searchBarContainerStyle}
                                            pickerStyle={styles.pickerStyle}
                                            pickerItemTextStyle={styles.listTextViewStyle}
                                            selectedLabel={this.state.status_arrive[this.state.arrive_store]}
                                            placeHolderLabel={strings("main.status")}
                                            selectLabelTextStyle={styles.selectLabelTextStyle}
                                            placeHolderTextStyle={styles.placeHolderTextStyle}
                                            dropDownImageStyle={styles.dropDownImageStyle}
                                            selectedValue = {(index, item) => this.setState(
                                                {
                                                    arrive_store      : item.id,
                                                    data_statusname  : item.name
                                                },
                                            )
                                        }
                                        />
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={styles.whiteText2}>{strings('car.shipping')}</Text>
                                    </View>
                                    <RNPicker
                                            dataSource={this.state.dataShippping}
                                            dummyDataSource={this.state.dataShippping}
                                            defaultValue={false}
                                            pickerTitle={strings("car.shipping")}
                                            showSearchBar={true}
                                            disablePicker={false}
                                            changeAnimation={"none"}
                                            searchBarPlaceHolder={"Search....."}
                                            showPickerTitle={true}
                                            searchBarContainerStyle={styles.searchBarContainerStyle}
                                            pickerStyle={styles.pickerStyle}
                                            pickerItemTextStyle={styles.listTextViewStyle}
                                            selectedLabel={this.state.status_shipping[this.state.remaining_status]}
                                            placeHolderLabel={strings("car.shipping")}
                                            selectLabelTextStyle={styles.selectLabelTextStyle}
                                            placeHolderTextStyle={styles.placeHolderTextStyle}
                                            dropDownImageStyle={styles.dropDownImageStyle}
                                            selectedValue={(index, item) => this.setState(
                                                {
                                                    remaining_status      : item.value,
                                                    data_shipppingname  : item.name,
                                                },
                                                      // here is where you put the callback
                                            )
                                                }
                                        />
                                    
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
                <View>
                </View>
                <View style={{flexDirection:(I18n.locale=='ar')?'row-reverse':'row', justifyContent:'space-around', margin:'2%'}}>
                    <Text style={{textAlign:'center', color:'#343D40', fontSize: width*0.05 }}>{strings('car.balance1')}</Text>
                    <Text style={{textAlign:'center', color:'#a30000', fontSize: width*0.05}}>AED {this.state.balance} </Text>
                </View>
                    <View style={{flex:1, margin:'2%', borderWidth: 1, borderColor: '#707070', 
                    borderTopLeftRadius:5, borderTopRightRadius:5,
                    }}>
                        <View style={{borderTopLeftRadius:5, borderTopRightRadius:5,
                            flexDirection:'row', backgroundColor:'#013188',}}>
                            <View style={{margin:'2%', flex:0.4, justifyContent:'center', alignItems:'center'}}>
                                {
                                I18n.locale=='ar'?
                                    (
                                        <Text style={{color:'#fff', fontSize:width*0.03}}>{strings('main.date')}/{strings('main.description')}</Text>
                                    ):(
                                        <Text style={{color:'#fff', fontSize:width*0.03}}>{strings('main.description')}/{strings('main.date')}</Text>
                                    )
                                }
                            </View>
                            <View style={{flex:0.3, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:'#fff', fontSize:width*0.03}}>{strings('car.storage')}</Text>
                            </View>
                            <View style={{flex:0.3, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:'#fff', fontSize:width*0.03}}>{strings('car.unpaid2')}</Text>
                            </View>
                            <View style={{flex:0.3, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:'#fff', fontSize:width*0.03}}>{strings('car.paid')}</Text>
                            </View>
                            <View style={{flex:0.3, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:'#fff', fontSize:width*0.03}}>{strings('car.balance')}</Text>
                            </View>
                        </View>
                        <ScrollView
                            contentContainerStyle = {styles.container}>
                            {
                            (this.state.fulldata.length > 0)? this.state.fulldata.map((item,i) => {
                                
                                var obj = item.car;
                                var lotnumber = '';
                                for (var key in obj) {
                                    if (obj.hasOwnProperty(key)) {
                                        if(key == 'lotnumber'){
                                            lotnumber = obj[key];
                                        }else {
                                            lotnumber = item.description;
                                        }
                                    }
                                }
                                if(item.index === '#'){
                                    lotnumber = item.description;
                                }
                                var remain = <View></View>;
                                if(item.blance){
                                    if(parseFloat(item.blance) < 0 ){
                                        remain = <View style={{flex:0.3, justifyContent:'center', alignItems:'flex-end'}}>
                                        <Text style={{color:'#343D40', fontSize:width*0.03}}>{item.blance}</Text></View>;
                                    }else {
                                        remain = <View style={{flex:0.3, justifyContent:'center', alignItems:'flex-end'}}>
                                        <Text style={{color:'#343D40', fontSize:width*0.03}}>{item.blance}</Text></View>
                                    }
                                }
                                
                                return(
                                    <View style={{margin:'2%', flexDirection:'row', borderBottomWidth: 1, 
                                    justifyContent:'center', borderColor: '#ccc'}}>
                                        <View style={{flex:0.36, justifyContent:'center', alignItems:'center', 
                                        flexDirection:'column'}}>
                                           {
                                           (item.index === '#')?(<Text style={{fontSize: width*0.025}}>
                                               {lotnumber}</Text>):
                                           (<Text style={{color:'#1760B2', fontSize:width*0.03}}>Lot#:{lotnumber}</Text>)
                                            }
                                            <Text style={{fontSize: width*0.025, color:'#A5A5A5'}}>{item.date}</Text>
                                        </View>
                                        <View style={{flex:0.2, justifyContent:'center', alignItems:'flex-end'}}>
                                            <Text style={{color:'#343D40', fontSize:width*0.03}}>{item.storage_fine}</Text>
                                        </View>
                                        <View style={{flex:0.3, justifyContent:'center', alignItems:'flex-end'}}>
                                            <Text style={{color:'#343D40', fontSize:width*0.03}}>{item.debit}</Text>
                                        </View>
                                        <View style={{flex:0.3, justifyContent:'center', alignItems:'flex-end'}}>
                                            <Text style={{color:'#343D40', fontSize:width*0.03}}>{item.credit}</Text>
                                        </View>
                                        <View style={{flex:0.4, justifyContent:'center', alignItems:'flex-end'}}>
                                            <Text style={{color:'#343D40', fontSize:width*0.03}}>{item.balance}</Text>
                                        </View>
                                    </View>
                                )
                            }):<View></View>
                        }
                        </ScrollView></View>
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
      }
});