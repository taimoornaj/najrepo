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
  TextInput,
  ImageBackground,
  TextComponent,
  Dimensions,
  SafeAreaView,
  Button,
  KeyboardAvoidingView
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-elements';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import I18n from 'react-native-i18n';
import commonStyle from '../assets/style/styles.js';
import RNPicker from "search-modal-picker";
import DatePicker from 'react-native-datepicker';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCloudArrowDown } from '@fortawesome/free-solid-svg-icons';
import Loader from '../components/Loader.js';
import DateTimePicker from '@react-native-community/datetimepicker';

const {width, height} = Dimensions.get('window'); 
const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


/** 
const dataStatus = [{
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
}];

const dataShippping = [{
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
}];

const dataTransfer = [{
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
}];**/


//function Dashboard () {
export default class AboutCompany extends Component {

    constructor(props){
        super(props);
        var x = new Date();
        x.setDate(1);
        x.setMonth(x.getMonth()-1);
        //console.log(x.toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10));
        //console.log('hi');
        this.state = {
            loader          : false,
            fulldata        : [],
            post_page       : 0,
            load_more       : false,
            arrays          : [],
            data_status     : 2,
            data_shippping  : 0,
            data_transfer   : 0,
            username: AuthContext.userName,
            check_emailInputChange: true,
            data_shipppingname: strings('car.all'),
            data_transfername: strings('car.all'),
            data_statusname : strings('car.all'),
            //from_date: new Date("2020-01-01"),
            from_date: x,
            to_date: new Date(),
            mode: 'date',
            show: false,
            date: new Date(1598051730000),
            dateOrTimeValue: new Date(),
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
            }],
            
