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
  Alert,
  Button,
  TextInput,
  ScrollView,
  ToastAndroid
} from 'react-native';
import {AuthContext} from '../components/context';
import Loader from '../components/Loader.js';
import I18n from 'react-native-i18n';
import commonStyle from '../assets/style/styles.js';
import {strings} from '../locals/i18n';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faUpload } from '@fortawesome/free-solid-svg-icons';
import { convertRemToAbsolute } from 'native-base/lib/typescript/theme/tools';
import { SelectList } from 'react-native-dropdown-select-list';
//import {launchImageLibrary} from 'react-native-image-base64';
import DocumentPicker from 'react-native-document-picker';
import ImgToBase64 from 'react-native-image-base64';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';
import {decode} from 'base64-arraybuffer';
import RNFS from 'react-native-fs';

const {width, height} = Dimensions.get('window');


const AddCars = props => {
  var baseUrl  = `https://api.nejoumaljazeera.co/api/getBuyerAcc?customer_id=${
    AuthContext.id
  }`;
  
  const {navigation} = props;
  const [loader, setLoader] = useState(true);
  const [datass, setData] = useState([]);
  const [dataTCompanies, setDataTCompanies] = useState([]);
  const [checked, setChecked] = React.useState([]);
  const [selectedCars, setselectedCars] = React.useState(0);
  const [valTo, setSelectedTo] = React.useState("");
  const [validation, setValidation] = React.useState(false);
  const [notes, setNotes] = React.useState("");
  const [fileUri, setfileUri] = React.useState(null);
  const [fileName, setfileName] = React.useState(null);
  const [fileType, setfileType] = React.useState(null);
  const [singleFile, setSingleFile] = React.useState(null);
  const [transferFee, setTransferFee] = React.useState(0);
  const [imagesFiles, setimagesFiles] = React.useState([]);
  const [selectedValue, setSelectedValue] = useState('transfer');
  const [lotnumber, setLotnumber] = React.useState(null);

  const handlePress = (value) => {
    setSelectedValue(value);
  };


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

  const uploadFile = async (fileUri, fileType, fileName) => {
    if(valTo == null || imagesFiles.length ==0 || lotnumber == null ){
        Alert.alert('Error', 'Missing required field', [
            {text: 'Okay'}
        ]);
        return;
      }
    setLoader(true);
    const extension = getExtention(fileType);
    const formData = new FormData();
    var Url = "https://api.nejoumaljazeera.co/api/uploadCommonBuyerCars";

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
      const filename = image.path.split('/').pop();  // extract filename from path
      formData.append(`images[${index}][fileContent]`, base64);
      formData.append(`images[${index}][type]`, image.mime);
      formData.append(`images[${index}][name]`, filename);  // use the extracted filename
      formData.append(`images[${index}][extension]`, extension);
    });
    formData.append('file_type', 'image');
    formData.append('customer_id', AuthContext.id);
    formData.append('cu_notes', notes);
    formData.append('buyer_id', valTo);
    formData.append('lotnumber', lotnumber);
    
    try {
      await Promise.all(promises);
      const response = await fetch(Url, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.ok) {
        ToastAndroid.show('Uploaded Successfully', ToastAndroid.SHORT);
        setLoader(false);
        navigation.navigate('Dashboard', { openfeedback: true });
        // Handle the response data here
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      setLoader(false);
      ToastAndroid.show('Error', ToastAndroid.SHORT);
      navigation.navigate("MyCarsAdded", {'refresh': Math.random().toString()});
      // Handle the error here
    }
  };

  const pickMultipleImages = async () => {
    try {
      const images = await ImagePicker.openPicker({
        maximumImagesCount: 10,
        multiple: true,
        mediaType: 'photo', // You can also pick videos by changing this to 'video'
      });
      
      // 'images' will contain an array of selected images
      await setimagesFiles(images);
    } catch (error) {
      console.log('Error picking images:', error);
    }
  };
      
  useEffect(() => {
    const fetcher = async () => {
      const response = await fetch(baseUrl);
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
      setLoader(true);
      const data = await fetcher();
      temp = [];
      data.forEach(object => {
        temp.push({key: object.bID, value: object.name},);
      });
      setData(temp);
      // Update state with the fetched data
      setLoader(false);
    };
    fetchData();
  }, []);

  return (
  <SafeAreaView style={commonStyle.marginGlobaleless}>
     {(loader?
        <View style={{flex:1}}>
        <Loader loader={true} />
    </View>: 
    <ScrollView contentContainerStyle={{ flexGrow: 1}}>
    {
    datass?.length > 0 ? (
    <View style={{justifyContent:'center', alignItems:'center', padding:'4%'}}>
        <Text style={{color:'#013188', textAlign:(I18n.locale == 'en')?'left':'right'}}>
          {strings('main.addCarDes')}
        </Text>
        <View style={{shadowColor: "red", flex:1, backgroundColor:'red', height:'4%',
              shadowOffset: {
                  width: 0,
                  height: 12,
              },
              shadowOpacity: 0.58,
              shadowRadius: 16.00,
              elevation: 18,}}>
        </View>
        <View style={{width:'90%', justifyContent:'center', alignItems:'center', marginBottom:'2%'}}>
            <SelectList
              setSelected = {(valTo) => setSelectedTo(valTo)} 
              data = {datass}
              save="key"
              boxStyles={{width:'100%',borderRadius:3, flexDirection:(I18n.locale == 'en')?'row':'row-reverse', 
              textAlign:(I18n.locale == 'en')?'left':'right'}}
              inputStyles={{width:'100%', textAlign:(I18n.locale == 'en')?'left':'right'}}
              placeholder={strings('car.select')+" "+strings('car.buyer_number')}
            />
            {(validation?
            <Text style={{color:'red'}}>{strings("main.fill_all_data")}</Text>:<Text></Text>)}
        </View>
        <View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:'2%'}}>
          <TextInput
            placeholder={strings('main.write_somthing')}
            placeholderTextColor="#666666"
            autoCapitalize="none"
            style={{
              flex: 1,
              height:50, 
              margin:'2%', borderWidth:1, borderColor:'#666666',
              textAlign: I18n.locale === 'ar' ? 'right':'left',
              direction: I18n.locale === 'ar' ? 'rtl' : 'ltr',
              marginTop: Platform.OS === 'ios' ? 0 : -12,
              paddingLeft: 10,
              color: '#05375a',}}
              onChangeText={(val) => setNotes(val)}
            />
        </View>
        <View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:'2%'}}>
          <TextInput
            placeholder={strings('car.lotnumber')}
            placeholderTextColor="#666666"
            autoCapitalize="none"
            style={{
              flex: 1,
              height:50, 
              margin:'2%', borderWidth:1, borderColor:'#666666',
              textAlign: I18n.locale === 'ar' ? 'right':'left',
              direction: I18n.locale === 'ar' ? 'rtl' : 'ltr',
              marginTop: Platform.OS === 'ios' ? 0 : -12,
              paddingLeft: 10,
              color: '#05375a',}}
              onChangeText={(val) => setLotnumber(val)}
            />
        </View>        

      </View>): loader ? (
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
      
      <View style={{height: height*0.15, borderWidth: 1, borderStyle: 'dashed', margin: '4%', borderRadius: 10,
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
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <TouchableOpacity
              style={commonStyle.submitbutton}
              onPress={() => uploadFile(fileUri, fileType, fileName)}>
              <Text style={[commonStyle.buttonTextBlue, {padding: '1%'}]}>{strings('main.submit')}</Text>
          </TouchableOpacity>
        </View></ScrollView>)}
  </SafeAreaView>
  );
};


export default AddCars;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  buttonStyle: {
    backgroundColor: '#307ecc',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  textStyle: {
    fontSize: 15,
    marginTop: 16,
    marginLeft: 35,
    marginRight: 35,
    textAlign: 'center',
  },
});

//export default newPayment;

const localStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    height: height * 0.12,
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
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonChecked: {
    borderColor: '#007AFF', // Change color when checked
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF', // Change color when checked
  },
  radioButtonLabel: {
    fontSize: 16,
    margin:3
  },
});
