import React, {Component} from 'react';
import {Platform,
        StyleSheet,
        Text,
        View,
        Image,
        ImageBackground,
        StatusBar,
        Modal,
        TouchableOpacity,
        ScrollView,
         
    } from 'react-native';
import { Overlay } from 'react-native-elements';
export default class Error extends Component{
    constructor(props){
        super(props);
    }


    render(){
        if(this.props.loader){
            return(
                <View style={styles.overlay}>
                    <Image source={require("../assets/loadingapp.gif")}
                        style={{backgroundColor:'transparent', width:100}}
                        resizeMode="contain">
                    </Image>
                </View>   
            )
        }
       
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image_background : {
        width  : '100%',
        height : '100%',
        justifyContent : 'center',
        alignItems : 'center'
    },
    loader_text : {
        fontSize : 20,
        color    : 'yellow',
        textAlign: 'center'  
    },
    loader_text_no_bg : {
        fontSize : 18,
        color    : 'black',
        textAlign: 'center',
        paddingLeft:10,
        paddingRight:10  
    },
    overlay: {
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'transparent',
        width:'100%',
        height: '100%',
        opacity: 1,
    }
});