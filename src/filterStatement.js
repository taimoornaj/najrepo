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
  Dimensions,
  ImageBackground,
  TextComponent
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { strings } from '../locals/i18n';
import DatePicker from 'react-native-datepicker';
//import DatePicker from 'react-native-date-picker';
import Icon2 from 'react-native-vector-icons/FontAwesome';

const {width, height} = Dimensions.get('window'); 

//function Dashboard () {
export default class FilterStatement extends Component {

    constructor(props){
        super(props);
        this.state = {
            loader      : false,
            fulldata    : [],
            post_page   : 0,
            load_more   : false,
            arrays      :[],
            visible: false,
            locinfo: '',
            zoom: ''
          }
          this.props.navigation.setOptions({
            header: () => (
                <View style = {{
                      position: 'relative',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      top:0,
                      width: '100%',
                      backgroundColor: '#0d5db8',
                      height: 80,
                      borderBottomLeftRadius: 30,
                      borderBottomRightRadius: 30,
                      shadowColor: "#000",
                      justifyContent: 'center',
                      shadowOffset: {
                          width: 0,
                          height: 12,
                      },
                      shadowOpacity: 0.58,
                      shadowRadius: 16.00,
                      elevation: 18,
                      }}>
                        <View style={{flexDirection: 'row', justifyContent: 'center',  alignItems:'center'}}>
                          <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', flex: 1, }}>
                                <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate("generalStatement")}>
                                    <View style={{margin: 16, alignItems: 'center', justifyContent: 'center'}}>
                                          <View>
                                              <Icon2 name="arrow-left" size={width*0.06} color='#fff' backgroundColor="#fff" />
                                          </View>
                                    </View>
                                </TouchableOpacity>
                          </View>
                          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <Text style={{color: '#ffffff', fontSize: 30}}>{strings('car.general_statement')}</Text>
                          </View>
                          <View style={{justifyContent: 'flex-end', alignItems: 'flex-end', flex: 1}}>
                          </View>
                        </View>       
                </View>
          )  
        });
    }

    componentDidMount() {
    }

    toggleOverlay = () => {
        this.setState({visible: false});
    }
    render(){
        return (
            <View style={styles.image}>
                <ScrollView contentContainerStyle = {styles.container}>
                    <View>
                    <View style={{justifyContent:'space-between', alignItems:'center', flex:1}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.textBlue2}>{strings('main.from')}</Text>
                            </View>
                            <View style={{flexDirection: "row", width: '75%',fontSize:25, borderColor:'transparent', borderWidth:2,
                                            borderRadius:25, backgroundColor:'transparent' }}>
                                    <DatePicker
                                        style={{flex: 1}}
                                        date={this.state.from_date}
                                        mode="date"
                                        placeholder="From"
                                        format="YYYY-MM-DD"
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0
                                        },
                                        dateInput: {
                                            marginLeft: 36
                                        }
                                        // ... You can check the source to find the other keys.
                                        }}
                                        onDateChange={(date) => {this.setState({from_date: date})}}
                                    />
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.textBlue2}>{strings('main.to')}</Text>
                            </View>
                            <View style={{flexDirection: "row", width: '75%',fontSize:25, borderColor:'transparent', borderWidth:2,
                                            borderRadius:25, backgroundColor:'transparent'}}>
                                    <DatePicker
                                        style={{flex:1, borderRadius:25}}
                                        date={this.state.to_date}
                                        mode="date"
                                        placeholder="To"
                                        format="YYYY-MM-DD"
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0
                                        },
                                        dateInput: {
                                            marginLeft: 36
                                        }
                                        // ... You can check the source to find the other keys.
                                        }}
                                        onDateChange={(date) => {this.setState({to_date: date})}}
                                    />
                            </View>
                        </View>
                        <View style={{flexDirection: 'row',marginTop: 20, justifyContent:'center', alignItems:'center'}}>
                        </View>
                        <View style={{flexDirection:'row',marginTop: 10}}>
                            <LinearGradient
                                style={{justifyContent: 'center', flexDirection: 'row',
                                        alignItems: 'center',marginLeft:50,marginRight:50,
                                        borderRadius: 10}}
                                        colors = {['#a41720', '#7e2b47']}>
                            <TouchableOpacity activeOpacity={1} style={{flexDirection: 'row'}} 
                            onPress={() => this.props.navigation.navigate("generalStatement", {from: this.state.from_date, to: this.state.to_date})}>           
                                        <Text style={{ padding: 10, justifyContent:'center',  textAlign:'center',
                                            alignItems:'center', flex: 1, flexWrap: 'wrap', color: '#ffff',
                                                fontSize: 25}}>
                                                {strings('main.search')}        
                                        </Text>
                            </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    </View>                        
                </ScrollView>
            </View>  
        )
    }
}

//export default Dashboard

const styles = StyleSheet.create({
    container: {
       flexGrow: 1
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
    },
    textblue: {
        color: '#0d5db8',
        fontSize: 24,
        textAlign: 'right',
    },
    textwhite: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'left',
    },
    textSmallwhite: {
        color: '#fff',
        fontSize: 15,
        textAlign: 'left',
    },
    linearGradient: {
        flex: 1,
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 100
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
        resizeMode: "contain",
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
        color: '#A3A9AF',
    },
    normalgreyTextHeader: {
        fontSize: 16,
        color: '#676767',
    },Imagelogo : {
        width: '100%',
        height: '100%',
        justifyContent:'center',
        resizeMode: 'contain',
    },
    Imagezoom:{
        resizeMode: 'contain',
        width:30,
        height:30,
    },
    Imagegeneral: {
        resizeMode: 'contain',
        width:50,
        height:50,
    },
    Imagegeneral2: {
        width: '10%',
        height: '20%',
        justifyContent:'center',
        resizeMode: 'contain',
        position:'absolute',
        left: width-250,
        right: 0,
        top: height-550
    },
    Imagegeneral3: {
        width: '10%',
        height: '20%',
        justifyContent:'center',
        resizeMode: 'contain',
        position:'absolute',
        left: width-300,
        right: 0,
        top: height-400
    },
    Imagegeneral4: {
        width: '10%',
        height: '20%',
        justifyContent:'center',
        resizeMode: 'contain',
        position:'absolute',
        left: width-150,
        right: 0,
        top: height-400
    },
    Imagegeneral5: {
        width: '10%',
        height: '20%',
        justifyContent:'center',
        resizeMode: 'contain',
        position:'absolute',
        left: width-350,
        right: 0,
        top: height-500
    },
    Imagegeneral6: {
        width: '10%',
        height: '20%',
        justifyContent:'center',
        resizeMode: 'contain',
        position:'absolute',
        left: width-130,
        right: 0,
        top: height-620
    },
    Imagegeneral7: {
        width: '10%',
        height: '20%',
        justifyContent:'center',
        resizeMode: 'contain',
        position:'absolute',
        left: width-70,
        right: 0,
        top: height-400
    }, overlaystyle: {
        flex: 0.3,
        width: '50%',
        borderRadius:25,
        justifyContent: 'center',
        backgroundColor: '#fff',
        opacity: 0.9,
    },textBlue2: {
        color: '#0d5db8',
        fontSize: 22,
        paddingTop:10,
        textAlign: 'center',
    }
});