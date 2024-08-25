import React, { useEffect, useState, useRef } from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { AuthContext } from '../components/context';
import Loader from '../components/Loader.js';
import I18n from 'react-native-i18n';
import commonStyle from '../assets/style/styles.js';
import { strings } from '../locals/i18n';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCaretRight,
  faCircleInfo,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons';
import { SelectList } from 'react-native-dropdown-select-list';
import PhoneInput from 'react-native-phone-number-input';
import UploadDocumentAttach from '../components/UploadDocumentAttach.js';
import RNPicker from 'search-modal-picker';
import PaymentScreen from '../components/molecules/PaymentScreen.js';
//import { StripeProvider } from '@stripe/stripe-react-native';
import { GetData } from '../utils/helper.js';
import Feedback from '../components/Feedback.js';
const { width, height } = Dimensions.get('window');
const addServiceRequest = props => {
  var baseUrl = 'https://api.nejoumaljazeera.co/api/general/getTypeofReceiver';
  var servicesUrl =
    'https://api.nejoumaljazeera.co/api/getAllAppTraficServices';

  const { navigation } = props;
  const [loader, setLoader] = useState(false);
  const [showRequiredDocs, setShowRequiredDocs] = useState(false);
  const feedbackRef = useRef(null);
  const [documentVCC, setDocumentVCC] = useState({});
  const [documentInspectionReport, setDocumentInspectionReport] = useState({});
  const [documentSellContract, setDocumentSellContract] = useState({});
  const [documentLicense, setDocumentLicense] = useState({});
  const [documentID, setDocumentID] = useState({});
  const [errorDocumentVCC, setErrorDocumentVCC] = useState('');
  const [errorDocumentInspectionReport, setErrorDocumentInspectionReport] = useState('');
  const [errorDocumentSellContract, setErrorDocumentSellContract] = useState('');
  const [errorDocumentLicense, setErrorDocumentLicense] = useState('');
  const [errorDocumentID, setErrorDocumentID] = useState('');
  const [name, setName] = useState('');
  const [vin, setVin] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedServiceID, setSelectedServiceID] = useState(null);
  const [selectedServiceName, setSelectedServiceName] = useState(null);
  const [selectedServicePrice, setSelectedServicePrice] = useState(null);
  const [driverLicense, setDriverLicense] = useState('');
  const [errorName, setErrorName] = useState('');
  const [errorPhone, setErrorPhone] = useState('');
  const [errorService, setErrorService] = useState('');
  const [errorLicense, setErrorLicense] = useState('');
  const [country, setCountry] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [validInput, setValidInput] = useState(false);
  const [formattedValue, setFormattedValue] = useState('');
  const [servicesData, setServicesData] = useState([]);
  const phoneInput = useRef(null);
  const [countryVal, setCountryVal] = useState( { id: '2', name: 'Dubai' },);
  const fedbackmodelLocal=true;
  useEffect(() => {
    const getCountry = () => {
      setLoader(true);
      fetch('https://api.nejoumaljazeera.co/api/getCountries')
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Network response was not ok.');
        })
        .then(response => {
          setLoader(false);
          if (response) {
            setCountry(response.data);
          } else {
            setError('Error occurred');
            Alert.alert('Error', 'Error Occurred', [{ text: 'Okay' }]);
          }
        })
        .catch(error => {
          setLoader(false);
          setError(error.message);
          console.warn(error);
          Alert.alert('Error', 'Connection Error', [{ text: 'Okay' }]);
        });
    };
    const getServices = () => {
      setLoader(true);
      GetData(servicesUrl)
      .then(data => {
        // Set the state with the fetched data
        setServicesData(data.data);
      })
      .catch(error => {
        setLoader(false);
        // Handle errors here
        console.error('Error fetching data:', error);
      });
    }
    getServices();
    getCountry();
    // getServices
  }, []);
  const requiredDocuments = [
    'VCC',
    'Inspection report',
    'Sell contract',
    'License',
    'ID',
    // Add more documents as needed
  ];
  const regions = [
    { id: '1', name: 'Dubai' },
    { id: '2', name: 'Sharjah' },
    { id: '3', name: 'Abu Dhabi' },
    { id: '4', name: 'Umm Al-Quwain' },
    { id: '5', name: 'Ras Al Khaimah' },
    { id: '6', name: 'Fujairah' },
    { id: '7', name: 'Ajman' },
];

  const saveDataintoDB = async () => {
    // alert("Enter in the saveDataintoDB function");
    try {
      // Prepare the data in the required format
      const requestData = {
        name: AuthContext.id?null:name,
        phone: phone,
        region: countryVal.id,
        customer_id: AuthContext.id?AuthContext.id:null,
        license_no: driverLicense,
        service_id: selectedServiceID,
        service_price: selectedServicePrice,
        payment_status: 1,
        documents: [
          documentVCC,
          documentInspectionReport,
          documentSellContract,
          documentLicense,
          documentID,
        ],
      };

      // Make the API request
      const response = await fetch('https://api.nejoumaljazeera.co/api/uploadServiceRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });


      // Check if the request was successful
      if (response.ok) {
        // Service request created successfully
        // You can handle success here, such as showing a success message
        // alert('Your request has been created successfully!');
       
        // alert(response.ok+"Service request created successfully ")
      } else {
        // Service request creation failed
        // You can handle failure here, such as showing an error message

        console.error('Failed to create service request');
      }
    } catch (error) {
      // Handle any errors that occur during the request
      console.error('Error submitting service request:', error);
    }
  };

  const onSubmit = () => {
    // alert("dsf")
    // navigation.navigate('StripeScreen');
    let isValid = true;
    // Validate name
    if (!name) {
      if(!AuthContext.id){
        setErrorName('Name is required');
        isValid = false;
      }
    } else {
      setErrorName('');
    }

    if (!selectedServicePrice) {
      setErrorService('Service is required');
      isValid = false;
    } else {
      setErrorService('');
    }
    // Validate phone
    if (!phoneInput.current?.isValidNumber(phone)) {
      if(!AuthContext.id){
      setErrorPhone('Invalid phone number');
      isValid = false;
      }
    } else {
      setErrorPhone('');
    }

    // Validate driver's license number
    if (!driverLicense) {
      setErrorLicense("Driver's license number is required");
      isValid = false;
    } else {
      setErrorLicense('');
    }
    // Files
    // DocumentVCC
    if (Object.keys(documentVCC)?.length === 0) {
      setErrorDocumentVCC("Document VCC is required");
      isValid = false;
    } else {
      setErrorDocumentVCC('');
    }
    // documentInspectionReport
    if (Object.keys(documentInspectionReport)?.length === 0) {
      setErrorDocumentInspectionReport("Document Inspection Report is required");
      isValid = false;
    } else {
      setErrorDocumentInspectionReport('');
    }
    // documentSellContract
    if (Object.keys(documentSellContract)?.length === 0) {
      setErrorDocumentSellContract("Document Sell Contract is required");
      isValid = false;
    } else {
      setErrorDocumentSellContract('');
    }
    // documentLicense
    if (Object.keys(documentLicense)?.length === 0) {
      setErrorDocumentLicense("Document License is required");
      isValid = false;
    } else {
      setErrorDocumentLicense('');
    }
    // documentID
    if (Object.keys(documentID)?.length === 0) {
      setErrorDocumentID("Document ID is required");
      isValid = false;
    } else {
      setErrorDocumentID('');
    }
    // Check if there are any validation errors
    if (isValid) {
      // alert("Fine");
      // return 1;
      setValidInput(true);
      return true;
      
    } else {
      alert("Please fill all the required fields!");
      setValidInput(false);
      return false
      // return 0
      // alert("Please fill all the required fields!");
    }
  };

 const toggleFeedbackModal=()=> {
    setShowFeedbackModal(!showFeedbackModal);
    if( fedbackmodelLocal && showFeedbackModal==true){
      if(AuthContext.id){
        navigation.navigate('myServiceRequest');
      }else{
        navigation.goBack();
      }

    }
}


  if (country) {
    const dataCountry = country.map(item => ({
      id: item.id,
      name: item.name.toString(),
    }));

    var country_pickers = (
      <RNPicker
        dataSource={regions}
        dummyDataSource={regions}
        defaultValue={true}
        pickerTitle="Select Region"
        showSearchBar={true}
        disablePicker={false}
        changeAnimation="none"
        searchBarPlaceHolder="Search Region....."
        showPickerTitle={true}
        selectedLabel={countryVal.name} // Use countryVal.name instead of countryname
        placeHolderLabel={countryVal.name} // Use countryVal.name instead of countryname
        selectedValue={(index, item) => {
          console.log('Region Selected: ' + countryVal.name);
          setCountryVal({ id: item.id, name: item.name });
          console.log(countryVal);
        }}
        pickerStyle={localStyles.pickerStyle}
        selectLabelTextStyle={localStyles.selectLabelTextStyle}
      />
    );


  }

  return (
    <SafeAreaView style={commonStyle.marginGlobaleless}>
      {loader ? (
        <View style={{ flex: 1 }}>
          <Loader loader={true} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
          {country?.length > 0 ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: '4%',
                paddingTop: '7%',
              }}>
              <Text
                style={{
                  color: '#013188',
                  textAlign: I18n.locale == 'en' ? 'left' : 'right',
                }}>
                {strings('main.addServiceDes')}
              </Text>
              {/* form wrapper */}
              <View style={{ width: '93%', marginTop: '8%', flex: 1 }}>
             {!AuthContext.id&&(<> 
              {/* Name */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TextInput
                  placeholder={strings('main.name')}
                  placeholderTextColor="#666666"
                  autoCapitalize="none"
                  style={[
                    {
                      flex: 1,
                      height: 48,
                      margin: '1.8%',
                      borderWidth: 1,
                      borderColor: '#666666',
                      textAlign: I18n.locale === 'ar' ? 'right' : 'left',
                      direction: I18n.locale === 'ar' ? 'rtl' : 'ltr',
                      marginTop: Platform.OS === 'ios' ? 0 : -12,
                      color: '#05375a',
                    },
                    localStyles.inputStyle,
                  ]}
                  value={name}
                  onChangeText={text => {setName(text); setErrorName('');}}
                />
              </View>
              {errorName ? <Text style={localStyles.errorText}>{errorName}</Text> : null}</>
             )
             } 

            {!AuthContext.id&&(<> 
              {/* Name */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TextInput
                  placeholder={strings('car.vin')}
                  placeholderTextColor="#666666"
                  autoCapitalize="none"
                  style={[
                    {
                      flex: 1,
                      height: 48,
                      margin: '1.8%',
                      borderWidth: 1,
                      borderColor: '#666666',
                      textAlign: I18n.locale === 'ar' ? 'right' : 'left',
                      direction: I18n.locale === 'ar' ? 'rtl' : 'ltr',
                      marginTop: Platform.OS === 'ios' ? 0 : -12,
                      color: '#05375a',
                    },
                    localStyles.inputStyle,
                  ]}
                  value={vin}
                  onChangeText={text => {setVin(text); setErrorName('');}}
                />
              </View>
              {errorName ? <Text style={localStyles.errorText}>{errorName}</Text> : null}</>
             )
            }



                {/* Service */}
                <SelectList
                  setSelected={(val) => { setSelectedService(val); setSelectedServiceID(servicesData[val].id)
                    setSelectedServiceName(I18n.locale == 'ar'?servicesData[val].service_name_ar:servicesData[val].service_name);
                    setSelectedServicePrice(servicesData[val].service_price);  setErrorService(''); }}
                  data={servicesData.map((item, index) => ({ key: index, value: I18n.locale == 'ar'?item.service_name_ar:item.service_name }))}

                  save="key"
                  search={false}
                  arrowicon={<FontAwesomeIcon icon={faCaretDown} size={16} color={'#999'} />}
                  dropdownStyles={[
                    {
                      width: '100%',
                      backgroundColor: '#FFF',
                      borderBottomWidth: 1,
                      borderBottomColor: '#666666',
                      marginBottom:'1.8%',
                      // borderRadius: 5,
                      // marginVertical: '1.5%',
                    },
                  ]}
                  boxStyles={[
                    { width: '97%', borderRadius: 3 },
                    localStyles.inputStyle,
                  ]}
                  inputStyles={[{ width: '100%' }]}
                  placeholder={strings('main.select_type_service')}
                />
                {errorService ? <Text style={localStyles.errorText}>{errorService}</Text> : null}
                
                {/* Region */}
                <View style={{ width: '100%', marginVertical: '1.5%' }}>
                  {country_pickers}
                </View>
             

                {/* Phone */}
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: '1.5%',
                  }}>
                  <PhoneInput
                    ref={phoneInput}
                    defaultValue={phone}
                    defaultCode="AE"
                    layout="first"
                    onChangeText={text => {setPhone("+" + phoneInput.current?.getCallingCode() + text);setErrorPhone('');}}
                    containerStyle={{
                      width: '97%',
                      height: 48,
                      borderWidth: 1,
                      borderColor: '#666666',
                      padding: 0,
                      margin: 0,
                      backgroundColor: '#FFF',
                      borderRadius: 3,
                      textAlignVertical: 'center',
                    }}
                    textContainerStyle={{
                      fontSize: 13,
                      padding: 0,
                      margin: 0,
                      textAlignVertical: 'center',
                    }}
                    textInputStyle={{
                      fontSize: 14,
                      textAlignVertical: 'center',
                      padding: 0,
                      margin: 0,
                    }}
                    flagButtonStyle={{ fontSize: 13, padding: 0, margin: 0 }}
                    countryPickerButtonStyle={{
                      padding: 0,
                      margin: 0,
                      textAlignVertical: 'center',
                    }}
                    onChangeFormattedText={text => {
                      setFormattedValue(text);
                    }}
                    withDarkTheme
                  // withShadow
                  />
                </View>
                {errorPhone ? <Text style={localStyles.errorText}>{errorPhone}</Text> : null}
         
                {/* Driver's license number */}
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TextInput
                    autoCapitalize="characters"
                    // keyboardType="number-pad"
                    placeholder={"Driver's license number"}
                    placeholderTextColor="#666666"
                    style={[
                      {
                        flex: 1,
                        height: 48,
                        borderWidth: 1,
                        borderColor: '#666666',
                        textAlign: I18n.locale === 'ar' ? 'right' : 'left',
                        direction: I18n.locale === 'ar' ? 'rtl' : 'ltr',
                        color: '#05375a',
                      },
                      localStyles.inputStyle,
                    ]}
                    value={driverLicense}
                    onChangeText={text => {setDriverLicense(text);setErrorLicense('');}}
                  />
                </View>
                {errorLicense ? <Text style={localStyles.errorText}>{errorLicense}</Text> : null}
                {/* Required docs */}
                <View style={{ flex: 1, position: 'relative' }}>
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        marginTop: '2%',
                      }}
                      onPress={() => {
                        setShowRequiredDocs(!showRequiredDocs);
                      }}>
                      <Text style={{ paddingRight: '2%' }}>Required docs</Text>
                      <FontAwesomeIcon
                        icon={faCircleInfo}
                        color="#343D40"
                        size={width * 0.06}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Required Docs */}
                  {showRequiredDocs && (
                    <View style={localStyles.requiredDocsContainer}>
                      {requiredDocuments.map((doc, index) => (
                        <View
                          style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <FontAwesomeIcon
                            icon={faCaretRight}
                            color="#343D40"
                            size={width * 0.04}
                            style={{ paddingRight: '2%' }}
                          />
                          <Text
                            key={index}
                            style={localStyles.requiredDocsItem}>
                            {doc}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <UploadDocumentAttach
                    document={documentVCC}
                    setDocument={setDocumentVCC}
                    width={width}
                    height={height}
                    localStyles={localStyles}
                    text={'VCC document'}
                    setError={setErrorDocumentVCC}
                  />
                  {errorDocumentVCC ? <Text style={localStyles.errorText}>{errorDocumentVCC}</Text> : null}
                  <UploadDocumentAttach
                    document={documentInspectionReport}
                    setDocument={setDocumentInspectionReport}
                    width={width}
                    height={height}
                    localStyles={localStyles}
                    text={'Inspection Report'}
                    setError={setErrorDocumentInspectionReport}
                  />

                  {errorDocumentInspectionReport ? <Text style={localStyles.errorText}>{errorDocumentInspectionReport}</Text> : null}

                  <UploadDocumentAttach
                    document={documentSellContract}
                    setDocument={setDocumentSellContract}
                    width={width}
                    height={height}
                    localStyles={localStyles}
                    text={'Sell Contract'}
                    setError={setErrorDocumentSellContract}
                  />
                  {errorDocumentSellContract ? <Text style={localStyles.errorText}>{errorDocumentSellContract}</Text> : null}

                  <UploadDocumentAttach
                    document={documentLicense}
                    setDocument={setDocumentLicense}
                    width={width}
                    height={height}
                    localStyles={localStyles}
                    text={'License'}
                    setError={setErrorDocumentLicense}
                  />
                  {errorDocumentLicense ? <Text style={localStyles.errorText}>{errorDocumentLicense}</Text> : null}

                  <UploadDocumentAttach
                    document={documentID}
                    setDocument={setDocumentID}
                    width={width}
                    height={height}
                    localStyles={localStyles}
                    text={'ID'}
                    setError={setErrorDocumentID}
                  />
                  {errorDocumentID ? <Text style={localStyles.errorText}>{errorDocumentID}</Text> : null}
                </View>
              </View>
               {fedbackmodelLocal && showFeedbackModal && (<Feedback customer_id={AuthContext.id} showFeedbackModal={showFeedbackModal}
                        toggleFeedbackModal={toggleFeedbackModal} ref={feedbackRef} onClose={() => console.log('Feedback closed')} />)}
            </View>
          ) : loader ? (
            <View style={localStyles.loaderStyle}>
              <Loader loader={false} />
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
        </ScrollView>
      )}

      <View
        style={{
          backgroundColor: '#0B9A21',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: '3.5%',
          paddingVertical: '2%',
        }}>
        <View style={{ flexDirection: 'column' }}>
       
          <Text
            style={{
              color: '#fff',
              marginLeft: '3%',
              marginRight: '3%',
              marginBottom: '3%',
              fontSize: width * 0.04,
              fontWeight: '500',
            }}>AED{" "}
            {selectedServicePrice ? (
              <Text> {Number(selectedServicePrice.toLocaleString()).toFixed(2)}
              </Text>
              ) : (<Text> 0.00</Text>)} 
          </Text>
        </View>    
        {/* <StripeProvider
          publishableKey="pk_test_51P8gMyAfUavBNiHqAYqjVd8fD3fdYxE1nH78cYAVZarVwGS4d5BZd5gQ3N4CGJpC2Osbh8RyWxm6leZJ3eDVdiUN00NC3uCQ3i"
          urlScheme="your-url-scheme" 
          merchantIdentifier="merchant.com.{{Nejoum_AlJazeera}}">
          <PaymentScreen navigation={navigation} validInput={validInput} saveDataintoDB={saveDataintoDB} onClick={onSubmit} toggleFeedbackModal={toggleFeedbackModal} showFeedbackModal={showFeedbackModal} setShowFeedbackModal={setShowFeedbackModal} service_amount={Number(selectedServicePrice)} />
        </StripeProvider> */}
      </View>
    </SafeAreaView>
  );
};

export default addServiceRequest;

const localStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  errorText: {
    color: '#FF7B89',
    fontSize: 11.5,
    textAlign: 'right',
    marginRight: '1.5%',
    marginTop: '-0.8%'
  },
  documentContainer: {
    position: 'relative',
    width: 75,
    height: 60,
    resizeMode: 'contain',
  },
  cancelIconButton: {
    position: 'absolute',
    top: 5,
    right: 0,
    backgroundColor: '#FFD9D9', // Set background color as needed
  },
  inputStyle: {
    backgroundColor: '#FFF',
    borderRadius: 4,
    paddingVertical: '4.3%',
    paddingLeft: '6%',
    margin: '1.8%',
  },
  imageContainer: {
    position: 'relative',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    width: '100%',
    height: '100%',
    marginLeft: '15.5%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
    marginRight: '1.5%',
  },

  searchBarContainerStyle: {
    // marginBottom: 10,
    flexDirection: 'row',
    height: 20,
    shadowOpacity: 1.0,
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    backgroundColor: 'rgba(255,255,255,1)',
    shadowColor: '#d3d3d3',
    borderRadius: 10,
    elevation: 3,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    paddingTop: 50,
  },

  selectLabelTextStyle: {
    color: '#000',
    textAlign: 'left',
    textAlignVertical: 'center',
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeHolderTextStyle: {
    color: '#D3D3D3',
    padding: 10,
    textAlign: 'left',
    width: '99%',
    flexDirection: 'row',
  },
  dropDownImageStyle: {
    marginLeft: 10,
    width: 10,
    height: 10,
    alignSelf: 'center',
  },
  listTextViewStyle: {
    color: '#000',
    marginVertical: 10,
    flex: 0.9,
    marginLeft: 20,
    marginHorizontal: 10,
    textAlign: 'left',
  },
  pickerStyle: {
    height: 48,
    marginLeft: 20,
    elevation: 3,
    paddingRight: 25,
    marginRight: 10,
    marginBottom: 2,
    shadowOpacity: 1.0,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    borderWidth: 1,
    borderColor: '#666666',
    shadowRadius: 10,
    backgroundColor: 'rgba(255,255,255,1)',
    shadowColor: '#d3d3d3',
    borderRadius: 3,
    flexDirection: 'row',
    paddingLeft: '3%',
  },
  loaderStyle: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    margin: '1%',
    height: height * 0.12,
    padding: '10%',
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
  requiredDocsContainer: {
    position: 'absolute',
    top: '5%',
    right: 0,
    zIndex: 11,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: '8%',
    marginBottom: '2%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  requiredDocsItem: {
    fontSize: 12.5,
    paddingVertical: 4,
    paddingLeft: '2%',
  },
  itemStyle: {
    flex: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: '1%',
    height: height * 0.12,
    padding: '7%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#666666',
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
});