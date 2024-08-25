import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  TextInput, Button
} from 'react-native';
import {AuthContext} from '../components/context';
import Loader from '../components/Loader.js';
import I18n from 'react-native-i18n';
import commonStyle from '../assets/style/styles.js';
import {strings} from '../locals/i18n';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faUpload } from '@fortawesome/free-solid-svg-icons';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';
import { SelectList } from 'react-native-dropdown-select-list';

const {width, height} = Dimensions.get('window');

const NewPaymentOther = props => {
const {navigation} = props;
const [loader, setLoader] = useState(false);
const [data, setData] = useState([]);
const [dataBanks, setDataBanks] = useState([]);
const [imagesFiles, setimagesFiles] = React.useState([]);
const [notes, setNotes] = React.useState("");
const [valTo, setSelectedTo] = React.useState("");
const [validation, setValidation] = React.useState(false);
const [fileUri, setfileUri] = React.useState(null);
const [fileName, setfileName] = React.useState(null);
const [fileType, setfileType] = React.useState(null);
const [totalAmount, setTotalAmount] = React.useState(0);
const [totalAmounts, setTotalAmounts] = useState(new Array(data.length).fill({ serviceId: '', amount: '0' }));

var baseUrl = "https://api.nejoumaljazeera.co/api/getServicesDetails";
var baseUrlBanks  = "https://api.nejoumaljazeera.co/api/general/getBankAccount";

  useEffect(() => {
    const fetcher = async () => {
      const response = await fetch(baseUrlBanks);
      try {
        const json = await response.json();
        if (json?.data?.length > 0) {
          console.log('=>(MyRequests.js:36) json.data;', json.data);
          return json.data;
        }
        return [];
      } catch (error) {
        console.log('=>(MyRequests.js:40) error', error);
        return [];
      }
    };
    
    const fetchData = async () => {
      try {
        setLoader(true);
        // Fetch Banks Data
        const banks = await fetcher();
        temp = [];

        banks.forEach(object => {
          temp.push({key: object.ID, value: object.AccountName},);
        });
        setLoader(false);
        // Fetch Services Data
        const response = await fetch(baseUrl);
        const json = await response.json();
        const data = json?.data || [];
        // Set the fetched data and loaders
        setData(data);
        setDataBanks(temp);
        setLoader(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [baseUrl]);

  const getExtention = mime => {
    switch (mime) {
      case 'application/pdf':
        return '.pdf';
      case 'image/jpeg':
        return '.jpg';
      case 'image/jpg':
        return '.jpg';
      case 'image/png':
        return '.png';
      case 'image/heif':
          return '.heif';
      case 'image/heic':
          return '.heic';
      default:
        return null;
    }
  };


  const pickMultipleImages = async () => {
    try {
      const images = await ImagePicker.openPicker({
        multiple: true,
        mediaType: 'photo', // You can also pick videos by changing this to 'video'
      });
      
      // 'images' will contain an array of selected images
      console.log(images);
      await setimagesFiles(images);
    } catch (error) {
      console.log('Error picking images:', error);
    }
  };

// Function to update the total amount for a specific list
const updateTotalAmounts = (index, newValue, serviceId) => {
  // Create a copy of the current totalAmounts array
  const updatedAmounts = [...totalAmounts];

  // Update the amount at the specified index
  updatedAmounts[index] = {
    serviceId: serviceId,
    amount: newValue,
  };

  // Update the state with the new totalAmounts array
  setTotalAmounts(updatedAmounts);

  // Calculate the total sum of all values and update totalAmount
  const totalSum = updatedAmounts.reduce((sum, currentValue) => {
    return sum + parseFloat(currentValue.amount || 0);
  }, 0);

  // Save the total sum in totalAmount
  setTotalAmount(totalSum.toFixed(2));
};



  const renderItem = ({item, index}) => {
    let {
      id,
      name,
      description,
      description_ar
    } = item;
    return (
      <View style={localStyles.itemStyle} >
        <View
          style={{
            backgroundColor: '#fff',
            flex: 5,
          }}>
          <Text style={commonStyle.textBlue}>
            {name}
          </Text>
          <Text style={localStyles.oldPort}> {I18n.locale == 'ar'? description_ar: description} </Text>
          <Text style={localStyles.newPort}></Text>
        </View>
        <View style = {{flex: 3, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
            <TextInput
                placeholder = {strings('main.amount')}
                placeholderTextColor = "#666666"
                autoCapitalize = "none"
                keyboardType="numeric" // Set the keyboardType to 'numeric'
                style = {{
                  flex: 1,
                  justifyContent:'center',alignItems:'center',
                  height:30, borderRadius:4, borderWidth:1, borderColor:'#666666',
                  textAlign: I18n.locale === 'ar' ? 'left':'left',
                  direction: I18n.locale === 'ar' ? 'ltr' : 'ltr',
                  marginTop: Platform.OS === 'ios' ? 0 : -12,
                  paddingLeft: 10,
                  color: '#05375a'
                }}
                onBlur={(event) => {
                  const val = event.nativeEvent.text; // Get the text value after editing
                  const numericValue = val.replace(/[^0-9.]*/g, '');
                  if (numericValue === '' || isNaN(numericValue)) {
                    updateTotalAmounts(index, '0', id);
                  } else {
                    const enteredAmount = parseFloat(numericValue);
                    updateTotalAmounts(index, enteredAmount.toFixed(2), id);
                  }
                  // Update the local state for notes (if needed)
                }}
                onKeyPress={(event) => {
                  // Prevent entering non-numeric characters
                  const allowedCharacters = /^[0-9.]+$/;
                  if (!allowedCharacters.test(event.nativeEvent.key)) {
                    event.preventDefault();
                  }
                }}
            />
            <Text style={localStyles.approved}>
              AED
            </Text>
        </View>
      </View>
    );
  };

  const uploadFile = async (fileUri, fileType, fileName) => {
    if(totalAmount <= 0){
      Alert.alert('Error', 'Amount should be > 0', [
        {text: 'Okay'}
      ]);
      return;
    }
    if(valTo == null || imagesFiles.length ==0){
        Alert.alert('Error', 'Missing required field', [
            {text: 'Okay'}
        ]);
      return;
    }
    setLoader(true);
    const formData = new FormData();
    var Url  = "https://api.nejoumaljazeera.co/api/uploadTransferOther";
    const fs = RNFetchBlob.fs;
    for (const image of imagesFiles) {
      const extension = getExtention(image.mime);
      if(extension == null){
        Alert.alert('Error', strings('main.wrong_file_type'), [
          {text: 'Okay'}
        ]);
        setLoader(false);
        return;
      }
      const base64 = await RNFetchBlob.fs.readFile(image.path.replace("file://", ""), 'base64');
      
      formData.append('images[]', {
        fileContent: base64,
        type: image.mime,
        name: image.filename,
        extension: extension
      });
    }

    const promises = imagesFiles.map(async (image, index) => {
    const extension = getExtention(image.mime);        
    const base64 = await RNFetchBlob.fs.readFile(image.path.replace("file://", ""), 'base64');
    formData.append(`images[${index}][fileContent]`, base64);
    formData.append(`images[${index}][type]`, image.mime);
    formData.append(`images[${index}][name]`, image.filename);
    formData.append(`images[${index}][extension]`, extension);
    });
    
    formData.append('file_type', 'image');
    formData.append('customer_id', AuthContext.id);
    formData.append('services', (totalAmounts)?JSON.stringify(totalAmounts):JSON.stringify([]));
    formData.append('total', Number(parseFloat(totalAmount),2));
    formData.append('bank_to', valTo);
    formData.append('cu_notes', notes);
    formData.append('t_type', 'services');

    try {
      setLoader(true);
      await Promise.all(promises);
      const response = await fetch(Url, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.ok) {
        const data = await response.json();
        Alert.alert('Success', 'Uploaded Successfully', [
          {text: 'Okay'}
        ]);
        setLoader(false);
        navigation.navigate("paymentOther", {'refresh': Math.random().toString()});
        // Handle the response data here
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      setLoader(false);
      Alert.alert('Error', error, [
        {text: 'Okay'}
      ]);
      // Handle the error here
    }

  };

  return (
    loader ? ( <View style={localStyles.loaderStyle}>
      <Loader loader={true} />
    </View>):(
      <SafeAreaView style={commonStyle.marginGlobaleless}>
        
          <View style={{ flexDirection:'row', justifyContent:'center', marginBottom:'2%', padding: '5%'}}>
              <Text style={{color:'#343D40',textAlign: I18n.locale=='en'?'left':'right',}}>
                {strings('main.PaymentDES')}
              </Text>
          </View>
        <ScrollView
             contentContainerStyle = {localStyles.container}
             scrollEventThrottle={400}>
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
                <View>
                </View>
              )}
          
          <View style={{ margin: '4%', marginBottom:'1%', flex:1, flexDirection:'column', justifyContent:'center', alignItems:'center', width:width*0.92}}>
            <View style={{width: width*0.92, flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                <SelectList
                  setSelected = {(valTo) => setSelectedTo(valTo)} 
                  data = {dataBanks}
                  save="key"
                  boxStyles={{ width: width*0.92, borderRadius:10,flexDirection:(I18n.locale == 'en')?'row':'row-reverse', 
                  textAlign:(I18n.locale == 'en')?'left':'right'}}
                  inputStyles={{width: width*0.92, textAlign:(I18n.locale == 'en')?'left':'right'}}
                  placeholder={strings('main.selectBankTo')}
                />
                {(validation?
                <Text style={{color:'red'}}>{strings("main.fill_all_data")}</Text>:<Text></Text>)}
            </View>
            <View style={{ margin: '4%', flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center', width:width*0.92}}>
              <TextInput
                placeholder={strings('main.write_somthing')}
                placeholderTextColor="#666666"
                autoCapitalize="none"
                style={{
                  flex: 1,
                  justifyContent:'center',alignItems:'center',
                  height:50, borderRadius:10, borderWidth:1, borderColor:'#666666',
                  textAlign: I18n.locale === 'ar' ? 'right':'left',
                  direction: I18n.locale === 'ar' ? 'rtl' : 'ltr',
                  marginTop: Platform.OS === 'ios' ? 0 : -12,
                  paddingLeft: 10,
                  color: '#05375a'}}
                  onChangeText={(val) => setNotes(val)}
              />
            </View>
        </View>
        <View style={{height: height*0.15, borderWidth: 1, borderStyle: 'dashed', margin: '4%', marginTop:0, borderRadius: 10,
              justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
              <FontAwesomeIcon
                  icon={ faUpload }
                  color="#343D40"
                  size={width*0.06}
              />
          <View style={{flexDirection:'column'}}>
            <Button
                title="Attach"
                color="#343D40"
                onPress={pickMultipleImages}
            />
          </View>
              {/*Showing the data of selected Single file*/}
              {imagesFiles != null ? (
               imagesFiles.map((item,i) => {
                return( 
                <View>
                  <Image
                      style={{width:90, height:90}}
                      source={{uri: item.path}}
                  />
                </View>
                )
              })
              ) : null}
        </View>
        </ScrollView>
          <View style={{backgroundColor:'#0B9A21', flexDirection:'row', justifyContent: 'space-between', alignItems:'center'}}>
            <View style={{flexDirection: 'column'}}>
                <Text style={{color: '#fff', marginLeft:'3%', marginRight:'3%', marginBottom:'3%', fontSize: width*0.04, fontWeight:"500"}}>
                  AED {Number(totalAmount.toLocaleString()).toFixed(2)}
                </Text>
            </View>
            {totalAmount > 0?
            <TouchableOpacity
              activeOpacity={1} onPress={() => uploadFile(fileUri, fileType, fileName)}
              style={{backgroundColor:'#fff',margin:'2%', borderRadius: 5 , justifyContent:'center'}}>
                <Text style={{color: '#0B9A21',  padding:'2%', fontSize: width*0.04, fontWeight:"500"}}>
                  {strings('main.submit')}
                </Text>
            </TouchableOpacity>:
            <TouchableOpacity disabled = {true}
            activeOpacity={1} onPress={() => uploadFile(fileUri, fileType, fileName)}
            style={{backgroundColor:'#EDEDED',margin:'2%', borderRadius: 5 , justifyContent:'center'}}>
              <Text style={{color: '#707070',  padding:'2%', fontSize: width*0.04, fontWeight:"500"}}>
                {strings('main.submit')}
              </Text>
          </TouchableOpacity>}
          </View>
      </SafeAreaView>)
  );
};

export default NewPaymentOther;

const localStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent:'center',
  },
  loaderStyle: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    margin: '1%',
    height: height * 0.12,
    padding: '5%',
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
    height: height * 0.1,
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
});
