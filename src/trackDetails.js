
/**
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

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
     BackHandler,
     ImageBackground,
     TextComponent,
     TouchableWithoutFeedback,
     Modal,
     StatusBar,
     Dimensions,
     Button,
     TextInput,
     SafeAreaView,
 } from 'react-native';
 import * as Animatable from 'react-native-animatable';
 import LinearGradient from 'react-native-linear-gradient';
 import { strings } from '../locals/i18n';
 import { AuthContext } from '../components/context';
 import Loader from '../components/Loader.js';
 import ModalMsg from '../components/ModalMsg.js';
 import Icon from 'react-native-vector-icons/FontAwesome';
 import { Overlay } from 'react-native-elements';
 import I18n from 'react-native-i18n';
 import ImageViewer from 'react-native-image-zoom-viewer';
 import Share from 'react-native-share';
 import ImgToBase64 from 'react-native-image-base64';
 import commonStyle from '../assets/style/styles.js';
 import { CheckBox } from "native-base";
 import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
 import { faArrowLeft, faSliders, faShare, faCircleXmark, faUpload, faImage, faXmarkCircle, faC, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
 import ImageModal from 'react-native-image-modal';
 import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
 import Modal2 from 'react-native-modal';
 import CarCard from "../components/molecules/CarCard";
 import WithTailwindHook from "../components/hooks/WithTailwindHook";
 import { useTailwind } from "tailwind-rn";
 import DocumentPicker from 'react-native-document-picker';
 import RNFetchBlob from 'rn-fetch-blob';
 import ImagePicker from 'react-native-image-crop-picker';
 import { FlashList } from "@shopify/flash-list";
import { SearchBar } from 'react-native-elements';
import FloatingActionButton from '../components/FloatingActionButton.js';

import { faX } from '@fortawesome/free-solid-svg-icons';
 const { width, height } = Dimensions.get('window');
 
 let TrackDetails = class TrackDetails extends Component {
     _menu = null;
     constructor(props) {
         super(props);
         this.state = {
             loader: false,
             listLoader: false,
             fulldata: [],
             originalData: [],
             post_page: 0,
             load_more: false,
             arrays: [],
             visible: false,
             notes: '',
             visibleImage: false,
             imagesSlider: [],
             selectedLang1: false,
             selectedLang2: false,
             selectedLang3: false,
             undelivered: true,
             delivered: false,
             deliveredunpaid: false,
             deliveredpaid: false,
             show_filterpaid: false,
             displayImage: false,
             no_data: false,
             allNotes: [],
             isModalVisible: false,
             isModalVisiblePaidBy: false,
             loaderinside: false,
             dataDetails: [],
             imagesFiles: [],
             fileUri: '',
             fileName: '', fileType: '',
             notesPaid: '',
             lotnumberPaid: '',
             vinPaid: '',
             isLoading:false,
             start:0,
             searcharrayLotvin: [],
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
                             <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
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
                             <Text style={commonStyle.headerText}>{this.props.route.params.titltePage} ({this.props.route.params.count})</Text>
                         </View>
                         <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 0.2 }}>
                             {this.props.route.params.type == 'warehouse' ? (<View style={{ justifyContent: 'flex-start', alignItems: 'center', flex: 0.2 }}>
                                 <Menu
                                     style={{ backgroundColor: '#fff' }}
                                     ref={this.setMenuRef}
                                     button={
 
                                         <TouchableOpacity activeOpacity={1} onPress={this.showMenu}>
                                             <FontAwesomeIcon
                                                 icon={faSliders}
                                                 color="#fff"
                                                 size={width * 0.06}
                                             />
 
                                         </TouchableOpacity>}
                                 >
                                     {this.props.route.params.valuesData.length > 0 ? (
                                         <View style={{ flex: 1 }}>
                                             <MenuItem textStyle={{ color: '#013188', backgroundColor: '#fff' }}
                                                 onPress={this.getData.bind()}>{strings('car.all')}</MenuItem>
                                             {this.props.route.params.valuesData.map((item, i) => {
                                                 return (
                                                     <MenuItem textStyle={{ color: '#013188', backgroundColor: '#fff' }}
                                                         onPress={this.getwarehouseData.bind(item, item.warehouse_id, item.warehouse_name)}>{item.warehouse_name} ({item.totalcount})</MenuItem>
                                                 )
                                             })
                                             }
                                         </View>
                                     ) : (
                                         <View></View>
                                     )}
 
                                 </Menu>
                             </View>) : (
 
                                 <Text style={commonStyle.headerText}></Text>
                             )}
 
                         </View>
                     </View>
                 </View>
             )
         });
         this.clearSearch = this.clearSearch.bind(this);
     }
 
     clearSearch = () => {
        // Clear the search term and reset data
        alert("G")
        this.setState({
            search: '',
            fulldata: this.state.originalData, 
        });
    };

     SearchFilterFunction(text) {
        const newData = this.state.fulldata.filter(item => {
            const itemData = `${item.lotnumber}`;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({ search: text, fulldata: newData });
    }
     saveNotes = () => {
         this.setState({
             loaderinside: true,
         });
         const formData = new FormData();
         formData.append('client_id', '1230');
         formData.append('client_secret', '1230NEJOUM1230');
         formData.append('customer_id', AuthContext.id);
         formData.append('car_id', this.state.car_id);
         formData.append('notes', this.state.inputValue);
         var Url = AuthContext.server_url + "/Nejoum_App/save_notes";
         fetch(Url, {
             method: 'POST',
             credentials: 'same-origin',
             body: formData,
         })
             .then((response) => {
                 if (response.ok) {
                     return response;
                 }
                 throw Error(response.success);
             })
             .then(res => res.json())
             .then((response) => {
                 if (response.success == 'success') {
                     var notes = this.state.allNotes;
                     notes.push(
                         {
                             id: this.state.car_id,
                             note: this.state.inputValue
                         });
                     this.setState({
                         loaderinside: false,
                         isModalVisible: false,
                         inputValue: '',
                         allNotes: notes
                     });
                     return;
                 }
                 else {
                     this.setState({
                         loaderinside: false,
                         error_message: 'error',
                     });
                     Alert.alert('Error', 'Error Occured', [
                         { text: 'Okay' }
                     ]);
                     return;
                 }
             })
             .catch((error) => {
                 this.setState({
                     loaderinside: false,
                     error_message: error
                 });
                 console.log(error);
                 Alert.alert('Error', 'Connection Error', [
                     { text: 'Okay' }
                 ]);
             });
     }
 
     componentDidMount() {
         BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
         this.getData("");
     }
 
 
     getExtention = (mime) => {
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
 
     setMenuRef = ref => {
         this._menu = ref;
     };
 
     showMenu = () => {
         this._menu.show();
     };
 
 
     getwarehouseData = (warehouse_id, warehouse_id2, warehouse_name) => {
         this.setState({ warehouse_name: warehouse_id2 });
         this._menu.hide();
         this.getDataonWarehouse(warehouse_id);
     }
 
     getDataonWarehouse = (warehouse_id) => {
         this.setState({
             loader: true
         });
         const formData = new FormData();
         formData.append('client_id', '1230');
         formData.append('client_secret', '1230NEJOUM1230');
         formData.append('customer_id', AuthContext.id);
         formData.append('warehouse_id', warehouse_id);
         var Url = AuthContext.server_url + "/Nejoum_App/getDataonWarehouse";
         fetch(Url, {
             method: 'POST',
             credentials: 'same-origin',
             body: formData,
         })
             .then((response) => {
                 if (response.ok) {
                     return response;
                 }
                 throw Error(response.success);
             })
             .then(res => res.json())
             .then((response) => {
                 if (response.success == 'success') {
                     this.setState({
                         loader: false,
                         fulldata: response.data,
                         post_page: 0,
                         load_more: false,
                         total_data: response.data.length
                     });
                     return;
                 }
                 else {
                     this.setState({
                         loader: false,
                         fulldata: [],
                         post_page: 0,
                         no_data: true
                     });
                     return;
                 }
             })
             .catch((error) => {
                 this.setState({
                     loader: false,
                 });
                 Alert.alert(strings('main.network_error'), strings('main.network_error'), [
                     { text: strings('main.ok') }
                 ]);
             });
     }
 
     componentWillUnmount() {
         BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
     }
 
     handleBackButton = () => {
         this.props.navigation.goBack();
         return true;
     };
 
 
     componentDidUpdate(prevProps) {
         if (this.props.route.params.type !== prevProps.route.params.type) {
             this.setState({
                 loader: false,
                 fulldata: [],
                 post_page: 0,
                 load_more: false,
                 arrays: [],
                 selectedLang1: false,
                 selectedLang2: false,
                 selectedLang3: false,
             });
             this.getData("");
         }
     }
 
     getData = (searchTerm="") => {
        // Check if already loading
        if (this.state.isLoading) return;
        // alert("G " + searchTerm + ' -');
    
        try {
            // Update loading state and search term
            this.setState({ isLoading: true });
    
            // Construct form data
            const formData = new FormData();
            formData.append('client_id', '1230');
            formData.append('client_secret', '1230NEJOUM1230');
            formData.append('customer_id', AuthContext.id);
            formData.append('paid', this.state.selectedLang2);
            formData.append('unpaid', this.state.selectedLang1);
            formData.append('paid_bycustomer', this.state.selectedLang3);
            formData.append('delivered', this.state.delivered);
            formData.append('undelivered', this.state.undelivered);
            formData.append('deliveredpaid', this.state.deliveredpaid);
            formData.append('deliveredunpaid', this.state.deliveredunpaid);
            formData.append('start', this.state.start);
            formData.append('type', this.props.route.params.type);
            formData.append('length', 5);
    
            // Check if searchTerm is provided and append it to formData
            // if (searchTerm) {
                formData.append('search', searchTerm);
                // alert("Run 0: " + searchTerm);
            // }
    
            // Fetch data
            const Url = AuthContext.server_url + "/Nejoum_App/getPhasedCars";
            fetch(Url, {
                method: 'POST',
                credentials: 'same-origin',
                body: formData,
            })
            .then(response => {
                // Check response status
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Parse response JSON
                return response.json();
            })
            .then(responseData => {
                // Handle success response
                if (responseData.success === 'success') {
                    const newdata = responseData.data;
                    if (newdata.length > 0) {
                        // Handle different scenarios based on whether searchTerm is provided
                        if (!searchTerm) {
                            const uniqueNewData = newdata.filter(item => !this.state.fulldata.some(existingItem => existingItem.lotnumber === item.lotnumber));
                            // const uniqueNewData = newdata;
                            if (uniqueNewData.length > 0) {
                                this.setState(prevState => ({
                                    fulldata: [...prevState.fulldata, ...uniqueNewData],
                                    originalData: [...prevState.originalData, ...uniqueNewData], // Update originalData
                                    start: prevState.start + uniqueNewData.length,
                                    no_data: false
                                }));
                            } else {
                                this.setState({ no_data: true });
                            }
                        } else {
                           const uniqueNewData = newdata.filter(item => !this.state.fulldata.some(existingItem => existingItem.lotnumber === item.lotnumber));

                            this.setState({
                                fulldata: uniqueNewData,
                                originalData: newdata, // Update originalData
                                start: newdata.length,
                                no_data: false
                            });
                        }
                    } else {
                        this.setState({ no_data: true });
                    }
                } else {
                    this.setState({ no_data: true });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                this.setState({ isLoading: false });
                Alert.alert(strings('main.network_error'), strings('main.network_error_message'), [
                    { text: strings('main.ok') }
                ]);
            })
            .finally(() => {
                // Reset loading state
                this.setState({ isLoading: false });
            });
        } catch (error) {
            console.error('Error:', error);
            this.setState({ isLoading: false });
            Alert.alert(strings('main.network_error'), strings('main.network_error_message'), [
                { text: strings('main.ok') }
            ]);
        }
    };
    
    

     getCarType = (car_payment_to_cashier) => {
        let carType = '';
        switch (car_payment_to_cashier) {
            case 0:
                carType = strings('car.unpaid');
                break;
            case 1:
                carType = strings('car.paid');
                break;
            case 3:
                carType = strings('car.paid_bycustomer');
                break;
            default:
                carType = ''; // Handle default case
        }
        return carType;
    };

    getTitle = (item) => {
        let title = null;
        if (item.delivered_title === 1) {
            title = (
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <Text style={commonStyle.redgradientblueText}>{strings('car.title')}</Text>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            style={commonStyle.keysStyleborderWhite}
                            source={require('../assets/check.png')}
                        />
                    </View>
                </View>
            );
        } else {
            const checkImageSource = item.follow_title === 1 ? require('../assets/check.png') : require('../assets/x.png');
            title = (
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <Text style={commonStyle.redgradientblueText}>{strings('car.title')}</Text>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            style={commonStyle.keysStyleborderWhite}
                            source={checkImageSource}
                        />
                    </View>
                </View>
            );
        }
        return title;
    };

     constructDataDetails = (item, type) => {
         const dataDetails = {};
         switch (type) {
             case 'towing':
                 dataDetails.id = item.id;
                 dataDetails.lotnumber = item.lotnumber;
                 dataDetails.allNotes = this.state.allNotes;
                 dataDetails.port_name = item.port_name;
                 dataDetails.calculation = item.calculation;
                 dataDetails.aTitle = item.aTitle;
                 dataDetails.special_notes = item.special_notes;
                 dataDetails.follow_car_title_note = item.follow_car_title_note;
                 dataDetails.carMakerName = item.carMakerName;
                 dataDetails.year = item.year;
                 dataDetails.carModelName = (item.carModelName.substr(0, item.carModelName.indexOf(' ')) != '') ?
                     item.carModelName.substr(0, item.carModelName.indexOf(' ')) : item.carModelName;
                 dataDetails.auction_location_name = item.auction_location_name;
                 dataDetails.short_name = item.short_name;
                 dataDetails.paymentDate = item.paymentDate;
                 dataDetails.purchasedate = item.purchasedate;
                 dataDetails.picked_date = item.picked_date;
                 dataDetails.image_small = item.image_small;
                 dataDetails.delivered_car_key = item.delivered_car_key;
                 dataDetails.follow_title = item.follow_title;
                 dataDetails.vin = item.vin;
                 dataDetails.ETD = item.etd;
                 dataDetails.titleDate = item.titleDate;
                 dataDetails.carnotes = item.carnotes;
                 dataDetails.type = type;
                 dataDetails.color_name = item.color_name;
                 dataDetails.delivered_title = item.delivered_title;
                 dataDetails.receiver_name = item.receiver_name;
                 dataDetails.add_ones_services = item.add_ones_services;
                 dataDetails.able_service = 1;
                 dataDetails.destination = item.destination;
                 break;
             case 'port':
                 dataDetails.id = item.id;
                 dataDetails.lotnumber = item.lotnumber;
                 dataDetails.delivered_date = item.delivered_date;
                 dataDetails.allNotes = this.state.allNotes;
                 dataDetails.vin = item.vin;
                 dataDetails.type = type;
                 dataDetails.color_name = item.color_name;
                 dataDetails.port_name = item.port_name;
                 dataDetails.calculation = item.calculation;
                 dataDetails.aTitle = item.aTitle;
                 dataDetails.auction_location_name = item.auction_location_name;
                 dataDetails.short_name = item.short_name;
                 dataDetails.special_notes = item.special_notes;
                 dataDetails.follow_car_title_note = item.follow_car_title_note;
                 dataDetails.carMakerName = item.carMakerName;
                 dataDetails.year = item.year;
                 dataDetails.carModelName = item.carModelName;
                 dataDetails.container_number = item.container_number;
                 dataDetails.shipping_date = item.shipping_date;
                 dataDetails.booking_arrival_date = item.booking_arrival_date;
                 dataDetails.image_small = item.image_small;
                 dataDetails.delivered_car_key = item.delivered_car_key;
                 dataDetails.follow_title = item.follow_title;
                 dataDetails.carnotes = item.carnotes;
                 dataDetails.delivered_title = item.delivered_title;
                 dataDetails.purchasedate = item.purchasedate;
                 dataDetails.picked_date = item.picked_date;
                 dataDetails.short_name = item.short_name;
                 dataDetails.loaded_date = item.loaded_date;
                 dataDetails.titleDate = item.titleDate;
                 dataDetails.booking_number = item.booking_number;
                 dataDetails.add_ones_services = item.add_ones_services;
                 dataDetails.able_service = 0;
                 dataDetails.destination = item.destination;
                 break;
             case 'new':
                 dataDetails.id = item.id;
                 dataDetails.lotnumber = item.lotnumber;
                 dataDetails.allNotes = this.state.allNotes;
                 dataDetails.color_name = item.color_name;
                 dataDetails.type = this.props.route.params.type;
                 dataDetails.port_name = item.port_name;
                 dataDetails.calculation = item.calculation;
                 dataDetails.special_notes = item.special_notes;
                 dataDetails.follow_car_title_note = item.follow_car_title_note;
                 dataDetails.carMakerName = item.carMakerName;
                 dataDetails.year = item.year;
                 dataDetails.carnotes = item.carnotes;
                 dataDetails.delivered_date = item.delivered_date;
                 dataDetails.carModelName = (item.carModelName.substr(0, item.carModelName.indexOf(' ')) != '') ?
                     item.carModelName.substr(0, item.carModelName.indexOf(' ')) : item.carModelName;
                 dataDetails.purchasedate = item.purchasedate;
                 dataDetails.image_small = item.image_small;
                 dataDetails.delivered_car_key = item.delivered_car_key;
                 dataDetails.follow_title = item.follow_title;
                 dataDetails.delivered_title = item.delivered_title;
                 dataDetails.car_payment_to_cashier = item.car_payment_to_cashier;
                 dataDetails.vin = item.vin;
                 dataDetails.titleDate = item.titleDate;
                 dataDetails.aTitle = item.aTitle;
                 dataDetails.paymentDate = item.paymentDate;
                 dataDetails.car_cost_aed = item.car_cost_aed;
                 dataDetails.total_paida = item.total_paida;
                 dataDetails.amount_pay = item.amount_pay;
                 dataDetails.remaining_amount = item.remaining_amount;
                 dataDetails.auction_location_name = item.auction_location_name;
                 dataDetails.short_name = item.short_name;
                 dataDetails.transfer_money = item.transfer_money;
                 dataDetails.receiver_name = item.receiver_name;
                 dataDetails.add_ones_services = item.add_ones_services;
                 dataDetails.able_service = 1;
                 dataDetails.destination = item.destination;
                 dataDetails.paid_request_id = item.paid_request_id;
                 break;
             case 'warehouse':
                 dataDetails.id = item.car_id;
                 dataDetails.aTitle = item.aTitle;
                 dataDetails.auction_location_name = item.auction_location_name;
                 dataDetails.short_name = item.short_name;
                 dataDetails.lotnumber = item.lotnumber;
                 dataDetails.allNotes = this.state.allNotes;
                 dataDetails.titleDate = item.titleDate;
                 dataDetails.type = this.props.route.params.type;
                 dataDetails.vin = item.vin;
                 dataDetails.port_name = item.port_name;
                 dataDetails.calculation = item.calculation;
                 dataDetails.color_name = item.color_name;
                 dataDetails.special_notes = item.special_notes;
                 dataDetails.follow_car_title_note = item.follow_car_title_note;
                 dataDetails.carMakerName = item.carMakerName;
                 dataDetails.year = item.year;
                 dataDetails.carModelName = (item.carModelName.substr(0, item.carModelName.indexOf(' ')) != '') ?
                     item.carModelName.substr(0, item.carModelName.indexOf(' ')) : item.carModelName;
                 dataDetails.purchasedate = item.purchasedate;
                 dataDetails.image_small = item.image_small;
                 dataDetails.delivered_car_key = item.delivered_car_key;
                 dataDetails.follow_title = item.follow_title;
                 dataDetails.delivered_title = item.delivered_title;
                 dataDetails.picked_date = item.picked_date;
                 dataDetails.titleDate = item.titleDate;
                 dataDetails.booking_number = item.booking_number;
                 dataDetails.add_ones_services = item.add_ones_services;
                 dataDetails.able_service = 1;
                 dataDetails.destination = item.destination;
                 break;
             case 'shipping':
                 dataDetails.id = item.car_id;
                 dataDetails.lotnumber = item.lotnumber;
                 dataDetails.allNotes = this.state.allNotes;
                 dataDetails.color_name = item.color_name;
                 dataDetails.aTitle = item.aTitle;
                 dataDetails.auction_location_name = item.auction_location_name;
                 dataDetails.short_name = item.short_name;
                 dataDetails.titleDate = item.titleDate;
                 dataDetails.type = this.props.route.params.type;
                 dataDetails.port_name = item.port_name;
                 dataDetails.carnotes = item.carnotes;
                 dataDetails.ETD = item.etd;
                 dataDetails.delivered_date = item.delivered_date;
                 dataDetails.calculation = item.calculation;
                 dataDetails.special_notes = item.special_notes;
                 dataDetails.follow_car_title_note = item.follow_car_title_note;
                 dataDetails.carMakerName = item.carMakerName;
                 dataDetails.year = item.year;
                 dataDetails.carModelName = (item.carModelName.substr(0, item.carModelName.indexOf(' ')) != '') ?
                     item.carModelName.substr(0, item.carModelName.indexOf(' ')) : item.carModelName;
                 dataDetails.loaded_date = item.loaded_date;
                 dataDetails.eta = item.eta;
                 dataDetails.booking_number = item.booking_number;
                 dataDetails.container_number = item.container_number;
                 dataDetails.vin = item.vin;
                 dataDetails.image_small = item.image_small;
                 dataDetails.shipping_date = item.shipping_date;
                 dataDetails.booking_arrival_date = item.booking_arrival_date;
                 dataDetails.delivered_car_key = item.delivered_car_key;
                 dataDetails.follow_title = item.follow_title;
                 dataDetails.paymentDate = item.paymentDate;
                 dataDetails.delivered_title = item.delivered_title;
                 dataDetails.purchasedate = item.purchasedate;
                 dataDetails.port_departuren = item.port_departuren;
                 dataDetails.add_ones_services = item.add_ones_services;
                 dataDetails.able_service = 0;
                 dataDetails.destination = item.destination;
                 break;
             case 'store':
                 dataDetails.id = item.car_id;
                 dataDetails.lotnumber = item.lotnumber;
                 dataDetails.titleDate = item.titleDate;
                 dataDetails.type = this.props.route.params.type;
                 dataDetails.color_name = item.color_name;
                 dataDetails.port_name = item.port_name;
                 dataDetails.calculation = item.calculation;
                 dataDetails.aTitle = item.aTitle;
                 dataDetails.carnotes = item.carnotes;
                 dataDetails.auction_location_name = item.auction_location_name;
                 dataDetails.short_name = item.short_name;
                 dataDetails.special_notes = item.special_notes;
                 dataDetails.follow_car_title_note = item.follow_car_title_note;
                 dataDetails.carMakerName = item.carMakerName;
                 dataDetails.year = item.year;
                 dataDetails.deliver_customer = item.deliver_customer;
                 dataDetails.delivered_date = item.delivered_date;
                 dataDetails.final_payment_status = item.final_payment_status;
                 dataDetails.carModelName = (item.carModelName.substr(0, item.carModelName.indexOf(' ')) != '') ?
                     item.carModelName.substr(0, item.carModelName.indexOf(' ')) : item.carModelName;
                 dataDetails.receive_date = item.receive_date;
                 dataDetails.deliver_create_date = item.deliver_create_date;
                 dataDetails.recovery_iddata = item.recovery_iddata;
                 dataDetails.image_small = item.image_small;
                 dataDetails.delivered_car_key = item.delivered_car_key;
                 dataDetails.follow_title = item.follow_title;
                 dataDetails.delivered_title = item.delivered_title;
                 dataDetails.purchasedate = item.purchasedate;
                 dataDetails.deliver_customer = item.deliver_customer;
                 dataDetails.final_payment_status = item.final_payment_status;
                 dataDetails.finesTotal = item.finesTotal;
                 dataDetails.end_warehouse = item.end_warehouse;
                 dataDetails.recovery_name = item.recovery_name;
                 dataDetails.allNotes = this.state.allNotes;
                 dataDetails.vin = item.vin;
                 dataDetails.add_ones_services = item.add_ones_services;
                 dataDetails.able_service = 0;
                 dataDetails.destination = item.destination;
                 break;
             // Add cases for other item types here
         }
         return dataDetails;
     };
    
    constructActions = (item, type) => {
        const actions = {};
        switch (type) {
            case 'towing':
                actions.goToDetails = () => {
                    this.props.navigation.navigate('carDetails2', { 'data': dataDetails, 'type': type, 'allNotes': this.state.allNotes });
                };
                actions.showNote = () => {
                    this.shownote(item.follow_car_title_note);
                };
                actions.showNoteCars = () => {
                    this.shownote(item.carnotes);
                };
                actions.addNote = () => {
                    this.setModalNotesVisible(true, item.id, item.special_notes);
                };
                actions.imagesArr = () => {
                    this.fillImagesarr(i);
                };
                break;
            case 'port':
                actions.goToDetails = () => {
                    this.props.navigation.navigate('carDetails2', {
                        'data': dataDetails,
                        'car_idprops': item.id,
                        'data333': dataDetails,
                        'lotnumber': item.lotnumber,
                        'type': this.props.route.params.type,
                        'allNotes': this.state.allNotes
                    });
                };
                actions.showNote = () => {
                    this.shownote(item.follow_car_title_note);
                };
                actions.showNoteCars = () => {
                    this.shownote(item.carnotes);
                };
                actions.addNote = () => {
                    this.setModalNotesVisible(true, item.id, item.special_notes);
                };
                actions.imagesArr = () => {
                    this.fillImagesarr(i);
                };
                break;
                case 'new':
                actions.goToDetails = () => {
                    this.props.navigation.navigate('carDetails2', { 'data': dataDetails, 'type': type, 'allNotes': this.state.allNotes });
                };
                actions.showNote = () => {
                    this.shownote(item.follow_car_title_note);
                };
                actions.showNoteCars = () => {
                    this.shownote(item.carnotes);
                };
                actions.showPaidbyCustomer = () => {
                    this.showPaidbyCustomer(true, item.id, item.special_notes, item.lotnumber, item.vin);
                };
                actions.addNote = () => {
                    this.setModalNotesVisible(true, item.id, item.special_notes);
                };
                actions.imagesArr = () => {
                    this.fillImagesarr(i);
                };
                break;
                case 'warehouse':
                    actions.goToDetails = () => {
                        this.props.navigation.navigate('carDetails2', { 'data': dataDetails, 'type': type, 'allNotes': this.state.allNotes });
                    };
                    actions.goToImages = () => {
                        this.props.navigation.navigate('carImagesNavigator', {
                            'car_id': item.id, 'purchasedate': item.purchasedate, 'lotnumber': item.lotnumber,
                            'carMakerName': item.carMakerName, 'carModelName': item.carModelName, 'year': item.year
                        });
                    };
                    actions.showNote = () => {
                        this.shownote(item.follow_car_title_note);
                    };
                    actions.showNoteCars = () => {
                        this.shownote(item.carnotes);
                    };
                    actions.showPaidbyCustomer = () => {
                        this.showPaidbyCustomer(true, item.id, item.special_notes, item.lotnumber, item.vin);
                    };
                    actions.addNote = () => {
                        this.setModalNotesVisible(true, item.id, item.special_notes);
                    };
                    actions.imagesArr = () => {
                        this.fillImagesarr(i);
                    };
                break;
                case 'shipping':
                    actions.goToDetails = () => {
                        this.props.navigation.navigate('carDetails2', { 'data': dataDetails, 'type': type, 'allNotes': this.state.allNotes });
                    };
                    actions.goToImages = () => {
                        this.props.navigation.navigate('carImagesNavigator', {
                            'car_id': item.id, 'purchasedate': item.purchasedate, 'lotnumber': item.lotnumber,
                            'carMakerName': item.carMakerName, 'carModelName': item.carModelName, 'year': item.year
                        });
                    };
                    actions.showNote = () => {
                        this.shownote(item.follow_car_title_note);
                    };
                    actions.showNoteCars = () => {
                        this.shownote(item.carnotes);
                    };
                    actions.showPaidbyCustomer = () => {
                        this.showPaidbyCustomer(true, item.id, item.special_notes, item.lotnumber, item.vin);
                    };
                    actions.addNote = () => {
                        this.setModalNotesVisible(true, item.id, item.special_notes);
                    };
                    actions.imagesArr = () => {
                        this.fillImagesarr(i);
                    };
                break;
                case 'store':
                    actions.goToDetails = () => {
                        this.props.navigation.navigate('carDetails2', { 'data': dataDetails, 'type': type, 'allNotes': this.state.allNotes });
                    };
                    actions.goToImages = () => {
                        this.props.navigation.navigate('carImagesNavigator', {
                            'car_id': item.id, 'purchasedate': item.purchasedate, 'lotnumber': item.lotnumber,
                            'carMakerName': item.carMakerName, 'carModelName': item.carModelName, 'year': item.year
                        });
                    };
                    actions.showNote = () => {
                        this.shownote(item.follow_car_title_note);
                    };
                    actions.showNoteCars = () => {
                        this.shownote(item.carnotes);
                    };
                    actions.showPaidbyCustomer = () => {
                        this.showPaidbyCustomer(true, item.id, item.special_notes, item.lotnumber, item.vin);
                    };
                    actions.addNote = () => {
                        this.setModalNotesVisible(true, item.id, item.special_notes);
                    };
                    actions.imagesArr = () => {
                        this.fillImagesarr(i);
                    };
                break;

            // Add cases for other item types here
        }
        return actions;
    };
    
    renderItem = ({ index,item }) => {
        const { type } = this.props.route.params;
        const { navigation } = this.props; // Assuming navigation is passed as prop
    
        // Construct dataDetails object based on item type
        const dataDetails = this.constructDataDetails(item, type);
    
        // Construct actions object based on item type
        const actions = this.constructActions(item, type);
    
        // Return the CarCard component with dataDetails and actions
        return (
            <CarCard data={dataDetails} actions={actions} key={dataDetails.id} index={index} props={{ navigation, allNotes: this.state.allNotes }} />
        );
    };
    
     onscroll = (e) => {
        if (e && e.nativeEvent) {
            var total_posts      = this.state.total_data;
            var total_post_count = this.state.fulldata.length;
            var contentLength    = e.nativeEvent.contentSize?.height; // Use optional chaining to handle undefined
            var trailingInset    = e.nativeEvent.contentInset?.bottom; // Use optional chaining to handle undefined
            var scrollOffset     = e.nativeEvent.contentOffset?.y; // Use optional chaining to handle undefined
            var viewportLength   = e.nativeEvent.layoutMeasurement?.height; // Use optional chaining to handle undefined
    
            // Check if contentLength, trailingInset, scrollOffset, and viewportLength are defined
            if (contentLength !== undefined && trailingInset !== undefined && scrollOffset !== undefined && viewportLength !== undefined) {
                if (Math.round(viewportLength + scrollOffset) >= Math.round(contentLength)) {
                    if (this.state.load_more === false && total_posts !== total_post_count)
                        this.load_more_data();
                }
            }
        }
    }
 
     load_more_data = async () => {
         this.setState({ load_more: true });
         var start = this.state.post_page;
         var Url = AuthContext.server_url + "/Nejoum_App/getPhasedCars";
         const formData = new FormData();
         formData.append('client_id', '1230');
         formData.append('client_secret', '1230NEJOUM1230');
         formData.append('customer_id', AuthContext.id);
         formData.append('paid', this.state.selectedLang2);
         formData.append('unpaid', this.state.selectedLang1);
         formData.append('paid_bycustomer', this.state.selectedLang3);
         formData.append('delivered', this.state.delivered);
         formData.append('undelivered', this.state.undelivered);
         formData.append('deliveredpaid', this.state.deliveredpaid);
         formData.append('deliveredunpaid', this.state.deliveredunpaid);
         formData.append('start', this.state.post_page);
         formData.append('type', this.props.route.params.type);
         formData.append('length', 5);
         fetch(Url, {
             method: 'POST',
             credentials: 'same-origin',
             body: formData,
         })
             .then((response) => {
                 if (response.ok) {
                     return response;
                 }
                 throw Error(response.success);
             })
             .then(res => res.json())
             .then((response) => {
                 if (response.success == 'success') {
                     var old_data = this.state.fulldata;
                     var start = start;
 
                     var count = response.data.length;
                     for (var i = 0; i < response.data.length; i++) {
                         old_data.push(response.data[i]);
                     }
 
                     this.setState({
                         load_more: false,
                         post_page: old_data.length,
                         total_posts: count,
                         fulldata: old_data,
                     });
                 } else {
                     this.setState({
                         load_more: false
                     });
                 }
             })
             .catch((error) => {
                 this.setState({
                     load_more: false
                 });
             });
     }
 
     pickMultipleImages = async () => {
         try {
             const images = await ImagePicker.openPicker({
                 multiple: true,
                 mediaType: 'photo', // You can also pick videos by changing this to 'video'
             });
 
             // 'images' will contain an array of selected images
             await this.setState({ imagesFiles: images });
         } catch (error) {
             console.log('Error picking images:', error);
         }
     };
 
     uploadFile = async () => {
         if (this.state.imagesFiles.length == 0 && this.state.notesPaid == '') {
             Alert.alert('Error', 'Missing required field', [
                 { text: 'Okay' }
             ]);
             return;
         }
         this.setState({ loader: true });
         const formData = new FormData();
         var Url = "https://api.nejoumaljazeera.co/api/sendPaidByCustomersCar";
         const fs = RNFetchBlob.fs;
         for (const image of this.state.imagesFiles) {
             const extension = this.getExtention(image.mime);
             if (extension == null) {
                 Alert.alert('Error', strings('main.wrong_file_type'), [
                     { text: 'Okay' }
                 ]);
                 this.setState({ loader: false });
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
 
         const promises = this.state.imagesFiles.map(async (image, index) => {
             const extension = this.getExtention(image.mime);
 
             const base64 = await RNFetchBlob.fs.readFile(image.path.replace("file://", ""), 'base64');
             formData.append(`images[${index}][fileContent]`, base64);
             formData.append(`images[${index}][type]`, image.mime);
             formData.append(`images[${index}][name]`, image.filename);
             formData.append(`images[${index}][extension]`, extension);
         });
         formData.append('file_type', 'image');
         formData.append('customer_id', AuthContext.id);
         formData.append('cu_notes', this.state.notesPaid);
         formData.append('car_id', this.state.car_id);
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
                 const data = await response.json();
                 console.error(data);
                 Alert.alert('Success', 'Uploaded Successfully', [
                     { text: 'Okay' }
                 ]);
                 this.setState({
                     loader: false,
                     car_id: '',
                     isModalVisiblePaidBy: false,
                     inputValue: '',
                     lotnumberPaid: '',
                     vinPaid: ''
                 },
                     this.getData);
                 //navigation.navigate("paymentOther", {'refresh': Math.random().toString()});
                 // Handle the response data here
             } else {
                 throw new Error('Upload failed');
             }
         } catch (error) {
             this.setState({ loader: false });
             Alert.alert('Error', error, [
                 { text: 'Okay' }
             ]);
             // Handle the error here
         }
 
     };
 
     _refreshList = async () => {
         this.setState({
             loader: true,
         });
         var start = 0;
         var Url = AuthContext.server_url + "/Nejoum_App/getPhasedCars";
         const formData = new FormData();
         formData.append('client_id', '1230');
         formData.append('client_secret', '1230NEJOUM1230');
         formData.append('customer_id', AuthContext.id);
         formData.append('start', 0);
         formData.append('paid', this.state.selectedLang2);
         formData.append('unpaid', this.state.selectedLang1);
         formData.append('paid_bycustomer', this.state.selectedLang3);
         formData.append('delivered', this.state.delivered);
         formData.append('undelivered', this.state.undelivered);
         formData.append('deliveredpaid', this.state.deliveredpaid);
         formData.append('deliveredunpaid', this.state.deliveredunpaid);
         formData.append('type', this.props.route.params.type);
         formData.append('length', 20);
         fetch(Url, {
             method: 'POST',
             credentials: 'same-origin',
             body: formData,
         })
             .then((response) => {
                 if (response.ok) {
                     return response;
                 }
                 throw Error(response.success);
             })
             .then(res => res.json())
             .then((response) => {
                 if (response.success == 'success') {
                     this.setState({
                         loader: false,
                         fulldata: response.data
                     });
                     return;
                 }
                 else {
                     this.setState({
                         loader: false,
                         error_message: 'error'
                     });
                     Alert.alert('Error', 'Error Occured', [
                         { text: 'Okay' }
                     ]);
                     return;
                 }
             })
             .catch((error) => {
                 this.setState({
                     loader: false,
                     error_message: 'error'
                 });
                 Alert.alert('Error', 'Error Occured', [
                     { text: 'Okay' }
                 ]);
             });
     }
 
     toggleOverlay = () => {
         this.setState({ displayImage: false });
     }
 
     shareImage = async (images) => {
         await ImgToBase64.getBase64String(images.url)
             .then(base64String => this.doSomethingWith(base64String));
     }
 
     doSomethingWith = async (varyhy) => {
         const shareOptions = {
             title: 'Share file',
             url: 'data:image/png;base64,' + varyhy,
             failOnCancel: false,
         }
         try {
             const ShareResponse = await Share.open(shareOptions);
         } catch (error) {
             console.log('Error =>', error);
         }
     }
 
     fillImagesarr = (index) => {
         var car_id = this.state.fulldata[index].car_id;
         this.setState({ loader: true });
         const formData = new FormData();
         formData.append('client_id', '1230');
         formData.append('client_secret', '1230NEJOUM1230');
         formData.append('customer_id', AuthContext.id);
         formData.append('type', this.props.route.params.type);
         formData.append('car_id', car_id);
         var Url = AuthContext.server_url + "/Nejoum_App/getImages";
         fetch(Url, {
             method: 'POST',
             credentials: 'same-origin',
             body: formData,
         })
             .then((response) => {
                 if (response.ok) {
                     return response;
                 }
                 throw Error(response.success);
             })
             .then(res => res.json())
             .then((response) => {
                 if (response.success == 'success') {
                     var images = [];
                     var img = '';
                     images.push({ url: this.state.fulldata[index].image_small });
                     response.data.forEach(element => {
                         img = element;
                         images.push({ url: img })
                     });
                     this.setState({ visibleImage: true, imagesSlider: images, loader: false });
                     return;
                 }
                 else {
                     return;
                 }
             })
             .catch((error) => {
                 this.setState({
                     loader: false,
                 });
                 Alert.alert(strings('main.network_error'), strings('main.network_error'), [
                     { text: strings('main.ok') }
                 ]);
             });
     }
 
     shownote = (note) => {
         Alert.alert(strings('main.note'), note, [
             { text: strings('main.ok') }
         ]);
 
     }
 
     setModalVisible = (val) => {
         this.setState({ visible: val });
     }
 
     updateFilter = (type) => {
         if (type == 1) {
             this.setState(
                 {
                     selectedLang1: !this.state.selectedLang1
                 },
                 this.getData         // here is where you put the callback
             );
         }
         else if (type == 2) {
             this.setState(
                 {
                     selectedLang2: !this.state.selectedLang2
                 },
                 this.getData         // here is where you put the callback
             );
         } else if (type == 3) {
             this.setState(
                 {
                     selectedLang3: !this.state.selectedLang3
                 },
                 this.getData         // here is where you put the callback
             );
         }
     }
 
     setModalNotesVisible = (val, car_id, value) => {
         var res = this.state.allNotes.filter(function (o) {
             return o.id == car_id
         }).pop();
         if (res) {
             this.setState({
                 car_id: car_id,
                 isModalVisible: val,
                 inputValue: res.note
             });
         } else {
             this.setState({
                 car_id: car_id,
                 isModalVisible: val,
                 inputValue: value
             });
         }
         //console.log('fasdfds');
 
     }
 
     showPaidbyCustomer = (val, car_id, value, lot, vin) => {
         var res = this.state.allNotes.filter(function (o) {
             return o.id == car_id
         }).pop();
         if (res) {
             this.setState({
                 car_id: car_id,
                 isModalVisiblePaidBy: val,
                 inputValue: res.note,
                 lotnumberPaid: lot,
                 vinPaid: vin
             });
         } else {
             this.setState({
                 car_id: car_id,
                 isModalVisiblePaidBy: val,
                 inputValue: value,
                 lotnumberPaid: lot,
                 vinPaid: vin
             });
         }
     }
 
     updateDelivered = (type) => {
         if (type == 1) {
             this.setState(
                 {
                     delivered: !this.state.delivered,
                     show_filterpaid: !this.state.delivered
                 },
                 this.getData         // here is where you put the callback
             );
         }
         else if (type == 2) {
             if (this.state.delivered) {
                 this.setState(
                     {
                         undelivered: !this.state.undelivered,
                         //delivered:!this.state.undelivered,
                         //show_filterpaid : false
                     },
                     this.getData         // here is where you put the callback
                 );
             } else {
                 this.setState(
                     {
                         undelivered: !this.state.undelivered,
                         //delivered:!this.state.undelivered,
                         show_filterpaid: false
                     },
                     this.getData         // here is where you put the callback
                 );
             }
 
         }
     }
 
 
 
     updateDeliveredunpaid = (type) => {
         if (type == 1) {
             this.setState(
                 {
                     deliveredpaid: !this.state.deliveredpaid,
                 },
                 this.getData         // here is where you put the callback
             );
         }
         else if (type == 2) {
             this.setState(
                 {
                     deliveredunpaid: !this.state.deliveredunpaid,
                 },
                 this.getData         // here is where you put the callback
             );
         }
     }
 
 
     render() {
 
         var actions = [];
         var dataDetails = {};
         if (this.state.loader) {
             return (
                 <Loader loader={this.state.loader}></Loader>
             );
         }
         if (this.state.modalmsg) {
             return (<ModalMsg msg={this.state.error_message} modalmsg={this.state.modalmsg} page={this.state.pageload}
                 navigation={this.props.navigation}></ModalMsg>);
         }
 
         if (this.state.load_more) {
             var load_more = <View style={{ backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                 <Image source={require("../assets/loadingapp.gif")}
                     style={{ justifyContent: 'center', width: 50, height: 50, alignItems: 'center', flex: 0.2 }}
                     resizeMode="contain">
                 </Image>
             </View>;
         }
         else {
             var load_more = [];
         }
 
         return (
 
             <View style={styles.image}>
 
                 <Overlay isVisible={this.state.displayImage} overlayStyle={styles.overlaystyle}
                     animationType="slide"
                     transparent={true}
                     onBackdropPress={this.toggleOverlay}>
                     <View style={{ justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                         <Image
                             style={{
                                 width: '100%',
                                 height: '100%',
                                 resizeMode: "contain",
                                 borderRadius: 10
                             }}
                             source={{ uri: this.state.imageUrl }}
                         />
                     </View>
                 </Overlay>
                 <Modal visible={this.state.visibleImage} transparent={true} style={{
                     backgroundColor: 'white',
                     margin: 0, // This is the important style you need to set
                     alignItems: undefined,
                     justifyContent: undefined
                 }}>
                     <ImageViewer imageUrls={this.state.imagesSlider}
                         enableSwipeDown="true"
                         enablePreload="true"
                         backgroundColor="#000"
                         renderHeader={(index) =>
                             <SafeAreaView>
                                 <View style={{ flexDirection: 'row', zIndex: 9999 }}>
                                     <TouchableOpacity style={{
                                         borderRadius: 25, justifyContent: 'center',
                                         alignItems: 'center', width: 50, height: 50
                                     }}
                                         onPress={() => this.setState({ visibleImage: false })}>
                                         <FontAwesomeIcon
                                             icon={faXmarkCircle}
                                             color="#fff"
                                             size={25}
                                         />
                                     </TouchableOpacity>
                                     <TouchableOpacity style={{
                                         borderRadius: 25, justifyContent: 'center',
                                         alignItems: 'center', width: 50, height: 50
                                     }}
                                         onPress={() => this.shareImage(this.state.imagesSlider[index])}>
                                         <FontAwesomeIcon
                                             icon={faShare}
                                             color="#fff"
                                             size={25}
                                         />
                                     </TouchableOpacity>
                                 </View>
                             </SafeAreaView>
                         }
                         loadingRender={() => <Loader loader={true}></Loader>}
                         renderFooter={(index) => {/**<SafeAreaView style={{height:height*0.2, flex:1}}>
                         <TouchableOpacity onPress={()=> this.shareImage(this.state.imagesSlider[index])} 
                             style={{  justifyContent:'center',alignItems:'center', padding:'2%',
                             width:width, backgroundColor:"#013188"}}>
                             <Text style={{color: '#fff',  alignItems:'center',justifyContent:'center', 
                             fontSize: I18n.locale=='ar'?20:20}} >{strings('main.share')}</Text>
                         </TouchableOpacity></SafeAreaView>**/}}
                     />
                 </Modal>
 
                 <Modal2
                     isVisible={this.state.isModalVisible}
                     onBackdropPress={() => this.setModalNotesVisible(false)}
                     style={styles.viewWrapper}>
                     <View style={styles.content3}>
                         <View style={{ justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                             {(this.state.loaderinside) ? (
                                 <View style={styles.overlay}>
                                     <Image source={require("../assets/loadingapp.gif")}
                                         style={{ backgroundColor: 'transparent', width: 100 }}
                                         resizeMode="contain">
                                     </Image>
                                 </View>
                             ) : (<View style={{ flex: 1 }}>
                                 <TextInput placeholder={strings('main.write_somthing')}
                                     value={this.state.inputValue}
                                     style={styles.textInput}
                                     //multiline = {true}
                                     //numberOfLines = {height*0.005}
                                     placeholderTextColor="#666666"
                                     //style={commonStyle.textInput}
                                     numberOfLines={Platform.OS === 'ios' ? null : height * 0.005}
                                     minHeight={(Platform.OS === 'ios' && height * 0.005) ? (20 * height * 0.005) : null}
                                     autoCapitalize="none"
                                     onChangeText={(value) => this.setState({ inputValue: value })} />
                                 <Button title={strings('main.save')} onPress={(value) => this.saveNotes()} />
                             </View>)
                             }
                         </View>
                     </View>
                 </Modal2>
 
                 <Modal2
                     isVisible={this.state.isModalVisiblePaidBy}
                     onBackdropPress={() => this.showPaidbyCustomer(false, null, '', '', '')}
                     style={styles.viewWrapper}>
                     <View style={styles.contentPaid}>
                         <View style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                             <View style={{ flexDirection: 'row' }}>
                                 <Text style={{ fontSize: width * 0.06, color: '#013188', fontWeight: 'bold', textAlign: 'center' }}>
                                     {strings('main.upload_bill')}
                                 </Text>
                             </View>
                             <View style={{ flexDirection: 'row', marginTop: '4%' }}>
                                 <Text style={{ color: 'rgb(23 96 178)' }}>Lot # </Text>
                                 <Text style={{ color: 'rgb(23 96 178)' }}>
                                     {this.state.lotnumberPaid}
                                 </Text>
                             </View>
                             <View style={{ flexDirection: 'row', marginBottom: '3%' }}>
                                 <Text style={{ color: 'rgb(23 96 178)' }}>VIN # </Text>
                                 <Text style={{ color: 'rgb(23 96 178)' }}>
                                     {this.state.vinPaid}
                                 </Text>
                             </View>
                             {(this.state.loaderinside) ? (
                                 <View style={styles.overlay}>
                                     <Image source={require("../assets/loadingapp.gif")}
                                         style={{ backgroundColor: 'transparent', width: 100 }}
                                         resizeMode="contain">
                                     </Image>
                                 </View>
                             ) : (
                                 <ScrollView contentContainerStyle={{ width: '100%', flex: 1 }}>
                                     <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                         <TextInput
                                             placeholder={strings('main.write_somthing')}
                                             placeholderTextColor="#666666"
                                             autoCapitalize="none"
                                             style={{
                                                 flex: 1,
                                                 height: 50,
                                                 margin: '2%', borderWidth: 1, borderColor: '#666666',
                                                 textAlign: I18n.locale === 'ar' ? 'right' : 'left',
                                                 direction: I18n.locale === 'ar' ? 'rtl' : 'ltr',
                                                 marginTop: Platform.OS === 'ios' ? 0 : -12,
                                                 paddingLeft: 10,
                                                 color: '#05375a',
                                             }}
                                             onChangeText={(val) => this.setState({ notesPaid: val })}
                                         />
                                     </View>
                                     <View style={{
                                         height: height * 0.15, borderWidth: 1, borderStyle: 'dashed', margin: '4%',
                                         borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'
                                     }}>
                                         <FontAwesomeIcon
                                             icon={faUpload}
                                             color="#343D40"
                                             size={width * 0.06}
                                         />
                                         <View style={{ flexDirection: 'column' }}>
                                             <Button
                                                 title="Attach Invoice"
                                                 color="#343D40"
                                                 onPress={this.pickMultipleImages}
                                             />
                                         </View>
                                         {/*Showing the data of selected Single file*/}
                                         {this.state.imagesFiles != null ? (
                                             this.state.imagesFiles.map((item, i) => {
                                                 return (
                                                     <View>
                                                         <Image
                                                             style={{ width: 90, height: 90 }}
                                                             source={{ uri: item.path }}
                                                             resizeMode={'contain'}
                                                         />
                                                     </View>
                                                 )
                                             })
                                         ) : null}
                                     </View>
                                     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                         <TouchableOpacity
                                             style={commonStyle.submitbutton}
                                             onPress={() => this.uploadFile()}>
                                             <Text style={[commonStyle.buttonTextBlue, { padding: '1%' }]}>{strings('main.submit')}</Text>
                                         </TouchableOpacity>
                                     </View>
                                 </ScrollView>)
                             }
                         </View>
                     </View>
                 </Modal2>
                 <FloatingActionButton width={width} lotnumber={false} navigation={this.props.navigation} styleType="Floating"/>

                 {/* SearchBar */}
  
    <View style={{backgroundColor:'#343D40'}}>
                <View style={{flexDirection: 'row', justifyContent:'center', alignItems:'center', margin:'3%'}}>
                    <SearchBar
                        showCancel={false}
                        platform="ios"
                        placeholder={strings("main.search_by")}
                        value={this.state.search}
                        onChangeText={text => this.SearchFilterFunction(text)} 
                        
                        cancelButtonProps={{
                            title: 'Clear',
                            onPress: () => {
                              this.setState({
                                search: '',
                            });
                            this.getData("");
                            },
                          }}
                        containerStyle = {commonStyle.containerStyledashboard}
                        inputContainerStyle = {commonStyle.inputContainerStyledashboard}
                        searchIcon = {
                            <View style={{flexDirection: 'row'}}>
                                <Image
                                    source={require('../assets/images/homeIcons/search.png')}
                                    style={commonStyle.searchIcon}/>
                            </View>
                        }
                        clearIcon = {
                            <TouchableOpacity activeOpacity={1} onPress={this.clearSearch}>
                                <View style={{flexDirection: 'row'}} >
                                    <FontAwesomeIcon
                                        icon={ faX }
                                        color="#ccc"
                                        size={width*0.05}
                                    />
                                </View>
                            </TouchableOpacity>
                        }
                    />
                </View>
            </View>
                 
                 {
                     (this.props.route.params.type == 'new') ? (
                         <View style={styles.containerFilter}>
                             <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                 <View style={styles.item} >
                                     <TouchableOpacity style={{
                                         margin: '1%',
                                         flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                                     }} onPress={() => this.updateFilter(1)}>
                                         {/**<CheckBox checked={this.state.selectedLang1} color="#b80d0d" onPress={()=>this.updateFilter(1)}/>**/}
                                         <View style={{
                                             backgroundColor: '#A30000', padding: 3, borderWidth: 1, borderColor: '#A30000',
                                             borderRadius: 4, justifyContent: 'center', alignItems: 'center', height: 5, width: 5,
                                         }}></View>
                                         <Text style={[styles.checkBoxTxt, {
                                             color: this.state.selectedLang1 ? "#0093FF" : "#343D40",
                                             textDecorationLine: this.state.selectedLang1 ? "underline" : "underline"
                                         }]}>{strings('car.unpaid')}</Text>
                                     </TouchableOpacity>
                                     <TouchableOpacity style={{ margin: '1%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.updateFilter(2)}>
                                         <View style={{
                                             backgroundColor: '#0B9A21', padding: 3, borderWidth: 1, borderColor: '#0B9A21',
                                             borderRadius: 4, justifyContent: 'center', alignItems: 'center', height: 5, width: 5
                                         }}></View>
                                         <Text style={
                                             {
                                                 ...styles.checkBoxTxt,
                                                 color: this.state.selectedLang2 ? "#0093FF" : "#343D40",
                                                 textDecorationLine: this.state.selectedLang2 ? "underline" : "underline"
                                             }}
                                         >{strings('car.paid')}</Text>
                                     </TouchableOpacity>
                                     <TouchableOpacity style={{ margin: '1%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.updateFilter(3)}>
                                         <View style={{
                                             backgroundColor: '#013188', padding: 3, borderWidth: 1, borderColor: '#013188',
                                             borderRadius: 4, justifyContent: 'center', alignItems: 'center', height: 5, width: 5
                                         }}></View>
                                         <Text style={
                                             {
                                                 ...styles.checkBoxTxt,
                                                 color: this.state.selectedLang3 ? "#0093FF" : "#343D40",
                                                 textDecorationLine: this.state.selectedLang3 ? "underline" : "underline"
                                             }}
                                         >{strings('car.paid_bycustomer')}</Text>
                                     </TouchableOpacity>
                                 </View>
                             </View>
                         </View>) : (<View></View>)
                 }
                 {
                     (this.props.route.params.type == 'store') ? (
                         <View style={styles.containerFilter}>
                             <View style={{ flexDirection: 'row' }}>
                                 <View style={styles.item} >
                                     <TouchableOpacity style={{ margin: '1%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.updateDelivered(2)}>
                                         <View style={{
                                             backgroundColor: '#FFB100', padding: 3, borderWidth: 1, borderColor: '#FFB100',
                                             borderRadius: 4, justifyContent: 'center', alignItems: 'center', height: 5, width: 5
                                         }}></View>
                                         <Text style={
                                             {
                                                 ...styles.checkBoxTxt,
                                                 color: this.state.undelivered ? "#0093FF" : "#343D40",
                                                 textDecorationLine: this.state.undelivered ? "underline" : "underline"
                                             }}>{strings('car.undelivered')}</Text>
                                     </TouchableOpacity>
                                     <TouchableOpacity style={{ margin: '1%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.updateDeliveredunpaid(1)}>
                                         <View style={{
                                             backgroundColor: '#0B9A21', padding: 3, borderWidth: 1, borderColor: '#0B9A21',
                                             borderRadius: 4, justifyContent: 'center', alignItems: 'center', height: 5, width: 5
                                         }}></View>
                                         <Text style={[styles.checkBoxTxt, {
                                             color: this.state.deliveredpaid ? "#0093FF" : "#343D40",
                                             textDecorationLine: this.state.deliveredpaid ? "underline" : "underline"
                                         }]}>{strings('car.paid')}</Text>
                                     </TouchableOpacity>
                                     <TouchableOpacity style={{ margin: '1%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.updateDeliveredunpaid(2)}>
                                         <View style={{
                                             backgroundColor: '#A30000', padding: 3, borderWidth: 1, borderColor: '#A30000',
                                             borderRadius: 4, justifyContent: 'center', alignItems: 'center', height: 5, width: 5,
                                         }}></View>
                                         <Text style={
                                             {
                                                 ...styles.checkBoxTxt,
                                                 color: this.state.deliveredunpaid ? "#0093FF" : "#343D40",
                                                 textDecorationLine: this.state.deliveredunpaid ? "underline" : "underline"
                                             }}
                                         >{strings('car.unpaid')}</Text>
                                     </TouchableOpacity>
                                     <TouchableOpacity style={{ margin: '1%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.updateDelivered(1)}>
                                         <View style={{
                                             backgroundColor: '#013188', padding: 3, borderWidth: 1, borderColor: '#013188',
                                             borderRadius: 4, justifyContent: 'center', alignItems: 'center', height: 5, width: 5
                                         }}></View>
                                         <Text style={[styles.checkBoxTxt, {
                                             color: this.state.delivered ? "#0093FF" : "#343D40",
                                             textDecorationLine: this.state.delivered ? "underline" : "underline"
                                         }]}>{strings('car.delivered')}</Text>
                                     </TouchableOpacity>
                                 </View>
                             </View>
                         </View>) : (<View></View>)
                 }
                 
                 <View style={{ flex: 1 }}>
                
<FlashList
            data={this.state.fulldata}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={0.1}
            onEndReached={this.getData}
            estimatedItemSize={20}
            ListFooterComponent={() =>
                this.state.isLoading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                        <Image
                            source={require("../assets/loadingapp.gif")}
                            style={{ width: 30, height: 30 }}
                            resizeMode="contain"
                        />
                    </View>
                ) : null
            }
            ListEmptyComponent={() => (
                this.state.no_data && (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={commonStyle.noDataText}>
                        {strings('main.no_data')}
                    </Text>
                </View>
                 )
            )}
        />

 </View>
 
             </View>
         )
     }
 }
 
 export default TrackDetails;
 
 const styles = StyleSheet.create({
     container: {
         flexGrow: 1,
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
     text: {
         color: '#101010',
         fontSize: 24,
         fontWeight: 'bold',
     },
     linearGradient: {
         flex: 1
     },
     numbergradient: {
         flex: 3,
         width: '75%',
         borderTopRightRadius: 25,
 
     },
     buttonText: {
         fontSize: 15,
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
         fontSize: 20,
         color: '#0d5db8',
     },
     tinyLogo: {
         width: '100%',
         height: '100%',
         borderTopRightRadius: 30,
         borderBottomLeftRadius: 20
     },
     image: {
         flex: 1,
         resizeMode: "stretch",
         width: '100%',
         justifyContent: "center",
         borderTopRightRadius: 40,
         borderBottomLeftRadius: 40
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
         color: '#000',
         fontSize: 11,
     },
     normalgreyTextHeader: {
         fontSize: 10,
         color: '#676767',
     },
     item: {
         width: "90%",
         padding: 10,
         marginBottom: 10,
         alignItems: 'center',
         justifyContent: 'center',
         flexDirection: "row",
     },
     checkBoxTxt: {
         marginLeft: 20
     },
     containerFilter: {
         backgroundColor: 'transparent',
         alignItems: 'center',
         justifyContent: 'center',
         margin: '1%'
     },
     overlaystyle: {
         flex: 0.5,
         width: '100%',
         opacity: 0.9,
         backgroundColor: '#fff'
     },
     headerImage: {
         width: '100%',
         height: '100%',
         resizeMode: "contain",
         borderRadius: 10,
     },
     content: {
         flex: 0.4,
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
     viewWrapper: {
         flex: 1,
         alignItems: "center",
         justifyContent: "center",
     },
     textInput: {
         flex: 1,
         width: width * 0.7,
         borderRadius: 5,
         paddingVertical: 8,
         paddingHorizontal: 16,
         borderColor: "rgba(0, 0, 0, 0.2)",
         borderWidth: 1,
         marginBottom: 8,
     },
     content3: {
         width: width * 0.8,
         height: height * 0.3,
         backgroundColor: 'white',
         padding: 22,
         justifyContent: 'center',
         alignItems: 'center',
         borderRadius: 17,
     },
     contentPaid: {
         width: width * 0.8,
         height: height * 0.7,
         backgroundColor: 'white',
         padding: 22,
         justifyContent: 'center',
         alignItems: 'center',
         borderRadius: 17,
     },
 });