/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React , {Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Icon } from 'react-native-elements';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import  Loader  from '../components/Loader.js';
import  ModalMsg  from '../components/ModalMsg.js';
import I18n from 'react-native-i18n';
import * as Animatable from 'react-native-animatable';
import PhoneInput from "react-native-phone-number-input";
import commonStyle from '../assets/style/styles.js';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { array } from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import { faFile } from '@fortawesome/free-solid-svg-icons';

const {width, height} = Dimensions.get('window'); 
const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default class BillFiles extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loader      : false,
            fulldata    : [],
            post_page   : 0,
            load_more   : false,
            arrays      :[],
            modalmsg    : false,
            msg         : '',
            name        : '',
            email       : '',
            phone       : '',
            pageload    : '',
            check_emailInputChange: true,
          }
          props.navigation.setOptions({  tabBarVisible: false });
    }

    componentDidMount() {
        this.props.navigation.setOptions({ tabBarVisible: false });
        this.getData();
    }


    Item = ({ title }) => (
        <View style={styles.item}>
          <Text style={styles.title}>{title}</Text>
        </View>
    );

    getData = async() => {
        this.setState({
            loader          : true
        });
        var device_id = await AsyncStorage.getItem('device_id');
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('customer_id', AuthContext.id);
        var Url  = AuthContext.server_url + "/Nejoum_App/getBlsAttach";
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
                fakeData = [];
                response.data.forEach(instance => {
                    fakeData.push({
                        id                     : instance.id,
                        source                 : instance.file_url,
                        bl_number              : instance.bl_number,
                        date                   : instance.expiry_date,
                        name                   : instance.name
                    });
                });
                this.setState({
                    loader      : false,
                    fulldata    : fakeData,
                    device      : device_id
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

    renderItem = ({ item }) => (
        <TouchableOpacity  onPress={() => {this.props.navigation.navigate('billFilesViewer', {'url':item.source, 'name': item.bl_number})}}>
            <View style={{flex:1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', backgroundColor:'#fff', marginBottom:'1%',
            height: height*0.1,shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.15,
            shadowRadius: 1.84,
            elevation: 2,
            padding: '3%', borderWidth:1, borderColor:'#ccc'}} key={item.id}>
                <View style={{ width: '10%', justifyContent:'flex-start', alignItems:'flex-start'}}>
                    <FontAwesomeIcon
                        icon={ faFile }
                        color="#9b40d6"
                        size={width*0.06}
                    />
                </View>
                <View style={{flex:1}}>
                    <Text>{item.bl_number}</Text> 
                    <View style={{flexDirection:"row", flex:1}}>
                        <Text style={[commonStyle.textBlue, {flex:1}] }>{item.name}</Text>
                        <Text style={[commonStyle.textBlue,{flex:1,textAlign:'right', color:'black', alignItems:'flex-start'}
                                ] }>{item.date}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )

    render() {
        if(this.state.loader){
            return(
                <Loader loader={this.state.loader}></Loader>
            )
        }
        return (
            <View style={commonStyle.backgroundimage}>
                <SafeAreaView style={commonStyle.marginGlobaleless}>
                    <FlatList
                         showsHorizontalScrollIndicator={false}
                         style= {{paddingHorizontal: 10}}
                         data={this.state.fulldata}
                         initialNumToRender={10000}
                         windowSize={20}
                         maxToRenderPerBatch={10000}
                         getItemLayout={(data, index) => (
                             {length: width, offset: width * index, index}
                         )}
                         style={{height: height*0.8}}
                         removeClippedSubviews={true}
                         keyExtractor={item => item.id}
                         renderItem={this.renderItem}
                     />
                </SafeAreaView>      
            </View> 
        );
  }
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    }
});