import React , {Component} from 'react';
import { Animated, View, Alert, Modal, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, Text, Image } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { strings } from '../locals/i18n';
import commonStyle from '../assets/style/styles.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faCircleXmark, faHouse, faVolume } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../components/context';
import { RecyclerListView, DataProvider, LayoutProvider, ContextProvider  } from 'recyclerlistview';								 
import  Loader  from '../components/Loader.js';
import ImageViewer from 'react-native-image-zoom-viewer';
import Pdf from 'react-native-pdf';
import { TabActions } from '@react-navigation/native';
const {width, height} = Dimensions.get('window'); 


const SecondRoute = () => (
  <View style={[styles.container, { backgroundColor: '#673ab7' }]} />
);


const showFullAds = (item, type) =>{
  if(type == 1){
    Alert.alert(item.subject, item.notification_text, [
        {text: strings('main.ok')}
    ]);
  }else {
    return(<Pdf
      source={{uri: encodeURI('https://www.orimi.com/pdf-test.pdf') ,cache:true}}
      onLoadComplete={(numberOfPages,filePath)=>{
          //console.log(`number of pages: ${numberOfPages}`);
      }}
      onPageChanged={(page,numberOfPages)=>{
          //console.log(`current page: ${page}`);
      }}
      onError={(error)=>{
          //console.log(error);
      }}
      onPressLink={(uri)=>{
          //console.log(`Link presse: ${uri}`)
      }}
      style={styles.pdf}/>)
  }
    
}

export default class NotificationGeneral extends Component {
  state = {
    index: 0,
    modalImage: false,
    routes: [
      { key: 'first', modalImage: false, title: strings('main.car_notification'), icon: { faHouse }, fulldata: [], loader: true, img: [{url: 'https://i.imgur.com/deai02Y.jpg'}]},
      { key: 'second', modalImage: false, title: strings('main.announcments'), icon: { faVolume }, fulldata: [], loader: true, img: [{url: 'https://i.imgur.com/deai02Y.jpg'}]},
    ],
  };

  constructor(props){
    super(props);
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
                    <Text style={commonStyle.headerText}>{strings('main.notification')}</Text>
                  </View>
                  <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                    <TouchableOpacity>
                            <View>
                                <Text style={commonStyle.redgradientText}>{strings('main.clearall')}</Text>
                            </View>
                        </TouchableOpacity>
                  </View>
                </View>       
            </View>
      )
    });
}


componentDidMount() {
  this.getAnnouncements();
}


//showFullAds(item, type) 
 FirstRoute (data) {
  fulldata = data.route.fulldata;
  return (
  (fulldata && fulldata.length > 0)? fulldata.map((item,i) => {
    if (item.subject_ar) {
      type = 2; //image
    }else if (item.notification_text){
      type = 3; // pdf
    }else {
      type = 1; //text
    }//showFullAds(item,1)
    return (<Animated.View
                style = {[
                    styles.rowFront,
                    { height: height*0.12 },
                ]}>
                  <Modal visible={data.route.modalImage} transparent={true} style={{backgroundColor: 'red',
                      margin: 0, // This is the important style you need to set
                      alignItems: undefined,
                      justifyContent: undefined}}>
                        <ImageViewer imageUrls={data.route.img}
                            enableSwipeDown="true"
                            enablePreload= "true"
                            backgroundColor="#000"
                            renderHeader={(index) =>
                                <SafeAreaView>
                                  <View style={{flexDirection:'row', zIndex: 9999}}> 
                                      <TouchableOpacity style={{borderRadius:25,justifyContent:'center',
                                      alignItems:'center', width:50, height:50}}
                                      onPress={() => this._handleIndexPhoto}>
                                      <FontAwesomeIcon 
                                          icon={ faCircleXmark } size={25} color="#fff" />
                                      </TouchableOpacity>
                                  </View>
                                </SafeAreaView>
                            }
                      loadingRender = {() => <Loader loader={true}></Loader> }
                    />
                  </Modal>
                <TouchableOpacity activeOpacity={1} 
                onPress={() => this._handleNavigate}
                    style = {[
                        styles.rowFront,
                    ]}>
                    <View style={{ flexDirection: "row", flex: 1, backgroundColor:'#fff', borderTopRightRadius: 40,
                    borderBottomLeftRadius: 25,}}>
                        <View style={{flex:0.3, flexDirection: 'row'}}>
                            <Image
                                resizeMode={'contain'}
                                style={styles.tinyLogo}
                                source={require('../assets/commercial.png')}
                            />
                            <Image
                                style={{flexDirection:'row',height:'100%', resizeMode: 'contain'}}
                                source={require('../assets/_Path_.png')}
                            />
                        </View>
                        <View style={{flex: 0.7, padding: '1%'}}>
                            <View style={{ flexDirection: 'row', justifyContent:'space-around'}}>
                                <Text style={commonStyle.normalgreyTextHeader}>
                                    {item.subject}
                                </Text>
                            </View> 
                            <View
                                style={{ flexDirection: 'column', justifyContent:'center', alignItems:'center'}}>
                                <Text style={[commonStyle.normalgreybigText, {color:'#0d5db8', textAlign:'center', marginTop:'3%'}]}>
                                  {item.created_date}
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>)
      
    }):<View><Text>No data</Text></View>)
}


