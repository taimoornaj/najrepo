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
  SafeAreaView,
  RefreshControl,
  Alert,
  Dimensions
} from 'react-native';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import  Loader  from '../components/Loader.js';
import { SearchBar } from 'react-native-elements';
import I18n from 'react-native-i18n';
import commonStyle from '../assets/style/styles.js';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleDown, faAngleUp, faArrowDown, faArrowLeft, faArrowUp, faX } from '@fortawesome/free-solid-svg-icons';
import Accordion from 'react-native-collapsible/Accordion';


const {width, height} = Dimensions.get('window'); 

export default class Statement extends Component {

    
      _renderSectionTitle = (section) => {
        return (
          <View style={styles.content}>
            <Text>{section.content}</Text>
          </View>
        );
      };

      _renderHeader = (item) => {
        carImage = item.image_small;
        return (
            <View style = {{flexDirection: "row", backgroundColor: 'transparent',
        borderTopColor:'#707070', borderTopWidth:1,}}>
                <View style={{ flexDirection: "row", flex: 1, paddingTop:width*0.03, paddingRight:width*0.03,
            paddingLeft:width*0.03}}>
                    <View style={commonStyle.redgradientimageViewStatement}>
                        <Image
                            resizeMode='cover'
                            style={commonStyle.redgradientimageStatement}
                            source={{uri: carImage}}
                        />
                    </View>
                    
                    <View style={{flex: 0.7, margin:'2%'}}>
                        <Text style={[commonStyle.textblackStatement, {fontWeight:'bold', 
                            fontSize:  width*0.04 }]}>${item.carcost}</Text>
                        <View  style={{ flexDirection: 'row', flex: 1, alignItems:'flex-start'}}>
                                <Text style={commonStyle.textblackStatement}>
                                    {item.carMakerName} { (item.carModelName.substr(0,item.carModelName.indexOf(' ')) != '')?
                                item.carModelName.substr(0,item.carModelName.indexOf(' ')):item.carModelName } {item.year}
                                </Text>
                        </View>
                        <View  style={{ flexDirection: 'row', flex: 1}}>
                            <View style={{ flex: 1}}>
                                <Text  style={commonStyle.textblackStatement}>
                                    lot # <Text>{" "}</Text>
                                    <Text  style={commonStyle.textblackStatement}>
                                        {item.lotnumber}
                                    </Text>
                                </Text>
                            </View>
                        </View>
                        <View  style={{ flexDirection: 'row', flex: 1}}>
                            <View style={{ flex: 1 }}>
                                <Text  style={commonStyle.textblackStatement}>
                                    Vin # <Text>{""}</Text>
                                    <Text  style={commonStyle.textblackStatement}>
                                        {item.vin}
                                    </Text>
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{ flex:1,  flexDirection: 'row',marginLeft: 15,  marginTop: 2, 
                            marginBottom: 2, justifyContent: 'flex-end'}}>
                            <View style={{  borderRadius: 4, marginRight: 15, }}>
                                {this.state.activeSections[0] == item.id ?<FontAwesomeIcon
                                        icon={ faAngleDown }
                                        color="#0093FF"
                                        size={width*0.06}
                                    />:<FontAwesomeIcon
                                    icon={ faAngleUp }
                                    color="#0093FF"
                                    size={width*0.06}
                                />}
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
      };
    
