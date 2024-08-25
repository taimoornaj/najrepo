import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import * as Localize from 'react-native-localize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import Loader from '../components/Loader.js';
import ModalMsg from '../components/ModalMsg.js';
import I18n from 'react-native-i18n';
import * as Animatable from 'react-native-animatable';
import { useTailwind } from 'tailwind-rn';
import WithTailwindHook from '../components/hooks/WithTailwindHook';
const { width, height } = Dimensions.get('window');
import commonStyle from '../assets/style/styles';
// redux 
import { Badge } from 'react-native-elements';
import SelectBox1 from '../components/SelectBox1.js';
import StyledInput2 from '../components/molecules/StyleInput2.js';
// import { Badge } from "react-native-paper";
const ContactusCompany = ({ navigation }) => {
  const tailwind = useTailwind();
  const [loader, setLoader] = useState(false);
  const [msg, setMsg] = useState('');
  const [lotNo, setLotNo] = useState('');
  const [subject, setSubject] = useState('');
  // const [selectedComplaintType, setSelectedComplaintType] = useState(40);
  // const [complaintTypes, setComplaintTypes] = useState('');
  const [chatStatuses, setChatStatuses] = useState([]);
  const [activeFilter, setActiveFilter] = useState(0);
  const [modalmsg, setModalMsg] = useState(false);
  const [pageload, setPageload] = useState('');
  const [selectedValChat, setSelectedValChat] = useState({});

  const formatDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleFirstChat = (complaint_message_id) => {
    let  subjectd="";
    if(I18n.locale=='ar'){
      subjectd= `${lotNo?lotNo:'أحتاج للمساعدة'}`;
    
    }else{
      subjectd= `${lotNo?lotNo:'Need for assistance'}`;
    }
    // setSelectedComplaintType('');
    // setMsg('');
    const complaint_created_at = formatDateTime();
    // if (selectedComplaintType == 40) {
      navigation.navigate('complaintsDetailsWrapper', {  'title':lotNo?lotNo:subjectd,'complaint_message_id': complaint_message_id, 'lot_vin': lotNo?lotNo:'', 'complaint_type': 40, 'FirstAdd': 1, 'complaint_created_at': complaint_created_at });
      // setLotNo('');
      // return ;
    // } else {
    //   return navigation.navigate('complaints');
    // }

  };
  const setMDefaultInputs=(lotNo)=>{
    let  msgd="";
    let  subjectd="";
    let  lotNod=lotNo;
    if(I18n.locale=='ar'){
      msgd = `مرحباً، أحتاج إلى المساعدة ${lotNod ? ' بخصوص اللوت: ' + lotNod : ''} يرجى المساعدة. شكراً!`;
      subjectd="أحتاج للمساعدة";
    }else{
      msgd=`Hi, I need help ${lotNod?'with Lot: '+lotNod:''} Please assist. Thank you!`;
      subjectd="Need for assistance";
    }

    setSubject(subjectd)
    setMsg(msgd)
  }
  useEffect(() => {
    fetchComplaintTypes();
    fetchComplaintStatusCounts();

  }, []);
  const fetchComplaintTypes = async () => {
    try {
      const response = await fetch('https://api.nejoumaljazeera.co/api/complaintTypes');
      const data = await response.json();
      const formattedData = data.map(item => {
        const formattedItem = { key: item.id, value: I18n.locale == 'ar' ? item.title_ar : item.title_en };
      
        if (formattedItem.key == 40) {
          // alert("DFG")
          setSelectedValChat( {key:formattedItem.key, value: formattedItem.value });
        }
      
        return formattedItem; 
      });      
      

      setComplaintTypes(formattedData);
    } catch (error) {
      console.error('Error fetching complaint types:', error);
      // Alert.alert('Error', 'Failed to fetch complaint types.', [{ text: 'Okay' }]);
    }
  };
  const fetchComplaintStatusCounts = async () => {
    try {
        const response = await fetch(`https://api.nejoumaljazeera.co/api/complaintMessageStatuses?customer_id=${AuthContext.id}`);
        const data = await response.json();
        setChatStatuses(data.data)
    } catch (error) {
        Alert.alert('Error', 'Failed to fetch complaint Statuses.', [{ text: 'Okay' }]);
      return;
    }
  };

  const Row2Text = ({ value, locale, title }) => {
    return (
      <View style={{  flexDirection: (I18n.locale === 'ar') ? 'row-reverse' : 'row', marginVertical: '2%' }}>
        <View>
          <Text
            style={{
              color: '#343D40',
              textAlign: locale == 'en' ? 'left' : 'right',
              textTransform: 'capitalize',
              marginLeft: '4%',
              marginBottom: '2%', fontSize: width * 0.037,
              fontWeight: '500'
            }}>
            {strings(title)+" "}:
          </Text>
        </View>
        <Text style={{ color: '#343D40', textAlign: locale == 'en' ? 'left' : 'right', textTransform: 'capitalize', fontSize: width * 0.035 }}>
          {value ? value : ''}
        </Text>
      </View>
    );
  };


  const sendMsg = () => {

    // if (lotNo=='') {
    //   setLoader(false);
    //   Alert.alert('Error', strings('main.fillform'), [{ text: 'Okay' }]);
    //   return;
    // }
    setMDefaultInputs(lotNo);
    setLoader(true);
    let  msgd="";
    let  subjectd="";
    let  lotNod=lotNo;
    if(I18n.locale=='ar'){
      msgd = `مرحباً، أحتاج إلى المساعدة ${lotNod ? ' بخصوص اللوت: ' + lotNod : ''} يرجى المساعدة. شكراً!`;
      subjectd="أحتاج للمساعدة";
    }else{
      msgd=`Hi, I need help ${lotNod?'with Lot: '+lotNod:''} Please assist. Thank you!`;
      subjectd="Need for assistance";
    }


    var Url = 'https://api.nejoumaljazeera.co/api/submitComplaintNoAuth';
    const formData = new FormData();
    // formData.append('client_id', '1230');
    // formData.append('client_secret', '1230NEJOUM1230');
    formData.append('customer_id', AuthContext.id);
    formData.append('complaint_type', 40);
    formData.append('lot_vin', lotNo?lotNo:'');
    formData.append('subject', lotNo?lotNo:subjectd);
    formData.append('message', msgd);
    fetch(Url, {
      method: 'POST',
      credentials: 'same-origin',
      body: formData,
    })
      .then(response => {
        if (response.ok) {
          return response;
        }
        throw Error(response.success);
      })
      .then(res => res.json())
      .then(response => {
        if (response.success) {
          setLoader(false);
        
          // Alert.alert('Success', strings('main.send_success'), [{ text: 'Okay' }]);
          if (true) {
            // getComplaintMessageId()
            //   .then(complaintMessageId => {
            //     // Do something with the complaintMessageId
                handleFirstChat(response.message_id);
            //   })
            //   .catch(error => {
            //     // Handle error here
            //     console.error('Error getting complaint message ID:', error);
            //   });

            // return;
          } else {
            navigation.navigate('complaints');
          }

        } else {
          setLoader(false);
          setMsg(strings('main.faild'));
          Alert.alert('Error', strings('main.faild'), [{ text: 'Okay' }]);
          return;
        }
      })
      .catch(error => {
        setLoader(false);
        // setMsg(strings('main.network_error'));
        // Alert.alert('Error', strings('main.network_error'), [{ text: 'Okay' }]);
      });
  };
  function getComplaintMessageId() {
    const url = 'https://api.nejoumaljazeera.co/api/complaintMessageId';

    const formData = new FormData();
    formData.append('customer_id', AuthContext.id);
    formData.append('lot_vin', lotNo);
    formData.append('message', msg);
    formData.append('title', subject);

    return fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        return data.complaint_message_id;
      })
      .catch(error => {
        console.error('Error:', error);
        throw error; // Rethrow the error to be caught by the caller
      });
  }
  const handleFilterPress = (complaint_status) => {
    navigation.navigate('complaints',{filter: complaint_status });
  }
  if (loader) {
    return <Loader loader={loader} />;
  }
  if (modalmsg) {
    return <ModalMsg msg={msg} modalmsg={modalmsg} page={pageload} />;
  }

  return (
    <SafeAreaView style={[tailwind('h-full'), { backgroundColor: '#f1f1f1', borderBottomColor: 'rgba(0,0,0,0.6)', borderBottomWidth: 0.45 }]}>
      <KeyboardAwareScrollView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, {}]}>

        <ScrollView style={{ paddingTop: '5%', paddingBottom: '10%' }}>
          <View style={tailwind('col')}>
            <View style={tailwind('col mt-6 mx-6 ')}>
              <View style={{ flex: 1, marginBottom: 5, marginTop: 3 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 0, marginBottom: 3 }}>
                        <TouchableOpacity
                            style={[tailwind(`${'mt-3 bg-white shadow-lg'} 
                            flex-row p-2 align-center text-center rounded-lg  
                            justify-center content-center items-center flex-1`),{
                              shadowColor: '#000',
                              marginHorizontal:1.8,
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.2,
                              shadowRadius: 1,
                              elevation: 1,
                              backgroundColor: '#FFF',
                              width: '23.5%',
                              alignItems: 'center',
                              justifyContent:'center',
                              padding: 5,
                              borderRadius: 5,}]}
                            onPress={() => handleFilterPress(1)}>
                              
                            <Text style={tailwind(`${'text-xdDarkblue '} text-center text-xxs flex-1 font-bold`)}> {strings('main.pending')} 
                            </Text>
                            <View style={{position:'absolute',top:-7, right:2}}>
                              <Badge value={chatStatuses?.pending > 99  ? '99+' : chatStatuses?.pending || 0}
                                  textStyle={tailwind('text-xxxs p-0.5 text-white')}
                                  badgeStyle={[{backgroundColor: '#ffa300'}]}>
                            </Badge></View>
                          </TouchableOpacity>
                            <TouchableOpacity
                                style={[tailwind(`${'mt-3 bg-white shadow-lg'} 
                                flex-row p-2 align-center text-center rounded-lg  
                                justify-center content-center items-center flex-1`),{
                                  shadowColor: '#000',
                                  marginHorizontal:1.8,
                                  shadowOffset: { width: 0, height: 2 },
                                  shadowOpacity: 0.2,
                                  shadowRadius: 1,
                                  elevation: 1,
                                  backgroundColor: '#FFF',
                                  width: '23.5%',
                                  alignItems: 'center',
                                  justifyContent:'center',
                                  padding: 5,
                                  borderRadius: 5,}]}
                                onPress={() => handleFilterPress(3)}>
                                <Text
                                      style={tailwind(`${'text-xdDarkblue '} text-center text-xxs flex-1 font-bold`)}>
                      {strings('main.waitingonCustomer')} </Text>
                                    <View style={{position:'absolute',top:-7, right:2}}><Badge value={chatStatuses?.waitingonCustomer > 99  ? '99+' : chatStatuses?.waitingonCustomer || 0}
                                          textStyle={tailwind('text-xxxs p-0.5 text-white')}
                                          badgeStyle={[{backgroundColor: '#ffa300'}]}>
                                    </Badge></View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[tailwind(`${'mt-3 bg-white shadow-lg'} 
              flex-row p-2 align-center text-center rounded-lg  
              justify-center content-center items-center flex-1`),{
                shadowColor: '#000',
                marginHorizontal:1.8,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 1,
                elevation: 1,
                backgroundColor: '#FFF',
                width: '23.5%',
                alignItems: 'center',
                justifyContent:'center',
                padding: 5,
                borderRadius: 5}]}
                onPress={() => handleFilterPress(0)}>
              <Text
                style={tailwind(`${'text-xdDarkblue '} text-center text-xxs flex-1 font-bold`)}>

