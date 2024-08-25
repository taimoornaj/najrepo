/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React , {Component, Profiler} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
  Alert,
  BackHandler,
  Share,
  SafeAreaView,
  Modal,
  FlatList,
  Dimensions
} from 'react-native';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import  Loader  from '../components/Loader.js';
import { SwipeListView } from 'react-native-swipe-list-view';
import ImageViewer from 'react-native-image-zoom-viewer';
import I18n from 'react-native-i18n';
import Share2 from 'react-native-share';
import ImgToBase64 from 'react-native-image-base64';
import commonStyle from '../assets/style/styles.js';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faShare, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { Overlay } from 'react-native-elements';
import CarCard from "../components/molecules/CarCard";

//function Dashboard () {
    
const {width, height} = Dimensions.get('window'); 
const rowTranslateAnimatedValues = {};
export default class BookmarksCars extends Component {

    constructor(props){
        super(props);
        this.state = {
            loader      : false,
            fulldata    : [],
            post_page   : 0,
            load_more   : false,
            arrays      :[],
            visibleImage: false,
            imagesSlider: [],
            no_data     : false
          }

        //this.props.navigation.addListener('willFocus',this.get_component_mount.bind(this));
        this.props.navigation.setOptions({
                header: () => (
                    <View style = {commonStyle.header}>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                      marginTop: height*0.05, flex:1}}>
                          <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                        ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                              <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate('carforSale',
                             {refresh: this.state.fulldata.length})}>
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
                            <Text style={commonStyle.headerText}>{strings('main.favoriteCars')}</Text>
                          </View>
                          <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                            <Text style={commonStyle.headerText}></Text>
                          </View>
                        </View>       
                  </View>
                  
                )
           
        })

    }

    componentDidMount() {
        this.getData();
    }

    componentDidUpdate(prevProps){
        if(prevProps.route.params){
            if (this.props.route.params.refresh !== prevProps.route.params.refresh) {
                this.setState({
                    loader      : false,
                    fulldata    : []
                });
                this.getData();
            }
        }
    }

    shareImage = async (images) => {
        await ImgToBase64.getBase64String(images.url)
        .then(base64String => this.doSomethingWith(base64String));
    }

    doSomethingWith = async (varyhy)=> {
        const shareOptions = {
            title: 'Share file',
            url: 'data:image/png;base64,'+varyhy,
            failOnCancel: false,
        }
        try {
            const ShareResponse = await Share2.open(shareOptions);
        } catch (error) {
            console.log('Error =>', error);
        }
    }

    fillImagesarr = (imagesdata) => {
        var images = [];
        var img = '';
        imagesdata.forEach(element => {
            img = AuthContext.server_url  + 'upload/car_for_sale/' + element.photo_name;
            images.push({url: img})
        });
        this.setState({visibleImage: true, imagesSlider: images});
    }

    get_component_mount(){
        BackHandler.addEventListener('hardwareBackPress',this.handle_back_press);
    }

    handle_back_press = () => {
        this.props.navigation.navigate("carforSale");
        return true;
      }

      
      share_post = async (car_id, type, car_model, car_year, car_maker) => {
          let url = '';
          //console.log(type);
          if(type == 'shipped'){
            url = 'https://www.naj.ae/'+ 'cars/profile/?id='+ car_id;
          }else if(type == 'local'){
            url = 'https://www.naj.ae/'+ 'cars/profile/?id='+ car_id;
          }
        Share.share({
            subject: 'Nejoum Aljazeera - نجوم الجزيرة',
            title: strings('main.car_sale'),
            message: car_model+'-'+car_year+'-'+car_maker + "\n"+url,
            url: url,
        }, {
            dialogTitle: strings('main.car_sale'),
            excludedActivityTypes: []
        })



  }

    getData = () => {
        this.setState({
            loader          : true
        });
        var start     = this.state.start;
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('start', 0);
        formData.append('length', 20);
        formData.append('customer_id', AuthContext.id);
        var Url  = AuthContext.server_url + "/Nejoum_App/getFavoritData";
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
                this.setState({
                    loader      : false,
                    fulldata    : response.data,
                    post_page   : response.data.length    
                  });
                return;
            }
            else{
                this.setState({
                    loader      : false,
                    error_message    : 'error',
                    no_data: true   
                });
                return;
            }
        })
        .catch((error) => {
            this.setState({
                loader      : false,
                error_message    : error  
            });
            Alert.alert('Error', 'Connection Error', [
                {text: 'Okay'}
            ]);
        });  
    }

    delete_fav = (id) => {
        this.setState({
            loader          : true
        });
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('car_id', id);
        formData.append('customer_id', AuthContext.id);
        var Url  = AuthContext.server_url + "/Nejoum_App/changestatusfave";
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
                var array_temp = this.state.fulldata;
                var index = array_temp.findIndex(p => p.car_id == id)
                if (index !== -1) {
                    array_temp.splice(index, 1);
                    this.setState({fulldata: array_temp});
                }
                this.setState({
                    loader      : false,
                  });
                return;
            }
            else{
                this.setState({
                    loader      : false,
                    error_message    : 'error'   
                });
                Alert.alert('Error', 'Error Occured', [
                    {text: 'Okay'}
                ]);
                return;
            }
        })
        .catch((error) => {
            this.setState({
                loader      : false,
                error_message    : error  
            });
            Alert.alert('Error', 'Connection Error', [
                {text: 'Okay'}
            ]);
        }); 
    }

    delete = (id) => {
        Alert.alert(
            strings('main.confirm'),
            strings('main.confirm_delete'),
            [
              {
                text: strings('main.cancel'),
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
              },
              { text: strings('main.ok'), onPress: () => this.delete_fav(id)}
            ],
            { cancelable: false }
        );
    };

    render(){
        const { state, navigate } = this.props.navigation;
        //console.log(this.props.navigation);
        const data = [];
        if(this.state.loader){
            return(
                <Overlay transparent>
                    <View style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        backgroundColor:'transparent',
                        top: 0,
                        bottom: 0,
                        backgroundColor:'rgba(0,0,0,0.4)',
                        alignItems: 'center',
                        justifyContent: 'center'}}>
                        <Loader loader={this.state.loader}></Loader>
                    </View>
                </Overlay>
            
                
            );
        }

        
        if(this.state.fulldata.length > 0){
            this.state.fulldata.map( ( item, i )=> {
                if(item.image.length > 0){
                    data.push(
                        {
                            id: ++i,
                            image:  'https://cdn.nejoumaljazeera.co/upload/car_for_sale/'+item.image[0].photo_name,
                            car_year: item.car_year,
                            carModelName: item.carModelName,
                            carMakerName: item.carMakerName,
                            lotnumber: item.lotnumber,
                            vin: item.vin,
                            price: item.price,
                            images: item.image,
                            car_id: item.car_id,
                            local_shipped: item.local_shipped
                        });
                }
            });
        }
        
        if(this.state.no_data){
            return(
                <ScrollView 
                contentContainerStyle = {styles.container}
                onScroll={(e)=>this.onscroll(e)}
                refreshControl={
                  <RefreshControl
                    onRefresh={() => this._refreshList()}
                    refreshing={this.state.refreshing}
                    colors={['#13365d']}
                  />
                }>
                    <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
                        <Text style={commonStyle.noDataText}>
                            {strings('main.no_data')}
                        </Text>
                    </View>
            </ScrollView>
            );
        }

        /**const data = [
            {
                id: 1,
                username: 'Mark Heider',
                title: 'Toyota',
                readtime: '2 min',
                profilePic: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/63/IMG_%28business%29.svg/1200px-IMG_%28business%29.svg.png',
                image: 'https://tripxtours.imgix.net/uploads/dubai_tours/bcb1231fea0ebbc62683ff6644347b31.jpg?auto=compress&w=2000&h=1500&crop=faces&fit=min'
            },
            {
                id: 2,
                username: 'Mark Heider',
                title: 'Toyota',
                readtime: '2 min',
                profilePic: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/63/IMG_%28business%29.svg/1200px-IMG_%28business%29.svg.png',
                image: 'https://www.timeoutdubai.com/public/styles/full_img/public/images/2020/07/13/IMG-Dubai-UAE.jpg?itok=5oyxTfER'
            },
            {
                id: 3,
                username: 'Mark Heider',
                title: 'How Immune Systems and Covid-19 Interact',
                readtime: '2 min',
                profilePic: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/63/IMG_%28business%29.svg/1200px-IMG_%28business%29.svg.png',
                image: 'https://whatson.ae/wp-content/uploads/2016/08/img-world-of-adventure-9.jpg'
            },
            {
                id: 4,
                username: 'Mark Heider',
                title: 'How Immune Systems and Covid-19 Interact',
                readtime: '2 min',
                profilePic: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/63/IMG_%28business%29.svg/1200px-IMG_%28business%29.svg.png',
                image: 'https://static.vecteezy.com/packs/media/components/home/masthead-vectors/img/lavakidneys_800x400@2x-2db5e5a0c944e2b16a11a18674570f76.jpg'
            }
        ];**/


        
        
        return (
           
            <View  style={styles.image}> 
           <Modal visible={this.state.visibleImage} transparent={true} style={{backgroundColor: 'white',
    margin: 0, // This is the important style you need to set
    alignItems: undefined,
    justifyContent: undefined}}>
                    <ImageViewer imageUrls={this.state.imagesSlider}
                        enableSwipeDown="true"
                        enablePreload= "true"
                        backgroundColor="#000"
                        renderHeader={(index) =>
                            <SafeAreaView>
                                    <View  style={{flexDirection:'row', zIndex: 9999}}> 
                                        <TouchableOpacity style={{borderRadius:25,justifyContent:'center',
                                        alignItems:'center', width:50, height:50}}
                                        onPress={() => this.setState({visibleImage: false})}>
                                        <FontAwesomeIcon
                                            icon  = { faXmarkCircle }
                                            color = "#fff"
                                            size  = {25}
                                        />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{borderRadius:25,justifyContent:'center',
                                            alignItems:'center', width:50, height:50}}
                                            onPress={() => this.shareImage(this.state.imagesSlider[index])}>
                                            <FontAwesomeIcon
                                                icon  = { faShare }
                                                color = "#fff"
                                                size  = {25}
                                            />
                                        </TouchableOpacity>
                                    </View></SafeAreaView>
                                        }
                        loadingRender = {() => <Loader loader={true}></Loader> }
                        renderFooter={ (index) => {/**<SafeAreaView style={{height:height*0.2, flex:1}}>
                        <TouchableOpacity onPress={()=> this.shareImage(this.state.imagesSlider[index])} 
                            style={{  justifyContent:'center',alignItems:'center', padding:'2%',
                            width:width, backgroundColor:"#013188"}}>
                            <Text style={{color: '#fff',  alignItems:'center',justifyContent:'center', 
                            fontSize: I18n.locale=='ar'?20:20}} >{strings('main.share')}</Text>
                        </TouchableOpacity></SafeAreaView>**/}}
                    />
            </Modal>
             <ScrollView 
                contentContainerStyle = {styles.container}>   
                <SafeAreaView style={{backgroundColor:'transparent'}}>
            <FlatList
                    data={data}
                    keyExtractor={data => data.index}
                    contentContainerStyle={{ flex: 1, marginBottom: '10%',
                        justifyContent: 'center',}}
                    renderItem={ (data, item) => {
                        dataDetails = {};
                        dataDetails.id              = data.item.car_id;
                        dataDetails.lotnumber       = data.item.lotnumber;
                        dataDetails.vin             = data.item.vin;
                        dataDetails.local_shipped   = data.item.local_shipped;
                        dataDetails.carMakerName    = data.item.carMakerName;
                        dataDetails.year            = data.item.car_year;
                        dataDetails.carModelName    = (data.item.carModelName.substr(0,data.item.carModelName.indexOf(' ')) != '')?
                        data.item.carModelName.substr(0,data.item.carModelName.indexOf(' ')):data.item.carModelName;
                        dataDetails.image_small     = data.item.image;
                        dataDetails.price           = data.item.price;
                        dataDetails.type           = 'favorit'
                
                        const actions = {
                          goToImages: () => this.fillImagesarr(data.item.images),
                          deleteFav: ()  => this.delete(data.item.car_id),
                          sharePost: ()  => this.share_post(data.item.car_id, data.item.local_shipped, data.item.carModelName,
                            data.item.car_year, data.item.carMakerName)
                        }
                        return (<View style={{marginTop:height*0.01, }}>
                            <CarCard data={dataDetails} actions={actions} props={this.props} /></View>)
                    }
                }
                />
              </SafeAreaView>
            </ScrollView></View>
        )
        
    }
}

