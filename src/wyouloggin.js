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
  SafeAreaView,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import  Loader  from '../components/Loader.js';
import  ModalMsg  from '../components/ModalMsg.js';
import I18n from 'react-native-i18n';
import commonStyle from '../assets/style/styles.js';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-community/async-storage';
import { faMobile, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const {width, height} = Dimensions.get('window'); 

export default class Wyouloggin extends Component {

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
        var Url  = AuthContext.server_url + "/Nejoum_App/CustomerLoggedInDevices";
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
                        id                     : instance.Device_push_regid,
                        customer_id            : instance.customer_id,
                        Device_brand           : instance.Device_brand,
                        Device_model           : instance.Device_model,
                        Device_os              : instance.Device_os,
                        Device_platform        : instance.Device_platform,
                        date                   : instance.create_date,
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

    changetoLogout (id, customer_id) {
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('customer_id', customer_id);
        formData.append('Device_push_regid', id);
        var Url  = AuthContext.server_url + "/Nejoum_App/changetoLogout";
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
                var arr = [{id:response.Device_push_regid,customer_id:response.customer_id}];
                fakeData = this.state.fulldata;
                fakeData.splice(0,1);
                this.setState({
                    fulldata    : fakeData
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
                loader      : false,
                error_message    : error  
            });
            Alert.alert('Error', 'Connection Error', [
                {text: 'Okay'}
            ]);
        });
    }

     confirmLoggedout (id, customer_id) {
        Alert.alert(
            strings('main.msg'),
            strings('main.are_you_sure_logout'),
            [
              {
                text: strings('main.cancel'),
                style: strings('main.cancel'),
              },
              {text: strings('main.ok'), onPress: () => this.changetoLogout(id, customer_id)},
            ],
            {cancelable: false},
        );
    }

    logoutfromAll() {
          var Url        = AuthContext.server_url+"/Nejoum_App/logoutfromAll";
          const formData = new FormData();
          formData.append('client_id', '1230');
          formData.append('client_secret', '1230NEJOUM1230');
          formData.append('customer_id',AuthContext.id);
          formData.append('Device_push_regid', this.state.device);
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
                var temp;
                var temp22 = [];
                temp  = this.state.fulldata;
                for (var i = 0; i < temp.length; i++) {
                    var obj = temp[i];
                    if (obj.id === this.state.device) {
                        var index = temp.findIndex(function(person) {
                            return person.id == obj
                            });
                            temp22.push(obj)
                    }
                }
                this.setState({
                    fulldata    : temp22,
                });
                return;
              }
              else {
                this.setState({
                    loader      : false
                });
                Alert.alert('Error', strings('main.error'), [
                    {text: 'Okay'}
                ]);
                return;
              }
          })
          .catch((error) => {
            this.setState({
                loader      : false,
            });
            Alert.alert('Error', strings('main.network_error'), [
                {text: 'Okay'}
            ]);
          });
    }



    renderItem = ({ item }) => (
        <View style={{flex:1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', backgroundColor:'#fff',
         padding: '5%', marginBottom:'2%', borderWidth:1, borderColor:'#707070'}} key={item.id}>
            <View style={{ width: '10%', justifyContent:'flex-start', alignItems:'flex-start'}}>
                <FontAwesomeIcon
                    icon={ faMobile }
                    color="#005FB7"
                    size={width*0.06}
                />
            </View>
            <View style={{flex:1}}>
                <Text>{item.Device_brand}, {item.Device_model}, {item.Device_platform}, {item.Device_os}</Text>
                <View style={{flexDirection:"row", flex:1}}>
                        <Text style={commonStyle.textBlack }> {strings('main.loginDate')}</Text>
                        <Text style={commonStyle.textBlue }> {item.date}</Text>
                        <Text style={{color: 'green', fontSize: width*0.03,textAlign: 'left'}}>
                            {'    '}{(this.state.device == item.id)?strings('main.active'):''}
                        </Text>
                        {
                            (this.state.device == item.id)?
                            <View></View>:
                            <View style={{flex:1, alignItems:'flex-end', justifyContent:'flex-end'}}>
                                <TouchableOpacity
                                    onPress={() => {this.confirmLoggedout(item.id, item.customer_id)}}>
                                    <FontAwesomeIcon
                                        icon={ faRightFromBracket }
                                        color="#0093FF"
                                        size={width*0.05}
                                    />
                                </TouchableOpacity>
                            </View>
                        }
                </View>
            </View>
        </View>
    )

    render(){
        if(this.state.loader){
            return(
                <Loader loader={this.state.loader}></Loader>
            )
        }
        if(this.state.modalmsg){
            return(
                <ModalMsg msg={this.state.error_message} modalmsg={this.state.modalmsg} page={this.state.pageload} navigation={this.props.navigation}></ModalMsg>
            )
        }
        return (
            <SafeAreaView style={{flex:1, backgroundColor:'#EDEDED'}}>
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
                         ListHeaderComponent={
                            <Text style={{margin:'5%', color:'#013188', textAlign:I18n.locale=='en'?'left':'right'}}>{strings('main.logoutNotes')}</Text>
                         }
                         ListFooterComponentStyle={{marginTop: height*0.1}}
                         ListFooterComponent={
                            <View style={styles.actionButton}>
                                <TouchableOpacity activeOpacity={1}
                                        style={[commonStyle.submitbutton, {
                                            width: '60%',}]}
                                        onPress={() => {this.logoutfromAll()}}
                                >
                                    <Text style={[commonStyle.buttonTextBlue]}>{strings('main.logout_from_all')}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                     />
            </SafeAreaView>   
        )     
    }
}

const styles = StyleSheet.create({
    container: {
       flexGrow: 1
    },
    action: {
        flexDirection: I18n.locale=='ar'?'row-reverse':'row',
        marginTop: 10,
        paddingBottom: 5,
    },
    actionButton: {
        alignItems: 'center', 
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    }
});