{strings('main.open')} </Text>
              <View style={{position:'absolute',top:-7, right:2}}><Badge value={chatStatuses?.open > 99  ? '99+' : chatStatuses?.open || 0}
                     textStyle={tailwind('text-xxxs p-0.5 text-white')}
                     badgeStyle={[{backgroundColor: '#ffa300'}]}>
              </Badge></View>
            </TouchableOpacity>
                                             <TouchableOpacity
              style={[tailwind(`${'mt-3 bg-white shadow-lg'} 
              flex-row p-2 align-center text-center rounded-lg  
              justify-center content-center items-center flex-1`),{
                shadowColor: '#000',
                marginHorizontal:1.8,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 1,
                elevation: 1,
                backgroundColor: '#FFF',
                width: '23.5%',
                alignItems: 'center',
                justifyContent:'center',
                padding: 5,
                borderRadius: 5,}]}
              onPress={() => handleFilterPress(2)}>
              <Text
                style={tailwind(`${'text-xdDarkblue '} text-center text-xxs flex-1 font-bold`)}>

{strings('main.closed')} </Text>
              <View style={{position:'absolute',top:-7, right:2}}><Badge value={chatStatuses?.closed > 99  ? '99+' : chatStatuses?.closed || 0}
                     textStyle={tailwind('text-xxxs p-0.5 text-white')}
                     badgeStyle={[{backgroundColor: '#ffa300'}]}>
              </Badge></View>
            </TouchableOpacity>

                                       
                                    </View>
                                </View>
              <View
                style={[{
                  marginTop: '4%',
                  marginBottom: '4%',
                }, styles.row, styles.crossAxisCenter, styles.mainAxisCenter]}>
                <Text style={{ color: '#343D40', textAlign: I18n.locale == 'en' ? 'left' : 'right' }}>
                  {strings('main.contactus_message')}
                </Text>
              </View>
              <View style={[ {  flexDirection: (I18n.locale === 'ar') ? 'row-reverse' : 'row',justifyContent: 'space-between', width: '100%', marginVertical: '4%', flexWrap: 'wrap' }]}>
                {/* Text */}
                <View style={{ marginTop: 10, flex: 0.8 }}>
                  <Row2Text title="main.name" value={AuthContext.name} locale={I18n.locale} />
                  <Row2Text title="main.phone" value={AuthContext.phone} locale={I18n.locale} />
                </View>
                {/* Icon */}
                <View style={[styles.crossAxisCenter, styles.mainAxisCenter, { marginTop: AuthContext.name.length > 10 ? 10 : 0, marginTop: 10, }]}>
                  <View style={[styles.crossAxisCenter, styles.mainAxisCenter, { flexDirection: (I18n.locale === 'ar') ? 'row-reverse' : 'row'}]}>
                    <FontAwesomeIcon icon={faCheckCircle} size={width * 0.06} color="#3ac4a9" />
                    <Text style={{ fontSize: width * 0.035,  marginLeft: (I18n.locale === 'ar') && 6,marginRight: (I18n.locale === 'ar') && 6, color: '#3ac4a9', fontWeight: '600' }}>{strings('main.verified')}</Text>
                  </View>
                  <Image
                    source={require('../assets/customer-service2.png')}
                    style={[tailwind(), { height: width * 0.15, width: width * 0.15, resizeMode: 'contain', marginVertical: 5 }]}
                  />
                  <Text style={{ textAlign: I18n.locale == 'ar' ? 'right' : 'left', width: width * 0.3, fontSize: width * 0.027, textAlign: 'center' }}>{strings('main.for_more_Support_call')}</Text>
                  <Text style={{ textAlign: I18n.locale == 'ar' ? 'right' : 'left', width: width * 0.3, fontSize: width * 0.027, textAlign: 'center' }}>{strings('main.for_call_no')}</Text>

                </View>
