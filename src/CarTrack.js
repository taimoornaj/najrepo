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
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,Dimensions,
  ImageBackground,
  TextComponent,
  StatusBar
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-elements';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import { Left } from 'native-base';
import  Loader  from '../components/Loader.js';
import  ModalMsg  from '../components/ModalMsg.js';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import { SearchBar } from 'react-native-elements';
import I18n from 'react-native-i18n';
import commonStyle from '../assets/style/styles.js';

const {width, height} = Dimensions.get('window'); 

//function Dashboard () {
export default class CarTrack extends Component {

    constructor(props){
        super(props);
        this.state = {
            loader      : false,
            fulldata    : [],
            post_page   : 0,
            load_more   : false,
            arrays      : [],
            search      : '',
            modalmsg    : false,
            dataSource  : []
          }
          this.props.navigation.setOptions({
            header: () => (
                <View style = {commonStyle.headerSearch}>
                </View>),  
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

    componentDidMount() {
        this.getData();
        this.getcustomerslotvin();
    }

    updateSearch = (search) => {
        this.setState({ search });
    };

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


    getData = () => {
        this.setState({
            loader          : true,
            modalmsg: false
          });
        var start     = this.state.start;
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('customer_id', AuthContext.id);
        var Url  = AuthContext.server_url + "/Nejoum_App/newCarscount";
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
                    loader          : false,
                    new_cars        : response.data.count_cars,
                    towingCars      : response.data.towingCars,
                    warehouseCars   : response.data.warehouseCars,
                    loadingCars     : response.data.loadingCars,
                    shippingCars    : response.data.shippingCars,
                    uaePortCars     : response.data.uaePortCars,
                    storeCars       : response.data.storeCars,
                    post_page       : response.data.length    
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
                error_message    : 'Network Error',
                modalmsg: true,
                pageload: 'carTrack'
            });
        });  
    }


    render(){
        if(this.state.loader){
            return(
                <View>
                    <View style={commonStyle.headerWithSearch}>
                        <View style={commonStyle.headerView}>
                            <Text style={commonStyle.headerText}>{strings('main.car_tracking')}</Text>
                        </View>  
                        <SearchBar
                        platform="android"
                        placeholder={strings("main.search_by")}
                        value={this.state.search}
                        onChangeText={text => this.SearchFilterFunction(text)} 
                        onClear={text => this.SearchFilterFunction('')}
                        containerStyle = {commonStyle.containerStyle}
                        inputContainerStyle = {commonStyle.inputContainerStyle}
                        searchIcon = {
                            <View style={{flexDirection: 'row', }}>
                                    <Image
                                        source={require('../assets/searchcar.png')}
                                        style={commonStyle.searchIcon}/>
                            </View>
                        }
                        />
                </View>
                {flatlist}
                <Loader loader={this.state.loader}></Loader>
                </View>
            );
        }
        if(this.state.modalmsg){
            return(<ModalMsg msg={this.state.error_message} modalmsg={this.state.modalmsg} page={this.state.pageload} navigation={this.props.navigation}></ModalMsg>);
        }


        var warehouse_count = '';
        var loading_count = '';
        var towing_count = '';
        var warehouse_count = '';
        var shipping_count = '';
        var port_count = '';
        var store_count = '';
        var new_cars = '';

        if(this.state.new_cars > 0){
            new_cars =  <View style={styles.circleSmall}><Text style={{ color: '#ffff'}}>{this.state.new_cars}</Text></View>;
        } else {
            new_cars = <View></View>;
        }

       
        if(this.state.warehouseCars > 0){
            warehouse_count = <View style={styles.circleSmall}><Text style={{color: '#ffff'}}>{this.state.warehouseCars}</Text></View>;
        } else {
            warehouse_count = <View></View>;
        }
        
        if(this.state.loadingCars > 0){
            loading_count =   <View style={styles.circleSmall}><Text style={{ color: '#ffff'}}>{this.state.loadingCars}</Text></View>;
        } else {
            loading_count = <View></View>;
        }
        
        if(this.state.towingCars > 0){
            towing_count =   <View style={styles.circleSmall}><Text style={{ color: '#ffff'}}>{this.state.towingCars}</Text></View>;
        } else {
            towing_count = <View></View>;
        }

        
        if(this.state.shippingCars > 0){
            shipping_count =   <View style={styles.circleSmall}><Text style={{ color: '#ffff'}}>{this.state.shippingCars}</Text></View>;
        } else {
            shipping_count = <View></View>;
        }

        
        if(this.state.uaePortCars > 0){
            port_count =   <View style={styles.circleSmall}><Text style={{ color: '#ffff'}}>{this.state.uaePortCars}</Text></View>;
        } else {
            port_count = <View></View>;
        }

        if(this.state.storeCars > 0){
            store_count =   <View style={styles.circleSmall}><Text style={{color: '#ffff'}}>{this.state.storeCars}</Text></View>;
        } else {
            store_count = <View></View>;
        }
        var flatlist = '';
        if(this.state.dataSource && this.state.search != ''){
            flatlist= <View style={{flexDirection:'row',flex:1, marginLeft:width*0.04, marginRight: width*0.04, height:250,  top: height*0.13,
             zIndex: 1000, 
                    backgroundColor: '#dde7f3', borderBottomLeftRadius: 15,
                    borderBottomRightRadius: 15,  borderColor: '#dde7f3', position: 'absolute'}}>
                    <FlatList data={this.state.dataSource}
                            ItemSeparatorComponent={this.ListViewItemSeparator} renderItem={({ item }) => (
                            <TouchableOpacity activeOpacity={1} style={{flex:1,width: '100%'}} backgroundColor="red" onPress = {() => this.props.navigation.navigate('CarTrackSearch', {'lot_vin': item})}>
                                <Text style={{width: width, flex:1,justifyContent:'center', fontSize:15, padding: 11, color: '#0d2750'}}>{item}</Text>
                            </TouchableOpacity>
                    )}
                    enableEmptySections={false} style={{ marginTop: 11 }}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View> 
        }
        else {
            flatlist = <View></View>;
        }
        return (
            <View style={[styles.container]}>
                <View style={commonStyle.headerWithSearch}>
                    <View style={commonStyle.headerView}>
                        <Text style={commonStyle.headerText}>{strings('main.car_tracking')}</Text>
                    </View>   
                    <SearchBar
                    platform="android"
                    placeholder={strings("main.search_by")}
                    value={this.state.search}
                    onChangeText={text => this.SearchFilterFunction(text)} 
                    onClear={text => this.SearchFilterFunction('')}
                    containerStyle = {commonStyle.containerStyle}
                    inputContainerStyle = {commonStyle.inputContainerStyle}
                    searchIcon = {
                        <View style={{flexDirection: 'row'}}>
                                <Image
                                    source={require('../assets/searchcar.png')}
                                    style={commonStyle.searchIcon}/>
                        </View>
                    }
                    /> 
                </View>
                {flatlist}
                <View style={[styles.fixed]}>
                
                    <View style={{flex: 1, flexDirection: 'row-reverse'}}>
                        <View style={{width: width*0.3, height: '100%', backgroundColor: 'powderblue'}}>
                            <LinearGradient colors = {['#0D5DB8','#0D5DB8', '#0A4282']}
                            style={styles.linearGradientTrack}>
                                                    
                            </LinearGradient>
                        </View>
                        <View style={{marginTop: '20%', width: 5, height: '100%', backgroundColor: '#0a4689', marginRight: 4, fontSize: 20}} />
                        <View style={{marginTop: '20%', width: 2, height: '100%', backgroundColor: 'steelblue', marginRight: 2, fontSize: 20}} />
                    </View>
                </View>
                <ScrollView style={[styles.fixed, {backgroundColor: 'transparent'}]}>
                    <TouchableOpacity activeOpacity={1} backgroundColor="#0d5db8" onPress = {() => this.props.navigation.navigate('trackDetails', {type: "new", 
                            titltePage: strings('car.new_cars')})}>
                        <View style={{flexDirection: 'row', flex: 1, marginTop: height*0.08, marginBottom: height*0.025}}>
                            <View style={styles.circleUaePort}>
                                    <Image
                                        style={styles.iconUaePort}
                                        source={require('../assets/new_car.png')}
                                    />
                               {new_cars}
                            </View>
                            <View style={{flex:0.7,justifyContent:'center', alignItems:'center'}}>
                                <Text style={{
                               color: '#0d2750', fontSize:  I18n.locale=='ar'?height*0.03:height*0.02}}>{strings('car.new_cars')}</Text>
                            </View>
                            
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} backgroundColor="#0d5db8" onPress = {() => this.props.navigation.navigate('trackDetails', {type: "towing", 
                            titltePage: strings('car.towing')})}>
                        <View style={{flexDirection: 'row', flex: 1, marginBottom: height*0.025}}>
                            <View style={styles.circleUaePort}>
                                    <Image
                                        style={styles.iconUaePort}
                                        source={require('../assets/towing.png')}
                                    />
                                {towing_count}
                            </View>
                            <View style={{flex:0.7, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{ color: '#0d2750', fontSize:  I18n.locale=='ar'?height*0.03:height*0.02}}>{strings('car.towing')}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} backgroundColor="#0d5db8" onPress = {() => this.props.navigation.navigate('trackDetails', {type: "warehouse", 
                            titltePage: strings('car.warehouse')})}>
                        <View style={{flexDirection: 'row', flex: 1, marginBottom: height*0.025}}>
                            <View style={styles.circleUaePort}>
                                    <Image
                                        style={styles.iconUaePort}
                                        source={require('../assets/warehouse.png')}
                                    />
                                {warehouse_count}
                            </View>
                            <View style={{flex:0.7,justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color: '#0d2750', fontSize:  I18n.locale=='ar'?height*0.03:height*0.02}}>{strings('car.warehouse')}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} backgroundColor="#0d5db8" onPress = {() => this.props.navigation.navigate('trackDetails', {type: "loading", 
                            titltePage: strings('car.loading')})}>
                        <View style={{flexDirection: 'row', flex: 1, marginBottom: height*0.025}}>
                            <View style={styles.circleUaePort}>
                                    <Image
                                        style={styles.iconUaePort}
                                        source={require('../assets/loading.png')}
                                    />
                                    {loading_count}
                              
                            </View>
                            <View style={{flex:0.7, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{ color: '#0d2750', fontSize:  I18n.locale=='ar'?height*0.03:height*0.02}}>{strings('car.loading')}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} backgroundColor="#0d5db8" onPress = {() => this.props.navigation.navigate('trackDetails', {type: "shipping", 
                            titltePage: strings('car.shipping')})}>
                        <View style={{flexDirection: 'row', flex: 1, marginBottom: height*0.025}}>
                            <View style={styles.circleUaePort}>
                                    <Image
                                        style={styles.iconUaePort}
                                        source={require('../assets/shipping.png')}
                                    />
                                {shipping_count}
                            </View>
                            <View style={{flex:0.7,justifyContent:'center', alignItems:'center'}}>
                                <Text style={{ color: '#0d2750', fontSize: I18n.locale=='ar'?height*0.03:height*0.02}}>{strings('car.shipping')}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} backgroundColor="#0d5db8" onPress = {() => this.props.navigation.navigate('trackDetails', {type: "port", 
                            titltePage: strings('car.port')})}>
                        <View style={{flexDirection: 'row', flex: 1, marginBottom: height*0.025}}>
                            <View style={styles.circleUaePort}>
                                    <Image
                                        style={styles.iconUaePort}
                                        source={require('../assets/port.png')}
                                    />
                                    {port_count}
                                
                            </View>
                            <View style={{flex:0.7,justifyContent:'center', alignItems:'center'}}>
                            <Text style={{color: '#0d2750',
                             fontSize: I18n.locale=='ar'?height*0.03:height*0.02}}>{strings('car.port')}</Text></View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} backgroundColor="#0d5db8" onPress = {() => this.props.navigation.navigate('trackDetails', {type: "store", 
                            titltePage: strings('car.store')})}>
                        <View style={{flexDirection: 'row', flex: 1, marginBottom: height*0.025}}>
                            <View style={styles.circleUaePort}>
                                    <Image
                                        style={styles.iconUaePort2}
                                        source={require('../assets/store.png')}
                                    />
                                {store_count}
                            </View>
                            <View style={{flex:0.7,justifyContent:'center', alignItems:'center'}}>
                            <Text style={{color: '#0d2750', fontSize: I18n.locale=='ar'?height*0.03:height*0.02}}>{strings('car.store')}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
            
            
        )
        
    }
}