//export default Dashboard



const styles = StyleSheet.create({
    container: {
       flexGrow: 1,
      /**justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ebebeb',
      margin: 10,**/
    },
    blogTitle: {
        color: 'white',
        fontSize: 24,
        lineHeight: 28
    },
    blogTitleBlue: {
        fontFamily: "ZEKTON",
        color: '#fff',
        fontSize: 20,
        lineHeight: 28
    },
    header: {
        marginTop: 40,
        paddingHorizontal: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30
    },
    headerDate: {
        fontSize: 14
    },
    headerTitle: {
        fontSize: 30
    },
    headerImage: {
        width: 55,
        height: 55,
        borderRadius: 10
    },
    headerImageNotification: {
        width: 14,
        height: 14,
        borderRadius: 6,
        position: 'absolute',
        backgroundColor: 'red',
        right: -4,
        top: -4,
        borderWidth: 2,
        borderColor: 'white',

    },
    footerModel: {
        backgroundColor: '#0d5db8',
        flexDirection: "row",
        alignItems: "center",
        width: '75%',
        borderBottomLeftRadius: 50,
        alignSelf: 'flex-end',
        paddingBottom: 10,
        paddingTop: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 18,
        backgroundColor : "#0000"
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
      fontFamily: "ZEKTON"
    },
    textblue: {
        color: '#0d5db8',
        fontSize: 24,
        textAlign: 'right',
        fontFamily: "ZEKTON"
    },
    textwhite: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'left',
        fontFamily: "ZEKTON"
    },
    textSmallwhite: {
        color: '#fff',
        fontSize: 15,
        textAlign: 'left',
        fontFamily: "ZEKTON"
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
        marginTop: 6
    },
    buttonText: {
        fontSize: 15,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#b8130d',
        backgroundColor: 'transparent',
        fontFamily: "ZEKTON"
    },
    buttonNav:{
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
    horizontalSlider : {
        flex: 1,
        flexDirection: 'column',
    },
    sliderView : {
        alignItems: 'center',
        width: 90,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey',
        margin: 4
    },
    ImageIconStyleup : {
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
        fontFamily: "ZEKTON",
        backgroundColor: 'transparent',
    },
    tinyLogo: {
        width: '100%',
        height: '100%',
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 25
    },
    image: {
        flexGrow: 1,
        resizeMode: "cover",
        justifyContent:'center',
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
        fontFamily: "ZEKTON"
    },
    normalgreyText: {
        color: '#013188',
    },
    normalgreyTextHeader: {
        fontSize:10,
        color: '#676767',
    },

    rowFront: {
        backgroundColor: '#fff',
        flex:1,
        margin:'2%',
        borderTopRightRadius: 25,
        borderBottomLeftRadius: 25,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 10,
    },
    rowBack: {
        alignItems:'center',
        backgroundColor: 'transparent',
        marginLeft:'auto',
        flex:1,
        width:'30%',
        flexDirection:'row',
        justifyContent: 'space-between',
        paddingLeft: '2%',
        paddingRight: '2%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
    },
});