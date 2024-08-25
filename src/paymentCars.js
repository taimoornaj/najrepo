import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';
import {AuthContext} from '../components/context';
import Loader from '../components/Loader.js';
import I18n from 'react-native-i18n';
import commonStyle from '../assets/style/styles.js';
import {strings} from '../locals/i18n';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faInfo, faInfoCircle, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import AwesomeAlert from 'react-native-awesome-alerts';
import Modal from 'react-native-modal';
import CarCard from "../components/molecules/CarCard";

const {width, height} = Dimensions.get('window');

const PaymentCars = props => {
  const baseUrl = `https://api.nejoumaljazeera.co/api/getAllOnlinePayment?customer_id=${
    AuthContext.id
  }`;
  const {navigation} = props;
  const [loader, setLoader] = useState(true);
  const [loaderInside, setloaderInside] = useState(false);
  const [visibleDetails, setModalVisibleDetails] = useState(false);
  const [data, setData] = useState([]);
  const [dataDetails, setDataDetails] = useState([]);
  const [showAlert, setshowAlert] = useState(false);
  const [paymentId, setpaymentId] = useState(0);

  const getDetails = async (paymentId) => {
    if(!paymentId){
      setloaderInside(false);
      setModalVisibleDetails(false);
      return;
    }
    var Url = "https://api.nejoumaljazeera.co/api/getPaymentDetails?payment_id="+paymentId;
    try {
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
          setloaderInside(false);
          setDataDetails(response.data);
        }
        else {
          setloaderInside(false);
          return;
        }
      })
      .catch((error) => {
          setloaderInside(false);
          Alert.alert('Error', error, [
              {text: 'Okay'}
          ]);
      });
    } catch (error) {
      console.log('Error uploading file:', error);
    }
  };

  useEffect(() => {
    const fetcher = async () => {
      setLoader(true);
      const response = await fetch(baseUrl);
      try {
        const json = await response.json();
        if (json?.data?.length > 0) {
          setLoader(false);
          return json.data;
        }
        return [];
      } catch (error) {
        setLoader(false);
        return [];
      }
    };
    fetcher().then(data => {
      setData(data);
      setLoader(false);
    });
  }, [baseUrl, navigation]);

  const renderItem = ({item}) => {
    let {
      payment_id,
      AccountName,
      cars_count,
      request_status,
      request_notes,
      payment_date,
      role_label_notes,
      role_label,
      total,
      name_en,
      name_ar
    } = item;

    return (
      <View style={localStyles.itemStyle} key={payment_id}>
        <View
          style={{
            backgroundColor: '#fff',
            flex: 5,
          }}>
          <Text style={[commonStyle.textBlue, {fontSize: 14}]}>
            AED {Number(total).toLocaleString()}
          </Text>
          <Text style={localStyles.oldPort}>From: {(AccountName)?(I18n.locale == 'en')?name_en:name_ar:''}</Text>
          <View style={{flexDirection:'row', flex:1}}>
          <TouchableOpacity
              onPress = {async () => {
                await setModalVisibleDetails(true);
                await setloaderInside(true);
                await setpaymentId(payment_id);
                getDetails(payment_id);
              }}
              style={{flexDirection:'row', flex:1}}
              ><Text style={localStyles.newPort}>To: {cars_count} {strings('main.cars')} </Text>
              <FontAwesomeIcon
                  icon={ faInfoCircle }
                  color="#013188"
                  style={{marginTop:5 }}
                  size={width*0.04}
                />
                </TouchableOpacity>
                </View>
        </View>
        <View
          style={{
            flex: 2,
          }}>
          {role_label == 0 && request_status == 0 ? (
            <TouchableOpacity
              onPress = {async () => {
                await setpaymentId(payment_id);
                setshowAlert(true);
              }}
              >
                <View style={{justifyContent:'center', alignItems:'center'}}>
                  <FontAwesomeIcon
                      icon={ faTrash }
                      color="#A30000"
                      size={width*0.06}
                  />
                </View>
             
            </TouchableOpacity>
          ) : role_label == 2 ? (
            <TouchableOpacity
              onPress = { () => {
                Alert.alert('Info', role_label_notes, [
                  {text: 'Okay'}
                ]);
              }}
              >
                <View style={{justifyContent:'center', alignItems:'center'}}>
                  <Text style={[localStyles.approved, {color: '#A30000'}]}>
                    {strings('main.rejected')}
                  </Text>
                </View>
            </TouchableOpacity>
          ) : request_status == 2 ? (
            <TouchableOpacity
              onPress = { () => {
                Alert.alert('Info', request_notes, [
                  {text: 'Okay'}
                ]);
              }}
              >
                <View style={{justifyContent:'center', alignItems:'center'}}>
                  <Text style={[localStyles.approved, {color: '#A30000'}]}>
                    {strings('main.rejected')}
                  </Text>
                  <FontAwesomeIcon
                    icon={ faInfoCircle }
                      color="#A30000"
                      style={{marginTop:5 }}
                      size={width*0.04}
                    />
                </View>
            </TouchableOpacity>
          ):(
            <Text style={localStyles.approved}>
              {strings('main.request_approved')}
            </Text>
          )}
          <View style={{flex:1, justifyContent:'flex-end'}}>
              <Text style={localStyles.date}> {payment_date} </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderItemDetails = ({item}) => {
    var dataDetails = {};
    dataDetails.id              = item.id;
    dataDetails.vin       = item.vin;
    dataDetails.type    = 'favorit';
    dataDetails.lotnumber       = item.lotnumber;
    dataDetails.aTitle = item.auction_title;
    dataDetails.year            = item.year;
    dataDetails.image_small     = "https://cdn.nejoumaljazeera.co/uploads/"+item.photo;
    dataDetails.carModelName    = (item.carModelName.substr(0,item.carModelName.indexOf(' ')) != '')?
    item.carModelName.substr(0,item.carModelName.indexOf(' ')):item.carModelName;
    dataDetails.carMakerName    = item.carMakerName;
    dataDetails.purchasedate    = item.purchasedate;

    const actions={}
    return (
      <View style={{flex:1}}>
        <CarCard data={dataDetails} actions={actions} props={this.props}/>
      </View>
    );
  };

  

  const deleteRequest = async id => {
    const data = {
      id: id,
    };
    const baseUrl =
      'https://api.nejoumaljazeera.co/api/deletePaymentRequest';
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
        navigation.navigate('paymentCars');
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
         <Modal
            backdropOpacity={0.3}
            isVisible={visibleDetails}
            onBackdropPress={() => setModalVisibleDetails(false)}
            style={localStyles.contentView}>
              {!loaderInside?
            
                <View style={[localStyles.content]}>
                 <View style={{flexDirection:'row', margin:'3%'}}>
                      <Text style={[commonStyle.headerText, {color: '#0b4282'}]}>{strings('car.car_details')}</Text>
                  </View>
                  {dataDetails?.length > 0 ? (
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      style={{paddingHorizontal: 10}}
                      data={dataDetails}
                      initialNumToRender={10000}
                      windowSize={20}
                      maxToRenderPerBatch={10000}
                      getItemLayout={(dataDetails, index) => ({
                        length: width,
                        offset: width * index,
                        index,
                      })}
                      removeClippedSubviews={true}
                      keyExtractor={item => item.id}
                      renderItem={renderItemDetails}
                      ListFooterComponentStyle={{marginTop: height * 0.1}}
                    />
                  ) : loaderInside ? (
                    <View style={localStyles.loaderStyle}>
                      <Loader loader={true} />
                    </View>
                  ) : (
                    <View style={localStyles.loaderStyle}>
                      <Text
                        style={{
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
                </View>
              : 
            <View style={{ flex:1}}>
                <Loader loader={loaderInside}></Loader>
            </View>}
        </Modal>
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
            onConfirmPressed={() => deleteRequest(paymentId)}
          />
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
              style={{
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

export default PaymentCars;

const localStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  contentView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  itemStyle: {
    flex: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: '1%',
    height: height * 0.16,
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
    justifyContent:'flex-end',
    alignItems:'flex-end',
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
  trash: {
      height: 25,
      width: 25,
  },
  content: {
    flex:0.8,
    backgroundColor: 'white',
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
},
});