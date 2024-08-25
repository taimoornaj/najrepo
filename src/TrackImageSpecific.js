
import React , {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,Dimensions,
  ImageBackground,
  TextComponent,
  StatusBar
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-elements';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import { Left } from 'native-base';
import  Loader  from '../components/Loader.js';
import  ModalMsg  from '../components/ModalMsg.js';
import I18n from 'react-native-i18n';
import ImageViewer from 'react-native-image-zoom-viewer';

const {width, height} = Dimensions.get('window'); 
const images = [{
  // Simplest usage.
  url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',

  // width: number
  // height: number
  // Optional, if you know the image size, you can set the optimization performance

  // You can pass props to <Image />.
  props: {
      // headers: ...
  }
}, {
  url: '',
  props: {
      // Or you can set source directory.
      source: require('../background.png')
  }
}]

//function Dashboard () {
export default class TrackImageSpecific extends Component {

  constructor(props){
    super(props);
    this.state = {
        loader      : false,
        fulldata    : [],
        post_page   : 0,
        load_more   : false,
        arrays      : [],
        search      : '',
        modalmsg    : false,
        dataSource  : []
    }}

    componentDidMount() {
        this.getData();
    }

    getData = () => {
      this.setState({
          loader          : true,
          modalmsg: false
        });
      var start     = this.state.start;
      const formData = new FormData();
      formData.append('client_id', '1230');
      formData.append('client_secret', '1230NEJOUM1230');
      formData.append('customer_id', AuthContext.id);
      var Url  = AuthContext.server_url + "/Nejoum_App/newCarscount";
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
                  loader          : false,
                  new_cars        : response.data.count_cars,
                  towingCars      : response.data.towingCars,
                  warehouseCars   : response.data.warehouseCars,
                  loadingCars     : response.data.loadingCars,
                  shippingCars    : response.data.shippingCars,
                  uaePortCars     : response.data.uaePortCars,
                  storeCars       : response.data.storeCars,
                  post_page       : response.data.length    
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
              error_message    : 'Network Error',
              modalmsg: true,
              pageload: 'carTrack'
          });
      });  
  }

  render(){
    if(this.state.loader){
      <View style={styles.image}>
          <Loader loader={this.state.loader}></Loader>
      </View>
    }
    return (
      <Modal visible={true} transparent={true}>
          <ImageViewer imageUrls={images}/>
      </Modal>
  )
}
}