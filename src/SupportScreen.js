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
  Platform,
  PermissionsAndroid,
  Dimensions,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-elements';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
//import {AudioRecorder, AudioUtils} from 'react-native-audio';
import Ionicons from "react-native-vector-icons/Ionicons";

//function Dashboard () {
export default class SaleCars extends Component {

    constructor(props){
        super(props);
        this.state = {
            loader      : false,
            fulldata    : [],
            post_page   : 0,
            load_more   : false,
          }
    }

    componentDidMount() {
        /**this.checkPermission().then(async hasPermission => {
            this.setState({ hasPermission });
            if (!hasPermission) return;
            await AudioRecorder.prepareRecordingAtPath(
                this.state.audioPath,
                this.state.audioSettings
            );
            AudioRecorder.onProgress = data => {
                console.log(data, "onProgress data");
            };
            AudioRecorder.onFinished = data => {
                console.log(data, "on finish");
            };
        });**/
    }

    checkPermission() {
        if (Platform.OS !== "android") {
            return Promise.resolve(true);
        }
        const rationale = {
            title: "Microphone Permission",
            message:
                "AudioExample needs access to your microphone so you can record audio."
        };
        return PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            rationale
        ).then(result => {
            console.log("Permission result:", result);
            return result === true || result === PermissionsAndroid.RESULTS.GRANTED;
        });
    }

    getallMessages = () => {
        this.setState({
            loader          : true
          });
        var start     = this.state.start;
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('start', this.state.post_page);
        formData.append('length', 5);
        var Url  = AuthContext.server_url + "/Nejoum_App/car_for_sell";
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
                error_message    : 'error'   
            });
            Alert.alert('Error', 'Error Occurdded', [
                {text: 'Okay'}
            ]);
        });  
    }


    onscroll = (e) => {
        var total_posts      = this.state.total_data;
        var total_post_count = this.state.fulldata.length;
        var contentLength    = e.nativeEvent.contentSize.height;
        var trailingInset    = e.nativeEvent.contentInset.bottom;
        var scrollOffset     = e.nativeEvent.contentOffset.y;
        var viewportLength   = e.nativeEvent.layoutMeasurement.height;
     
        if( Math.round(viewportLength + scrollOffset) >= Math.round(contentLength)){
          if(this.state.load_more == false && total_posts != total_post_count)
            this.load_more_data();
        }
    }

    
  load_more_data = async() => {
    this.setState({load_more:true});
    var start     = this.state.post_page;
    var Url       = AuthContext.server_url+"/Nejoum_App/car_for_sell";
    const formData = new FormData();
    formData.append('client_id', '1230');
    formData.append('client_secret', '1230NEJOUM1230');
    formData.append('start', start);
    formData.append('length', 2);
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
        var old_data    = this.state.fulldata;
        var start       = start;
        var count       = response.data.length;
        for(var i = 0; i < response.data.length; i++){
            old_data.push(response.data[i]);
        }
       
        this.setState({
          load_more       : false,
          post_page       : old_data.length,
          total_posts     : count,
          fulldata        : old_data,
        }); 
      }
    })
    .catch((error) => {
      console.warn(error.message);
    });
  }


    _refreshList = async() => {
        this.setState({
          loader  : true,
        });
        var start     = 0;
        var Url       = AuthContext.server_url+"/Nejoum_App/car_for_sell";
        const formData = new FormData();
        formData.append('client_id', '1230');
        formData.append('client_secret', '1230NEJOUM1230');
        formData.append('start', start);
        formData.append('length', 5);
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
                this.setState({
                    loader      : false,
                    fulldata    : response.data    
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
                error_message    : 'error'   
            });
            Alert.alert('Error', 'Error Occured', [
                {text: 'Okay'}
            ]);
        });
    }