</View>
              <View></View>

              {/* Form */}

              <View style={{ marginTop: '5%' }}>

              <Animatable.View animation="fadeInDown" style={{marginBottom:0}}>
                  <StyledInput2 val={lotNo} setVal={setLotNo} setErrorVal={null} placeholder={strings('car.lotnumber')} I18n={I18n} width={width} keyboardType={'number-pad'} />
                </Animatable.View>
                {/* <Animatable.View animation="fadeInDown" style={{marginTop:5  }}>
                  <StyledInput2 val={subject} setVal={setSubject} setErrorVal={null} placeholder={strings('main.subject')} I18n={I18n} width={width} />
                </Animatable.View> */}
                {/* <Animatable.View animation="fadeInDown">
                  <SelectBox1 data={complaintTypes} val={selectedComplaintType} setErrorVal={null} placeholder={strings('main.select_type')} selectedVal={setSelectedComplaintType} selectedValChat={selectedValChat} />
                </Animatable.View> */}
              </View>
              {/* <Animatable.View animation="fadeInDown">
              <KeyboardAwareScrollView>
                <View style={[tailwind('rounded mb-4 p-1 pt-1 flex-row-reverse mt-0'), { backgroundColor: '#fff', borderWidth: 0.3, borderColor: '#7a7a7a' }, styles.mainShadow]}>
                  <TextInput
                    placeholder={strings('main.write_somthing')}
                    placeholderTextColor="#7a7a7a"
                    value={msg}
                    style={[tailwind(`flex-1 text-xs text-gray rounded px-3 py- ${I18n.locale == 'ar' ? 'text-right ' : 'text-right text-left'} ${Platform.OS === 'ios' ? 'mt-2' : ''}    `), { textAlignVertical: 'top', fontSize: width * 0.035, height: height * 0.108, marginTop: 10, },]}
                    multiline={true}
                    numberOfLines={height * 0.008}
                    autoCapitalize="none"
                    onChangeText={val => setMsg(val)}
                  />
                </View>
                </KeyboardAwareScrollView>
              </Animatable.View> */}
              <Animatable.View animation="fadeInDown"
                duration={1000}>
                <View style={styles.actionButton}>
                  
                  <TouchableOpacity
                    activeOpacity={1}
                    style={[tailwind(`bg-lightblue text-white text-center text-white text-lg my-1 py-3 shadow-lg ${I18n.locale == 'ar' ? 'ml-2' : 'mr-2'} `), { paddingHorizontal: '10%', borderRadius: 50 }, styles.mainShadow]}
                    // onPress = {() => navigation.navigate('complaintsDetails', {'complaint_message_id': 15884, 'title': 'فقدان مفتاح السيارة'})
                    onPress={sendMsg}
                  >
                    <Text style={[tailwind('text-white'), { fontSize: width * 0.035, fontWeight: 'bold' }]}>{strings('main.send')}</Text>
                  </TouchableOpacity>
              
                </View>
              </Animatable.View>
              <View>
              </View>

            </View>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
