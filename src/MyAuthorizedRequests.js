import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
  Modal
} from 'react-native';
import {AuthContext} from '../components/context';
import Loader from '../components/Loader.js';
import I18n from 'react-native-i18n';
import commonStyle from '../assets/style/styles.js';
import {strings} from '../locals/i18n';
import ImageViewer from 'react-native-image-zoom-viewer';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit, faIdCard, faTrash, faXmarkCircle, faUserMinus, faCarSide } from '@fortawesome/free-solid-svg-icons';
import AwesomeAlert from 'react-native-awesome-alerts';

const {width, height} = Dimensions.get('window');

const MyAuthorizedRequests = props => {
  const baseUrl = `https://api.nejoumaljazeera.co/api/getAllAuthorizedReceiver?customer_id=${
    AuthContext.id
  }`;
  const {navigation} = props;
  const { refresh } = props.route.params || {};
  const [loader, setLoader] = useState(true);
  const [imageVisible, setimageVisible] = useState(false);
  const [fileVisible, setfileVisible] = useState([]);
  const [showAlert, setshowAlert] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [authId, setauthId] = useState('');
  const [data, setData] = useState([]);  
  const [visible, setVisible] = useState(false);
  const [modalVins, setModalVins] = useState([]);
  
  
  const handlePress = (file) => {
    setfileVisible([{url: file}]);
    setimageVisible(true);
  };
  
  useEffect(() => {
    
    if (fileVisible.length > 0) {
      setimageVisible(true);
    }
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
    if (deleteFlag) {
      // Perform any cleanup or fetch new data after the delete operation
      // For example, you can fetch updated data from the server:
      fetchData();
      // Reset the deleteFlag to false to avoid re-triggering the effect immediately
      setDeleteFlag(false);
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
      name,
      notes,
      emirates_id,
      file,
      type,
      active,
      create_date,
      cars,
      vins,
      status,
      phone
    } = item;
    var array;
    var arrayModal;
    
    if(cars){
      array = cars.split(',');
    }
    

    return (
      <View style={localStyles.itemStyle} key={id}>
        <Modal
              animationType="fade"
              transparent={true}
              visible={visible}
              onRequestClose={() => setVisible(false)}>
              <View style={localStyles.modalContainer}>
                <View style={localStyles.modalContent}>
                  <Text style={localStyles.heading}>Car VIN Numbers</Text>
                  {(modalVins && modalVins.length)?modalVins.map((vin, index) => (
                    <Text key={index} style={localStyles.vinText}>
                      {vin}
                    </Text>
                  )):''}
                  <TouchableOpacity onPress={() => setVisible(false)} style={localStyles.closeButton}>
                    <Text style={localStyles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
        </Modal>
        <View
          style={{
            backgroundColor: '#fff',
            flex: 5,
          }}>
            <TouchableOpacity
            style={{flexDirection:'row', alignItems:'center'}}
              onPress={() => handlePress(file)}>
                 <FontAwesomeIcon
                    icon={ faIdCard }
                    color="#0d5db8"
                    size={width*0.06}
                /> 
              <Text style={[commonStyle.textBlue,{marginLeft:'3%'}]}>
               {name} | {emirates_id}
              </Text>
              
            </TouchableOpacity>
          <Text style={localStyles.oldPort}>Phone: {[phone]} </Text>
          <Text style={localStyles.oldPort}>For: {type} </Text>
          <Text style={localStyles.newPort}> {notes}</Text>
          <View style={{flexDirection:'row', width: width*0.2, justifyContent:'space-between'}}>
          <Text style={[localStyles.newPort,{color: '#0093FF'}]}> {vins && vins.length != 0?vins.length+" "+strings('main.cars'):strings('main.all_cars')}</Text>
          <TouchableOpacity
              onPress = {async () => {
                await setModalVins(vins);
                setVisible(true);
              }}
              >
                <View style={{justifyContent:'center', alignItems:'center'}}>
                  <FontAwesomeIcon
                      icon={ faCarSide }
                      color="#343D40"
                      size={width*0.06}
                  />
                </View>
          </TouchableOpacity>
          </View>
        
        </View>
        <View
          style={{
            flex: 2,
            flexDirection:'column'
          }}>
          <View
            style={{
              flexDirection:'row',
              justifyContent:'center',
              alignItems:'center',
              flex:1
            }}>
              <View style={localStyles.container}>
                <Text style={localStyles.approved}> {active === 'active'? 'Active' : 'Not Active'}</Text>
                <View style={localStyles.slider}>
                  <Switch value={(active === 'active')?true:false} onValueChange={
                   async () => {
                      await setauthId(id);
                      activeRequest(active);
                    }} />
                </View>
              </View>
              {
                status == "0"?
                <View style={localStyles.container}>
                <Text style={localStyles.approved}> {''}</Text>
                <View style={localStyles.slider}>
                <TouchableOpacity
                    onPress = {async () => {
                      await setauthId(id);
                      setshowAlert(true);
                    }}>
                      <View style={{justifyContent:'center', alignItems:'center'}}>
                        <FontAwesomeIcon
                            icon={ faUserMinus }
                            color="#A30000"
                            size={width*0.06}
                        />
                      </View>
                  </TouchableOpacity>
                </View>
              </View>:<View></View>
              }
              
            </View>
            <View style={{ justifyContent:'flex-end', alignItems:'flex-end', flex:1}}>
              <Text style={localStyles.date}> {create_date}</Text>
            </View>
        </View>
      </View>
    );
  };

  const activeRequest = async active => {
    const data = {
      id: authId,
    };
    var baseUrl = '';
    if(active === 'active'){
      baseUrl = 'https://api.nejoumaljazeera.co/api/deactivateAuthorizedReceiver';
    }else {
      baseUrl = 'https://api.nejoumaljazeera.co/api/activateAuthorizedReceiver';
    }
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
        await setDeleteFlag(true);
      } else {
        alert(json.message);
      }
    } catch (error) {
      alert('Something went wrong');
    }
  };

  const deleteRequest = async id => {
    const data = {
      id: authId
    };
    const baseUrl = 'https://api.nejoumaljazeera.co/api/deleteAuthorizedReceiver';
    try {
      const request = await fetch(baseUrl, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const json = await request.json();
      if (json.success) {
        alert(json.message);
        await setshowAlert(false);
        await setDeleteFlag(true);
      } else {
        alert(json.message);
      }
    } catch (error) {
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
            onConfirmPressed={
              async () => {
                deleteRequest();
              }}
        />
        <Modal style={{backgroundColor: 'white',
                margin: 0, // This is the important style you need to set
                alignItems: undefined,
                justifyContent: undefined, flex:1,}} visible={imageVisible} transparent={true} 
          onRequestClose={() => setimageVisible(false)}>
          <ImageViewer imageUrls={fileVisible}
          enableSwipeDown="true"
          enablePreload= "true"
          backgroundColor="#000"
          renderHeader={(index) =>
              <SafeAreaView>
                      <View  style={{flexDirection:'row', zIndex: 9999}}>
                          <TouchableOpacity style={{borderRadius:25,justifyContent:'center',
                          alignItems:'center', width:50, height:50}}
                          onPress={() => setimageVisible(false)}>
                          <FontAwesomeIcon
                          icon = { faXmarkCircle } size={25} color="#fff" /></TouchableOpacity>
                      </View>
              </SafeAreaView>
          }
          loadingRender = {() => <Loader loader={true}></Loader> }
          />
        </Modal>
        {data?.length > 0 ? (
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
        )}
      </SafeAreaView>
  );
};

export default MyAuthorizedRequests;

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
    height: height * 0.20,
    padding: '5%',
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
    color: '#013188',
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
});
