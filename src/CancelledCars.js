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
  RefreshControl,
  Alert,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import  Loader  from '../components/Loader.js';
import commonStyle from '../assets/style/styles.js';
import CarCard from "../components/molecules/CarCard";

const {width, height} = Dimensions.get('window'); 

//function Dashboard () {
export default class CancelledCars extends Component {

    constructor(props){
        super(props);
        this.state = {
            loader      : false,
            fulldata    : [],
            post_page   : 0,
            load_more   : false,
            arrays      :[],
            no_data     : false
          }
    }

    componentDidMount() {
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
        formData.append('customer_id', AuthContext.id);
        formData.append('start', 0);
        formData.append('length', 10);
        var Url  = AuthContext.server_url + "/Nejoum_App/newCarsCanceled";
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
                if(response.data.length > 0){
                    this.setState({
                        loader      : false,
                        fulldata    : response.data,
                        post_page   : response.data.length    
                      });
                }else {
                    this.setState({
                        loader      : false,
                        no_data: true }); 
                }
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
            //console.log(error);
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
    var Url       = AuthContext.server_url+"/Nejoum_App/newCarsCanceled";
    const formData = new FormData();
    formData.append('client_id', '1230');
    formData.append('customer_id', AuthContext.id);
    formData.append('client_secret', '1230NEJOUM1230');
    formData.append('start', start);
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
        var Url       = AuthContext.server_url+"/Nejoum_App/newCarsCanceled";
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('customer_id', AuthContext.id);
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

          if(this.state.no_data){
            return(
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
                    <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
                        <Text style={commonStyle.noDataText}>
                            {strings('main.no_data')}
                        </Text>
                    </View>
                   
            </ScrollView>
            );
        }
 
        if(this.state.loader){
            return(
                <Loader loader={this.state.loader}></Loader>
            );
        }
        return (
            <View  style={commonStyle.backgroundimage}>
               
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
             <SafeAreaView style={{ backgroundColor:'transparent'}}>
                {
                    (this.state.fulldata.length > 0)? this.state.fulldata.map((item,i) => {
                    dataDetails = {};
                    dataDetails.id              = item.id;
                    dataDetails.lotnumber       = item.lotnumber;
                    dataDetails.vin             = item.vin;
                    dataDetails.purchasedate = item.purchasedate;
                    dataDetails.carMakerName    = item.carMakerName;
                    dataDetails.year            = item.year;
                    dataDetails.aTitle = item.aTitle;
                    dataDetails.calculation = item.calculation;
                    dataDetails.carModelName    = (item.carModelName.substr(0,item.carModelName.indexOf(' ')) != '')?
                    item.carModelName.substr(0,item.carModelName.indexOf(' ')):item.carModelName;
                    dataDetails.image_small     = 'https://cdn.nejoumaljazeera.co/uploads/'+ item.photo;
                    dataDetails.type           = 'cancelled'

                    const actions = {
                        goToDetails: () => this.props.navigation.navigate('carDetails2', 
                                {'data': dataDetails, 'type': this.props.route.params.type ,'allNotes': this.state.allNotes}),
                      }

                    return(
                 
                    <CarCard data={dataDetails} actions={actions} props={this.props}/>
                    )
                    }):<View></View>
                }
                {load_more}
                </SafeAreaView>
            </ScrollView>
            </View>  
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
    textblue: {
        color: '#0d5db8',
        fontSize: 24,
        textAlign: 'right',
        fontFamily: "ZEKTON"
    },
    textwhite: {
        color: '#fff',
        fontSize: 10,
        textAlign: 'left'
    },
    textSmallwhite: {
        color: '#fff',
        fontSize: 8,
        textAlign: 'left',
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