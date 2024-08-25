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
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StatusBar,
  SafeAreaView
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import  Loader  from '../components/Loader.js';
import DatePicker from 'react-native-datepicker';
import commonStyle from '../assets/style/styles.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faArrowRight, faSliders, faX } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-native-modal';

const {width, height} = Dimensions.get('window');

export default class GeneralStatement extends Component {
    constructor(props){
        super(props);
        this.state = {
            setd: '',
            search: '',
            fulldata: [],
            searcharrayLotvin: [],
            post_page   : 0,
            load_more   : false,
            visible: false,
            from_date: new Date("2020-01-01"),
            to_date: new Date(),
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
                        <Text style={commonStyle.headerText}>{strings('main.payments')}</Text>
                      </View>
                      <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                        <TouchableOpacity activeOpacity={1} onPress={() => this.setState({visible:true})} size={20}>
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
            )
          });
    }

    async componentDidMount() {
        //const username = await AsyncStorage.getItem('loggedin'); 
        this.getData();
    }

    toggleOverlay = () => {
        this.setState({visible: false});
    }


    componentDidUpdate(prevProps){
        if(prevProps.route.params){
            if ((this.props.route.params.from !== prevProps.route.params.from)  || (this.props.route.params.to !== prevProps.route.params.to)) {
                this.setState({
                    loader      : false,
                    fulldata    : [],
                    post_page   : 0,
                    load_more   : false,
                    arrays      :[],
                    from_date: this.props.route.params.from,
                    to_date: this.props.route.params.to
                    });
                this.getData();
            }
        }
      
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
    this.setState({load_more:true});
    var start     = this.state.post_page;
    var Url       = AuthContext.server_url+"/Nejoum_App/getFinalInvoice";
    const formData = new FormData();
    formData.append('client_id', '1230');
    formData.append('customer_id', AuthContext.id);
    formData.append('client_secret', '1230NEJOUM1230');
    formData.append('start', start);
    formData.append('from_date', this.state.from_date.toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10));
    formData.append('to_date', this.state.to_date.toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10));
    formData.append('length',5);
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
        var old_data    = this.state.fulldata;
        var start       = start;
        var count       = response.data.length;
        for(var i = 0; i < response.data.length; i++){
            old_data.push(response.data[i]);
        }
       
        this.setState({
          load_more       : false,
          post_page       : old_data.length,
          total_posts     : count,
          total_data      : count,
          fulldata        : old_data,
        }); 
      }
    })
    .catch((error) => {
      console.warn(error.message);
    });
  }

    setModalVisible = (val) => {
        this.setState({visible:val});
    }
    _refreshList = async() => {
        this.setState({
          loader  : true,
        });
        var start     = 0;
        var Url       = AuthContext.server_url+"/Nejoum_App/getFinalInvoice";
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('customer_id', AuthContext.id);
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('start', start);
        formData.append('from_date', this.state.from_date.toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10));
        formData.append('to_date', this.state.to_date.toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10));
        formData.append('length', 5);
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
                    fulldata    : response.data    
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
    
    getData = () => {
        this.setState({
            loader          : true,
            visible: false,
          });
        var start     = this.state.start;
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('customer_id', AuthContext.id);
        formData.append('start', 0);
        formData.append('length', 15);
        formData.append('from_date',  this.state.from_date.toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10));
        formData.append('to_date',  this.state.to_date.toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10));
        var Url  = AuthContext.server_url + "/Nejoum_App/getFinalInvoice";
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
                    fulldata   : response.data,
                    post_page   : response.data.length  
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

    
    resetDate = () => {
        this.props.navigation.setParams({from:"", to:""});
        this.setState({
            from_date: new Date("2020-01-01"),
            to_date: new Date(),
        }, () => {
            this.getData();
        });
    }

    render(){
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
          else{
            var load_more = [];
          }

          if(this.state.from_date != '' || this.state.to_date != ''){
              var date_scale = <View style={{flexDirection:'row', backgroundColor: 'transparent', justifyContent:'space-between'}}>
                                    <View style={{ flexDirection: 'row',flex:1, justifyContent:'center', alignItems:'center'}}>
                                        <View style={{justifyContent: 'center', flex: 0.25, flexDirection:'row', alignItems: 'center'}}>
                                            <Text style={styles.textBlue}>{this.state.from_date.toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10)}</Text>
                                        </View>
                                        <View style = {{flex:0.25,flexDirection:'row', justifyContent: 'center', alignItems: 'center'}}>
                                        <FontAwesomeIcon
                                            icon={ faArrowRight } 
                                            size={width*0.06} backgroundColor="#fff" color="#0d5db8"/>
                                        </View>
                                        <View style={{justifyContent: 'center', flex: 0.25, flexDirection:'row', alignItems: 'center'}}>
                                            <Text style={styles.textBlue}>{this.state.to_date.toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 10)}</Text>
                                        </View>
                                        <View style={{flex:0.25,flexDirection:'row', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                                            <TouchableOpacity activeOpacity={1} onPress={() => this.resetDate()}>
                                                <View style={{margin: 16, alignItems: 'center', justifyContent: 'center'}}>
                                                    <View>
                                                    <FontAwesomeIcon
                                                        icon={ faX }  size={width*0.06} color='#0d5db8' backgroundColor="#fff" />
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>;
          } else {
              var date_scale = <View></View>;
          }
        const from_date = this.state.from_date;
        const to_date = this.state.to_date;
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
                                <Text style={styles.blueText2}>{strings('main.from')}</Text>
                            </View>
                            <View style={{flexDirection: "row"}}>

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
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.blueText2}>{strings('main.to')}</Text>
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
                {date_scale}

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
                    <View  style={{ flex: 1}}>
                    {
                    (this.state.fulldata.length > 0)? this.state.fulldata.map((item,i) => {
                        return (
                            <Animatable.View 
                                animation="fadeInUp"
                                duration = {700}>
                                <TouchableOpacity activeOpacity={1}
                                        onPress = {() => this.props.navigation.navigate('statementDetails', 
                                        {invoice_id: item.final_payment_invoices_id,
                                            totalBill: item.total_amount})}
                                        style = {styles.buttonNav} key={i}>
                                            <View style={{flex:0.5}}>
                                                <View style={{flex:1, alignItems:'center', flexDirection: 'column', 
                                                 justifyContent:'center'}}>
                                                    <Text style={{fontSize:width*0.02, color: '#343D40'}}>
                                                        {strings('main.amount')}
                                                    </Text>
                                                    <Text style={{color:'#013188', fontSize: width*0.05}}>AED {item.total_amount} </Text>
                                                </View>
                                                <View style={{flexDirection: 'row', bottom:0, top:0,  flex:1, justifyContent: 'center', 
                                                alignItems: 'flex-end'}}>
                                                    <Text style={{color: "#7F7F7F",  fontSize: width*0.02}}>
                                                        {item.create_date}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={{flex:0.5}}>
                                                <View style={{flex:1, flexDirection: 'column', justifyContent:'center', alignItems: 'center'}}>
                                                    <Text style={{fontSize:width*0.02,color: '#343D40'}}>
                                                        {strings('main.invoice_no')}
                                                    </Text>
                                                    <Text style={{color:'#013188', fontSize: width*0.05}}> {item.invoice_numer} </Text>
                                                </View>
                                                <View style={{flexDirection: 'row', bottom:0, top:0,  flex:1, justifyContent: 'center', alignItems: 'flex-end'}}>
                                                    <Text style={{color: "#7F7F7F", fontSize: width*0.02}}>{strings('main.paid_for')} {item.countcars} {strings('main.cars')}
                                                    </Text>
                                                </View>
                                            </View>
                                </TouchableOpacity>
                            </Animatable.View>
                        )
                        }):<View><Text>{strings('main.no_data')}</Text></View>
                        }
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    </View>
                    {load_more} 
                    </View>
            </ScrollView></SafeAreaView>
            
        )
    }
}

const styles = StyleSheet.create({
    container: {
       flexGrow: 1,
    },
    buttonNav:{
        flex:1,
        backgroundColor:'#fff',
        flexDirection:'row',
        marginTop:'1%',
        marginBottom:'1%',
        padding:'2%',
        justifyContent:'center',
        alignItems:'center',
        borderWidth:0.5,
        borderColor: '#707070',
        height: height*0.10,
        justifyContent: 'center',
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
        color: '#343D40',
        backgroundColor: 'transparent',
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
    },textBlue: {
        color: '#0d5db8',
        fontSize: width*0.03,
        textAlign: 'left',
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
    contentView: {
        justifyContent: 'flex-end',
        margin: 0,
    }
});