import React, {useEffect, useState, useCallback} from 'react';
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
  Modal,
  Alert
} from 'react-native';
import {AuthContext} from '../components/context';
import Loader from '../components/Loader.js';
import I18n from 'react-native-i18n';
import commonStyle from '../assets/style/styles.js';
import {strings} from '../locals/i18n';
import ImageViewer from 'react-native-image-zoom-viewer';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit, faIdCard, faTrash, faXmarkCircle, faInfoCircle, faUpload, faFileArchive, faFileCircleCheck, faFileCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import AwesomeAlert from 'react-native-awesome-alerts';
import { useTailwind } from "tailwind-rn";
import { useFocusEffect } from '@react-navigation/native';
const {width, height} = Dimensions.get('window');
import { postData } from '../utils/helper.js';
const myServiceRequest = props => {
  const baseUrl = `https://api.nejoumaljazeera.co/api/getCustomerServiceRequest`;
  // const baseUrl = `https://api.nejoumaljazeera.co/api/getAllDamageRequest?customer_id=${
  //   AuthContext.id
  // }`;
  const {navigation} = props;
  const { refresh } = props.route.params || {};
  const [loader, setLoader] = useState(true);
  const [imageVisible, setimageVisible] = useState(false);
  const [fileVisible, setfileVisible] = useState([]);
  const [showAlert, setshowAlert] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [notes, setNotes] = useState('');
  const [data, setData] = useState([]);  
  const [visible, setVisible] = useState(false);
  const [modalVins, setModalVins] = useState([]);
  const tailwind = useTailwind();

  const handlePress = (files) => {
    const images = files.map(file => ({ url: file }));
    setfileVisible(images);
    setimageVisible(true);
  };
  const fetchData = async () => {
    try {
      setLoader(true)
    let response;
    if (!AuthContext.id) {
      response = await postData(baseUrl, { licence_number: licence_number });
    } else {
      response = await postData(baseUrl, { customer_id: AuthContext.id });
    }
      setData(response.data);
      if(!response.data.length>0){
        setLoader(false)
      }
    } catch (error) {
       setLoader(false)
      console.error('Error fetching data:', error);
    }
  };
  
  const regions = [
    'Dubai','Sharjah' ,'Abu Dhabi' ,'Umm Al-Quwain' ,'Ras Al Khaimah' ,'Fujairah' ,'Ajman' 
];
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

useEffect(() => {
  if (refresh) {
    fetchData();
  }
  if (deleteFlag) {
    fetchData();
    setDeleteFlag(false);
  }
}, [refresh, deleteFlag, fetchData]);

  useEffect(() => {
    
    if (fileVisible.length > 0) {
      setimageVisible(true);
    }
   
    fetchData();

    
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

  const getStatusStyle = (status) => {
    switch (status) {
      case '1': // Approved
        return { color: colors.approvedGreen, fontWeight: 'bold', fontSize: 12 };
      case '0': // Pending
        return { color: colors.pendingYellow, fontWeight: 'bold', fontSize: 12 };
      case '2': // Rejected
        return { color: colors.rejectedRed, fontWeight: 'bold', fontSize: 12 };
      default:
        return { color: colors.textGray, fontWeight: 'bold', fontSize: 12 };
    }
  };

  const getStatusText = (status) => {
    // You will replace these with your actual status text or localization function
    switch (status) {
      case '1': return 'Approved';
      case '0': return 'Pending';
      case '2': return 'Rejected';
      default: return 'Unknown';
    }
  };

  const handleInfoPress = (notes) => {
    // Toggle the visibility of notes, or if you want to show an alert:
    Alert.alert('Notes', notes?notes:'No notes available');
    // setShowNotes(!showNotes); // Uncomment this if you want to toggle text visibility instead of showing an alert
  };
 // Define your color codes from the provided palette
 const colors = {
  approvedGreen: '#0B9A21', // A green color from your palette for approved status
  pendingYellow: '#FFB100', // A yellow color from your palette for pending status
  rejectedRed: '#A30000', // A red color from your palette for rejected status
  lightGray: '#EDEDED',
  darkGray: '#343D40',
  textGray: '#575757', // Gray color for text
  infoBlue: '#1760B2', // Blue color for info icon
};

  const renderItem = ({item}) => {
    const {
      id,request_status,
      service_name,
      service_price,
      create_date,
      payment_status,
      licence_number,  photo,  notes,region,customer_service_date
    } = item;
  
    // Define your color codes
    const statusText = request_status === "3" ? 'Rejected' : request_status === "1" ? 'Approved' : request_status === "0" ? 'Pending':"";

  // Determine currency symbol
  const currencySymbol = 'AED';

  // Format customer price and date
  const formattedPrice = `${currencySymbol} ${service_price}`;
  const formattedDate = create_date; // Adjust date formatting as needed

    return (
      
    <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 10, marginBottom: 10, borderWidth: 1, borderColor: colors.lightGray }}>
    <View style={{ flex: 1, paddingRight: 10, alignItems: 'center' }}>
      <Image
        style={{ width: '100%', height: 100, resizeMode: 'cover', borderRadius: 2 }}
        source={{ uri: photo || 'https://picsum.photos/536/354' }}
      />
      {/* Status text under the image */}
      <Text style={getStatusStyle(request_status)}>
        {statusText}
      </Text>
      {/* Info icon to show notes */}
      <TouchableOpacity onPress={async () => {
        await setNotes(notes);
        handleInfoPress(notes)}}>
        <FontAwesomeIcon icon={faInfoCircle} color={colors.infoBlue} size={24} />
      </TouchableOpacity>
      {showNotes && (
            <Text style={{ color: colors.darkGray, fontSize: 10, marginTop: 4 }}>
              {notes}
            </Text>
          )}
        </View>
        <View style={{ flex: 3, flexDirection: 'column' }}>
          <Text style={{ color: colors.infoBlue, marginBottom: 5, fontSize: 16, fontWeight: 'bold' }}>
            {licence_number}
          </Text>
          <Text style={{ color: colors.textGray, fontSize: 12 }}>
            {`Service Name: ${service_name} Service`}
          </Text>
          <Text style={{ color: colors.textGray, fontSize: 12 }}>
            {`Payment Status: ${(payment_status==1||payment_status=='successful')?'Paid':'UnPaid'}`}
          </Text>
          <Text style={{ color: colors.textGray, fontSize: 12 }}>
            {`Region: ${regions[region]}`}
          </Text>
          
          {service_price?
          <Text style={{ color: colors.approvedGreen, fontSize: 12}}>
          {`Amount Paid: ${formattedPrice} `}
          </Text>:''}
          {/* Customer date at the bottom */}
          {formattedDate?<Text style={{ color: colors.darkGray, fontSize: 12,marginBottom: 5}}>
            {`response at: ${formattedDate}`}
          </Text>:''}
          <Text style={{ textAlign: 'right', color: colors.infoBlue, fontSize: 12 }}>
            {create_date}
          </Text>
        </View>
      </View>
    );
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
        ) : loader && data?.length > 0? (
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

export default myServiceRequest;

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
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: '1%',
    height: height * 0.17,
    padding: '1%',
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
