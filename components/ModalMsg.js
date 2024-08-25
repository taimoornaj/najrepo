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
import { strings } from '../locals/i18n';
export default class ModalMsg extends Component{
    constructor(props){
        super(props);
        this.state = {
            modalmsg: this.props.modalmsg
        }
    }

    toggleOverlay = () => {
        this.setState({modalmsg: false});
        //this.props.navigation.navigate(this.props.page);
    }

    closeModal(){
        this.setState({modalmsg: false});
        this.props.navigation.navigate(this.props.page);
    }

    render(){
        return(
            <Overlay isVisible={this.state.modalmsg} style={styles.container} overlayStyle={styles.overlaystyle} onBackdropPress={this.toggleOverlay}>
                <View style={styles.modals}>
                    <View style = {{flex: 1, flexDirection: 'row', justifyContent:'center', alignItems: 'center'}}>
                        <Text style={styles.loader_text_no_bg}>{this.props.msg}</Text>
                    </View>
                    <View style = {{flex: 1, flexDirection: 'row', justifyContent:'space-between', zIndex: 900}}>
                        <TouchableOpacity activeOpacity={1}
                            onPress = {() => this.closeModal()}
                            style = {styles.buttonOk}>
                            <View style={styles.buttonOk}>
                                <Text style={styles.approveText}>
                                    {strings('main.ok')}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1}
                                onPress = {() => this.closeModal()}
                                style = {styles.buttonCancel}>
                                <View style = {styles.buttonCancel}>
                                    <Text style={styles.canceltext}>
                                     {strings('main.cancel')}
                                    </Text>
                                </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay>
        )
    }
}

const styles = StyleSheet.create({
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
        color    : '#0d5db8',
        fontFamily: "ZEKTON",
        textAlign: 'center',
        paddingBottom: 50
    },
    modals: {
        width: 300,
        height: 200,
        flex: 0.3,
        borderBottomLeftRadius: 20,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonOk: {
        textAlign: 'center',
        width: 80,
        height: 60,
        borderRadius: 25,
        margin: '2%',
        backgroundColor: '#0d5db8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonCancel: {
        textAlign: 'center',
        width: 80,
        height: 60,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#e6514d',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '2%'
    },
    canceltext: {
        color: '#e6514d',
        fontFamily: 'ZEKTON',
        textAlign: 'center'
    },
    approveText: {
        color: '#fff',
        fontFamily: 'ZEKTON',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    overlaystyle: {
        borderBottomLeftRadius: 100,
        borderTopRightRadius: 100,
        justifyContent: 'center'
    }
});    