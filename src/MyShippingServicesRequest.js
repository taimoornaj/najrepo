import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
  TouchableOpacity
} from 'react-native';
import {AuthContext} from '../components/context';
import Loader from '../components/Loader.js';
import I18n from 'react-native-i18n';
import commonStyle from '../assets/style/styles.js';
import {strings} from '../locals/i18n';
import Clipboard from '@react-native-community/clipboard';
import RNRestart from 'react-native-restart'; 
import AsyncStorage from '@react-native-community/async-storage';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {faTrash } from '@fortawesome/free-solid-svg-icons';
import AwesomeAlert from 'react-native-awesome-alerts';

const {width, height} = Dimensions.get('window');

const MyShippingServicesRequest = props => {
  const baseUrl = `https://api.nejoumaljazeera.co/api/getSpecialRequest?customer_id=${
    AuthContext.id
  }`;
  const {navigation} = props;
  const { refresh } = props.route.params || {};
  const [loader, setLoader] = useState(true);
  const [imageVisible, setimageVisible] = useState(false);
  const [fileVisible, setfileVisible] = useState([]);
  const [showAlert, setshowAlert] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [id, setID] = useState('');
  const [data, setData] = useState([]);
  const [code, setCode] =  useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoader(true);
        const response = await fetch(baseUrl);
        const json = await response.json();
        const data = json?.data || [];
        setData(data);
        setLoader(false);
      } catch (error) {
        setLoader(false);
        console.log(error);
      }
    }
    navigation.setOptions({tabBarVisible: false});
    fetchData();

    if (refresh) {
      fetchData();
    }
  }, [baseUrl, navigation, fileVisible, deleteFlag, refresh]);

  const renderItem = ({item}) => {
    let {
      id,
      name_ar,
      name_en,
      lotnumber,
      vin,
      date,
      amount,
      carModelName,
      carMakerName,
      car_image,
      confirmed
    } = item;
    return (
      <View style={localStyles.itemStyle} key={id}>
          <View style={{flexDirection: 'row',
            flexWrap: 'wrap',
            
            justifyContent: 'space-between',
            alignItems: 'center',}}>
                <Image
                  style={[commonStyle.image3dbigcover, {flex:1.3, width:'20%', height: 100, resizeMode:'contain'}]}
                  source={{uri: 'https://cdn.nejoumaljazeera.co/uploads/'+car_image}}
                />
              <View
                style = {{
                  flex: 2.5,
                  justifyContent:'space-between',
                  flexDirection:'column'}}>
                  <Text selectable={true}  style={[commonStyle.textBlue,{justifyContent:'center',
                      textAlign:'center', margin:'3%', fontSize: width*0.04, color:'#013188'}]}>
                     {I18n.locale== 'ar'?name_ar:name_en}
                  </Text>
                  <Text selectable={true} style={[commonStyle.textBlue,{marginLeft:'3%', fontSize: width*0.035, 
                color: '#E9A83B'}]}>
                  {carModelName} - {carMakerName}
                  </Text>
                  <Text selectable={true} style={[commonStyle.textBlue,{marginLeft:'3%', fontSize: width*0.035}]}>
                    <Text style={{color:'#000'}}>Lot#: </Text> {lotnumber}
                  </Text>
                  <Text selectable={true} style={[commonStyle.textBlue,{marginLeft:'3%', fontSize: width*0.035}]}>
                    <Text style={{color:'#000'}}>VIN#: </Text> {vin}
                  </Text>
                  <Text selectable={true} style={[commonStyle.textBlue,{margin:'3%', fontSize: width*0.035,
                justifyContent:'center', alignItems:'center'}]}>
                    <Text style={{ textAlign:'center', color: 'rgb(22,161,61)'}}> $ {amount}</Text>
                  </Text>
              </View>
              {confirmed == 3 ? (
            <TouchableOpacity
              onPress = {async () => {
                await setID(id);
                setshowAlert(true);
              }}
              >
              <View
                style = {{
                  flex: 0.5,
                  justifyContent:'center',
                  alignItems:'center',
                  flexDirection:'column'}}>
                  <FontAwesomeIcon
                      icon={ faTrash }
                      color="#A30000"
                      size={width*0.06}
                  />
              </View>
              </TouchableOpacity>):<View></View>}
      </View>
      <View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
          <Text selectable={true} style={[commonStyle.textBlue,{marginLeft:'3%', marginTop:'2%',justifyContent:'center',
              fontSize: width*0.035, alignItems:'center'}]}>
            <Text style={localStyles.date}> {date}</Text>
          </Text>
      </View>
  </View>
    );
  };

  copyText = (lotnumber) => {
    Clipboard.setString(lotnumber);
  }

  textInputChange = (val) => {
    setCode(val);
  }

  const deleteRequest = async id => {
    setshowAlert(false);
    const data = {
      id: id,
    };
    const baseUrl =
      'https://api.nejoumaljazeera.co/api/deleteLoadingRequest';
    try {
      const request = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const json = await request.json();
      if (json.success) {
        alert(json.message);
        setshowAlert(false);
        navigation.navigate("MyShippingServicesRequest", {'refresh': Math.random().toString()});
      } else {
        setshowAlert(false);
        alert(json.message);
      }
    } catch (error) {
      setshowAlert(false);
      alert('Something went wrong');
    }
  };

  return (
      <SafeAreaView style={commonStyle.marginGlobaleless}>
        <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title="Confirmation"
            message="Are you sure you want to proceed?"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            showConfirmButton={true}
            cancelText="No, cancel"
            confirmText="Yes, proceed"
            confirmButtonColor="#DD6B55"
            onCancelPressed={() => setshowAlert(false)}
            onConfirmPressed={() => deleteRequest(id)}
          />
        {
          (AuthContext.AdminAccess)?
          data?.length > 0 ? (
            <FlatList
              showsHorizontalScrollIndicator={false}
              style={{paddingHorizontal: 10}}
              data={data}
              initialNumToRender={10000}
              windowSize={20}
              maxToRenderPerBatch={10000}
              getItemLayout={(data, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
              removeClippedSubviews={true}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              ListFooterComponentStyle={{marginTop: height * 0.1}}
            />
          ) : loader ? (
            <View style={localStyles.loaderStyle}>
              <Loader loader={true} />
            </View>
          ) : (
            <View style={localStyles.loaderStyle}>
              <Text
                style = {{
                  fontSize: 20,
                  width: '100%',
                  fontWeight: 'bold',
                  color: '#013188',
                  textAlign: 'center',
                  marginTop: height * 0.5,
                }}>
                {strings('main.nodata')}
              </Text>
            </View>
          ):
            <View style={{ justifyContent:'center', alignItems:'center',
              backgroundColor:'#fff',flex:1}}>
                <View style={{backgroundColor:'#EDEDED', width:width, justifyContent:'center', 
                  alignItems:'center',
                  shadowColor: "#EDEDED",
                  justifyContent: 'center',
                  shadowOffset: {
                    width: 0,
                    height: 0.3,
                  },
                  shadowOpacity: 0.58,
                  shadowRadius: 2.00,
                  elevation: 18,}}>
                    <View style={localStyles.action}>
                        <Text style={commonStyle.textBlue}>
                            {strings('main.adminaccessText')}
                        </Text>
                    </View>
                    <View style={localStyles.action}>
                        <TextInput
                            placeholder={strings('main.admin_code')}
                            placeholderTextColor="#666666"
                            style={[commonStyle.textInput, {backgroundColor:'#fff',
                                color: '#666666', borderColor:'#707070', 
                                borderWidth:1, borderRadius:25, width:'100%', padding:'3%'
                            }]}
                            value = {code}
                            autoCapitalize="none"
                            onChangeText = {(val) => textInputChange(val)}
                        />
                    </View>
                    <TouchableOpacity  style={commonStyle.submitbutton}
                        onPress={() => activateAdmin()}>
                        <Text style={commonStyle.buttonText}>
                            {strings('main.activate')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
                }
      </SafeAreaView>
  );
};

export default MyShippingServicesRequest;

const localStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent:'center', alignItems:'center'
  },
  loaderStyle: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: '1%',
    height: height * 0.12,
    padding: '5%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#013188',
  },
  newPort: {
    fontSize: 12,
    color: '#013188',
    fontWeight: 'bold',
    marginTop: 5,
  },
  oldPort: {
    fontSize: 12,
    color: '#E9A83B',
    fontWeight: 'bold',
    marginTop: 5,
  },
  itemStyle: {
    flex: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: '1%',
    height: height * 0.23,
    padding: '3%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  deleteBtn: {
    color: '#fff',
    backgroundColor: 'rgba(220,3,3,0.73)',
    paddingHorizontal: 5,
    paddingVertical: 3,
    textAlign: 'center',
    fontSize: 11,
    borderRadius: 4,
    margin: '1%',
  },
  approved: {
    color: 'rgb(22,161,61)',
    // backgroundColor: 'rgba(11,66,130,0.86)',
    paddingHorizontal: 2,
    fontWeight: 'bold',
    paddingVertical: 3,
    textAlign: 'center',
    fontSize: 12,
    borderRadius: 4,
    margin: '1%',
  },
  date: {
    color: '#707070',
    paddingHorizontal: 5,
    paddingVertical: 3,
    textAlign: 'center',
    width: '100%',
    fontSize: 11,
    borderRadius: 4,
    margin: '1%',
  },
  action: {
    flexDirection: I18n.locale == 'ar' ? 'row-reverse' : 'row',
    marginTop: 10,
    paddingBottom: 5,
  },
  actionButton: {
    alignItems: 'center',
  },
  errorMsg: {
    color: '#FF7B89',
    fontSize: 14,
  },
  modalnotes:{
    flex: 1,
    height:200,
    width:200,
    backgroundColor:'red',
    borderBottomLeftRadius: 20,
    borderRadius: 25,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  slider: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#013188',
    textAlign: 'center',
  },
  vinText: {
    fontSize: 16,
    marginBottom: 5,
  },
  closeButton: {
    alignSelf: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#013188',
    fontSize: 16,
  },
  action: {
    flexDirection: I18n.locale === 'ar' ? 'row-reverse' : 'row',
    padding:'6%'
  }
});
