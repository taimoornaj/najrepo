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
} from 'react-native';
import {AuthContext} from '../components/context';
import Loader from '../components/Loader.js';
import I18n from 'react-native-i18n';
import commonStyle from '../assets/style/styles.js';
import {strings} from '../locals/i18n';
import CheckBox from '@react-native-community/checkbox';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const {width, height} = Dimensions.get('window');

const NewPayment = props => {
const {navigation} = props;
const [loader, setLoader] = useState(true);
const [loaderCancelled, setLoaderCancelled] = useState(true);
const [loaderUnpaid, setLoaderUnpaid] = useState(true);
const [loaderBalanced, setLoaderBalanced] = useState(true);
const [data, setData] = useState([]);
const [dataCancelled, setDataCancelled] = useState([]);
const [dataUnpaid, setDataUnpaid] = useState([]);
const [dataBalanced, setDataBalanced] = useState([]);
const [dataSelected, setdataSelected] = React.useState(0);
const [dataCancelledSelected, setdataCancelledSelected] = React.useState(0);
const [dataUnpaidSelected, setdataUnpaidSelected] = React.useState(0);
const [dataBalancedSelected, setdataBalancedSelected] = React.useState(0);


const [checked, setChecked] = useState([]);
const [selectedCars, setselectedCars] = React.useState([]);
const [selectedCarsCount, setselectedCarsCount] = React.useState(0);
const [start, setStart] = React.useState(0);
const [totalAmount, settotalAmount] = React.useState("0");
var baseUrl = "https://api.nejoumaljazeera.co/api/cashier/arrivedCars?customer_id="+AuthContext.id+"&page="+0+"&onlinePayment=1";
var baseUrlCancelled = "https://api.nejoumaljazeera.co/api/cashier/cancelledCars?customer_id="+AuthContext.id+"&page="+0+"&onlinePayment=1";
var baseUrlUnpaid = "https://api.nejoumaljazeera.co/api/cashier/unpaidCars?customer_id="+AuthContext.id+"&page="+0+"&onlinePayment=1";
var baseUrlBalanced = "https://api.nejoumaljazeera.co/api/cashier/balanceOfTransferred?customer_id="+AuthContext.id+"&page="+0+"&onlinePayment=1";

const toggleCheckbox = async (key, remaining_total) => {
  try {

  
  const temp = [...checked];
  const foundIndex = temp.findIndex((car) => car.car_id === key);


  const foundIndex1 = (dataCancelled)?dataCancelled.findIndex((car) => car.car_id === key):-1;
  const foundIndex2 = (dataUnpaid)?dataUnpaid.findIndex((car) => car.car_id === key):-1;
  const foundIndex3 = (dataBalanced)?dataBalanced.findIndex((car) => car.car_id === key):-1;
  const foundIndex4 = (data)?data.findIndex((car) => car.car_id === key):-1;
  
  var count1 = Number(parseFloat(dataCancelledSelected)) + 0;
  var count2 = Number(parseFloat(dataUnpaidSelected)) + 0;
  var count3 = Number(parseFloat(dataBalancedSelected)) + 0;
  var count4 = Number(parseFloat(dataSelected)) + 0;
  
  if(foundIndex1 != -1){
    count1 = Number(parseFloat(dataCancelledSelected)) + 1;
  }

  if(foundIndex2 != -1){
    count2 = Number(parseFloat(dataUnpaidSelected)) + 1;
  }

  if(foundIndex3 != -1){
    count3 = Number(parseFloat(dataBalancedSelected)) + 1;
  }

  if(foundIndex4 != -1){
    count4 = Number(parseFloat(dataSelected)) + 1;
  }

  if (foundIndex !== -1) {
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
    setdataBalancedSelected(count3);
    setdataCancelledSelected(count1);
    setdataUnpaidSelected(count2);
    setdataSelected(count4);
    setselectedCarsCount(count);
    setselectedCars(selectedCarsUpdated);
  }

} catch (error) {
  console.log(error);
}
};

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
                <Text style={commonStyle.headerText}>{strings('main.newPayment')}</Text>
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
        // Fetch Cancelled cars
        setLoaderCancelled(true);
        const responseCancelled = await fetch(baseUrlCancelled);
        const jsonCancelled = await responseCancelled.json();
        const dataCancelled = jsonCancelled?.data || [];
        
        // Fetch Unpaid cars
        setLoaderUnpaid(true);
        const responseUnpaid = await fetch(baseUrlUnpaid);
        const jsonUnpaid = await responseUnpaid.json();
        const dataUnpaid = jsonUnpaid?.data || [];
        // Fetch Transferred cars
        setLoaderBalanced(true);
        const responseTransferred = await fetch(baseUrlBalanced);
        const jsonTransferred = await responseTransferred.json();
        const dataTransferred = jsonTransferred?.data || [];
  
        // Fetch Shipping cars
        setLoader(true);
        const responseShipping = await fetch(baseUrl);
        const jsonShipping = await responseShipping.json();
        const newData = jsonShipping?.data || [];
        const dataShipping = [...data, ...newData];
  
        // Combine data from all API calls
        const allData = [...dataCancelled, ...dataUnpaid, ...dataTransferred, ...dataShipping];
  
        // Create checked array with corresponding length
        const checkedArray = allData.map((car) => ({ car_id: car.car_id, value: false }));
  
        // Set the checked array
        await setChecked(checkedArray);
  
        // Set the fetched data and loaders
        setDataCancelled(dataCancelled);
        setDataUnpaid(dataUnpaid);
        setDataBalanced(dataTransferred);
        setData(newData);
        setLoaderCancelled(false);
        setLoaderUnpaid(false);
        setLoaderBalanced(false);
        setLoader(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [baseUrl, start]);

  const renderItemCancelled = ({item, index}) => {
    let {
      car_id,
      lotnumber,
      vin,
      carMakerName,
      carModelName,
      cancellationDate,
      totalAED,
    } = item;
    const carIndex = checked.findIndex((car) => car.car_id === item.car_id);
    return (
      <View style={localStyles.itemStyle} >
       <View
          style = {{
            flex: 1.5,
            justifyContent:'flex-start',
            alignItems:'flex-start',
          }}>
          <CheckBox
            center
            checked={checked.find((car) => car.car_id === item.car_id)?.value || false}
            value={checked.find((car) => car.car_id === item.car_id)?.value || false}
            onValueChange={() => toggleCheckbox(item.car_id, totalAED)}
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            checkedColor="green"
            disabled={carIndex > 0 && !checked[carIndex - 1]?.value}
         />
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            flex: 5,
          }}>
          <Text style={commonStyle.textBlue}>
            {lotnumber} | {vin}
          </Text>
          <Text style={localStyles.oldPort}> {carModelName} - {carMakerName} </Text>
          <Text style={localStyles.newPort}> 0.00 AED </Text>
        </View>
        <View
          style={{
            flex: 3,
          }}>
            <Text style={localStyles.approved}>
              {totalAED} AED
            </Text>
          <Text style={localStyles.date}> {cancellationDate}</Text>
        </View>
      </View>
    );
  };
  const renderItemUnpaid = ({item, index}) => {
    let {
      car_id,
      lotnumber,
      vin,
      amount_required,
      carMakerName,
      carModelName,
      remaining_total,
      purchasedate,
      totalAED,
      fineTotalCost
    } = item;
    const carIndex = checked.findIndex((car) => car.car_id === item.car_id);
    return (
      <View style={localStyles.itemStyle} >
       <View
          style = {{
            flex: 1.5,
            justifyContent:'flex-start',
            alignItems:'flex-start',
          }}>
          <CheckBox
            center
            checked={checked.find((car) => car.car_id === item.car_id)?.value || false}
            value={checked.find((car) => car.car_id === item.car_id)?.value || false}
            onValueChange={() => toggleCheckbox(item.car_id, totalAED)}
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            checkedColor="green"
            disabled={carIndex > 0 && !checked[carIndex - 1]?.value}
         />
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            flex: 5,
          }}>
          <Text style={commonStyle.textBlue}>
            {lotnumber} | {vin}
          </Text>
          <Text style={localStyles.oldPort}> {carModelName} - {carMakerName} </Text>
          <Text style={localStyles.newPort}> {fineTotalCost} AED </Text>
        </View>
        <View
          style={{
            flex: 3,
          }}>
            <Text style={localStyles.approved}>
              {totalAED} AED
            </Text>
          <Text style={localStyles.date}> {purchasedate}</Text>
        </View>
      </View>
    );
  };
  const renderItemBalanced = ({item, index}) => {
    let {
      car_id,
      lotnumber,
      vin,
      amount_required,
      carMakerName,
      carModelName,
      remaining_total,
      purchasedDate,
      balance,
    } = item;
    const carIndex = checked.findIndex((car) => car.car_id === item.car_id);
    return (
      <View style={localStyles.itemStyle} >
       <View
          style = {{
            flex: 1.5,
            justifyContent:'flex-start',
            alignItems:'flex-start',
          }}>
          <CheckBox
            center
            checked={checked.find((car) => car.car_id === item.car_id)?.value || false}
            value={checked.find((car) => car.car_id === item.car_id)?.value || false}
            onValueChange={() => toggleCheckbox(item.car_id, balance)}
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            checkedColor="green"
            disabled={carIndex > 0 && !checked[carIndex - 1]?.value}
         />
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            flex: 5,
          }}>
          <Text style={commonStyle.textBlue}>
            {lotnumber} | {vin}
          </Text>
          <Text style={localStyles.oldPort}> {carModelName} - {carMakerName} </Text>
          <Text style={localStyles.newPort}> 0.00 AED </Text>
        </View>
        <View
          style={{
            flex: 3,
          }}>
            <Text style={localStyles.approved}>
              {balance} AED
            </Text>
          <Text style={localStyles.date}> {purchasedDate}</Text>
        </View>
      </View>
    );
  };
  const renderItem = ({item, index}) => {
    let {
      car_id,
      lotnumber,
      vin,
      amount_required,
      carMakerName,
      carModelName,
      remaining_total,
      arrival_date,
      storage,
      extra,
    } = item;
    const carIndex = checked.findIndex((car) => car.car_id === item.car_id);
    return (
      <View style={localStyles.itemStyle} >
       <View
          style = {{
            flex: 1.5,
            justifyContent:'flex-start',
            alignItems:'flex-start',
          }}>
          <CheckBox
            center
            checked={checked.find((car) => car.car_id === item.car_id)?.value || false}
            value={checked.find((car) => car.car_id === item.car_id)?.value || false}
            onValueChange={() => toggleCheckbox(item.car_id, remaining_total)}
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            checkedColor="green"
            disabled={carIndex > 0 && !checked[carIndex - 1]?.value}
         />
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            flex: 5,
          }}>
          <Text style={commonStyle.textBlue}>
            {lotnumber} | {vin}
          </Text>
          <Text style={localStyles.oldPort}> {carModelName} - {carMakerName} </Text>
          <Text style={localStyles.newPort}> {amount_required} AED </Text>
        </View>
        <View
          style={{
            flex: 3,
          }}>
            <Text style={localStyles.approved}>
              {remaining_total} AED
            </Text>
          <Text style={localStyles.date}> {arrival_date}</Text>
        </View>
      </View>
    );
  };

  return (
      <SafeAreaView style={commonStyle.marginGlobaleless}>
        <ScrollView 
             contentContainerStyle = {localStyles.container}
             scrollEventThrottle={400}>
        {/** Cancelled Cars */}
        <View style={{backgroundColor:'#0093FF', flexDirection:'row', justifyContent: 'space-between', borderWidth:1, borderColor:'#fff'}}>
            <Text style={{color: '#fff', margin:'3%', fontSize: width*0.04, fontWeight:"500"}}>
              {strings('main.cancelled_cars_payment')}
            </Text>
            <Text style={{color: '#fff', margin:'3%', fontSize: width*0.04, fontWeight:"500"}}>
                {'(' + dataCancelledSelected + '/' + (dataCancelled?.length ?? 0) + ')'}
            </Text>
        </View>
        {dataCancelled?.length > 0 ? (
          <FlatList
            showsHorizontalScrollIndicator={false}
            style={{paddingHorizontal: 10}}
            data={dataCancelled}
            initialNumToRender={10000}
            windowSize={20}
            maxToRenderPerBatch={10000}
            getItemLayout={(dataCancelled, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            removeClippedSubviews={true}
            keyExtractor={item => item.car_id.toString()}
            renderItem={renderItemCancelled}
            ListFooterComponentStyle={{marginTop: height * 0.1}}
          />
        ) : loaderCancelled ? (
          <View style={localStyles.loaderStyle}>
            <Loader loader={true} />
          </View>
        ) : (
          <View style={{}}>
          </View>
        )}
        {/** Unpaid in auction */}
        <View style={{backgroundColor:'#0093FF', flexDirection:'row', justifyContent: 'space-between', borderWidth:1, borderColor:'#fff'}}>
              <Text style={{color: '#fff', margin:'3%', fontSize: width*0.04, fontWeight:"500"}}>
                {strings('main.unpaid_cars')}
              </Text>
              <Text style={{color: '#fff', margin:'3%', fontSize: width*0.04, fontWeight:"500"}}>
              {'(' + dataUnpaidSelected + '/' + (dataUnpaid?.length ?? 0) + ')'}
              </Text>
        </View>
        {dataUnpaid?.length > 0 ? (
          <FlatList
            showsHorizontalScrollIndicator={false}
            style={{paddingHorizontal: 10}}
            data={dataUnpaid}
            initialNumToRender={10000}
            windowSize={20}
            maxToRenderPerBatch={10000}
            getItemLayout={(dataUnpaid, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            removeClippedSubviews={true}
            keyExtractor={item => item.car_id.toString()}
            renderItem={renderItemUnpaid}
            ListFooterComponentStyle={{marginTop: height * 0.1}}
          />
        ) : loaderUnpaid ? (
          <View style={localStyles.loaderStyle}>
            <Loader loader={true} />
          </View>
        ) : (
          <View>
          </View>
        )}
        {/** Balance of transferred */}
        <View style={{backgroundColor:'#0093FF', flexDirection:'row', justifyContent: 'space-between', borderWidth:1, borderColor:'#fff'}}>
              <Text style={{color: '#fff', margin:'3%', fontSize: width*0.04, fontWeight:"500"}}>
                {strings('main.balanced_cars')}
              </Text>
              <Text style={{color: '#fff', margin:'3%', fontSize: width*0.04, fontWeight:"500"}}>
                {'(' + dataBalancedSelected + '/' + (dataBalanced?.length ?? 0) + ')'}
              </Text>
        </View>
        {dataBalanced?.length > 0 ? (
          <FlatList
            showsHorizontalScrollIndicator={false}
            style={{paddingHorizontal: 10}}
            data={dataBalanced}
            initialNumToRender={10000}
            windowSize={20}
            maxToRenderPerBatch={10000}
            getItemLayout={(dataBalanced, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            removeClippedSubviews={true}
            keyExtractor={item => item.car_id.toString()}
            renderItem={renderItemBalanced}
            ListFooterComponentStyle={{marginTop: height * 0.1}}
          />
        ) : loaderBalanced ? (
          <View style={localStyles.loaderStyle}>
            <Loader loader={true} />
          </View>
        ) : (
          <View>
          </View>
        )}

        {/** Shipping cars */}
        <View style={{backgroundColor:'#0093FF', flexDirection:'row', justifyContent: 'space-between', borderWidth:1, borderColor:'#fff'}}>
                <Text style={{color: '#fff', margin:'3%', fontSize: width*0.04, fontWeight:"500"}}>
                  {strings('main.shipping_cars')}
                </Text>
                <Text style={{color: '#fff', margin:'3%', fontSize: width*0.04, fontWeight:"500"}}>
                  {'(' + dataSelected + '/' + (data?.length ?? 0) + ')'}
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
            keyExtractor={item => item.car_id.toString()}
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
                  {strings('main.pay_selected_cars')} ({selectedCarsCount})
                </Text>
                <Text style={{color: '#fff', marginLeft:'3%', marginRight:'3%', marginBottom:'3%', fontSize: width*0.04, fontWeight:"500"}}>
                  AED {Number(totalAmount.toLocaleString()).toFixed(2)}
                </Text>
            </View>
            {selectedCarsCount > 0?
            <TouchableOpacity
              activeOpacity={1} onPress={() => 
                navigation.navigate('doPayment', {'cars': selectedCars, total: totalAmount.toFixed(2)})}
              style={{backgroundColor:'#fff',margin:'2%', borderRadius: 5 , justifyContent:'center'}}>
                <Text style={{color: '#0B9A21',  padding:'2%', fontSize: width*0.04, fontWeight:"500"}}>
                  {strings('main.proceed')}
                </Text>
            </TouchableOpacity>:
            <TouchableOpacity disabled = {true}
            activeOpacity={1} onPress = {() => 
              navigation.navigate('doPayment', {'cars': selectedCars, total: totalAmount.toFixed(2)})}
            style={{backgroundColor:'#EDEDED',margin:'2%', borderRadius: 5 , justifyContent:'center'}}>
              <Text style={{color: '#707070',  padding:'2%', fontSize: width*0.04, fontWeight:"500"}}>
                {strings('main.proceed')}
              </Text>
          </TouchableOpacity>}
          </View>
      </SafeAreaView>
  );
};

export default NewPayment;

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
    height: height * 0.14,
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
