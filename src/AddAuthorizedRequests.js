import React, {useEffect, useState, useRef} from 'react';
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
// import {launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import ImgToBase64 from 'react-native-image-base64';
import RNFetchBlob from 'rn-fetch-blob';
import { RadioButton } from 'react-native-paper';
import {decode} from 'base64-arraybuffer';
import RNFS from 'react-native-fs';
import CheckBox from '@react-native-community/checkbox';
import MultiSelect from 'react-native-multiple-select';
import SearchableDropdown from 'react-native-searchable-dropdown';
import PhoneInput from "react-native-phone-number-input";

const {width, height} = Dimensions.get('window');
const items = [{
  id: '92iijs7yta',
  name: 'Ondo'
}, {
  id: 'a0s0a8ssbsd',
  name: 'Ogun'
}, {
  id: '16hbajsabsd',
  name: 'Calabar'
}, {
  id: 'nahs75a5sg',
  name: 'Lagos'
}, {
  id: '667atsas',
  name: 'Maiduguri'
}, {
  id: 'hsyasajs',
  name: 'Anambra'
}, {
  id: 'djsjudksjd',
  name: 'Benue'
}, {
  id: 'sdhyaysdj',
  name: 'Kaduna'
}, {
  id: 'suudydjsjd',
  name: 'Abuja'
  }
];
const AddAuthorizedRequests = props => {
  var baseUrl  = "https://api.nejoumaljazeera.co/api/general/getTypeofReceiver";
  var vccbaseUrl  = "https://api.nejoumaljazeera.co/api/getnonVcc?customer_id="+AuthContext.id;
  var carsbaseUrl  = "https://api.nejoumaljazeera.co/api/getnonDelivered?customer_id="+AuthContext.id;

  const {navigation} = props;
  const [loader, setLoader] = useState(true);
  const [datass, setData] = useState([]);
  const [dataCars, setDataCars] = useState([]);
  const [dataVcc, setDatavcc] = useState([]);
  const [valTo, setSelectedTo] = React.useState('');
  const [checked, setChecked] = React.useState(false);
  const [approved, setApproved] = React.useState(false);
  const [validation, setValidation] = React.useState(false);
  const [notes, setNotes] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [eId, setEid] = React.useState("");
  const [fileUri, setfileUri] = React.useState(null);
  const [fileName, setfileName] = React.useState(null);
  const [fileType, setfileType] = React.useState(null);
  const [singleFile, setSingleFile] = React.useState(null);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [dataSpecificCars, setDataSpecificCars] = React.useState([]);
  const [formattedValue, setFormattedValue] = useState("");
  const phoneInput = useRef<PhoneInput>(null);

  
  const options = [
    { id: 1, name: 'Option 1' },
    { id: 2, name: 'Option 2' },
    { id: 3, name: 'Option 3' },
    // Add more options as needed
  ];
  
  const selectImage = async() => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
  
    await launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('Image selection cancelled');
      } else if (response.error) {
        console.log('Image picker error:', response.error);
      } else if (response.assets[0].uri) {

        // Access the selected image details
        const fileUri = response.assets[0].uri;
       
        const fileType = response.assets[0].type;
        //const fileName = fileUri.split('/').pop();
        const fileName = `${Date.now()}`;
        await setfileUri(fileUri);
        await setfileName(fileName);
        await setfileType(fileType);
        await setSingleFile(response.assets);
        return;
      }
    });
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
    if(valTo == null || fileUri == null || name == '' || eId == '' || formattedValue == ''){
        Alert.alert('Error', 'Missing required field', [
            {text: 'Okay'}
        ]);
        return;
      }
    setLoader(true);
    
    const extension = getExtention(fileType);      
    const formData = new FormData();
    var Url  = "https://api.nejoumaljazeera.co/api/uploadIDReceiver";
    const fs = RNFetchBlob.fs;
    const base64 = await fs.readFile(fileUri.replace("file://", ""), 'base64');
    formData.append('image', {
      fileContent: base64,
      type: fileType,
      name: fileName,
      extension: extension
    });
    formData.append('fileContent', base64);
    formData.append('file_type', fileType);
    formData.append('type', fileType);
    formData.append('name', fileName);
    formData.append('phone', formattedValue);
    formData.append('extension', extension);
    formData.append('customer_id', AuthContext.id);
    formData.append('cu_notes', notes);
    formData.append('auth_name', name);
    formData.append('auth_id', eId);
    formData.append('val_to', valTo);
    formData.append('cars', selectedItems);
  
    try {
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
        navigation.navigate('Dashboard', { openfeedback: true });
        // navigation.navigate("MyAuthorizedRequests", {'refresh': Math.random().toString()});
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      setLoader(false);
      Alert.alert('Error', 'Error Occured', [
          {text: 'Okay'}
      ]);
    }

  };
  
  onSelectedItemsChange = (selectedItems) => {
    setSelectedItems(selectedItems);
  };

  const handleSelectedItemsChange = async (valTo) => {
    await setSelectedTo(valTo);
    if(valTo == 'vcc'){
      setDataSpecificCars(dataVcc); // You might need to initialize dataVcc as well
    }else {
      setDataSpecificCars(dataCars); // You might need to initialize dataVcc as well
    }
  };

  useEffect(() => {

    const fetchData = async () => {
    try {
      setLoader(true);
      const dataChoices = await fetch(baseUrl);
      const jsondataChoices = await dataChoices.json();
      const DataChoiceslist = jsondataChoices?.data || [];

      const dataVcc = await fetch(vccbaseUrl);
      const jsondataVcc = await dataVcc.json();
      const DataVcclist = jsondataVcc?.data || [];

      const dataCars = await fetch(carsbaseUrl);
      const jsondataCars = await dataCars.json();
      const DataCarslist = jsondataCars?.data || [];

      setLoader(true);
      setData(DataChoiceslist);
      setDatavcc(DataVcclist);
      setDataCars(DataCarslist);
      setLoader(false);
    }catch (error) {
      console.log(error);
    }
  }
  fetchData();
  },[]);

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
          {strings('main.authDesc')}
        </Text>
        <View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:'2%',
      marginLeft:'2%', 
      marginRight:'2%', }}>
            <PhoneInput
                defaultValue={phone}
                defaultCode="AE"
                layout="first"
                onChangeText={(text) => {
                  setPhone(text);
                }}
                containerStyle={{width: width*0.88, }}
                onChangeFormattedText={(text) => {
                  setFormattedValue(text);
                }}
                withDarkTheme
              />
        </View>
        <View style={{width:'90%', justifyContent:'center', alignItems:'center', marginLeft:'2%', 
      marginRight:'2%', marginTop:'2%'}}>
            <SelectList
              setSelected = {(valTo) => handleSelectedItemsChange(valTo)} 
              data = {datass}
              save="key"
              boxStyles={{width:'100%',borderRadius:3}}
              inputStyles={{width:'100%'}}
              placeholder={strings('main.select')}
            />
            {(validation?
            <Text style={{color:'red'}}>{strings("main.fill_all_data")}</Text>:<Text></Text>)}
        </View>
        <View style={{flex:1, width:width*0.88, marginBottom:'2%', borderColor:'#CCC', }}>
            {/* Render SearchableDropdown */}
            <MultiSelect
                hideTags
                items={dataSpecificCars}
                uniqueKey="id"
                ref={(component) => { this.multiSelect = component; }}
                onSelectedItemsChange={onSelectedItemsChange}
                selectedItems={selectedItems}
                selectText="   Pick Cars"
                searchInputPlaceholderText="Search Vins..."
                onChangeInput={(text) => console.log(text)}
                tagRemoveIconColor="#CCC"
                tagBorderColor="#CCC"
                tagTextColor="#CCC"
                selectedItemTextColor="#CCC"
                selectedItemIconColor="#CCC"
                itemTextColor="#343D40"
                displayKey="name"
                searchInputStyle={{color: '#343D40', padding:'3%' }}
                styleItemsContainer={{flex:1}}
                styleDropdownMenuSubsection={{flex:1, width:'100%', height:50,
                borderColor: '#343D40',
                borderWidth: 0.5,
              borderRadius: 5}}
                submitButtonColor="#707070"
                
                submitButtonText="Submit"
              />
              <View style={{flex:1, width:width*0.85}}>
                {/* Render selected items */}
              </View>
        </View>
        <View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
          <TextInput
            placeholder={strings('main.name')}
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
              color: '#05375a'}}
              onChangeText={(val) => setName(val)}
          />
        </View>
       
        <View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
          <TextInput
            placeholder={strings('main.emirates_id')}
            placeholderTextColor="#666666"
            autoCapitalize="none"
            style={{
              flex: 1,
              height:50, 
              margin:'2%', borderWidth:1, borderColor:'#666666',
              textAlign: I18n.locale === 'ar' ? 'right':'left',
              direction: I18n.locale === 'ar' ? 'rtl' : 'ltr',
              paddingLeft: 10,
              color: '#05375a'
            }}
            onChangeText={(val) => setEid(val)}
          />
        </View>
        <View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
          <TextInput
            placeholder={strings('main.notes')}
            placeholderTextColor="#666666"
            autoCapitalize="none"
            style={{
              flex: 1,
              height:50, 
              margin:'2%', borderWidth:1, borderColor:'#666666',
              textAlign: I18n.locale === 'ar' ? 'right':'left',
              direction: I18n.locale === 'ar' ? 'rtl' : 'ltr',
              paddingLeft: 10,
              color: '#05375a'
            }}
            onChangeText={(val) => setNotes(val)}
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
                onPress={selectImage}
            />
          </View>
              {/*Showing the data of selected Single file*/}
              {singleFile != null ? (
               singleFile.map((item,i) => {
                return(
                <View>
                  <Image
                      style={{width:90, height:90}}
                      source={{uri: item.uri}}
                  />
                </View>
                )
              })
              ) : null}
        </View>
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', margin: '5%', alignItems: 'center' }}>
        <CheckBox
          center
          checked={approved}
          value={approved}
          onValueChange={setApproved} // Update the state when the checkbox value changes
          iconType="material-community"
          checkedIcon="checkbox-marked"
          uncheckedIcon="checkbox-blank-outline"
          boxType="square"
          checkedColor="green"
        />
        <Text style={{flex:1, padding:'4%', justifyContent:'center', alignItems:'center'}}> {strings('main.approve_privacy_policy')}</Text>
      </View>
        <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
          <TouchableOpacity
              style={commonStyle.submitbutton}
              onPress={() => uploadFile(fileUri, fileType, fileName)}
              disabled={!approved}>
              <Text style={[commonStyle.buttonTextBlue, {padding: '1%'}]}>{strings('main.submit')}</Text>
          </TouchableOpacity>
        </View></ScrollView>)}
  </SafeAreaView>
  );
};

export default AddAuthorizedRequests;

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
});