//export default Dashboard



const styles = StyleSheet.create({
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
    textblue: {
        color: '#0d5db8',
        fontSize: 24,
        textAlign: 'right',
    },
    textwhite: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'left',
    },
    textSmallwhite: {
        color: '#fff',
        fontSize: 15,
        textAlign: 'left',
    },
    linearGradientTrack: {
        flex: 1
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
        resizeMode: "stretch",
        width: '100%',
        justifyContent: "center",
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
    },
    normalgreyText: {
        color: '#A3A9AF',
    },
    normalgreyTextHeader: {
        fontSize: 16,
        color: '#676767',
    },
    circleNewCar: {
        width: 75,
        height: 75,
        position: 'absolute',
        left: '20%',
        right:0,
        top: 80,
        zIndex: 20,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 100/2,
        backgroundColor: '#08396f'
    },
    iconNewCar: {
        resizeMode: "contain",
        justifyContent: "center",
        width: 70,
        height: 70,
        position: 'absolute',
        left: 0,
        right: 0
    },
    circleTowing: {
        width: 75,
        height: 75,
        position: 'absolute',
        left: '20%',
        right:0,
        top: 180,
        zIndex: 20,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 100/2,
        backgroundColor: '#08396f'
    },
    iconTowing: {
        resizeMode: "contain",
        justifyContent: "center",
        width: 70,
        height: 70,
        position: 'absolute',
        left: 0,
        right: 0
    },
    circleWarehouse: {
        width: 75,
        height: 75,
        position: 'absolute',
        left: '20%',
        right:0,
        top: 280,
        zIndex: 20,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 100/2,
        backgroundColor: '#08396f'
    },
    iconWarehouse: {
        resizeMode: "contain",
        justifyContent: "center",
        width: 70,
        height: 70,
        position: 'absolute',
        left: 0,
        right: 0
    },
    circleLoading: {
        width: 75,
        height: 75,
        position: 'absolute',
        left: '20%',
        right:0,
        top: 380,
        zIndex: 20,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 100/2,
        backgroundColor: '#08396f'
    },
    iconLoading: {
        resizeMode: "contain",
        justifyContent: "center",
        width: 70,
        height: 70,
        position: 'absolute',
        left: 0,
        right: 0
    },
    circleShipping: {
        width: 75,
        height: 75,
        position: 'absolute',
        left: '20%',
        right:0,
        top: 480,
        zIndex: 20,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 100/2,
        backgroundColor: '#08396f'
    },
    iconShipping: {
        resizeMode: "contain",
        justifyContent: "center",
        width: 70,
        height: 70,
        position: 'absolute',
        left: 0,
        right: 0
    },
    circleCarinstore: {
        width: 75,
        height: 75,
        flexDirection: 'row',
        left: '20%',
        right:0,
        zIndex: 20,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 100/2,
        backgroundColor: '#08396f'
    },
    iconCarinstore: {
        resizeMode: "contain",
        justifyContent: "center",
        width: 70,
        height: 70,
        position: 'absolute',
        left: 0,
        right: 0
    },
    circleUaePort: {
        width: height*0.09,
        height: height*0.09,
        zIndex: 20,
        resizeMode: "cover",
        justifyContent: "center",
        alignItems: 'center',
        left: width*0.6,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 100/2,
        backgroundColor: '#08396f'
    },
    iconUaePort: {
        resizeMode: "contain",
        justifyContent: "center",
        alignItems: 'center',
        width: height*0.06,
        height: height*0.06,

    },iconUaePort2:{
        resizeMode: "contain",
        justifyContent: "center",
        alignItems: 'center',
        width: height*0.05,
        height: height*0.05,
    },
    circleReceived: {
        width: 75,
        height: 75,
        left: '20%',
        right:0,
        top: 0,
        zIndex: 20,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 100/2,
        backgroundColor: '#08396f'
    },
    iconReceived: {
        resizeMode: "contain",
        justifyContent: "center",
        width: 70,
        height: 70,
        position: 'absolute',
        left: 0,
        right: 0
    },
    circleSmall: {
        width: 25,
        height: 25,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        right:0,
        top: -8,
        zIndex: 100,
        backgroundColor: '#ff0000',
        borderRadius: 100/2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
    },
    fixed: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -200,
        marginBottom: height*0.05,
        marginTop: height*0.08,
    },
    container2: {
        position: 'relative'
    }
});