             dataTransfer : [{
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
    }

     timeout = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    downloadFileOnSuccess = async () => {
        if ( this.state.username.length == 0) {
            this.setState({
                loader: false,
                error_message: strings('main.email_not_valid'),
            });
            Alert.alert('Wrong Input!', strings('main.email_not_valid'), [
                {text: 'Okay'}
            ]);
            return;
        }

        if(!pattern.test(String(this.state.username).toLowerCase())) {
            this.setState({
                loader: false,
                error_message: strings('main.email_not_valid'),
            });
            Alert.alert('Wrong Input!', strings('main.email_not_valid'), [
                {text: 'Okay'}
            ]);
            return;
        }

        
        this.setState({loader: true});
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('customer_id', AuthContext.id);
        formData.append('from_date',  this.state.from_date.toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10));
        formData.append('to_date',  this.state.to_date.toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10));
        formData.append('transfere', this.state.data_transfer);
        formData.append('shipping', this.state.data_shippping);
        formData.append('email', this.state.username);
        formData.append('status', this.state.data_status);
        var Url  = AuthContext.server_url + "/Nejoum_App/getStatementForPrintPage";
        
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
            //console.warn(response);
            this.setState({
                loader      : false,
            });
            Alert.alert(strings('main.note'), strings('main.email_sent'), [
                {text: 'Okay'}
            ]);
            return;
            if(response.success == 'success'){
               
                this.setState({
                    loader      : false,
                });
                Alert.alert(strings('main.note'), strings('main.email_sent'), [
                    {text: 'Okay'}
                ]);
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
            });
            Alert.alert(strings('main.note'), strings('main.email_sent'), [
                {text: 'Okay'}
            ]);
            return;
        });  

        
        this.setState({
            loader      : false,
        });
        Alert.alert(strings('main.note'), strings('main.email_sent'), [
            {text: 'Okay'}
        ]);
        return;
    };

    showMode = (currentMode) => {
        this.setState({
            show: true,
            mode: currentMode
        });
        //setShow(true);
        //setMode(currentMode);
    };

    textemailChange = (val) => {
        if( pattern.test(String(val).toLowerCase()) ) {
            this.setState({
                username: val,
                check_emailInputChange: true
            });
        } else {
            this.setState({
                username: val,
                check_emailInputChange: false
            });
        }
    }
    
    showDatepicker = () => {
        this.setState({mode: 'date'});
        //showMode('date');
    };
    
    showTimepicker = () => {
        //showMode('time');
        this.setState({mode: 'time'});
    };

    onChange = (event, selectedDate) => {
        // || this.state.date
        const currentDate = selectedDate;
        //setShow(Platform.OS === 'ios');
        this.setState({date: currentDate});
    };

    render(){
        const from_date = this.state.from_date;
        const to_date = this.state.to_date;
        if(this.state.loader){
            return(
                <Loader loader={this.state.loader}></Loader>
            );
        }

        return (
            <View style={{ flex: 1 }}>
               <View style={commonStyle.backgroundimage}>
                 <SafeAreaView style={commonStyle.marginGlobaleless}> 
            <ScrollView contentContainerStyle={{ flexGrow: 1}}>
                    <View style={{ flex:1}}>

                    <View style={{height: height*0.1, marginTop: '2%'}}>
                            <View style={{flex:1, alignItems: "flex-end", justifyContent: 'flex-end', marginRight: '5%', marginLeft: '5%'}}>
                                <LinearGradient colors = {['#0d5bb4','#0c51a1']} style={styles.numbergradient}>
                                    <View style={{flexDirection: "row"}}>
                                        <View  style={{flex:1, alignItems: "center", justifyContent: 'center'}}>
                                            <Text style={{color: "white", fontSize: I18n.locale=='ar'?15:15, }}>
                                                {strings('main.email')}
                                            </Text>
                                        </View>
                                    </View>
                                </LinearGradient>
                                <View style={{flexDirection: "row",flex:1 , width: '100%',
                                        borderTopLeftRadius: 25,
                                        alignItems: "center", backgroundColor: '#fff',
                                        borderBottomRightRadius: 25,
                                        justifyContent:'center',
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 12,
                                        },shadowOpacity: 0.58,  elevation: 5, shadowRadius: 20.00}}>
                                            {/** <Text>{this.state.to_date.toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10)}</Text>**/}
                                                <TextInput 
                                                    placeholder={strings('main.email')}
                                                    style={styles.textInput}
                                                    autoCapitalize="none"
                                                    value={this.state.username}
                                                    onChangeText={(val) => this.textemailChange(val)}
                                                />
                                            { this.state.check_emailInputChange ? null : 
                                                <Animatable.View animation="fadeInLeft" duration={500}>
                                                <Text style={styles.errorMsg}>{strings('main.email_not_valid')}</Text>
                                                </Animatable.View>
                                            }
                                </View>
                            </View>
                        </View>

                        <View  style={{height: height*0.1, marginTop: '2%',}}>
                            <View style={{flex:1, alignItems: "flex-end", justifyContent: 'flex-end', marginRight: '5%', marginLeft: '5%'}}>
                                <LinearGradient colors = {['#0d5bb4','#0c51a1']} style={styles.numbergradient}>
                                    <View style={{flexDirection: "row"}}>
                                        <View  style={{flex:1, alignItems: "center", justifyContent: 'center'}}>
                                            <Text style={{color: "white", fontSize: I18n.locale=='ar'?15:15}}>
                                                {strings('main.status')}
                                            </Text>
                                        </View>
                                    </View>
                                </LinearGradient>
                                <View style = {{flexDirection: "row",flex:1 , width: '100%',
                                    borderTopLeftRadius: 25,
                                    alignItems: "center", backgroundColor: '#fff',
                                    borderBottomRightRadius: 25,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 12,
                                    },shadowOpacity: 0.58,  elevation: 5, shadowRadius: 20.00,}}>
                                        <RNPicker
                                            dataSource={this.state.dataStatus}
                                            dummyDataSource={this.state.dataStatus}
                                            defaultValue={true}
                                            pickerTitle={strings("main.status")}
                                            showSearchBar={true}
                                            disablePicker={false}
                                            changeAnimation={"none"}
                                            searchBarPlaceHolder={"Search....."}
                                            showPickerTitle={true}
                                            searchBarContainerStyle={styles.searchBarContainerStyle}
                                            pickerStyle={styles.pickerStyle}
                                            pickerItemTextStyle={styles.listTextViewStyle}
                                            selectedLabel={this.state.data_statusname}
                                            placeHolderLabel={strings("main.status")}
                                            selectLabelTextStyle={styles.selectLabelTextStyle}
                                            placeHolderTextStyle={styles.placeHolderTextStyle}
                                            dropDownImageStyle={styles.dropDownImageStyle}
                                            selectedValue = {(index, item) => this.setState(
                                                {
                                                    data_status      : item.id,
                                                    data_statusname  : item.name
                                                },
                                            )
                                        }
                                        />
                                </View>
                            </View>
                        </View>
                        
                        <View style={{height: height*0.1, marginTop: '2%'}}>
                            <View style={{flex:1, alignItems: "flex-end", justifyContent: 'flex-end', marginRight: '5%', marginLeft: '5%'}}>
                                <LinearGradient colors = {['#0d5bb4','#0c51a1']} style={styles.numbergradient}>
                                    <View style={{flexDirection: "row"}}>
                                        <View  style={{flex:1, alignItems: "center", justifyContent: 'center'}}>
                                            <Text style={{color: "white", fontSize: I18n.locale=='ar'?15:15, }}>
                                                {strings('car.shipping')}
                                            </Text>
                                        </View>
                                    </View>
                                </LinearGradient>
                                <View style={{flexDirection: "row",flex:1 , width: '100%',
                                    borderTopLeftRadius: 25,
                                    alignItems: "center", backgroundColor: '#fff',
                                    borderBottomRightRadius: 25,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 12,
                                    },shadowOpacity: 0.58,  elevation: 5, shadowRadius: 20.00,}}>
                                        <RNPicker
                                            dataSource={this.state.dataShippping}
                                            dummyDataSource={this.state.dataShippping}
                                            defaultValue={true}
                                            pickerTitle={strings("car.shipping")}
                                            showSearchBar={true}
                                            disablePicker={false}
                                            changeAnimation={"none"}
                                            searchBarPlaceHolder={"Search....."}
                                            showPickerTitle={true}
                                            searchBarContainerStyle={styles.searchBarContainerStyle}
                                            pickerStyle={styles.pickerStyle}
                                            pickerItemTextStyle={styles.listTextViewStyle}
                                            selectedLabel={this.state.data_shipppingname}
                                            placeHolderLabel={strings("car.shipping")}
                                            selectLabelTextStyle={styles.selectLabelTextStyle}
                                            placeHolderTextStyle={styles.placeHolderTextStyle}
                                            dropDownImageStyle={styles.dropDownImageStyle}
                                            selectedValue={(index, item) => this.setState(
                                                {
                                                    data_shippping      : item.value,
                                                    data_shipppingname  : item.name,
                                                },
                                                       // here is where you put the callback
                                            )
                                                }
                                        />
                                </View>
                            </View>
                        </View>
                        <View  style={{height: height*0.1, marginTop: '2%'}}>
                            <View style={{flex:1, alignItems: "flex-end", justifyContent: 'flex-end', marginRight: '5%', marginLeft: '5%'}}>
                                <LinearGradient colors = {['#0d5bb4','#0c51a1']} style={styles.numbergradient}>
                                    <View style={{flexDirection: "row"}}>
                                        <View  style={{flex:1, alignItems: "center", justifyContent: 'center'}}>
                                            <Text style={{color: "white", fontSize: I18n.locale=='ar'?15:15, }}>
                                                {strings('main.transfer')}
                                            </Text>
                                        </View>
                                    </View>
                                </LinearGradient>
                                <View style={{flexDirection: "row",flex:1 , width: '100%',
                                    borderTopLeftRadius: 25,
                                    alignItems: "center", backgroundColor: '#fff',
                                    borderBottomRightRadius: 25,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 12,
                                    },shadowOpacity: 0.58,  elevation: 5, shadowRadius: 20.00,}}>
                                        <RNPicker
                                            dataSource={this.state.dataTransfer}
                                            dummyDataSource={this.state.dataTransfer}
                                            defaultValue={true}
                                            pickerTitle={strings("main.transfer")}
                                            showSearchBar={true}
                                            disablePicker={false}
                                            changeAnimation={"none"}
                                            searchBarPlaceHolder={"Search....."}
                                            showPickerTitle={true}
                                            searchBarContainerStyle={styles.searchBarContainerStyle}
                                            pickerStyle={styles.pickerStyle}
                                            pickerItemTextStyle={styles.listTextViewStyle}
                                            selectedLabel={this.state.data_transfername}
                                            placeHolderLabel={strings("main.transfer")}
                                            selectLabelTextStyle={styles.selectLabelTextStyle}
                                            placeHolderTextStyle={styles.placeHolderTextStyle}
                                            dropDownImageStyle={styles.dropDownImageStyle}
                                            selectedValue={(index, item) => this.setState(
                                                {
                                                    data_transfer      : item.value,
                                                    data_transfername  : item.name,
                                                },
                                                // here is where you put the callback
                                            )
                                                }
                                        />
                                </View>
                            </View>
                        </View>

                        <View  style={{height: height*0.1, marginTop: '2%'}}>
                            <View style={{flex:1, alignItems: "flex-end", justifyContent: 'flex-end', marginRight: '5%', marginLeft: '5%'}}>
                                <LinearGradient colors = {['#0d5bb4','#0c51a1']} style={styles.numbergradient}>
                                    <View style={{flexDirection: "row"}}>
                                        <View  style={{flex:1, alignItems: "center", justifyContent: 'center'}}>
                                            <Text style={{color: "white", fontSize: I18n.locale=='ar'?15:15, }}>
                                                {strings('main.from')}
                                            </Text>
                                        </View>
                                    </View>
                                </LinearGradient>
                                <View style={{flexDirection: "row",flex:1 , width: '100%',
                                    borderTopLeftRadius: 25,
                                    alignItems: "center", backgroundColor: '#fff',
                                    borderBottomRightRadius: 25,
                                    justifyContent:'center',
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 12,
                                    },shadowOpacity: 0.58,  elevation: 5, shadowRadius: 20.00}}>
                                        {/**<Text>{this.state.from_date.toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10)}</Text>**/}
                                    <DateTimePicker
                                        mode={"date"} // THIS DOES NOT WORK ON ANDROID. IT DISPLAYS ONLY A DATE PICKER.
                                        display='default' // Android Only  
                                        is24Hour={false} // Android Only 
                                        value={from_date}
                                        readonly
                                        style={{flex:0.4, alignItems:'center',justifyContent:'center',alignContent:'center',
                                        alignSelf:'center', backgroundColor: "white"}}
                                        onChange={(event, value) => {
                                            this.setState({
                                                from_date: value,
                                                dateTimePickerVisible: Platform.OS === 'ios' ? true : false,
                                            });
                
                                            if (event.type === "set")
                                                console.log("value:" , value);
                                        }}
                                    />
                                </View>
                            {/**<View style={{flexDirection: "row",flex:1 , width: '100%',
                                    borderTopLeftRadius: 25,
                                    alignItems: "center", backgroundColor: '#fff',
                                    borderBottomRightRadius: 25,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 12,
                                    },shadowOpacity: 0.58,  elevation: 5, shadowRadius: 20.00,}}>
                                    <DatePicker
                                        style={{width: '97%'}}
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
                            </View>**/}
                        </View></View>
                        
                        <View style={{height: height*0.1, marginTop: '2%'}}>
                            <View style={{flex:1, alignItems: "flex-end", justifyContent: 'flex-end', marginRight: '5%', marginLeft: '5%'}}>
                                <LinearGradient colors = {['#0d5bb4','#0c51a1']} style={styles.numbergradient}>
                                    <View style={{flexDirection: "row"}}>
                                        <View  style={{flex:1, alignItems: "center", justifyContent: 'center'}}>
                                            <Text style={{color: "white", fontSize: I18n.locale=='ar'?15:15, }}>
                                                {strings('main.to')}
                                            </Text>
                                        </View>
                                    </View>
                                </LinearGradient>
                            {/**<View style={{flexDirection: "row",flex:1 , width: '100%',
                                    borderTopLeftRadius: 25,
                                    alignItems: "center", backgroundColor: '#fff',
                                    borderBottomRightRadius: 25,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 12,
                                    },shadowOpacity: 0.58,  elevation: 5, shadowRadius: 20.00}}>
                                    <DatePicker
                                        style={{width: '97%'}}
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
                            </View>**/}
                            <View style={{flexDirection: "row",flex:1 , width: '100%',
                                    borderTopLeftRadius: 25,
                                    alignItems: "center", backgroundColor: '#fff',
                                    borderBottomRightRadius: 25,
                                    justifyContent:'center',
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 12,
                                    },shadowOpacity: 0.58,  elevation: 5, shadowRadius: 20.00}}>
                                        {/** <Text>{this.state.to_date.toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10)}</Text>**/}
                                    <DateTimePicker
                                        mode={"date"} // THIS DOES NOT WORK ON ANDROID. IT DISPLAYS ONLY A DATE PICKER.
                                        display='default' // Android Only  
                                        is24Hour={false} // Android Only 
                                        value={to_date}
                                        style={{flex:0.4, alignItems:'center',justifyContent:'center',alignContent:'center',
                                        alignSelf:'center', backgroundColor: "white"}}
                                        onChange={(event, value) => {
                                            this.setState({
                                                to_date: value,
                                                dateTimePickerVisible: Platform.OS === 'ios' ? true : false,
                                            });
                
                                            if (event.type === "set")
                                                console.log("value:" , value);
                                        }}
                                    />
                            </View>
                            
                            </View>
                        </View>

                       
                        <View style = {{flexDirection: 'row', flex:1, justifyContent:'center'}}>
                            <TouchableOpacity activeOpacity={1} onPress={() => this.downloadFileOnSuccess()}
                             style={[commonStyle.submitbutton, {flex:0.5, justifyContent: 'center', alignItems:'center'}]}>
                                <FontAwesomeIcon
                                    icon = { faCloudArrowDown } size = {width*0.06} color="#fff"/>
                                <Text style={commonStyle.buttonText}>{strings('main.download')}</Text>
                            </TouchableOpacity>
                            {/**<TouchableOpacity activeOpacity={1} onPress={this.calculateShipping}
                             style={[commonStyle.submitbutton, {flex:0.5, justifyContent: 'center', alignItems:'center',
                              }]}>
                                <Feather name="mail" size={25} color="#fff"/>
                                <Text style={commonStyle.buttonText}>{strings('main.email')}</Text>
                            </TouchableOpacity>**/}
                        </View>
                    </View>
              
            </ScrollView></SafeAreaView>
            </View>
            </View>    
        )     
    }
}

//export default Dashboard



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
         height:25,
         borderTopLeftRadius: 50,
     },
     normalgreyTextHeader: {
         fontSize: 16,
         color: '#676767',
     },
     btn:{
         backgroundColor: '#e9e9e9',
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
       },textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
        textAlign: I18n.locale=='ar'?'right':'left',
    },errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
});