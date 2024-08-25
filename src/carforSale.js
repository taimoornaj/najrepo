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
  RefreshControl,
  Alert,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import  Loader  from '../components/Loader.js';
import commonStyle from '../assets/style/styles.js';
import Modal from 'react-native-modal';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import RNPicker from "search-modal-picker";
import { faArrowAltCircleDown, faArrowAltCircleUp, faChevronLeft, faSearch } from '@fortawesome/free-solid-svg-icons';

let {width, height} = Dimensions.get('window');

//function Dashboard () {
export default class CarforSale extends Component {

    constructor(props){
        super(props);
        this.state = {
            loader      : false,
            fulldata    : [],
            post_page   : 0,
            load_more   : false,
            arrays      :[],
            visible: false,
            year: [],
            yearval: '',
            makerval: '',
            modelval: '',
            all_model: [],
            loadfilter: false,
            priceOrder: 'ASC',
            modalVisible: false,
            favorite_arr: [],
            countFav : 0,
            nameModel: '',
            all_maker: [],
            start:1
          }
          this.props.navigation.setOptions({
            header: () => (
                <View style={[commonStyle.header, {flexDirection: 'row', justifyContent: 'center', alignItems:'center'}]}>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                            marginTop: height*0.05, flex:1}}>
                        <View style={{flex:0.2, justifyContent: 'center', alignItems: 'center', flexDirection:'row'}}>
                            {AuthContext.type == 2 ? (
                            <TouchableOpacity activeOpacity={1}
                                style={{flexDirection:'row'}}
                                onPress={() => this.props.navigation.reset({
                                routes: [{ name: "SignInScreen" }]
                            })}>
                                <View>
                                    <FontAwesomeIcon
                                        icon={ faChevronLeft }
                                        color="#fff"
                                        size={width*0.06}
                                    />
                                </View>
                                <Text style={commonStyle.headerText}>{strings('main.back')}</Text>
                            </TouchableOpacity>
                            ):(
                                <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.reset({
                                    routes: [{ name: "HomeDrawer" }]
                                })}
                                style={{flexDirection:'row'}}
                                >
                                    <View>
                                        <FontAwesomeIcon
                                            icon={ faChevronLeft }
                                            color="#fff"
                                            size={width*0.06}
                                        />
                                    </View>
                                    <Text style={commonStyle.headerText}>{strings('main.back')}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={{flex: 0.8, justifyContent: 'center', alignItems:'center'}}>
                            <Text style = {commonStyle.headerText}>{strings('main.SaleCars')}</Text>
                        </View>
                        <View style={{marginRight: 16, justifyContent: 'flex-start', alignItems: 'flex-end', flex: 0.2}}>
                        {AuthContext.type == 2 ? (
                            <View></View>
                            ):(
                            <TouchableOpacity activeOpacity={1} onPress={() =>
                            this.props.navigation.navigate("bookmarksCars", {'refresh': this.state.countFav})}>
                                    <Image
                                        resizeMode= {"contain"}
                                        style={styles.iconstyleHeader}
                                        source={require('../assets/favor.png')}/>
                            </TouchableOpacity>
                        )}
                        </View></View>
                </View>
          )

          });
    }

    componentDidMount() {
        this.getData();
        this.getYear();
        this.getMaker();
        this.props.navigation.setParams({
            refresh: this.state.favorite_arr.length,
        });
    }

    componentDidUpdate(prevProps){
        if(prevProps.route.params && this.props.route.params){
            if (this.props.route.params.refresh !== prevProps.route.params.refresh) {
                console.warn('This '+this.props.route.params.refresh);
                console.warn('before '+prevProps.route.params.refresh);
                
                this.setState({
                    loader      : true,
                    fulldata    : []
                },() => {
                    this.getData();
                });
                //this.getData();
            }
        }
    }
    
      
    toggleOverlay = () => {
        this.setState({visible: false});
    }

    closeModal(){
        this.setState({modalmsg: false});
        this.props.navigation.navigate(this.props.page);
    }

    getData = async() => {
        this.setState({
            loader          : true,
            visible: false
          });
        var start     = this.state.start;
        if (AuthContext.id){
            var Url = "https://api.nejoumaljazeera.co/api/CarsForSale?customer_id="+AuthContext.id+"&page="+start+"&per_page=40"+
            "&year="+this.state.yearval+"&maker="+this.state.makerval+"&model="+this.state.modelval;
        }else {
            var Url = "https://api.nejoumaljazeera.co/api/CarsForSale?per_page="+40+"&page="+start+
            "&year="+this.state.yearval+"&maker="+this.state.makerval+"&model="+this.state.modelval;
        }
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
            if(response.data){
                var fav = this.state.favorite_arr;
                if(response.newfavorite_arr.length > 0){
                    fav = [];
                    response.newfavorite_arr.map( ( item )=> {
                        fav.push(item.car_id);
                    });
                }else{
                    fav = [];
                }
                //console.warn(fav.length);
                this.props.navigation.setParams({
                    refresh: fav.length,
                });

                this.setState({
                    loader      : false,
                    fulldata    : response.data,
                    post_page   : response.data.length,
                    favorite_arr: fav, 
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

    getYear = () => {
        var Url = "https://api.nejoumaljazeera.co/api/getYear";
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
                this.setState({
                    year        : response.data   
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
            Alert.alert('Error', error, [
                {text: 'Okay'}
            ]);
        });  
    }

    getMaker = () => {
        var Url = "https://api.nejoumaljazeera.co/api/getMaker";
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
                this.setState({
                    all_maker: response.data,  
                  });
                return;
            }
            else{
                this.setState({
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
                error_message    : error  
            });
            Alert.alert('Error', 'Connection Error', [
                {text: 'Okay'}
            ]);
        });  
    }

    _selectedValue(index, item) {
        this.setState({ selectedText: item.name });
    }

    getyearMaker = (itemValue) => {
        this.setState({
            loadfilter          : true,
            yearval      : itemValue
          });
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('year', itemValue);
        var Url  = AuthContext.server_url + "/Nejoum_App/getMaker";
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
                    loadfilter      : false,
                    all_maker    : response.data,
                  });
                return;
            }
            else{
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

    changestatusmaker = () => {
        //this.setState({makerval: ''});
        //this.getData();
        this.setState(
            {
                makerval: ''
            },
            this.getData         // here is where you put the callback
        );
    }

    changestatusmodel = () => {
        //this.setState({modelval: ''});
        //this.getData();
        this.setState(
            {
                modelval: ''
            },
            this.getData         // here is where you put the callback
        );
    }

    changestatusyear = () => {
        //this.setState({yearval: ''});
        //this.getData();
        this.setState(
            {
                yearval: ''
            },
            this.getData         // here is where you put the callback
        );
    }

    changestatusprice = (value) => {
        //this.setState({priceOrder: value});
        //this.getData();
        this.setState(
            {
                priceOrder: value
            },
            this.getData         // here is where you put the callback
        );
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
        formData.append('year', this.state.yearval);
        var Url  = AuthContext.server_url + "/Nejoum_App/getModel";
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
                    loadfilter      : false,
                    all_model    : response.data,
                  });
                return;
            }
            else{
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


    addtoFav = (index, item) => {
        this.setState({
            loader          : false,
          });
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('car_id', item.car_id);
        formData.append('local_shipped', item.local_shipped);
        formData.append('car_year', item.car_year);
        formData.append('carModelName', item.carModelName);
        formData.append('carMakerName', item.carMakerName);
        formData.append('lotnumber', item.lotnumber);
        formData.append('vin', item.vin);
        formData.append('price', item.price);
        formData.append('customer_id', AuthContext.id);
        var Url  = AuthContext.server_url + "/Nejoum_App/addtoFavorit";
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
                var fav = this.state.favorite_arr;
                fav.push(item.car_id);
                this.setState({
                    loader      : false,
                    favorite_arr    : fav,
                    countFav:   fav.length  
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

    setModalVisible = (val) => {
        this.setState({visible:val});
    }
    
  load_more_data = async() => {
    this.setState({load_more:true});
    var start     = this.state.post_page;
    var Url = "https://api.nejoumaljazeera.co/api/CarsForSale?customer_id="+AuthContext.id+"per_page=40&page="+this.state.post_page+
    "&year="+this.state.yearval+"&maker="+this.state.makerval+"&model="+this.state.modelval;
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
        if(response.success == 'success'){
            var old_data    = this.state.fulldata;
            var start       = start;
            var count       = response.data.length;
            for(var i = 0; i < response.data.length; i++){
                old_data.push(response.data[i]);
            }
            var fav = this.state.favorite_arr;
            if(response.newfavorite_arr.length > 0){
                fav = [];
                response.newfavorite_arr.map( ( item )=> {
                    fav.push(item.car_id);
                });
            }
            this.setState({
                load_more       : false,
                post_page       : old_data.length,
                total_posts     : count,
                fulldata        : old_data,
                favorite_arr    : fav,
                countFav        : fav.length
            }); 
        }
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

  
    _refreshList = async() => {
        this.setState({
          loader  : true,
        });
        var start     = 1;
        var Url = "https://api.nejoumaljazeera.co/api/CarsForSale?customer_id="+AuthContext.id+"per_page=40&page="+start+
        "&year="+this.state.yearval+"&maker="+this.state.makerval+"&model="+this.state.modelval;
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
            if(response.success == 'success'){
                var fav = this.state.favorite_arr;
                if(response.newfavorite_arr.length > 0){
                    fav = [];
                    response.newfavorite_arr.map( ( item )=> {
                        fav.push(item.car_id);
                    });
                }
                this.setState({
                    loader      : false,
                    fulldata    : response.data,
                    favorite_arr    : fav,
                    countFav:   fav.length    
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
                error_message    : 'error'   
            });
            Alert.alert('Error', 'Error Occured', [
                {text: 'Okay'}
            ]);
        });
    }


    render(){
        
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
        
        if(this.state.load_more){
            var load_more = <View style={{backgroundColor:'transparent', flex:1, justifyContent:'center', alignItems:'center'}}>
                                <Image source={require("../assets/loadingapp.gif")}
                                    style={{justifyContent:'center', width:50, height:50, alignItems:'center', flex:0.2}}
                                    resizeMode="contain">
                                </Image>
                            </View>;
          }
          else{
            var load_more = [];
          }
 
        if(this.state.loader){
            return(
                <View>
                    <Loader loader={this.state.loader}></Loader>
                </View>
                
            );
        }
        

        if(this.state.year){
            const dataYear = [];
            this.state.year.map((item,i) => {
                var name = (item).toString();
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
                    placeHolderLabel={strings("main.year")}
                    selectLabelTextStyle={styles.selectLabelTextStyle}
                    placeHolderTextStyle={styles.placeHolderTextStyle}
                    dropDownImageStyle={styles.dropDownImageStyle}
                    selectedValue={(index, item) => this.getyearMaker(item.name)}
                />
        }else{
            var year_pickers = <View></View>;
        }

        if(this.state.all_maker){
            const dataMaker = [];
            this.state.all_maker.map((item,i) => {
                dataMaker.push({
                    id: item.id_car_make,
                    name:  item.name + '('+item.total+')'
                })
            });
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
                    placeHolderLabel={strings("main.maker")}
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
                    id: item.id_car_model,
                    name:  item.name + '('+item.total+')'
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
                    placeHolderLabel={strings("main.model")}
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
              if(res){
                <Text style={commonStyle.textwhite}>{res.name}</Text>		                
                var maker_filter_btn = <TouchableOpacity activeOpacity={1} style={{borderWidth: 2, 
                    borderColor: '#0d5db8', backgroundColor:'#0d5db8', borderRadius:25, padding: 10}} 
                    onPress={() => this.changestatusmaker()}>
                            <Text style={commonStyle.textwhite}>{res.name}</Text>
                        </TouchableOpacity>
              }else{
                var maker_filter_btn = <TouchableOpacity activeOpacity={1} style={{borderWidth: 2,
                 borderColor: '#0d5db8', borderRadius:25, padding: 10}}>
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

        var secondFilter = '';
        if(this.state.modelval != '' || this.state.makerval != '' || this.state.yearval != '') {
            secondFilter =    <View style={{flexDirection:'row', backgroundColor: '#fff', justifyContent:'space-between', padding: 10}}>
                    {year_filter_btn}
                    {maker_filter_btn}
                    {model_filter_btn}
                </View>
        } else {
            secondFilter = <View></View>
        }

        if(this.state.priceOrder == 'ASC'){
            var orderPrice = <TouchableOpacity activeOpacity={1} style={{justifyContent: 'flex-start',
            flexDirection:'row', alignItems: 'flex-start'}} 
                                onPress={() => this.changestatusprice('DESC') }>
                                    <FontAwesomeIcon
                                        icon={ faArrowAltCircleDown }
                                        color="#fff"
                                        size={width*0.06}
                                    />
                            </TouchableOpacity>;
        }
        else if(this.state.priceOrder == 'DESC') {
            var orderPrice = <TouchableOpacity activeOpacity={1} style={{justifyContent: 'flex-start',
            flexDirection:'row', alignItems: 'flex-start'}} 
                                onPress={() => this.changestatusprice('ASC') }>
                                <FontAwesomeIcon
                                    icon={ faArrowAltCircleUp }
                                    color="#fff"
                                    size={width*0.06}
                                />
                            </TouchableOpacity>;
        }

        return (
            <SafeAreaView style={{flex:1, backgroundColor:'#EDEDED'}}>
                <View style = {{flexDirection:'row', backgroundColor: '#343D40', marginBottom:'3%'}}>
                    <View style = {{flex: 1, flexDirection:'row', justifyContent:'space-between'}}>
                        <View style={{flexDirection: 'row',flex:1, justifyContent:'center', alignItems:'center'}}>
                            <View style={{justifyContent: 'center', flex: 0.1, flexDirection:'row',
                                alignItems: 'center'}}>
                                {orderPrice}
                            </View>
                            <View style={{justifyContent: 'center', alignContent:'center', alignItems:'center', flex: 0.25, 
                            flexDirection:'row', margin:'1%' }}>
                                {year_pickers}
                            </View>
                            <View style={{justifyContent: 'center', alignItems:'center', flex: 0.25, flexDirection:'row',margin:'1%' }}>
                                {maker_pickers}
                            </View>
                            <View style={{justifyContent: 'flex-start', flex: 0.25, flexDirection:'row'}}>
                                {model_pickers}
                            </View>
                            <TouchableOpacity style={{
                                backgroundColor:'#fff', flex:0.1,
                                flexDirection:'row', justifyContent: 'center', marginLeft:'5%',
                                alignItems: 'center', padding:'2%', borderRadius:5}}
                                onPress={() => this.getData()}>
                                <View>
                                    <FontAwesomeIcon
                                        icon={ faSearch }
                                        color="#0d5db8"
                                        size={width*0.05}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                
                {secondFilter}
                
                <View style={styles.container}>
                    <Modal
                        backdropOpacity={0.3}
                        isVisible={this.state.visible}
                        onBackdropPress={() => this.setModalVisible(false)}
                        style={styles.contentView}>
                        <View style={styles.content}>
                                <View style={{justifyContent:'space-between', alignItems:'center', flex:1}}>
                                    <View style={{flexDirection: "row"}}>
                                            {year_pickers}
                                    </View>
                                    <View style={{flexDirection: "row"}}>
                                            {maker_pickers}
                                    </View>
                                    <View style={{flexDirection: "row"}}>
                                            {model_pickers}
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent:'center', alignItems:'center'}}>
                                    {loadfilter}
                                </View>
                                <TouchableOpacity activeOpacity={1}  style={commonStyle.submitbutton}
                                    onPress={() => this.getData()}>
                                        <Text style={commonStyle.buttonText}>
                                                {strings('main.search')}        
                                        </Text>
                                </TouchableOpacity>
                        </View>
                    </Modal>
                </View>

            <ScrollView
             contentContainerStyle = {styles.container}
             onScroll={(e)=>this.onscroll(e)}
             refreshControl={
               <RefreshControl
                 onRefresh={() => this._refreshList()}
                 refreshing={this.state.refreshing}
                 colors={['#13365d']}
               />
             }
            >
            <View style={{flex:1, marginBottom:height*0.065}}>
                <View style={{flexWrap:'wrap', justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
                    {
                        (this.state.fulldata.length > 0)? this.state.fulldata.map((item,i) => {
                        var carImage = item.photos;
                        var addtoFav = <View></View>;
                        if(AuthContext.type == 2 ){
                            addtoFav = <View></View>;
                        }else {
                            if(this.state.favorite_arr.length > 0){
                                if(this.state.favorite_arr.includes(item.car_id)){
                                    addtoFav =  <TouchableOpacity  activeOpacity={1} 
                                                style={{ width: 20, height: 20, position: 'absolute', justifyContent:'center', alignItems:'center',
                                                left: -20, backgroundColor:'#ccc', borderRadius: 4 }}>  
                                                    <Image
                                                        style={commonStyle.iconstyle}
                                                        source={require('../assets/fillStar.png')}
                                                    />
                                                </TouchableOpacity>;
                                }else {
                                    addtoFav =  <TouchableOpacity activeOpacity={1} onPress = {() => this.addtoFav(i, item)} 
                                                style={{ width: 20, height: 20, left: -20, backgroundColor:'#ccc', justifyContent:'center', alignItems:'center',
                                                position: 'absolute',borderRadius: 4 }}>  
                                                    <Image
                                                        style = {commonStyle.iconstyle}
                                                        source = {require('../assets/emptyStar.png')}
                                                    />
                                                </TouchableOpacity>;
                                }
                            }else {
                                addtoFav =  <TouchableOpacity activeOpacity={1} onPress = {() => this.addtoFav(i, item)} 
                                                style={{ width: 20, height: 20, left: -20, backgroundColor:'#ccc', justifyContent:'center', alignItems:'center',
                                                position: 'absolute',borderRadius: 4 }}>  
                                                    <Image
                                                        style={commonStyle.iconstyle}
                                                        source={require('../assets/emptyStar.png')}
                                                    />
                                            </TouchableOpacity>;
                            }
                           
                        }
                            
                       
                        return(
                            <View style={{margin:'1%', marginTop:'4%', width: '45%', height: height*0.25, backgroundColor: '#fff',
                           borderWidth:1, borderColor:'#343D40',
                           borderRadius:15, padding:'2%'}}>
                                <TouchableOpacity activeOpacity={1} style={{flex:1}}
                                        onPress = {() => this.props.navigation.navigate('carforSaleSlider',
                                         {'gdata': item, 'data': item.photo})} key={i}>
                                        <View style = {{ flexDirection: "row",flex: 1,}}>
                                            <View style = {{ width: '100%', height: height*0.15, flexDirection: 'row', flex: 1}}>
                                                <Image
                                                    style = {styles.image2}
                                                    source = {{uri: carImage}}
                                                />
                                            </View>
                                            <View>
                                                {addtoFav}
                                            </View>
                                        </View>
                                        <View style = {{ backgroundColor: '#fff',  justifyContent: 'center', alignItems:'flex-start' }}>
                                                <Text style = {[commonStyle.normalgreyTextlabelCarSell, {color: '#343D40', fontWeight:'bold'}]}>{item.car_year} {item.carMakerName} {item.carModelName}</Text>
                                                <Text style = {[commonStyle.normalgreyTextlabelCarSell, {color: '#005FB7'}]}>
                                                    Lot # {item.lotnumber}
                                                </Text>
                                                <Text style = {commonStyle.normalgreyTextlabelCarSell}>
                                                    Vin : {item.vin}
                                                </Text>
                                        </View>
                                        <View style = {{justifyContent:'space-between'}}>
                                            <Text style = {[commonStyle.normalgreyTextlabelCarSell,{color: 'green',
                                                fontWeight:'bold',  alignItems:'flex-start'}]}>
                                                AED {Number((parseInt(item.price)).toFixed(2)).toLocaleString('en') }
                                            </Text>
                                        </View>
                                </TouchableOpacity>        
                            </View>
                        )
                        }):<View><Text>No data</Text></View>
                    } 
                    </View>
                    {load_more}
                        </View>
            </ScrollView>
            </SafeAreaView>

            
        )
        
    }
}

//export default Dashboard



const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
     linearGradient: {
         flex: 1,
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
         resizeMode: "cover",
         justifyContent: "center"
     }, 
     iconstyle: {
         resizeMode: "cover",
         justifyContent: "center",
         width: 20,
         height: 20
     },
     iconstyleHeader:{
         resizeMode: "contain",
         justifyContent: "center",
         width: 40,
         height: 40
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
     imgBackground: {
         flex: 1,
         width: '100%',
         resizeMode: "cover",
         justifyContent: "center"
     },
     textwhite: {
         color: '#fff',
         fontSize: width*0.03,
         textAlign: 'left'
     }, textSmallwhite: {
         color: '#fff',
         fontSize: 8,
         textAlign: 'left',
     },textBlue: {
         color: '#0d5db8',
         fontSize: width*0.04,
         textAlign: 'left',
     }, 
     textBlue2: {
         color: '#0d5db8',
         fontSize: width*0.04,
         textAlign: 'left',
     }, 
     image2: {
         flex:1,
         resizeMode: "cover",
         borderRadius:10
     },fab: {
         position: 'absolute',
         margin: 16,
         right: 0,
         zIndex: 1000,
         backgroundColor: '#1c3e64',
         bottom: height-650,
     },
     overlaystyle: {
         flex: 0.5,
         width: '100%',
         height: '100%',
         justifyContent: 'center',
         backgroundColor: '#434484',
         opacity: 0.9,
         borderTopLeftRadius: 150,
         position: 'absolute',
         left:0,
         right:0,
         top: height-550,
         height: height-400
     },
     modals: {
         width: 300,
         height: 200,
         flex: 0.3,
         borderBottomLeftRadius: 20,
         borderRadius: 25,
         justifyContent: 'center',
         alignItems: 'center'
     },
 
     content: {
         flex:0.4,
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
         flexDirection: "row",
         fontSize:width*0.03
       },
       placeHolderTextStyle: {
         color: "#D3D3D3",
         padding: 10,
         textAlign: "left",
         width: "99%",
         flexDirection: "row",
         fontSize:width*0.03
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
         textAlign: "left",
       },
    pickerStyle: {
        marginLeft: 18,
        paddingRight: 25,
        marginRight: 10,
        marginBottom: 2,
        borderWidth:1,
        backgroundColor: "rgba(255,255,255,1)",
        borderRadius: 5,
        flexDirection: "row"
    }
});