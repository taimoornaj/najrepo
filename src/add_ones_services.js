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
  Alert
} from 'react-native';
import {AuthContext} from '../components/context';
import Loader from '../components/Loader.js';
import I18n from 'react-native-i18n';
import commonStyle from '../assets/style/styles.js';
import {strings} from '../locals/i18n';
import CheckBox from '@react-native-community/checkbox';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width, height} = Dimensions.get('window');

const Add_ones_services = props => {
const {navigation} = props;
const [loader, setLoader] = useState(true);
const [data, setData] = useState([]);
const [dataSelected, setdataSelected] = React.useState(0);
const [checked, setChecked] = useState([]);
const [selectedCars, setselectedCars] = React.useState([]);
const [selectedCarsCount, setselectedCarsCount] = React.useState(0);
const [totalAmount, settotalAmount] = React.useState("0");
var baseUrl = "https://api.nejoumaljazeera.co/api/getAllSpecialRequest?customer_id="+AuthContext.id;


const toggleCheckbox = (key, remaining_total) => {
  const updatedChecked = checked.map((car) => ({
    id: car.id,
    value: car.id === key ? !car.value : false, // Toggle the selected checkbox, and uncheck others
  }));

  const selectedCar = data.find((car) => car.id === key);
  const total = updatedChecked.some((car) => car.value)
    ? selectedCar
      ? selectedCar.amount
      : 0
    : 0; // Set total to 0 if no checkboxes are selected

  setChecked(updatedChecked);
  settotalAmount(total);
  setselectedCarsCount(updatedChecked.filter((car) => car.value).length);
  setselectedCars(updatedChecked.filter((car) => car.value).map((car) => car.id));
};

/**const toggleCheckbox = async (key, remaining_total) => {

  try {
  const temp = [...checked];
  const foundIndex = temp.findIndex((car) => car.id === key);

  const foundIndex4 = (data)?data.findIndex((car) => car.id === key):-1;
  
  var count4 = Number(parseFloat(dataSelected)) + 0;

  if(foundIndex4 != -1){
    count4 = count4 + 1;

    console.error(dataSelected);
  }

  if (foundIndex != -1) {

    temp[foundIndex].value = !temp[foundIndex].value;
    
    var total = 0;
    var selectedCarsUpdated = [];
    
    if (temp[foundIndex].value) {

      // If checked, add the car ID to the selectedCars array
      selectedCarsUpdated = [...selectedCars, key];
      if (typeof remaining_total === "string") {
        var amount_required2 = remaining_total.replace(",", "");
      } else {
        var amount_required2 = remaining_total;
      }
      total = Number(parseFloat(totalAmount)) + Number(parseFloat(amount_required2));

    } else {
      // If unchecked, remove the car ID from the selectedCars array
      selectedCarsUpdated = selectedCars.filter((id) => id !== key);
      if (typeof remaining_total === "string") {
        var amount_required2 = remaining_total.replace(",", "");
      } else {
        var amount_required2 = remaining_total;
      }
      total = Number(parseFloat(totalAmount)) - Number(parseFloat(amount_required2));
    }
    
    var count = temp.reduce(function (n, car) {
      return n + (car.value === true);
    }, 0);

    // Update the checked state with the new array and other state variables
    setChecked(temp);
    settotalAmount(total);
    setdataSelected(count);
    setselectedCarsCount(count);
    setselectedCars(selectedCarsUpdated);
  }

} catch (error) {
  console.error(error);
}
};**/

navigation.setOptions({
    header: () => (
      <View style = {commonStyle.header}>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
          marginTop: height*0.05, flex:1}}>
              <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
            ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                  <TouchableOpacity activeOpacity={1} onPress={() => navigation.goBack()}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', flex:1, flexDirection:'row'}}>
                            <View>
                                <FontAwesomeIcon
                                  icon={ faChevronLeft }
                                  color="#fff"
                                  size={width*0.06}
                                />
                            </View>
                            <Text style={commonStyle.headerText}>{strings('main.back')}</Text>
                        </View>
                  </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.9}}>
                <Text style={commonStyle.headerText}>{strings('main.add_ons_services')}</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                <Text style={commonStyle.headerText}></Text>
              </View>
            </View>       
      </View>
    ),tabBarVisible: false});
      
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Shipping cars
        setLoader(true);
        const responseShipping = await fetch(baseUrl);
        const jsonShipping = await responseShipping.json();
        const newData = jsonShipping?.data || [];
        const dataShipping = newData;

        const allData = dataShipping;
  
        // Create checked array with corresponding length
        const checkedArray = allData.map((car) => ({ id: car.id, value: false }));
  
        // Set the checked array
        await setChecked(checkedArray);
  
        // Set the fetched data and loaders
        setData(newData);
        setLoader(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [baseUrl]);

  const renderItem = ({item, index}) => {
    let {
      id,
      name_en,
      name_ar,
      amount,
      photo,
      description
    } = item;
    return (
      <View style={localStyles.itemStyle} >
       <View
          style = {{
            flex: 1.5,
            justifyContent:'center',
            alignItems:'center',
            height: '100%'
          }}>
          <CheckBox
            center
            checked={checked.find((car) => car.id === id)?.value || false}
            value={checked.find((car) => car.id === id)?.value || false}
            onValueChange={() => toggleCheckbox(id, amount)}
            iconType="material-community"
            checkedIcon={<Icon name="checkbox-marked-outline" size={24} color="green" />}
            uncheckedIcon={<Icon name="checkbox-blank-outline" size={24} color="green" />}
            checkedColor="green"
         />
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            flex: 5,
            height: '100%',
            justifyContent:'center',
          }}>
          <Text style={commonStyle.textBlue}>
            {I18n.locale == 'ar'?name_ar:name_en}
          </Text>
          <Text style={localStyles.oldPort}> {description} </Text>
        </View>
        <View
          style={{
            flex: 3,
          }}>
            <Text style={localStyles.approved}>
              {amount} $
            </Text>
        </View>
      </View>
    );
  };

  const addRequest = async () => {
    if(selectedCars == null || selectedCars.length == 0 || !props.route.params.car_id){
        Alert.alert('Error', 'Missing required field', [
            {text: 'Okay'}
        ]);
        return;
      }
    setLoader(true);  
    const formData = new FormData();
    var Url  = "https://api.nejoumaljazeera.co/api/addLoadingRequest";
    formData.append('customer_id', AuthContext.id);
    formData.append('services', JSON.stringify(selectedCars));
    formData.append('car_id', props.route.params.car_id);
    try {
      const response = await fetch(Url, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        Alert.alert('Success', 'Update Successfully', [
          {text: 'Okay'}
        ]);
        setLoader(false);
        navigation.navigate('Dashboard');
        // Handle the response data here
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      setLoader(false);
      Alert.alert('Error', 'Error Occured', [
        {text: 'Okay'}
      ]);
      // Handle the error here
    }
  };

  return (
      <SafeAreaView style={commonStyle.marginGlobaleless}>
        <ScrollView
             contentContainerStyle = {localStyles.container}
             scrollEventThrottle={400}>
        {/** Shipping cars */}
        <View style={{flex:0.08, backgroundColor: '#343D40', flexDirection:'column', padding:'3%'}}>
            <Text style={{color: '#fff', fontWeight:'bold', }}>
              {props.route.params.year } {props.route.params.carMakerName } {props.route.params.carModelName }
            </Text>
            <Text style={{color: '#fff'}}>
            Lot# {props.route.params.lotnumber}</Text>
            <Text style={{color: '#fff'}}>
            VIN# {props.route.params.vin}</Text>
            <Text style={{color: '#fff'}}>
            {props.route.params.purchasedate}</Text>
        </View>
        <View style={{backgroundColor:'#0093FF', flexDirection:'row', justifyContent: 'space-between', borderWidth:1, borderColor:'#fff'}}>
            <Text style={{color: '#fff', margin:'3%', fontSize: width*0.04, fontWeight:"500"}}>
              {strings('main.available_services')}
            </Text>
            <Text style={{color: '#fff', margin:'3%', fontSize: width*0.04, fontWeight:"500"}}>
              {'(' + (data?.length ?? 0) + ')'}
            </Text>
        </View>
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
            keyExtractor={item => item.id.toString()}
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
      </ScrollView>
          <View style={{backgroundColor:'#0B9A21', flexDirection:'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'column'}}>
                <Text style={{color: '#fff', margin:'3%', fontSize: width*0.04, fontWeight:"500"}}>
                  {strings('car.total')} ({selectedCarsCount})
                </Text>
                <Text style={{color: '#fff', marginLeft:'3%', marginRight:'3%', marginBottom:'3%', fontSize: width*0.04, fontWeight:"500"}}>
                  $ {totalAmount.toLocaleString()}
                </Text>
            </View>
            {totalAmount > 0?
            <TouchableOpacity
              activeOpacity={1} onPress={() => addRequest()}
              style={{backgroundColor:'#fff',margin:'2%', borderRadius: 5 , justifyContent:'center'}}>
                <Text style={{color: '#0B9A21',  padding:'2%', fontSize: width*0.04, fontWeight:"500"}}>
                  {strings('main.request')}
                </Text>
            </TouchableOpacity>:
            <TouchableOpacity disabled = {true}
            activeOpacity={1} onPress={() => addRequest()}
            style={{backgroundColor:'#EDEDED',margin:'2%', borderRadius: 5 , justifyContent:'center'}}>
              <Text style={{color: '#707070',  padding:'2%', fontSize: width*0.04, fontWeight:"500"}}>
                {strings('main.request')}
              </Text>
          </TouchableOpacity>}
          </View>
      </SafeAreaView>
  );
};

export default Add_ones_services;

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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: '1%',
    height: height * 0.15,
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
