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
import { faEdit, faIdCard, faTrash, faXmarkCircle, faUserMinus, faCarSide, faUpload, faFileArchive, faFileCircleCheck, faFileCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import AwesomeAlert from 'react-native-awesome-alerts';
import {useTailwind} from 'tailwind-rn';

const {width, height} = Dimensions.get('window');

const MyPaidByCustomerRequest = props => {
  const baseUrl = `https://api.nejoumaljazeera.co/api/getAllPaidByCustomersCar?customer_id=${
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
  
  const tailwind = useTailwind();

  const handlePress = (files) => {
    const images = files.map(file => ({ url: file }));
    if(images.length > 0){
      setfileVisible(images);
      setimageVisible(true);
    }
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
      notes,
      files,
      create_date,
      status, photo,
      review_notes,
      lot, vin
    } = item;

    return (
      <View style={localStyles.itemStyle} key={id}>
         <View style={{justifyContent:'center', alignItems:'center', flex:2}}>
            <Image
                style = {{
                    width: '100%',
                    height: '100%',
                    resizeMode: "cover",
                    borderRadius: 10, justifyContent:'center', alignItems:'center'
                }}
                source = {{uri: photo}}
            />
          </View>
          <View style={{justifyContent:'space-between', alignItems:'center', flex:4, textAlign:'left'}}>
              <View style={tailwind('flex-row  text-start items-start')}>
                <Text style={tailwind('   text-black text-xxs  ')}>Lot # </Text>
                <Text style={tailwind('  text-xdLightBlueDarker text-xxs  ')}>
                  {lot}
                </Text>
              </View>
              <View style={tailwind('flex-row  text-start items-start')}>
                <Text style={tailwind('   text-black text-xxs  ')}>VIN # </Text>
                <Text style={tailwind('  text-xdLightBlueDarker text-xxs  ')}>
                  {vin}
                </Text>
              </View>
              <View style={tailwind('flex-row  text-start items-start')}>
                <TouchableOpacity
                style={{flexDirection:'row', alignItems:'center'}}
                  onPress={() => handlePress(files)}>
                    <FontAwesomeIcon
                        icon={ faFileCircleExclamation }
                        color="#0d5db8"
                        size={width*0.06}
                    />
                </TouchableOpacity>
                <Text style={localStyles.newPort}> {notes} </Text>
              </View>
          </View>
        <View
          style={{
            flex: 2,
            flexDirection:'column'
          }}>
          <View
            style={{
              flexDirection:'column',
              justifyContent:'center',
              alignItems:'center',
              flex:1
            }}>
              {
              <View style={localStyles.container}>
                 <Text style={localStyles.approved}> {(status=="3")?strings('main.rejected'):status=="1"?strings('main.request_approved'):strings('main.pending')}</Text>
                  <View style={localStyles.slider}>
                  {status == "0"?
                      <TouchableOpacity
                        onPress = {async () => {
                          await setauthId(id);
                          setshowAlert(true);
                        }}>
                          <View style={{justifyContent: 'center', alignItems:'center'}}>
                             <FontAwesomeIcon
                                icon={ faTrash }
                                color="#A30000"
                                size={width*0.06}
                            />
                          </View>
                        </TouchableOpacity>:
                        (status == "3" && review_notes)?<Text style={[localStyles.approved, {color:'#A30000'}]}>{review_notes}</Text>:<View></View>}
                  </View>
              </View>
              }
            </View>
            <View style={{ justifyContent:'flex-end', alignItems:'flex-end', flex:1}}>
              <Text style={localStyles.date}> {create_date}</Text>
            </View>
        </View>
      </View>
    );
  };

  const deleteRequest = async id => {
    const data = {
      id: authId
    };
    const baseUrl = 'https://api.nejoumaljazeera.co/api/deletePaidByCustomersCar';
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
          onRequestClose={() => {
            setimageVisible(false); 
            setfileVisible([]);}}>
          <ImageViewer imageUrls={fileVisible}
          enableSwipeDown="true"
          enablePreload= "true"
          backgroundColor="#000"
          renderHeader={(index) =>
              <SafeAreaView>
                      <View  style={{flexDirection:'row', zIndex: 9999}}>
                          <TouchableOpacity style={{borderRadius:25,justifyContent:'center',
                          alignItems:'center', width:50, height:50}}
                          onPress={() => {
                            setimageVisible(false); 
                            setfileVisible([]);}}>
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

export default MyPaidByCustomerRequest;

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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: '1%',
    height: height * 0.13,
    padding: '2%',
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
