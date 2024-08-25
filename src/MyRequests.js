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
} from 'react-native';
import {AuthContext} from '../components/context';
import Loader from '../components/Loader.js';
import I18n from 'react-native-i18n';
import commonStyle from '../assets/style/styles.js';
import {strings} from '../locals/i18n';

const {width, height} = Dimensions.get('window');

const MyRequests = props => {
  const baseUrl = `https://api.nejoumaljazeera.co/api/getAllDestinationRequest?customer_id=${
    AuthContext.id
  }`;
  const {navigation} = props;
  const [loader, setLoader] = useState(true);
  const [data, setData] = useState([]);
  useEffect(() => {
    navigation.setOptions({tabBarVisible: false});

    const fetcher = async () => {
      setLoader(true);
      const response = await fetch(baseUrl);
      console.log('=>(MyRequests.js:33) baseUrl', baseUrl);
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
    fetcher().then(data => {
      setData(data);
      console.log('=>(MyRequests.js:48) data from Fetcher', data);
      setLoader(false);
    });
  }, [baseUrl, navigation]);

  const renderItem = ({item}) => {
    let {
      id,
      lot,
      vin,
      status,
      date,
      old_port_name,
      old_port_name_ar,
      new_port_name,
      new_port_name_ar,
    } = item;
    const new_port = I18n.locale == 'ar' ? new_port_name_ar : new_port_name;
    const old_port = I18n.locale == 'ar' ? old_port_name_ar : old_port_name;

    return (
      <View style={localStyles.itemStyle} key={item.id}>
        <View
          style={{
            backgroundColor: '#fff',
            flex: 5,
          }}>
          <Text style={commonStyle.textBlue}>
            {lot} | {vin}
          </Text>
          <Text style={localStyles.oldPort}>From: {old_port}</Text>
          <Text style={localStyles.newPort}>To: {new_port}</Text>
        </View>
        <View
          style={{
            flex: 2,
          }}>
          {status == 0 ? (
            <TouchableOpacity
              onPress={() => {
                deleteRequest(item.id);
              }}>
              <Text style={localStyles.deleteBtn}>
                {strings('main.delete_request')}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={localStyles.approved}>
              {strings('main.request_approved')}
            </Text>
          )}
          <Text style={localStyles.date}> {date}</Text>
        </View>
      </View>
    );
  };

  const deleteRequest = async id => {
    console.log('=>(MyRequests.js:187) item.id', id);
    const data = {
      id: id,
    };

    const baseUrl =
      'https://api.nejoumaljazeera.co/api/deleteDestinationRequest';
    try {
      const request = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const json = await request.json();
      if (json.success) {
        alert(json.message);
        navigation.navigate('MyRequests');
      } else {
        alert(json.message);
      }
    } catch (error) {
      alert('Something went wrong');
    }
  };

  return (
      <SafeAreaView style={commonStyle.marginGlobaleless}>
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
      </SafeAreaView>
  );
};

export default MyRequests;

const localStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
