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
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Share,
  SafeAreaView,
  Linking
} from 'react-native';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import TouchableScale from '../libraries/TouchableScale';
import { FlatList } from 'react-native-gesture-handler';
import ImageModal from 'react-native-image-modal';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faShare } from '@fortawesome/free-solid-svg-icons';
import commonStyle from '../assets/style/styles.js';
import  Loader  from '../components/Loader.js';

let {width, height} = Dimensions.get('window');

//function Dashboard () {
export default class CarforSaleSlider extends Component {

    constructor(props){
        super(props);

        let dataProps = this.props.route.params.gdata;
        this.state = {
            loader      : false,
            fulldata    : [],
            post_page   : 0,
            load_more   : false,
            arrays      :[],
            displayImage : false,
            dataProps: dataProps
          }
          //let dataProps = this.props.route.params.gdata;
          this.props.navigation.setOptions({
            header: () => (
                    <View style={[commonStyle.header, {flexDirection: 'row', justifyContent: 'center', alignItems:'center'}]}>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                        marginTop: height*0.05, flex:1}}>
                                <View style={{flex:0.2, justifyContent: 'center', alignItems: 'center', flexDirection:'row'}}>
                                        <TouchableOpacity activeOpacity={1} 
                                        style={{flexDirection:'row'}}
                                        onPress={() => this.props.navigation.navigate('carforSale')}>
                                            <View>
                                                <FontAwesomeIcon
                                                    icon={ faChevronLeft }
                                                    color="#fff"
                                                    size={width*0.06}
                                                />
                                            </View>
                                            <Text style={commonStyle.headerText}>{strings('main.back')}</Text>
                                        </TouchableOpacity>
                                </View>
                                <View style={{flex: 0.8, justifyContent: 'center', alignItems:'center'}}>
                                    <Text style = {commonStyle.headerText}>{strings('main.SaleCars')}</Text>
                                </View>

                                {/**<View style={{flex:0.6, justifyContent: 'center', alignItems:'center'}}>
                                        <Text style={commonStyle.headerText}>
                                            {dataProps.carModelName} - {dataProps.car_year}</Text>
            </View>**/}
                                <View style={{justifyContent: 'flex-start', alignItems: 'flex-end', flex: 0.2}}>
                                    <TouchableOpacity activeOpacity={1} onPress={() => this.share_post(this.state.dataProps.car_id, this.state.dataProps.local_shipped,
                                                                this.state.dataProps.carModelName, this.state.dataProps.car_year, this.state.dataProps.carMakerName)}>
                                        <View style={{marginRight: 16, alignItems: 'center', justifyContent: 'center' }}>
                                            <View>
                                                <FontAwesomeIcon
                                                    icon={ faShare }
                                                    color="#fff"
                                                    size={25}
                                                />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                        </View>
                    </View> 
          )
          });
    }

    componentDidMount() {
        this.getData();
    }

    componentDidUpdate(prevProps){
        if (this.props.route.params.gdata !== prevProps.route.params.gdata) {
            this.setState({
                loader      : false,
                fulldata    : [],
                post_page   : 0,
                load_more   : false,
                arrays      :[],
                imageUrl    : ''
              });

            this.render();

        }
      }


    share_post = async (car_id, type, car_model, car_year, car_maker) => {
        let url = '';
        //console.log(type);
        if(type == 'shipped'){
            url = 'https://www.naj.ae/'+ 'cars/profile/?id='+ car_id;
        }else if(type == 'local'){
            url = 'https://www.naj.ae/'+ 'cars/profile/?id='+ car_id;
        }
      Share.share({
          subject: 'Nejoum Aljazeera - نجوم الجزيرة',
          title: strings('main.car_sale'),
          message: car_model+'-'+car_year+'-'+car_maker + "\n"+url,
          url: url,
      }, {
          dialogTitle: strings('main.car_sale'),
          excludedActivityTypes: []
      })
    }

    getData = () => {
        this.setState({
            loader          : true,
            visible: false
          });
        var Url = "https://api.nejoumaljazeera.co/api/CarsForSaleDetails?car_id="+this.state.dataProps.car_id;
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
                    loader      : false,
                    fulldata    : response.data,
                    dataProps   : (response.data)?response.data[0]:[]
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

    render(){

        if(this.state.loader){
            return(
                <View>
                    <Loader loader={this.state.loader}></Loader>
                </View>
                
            );
        }
        var images = [];
        if(this.state.fulldata && this.state.fulldata[1]){
            this.state.fulldata[1].map( ( item )=> {
                images.push(
                    { 
                        image:  item,
                    });
            });
        }
        

        if(this.state.displayImage){
            return (
                <ImageModal
                    resizeMode="contain"
                    imageBackgroundColor="#000000"
                    style={{
                    width: '100%',
                    height:'100%',
                    }}
                    source={{
                    uri: this.state.imageUrl,
                    }}
                />
            )
        }
        return (
                <SafeAreaView style = {{marginBottom:height*0.05, backgroundColor:'#EDEDED',}}>
                    <View style = {{borderRadius: 10,marginTop:height*0.07,   justifyContent:'center', borderWidth:1, borderColor:'#343D40', backgroundColor:'#fff'
                ,margin:'2%', padding:'4%'}}>
                        <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={true}
                                style= {{paddingHorizontal: 2}}
                                data={images}
                                keyExtractor = {item => item.id}
                                renderItem = {({item}) =>{
                                    return(
                                        <View style={{justifyContent: 'center', flex:1}}>
                                            <TouchableScale>
                                                    <ImageModal
                                                        resizeMode="contain"
                                                        imageBackgroundColor="transparent"
                                                        style={{
                                                            width: width*0.6,
                                                            height: height*0.3,
                                                            borderRadius: 14,
                                                            marginRight: 10,
                                                            borderRadius: 10
                                                        }}
                                                        source={{
                                                            uri: item.image,
                                                        }}
                                                    />
                                            </TouchableScale>
                                        </View>
                                    )
                                }}
                            />
                            <View style = {{borderRadius: 5, justifyContent:'center', borderWidth:1, borderColor:'#343D40',
                                backgroundColor: '#EDEDED'
                                ,marginTop:'5%', padding:'4%'}}>
                                    <View style = {{ustifyContent: 'center', alignItems:'flex-start' }}>
                                            <Text style = {[commonStyle.normalgreyTextlabelCarSell, {color: '#343D40', fontWeight:'bold'}]}>
                                                {this.state.dataProps.car_year} {this.state.dataProps.carMakerName} {this.state.dataProps.carModelName}</Text>
                                            <Text style = {[commonStyle.normalgreyTextlabelCarSell, {color: '#005FB7'}]}>
                                                Lot # {this.state.dataProps.lotnumber}
                                            </Text>
                                            <Text style = {commonStyle.normalgreyTextlabelCarSell}>
                                                Vin : {this.state.dataProps.vin}
                                            </Text>
                                    </View>
                                    <View style = {{justifyContent:'space-between'}}>
                                        <Text style = {[commonStyle.normalgreyTextlabelCarSell,{color: 'green',
                                            fontWeight:'bold',  alignItems:'flex-start'}]}>
                                            AED {Number((parseInt(this.state.dataProps.price)).toFixed(2)).toLocaleString('en') }
                                        </Text>
                                    </View>
                            </View>
                    </View>

                    <View style = {{justifyContent: 'center', alignItems:'center'}}>
                        <TouchableOpacity activeOpacity={1} onPress={() => 
                        Linking.openURL('https://api.whatsapp.com/send/?phone=971588703269&text=welcome+to+Nejoum+aljazeera&type=phone_number&app_absent=0')}
                            style={[commonStyle.submitbutton, {justifyContent: 'center', alignItems:'center',
                            backgroundColor:'green', borderRadius: 10, 
                            }]}>
                            <Text style={{color:'#fff', fontSize:width*0.05, padding: '3%'}}>{strings('main.contact')}</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
        )
        
    }
}


const styles = StyleSheet.create({
    container: {
       flexGrow: 1
    },
});