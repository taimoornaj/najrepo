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
  ImageBackground,
  TextComponent
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-elements';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';

import Icon2 from 'react-native-vector-icons/Ionicons';

//function Dashboard () {
export default class SaleCars extends Component {

    constructor(props){
        super(props);
        this.state = {
            loader      : false,
            fulldata    : [],
            post_page   : 0,
            load_more   : false,
            arrays      :[]
          }
    }

    componentDidMount() {

        console.warn(AuthContext.server_url);
                this.getData();
      }

    getData = () => {
        this.setState({
            loader          : true
          });
        var start     = this.state.start;
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('start', this.state.post_page);
        formData.append('length', 5);
        console.warn(AuthContext.server_url);
        var Url  = AuthContext.server_url + "/Nejoum_App/car_for_sell";
        fetch(Url, {
            method: 'POST',
            credentials: 'same-origin',
            body:formData,
        })
        .then((response) => {
            if(response.ok){
              return response;
            }
            //console.warn(response);
            throw Error(response.success);
        })
        .then(res => res.json())
        .then((response) => {
            if(response.success == 'success'){
                this.setState({
                    loader      : false,
                    fulldata    : response.data,
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
            console.warn(Url);
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

    
  load_more_data = async() => {
    this.setState({load_more:true});
    var start     = this.state.post_page;
    var Url       = AuthContext.server_url+"/Nejoum_App/car_for_sell";
    const formData = new FormData();
    formData.append('client_id', '1230');
    formData.append('client_secret', '1230NEJOUM1230');
    formData.append('start', start);
    formData.append('length', 2);
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


    _refreshList = async() => {
        this.setState({
          loader  : true,
        });
        var start     = 0;
        var Url       = AuthContext.server_url+"/Nejoum_App/car_for_sell";
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('start', start);
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
 
        if(this.state.loader){
            arrays = [1,2,3,4,5];
            return (
                <ScrollView contentContainerStyle = {styles.container}>
                    <View style={styles.image}>    
                    <LinearGradient colors={['#c9e0fb','#dbebfc']}
                    style={styles.linearGradient}>
                        <SkeletonPlaceholder>
                        {
                           arrays.map((item,i) => {
                            return(
                            <TouchableOpacity activeOpacity={1} onPress = {() => this.getData()} key={i}>
                                <View style={{ flexDirection: "row", alignItems: "center", margin: 6, backgroundColor: 'white'}}>
                                    <View style={{ width: 150, height: 120 }} />
                                    <View style={{ marginLeft: 20 }}>
                                        <View style={{flexDirection: 'row'}}>
                                            <View style={{ width: 120, height: 20, borderRadius: 4 }}/>
                                            <View style={{ width: 40, height: 20, marginLeft: 5, borderRadius: 4 }}/>
                                        </View>
                                        
                                        <View
                                            style={{ marginTop: 6, width: 80, height: 20, borderRadius: 4 }}
                                        />
                                        <View
                                            style={{ marginTop: 6, width: 80, height: 20, borderRadius: 4 }}
                                        />
                                        <View style={{marginTop: 6,flexDirection: 'row'}}>
                                            <View style={{ width: 80, height: 20, borderRadius: 4 }}/>
                                            <View style={{ width: 80, height: 20, marginLeft: 5, borderRadius: 4 }}/>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            )
                            })
                        }   
                        </SkeletonPlaceholder>    
                    </LinearGradient>
                    </View>
                </ScrollView>
            )
        }
        return (
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
            
                <LinearGradient colors = {['#c9e0fb','#dbebfc']}
                style={styles.linearGradient}>
                    <View style={styles.image}>
                    {
                        (this.state.fulldata.length > 0)? this.state.fulldata.map((item,i) => {
                        var carImage = AuthContext.server_url + '/sellCar/upload/car_for_sale/'+ item.image[0].photo_name;
                        return(
                        <TouchableOpacity activeOpacity={1} style={{marginTop: 15}} onPress = {() => this.getData()} key={i}>
                            <LinearGradient colors = {['#b80d0d','#340000']} style={styles.numbergradient}>
                                <View style={{flex:1, flexDirection: "row", justifyContent: 'center', alignItems:'center'}}>
                                    <View style={{flex:1, alignItems: "flex-start", justifyContent: 'flex-start'}}>
                                        <Text style={{color: "white", padding:'5%', fontFamily: "ZEKTON"}}>
                                            NO. {++i}
                                        </Text>
                                    </View>
                                    <View style={{flex:1, alignItems: "flex-end", justifyContent: 'flex-end'}}>
                                        <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate('carImagesNavigator', {'car_id': item.car_id})}>
                                            <View style={{margin: 5, alignItems: 'center', justifyContent: 'center'}}>
                                                <View>
                                                    <Icon2 name="ios-images" size={25} color='#fff' backgroundColor="#fff" />
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </LinearGradient>
                             
                            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: 'transparent', borderTopRightRadius: 40 }}>
                                <View style={{ flexDirection: "row", backgroundColor: '#ffff',  flex: 1, borderTopRightRadius: 40,borderBottomLeftRadius: 25 }}>
                                    <View style={{ width: 150, height: 120, flexDirection: 'row'}}>
                                        <Image
                                            style={styles.tinyLogo}
                                            source={{uri: carImage}}
                                        />
                                    </View>

                                    <View>
                                        <View  style={{ flexDirection: 'row', flex: 1, marginTop: 6}}>
                                            <View style={{ width: 120, height: 20, borderRadius: 4 }}>
                                                <Text  style={styles.normalgreyTextHeader}>
                                                    {item.car_year} {item.carMakerName}
                                                </Text>
                                                <Text style={styles.normalgreyTextHeader}>
                                                    {item.carModelName}
                                                </Text>
                                            </View>
                                            <View style={{ width: 20, height: 20, marginLeft: 5, borderRadius: 4 }}>  
                                                <Image
                                                    style={styles.iconstyle}
                                                    source={require('../assets/not-1.png')}
                                                />
                                            </View>
                                            <View style={{ width: 20, height: 20, marginLeft: 5, borderRadius: 4 }}>
                                                <Image
                                                    style={styles.iconstyle}
                                                    source={require('../assets/info.png')}
                                                />
                                            </View>
                                        </View>
                                        <View
                                            style={{ flexDirection: 'row', marginTop: 5}}>
                                            <Text style={styles.normalgreyText}>
                                                    Lot #: {item.lotnumber}
                                            </Text>
                                        </View>
                                        <View
                                            style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5}}>
                                            <Text style={styles.normalgreyText}>
                                                    VIN #: {item.vin}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <LinearGradient colors = {['#072F5C', '#0D5DB8']} style={styles.footerModel}>
                                <View style={{borderTopRightRadius: 40, flex:1}}>
                                    <View style={styles.navBar}>
                                        <View style={styles.rightContainer}>
                                            <Text style={styles.normalText}>
                                                CONTAINER #: {item.lotnumber}
                                            </Text>
                                        </View>

                                        <View style={styles.leftContainer}>
                                            <View>  
                                                <Text style={styles.normalText}>
                                                    {strings('car.title')}
                                                </Text>
                                            </View>
                                            <View style={{marginLeft: 5}}>
                                                <Image
                                                    style={styles.iconstyle}
                                                    source={require('../assets/not_checked.png')}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    
                                    <View style={styles.navBar}>
                                        <View style={styles.rightContainer}>
                                            <Text style={styles.normalText}>
                                                ETA : {item.eta}
                                            </Text>
                                        </View>

                                        <View style={styles.leftContainer}>
                                            <View>  
                                                <Text style={styles.normalText}>
                                                    {strings('car.keys')}
                                                </Text>
                                            </View>
                                            <View style={{marginLeft: 5}}>
                                                <Image
                                                    style={styles.iconstyle}
                                                    source={require('../assets/check.png')}
                                                />
                                            </View>
                                        </View>
                                    </View>     
                                </View>
                            </LinearGradient>

                        </TouchableOpacity>
                        )
                        }):<View><Text>No data</Text></View>
                    } 
                    </View>  
                </LinearGradient>
                {load_more}
                
            </ScrollView>
            
        )
        
    }
}

//export default Dashboard



const styles = StyleSheet.create({
    container: {
       flexGrow: 1
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
      fontFamily: "ZEKTON"
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
        marginTop: 6
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
    }
});