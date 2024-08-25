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
  Alert,
  Dimensions
} from 'react-native';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import Loader  from '../components/Loader.js';
import I18n from 'react-native-i18n';
import { Title } from "react-native-paper";
import withTailwindHook from "../components/hooks/WithTailwindHook";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import StyledButton from "../components/molecules/StyledButton";
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
const {width, height} = Dimensions.get('window'); 

let Profile = class profile extends Component {

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
        var Url  = AuthContext.server_url + "/Nejoum_App/getProfileData";
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
                    fulldata   : response.data[0],
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


    render(){
        const tailwind =this.props.tailwind;

        if(this.state.loader){
            return(
                <Loader loader={this.state.loader}></Loader>
            )
        }

        return (
            <ScrollView
              contentContainerStyle = {styles.container}>
                {
                    <View style={{backgroundColor:'#fff', alignItems:'center', justifyContent:'center', flex:1,}}>
                        
  
                        <View style={tailwind('flex-col my-14 flex bg-gray rounded-lg')}>
                            <View style={{marginTop: 15, marginLeft:15, padding:'2%'}}>
                                    <View style={{flexDirection:'row' }}>
                                        <FontAwesomeIcon
                                            icon={ faUserCircle }
                                            style={tailwind('text-orange   pt-1 ')} 
                                            size={width*0.08}
                                        />
                                        <Title style={tailwind('text-xl text-darkblue pl-1 capitalize ')}>{AuthContext.name}</Title>
                                    </View>
                                    

                                    <View style={{flexDirection:'row', margin:'4%'}}></View>
                                    
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={[tailwind('text-xs text-black'), {textAlign:I18n.locale =='ar'?'left':'right', 
                                        direction:I18n.locale =='ar'?'rtl':'ltr'}]}>
                                            {strings('main.profileText')}
                                        </Text>
                                    </View>

                                    <View style={{flexDirection:'row', margin:'4%'}}></View>
                                    <View style={{flexDirection:'column'}}>
                                        <View style={{margin:'1%',  flexDirection: I18n.locale =='ar'?'row-reverse':'row'}}>
                                            <Text style={[tailwind('w-\[32\%\]  text-xs font-semibold  '),{textAlign:I18n.locale =='ar'?'left':'right', 
                                        direction:I18n.locale =='ar'?'rtl':'ltr', }]}>
                                                {strings('main.membership_id')}: </Text>
                                            <Text style={tailwind(' text-xs w-\[80\%\] text-darkblue font-bold ')}>  
                                            {this.state.fulldata.membership_id}</Text>
                                        </View>

                                        <View style={{flexDirection:'row', margin:'1%', flexDirection: I18n.locale =='ar'?'row-reverse':'row'}}>
                                                <Text style={[tailwind(' w-\[32\%\] text-xs font-semibold  '),{textAlign:I18n.locale =='ar'?'left':'right', 
                                        direction:I18n.locale =='ar'?'rtl':'ltr', }]}>
                                                    {strings('main.email')}: </Text>
                                                <Text style={tailwind('text-xs  w-\[80\%\] text-darkblue font-bold ')}>  
                                                {this.state.fulldata.primary_email}</Text>
                                        </View>

                                        <View style={{flexDirection:'row', margin:'1%', flexDirection: I18n.locale =='ar'?'row-reverse':'row'}}>
                                                <Text style={[tailwind('w-\[32\%\] text-xs font-semibold  ')
                                                ,{textAlign:I18n.locale =='ar'?'left':'right', 
                                                direction:I18n.locale =='ar'?'rtl':'ltr', }]}>
                                                    {strings('main.phone')}: </Text>
                                                <Text style={tailwind('  text-xs w-\[80\%\] text-darkblue font-bold ')}>
                                                    {this.state.fulldata.phone}
                                                </Text>
                                        </View>
                                    </View>
                                   
                                    <View style={{flexDirection:'row', margin:'4%'}}></View>
                                    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                                        <View style={{width:'50%'}}>
                                            <StyledButton 
                                                onClick={() => this.props.navigation.navigate('changePassword')}
                                                text={strings('main.change_password')} />
                                        </View>
                                    </View>

                            </View>
                        </View>
                        
                    </View>
  
                }
            </ScrollView>
          ) 
    }
}
export default withTailwindHook(Profile);



const styles = StyleSheet.create({
    container: {
        flexGrow: 1
        /**\justifyContent: 'center',
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
      fontFamily: "Alarabiya-Font"
    },
    textblue: {
        color: '#0d5db8',
        fontSize: 24,
        textAlign: 'right',
        fontFamily: "Alarabiya-Font"
    },
    textwhite: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'left',
        fontFamily: "Alarabiya-Font"
    },
    textSmallwhite: {
        color: '#fff',
        fontSize: 15,
        textAlign: 'left',
        fontFamily: "Alarabiya-Font"
    },
    linearGradient: {
        flex: 1,
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 100
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
        fontFamily: "Alarabiya-Font"
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
        height: 200,
        width: 150,
        resizeMode: 'contain',
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
        fontFamily: "Alarabiya-Font",
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
        fontFamily: "Alarabiya-Font"
    },
    normalgreyText: {
        color: '#A3A9AF',
        fontFamily: "Alarabiya-Font"
    },
    normalgreyTextHeader: {
        fontSize: 16,
        color: '#676767',
        fontFamily: "Alarabiya-Font"
    }
});
