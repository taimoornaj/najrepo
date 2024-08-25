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
import WithTailwindHook from "../components/hooks/WithTailwindHook";
import { MultipleSelectList } from 'react-native-dropdown-select-list';

const {width, height} = Dimensions.get('window');

const AddDamageRequest = props => {
  var baseUrl  = `https://api.nejoumaljazeera.co/api/getLotNumbersDamage?customer_id=${
    AuthContext.id
  }`;
  
  const {navigation} = props;
  const [loader, setLoader] = useState(true);
  const [datass, setData] = useState([]);
  const [imagesStore, setimagesStore] = useState([]);
  const [dataParts, setDataParts] = useState([]);
  const [selectedDamagePartIds, setSelectedDamagePartIds] = useState([]);
  const [imagesWarehouse, setimagesWarehosue] = useState([]);
  const [valTo, setSelectedTo] = React.useState("");
  const [validation, setValidation] = React.useState(false);
  const [notes, setNotes] = React.useState("");
  const [fileUri, setfileUri] = React.useState(null);
  const [fileName, setfileName] = React.useState(null);
  const [fileType, setfileType] = React.useState(null);
  const [singleFile, setSingleFile] = React.useState(null);
  const [transferFee, setTransferFee] = React.useState(0);
  const [imagesFiles, setimagesFiles] = React.useState([]);
  const [carData, setcarData] = React.useState([]);
  const [selectedImageIds, setSelectedImageIds] = useState([]);
  const [selectedImageIdss, setSelectedImageIdss] = useState([]);

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
    if(valTo == null || imagesFiles.length ==0){
        Alert.alert('Error', 'Missing required field', [
            {text: 'Okay'}
        ]);
        return;
      }
    setLoader(true);
    const extension = getExtention(fileType);
    const formData = new FormData();
    var Url = "https://api.nejoumaljazeera.co/api/uploadDamageRequest";

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
    formData.append('car_id', valTo);
    formData.append('selectedDamagePartIds', (selectedDamagePartIds)?JSON.stringify(selectedDamagePartIds):JSON.stringify([]));
    formData.append('w_images', (selectedImageIds)?JSON.stringify(selectedImageIds):JSON.stringify([]));
    formData.append('s_images', (selectedImageIdss)?JSON.stringify(selectedImageIdss):JSON.stringify([]));
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
        navigation.navigate("MyDamagedCarsRequest", {'refresh': Math.random().toString()});
        // Handle the response data here
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      setLoader(false);
      ToastAndroid.show('Error', ToastAndroid.SHORT);
      navigation.navigate("MyDamagedCarsRequest", {'refresh': Math.random().toString()});
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
      await setimagesFiles(images);
    } catch (error) {
      console.log('Error picking images:', error);
    }
  };

  const selectImageStore = (imageId) => {
    // Check if the image ID is already in the selectedImageIds array
    if (!selectedImageIdss.includes(imageId)) {
      // If not, add it to the array
      setSelectedImageIdss(prevIds => [...prevIds, imageId]);
    } else {
      // If already selected, you can choose to remove it or ignore
      // For example, to remove it:
      setSelectedImageIdss(prevIds => prevIds.filter(id => id !== imageId));
    }
  };


  const selectImageWarehouse = (imageId) => {
    // Check if the image ID is already in the selectedImageIds array
    if (!selectedImageIds.includes(imageId)) {
      // If not, add it to the array
      setSelectedImageIds(prevIds => [...prevIds, imageId]);
    } else {
      // If already selected, you can choose to remove it or ignore
      // For example, to remove it:
      setSelectedImageIds(prevIds => prevIds.filter(id => id !== imageId));
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
      var temp = [];
      data.forEach(object => {
        temp.push({key: object.id, value: object.lotnumber},);
      });
      setData(temp);
      // Update state with the fetched data
      setLoader(false);
    };
        
    const fillImagesarr = async (valTo) => {
      setLoader(true);
      var type = 'damagewarehouse';
      var Url = `https://api.nejoumaljazeera.co/api/getImages?car_id=${valTo}&type=${type}`;
      try {
          const response = await fetch(Url);
          const json = await response.json();
          if (json?.images?.length > 0) {
              setimagesWarehosue(json.images);
          } else {
              // Handle the case when there are no images
          }
      } catch (error) {
          Alert.alert(error.toString());
      }
      setLoader(false);
  };

  const getCarInfo = async (valTo) => {
    setLoader(true);
    var Url = `https://api.nejoumaljazeera.co/api/getCarInfo?car_id=${valTo}`;
    try {
        const response = await fetch(Url);
        const json = await response.json();
        setcarData(json.data[0]);
    } catch (error) {
        Alert.alert(error.toString());
    }
    setLoader(false);
};

const fillImagesarrStore = async (valTo) => {
  setLoader(true);
  var type = 'damagestore';
  var Url = `https://api.nejoumaljazeera.co/api/getImages?car_id=${valTo}&type=${type}`;
  try {
      const response = await fetch(Url);
      const json = await response.json();
      if (json?.images?.length > 0) {
          setimagesStore(json.images);
      } else {
          // Handle the case when there are no images
      }
  } catch (error) {
      Alert.alert(error.toString());
  }
  setLoader(false);
};

    fetchData();
    getCarInfo(valTo);
    fetchDamageParts();
    fillImagesarrStore(valTo);
    fillImagesarr(valTo);
  }, [valTo]);

  const setFilter = async (selectedValue) => {
    setSelectedTo(selectedValue); // Set the selected value
    //await fillImagesarr(selectedValue); // Fetch images based on the selected value
  };

  const fetchDamageParts =  async () =>  {
    try {
        const response = await fetch('https://api.nejoumaljazeera.co/api/getDamageParts');
        const result = await response.json();

        // Transform the data to the format expected by SelectList
        const transformedData = result.data.map(part => ({
            key: part.id,
            value: part.name,
        }));

        setDataParts(transformedData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  };

  const handleSelection = (value) => {
    setSelectedDamagePartIds(prevState => {
        if (prevState.includes(value)) {
            return prevState.filter(id => id !== value);
        } else {
            return [...prevState, value];
        }
    });
  };

  const tailwind= props.tailwind;
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
          {strings('main.addDamageDes')}
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
        <View style={{width:'90%', justifyContent:'center', alignItems:'center', marginBottom:'2%',
      marginTop:'2%'}}>
            <SelectList
              setSelected = {(value) => setSelectedTo(value)} 
              data = {datass}
              save="key"
              boxStyles={{width:'100%',borderRadius:3, flexDirection:(I18n.locale == 'en')?'row':'row-reverse', 
              textAlign:(I18n.locale == 'en')?'left':'right'}}
              inputStyles={{width:'100%', textAlign:(I18n.locale == 'en')?'left':'right'}}
              placeholder={strings('car.select')+" "+strings('car.lotnumber')}
            />
            {(validation?
            <Text style={{color:'red'}}>{strings("main.fill_all_data")}</Text>:<Text></Text>)}
        </View>

        <View style={{width:'90%', justifyContent:'center', alignItems:'center',}}>
              <MultipleSelectList 
                setSelected={(val) => setSelectedDamagePartIds(val)} 
                data={dataParts} 
                save="key"
                // onSelect={() => Alert.alert('Selected Items', JSON.stringify(selectedDamagePartIds))}
                label={strings('car.select')+" "+strings('car.damage_parts')}
                maxHeight={height*0.30}
                dropdownStyles={{width:'100%', textAlign:(I18n.locale == 'en')?'left':'right'}} 
                dropdownItemStyles={{width:'100%', textAlign:(I18n.locale == 'en')?'left':'right'}} 
                boxStyles={{width:'100%',borderRadius:3, flexDirection:(I18n.locale == 'en')?'row':'row-reverse', 
                  textAlign:(I18n.locale == 'en')?'left':'right'}}
                  inputStyles={{width:'100%', textAlign:(I18n.locale == 'en')?'left':'right'}}
                  placeholder={strings('car.select')+" "+strings('car.damage_parts')}
              />
            {(validation?
            <Text style={{color:'red'}}>{strings("main.fill_all_data")}</Text>:<Text></Text>)}
        </View>
         {/* Section to display fetched images */}
         {carData?.photo && 
         <View style={{flex:1, flexDirection:'row', borderBottomColor:'#0d2750',
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
                       resizeMode: "cover",
                       borderRadius: 2
                     }}
                     source = {{uri: (carData && carData.photo)?(carData.photo):''}}
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
                         {carData?.year + " "+carData?.carMakerName  + " " + carData?.carModelName}
                       </Text>
                     </View>
                     <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                       <Text style={tailwind('text-lightblue ml-3 flex-start font-bold text-xxs capitalize flex-1 text-left ')}>
                         { strings('car.lotnumber') +" # " + carData?.lotnumber}
                       </Text>
                     </View>
 
 
                     <View style={tailwind('flex-row justify-between   text-start items-start')}>
                       <Text style={tailwind('flex-initial  w-[3rem]     ml-3 text-xxxs  ')}>{strings('car.vin')} </Text>
                       <Text style={tailwind('flex-initial  ml-3   text-xxxs  ')}>
                         {(carData)?carData.vin:''}{' '}
                       </Text>
                     </View>
                     <View style={tailwind('flex-row justify-between   text-start items-start')}>
                       <Text style={tailwind('flex-initial    w-[3rem]    ml-3 text-xxxs  ')}>{strings('main.model')} </Text>
                       <Text style={tailwind('flex-initial  ml-3   text-xxxs  ')}>
                         {(carData)?carData.carModelName:''}{' '}
                       </Text>
                     </View>
 
                     <View style={tailwind('flex-row justify-between   text-start items-start')}>
                       <Text style={tailwind('flex-initial     w-[3rem]       ml-3 text-xxxs  ')}>{strings('main.maker')} </Text>
                       <Text style={tailwind('flex-initial  ml-3   text-xxxs  ')}>
                         {(carData)?carData.carMakerName:''}{' '}
                       </Text>
                     </View>
                     <View style={tailwind('flex-row justify-between   text-start items-start')}>
                       <Text style={tailwind('flex-initial     w-[3rem]    ml-3 text-xxxs  ')}>{strings('main.year')} </Text>
                       <Text style={tailwind('flex-initial  ml-3   text-xxxs  ')}>
                         {(carData)?carData.year:''}{' '}
                       </Text>
                     </View>
                   </View>:
                   <View
                     style={{flex:1, justifyContent:'flex-start', alignItems:'flex-start'}}>
                     <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                       <Text style={tailwind('text-darkblue ml-3 flex-start font-bold text-md capitalize flex-1 text-left ')}>
                         {carData?.year + " "+carData?.carMakerName  + " " + carData?.carModelName}
                       </Text>
                     </View>
                     <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                       <Text style={tailwind('text-lightblue ml-3 flex-start font-bold text-xxs capitalize flex-1 text-left ')}>
                         { strings('car.lotnumber') +" # " + carData?.lotnumber}
                       </Text>
                     </View>
                     <View style={tailwind('flex-row justify-between  ml-3 text-start items-start')}>
                       <Text style={tailwind('flex-initial w-[9rem] text-xxxs  ')}>{strings('car.vin')} </Text>
                       <Text style={tailwind('flex-initial  w-[15rem]  text-xxxs  ')}>
                         {(carData)?carData.vin:''}{' '}
                       </Text>
                     </View>
                     <View style={tailwind('flex-row justify-between  ml-3 text-start items-start')}>
                       <Text style={tailwind('flex-initial w-[9rem] text-xxxs  ')}>{strings('main.model')} </Text>
                       <Text style={tailwind('flex-initial  w-[15rem]  text-xxxs  ')}>
                         {(carData)?carData.carModelName:''}{' '}
                       </Text>
                     </View>
                     <View style={tailwind('flex-row justify-between  ml-3 text-start items-start')}>
                       <Text style={tailwind('flex-initial w-[9rem] text-xxxs  ')}>{strings('main.maker')} </Text>
                       <Text style={tailwind('flex-initial  w-[15rem]  text-xxxs  ')}>
                         {(carData)?carData.carMakerName:''}{' '}
                       </Text>
                     </View>
                     <View style={tailwind('flex-row justify-between  ml-3 text-start items-start')}>
                       <Text style={tailwind('flex-initial w-[9rem] text-xxxs  ')}>{strings('main.year')} </Text>
                       <Text style={tailwind('flex-initial  w-[15rem]  text-xxxs  ')}>
                         {(carData)?carData.year:''}{' '}
                       </Text>
                     </View>
 
                   </View>
                 }
               </View>
}
               {imagesWarehouse.length>0 &&(
         <View style={{ alignItems: 'center', marginVertical: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#013188' }}>
                {strings('main.images_warhouse')}
            </Text>
          </View>
          )} 
         <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            {imagesWarehouse.map((image, index) => (
              <TouchableOpacity key={index} onPress={() => selectImageWarehouse(image.id)}>
                 <Image
                  source = {{ uri: image.image }}
                  style = {[
                    { width: 100, height: 100, margin: 5 },
                    selectedImageIds.includes(image.id) && { borderColor: '#4091F7', borderWidth: 3 }
                    // Conditional style for selected images
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>

          {imagesStore.length > 0 && (
                  <View style={{ alignItems: 'center', marginVertical: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#013188' }}>
                      {strings('main.images_store')}
                    </Text>
                  </View>
                )}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            {imagesStore.map((image, index) => (
              <TouchableOpacity key={index} onPress={() => selectImageStore(image.id)}>
                <Image
                  source = {{ uri: image.image }}
                  style = {[
                    { width: 100, height: 100, margin: 5 },
                    selectedImageIdss.includes(image.id) && { borderColor: '#4091F7', borderWidth: 3 }
                    // Conditional style for selected images
                  ]}
                />
              </TouchableOpacity>
            ))}
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


export default WithTailwindHook(AddDamageRequest);

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
