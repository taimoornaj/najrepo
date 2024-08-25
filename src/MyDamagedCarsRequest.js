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

const {width, height} = Dimensions.get('window');

const MyDamagedCarsRequest = props => {
  const baseUrl = `https://api.nejoumaljazeera.co/api/getAllDamageRequest?customer_id=${
    AuthContext.id
  }`;
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

  const handleInfoPress = () => {
    // Toggle the visibility of notes, or if you want to show an alert:
    Alert.alert('Notes', notes || 'No notes available');
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
      id, cu_notes, photo, created_date, customer_status,
      request_number, carMakerName, carModelName, year, lotnumber, vin, notes,
      currency, customer_date, customer_price
    } = item;
  
    // Define your color codes
    const statusText = customer_status === "3" ? 'Rejected' : customer_status === "1" ? 'Approved' : 'Pending';

  // Determine currency symbol
  const currencySymbol = currency === '1' ? 'AED' : currency === '2' ? '$' : '';

  // Format customer price and date
  const formattedPrice = `${currencySymbol} ${customer_price}`;
  const formattedDate = customer_date; // Adjust date formatting as needed

    return (
      
    <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 10, marginBottom: 10, borderWidth: 1, borderColor: colors.lightGray }}>
    <View style={{ flex: 1, paddingRight: 10, alignItems: 'center' }}>
      <Image
        style={{ width: '100%', height: 100, resizeMode: 'cover', borderRadius: 2 }}
        source={{ uri: photo || '' }}
      />
      {/* Status text under the image */}
      <Text style={getStatusStyle(customer_status)}>
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
            {request_number}
          </Text>
          <Text style={{ color: colors.textGray, fontSize: 12 }}>
            {`${carMakerName} ${carModelName} ${year}`}
          </Text>
          <Text style={{ color: colors.textGray, fontSize: 12 }}>
            {`Lot: ${lotnumber}`}
          </Text>
          <Text style={{ color: colors.textGray, fontSize: 12 }}>
            {`VIN: ${vin}`}
          </Text>
          <Text style={{ color: colors.textGray, fontSize: 12, marginBottom: 5 }}>
            {cu_notes}
          </Text>
          {customer_price?
          <Text style={{ color: colors.approvedGreen, fontSize: 12}}>
          {`Amount: ${customer_price}`}
          </Text>:''}
          {/* Customer date at the bottom */}
          {formattedDate?<Text style={{ color: colors.darkGray, fontSize: 12,marginBottom: 5}}>
            {`response at: ${formattedDate}`}
          </Text>:''}
          <Text style={{ textAlign: 'right', color: colors.infoBlue, fontSize: 12 }}>
            {created_date}
          </Text>
        </View>
      </View>
    );
  };


  const renderItem22 = ({item}) => {
    let {
      id,
      cu_notes,
      files,
      created_date,
      customer_status,
      request_number,
      carMakerName,
      carModelName,
      photo,
      year,
      lotnumber,
      vin,
      notes
    } = item;

    return (
      <View style={localStyles.itemStyle} key={id}>
        <View
          style={{
            backgroundColor: '#fff',
            flex: 5,
          }}>
            <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
              <Text style={[commonStyle.textBlue,{marginLeft:'3%'}]}>
                {request_number}
              </Text>
            </View>
            <View style={{flex:0.5, flexDirection:'row', borderBottomColor:'#0d2750',
               backgroundColor:'#EDEDED',
               borderTopWidth:0.5, borderTopColor:'#0d2750', borderBottomWidth:0.5, padding:'1%'}}>
                 <TouchableOpacity
                   animation = "fadeInRight"
                   duration  = {1000}
                   style={{flex:0.4, borderRadius: 10, justifyContent:'flex-start', alignItems:'flex-start'}}>
                   <Image
                     style = {{
                       marginTop: '6%',
                       width: '100%',
                       height: '85%',
                       resizeMode: "contain",
                       borderRadius: 2
                     }}
                     source = {{uri: (photo)?(photo):''}}
                   />
                 </TouchableOpacity>
                 {I18n.locale == 'ar'?
                   <View
                     animation = "fadeInRight"
                     duration  = {1000}
                     style={{flex:1, justifyContent:'flex-start', alignItems:'flex-start'}}
                   >
                     <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                       <Text style={tailwind('text-darkblue ml-3 flex-start font-bold text-md capitalize flex-1 text-left ')}>
                         {year + " "+carMakerName  + " " + carModelName}
                       </Text>
                     </View>
                     <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                       <Text style={tailwind('text-lightblue ml-3 flex-start font-bold text-xxs capitalize flex-1 text-left ')}>
                         { strings('car.lotnumber') +" # " + lotnumber}
                       </Text>
                     </View>
 
 
                     <View style={tailwind('flex-row justify-between   text-start items-start')}>
                       <Text style={tailwind('flex-initial  w-[3rem]     ml-3 text-xxxs  ')}>{strings('car.vin')} </Text>
                       <Text style={tailwind('flex-initial  ml-3   text-xxxs  ')}>
                         {vin}{' '}
                       </Text>
                     </View>
                     <View style={tailwind('flex-row justify-between   text-start items-start')}>
                       <Text style={tailwind('flex-initial    w-[3rem]    ml-3 text-xxxs  ')}>{strings('main.model')} </Text>
                       <Text style={tailwind('flex-initial  ml-3   text-xxxs  ')}>
                         {carModelName}{' '}
                       </Text>
                     </View>
 
                     <View style={tailwind('flex-row justify-between   text-start items-start')}>
                       <Text style={tailwind('flex-initial     w-[3rem]       ml-3 text-xxxs  ')}>{strings('main.maker')} </Text>
                       <Text style={tailwind('flex-initial  ml-3   text-xxxs  ')}>
                         {carMakerName}{' '}
                       </Text>
                     </View>
                     <View style={tailwind('flex-row justify-between   text-start items-start')}>
                       <Text style={tailwind('flex-initial     w-[3rem]    ml-3 text-xxxs  ')}>{strings('main.year')} </Text>
                       <Text style={tailwind('flex-initial  ml-3   text-xxxs  ')}>
                         {year}{' '}
                       </Text>
                     </View>
                   </View>:
                   <View
                     style={{flex:1, justifyContent:'flex-start', alignItems:'flex-start'}}>
                     <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                       <Text style={tailwind('text-darkblue ml-3 flex-start font-bold text-md capitalize flex-1 text-left ')}>
                         {year + " "+ carMakerName  + " " + carModelName}
                       </Text>
                     </View>
                     <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                       <Text style={tailwind('text-lightblue ml-3 flex-start font-bold text-xxs capitalize flex-1 text-left ')}>
                         { strings('car.lotnumber') +" # " + lotnumber}
                       </Text>
                     </View>
                     <View style={tailwind('flex-row justify-between  ml-3 text-start items-start')}>
                       <Text style={tailwind('flex-initial w-[9rem] text-xxxs  ')}>{strings('car.vin')} </Text>
                       <Text style={tailwind('flex-initial  w-[15rem]  text-xxxs  ')}>
                         {vin}{' '}
                       </Text>
                     </View>
                     <View style={tailwind('flex-row justify-between  ml-3 text-start items-start')}>
                       <Text style={tailwind('flex-initial w-[9rem] text-xxxs  ')}>{strings('main.model')} </Text>
                       <Text style={tailwind('flex-initial  w-[15rem]  text-xxxs  ')}>
                         {carModelName}{' '}
                       </Text>
                     </View>
                     <View style={tailwind('flex-row justify-between  ml-3 text-start items-start')}>
                       <Text style={tailwind('flex-initial w-[9rem] text-xxxs  ')}>{strings('main.maker')} </Text>
                       <Text style={tailwind('flex-initial  w-[15rem]  text-xxxs  ')}>
                         {carMakerName}{' '}
                       </Text>
                     </View>
                     <View style={tailwind('flex-row justify-between  ml-3 text-start items-start')}>
                       <Text style={tailwind('flex-initial w-[9rem] text-xxxs  ')}>{strings('main.year')} </Text>
                       <Text style={tailwind('flex-initial  w-[15rem]  text-xxxs  ')}>
                         {year}{' '}
                       </Text>
                     </View>
 
                   </View>
                 }
               </View>
          
            
          <Text style={localStyles.newPort}> {cu_notes} </Text>
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
                 <Text style={localStyles.approved}> {(customer_status=="2")?strings('main.rejected'):customer_status=="1"?strings('main.request_approved'):strings('main.pending')}</Text>
                  <View style={localStyles.slider}>
                  {customer_status == "2"?
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
                        (customer_status == "3" && notes)?<Text style={[localStyles.approved, {color:'#A30000'}]}>{notes}</Text>:<View></View>}
                  </View>
              </View>
              }
            </View>
            <View style={{ justifyContent:'flex-end', alignItems:'flex-end', flex:1}}>
              <Text style={localStyles.date}> {created_date}</Text>
            </View>
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

export default MyDamagedCarsRequest;

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