export const SelectListCompo = ({
  setSelected,
  selectedItem,
  data,
  placeholder
  , arrowicon
  , dropdownOpen, setDropdownOpen
}) => {
  return (
    <View style={styles.boxStyles}>
      <TouchableOpacity onPress={() => setDropdownOpen(true)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.inputStyles}>{selectedItem || placeholder}</Text>
        {arrowicon}
      </TouchableOpacity>
      {dropdownOpen && (
        <View style={styles.dropdownStyles}>
          {data.map(item => (
            <TouchableOpacity key={item[save]} onPress={() => setSelected(item)}>
              <Text>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flex: 1
  },
  row: {
    flexDirection: 'row',
  },
  crossAxisCenter: {
    alignItems: 'center',
  },
  mainAxisCenter: {
    justifyContent: 'center',
  },
  mainAxisCenter: {
    justifyContent: 'space-between',
  },
  actionFlexDirection: {
    flexDirection: I18n.locale == 'ar' ? 'row-reverse' : 'row',
  },
  action: {
    flexDirection: I18n.locale == 'ar' ? 'row-reverse' : 'row',
    marginTop: 10,
    paddingBottom: 5,
  },
  actionButton: {
    alignItems: 'center',
    marginTop: '2%',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  inputStyle: {
    backgroundColor: '#fdfdfd',
    // borderRadius: 3,
    paddingVertical: '5%',
    borderWidth: 0.3, borderColor: '#7a7a7a'
  },
  mainShadow: {
    borderRadius: 5,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 11.5,
    textAlign: 'right',
    marginRight: '1.5%',
    marginTop: '-0.8%'
  },
});

export default WithTailwindHook(ContactusCompany);