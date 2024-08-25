/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React , {Component} from 'react';
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
  TextComponent,
  Dimensions,
  Share,
  SafeAreaView,
  StatusBar,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faShare, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import commonStyle from '../assets/style/styles.js';
import FastImage from 'react-native-fast-image';
import { RecyclerListView, DataProvider, LayoutProvider, ContextProvider  } from 'recyclerlistview';
import  Loader  from '../components/Loader.js';
import ImageViewer from 'react-native-image-zoom-viewer';
import Share2 from 'react-native-share';
import ImgToBase64 from 'react-native-image-base64';

let {width, height} = Dimensions.get('window');

//function Dashboard () {
export default class ImageViewerFile extends Component {

    constructor(props){
        super(props);
        this.state = {
            loader      : false,
            data        : [],
            post_page   : 0,
            load_more   : false,
            arrays      : [],
            displayImage: false,
            no_data     : false,
            total_images: 0,
            visibleImage: false,
            imagesSlider:[]
          }
          let type      = this.props.route.params.type;
          let car_id    = this.props.route.params.car_id;
          let lotnumber = this.props.route.params.lotnumber;
          let typeString = '';
          if(type == 'warehouse'){
            typeString = strings('main.images_warhouse');
          }else if(type == 'loading'){
            typeString = strings('main.images_loading');
          }
          else if(type == 'store'){
            typeString = strings('main.images_store');
          }
          this.props.navigation.setOptions({
            header: () => (
                <View style = {commonStyle.header}>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                marginTop: height*0.05, flex:1}}>
                    <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                  ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                        <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
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
                      <Text style={commonStyle.headerText}>{typeString}</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                        <FontAwesomeIcon
                            icon = { faShare }color="#fff" size={25} />
                    </View>
                  </View>       
              </View>
          )
          });
    }

    componentDidMount() {
        this.getData();
    }


    getData = async() => {
        this.setState({
            loader          : true
        });
        let type = this.props.route.params.type;
        let car_id = this.props.route.params.car_id;
        const server_url = AuthContext.server_url;
        const customer_id    = AuthContext.id;
        const formData = new FormData();
        var Url = '';
        if(type == 'warehouse'){
            Url  = server_url + "/Nejoum_App/getArrivedCarsPhoto";
        }

        else if(type == 'loading'){
            Url  = server_url + "/Nejoum_App/getArrivedCarsPhoto";
        }

        else if(type == 'store'){
            Url  = server_url + "/Nejoum_App/getArrivedStoreCarsPhoto";
        }

        Url = "https://api.nejoumaljazeera.co/api/getImages?car_id="+this.props.route.params.car_id+"&type="+type;
        formData.append('client_id', '1230');
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('car_id', this.props.route.params.car_id);

        fetch(Url, {
            method: 'GET',
            credentials: 'same-origin',
        })
        .then((response) => {
            if(response.ok){
                return response;
            }
            throw Error(response.success);
        })
        .then(res => res.json())
        .then((response) => {
            if(response.images){
                carImages=[];
                if(response.images.length >0){
                    fakeData = [];
                    response.images.forEach(instance => {
                        fakeData.push({
                          image: instance
                        });
                        carImages.push({url: instance});
                    });
                this.setState ({
                  loader      : false,
                  total_images: response.images.length,
                  imagesSlider: carImages,
                  data: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(fakeData),
                },
                this.setLayout()
                );

                }else {
                    this.setState({
                        loader      : false,
                        error_message    : 'error',
                        no_data : true
                    });
                }

                return;
            }
            else{
                this.setState({
                    loader      : false,
                    error_message    : 'error',
                    no_data : true
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

    YourImage = (url) => (
      <FastImage
          style={{width: '100%', height: '100%', borderRadius:7}}
          source={{
              uri: url,
              priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
      />
    )

    fillImagesarr = (image) => {
        index = this.state.imagesSlider.findIndex(x => x.url ===image);
        this.setState({visibleImage: true, activeIndexImage: index});
    }

    rowRenderer = (data) => {
        const {image} = data;
           return(
           <TouchableOpacity activeOpacity={1}
                onPress={() => this.fillImagesarr(image)}>
                 <View style={{borderWidth:2, borderColor:'#fff', margin:'0.25%', borderRadius:7,
                  width: width*0.328, height: width*0.328}}>{this.YourImage(image)}</View>
           </TouchableOpacity>
           )
    }

    setLayout = () => {
        this.layoutProvider = new LayoutProvider((i) => {
                return this.state.data.getDataForIndex(i);
            }, (dim) => {
               dim.width  = width;
               dim.height = 100;
        })
    }

    handle_back_press = () => {
        this.props.navigation.navigate("carImagesNavigator");
        return true;
      }
    componentDidUpdate(prevProps){
        if (this.props.route.params.car_id !== prevProps.route.params.car_id && this.props.route.params.type !== prevProps.route.params.type) {
            this.setState({
                loader      : false,
                data        : [],
                post_page   : 0,
                load_more   : false,
                arrays      : [],
                imageUrl    : ''
              });
            this.getData();
        }
    }

    shareImage = async (images) => {
        await ImgToBase64.getBase64String(images[0].url)
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
        }
    }

    render(){
    /**const images = [{
        url: this.state.imageUrl,
    }]**/
    images = this.state.imagesSlider;
    if(this.state.loader){
          return(
              <Loader loader={this.state.loader}></Loader>
          );
      }

    if(this.state.no_data){
        return(
              <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
                  <Text style={commonStyle.noDataText}>
                      {strings('main.no_data')}
                  </Text>
              </View>
      );
    }
        return (
        <View style={{flex:1}}>
            <View style={{flex:0.08, backgroundColor: '#343D40', flexDirection:'column', padding:'3%'}}>
                <Text style={{color: '#fff', fontWeight:'bold', }}>
                    {this.props.route.params.year } {this.props.route.params.carMakerName } {this.props.route.params.carModelName }</Text>
                   <Text style={{color: '#fff'}}>
                   Lot# {this.props.route.params.lotnumber}</Text>
                   <Text style={{color: '#fff'}}>
                   {this.props.route.params.purchasedate}</Text>
            </View>
            <Modal visible={this.state.visibleImage} transparent={true} style={{backgroundColor: 'white',
                margin: 0, // This is the important style you need to set
                alignItems: undefined,
                justifyContent: undefined}}>
                <ImageViewer
                    imageUrls={this.state.imagesSlider}
                    enableSwipeDown="true"
                    enablePreload= "true"
                    backgroundColor="#000"
                    index={this.state.activeIndexImage}
                    renderHeader={(index) =>
                        <SafeAreaView>
                                <View  style={{flexDirection:'row', zIndex: 9999}}>
                                    <TouchableOpacity style={{borderRadius:25,justifyContent:'center',
                                    alignItems:'center', width:50, height:50}}
                                    onPress={() => this.setState({visibleImage: false})}>
                                    <FontAwesomeIcon
                                    icon = { faXmarkCircle } size={25} color="#fff" /></TouchableOpacity>
                                </View></SafeAreaView>
                    }
                    loadingRender = {() => <Loader loader={true}></Loader> }
                />
            </Modal>

            {this.state.loader?(<Loader loader={this.state.loader}></Loader>):
                this.state.total_images > 0
                ? <RecyclerListView
                    ref={ref => this._recyclerListView = ref}
                    style={{flex: 1}}
                    useWindowScroll
                    optimizeForInsertDeleteAnimations={true}
                    initialRenderIndex={0}
                    scrollsToTop={false}
                    renderAheadOffset={250}
                    showsVerticalScrollIndicator={true}
                    rowRenderer={this.rowRenderer}
                    forceNonDeterministicRendering={true}
                    dataProvider={this.state.data}
                    initialListSize={10}
                    layoutProvider={this.layoutProvider}
                />
                :   <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
                        <Text style={commonStyle.noDataText}>
                            {strings('main.no_data')}
                        </Text>
                    </View>}
               </View>
        )
    }
}

const styles = StyleSheet.create({
    wrapContainer: {
    flexDirection       : 'row',
    flexWrap            : 'wrap',
    justifyContent:'space-between',
    },
    imgBackground: {
        flex            : 1,
        width           : '100%',
        resizeMode      : "cover",
        justifyContent  : "center"
    }
});