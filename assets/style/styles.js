import { StyleSheet, Dimensions } from 'react-native';
import * as I18n from "react-native-localize";
import { strings } from '../../locals/i18n';


const {width, height} = Dimensions.get('window'); 

module.exports = StyleSheet.create({
    backgroundimage: {
        flex: 1,
        resizeMode: "stretch",
        width: '100%',
        justifyContent: "center"
    },
    submitbutton: {
        flexDirection: "row",
        backgroundColor:'#4091F7',
        justifyContent: 'center',
        alignItems:'center',
        padding: 10,
        width: '40%',
        margin: height*0.02,
        justifyContent: 'center', alignItems:'center',
        backgroundColor:'green',
        borderRadius: 10, 
    },
    submitbuttonBlue: {
        flexDirection: "row",
        backgroundColor:'#0093FF',
        justifyContent: 'center',
        alignItems:'center',
        padding: 10,
        width: '40%',
        justifyContent: 'center', alignItems:'center',
        borderRadius: 10, 
    }, 
    buttonTextBlue: {
        color:'#fff', fontSize:width*0.04, padding: '3%', fontWeight:'bold'
    },
    buttonText: {
        color:'#fff', fontSize:width*0.05, padding: '3%', textAlign:'center'
    },
    textInput: {
        flex: 1,
        textAlign: I18n.getLocales()=='ar'?'right':'left',
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    inputLabel: {

    },
    normalgreyTextHeader: {
        fontSize: height*0.02,
        paddingTop:5,
        color: '#676767',
    },
    normalgreybigText: {
        color: '#A3A9AF',
        fontSize: height*0.015
    },
    normalgreysmallText: {
        color: '#A3A9AF',
        fontSize: height*0.01
    },
    normalHeader: {
        fontSize: height*0.018,
        padding:5,
        color: '#fff',
        margin: '1%',
        textAlign: 'center'
    },
    blogTextRight: {
        color: '#818181',
        fontSize: 15,
        lineHeight: 24,
        paddingRight: 15,
        justifyContent:  I18n.getLocales() == 'ar'?'flex-start':'flex-end',
        alignItems: I18n.getLocales() == 'ar'?'flex-start':'flex-end'
    },
    blogTextLeft: {
        color: '#000',
        fontSize: I18n.getLocales() == 'ar'?15:15,
        lineHeight: 15,
        padding: 4,
        paddingLeft: 15,
        justifyContent: I18n.getLocales() == 'ar'? 'flex-end':'flex-start',
        alignItems: I18n.getLocales() == 'ar'? 'flex-end':'flex-start',
        flex: 1
    },
    titleStyle:{
        width:15,
        height:15,
        borderWidth:2,
        borderColor: '#013188'
    },
    keysStyle: {
        width:15,
        height:15,
        borderWidth:2,
        borderColor: '#013188'
    },
    titleStyleborderWhite:{
        width:15,
        height:15,
        borderWidth:2,
        borderColor: '#fff'
    },
    keysStyleborderWhite: {
        width:15,
        height:15,
        borderWidth:2,
        borderColor: '#fff'
    },
    //search bar style
    containerStyle: {
        alignItems: 'center',
        height: height*0.05,
        justifyContent: 'center',
        borderColor: '#fff',
        backgroundColor: '#fff',
        borderRadius: height/2,
        marginRight: height*0.08,
        marginLeft: height*0.08
    },
    inputContainerStyle: {
        height: height*0.05,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#fff',
        backgroundColor: '#fff',
        borderRadius: height/2,
    },

    headerWithSearch: {
        flex: 1,
        height: height*0.11,
        justifyContent: 'center',
        position: 'absolute',
        top:height*0.01,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 500
    },
    headerSearch: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top:0,
        backgroundColor: '#013188',
        height: height*0.13,
        zIndex: -20,
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
    },
    searchIcon: {
        resizeMode: "contain",
        justifyContent: "center",
        //width: 20,
        //height: 20,
        width: width*0.05,
        height: width*0.05,
    },
    //end search bar style
    headerText: {
        color: '#fff',
        //fontSize: 20
        fontSize:  width*0.055,
        fontFamily: 'Roboto-Regular'
    },
    headerView: {
        flexDirection: 'row',
        justifyContent: 'center',
        margin: height*0.01
    },

    iconsdashboardTop: {
        justifyContent: 'center',
        resizeMode: "contain",
        alignItems: 'center',
        backgroundColor:'#F8F8F8',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 10,
        borderColor: '#C7C7C7',
        borderWidth:1,
        borderTopRightRadius: 10,
        justifyContent: 'center',
    },
    header: {
        position: 'relative',
        left: 0,
        right: 0,
        bottom: 0,
        top:0,
        width: '100%',
        backgroundColor: '#013188',
        height: height*0.12,
        //borderBottomLeftRadius: 30,
        //borderBottomRightRadius: 30,
        /**shadowColor: "#000",
        justifyContent: 'center',
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 18,**/
    },
    headernoShadow: {
        position: 'relative',
        left: 0,
        right: 0,
        bottom: 0,
        top:0,
        width: '100%',
        backgroundColor: '#013188',
        height: height*0.07,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: "#000",
        justifyContent: 'center',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.58,
        shadowRadius: 6.00,
        elevation: 10,
    },
    //cars First Style Gradient red and blue
    redgradient: {
        flexDirection:'row',
        justifyContent:'space-between', 
        alignItems:'center',
        width: '65%',
        flex:1,
        borderTopRightRadius: 25,
    },
    redgradient2: {
        flexDirection:'row',
        justifyContent:'space-between', 
        alignItems:'center',
        width: '70%',
        borderTopRightRadius: 25,
    },
    redgradientView: {
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center',
        padding: '2%'
    },
    redgradientimageView: {
        flex:0.3,
        flexDirection: 'row'
    },
    redgradientimage: {
        width: '100%',
        height: '100%',
    },
    redgradientinfoView: {
        flex:0.8,
        justifyContent:'space-between',
        padding:5
    },
    redgradientinfofirstRowview: {
        flex: 0.3
    },
    redgradientviewLabel: {
        flex: 0.4
    },
    redgradientviewinfo: {
        flex: 0.6
    },
    normalgreyTextlabel: {
        fontSize: width*0.03,
        color: '#676767',
    },
    normalgreyTextlabelCarSell: {
        fontSize: width*0.028,
        color: '#676767',
    },
    normalgreyTextinfo: {
        color: '#000',
        fontSize: width*0.03,
    },
    redgradientblueText: {
        color: '#fff',
        fontSize: width*0.03,
    },
    //end First style Gradient red and blue
    noDataText:{
        flexDirection:'row',
        fontSize: 25,
        color: '#4e3f76',
        alignItems: 'center',
        justifyContent: 'center'
    },
    //cars statement style
    redgradientView: {
        alignItems:'center',
        justifyContent: 'center',
        width: '50%',
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 20,
        marginLeft: 5,
        flexDirection: 'row',
        flex:1
    },
    redgradientView2: {
        alignItems:'center',
        justifyContent: 'center',
        width: '60%',
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 20,
        marginLeft: 5,
        flexDirection: 'row',
        flex:1
    },
    redgradientText: {
        color: "#013188",
        alignItems: 'center',
        justifyContent:'center',
        fontSize: width*0.04,
    },
    redgradientTextHome: {
        color: "#013188",
        alignItems: 'center',
        justifyContent:'center',
        fontSize: (I18n.getLocales() == 'en')?width*0.04:width*0.035,
        marginTop: '3%',
        fontFamily: 'Roboto-Regular',
    },
    redgradientTextView: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center'
    },
    redgradientimageViewStatement: {
        flex:0.3,
        flexDirection: 'row'
    },
    redgradientimageStatement: {
        width: '100%',
        height: '100%',
        borderRadius:10
    },
    normalyellowTextHeader: {
        fontSize: width*0.035,//13
        color: '#ffd768',
    },
    textwhiteStatement: {
        color: '#fff',
        fontSize:  width*0.035,//12
        textAlign: 'left',
    },
    textblackStatement: {
        color: '#343D40',
        fontSize:  width*0.035,//12
        textAlign: 'left',
    },
    //end cars statement style
    textBlue: {
        color: '#0d5db8',
        fontSize: width*0.03,
        textAlign: 'left',
    },
    textBlack: {
        color: '#343D40',
        fontSize: width*0.03,
        textAlign: 'left',
    },
    iconstyle: {
        resizeMode: "contain",
        justifyContent: "center",
        width: 15,
        height: 15
    },
    textwhite: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Roboto-Regular',
        textAlign: 'left',
    },
    fontsizeGlobalSmall: {
        fontSize: width*0.025,
        fontFamily: 'Roboto-Regular'
    },
    smallCircle: {
        width: height*0.09,
        height: height*0.09,
        zIndex: 20,
        resizeMode: "cover",
        justifyContent: "center",
        alignItems: 'center',
        left: width*0.6,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 100/2,
        backgroundColor: '#08396f'
    },
    bigCircle: {
        width: height*0.3, //0.35
        height: height*0.3,////0.35
        zIndex: 20,
        resizeMode: "contain",
        justifyContent: "center",
        alignItems: 'center',
        borderColor: '#013188',
        borderWidth: 15,
        borderRadius: height*0.3/2,
    },
    symbolAroundCircle: {
        flex: 1,
        backgroundColor: '#013188',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor:'#fff',
        borderWidth: 2
    },
    symbolAroundCirclered: {
        flex: 1,
        backgroundColor: '#013188',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor:'red',
        borderWidth: 2
    },
    
    symbolAroundCircleArrivedActual: {
        flex: 1,
        backgroundColor: '#ffff',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor:'#149414',
        borderWidth: 2

    },symbolAroundCircleArrived: {
        flex: 1,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#0c55a8',
        borderWidth: 2,
        borderColor:'#149414',
    },
    circleInside: {
        justifyContent: 'center',
        resizeMode: "contain",
        alignItems: 'center',
        backgroundColor:'#013188',
        width: height*0.15,
        height: height*0.15,
        borderRadius: height*0.15/2
    },
    smallIcons: {
        width: '50%',
        height: '50%',
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    smallIconsinside: {
        width: '80%',
        height: '80%',
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerStyledashboard: {
        alignItems: 'center',
        height: height*0.05,
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: height/2,
        width:'100%',
        borderColor: '#fff'
    },
    inputContainerStyledashboard: {
        height: height*0.05,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: height/2,
        borderColor: '#fff',
    },
    //new dashboard
    iconsdashboard: {
        justifyContent: 'center',
        resizeMode: "contain",
        alignItems: 'center',
        backgroundColor:'#fff',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderColor: '#C7C7C7',
        borderWidth:1,
        justifyContent: 'center',
        width: width*0.45,
        height: width*0.27
    },
    image3d: {
        width: height*0.05,
        height: height*0.05,
        resizeMode: "contain",
    },


    /// customize font size and margin bottom safe area
    marginGlobale: {
        marginBottom : width <= 375 ? height*0.06 : height*0.01,
        backgroundColor:'transparent',
        flex:1
    },
    marginGlobaleless: {
        marginBottom : width <= 375 ? height*0.01 : height*0.01,
        backgroundColor:'transparent',
        flex:1
    },
    fontsizeGlobal: {
        fontSize: width*0.03,
    },
    badgeStyle : {
        backgroundColor: 'red',
        width:'100%',
        height:'50%',
        borderRadius: 20,
        width:width*0.06, height:width*0.06,
        flex:1,
        scaleX: 0.7, 
        scaleY: 0.7,
    },
    fontsizeGlobalbig: {
        fontSize: width*0.04,
    },
    image3dbig: {
        width: width*0.15,
        height: width*0.15,
        resizeMode: "contain",
    },
    image3dbig2: {
        width: width*0.13,
        height: width*0.13,
        resizeMode: "contain",
    },
    image3dbigcover: {
        width: width*0.15,
        height: width*0.15, 
        resizeMode: "cover",
    },
    submitbuttonSmall: {
        flexDirection: "row",
        backgroundColor:'#ab0c0c',
        justifyContent: 'center',
        alignItems:'center',
        borderColor: '#fff',
        borderRadius: 25,
        borderWidth: 2,
        padding: 10,
        width: '30%',
        margin: height*0.02,
    },
    bottomBarText: {
        fontSize: width*0.025,
        textAlign:'center',
        color:'#838383',
        flexDirection:'row'
    },
    bottomBarTextActive: {
        fontSize: width*0.025,
        textAlign:'center',
        color:'#013188',
        flexDirection:'row'
    },
    bottomBarView: {
        justifyContent:'center', alignItems:'center', 
        paddingBottom:'7%' //only for new devices
    },
    image3d6: {
        width: height*0.06,
        height: height*0.06,
        resizeMode: "contain",
    },
    symbolAroundCircleArrivedCarTrack: {
        flex: 1,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#fff',
        //shadow
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,


    },
});