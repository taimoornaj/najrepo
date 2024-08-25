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
  TouchableWithoutFeedback
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-elements';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import {FlatListSlider} from 'react-native-flatlist-slider';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import PreviewCarDetails2 from '../components/PreviewCarDetails2';
import I18n from 'react-native-i18n';
//import TouchableScale from 'react-native-touchable-scale';
import { FlatList } from 'react-native-gesture-handler';
import { SharedElement } from 'react-native-shared-element';
import ImageModal from 'react-native-image-modal';
import commonStyle from '../assets/style/styles.js';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faEdit, faSliders } from '@fortawesome/free-solid-svg-icons';

let {width, height} = Dimensions.get('window');

//function Dashboard () {
export default class CarImages extends Component {

    constructor(props){
        super(props);
        this.state = {
            loader      : false,
            fulldata    : [],
            post_page   : 0,
            load_more   : false,
            arrays      :[],
            displayImage : false
          }
          let dataProps = this.props.route.params.gdata;
          this.props.navigation.setOptions({
            header: () => (


<View style = {commonStyle.header}>
<View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
marginTop: height*0.05, flex:1}}>
  <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
,justifyContent: 'flex-start', alignItems:'flex-start'}}>
      <TouchableOpacity activeOpacity={1}  onPress={() => this.props.navigation.goBack()}>
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
  <Text style={commonStyle.headerText}>
                                {this.props.route.params.title}</Text>
  </View>
  <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
    <Text style={commonStyle.headerText}></Text>
  </View>
</View>       
</View>
          )
          });
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps){
        if (this.props.route.params.data !== prevProps.route.params.data) {
            this.setState({
                loader      : false,
                fulldata    : [],
                post_page   : 0,
                load_more   : false,
                arrays      :[],
                imageUrl    : ''
              });

            this.render();

        }
    }


    

    render(){
        var data1 = this.props.route.params.data;
        var images = [];
        data1.map( ( item )=> {
            images.push(
                { 
                    image:  item,
                });
        });

        if(this.state.displayImage){
            return (
                <ImageModal
                    resizeMode="contain"
                    imageBackgroundColor="#000000"
                    style={{
                    width: 250,
                    height: 250,
                    }}
                    source={{
                    uri: this.state.imageUrl,
                    }}
                />
            )
        }
        return (
            <View style={styles.imgBackground}>
                <SafeAreaView style={{marginBottom:height*0.05, backgroundColor:'transparent', justifyContent:'center', alignItems:'center',}}>
                    <FlatList
                            vertical
                            showsHorizontalScrollIndicato={false}
                            data={images}
                            keyExtractor={item => item.id}
                            renderItem={({item}) =>{
                                return(
                                    <View style={{justifyContent: 'center'}}>
                                        <TouchableScale
                                            friction={7}
                                            tension={50}
                                            useNativeDriver
                                            activeScale={0.5}>
                                                 <ImageModal
                                                    resizeMode="contain"
                                                    imageBackgroundColor="transparent"
                                                    style={{
                                                        width: width*0.9,
                                                        height: height*0.5,
                                                        borderRadius: 14,
                                                    }}
                                                    source={{
                                                        uri: item.image,
                                                    }}
                                                />
                                                
                                        </TouchableScale>
                                    </View>
                                )
                            }}
                        />
                </SafeAreaView>
            </View> 
        )
        
    }
}

//export default Dashboard



const styles = StyleSheet.create({
    container: {
       flexGrow: 1,
      /**justifyContent: 'center',
      alignItems: 'center'**/
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
        borderTopRightRadius: 60,
        borderBottomLeftRadius: 25
    },
    image: {
        flex: 1,
        resizeMode: "cover",
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
        fontFamily: "ZEKTON"
    },
    normalgreyText: {
        color: '#A3A9AF',
        fontFamily: "ZEKTON"
    },
    normalgreyTextHeader: {
        fontSize: 16,
        color: '#676767',
        fontFamily: "ZEKTON"
    },
    imgBackground: {
        flex: 1,
        width: '100%',
        resizeMode: "cover",
        justifyContent: "center"
    },
    textwhite: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'left',
    }, textSmallwhite: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'left',
    },textBlue: {
        color: '#0d5db8',
        fontSize: 22,
        textAlign: 'left',
        fontFamily: "ZEKTON"
    }, 
    image2: {
        flex:1,
        resizeMode: "cover",
        justifyContent: "center",
        borderTopRightRadius: 40,borderBottomLeftRadius: 40,    
    }
});