/** 
    handleAudio = async () => {
        const { user } = this.props;
        if (!this.state.startAudio) {
            this.setState({
                startAudio: true
            });
            await AudioRecorder.startRecording();
        } else {
            this.setState({ startAudio: false });
            await AudioRecorder.stopRecording();
            const { audioPath } = this.state;
            const fileName = `${this.messageIdGenerator()}.aac`;
            const file = {
                uri: Platform.OS === "ios" ? audioPath : `file://${audioPath}`,
                name: fileName,
                type: `audio/aac`
            };
            const options = {
                keyPrefix: AwsConfig.keyPrefix,
                bucket: AwsConfig.bucket,
                region: AwsConfig.region,
                accessKey: AwsConfig.accessKey,
                secretKey: AwsConfig.secretKey,
            };
            RNS3.put(file, options)
                .progress(event => {
                    console.log(`percent: ${event.percent}`);
                })
                .then(response => {
                    console.log(response, "response from rns3 audio");
                    if (response.status !== 201) {
                        alert("Something went wrong, and the audio was not uploaded.");
                        console.error(response.body);
                        return;
                    }
                    const message = {};
                    message._id = this.messageIdGenerator();
                    message.createdAt = Date.now();
                    message.user = {
                        _id: user._id,
                        name: `${user.firstName} ${user.lastName}`,
                        avatar: user.avatar
                    };
                    message.text = "";
                    message.audio = response.headers.Location;
                    message.messageType = "audio";

                    this.chatsFromFB.update({
                        messages: [message, ...this.state.messages]
                    });
                })
                .catch(err => {
                    console.log(err, "err from audio upload");
                });
        }
    };**/

    renderAndroidMicrophone() {
        if (Platform.OS === "android") {
            return (
                <Ionicons
                    name="ios-mic"
                    size={35}
                    hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                    color={this.state.startAudio ? "red" : "black"}
                    style={{
                        bottom: 50,
                        right: Dimensions.get("window").width / 2,
                        position: "absolute",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.5,
                        zIndex: 2,
                        backgroundColor: "transparent"
                    }}
                    onPress={this.handleAudio}
                />
            );
        }
    }
    
    render(){
        
        if(this.state.load_more){
            var load_more = <View style={{backgroundColor:'transparent', flex:1, justifyContent:'center', alignItems:'center'}}>
                                <Image source={require("../assets/loadingapp.gif")}
                                    style={{borderWidth:1, justifyContent:'center', width:50, height:50, alignItems:'center', flex:0.2}}
                                    resizeMode="contain">
                                </Image>
                            </View>;
          }
          else{
            var load_more = [];
          }

        if(this.state.loader){
            arrays = [1,2,3,4,5]
            return (
                <ScrollView contentContainerStyle = {styles.container}>
                     <Ionicons
                        name="ios-mic"
                        size={35}
                        hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                        color={this.state.startAudio ? "red" : "black"}
                        style = {{
                            bottom: 50,
                            right: Dimensions.get("window").width / 2,
                            position: "absolute",
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.5,
                            zIndex: 2,
                            backgroundColor: "transparent"
                        }}
                        onPress={this.handleAudio}
                    />
                </ScrollView>
            )
        }
        return (
            <ScrollView contentContainerStyle = {styles.container}>
            <Ionicons
               name="ios-mic"
               size={35}
               hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
               color={this.state.startAudio ? "red" : "black"}
               style={{
                   bottom: 50,
                   right: Dimensions.get("window").width / 2,
                   position: "absolute",
                   shadowColor: "#000",
                   shadowOffset: { width: 0, height: 0 },
                   shadowOpacity: 0.5,
                   zIndex: 2,
                   backgroundColor: "transparent"
               }}
               onPress={this.handleAudio}
           />
           <KeyboardAvoidingView />
       </ScrollView>
            
        )
        
    }
}

//export default Dashboard



const styles = StyleSheet.create({
    container: {
       flexGrow: 1
      /**justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ebebeb',
      margin: 10,**/
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
      color: '#101010',
      fontSize: 24,
      fontWeight: 'bold'
    },
    linearGradient: {
        flex: 1,
        /**paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5**/
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
    }
    
});