      _renderContent = (section) => {
        let totalDebit = 0;
        let totalCredit = 0;
        return (
        <View style={{ padding:width*0.03, flexGrow:1}}>
            <View style={{flexDirection:'row', marginTop:'2%', marginBottom:'2%'}}>
                <Text style = {{flex: 0.4, fontSize:width*0.04, textAlign: I18n.locale=='ar'? 'right' :'left', 
                justifyContent: I18n.locale=='ar'? 'flex-end' :'flex-start', color: '#343D40', }}>{strings('car.details')}</Text>
                <Text style = {{flex: 0.3, textAlign: I18n.locale=='ar'? 'left' :'right', 
                justifyContent:I18n.locale=='ar'? 'flex-start' :'flex-end', fontSize:width*0.04,  color: '#343D40'}}>{strings('car.debit')}</Text>
                <Text style = {{flex: 0.3, textAlign: I18n.locale=='ar'? 'left' :'right', 
                justifyContent:I18n.locale=='ar'? 'flex-start' :'flex-end', fontSize:width*0.04, color: '#343D40', }}>
                    {strings('car.credit')}</Text>
            </View>
        {this.state.shippingDetails.length > 0 && !this.state.loaderInside ?this.state.shippingDetails.map((item2, i2) => {
            totalDebit += parseFloat(item2.debit);
            totalCredit += parseFloat(item2.credit);
            return (
                <View>
                <View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center', margin:'2%'}}>
                    <View style = {{flex:1, flexDirection: I18n.locale== 'ar'? 'row-reverse': 'row',
                        justifyContent: 'space-between'}}>
                            <Text style = {{flex: 0.4,fontSize:width*0.03, textAlign: I18n.locale== 'ar'? 
                            'right': 'left', justifyContent:'flex-start', color: '#343D40'}}>
                                {item2.service_label_en}</Text>
                            <Text style = {{flex: 0.3,  textAlign: I18n.locale== 'ar'? 'left': 'right', 
                            justifyContent:'flex-end', fontSize:width*0.03, color: '#343D40'}}>
                                {item2.debit}</Text>
                            <Text style = {{flex: 0.3, textAlign: I18n.locale== 'ar'? 'left': 'right',
                            justifyContent:'flex-end', fontSize:width*0.03, color: '#343D40'}}>
                                {item2.credit}</Text>
                    </View>
                </View>
                {i2 == this.state.shippingDetails.length-1?
                <View>
                <View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center', margin:'2%',
            borderTopColor:'#343D40', borderTopWidth:1, paddingTop:'2%'}}>
                    <View style = {{flex:1, flexDirection: I18n.locale== 'ar'? 'row-reverse': 'row',
                        justifyContent: 'space-between'}}>
                            <Text style = {{flex: 0.4,fontSize:width*0.03, textAlign: I18n.locale== 'ar'? 
                            'right': 'left', justifyContent:'flex-start', color: '#343D40'}}>
                                {strings('car.total')}</Text>
                            <Text style = {{flex: 0.3,  textAlign: I18n.locale== 'ar'? 'left': 'right', 
                            justifyContent:'flex-end', fontSize:width*0.03, color: '#343D40'}}>
                                {totalDebit}</Text>
                            <Text style = {{flex: 0.3, textAlign: I18n.locale== 'ar'? 'left': 'right',
                            justifyContent:'flex-end', fontSize:width*0.03, color: '#343D40'}}>
                                {totalCredit}</Text>
                    </View>
                </View>
                <View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center', margin:'2%'}}>
                    <View style = {{flex:1, flexDirection: I18n.locale== 'ar'? 'row-reverse': 'row',
                        justifyContent: 'space-between'}}>
                            <Text style = {{flex: 0.4,fontSize:width*0.03, textAlign: I18n.locale== 'ar'? 
                            'right': 'left', justifyContent:'flex-start', color: '#343D40'}}>
                                {strings('main.remaining')}</Text>
                            <Text style = {{flex: 0.3,  textAlign: I18n.locale== 'ar'? 'left': 'right', 
                            justifyContent:'flex-end', fontSize:width*0.03, color: '#343D40'}}>
                                </Text>
                            <Text style = {{flex: 0.3, textAlign: I18n.locale== 'ar'? 'left': 'right',
                            justifyContent:'flex-end', fontSize:width*0.03, color: '#343D40'}}>
                                {this.state.total}</Text>
                    </View>
                </View></View>:<View></View>}
            </View>
        );
        }): 
        <View style={{ flex:1}}>
            <Loader loader={this.state.loaderInside}></Loader>
        </View>}
        </View>
        )
      };
    
      _updateSections = (activeSections) => {
        if(activeSections.length > 0){
            this.getShippingDetails(activeSections);
        }
        this.setState({ activeSections });
      };

      
    constructor(props){
        super(props);
        this.state = {
            loader      : false,
            fulldata    : [],
            post_page   : 0,
            load_more   : false,
            arrays      :[],
            dollar      : 0,
            Collapsed   :[],
            dollarval: 1,
            search      : '',
            dataSource  : [],
            searcharrayLotvin: [],
            activeSections:[],
            loaderInside: false,
            shippingDetails: [],
            total: 0,
            start:0
        }
    }

    componentDidMount() {
        this.setState({start:2})
        this.getData('');
        this.getcustomerslotvin();
    }
    
    getShippingDetails = (car_id) => {
        this.setState({
            loaderInside          : true,
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
            if(response.data.length > 0){
                this.setState({
                    loaderInside      : false,
                    shippingDetails   : response.data,
                    total   : response.total
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

    getData = (item) => {
        this.setState({
            loader          : true,
            search          : item
        });
        var start      = this.state.start;
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('customer_id', AuthContext.id);
        formData.append('search_val', item);
        formData.append('start', start);
        formData.append('length', 10);
        var Url  = AuthContext.server_url + "/Nejoum_App/statement_cars";
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
                var arrayCollaps = [];
                response.data.forEach(element => {
                    arrayCollaps.push(false);
                });
                
                this.setState({
                    loader      : false,
                    fulldata    : response.data,
                    post_page   : response.data.length,
                    Collapsed   : arrayCollaps,
                    dollarval   : response.dollarval
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

    SearchFilterFunction(text) {
        //text = 25502547;
        const newData = this.state.searcharrayLotvin.filter(function(item) {
        const itemData = item ? item :'';
        const textData = text;
        return itemData.indexOf(textData) > -1;
      });
      this.setState({ dataSource: newData, search: text,
      });
      this.getData(text);
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
    var Url       = AuthContext.server_url+"/Nejoum_App/statement_cars";
    const formData = new FormData();
    formData.append('client_id', '1230');
    formData.append('client_secret', '1230NEJOUM1230');
    formData.append('customer_id', AuthContext.id);
    formData.append('search_val', this.state.search);
    formData.append('start', start);
    formData.append('length', 10);
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
          fulldata        : old_data,
        }); 
      }
    })
    .catch((error) => {
      console.warn(error.message);
    });
  }

  round = function(p) {
    p = p || 10;
    return parseFloat( this.toFixed(p) );
  };
    _refreshList = async() => {
        this.setState({
          loader  : true,
        });
        var start     = 0;
        var Url       = AuthContext.server_url+"/Nejoum_App/statement_cars";
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('customer_id', AuthContext.id);
        formData.append('search_val', this.state.search);
        formData.append('start', start);
        formData.append('length', 10);
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

    closeandopen = function(isCollapsed, index) {
        var newAnswer = [this.state.Collapsed]; 
            var arrayCollapstemp = []
            // Chage value of new array
            newAnswer.forEach(element => {
                arrayCollapstemp.push(false);
            });
            newAnswer = arrayCollapstemp;

        this.setState((state) => {
            // Create new array to prevent passing reference to make it pure
            
            newAnswer[index] = isCollapsed
            
          
            return {Collapsed: newAnswer}
           }
          )
        //console.warn(this.state.Collapsed);
        //this.setState({Collapsed:isCollapsed})
    }
    

    render(){
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
        var flatlist = <View></View>;
        return (
        <View style={{flex:1}}>
            <View style={{backgroundColor:'#343D40'}}>
                <View style={{flexDirection: 'row', justifyContent:'center', alignItems:'center', margin:'3%'}}>
                    <SearchBar
                        platform="ios"
                        placeholder={strings("main.search_by")}
                        value={this.state.search}
                        onChangeText={text => this.SearchFilterFunction(text)} 
                        onClear={text => this.SearchFilterFunction('')}
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
                                        icon={ faX }
                                        color="#ccc"
                                        size={width*0.05}
                                    />
                                </View>
                            </TouchableOpacity>
                        }
                    />
                </View>
            </View>
            {flatlist}
            {this.state.loader?(
                <Loader loader={this.state.loader}></Loader>):(
                
            <ScrollView 
             contentContainerStyle = {styles.container}
             onScroll={(e)=>this.onscroll(e)}
             scrollEventThrottle={400}
             refreshControl={
               <RefreshControl
                 onRefresh={() => this._refreshList()}
                 refreshing={this.state.refreshing}
                 colors={['#13365d']}
               />
             }
            >
            {/**
                (this.state.fulldata.length > 0)? this.state.fulldata.map((item,i) => {
                return(
                    <Accordion
                        sections={this.state.fulldata}
                        activeSections={this.state.activeSections}
                        renderSectionTitle={this._renderSectionTitle}
                        renderHeader={this._renderHeader}
                        renderContent={this._renderContent}
                        onChange={this._updateSections}
                        keyExtractor={item2 => item.id}
                        renderAsFlatList={true}
                        underlayColor={'transparent'}
                    />
                )
                }
            ):<View></View>
            **/
            } 
            <Accordion
                sections={this.state.fulldata}
                activeSections={this.state.activeSections}
                renderSectionTitle={this._renderSectionTitle}
                renderHeader={this._renderHeader}
                renderContent={this._renderContent}
                onChange={this._updateSections}
                keyExtractor={item => item.id}
                renderAsFlatList={true}
                underlayColor={'transparent'}
            />
            {load_more}
            </ScrollView>)}
            </View>
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
      fontFamily: "ZEKTON"
    },
    textblue: {
        color: '#0d5db8',
        fontSize: 24,
        textAlign: 'right',
        fontFamily: "ZEKTON"
    },
   
    textSmallwhite: {
        color: '#fff',
        fontSize: 12,
        textAlign: 'right',
        fontFamily: "ZEKTON"
    },
    numberSmallwhite : {
        color: '#fff',
        fontSize: 13,
        width: '100%',
        flex: 1,
        marginRight: 20,
        textAlign: 'right',
        fontFamily: "ZEKTON",
    },
    textwhite: {
        color: '#fff',
        fontSize: 13,
        textAlign: 'center',
        fontFamily: "ZEKTON"
    },
    linearGradient: {
        flex: 1,
    },
    numbergradient: {
        flex: 1,
        alignItems:'center',
        justifyContent: 'center',
        width: '50%',
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 20,
        marginLeft: 5,
        flexDirection: 'row',
        flex:1
    },
    buttonText: {
        fontSize: 15,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#b8130d',
        backgroundColor: 'transparent',
        fontFamily: "ZEKTON"
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
    iconstyleArrow: {
        height: 10,
        width: 10,
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
        fontFamily: "ZEKTON",
        backgroundColor: 'transparent',
    },
    tinyLogo: {
        width: '100%',
        height: '100%',
        resizeMode: "cover",
        justifyContent: "center",
        borderTopRightRadius: 40,
        borderBottomLeftRadius: 50,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 18,
    },
    image: {
        resizeMode: "repeat",
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
        fontFamily: "ZEKTON"
    },
    normalgreyText: {
        color: '#A3A9AF',
        fontFamily: "ZEKTON"
    },
    normalgreyTextHeader: {
        fontSize: 16,
        color: '#676767',
        fontFamily: "ZEKTON"
    },
    normalgreyBoldText: {
        color: '#4d4d4d',
        fontFamily: "ZEKTON",
        fontSize: 16,
        marginLeft: 7
    },
   
    iconstyleDollar: {
        height: 80,
        width: 60,
        resizeMode: 'contain',
    },
    content:{
        flex:1,
        margin:0
    }
});