import React, { useState, useEffect  } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    Animated,
    TouchableOpacity,
    TouchableHighlight,
    View,
    Alert,
    Dimensions,
    StatusBar,
    ImageBackground,
    SafeAreaView
} from 'react-native';

import { SwipeListView } from 'react-native-swipe-list-view';
import { AuthContext } from '../components/context';
import  Loader  from '../components/Loader.js';
import commonStyle from '../assets/style/styles.js';
import { strings } from '../locals/i18n';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Container, Header, Tab, Tabs, TabHeading } from 'native-base';

const {width, height} = Dimensions.get('window'); 

export default function Notification({navigation}) {

    const [data, setData] = React.useState({
        loader      : false,
        notification    : [],
        post_page   : 0,
        load_more   : false,
        arrays      :[],
        notifCars   : false
    });
    

    navigation.setOptions({
        header: () => (
            <SafeAreaView>
                    <View style={[commonStyle.headernoShadow, {flexDirection: 'row', justifyContent: 'center', alignItems:'center'}]}>
                    <View style={{flex:0.2, justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity activeOpacity={1} onPress={() => navigation.reset({
                            routes: [{ name: "HomeDrawer" }]
                        })}>
                            <FontAwesomeIcon 
                                icon= { faArrowLeft }
                                color="#fff"
                                size={width*0.06}
                            />
                        </TouchableOpacity>
            
                    </View>
                    <View style={{flex:0.8, justifyContent: 'center', alignItems:'center'}}>
                        <Text style = {commonStyle.headerText}>{strings('main.notification')}</Text>
                        <Tabs>
                            <Tab heading={strings('main.cars')}>
                                <Text>{strings('main.cars')}</Text>
                            </Tab>
                            <Tab heading={strings('main.announcements')} onPress={getAnnouncements}>
                                <Text>{strings('main.announcements')}</Text>
                            </Tab>
                        </Tabs>
                    </View>
                    <View style={{marginRight: 16, justifyContent: 'flex-start', alignItems: 'flex-end', flex: 0.2}}>
                        <TouchableOpacity onPress={openallNotification}>
                            <View>
                                <Text style={commonStyle.redgradientText}>{strings('main.clearall')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    </View> 
            </SafeAreaView>
)
    });


    const openallNotification = () => {
        setData({
            ...data,
            loader: true,
        });
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('customer_id', AuthContext.id);
        var Url  = AuthContext.server_url + "/Nejoum_App/deleteallNotification";
        //var Url  = "https://www.nejoumaljazeera.tech/my_system/Nejoum_App/addtoFavorit";
        fetch(Url, {
            method: 'POST',
            credentials: 'same-origin',
            body:formData,
        })
        .then((response) => {
            if(response.ok){
            return response;
            }
            throw Error(response.success);
        })
        .then(res => res.json())
        .then((response) => {
            if(response.success == 'success'){
                setData({
                    ...data,
                    loader: false,
                });
                var notification = [];
                setListData(notification);
                return;
            }
            else {
                setData({
                    ...data,
                    loader: false,
                });
                return;
            }
        })
        .catch((error) => {
            setData({
                ...data,
                loader: false,
            });
            Alert.alert('Error', 'Connection Error', [
                {text: 'Okay'}
            ]);
        });
    }

    const getAnnouncements = () => {
        console.log('fsadfdddd');
    };

    const [listData, setListData] = useState(listData);

     // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
            setData({
                ...data,
                loader: true,
            });
            const server_url =  AuthContext.server_url;
            const customer_id    =  AuthContext.id;
            const formData = new FormData();
            formData.append('client_id', '1230');
            //formData.append('start', 0);
            //formData.append('length', 20);
            formData.append('client_secret', '1230NEJOUM1230');
            formData.append('customer_id', customer_id);
            var Url  = server_url + "/Nejoum_App/getNotification";
            fetch(Url, {
                method: 'POST',
                credentials: 'same-origin',
                body:formData,
            })
            .then((response) => {
                if(response.ok){
                  return response;
                }
                throw Error(response.success);
            })
            .then(res => res.json())
            .then((response) => {
                if(response.success == 'success'){
                    const valuesData = [];
                    if(response.data.length > 0){
                        response.data.map( ( item, i )=> {
                            valuesData.push(
                            {
                                index: item.notification_id,
                                //carImage:  AuthContext.server_url + '/uploads/'+ item.photo,
                                carImage: item.image_small,
                                notification_id: item.notification_id,
                                carModelName: (item.carModelName.substr(0,item.carModelName.indexOf(' ')) != '')?
                                item.carModelName.substr(0,item.carModelName.indexOf(' ')):item.carModelName,
                                carMakerName: item.carMakerName,
                                year: item.year,
                                notification_text: item.notification_text,
                                created_date: item.created_date,
                                type_info:item.type_info,
                                car_level: item.car_level
                            });
                        });
                    }
                    setData({
                        ...data,
                        loader         : false,
                        notification   : valuesData,
                        listData       : valuesData,
                        post_page      : response.data.length
                    });
                    setListData(valuesData);
                    return;
                }
                else{
                    setData({
                        ...data,
                        loader         : false,
                        error_message  : 'error'
                    });
                    Alert.alert('Error', 'Error Occured', [
                        {text: 'Okay'}
                    ]);
                    return;
                }
            })
            .catch((error) => {
                setData({
                    ...data,
                    loader         : false,
                    error_message  : 'error'
                });
                Alert.alert('Error', 'Connection Error', [
                    {text: 'Okay'}
                ]);
            });  
    }, []);

    

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const deleteNotification = (data, item) => {
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('notification_id', item);
        formData.append('customer_id', AuthContext.id);
        var Url  = AuthContext.server_url + "/Nejoum_App/openNotification";
        //var Url  = "https://www.nejoumaljazeera.tech/my_system/Nejoum_App/addtoFavorit";
        fetch(Url, {
            method: 'POST',
            credentials: 'same-origin',
            body:formData,
        })
        .then((response) => {
            if(response.ok){
              return response;
            }
            throw Error(response.success);
        })
        .then(res => res.json())
        .then((response) => {
            //console.warn(response);
            if(response.success == 'success'){
                /**var array_temp = this.state.notification;
                var index = array_temp.findIndex(p => p.notification_id == item)
                if (index !== -1) {
                    array_temp.splice(index, 1);
                }

                this.setState({
                    loader      : false,
                    notification: array_temp
                });**/
                setListData(data)
                return;
            }
            else {
                setData({
                    ...data,
                    loader         : false,
                    error_message  : 'error'
                });
                Alert.alert('Error', 'Error Occured', [
                    {text: 'Okay'}
                ]);
                return;
            }
        })
        .catch((error) => {
            setData({
                ...data,
                loader         : false,
                error_message  : 'error'
            });
            Alert.alert('Error', 'Connection Error', [
                {text: 'Okay'}
            ]);
        });
    }

    const deleteRow = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);
        const newData = [...listData];
        const prevIndex = listData.findIndex(item => item.index === rowKey);
        //console.warn('ffadsfd');
        newData.splice(prevIndex, 1);
        //setListData(newData);
        deleteNotification(newData, rowKey);
    };

    const onRightAction = (rowMap) => {
        console.log('onRightAction', rowMap);
    };
    

    const VisibleItem = props => {
        console.log(props.leftActionState);

        const {
            rowHeightAnimatedValue,
            rightActionState,
            leftActionState,
            data,
            removeRow,
        } = props;

        /**if (rightActionState) {
            Animated.timing(rowHeightAnimatedValue, {
                toValue: 0,
                duration: 200,
            }).start(() => {
                //removeRow();
                console.log("Animation DONE")
            });
        }**/
        var car_level = data.item.car_level;
        var textcolor = '#0d5db8';
        var borderColor = '#000';
        if(car_level == 'store'){
            borderColor = '#0d5db8';
            textcolor = '#000';
        }else if (car_level == 'towing'){
            borderColor = '#E51178';
            textcolor = '#000';
        }else if (car_level == 'loading'){
            borderColor = '#11E57F';
            textcolor = '#000';
        }else if (car_level == 'shipping'){
            borderColor = '#E51511';
            textcolor = '#000';
        }else if (car_level == 'new'){
            borderColor = '#E1E511';
            textcolor = '#000';
        }
        return (
            <Animated.View
                style = {[
                    styles.rowFront,
                    { height: rowHeightAnimatedValue },
                    leftActionState && { backgroundColor: 'transparent' },
                ]}
            >
                <TouchableOpacity activeOpacity={1}
                    onPress = {() => navigation.navigate('carDetails2', {'data': data.item.type_info[0], 'type': data.item.car_level})}
                    style = {[
                        styles.rowFront,
                        leftActionState && {
                            backgroundColor: 'transparent',
                        },
                    ]}>
                    <View style={{ flexDirection: "row", flex: 1, backgroundColor:'#fff', borderTopRightRadius: 40,
                    borderBottomLeftRadius: 25,}}>
                        <View style={{flex:0.3, flexDirection: 'row'}}>
                            <Image
                                resizeMode={'cover'}
                                style={styles.tinyLogo}
                                source={{uri: data.item.carImage}}
                            />
                            <Image
                                style={{flexDirection:'row',height:'100%', resizeMode: 'contain'}}
                                source={require('../assets/_Path_.png')}
                            />
                        </View>
                        <View style={{flex: 0.7, padding: '1%'}}>
                            <View style={{ flexDirection: 'row', justifyContent:'space-around'}}>
                                <Text  style={commonStyle.normalgreyTextHeader}>
                                    {data.item.carMakerName}
                                </Text>
                               
                                <Text style={commonStyle.normalgreyTextHeader}>
                                    {data.item.carModelName}
                                </Text>
                                <Text  style={commonStyle.normalgreyTextHeader}>
                                    {data.item.year}
                                </Text>
                            </View> 
                            <View
                                style={{ flexDirection: 'column', justifyContent:'center', alignItems:'center'}}>
                                <Text style={[commonStyle.normalgreybigText, {color:textcolor, textAlign:'center', marginTop:'3%'}]}>
                                    {data.item.notification_text}
                                </Text>
                            </View>
                            <View
                                style={{ flexDirection: 'row', justifyContent:'flex-end', alignItems:'flex-end', paddingRight:'3%'}}>
                                <Text style={[commonStyle.normalgreysmallText]}>
                                    {data.item.created_date}
                                </Text>
                            </View>
                            
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };


    const renderItem = (data, rowMap) => {
        const rowHeightAnimatedValue = new Animated.Value(height*0.12);
        return (
            <VisibleItem
                rowHeightAnimatedValue={rowHeightAnimatedValue}
                data={data}
                removeRow={() => deleteRow(rowMap, data.item.index)}
            />
        );
    };

    const HiddenItemWithActions = props => {
        const {
            leftActionActivated,
            rightActionActivated,
            swipeAnimatedValue,
            rowActionAnimatedValue,
            rowHeightAnimatedValue,
            onClose,
            onDelete,
        } = props;

        if (rightActionActivated) {
            Animated.spring(rowActionAnimatedValue, {
                toValue: 75,
            }).start();
        } else {
            Animated.spring(rowActionAnimatedValue, {
                toValue: 75,
            }).start();
        }

        return (
            <Animated.View
                style={[
                    styles.rowBack,
                    { height: rowHeightAnimatedValue },
                    leftActionActivated && { backgroundColor: 'transparent' },
                ]}
            >

                {!leftActionActivated && (
                    <Animated.View
                        style={[
                            styles.backRightBtn,
                            styles.backRightBtnRight,
                            { flex: 1, width: rowActionAnimatedValue },
                        ]}
                    >
                        <TouchableOpacity
                            style={[
                                styles.backRightBtn,
                                styles.backRightBtnRight,
                            ]}
                            onPress={onDelete}
                        >
                            <Animated.View
                                style={[
                                    styles.trash,
                                    {
                                        transform: [
                                            {
                                                scale: swipeAnimatedValue.interpolate(
                                                    {
                                                        inputRange: [-90, -45],
                                                        outputRange: [1, 0],
                                                        extrapolate: 'clamp',
                                                    }
                                                ),
                                            },
                                        ],
                                    },
                                ]}
                            >
                                <Image
                                    source={require('../assets/trash.png')}
                                    style={styles.trash}
                                />
                            </Animated.View>
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </Animated.View>
        );
    };

    const renderHiddenItem = (data, rowMap) => {
        const rowActionAnimatedValue = new Animated.Value(75);
        const rowHeightAnimatedValue = new Animated.Value(height*0.12);
        return (
            <HiddenItemWithActions
                data={data}
                rowMap={rowMap}
                rowActionAnimatedValue={rowActionAnimatedValue}
                rowHeightAnimatedValue={rowHeightAnimatedValue}
                onClose={() => closeRow(rowMap, data.item.index)}
                onDelete={() => deleteRow(rowMap, data.item.index)}
            />
        );
    };

    if(data.loader){

        return(
            <Loader loader={data.loader}></Loader>
        );
    }
    
    
    return (
        <View style={commonStyle.backgroundimage}>
            <SafeAreaView style={{backgroundColor:'transparent', flex:1}}>
                <View style={styles.container}>
                    <SwipeListView
                        disableRigthSwipe
                        data={listData}
                        renderItem={renderItem}
                        renderHiddenItem={renderHiddenItem}
                        leftOpenValue={75}
                        rightOpenValue={-75}
                        leftActivationValue={100}
                        rightActivationValue={-100}
                        leftActionValue={0}
                        rightActionValue={-100}
                        onRightAction={onRightAction}
                        useNativeDriver={false}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        alignItems: 'center',
        justifyContent: 'center',
        height: height*0.12,
        width: '100%',
        margin:'1%'
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: 'transparent',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        margin:'1%'
    },
    backRightBtn: {
        alignItems: 'flex-end',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        paddingRight: 17,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
        borderTopRightRadius: 40,
    },
    trash: {
        height: 25,
        width: 25,
        marginRight: 7,
    },
    tinyLogo: {
        width: '100%',
        height: '100%',
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20
    },
});