rowRenderer = (data) => {
  const {id, deleted, notification_text, notification_text_ar, opened, subject, subject_ar, create_date} = data;
  return (
    <Animated.View
        style = {[
            styles.rowFront,
            { height: height*0.12 },
        ]}>
        <TouchableOpacity activeOpacity={1}
            style = {[
                styles.rowFront,
            ]}>
            <View style={{ flexDirection: "row", flex: 1, backgroundColor:'#fff', borderTopRightRadius: 40,
            borderBottomLeftRadius: 25,}}>
                <View style={{flex:0.3, flexDirection: 'row'}}>
                    <Image
                        resizeMode={'contain'}
                        style={styles.tinyLogo}
                        source={require('../assets/commercial.png')}
                    />
                    <Image
                        style={{flexDirection:'row',height:'100%', resizeMode: 'contain'}}
                        source={require('../assets/_Path_.png')}
                    />
                </View>
                <View style={{flex: 0.7, padding: '1%'}}>
                    <View style={{ flexDirection: 'row', justifyContent:'space-around'}}>
                        <Text style={commonStyle.normalgreyTextHeader}>
                            {subject}
                        </Text>
                    </View> 
                    <View
                        style={{ flexDirection: 'column', justifyContent:'center', alignItems:'center'}}>
                        <Text style={[commonStyle.normalgreybigText, {color:'#0d5db8', textAlign:'center', marginTop:'3%'}]}>
                          {notification_text}
                        </Text>
                    </View>
                    <View
                        style={{ flexDirection: 'row', justifyContent:'flex-end', alignItems:'flex-end', paddingRight:'3%'}}>
                        <Text style={[commonStyle.normalgreysmallText]}>
                           {create_date}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
      </Animated.View>
  )
}


setLayout = () => {
  this.layoutProvider = new LayoutProvider((i) => {
          return this.state.list.getDataForIndex(i);
      }, (dim) => {
        dim.width  = SCREEN_WIDTH;
        dim.height = 100;
  })
}

getAnnouncements = (props) => {
  this.setState({
      loader: true,
  });
  const formData = new FormData();
  formData.append('client_id', '1230');
  formData.append('client_secret', '1230NEJOUM1230');
  formData.append('customer_id', AuthContext.id);
  var Url  = AuthContext.server_url + "/Nejoum_App/getAnnouncement";
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
        const fakeData = [];
        if(response.data.length > 0){
          response.data.forEach(instance => {
              if(fakeData.length == 0){
                  fakeData.push({
                    id                     : instance.id,
                    deleted                : instance.deleted,
                    notification_text      : instance.notification_text,
                    notification_text_ar   : instance.notification_text_ar,
                    opened                 : instance.opened,
                    subject                : instance.subject,
                    subject_ar             : instance.subject_ar,
                    created_date           : instance.created_date,
                  });
              }else if (fakeData.indexOf({ id: instance.id}) ==-1){
                  fakeData.push({
                    id                     : instance.id,
                    deleted                : instance.deleted,
                    notification_text      : instance.notification_text,
                    notification_text_ar   : instance.notification_text_ar,
                    opened                 : instance.opened,
                    subject                : instance.subject,
                    subject_ar             : instance.subject_ar,
                    created_date           : instance.created_date,
                  });
              }
          });
          this.setState ({
            list: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(fakeData),
          },this.setLayout()
          );
        }
        
        this.state.routes[0].fulldata = fakeData;
        this.state.routes[0].loader = false;
        this.setState({
            loader      : false,
            fulldata    : response.data,
            post_page   : response.data.length,
            total_posts : response.data.length
        });
        return;
      }
      else {
          this.setState({
              loader: false,
          });
          return;
      }
  })
  .catch((error) => {
    this.setState({
          loader: false,
      });
      Alert.alert('Error', error, [
          {text: 'Okay'}
      ]);
  });
}

  _handleIndexPhoto = (modalImage) => this.setState({ modalImage });

  _handleIndexChange = (index) => this.setState({ index });

  _handleNavigate = (props) => {
    this.props.navigation.goBack();
  }
  _renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex) =>
              inputIndex === i ? 1 : 0.5
            ),
          });

          return (
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => this.setState({ index: i })}>
              <Animated.Text style={{ opacity }}>{route.title} </Animated.Text>
              <FontAwesomeIcon 
                    icon={route.icon}
                    color="#000"
                    size={width*0.06}
                />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  _renderScene = SceneMap({
    first: this.FirstRoute,
    second: SecondRoute,
  });

  render() {
    if(this.state.routes[0].loader){
      return(
          <Loader loader={this.state.routes[0].loader}></Loader>
        );
    }
    return (
        <TabView
          navigation={this.props.navigation}
          navigationState={this.state}
          renderScene={this._renderScene}
          renderTabBar={this._renderTabBar}
          onIndexChange={this._handleIndexChange}
        />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: 20,
  },
  tabItem: {
    flex: 1,
    flexDirection:'row',
    alignItems: 'center',
    padding: 16,
  },
  tinyLogo: {
    width: '100%',
    height: '100%',
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20
},
rowFront: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height*0.12,
    width: '100%',
    margin:'1%'
},
});
