/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
 import DropShadow from "react-native-drop-shadow";

 import React, { Component } from 'react';
 import {
     StyleSheet,
     ScrollView,
     View,
     Text,
     Image,
     TouchableOpacity,
     ActivityIndicator,
     RefreshControl,
     Alert,
     ImageBackground,
     FlatList,
     SafeAreaView,
     Dimensions,
     StatusBar,
     TouchableWithoutFeedback
 } from 'react-native';
 import * as Animatable from 'react-native-animatable';
 import LinearGradient from 'react-native-linear-gradient';
 import { strings } from '../locals/i18n';
 import { AuthContext } from '../components/context';
 import Loader from '../components/Loader.js';
 import I18n from 'react-native-i18n';
 import { Button } from 'react-native-elements';
 import { Badge } from 'react-native-elements';
 import commonStyle from '../assets/style/styles.js';
 import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
 import { faPlusCircle, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
 import Modal from 'react-native-modal';
 import WithTailwindHook from '../components/hooks/WithTailwindHook';
 const { width, height } = Dimensions.get('window');
 const radius = height * 0.3 / 2;//0.35
 const center = radius - 15;
 const circlesmalsize = height * 0.09;
 
 //function Dashboard () {
class Complaints extends Component {
 
     constructor(props) {
         super(props);
         this.state = {
             loader: false,
             fulldata: [],
             post_page: 0,
             load_more: false,
             arrays: [],
             search: '',
             dataSource: [],
             countries: ['uk'],
             searcharrayLotvin: [],
             store: '',
             type: '',
             new: '',
             port: '',
             delivered: '',
             warehouse: '',
             loading: '',
             towing: '',
             no_data: false,
             visible: false,
             loaderinside: false,
             activeFilter: 'Open',
             chatStatuses:[],
         }
         this.props.navigation.setOptions({
             header: () => (
                 <View style={commonStyle.header}>
                     <View style={{
                         flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                         marginTop: height * 0.05, flex: 1
                     }}>
                         <View style={{
                             flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 0.2
                             , justifyContent: 'flex-start', alignItems: 'flex-start'
                         }}>
                             <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate('Dashboard')}>
                                 <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, flexDirection: 'row' }}>
                                     <View>
                                         <FontAwesomeIcon
                                             icon={faChevronLeft}
                                             color="#fff"
                                             size={width * 0.06}
                                         />
                                     </View>
                                     <Text style={commonStyle.headerText}>{strings('main.back')}</Text>
                                 </View>
                             </TouchableOpacity>
                         </View>
                         <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 0.9 }}>
                             <Text style={commonStyle.headerText}>{strings('main.complaints')}</Text>
                         </View>
                         <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 0.2 }}>
                             <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate("contactCompany")}>
                             <Image source={require('../assets/chat_message_nj.png')} style={[{height: width * 0.085, padding:2, borderRadius:5, width: width * 0.085 }]} />
                             </TouchableOpacity>
 
                         </View>
                     </View>
                 </View>)
         });
     }
     handleFilterPress = (filterType) => {
         this.setState({ activeFilter: filterType }, () => {
             this.getData(filterType);
         });
     };
     setModalVisible = (val) => {
         this.setState({ visible: val });
     }
 
     componentDidMount() {
        this.getData(this.state.activeFilter?this.state.activeFilter:'Open');
        this.focusListener = this.props.navigation.addListener('focus', () => {
            const filter = this.props.route.params?.filter ==0 ? 'Open': this.props.route.params?.filter==2?'Closed':this.props.route.params?.filter==1?'Pending':this.props.route.params?.filter==3?'waitingonCustomer':'Open';
            this.handleFilterPress(filter)
        });
        this.fetchComplaintStatusCounts();
    }
    
    componentWillUnmount() {
        this.focusListener();
    }
    fetchComplaintStatusCounts = async () => {
        try {
          const response = await fetch(`https://api.nejoumaljazeera.co/api/complaintMessageStatuses?customer_id=${AuthContext.id}`);
            console.error(response);
          const data = await response.json();
            this.setState({
                chatStatuses: data.data,
            });
        } catch (error) {
        //   console.error('Error fetching complaint statuses:', error);
          Alert.alert('Error', 'Failed to fetch complaint Statuses.', [{ text: 'Okay' }]);
          return;
        }
      };
 
     closeandopen = function (isCollapsed, index) {
         var newAnswer = [this.state.Collapsed];
         var arrayCollapstemp = []
         // Chage value of new array
         newAnswer.forEach(element => {
             arrayCollapstemp.push(false);
         });
         newAnswer = arrayCollapstemp;
 
         this.setState((state) => {
 
             newAnswer[index] = isCollapsed
 
 
             return { Collapsed: newAnswer }
         }
         )
     }
 
     getData = (filterType) => {
         this.setState({
             loader: true,
         });

         let Url;
         if (filterType === 'Open') {
             Url = `https://api.nejoumaljazeera.co/api/complaintMessageNoAuth?complaint_status=0&customer_id=${AuthContext.id}`;
         }if (filterType === 'waitingonCustomer') {
            Url = `https://api.nejoumaljazeera.co/api/complaintMessageNoAuth?complaint_status=3&customer_id=${AuthContext.id}`;
        } else if (filterType === 'Pending') {
             Url = `https://api.nejoumaljazeera.co/api/complaintMessageNoAuth?complaint_status=1&customer_id=${AuthContext.id}`;
         } else if (filterType === 'Closed') {
             Url = `https://api.nejoumaljazeera.co/api/complaintMessageNoAuth?complaint_status=2&customer_id=${AuthContext.id}`;
         }
 
         fetch(Url, {
             method: 'GET',
             credentials: 'same-origin',
         })
             .then((response) => {
                 if (response.ok) {
                     return response.json(); // Parse the JSON response
                 } else {
                     throw new Error('Network response was not ok');
                 }
             })
             .then((data) => {
                 if (data && data.data) {
                     const arrayCollaps = data.data.map(() => false); // Initialize arrayCollaps with false values
 
                     this.setState({
                         loader: false,
                         fulldata: data.data,
                         Collapsed: arrayCollaps,
                         post_page: data.data.length
                     });
                 } else {
                     this.setState({
                         loader: false,
                         error_message: 'Error',
                         no_data: true
                     });
                 }
             })
             .catch((error) => {
                 this.setState({
                     loader: false,
                     error_message: error.message
                 });
                 console.error('Error fetching data:', error);
                 // Alert.alert('Error', 'Connection Error', [{ text: 'Okay' }]);
             });
     }
     
 
 
     render() {
        const { tailwind } = this.props;
         const { activeFilter } = this.state;
         if (this.state.load_more) {
             var load_more = <View style={{ backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                 <Image source={require("../assets/loadingapp.gif")}
                     style={{ justifyContent: 'center', width: 50, height: 50, alignItems: 'center', flex: 0.2 }}
                     resizeMode="contain">
                 </Image>
             </View>;
 
             //<ActivityIndicator style={{alignItems:'center', padding:10}}></ActivityIndicator>;
         }
         else {
             var load_more = [];
         }
 
 
 
         if (this.state.no_data) {
             return (
                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                     <Text style={commonStyle.noDataText}>
                         {strings('main.no_data')}
                     </Text>
                 </View>
             );
         }
 
         return (
            <SafeAreaView style={[tailwind('h-full'), { backgroundColor: '#f1f1f1', borderBottomColor: 'rgba(0,0,0,0.6)', borderBottomWidth: 0.45 }]}>
            {
                     this.state.loader?(
                         <Loader loader={this.state.loader}></Loader>):
                     (
 
                         <ScrollView style={{}}>
                            
                             <View style={{ flex: 1, backgroundColor: '#EDEDED',marginBottom:5,marginTop: 3 }}>
                                <View style={{ flex: 1, backgroundColor: '#EDEDED', marginBottom: 5, marginTop: 3 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10, marginBottom: 3 }}>
                                        <TouchableOpacity
                                            style={[tailwind(`${'mt-3 bg-white shadow-lg'} 
                                                flex-row p-2 align-center text-center rounded-lg  
                                                justify-center content-center items-center flex-1`),{
                                                shadowColor: '#000',
                                                 marginHorizontal:1.8,
                                                shadowOffset: { width: 0, height: 2 },
                                                shadowOpacity: 0.2,
                                                shadowRadius: 2,
                                                elevation: 1,
                                                backgroundColor: activeFilter === 'Pending' ? '#013188' : '#FFF',
                                                width: '23.5%',
                                                alignItems: 'center',
                                                justifyContent:'center',
                                                padding: 5,
                                                borderRadius: 5,
                                            }]}
                                            onPress={() => this.handleFilterPress('Pending')}>
                                                <Text style={[tailwind(`${'text-xdDarkblue '} text-center text-xxs flex-1 font-bold`),{ padding: '9%', color: activeFilter === 'Pending' ? '#FFF' : '#013188',  }]}>
                                                    {strings('main.pending')}
                                                </Text>
                                            <View style={{position:'absolute',top:-7, right:2}}>
                                              
                                            </View>
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
                                                backgroundColor: activeFilter === 'waitingonCustomer' ? '#013188' : '#FFF',
                                                width: '23.5%',
                                                alignItems: 'center',
                                                justifyContent:'center',
                                                padding: 5,
                                                borderRadius: 5,
                                            }]}
                                            onPress={() => this.handleFilterPress('waitingonCustomer')}
                                        >
                                             <Text style={[tailwind(`${'text-xdDarkblue '} text-center text-xxs flex-1 font-bold`),{ color: activeFilter === 'waitingonCustomer' ? '#FFF' : '#013188', }]}>
                                                {strings('main.waitingonCustomer')}
                                            </Text>
                                      
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
                                                backgroundColor: activeFilter === 'Open' ? '#013188' : '#FFF',
                                                width: '23.5%',
                                                alignItems: 'center',
                                                justifyContent:'center',
                                                padding: 5,
                                                borderRadius: 5,
                                            }]}
                                            onPress={() => this.handleFilterPress('Open')}
                                        >
                                            <Text style={[tailwind(`${'text-xdDarkblue '} text-center text-xxs flex-1 font-bold`),{ color: activeFilter === 'Open' ? '#FFF' : '#013188', }]}>
                                                {strings('main.open')}
                                            </Text>
                                           
                                         
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
                                                backgroundColor: activeFilter === 'Closed' ? '#013188' : '#FFF',
                                                width: '23.5%',
                                                alignItems: 'center',
                                                justifyContent:'center',
                                                padding: 5,
                                                borderRadius: 5,
                                            }]}
                                            onPress={() => this.handleFilterPress('Closed')}
                                        >
                                            <Text style={[tailwind(`${'text-xdDarkblue '} text-center text-xxs flex-1 font-bold`),{ color: activeFilter === 'Closed' ? '#FFF' : '#013188', }]}>
                                                {strings('main.closed')}
                                            </Text>
                                    
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                 {
                                     (this.state.fulldata.length > 0) ? this.state.fulldata.map((item, i) => {
                                         return (
                                             <View key={i} style={{}}>
                                                 <DropShadow
                                                    style={{
                                                        shadowColor: "#000",
                                                        shadowOffset: {
                                                        width: 0,
                                                        height: 0,
                                                        },
                                                        shadowOpacity: 0.7,
                                                        shadowRadius: 1,
                                                    
                                                    }}
                                                    >
                                                 <TouchableOpacity activeOpacity={1}
                                                     onPress={() => this.props.navigation.navigate('complaintsDetailsWrapper', { 'complaint_message_id': item.complaint_message_id, 'title': item.title, 'lot_vin': item.lot_vin, 'complaint_type': item.complaint_type,'complaint_status':item.status })}
                                                     style={[
                                                         styles.rowFront,{borderRadius: 6,}
                                                     ]}>
                                                     {/* 15884  */}
                                                     <View style={[styles.containerShadow,{
                                                         flexDirection: "row", flex: 1, borderColor: '#7F7F7F',  
                                                          alignItems: 'center', justifyContent: 'center',
                                                     }]}>
                                                         <View style={{ flex: 0.2, alignItems: 'center', justifyContent: 'center' }}>
                                                             <Image
                                                                 source={require('../assets/images/Complaint.png')}
                                                                 style={{ width: width * 0.07, height: width * 0.07, resizeMode: 'contain' }} />
                                                         </View>
                                                         <View style={{ flex: 0.6, padding: '1%' }}>
                                                             <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                                                 {/* <Text style={[commonStyle.normalgreyTextHeader, { color: '#343D40', fontSize: width * 0.06 }]}>
                                                                     {console.log('title: '+item.title)}
                                                                 </Text> */}
                                                             </View>
                                                             <View
                                                                 style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                                 <Text style={[commonStyle.normalgreybigText, { color: '#343D40', textAlign: 'center', fontSize: width * 0.035, textTransform: 'capitalize',fontWeight:'500' }]}>
                                                                     {item.title}
                                                                 </Text>
                                                             </View>
                                                             <View
                                                                 style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: '3%' }}>
                                                                 <Text style={[commonStyle.normalgreysmallText, { color: '#343D40' }]}>
                                                                     {item.create_date}
                                                                 </Text>
                                                             </View>
 
                                                         </View>
                                                         <View style={{ flex: 0.2, alignItems: 'center', justifyContent: 'center' }}>
                                                            
                                                         </View>
                                                     </View>
                                                 </TouchableOpacity>
                                                 </DropShadow>
                                             </View>
 
                                         )
                                     }) : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                         <Text style={commonStyle.noDataText}>
                                             {strings('main.no_data')}
                                         </Text>
                                     </View>
                                 }
                                 {load_more}
 
                             </View>
 
 
 
 
                         </ScrollView>
                     )}
             </SafeAreaView>
         )
 
     }
 }
 export default WithTailwindHook(Complaints);
 const styles = StyleSheet.create({
     container: {
         flexGrow: 1
     },
     activeFilter: {
         borderRadius: 20, paddingHorizontal: '10%', backgroundColor: '#013188', paddingVertical: '3%', marginHorizontal: 10
     }, notActiveFilter: {
         borderRadius: 20, paddingHorizontal: '9%', backgroundColor: '#fff', paddingVertical: '3%', marginHorizontal: 10
     },
     activeFilterText: {
         color: 'white', fontSize: width * 0.03,
         fontWeight: 'bold'
     }, notActiveFilterText: {
         color: '#234789', fontSize: width * 0.03,
         fontWeight: 'bold',
     },
     containerShadow:{
         // shadowColor: '#000',
         // shadowOffset: {
         //   width: 0,
         //   height: 2,
         // },
         // shadowOpacity: 0.25,
         // shadowRadius: 3.84,
         // shadowColor: "#000",
 // shadowOffset:{
 // width: 0,
 // height: 2,
 // },
 // shadowOpacity: 0.23,
 // shadowRadius: 2.62,
 // elevation: 4,
         // elevation: 0.4,
     },
     footerModel: {
         backgroundColor: '#0d5db8',
         flexDirection: "row",
         alignItems: "center",
         width: '75%',
         borderBottomLeftRadius: 50,
         alignSelf: 'flex-end',
         shadowColor: "#000",
         shadowOffset: {
             width: 0,
             height: 12,
         },
         shadowOpacity: 0.58,
         shadowRadius: 16.00,
         elevation: 18,
         backgroundColor: "#0000"
     },
     rowContainer: {
         flexDirection: 'row',
         justifyContent: 'center',
         alignItems: 'center'
     },
     textwhite: {
         color: '#fff',
         fontSize: 20,
     },
     linearGradient: {
         flex: 1,
         /**paddingLeft: 15,
         paddingRight: 15,
         borderRadius: 5**/
     },
     numbergradient: {
         flex: 3,
         width: '75%',
         borderTopRightRadius: 25,
     },
     buttonText: {
         fontSize: 15,
         fontFamily: 'Gill Sans',
         textAlign: 'center',
         margin: 10,
         color: '#b8130d',
         backgroundColor: 'transparent',
     },
     buttonNav: {
         width: 120,
         height: 100,
         margin: 20,
         borderRadius: 20,
         borderColor: '#ffff',
         backgroundColor: '#ffff',
         shadowColor: "#000",
         shadowOffset: {
             width: 0,
             height: 12,
         },
         shadowOpacity: 0.58,
         shadowRadius: 16.00,
         elevation: 24,
     },
     ImageIconStyle: {
         padding: 10,
         margin: 5,
         height: 50,
         width: 50,
         resizeMode: 'stretch',
     },
     horizontalSlider: {
         flex: 1,
         flexDirection: 'column',
     },
     sliderView: {
         alignItems: 'center',
         width: 90,
         borderRadius: 10,
         borderWidth: 1,
         borderColor: 'grey',
         margin: 4
     },
     ImageIconStyleup: {
         width: 150,
         height: 80,
         resizeMode: 'stretch',
     },
     buttonTextup: {
         fontSize: 15,
         fontFamily: 'Gill Sans',
         textAlign: 'center',
         marginTop: 2,
         color: '#000',
         backgroundColor: 'transparent',
     },
     tinyLogo: {
         width: '100%',
         height: '100%',
         borderTopRightRadius: 60,
         borderBottomLeftRadius: 25
     },
     image: {
         flex: 1,
         resizeMode: "stretch",
         width: '100%',
         justifyContent: "center",
         borderTopRightRadius: 40,
         borderBottomLeftRadius: 40
     },
     imgBackground: {
         flex: 1,
         width: '100%',
         resizeMode: "contain",
         justifyContent: "center"
     },
     iconstyle: {
         resizeMode: "cover",
         justifyContent: "center",
         width: 20,
         height: 20
     },
     leftContainer: {
         flex: 0.3,
         flexDirection: 'row',
         justifyContent: 'center',
         alignItems: 'center'
     },
     rightContainer: {
         flex: 0.7,
         flexDirection: 'row',
         justifyContent: 'flex-end',
         alignItems: 'center',
     },
     navBar: {
         flexDirection: 'row',
         justifyContent: 'space-between',
         alignItems: 'center',
     },
     normalText: {
         color: '#ffff',
     },
     normalgreyText: {
         color: '#A3A9AF',
         fontSize: 16,
     },
     normalgreyTextHeader: {
         fontSize: 16,
         color: '#676767',
     },
     iconstyleHeader: {
         resizeMode: "cover",
         justifyContent: "center",
         marginBottom: 10,
         width: 25,
         height: 25
     },
     content: {
         flex: 0.8,
         backgroundColor: 'white',
         padding: 22,
         justifyContent: 'center',
         alignItems: 'center',
         borderTopRightRadius: 17,
         borderTopLeftRadius: 17,
     },
     contentTitle: {
         fontSize: 20,
         marginBottom: 12,
     },
     contentView: {
         justifyContent: 'flex-end',
         margin: 0,
     },
     circleArrived: {
         width: 75,
         height: 75,
         borderColor: '#149414',
         zIndex: 20,
         resizeMode: "cover",
         justifyContent: "center",
         alignItems: 'center',
         left: '275%',
         borderWidth: 2,
         borderRadius: 100 / 2,
         backgroundColor: '#0c55a8'
     },
     iconUaePort: {
         resizeMode: "contain",
         justifyContent: "center",
         alignItems: 'center',
         width: 50,
         height: 50,
     },
     circleUaePort: {
         width: 75,
         height: 75,
         zIndex: 20,
         resizeMode: "cover",
         justifyContent: "center",
         alignItems: 'center',
         left: '275%',
         borderColor: 'red',
         borderWidth: 2,
         borderRadius: 100 / 2,
         backgroundColor: '#0a4180'
     },
     iconUaePortArrived: {
         resizeMode: "contain",
         justifyContent: "center",
         alignItems: 'center',
         width: 40,
         height: 40,
     },
     circleArrivedwhite: {
         width: 75,
         height: 75,
         zIndex: 20,
         resizeMode: "cover",
         justifyContent: "center",
         alignItems: 'center',
         left: '275%',
         borderColor: '#149414',
         borderWidth: 2,
         borderRadius: 100 / 2,
         backgroundColor: '#ffff'
     },
     actual: {
         width: 75,
         height: 75,
         zIndex: 200,
         position: 'absolute',
         resizeMode: "cover",
         justifyContent: "center",
         alignItems: 'center',
         left: '80%',
         right: 0,
         borderRadius: 100 / 2,
         backgroundColor: 'transparent'
     },
     iconstyleArrow: {
         height: 10,
         width: 10,
         resizeMode: 'stretch',
     },
     rowFront: {
         alignItems: 'center',
         justifyContent: 'center',
         height: height * 0.12,
         backgroundColor: '#fff',
         width: '98%',
         margin: '1%'
     },
 });